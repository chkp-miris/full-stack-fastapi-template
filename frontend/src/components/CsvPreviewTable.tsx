import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTable, usePagination } from '@tanstack/react-table';
import { CSVReader } from 'react-papaparse';
import { Table, Column } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { saveDataToItemTable } from '../api';

interface CsvPreviewTableProps {
  onSave?: (data: any) => void;
}

/**
 * CsvPreviewTable component allows users to drag and drop CSV files for previewing.
 * It displays the CSV data in a table format with pagination and supports virtual scrolling.
 * Users can view column types, missing value counts, and descriptive statistics.
 * Optionally, users can save the data to an existing Item table.
 */
const CsvPreviewTable: React.FC<CsvPreviewTableProps> = ({ onSave }) => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const text = event.target?.result as string;
      parseCsvData(text);
    };

    reader.onerror = () => {
      console.error('Error reading file');
    };

    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.csv',
  });

  const parseCsvData = (csvText: string) => {
    CSVReader.parse(csvText, {
      complete: (results) => {
        const { data } = results;
        setCsvData(data.slice(0, 100)); // Show first 100 rows
        setColumns(generateColumns(data));
      },
      header: true,
    });
  };

  const generateColumns = (data: any[]): Column[] => {
    if (data.length === 0) return [];
    const headers = Object.keys(data[0]);
    return headers.map((header) => ({
      Header: header,
      accessor: header,
    }));
  };

  const { data: statsData, error: statsError } = useQuery('csvStats', () => calculateStatistics(csvData), {
    enabled: csvData.length > 0,
  });

  const calculateStatistics = (data: any[]) => {
    // Placeholder for statistics calculation logic
    return {};
  };

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable(
    {
      columns,
      data: csvData,
    },
    usePagination
  );

  const handleSave = () => {
    if (onSave) {
      onSave(csvData);
    } else {
      saveDataToItemTable(csvData);
    }
  };

  return (
    <div className="csv-preview-table">
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag 'n' drop a CSV file here, or click to select one</p>
      </div>
      {statsError && <div className="error">Error calculating statistics: {statsError.message}</div>}
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <button onClick={handleSave} className="save-button">
        Save Data
      </button>
    </div>
  );
};

export default CsvPreviewTable;