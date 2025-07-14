import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'react-query';
import { saveDataToItemTable } from '../api'; // Assume this is an API function to save data
import { calculateStatistics } from '../utils'; // Assume this is a utility function to calculate statistics
import { useNavigate } from 'react-router-dom';

interface ImportPageProps {}

/**
 * ImportPage component allows users to import CSV files via drag-and-drop.
 * It calculates descriptive statistics and optionally saves data to an existing Item table.
 */
const ImportPage: React.FC<ImportPageProps> = () => {
  const [csvData, setCsvData] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<Record<string, any> | null>(null);
  const [saveToggle, setSaveToggle] = useState<boolean>(false);
  const navigate = useNavigate();

  // Mutation for saving data
  const mutation = useMutation(saveDataToItemTable, {
    onSuccess: () => {
      alert('Data saved successfully');
    },
    onError: (error) => {
      console.error('Error saving data:', error);
      alert('Failed to save data');
    },
  });

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const text = event.target?.result as string;
      setCsvData(text);
      const stats = calculateStatistics(text);
      setStatistics(stats);
    };

    reader.onerror = () => {
      console.error('Error reading file');
      alert('Failed to read file');
    };

    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.csv',
  });

  const handleSaveToggle = () => {
    setSaveToggle((prev) => !prev);
  };

  const handleSaveData = () => {
    if (csvData) {
      mutation.mutate(csvData);
    } else {
      alert('No data to save');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Import CSV</h1>
      <div {...getRootProps()} className="border-2 border-dashed p-6 mb-4">
        <input {...getInputProps()} />
        <p>Drag and drop a CSV file here, or click to select</p>
      </div>
      {statistics && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Statistics</h2>
          <pre>{JSON.stringify(statistics, null, 2)}</pre>
        </div>
      )}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={saveToggle}
          onChange={handleSaveToggle}
          className="mr-2"
        />
        <label>Save data to Item table</label>
      </div>
      <button
        onClick={handleSaveData}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Data
      </button>
    </div>
  );
};

export default ImportPage;