import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { Table } from '@tanstack/react-table';
import { parse } from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { saveDataToTable, calculateStatistics } from '../api';
import { Button } from '../components/Button';

interface CsvDropzoneProps {
  onSaveToggle: (save: boolean) => void;
}

/**
 * CsvDropzone component allows users to upload CSV files via drag-and-drop.
 * It parses the CSV, calculates statistics, and optionally saves data to a table.
 */
const CsvDropzone: React.FC<CsvDropzoneProps> = ({ onSaveToggle }) => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<Record<string, any>>({});
  const [saveToggle, setSaveToggle] = useState<boolean>(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const text = reader.result as string;
        const parsedData = parse(text, { header: true }).data;
        setCsvData(parsedData);
        const stats = calculateStatistics(parsedData);
        setStatistics(stats);
      };
      reader.readAsText(file);
    });
  }, []);

  const { mutate: saveRows } = useMutation(saveDataToTable, {
    onSuccess: () => {
      console.log('Data saved successfully');
      navigate('/import');
    },
    onError: (error) => {
      console.error('Error saving data:', error);
    },
  });

  const handleSaveToggle = () => {
    setSaveToggle(!saveToggle);
    onSaveToggle(saveToggle);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="p-4 border-dashed border-2 border-gray-400" {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
      <Button onClick={handleSaveToggle}>
        {saveToggle ? 'Disable Save' : 'Enable Save'}
      </Button>
      {csvData.length > 0 && (
        <div>
          <h3>CSV Data Preview</h3>
          <Table data={csvData} columns={Object.keys(csvData[0]).map(key => ({ accessor: key, Header: key }))} />
          <h3>Statistics</h3>
          <pre>{JSON.stringify(statistics, null, 2)}</pre>
          {saveToggle && <Button onClick={() => saveRows(csvData)}>Save Data</Button>}
        </div>
      )}
    </div>
  );
};

export default CsvDropzone;