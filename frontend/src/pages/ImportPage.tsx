import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { calculateStatistics } from '../utils/csvUtils';
import { saveDataToItemTable } from '../api/itemApi';

interface ImportPageProps {}

/**
 * ImportPage component allows users to import CSV files, view descriptive statistics,
 * and optionally save the data to an existing Item table.
 * 
 * Features:
 * - Drag-and-drop CSV file upload
 * - Display of descriptive statistics
 * - Option to save data to Item table
 */
const ImportPage: React.FC<ImportPageProps> = () => {
  const [csvData, setCsvData] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<Record<string, any> | null>(null);
  const [saveToggle, setSaveToggle] = useState<boolean>(false);
  const navigate = useNavigate();

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
      alert('Failed to read file. Please try again.');
    };

    reader.readAsText(file);
  }, []);

  const { mutate: saveData, isLoading, isError } = useMutation(saveDataToItemTable, {
    onSuccess: () => {
      alert('Data saved successfully!');
    },
    onError: () => {
      alert('Failed to save data. Please try again later.');
    }
  });

  const handleSaveToggle = () => {
    setSaveToggle(!saveToggle);
  };

  const handleSaveData = () => {
    if (csvData) {
      saveData(csvData);
    } else {
      alert('No data to save. Please upload a CSV file first.');
    }
  };

  return (
    <div className="import-page">
      <h1>Import CSV</h1>
      <div className="dropzone">
        <useDropzone onDrop={onDrop} />
      </div>
      {statistics && (
        <div className="statistics">
          <h2>Descriptive Statistics</h2>
          <pre>{JSON.stringify(statistics, null, 2)}</pre>
        </div>
      )}
      <div className="save-toggle">
        <label>
          <input type="checkbox" checked={saveToggle} onChange={handleSaveToggle} /> Save to Item Table
        </label>
      </div>
      <button onClick={handleSaveData} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Data'}
      </button>
      {isError && <p className="error">An error occurred while saving data.</p>}
    </div>
  );
};

export default ImportPage;