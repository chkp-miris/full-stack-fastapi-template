import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTable, usePagination } from '@tanstack/react-table';
import { CSVReader } from 'react-papaparse';
import { useQuery } from '@tanstack/react-query';
import { Table, Column } from '@tanstack/react-table';
import { useMemo } from 'react';
import { calculateStatistics } from './utils';
import './CsvPreviewTable.css';

interface CsvPreviewTableProps {
  onSave: (data: any) => void;
}

const CsvPreviewTable: React.FC<CsvPreviewTableProps> = ({ onSave }) => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const text = event.target?.result as string;
      const parsedData = parseCSV(text);
      setCsvData(parsedData.data);
      setColumns(parsedData.columns);
    };

    reader.onerror = () => {
      console.error('Error reading file');
    };

    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const tableInstance = useTable({
    data: csvData,
    columns,
    initialState: { pageSize: 100 },
  }, usePagination);

  const { page, pageOptions, gotoPage, setPageSize } = tableInstance;

  const statistics = useMemo(() => calculateStatistics(csvData), [csvData]);

  return (
    <div className="csv-preview-table">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag 'n' drop a CSV file here, or click to select one</p>
      </div>
      <table>
        <thead>
          {columns.map(column => (
            <th key={column.id}>{column.Header}</th>
          ))}
        </thead>
        <tbody>
          {page.map(row => {
            tableInstance.prepareRow(row);
            return (
              <tr key={row.id}>
                {row.cells.map(cell => (
                  <td key={cell.id}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!tableInstance.canPreviousPage}>First</button>
        <button onClick={() => tableInstance.previousPage()} disabled={!tableInstance.canPreviousPage}>Previous</button>
        <button onClick={() => tableInstance.nextPage()} disabled={!tableInstance.canNextPage}>Next</button>
        <button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!tableInstance.canNextPage}>Last</button>
        <span>
          Page{' '}
          <strong>
            {tableInstance.state.pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <select
          value={tableInstance.state.pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
        >
          {[10, 20, 50, 100].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div className="statistics">
        <h3>Descriptive Statistics</h3>
        <pre>{JSON.stringify(statistics, null, 2)}</pre>
      </div>
      <button onClick={() => onSave(csvData)}>Save Data</button>
    </div>
  );
};

export default CsvPreviewTable;

function parseCSV(text: string): { data: any[], columns: Column[] } {
  // Implement CSV parsing logic here
  // Return parsed data and columns
  return { data: [], columns: [] };
}
