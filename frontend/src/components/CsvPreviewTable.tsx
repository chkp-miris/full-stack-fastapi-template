import React, { useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTable, usePagination } from '@tanstack/react-table';
import { CSVReader } from 'react-papaparse';
import { useQuery } from '@tanstack/react-query';
import { calculateStatistics } from './utils/statistics';
import './CsvPreviewTable.css';

interface CsvPreviewTableProps {
  onSave: (data: any[]) => void;
}

const CsvPreviewTable: React.FC<CsvPreviewTableProps> = ({ onSave }) => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [columnTypes, setColumnTypes] = useState<Record<string, string>>({});
  const [missingValues, setMissingValues] = useState<Record<string, number>>({});

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.csv',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const parsedData = CSVReader.parse(text, { header: true });
        setCsvData(parsedData.data);
        const stats = calculateStatistics(parsedData.data);
        setColumnTypes(stats.columnTypes);
        setMissingValues(stats.missingValues);
      };
      reader.readAsText(file);
    },
  });

  const columns = useMemo(() => csvData[0] ? Object.keys(csvData[0]).map(key => ({
    Header: key,
    accessor: key,
  })) : [], [csvData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({
    columns,
    data: csvData,
    initialState: { pageIndex: 0 },
  }, usePagination);

  return (
    <div className="csv-preview-table">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag 'n' drop a CSV file here, or click to select one</p>
      </div>
      <table {...getTableProps()} className="table-auto">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <button onClick={() => onSave(csvData)} className="save-button">
        Save Data
      </button>
    </div>
  );
};

export default CsvPreviewTable;