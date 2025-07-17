import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { saveDataToItemTable, getInsightsFromCSV } from '../api';
import { CSVReader } from 'react-papaparse';
import { toast } from 'react-toastify';

/**
 * ImportPage component
 * 
 * This component provides functionality to import CSV files, calculate descriptive statistics,
 * and optionally save data to an existing Item table. It includes drag-and-drop functionality
 * using react-dropzone and integrates with the backend API.
 */
const ImportPage: React.FC = () => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [saveToggle, setSaveToggle] = useState<boolean>(false);
  const navigate = useNavigate();

  // Mutation for saving data
  const saveMutation = useMutation(saveDataToItemTable, {
    onSuccess: () => {
      toast.success('Data saved successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to save data: ${error.message}`);
    },
  });

  // Function to handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => toast.error('File reading was aborted');
      reader.onerror = () => toast.error('File reading has failed');
      reader.onload = () => {
        const binaryStr = reader.result;
        if (typeof binaryStr === 'string') {
          // Parse CSV data
          const parsedData = CSVReader.parse(binaryStr);
          setCsvData(parsedData.data);
          toast.success('CSV file loaded successfully!');
        }
      };

      reader.readAsBinaryString(file);
    });
  }, []);

  // Function to get insights from CSV data
  const handleGetInsights = async () => {
    try {
      const insights = await getInsightsFromCSV(csvData);
      toast.success('Insights calculated successfully!');
      console.log(insights);
    } catch (error) {
      toast.error(`Failed to calculate insights: ${error.message}`);
    }
  };

  // Function to save rows
  const handleSaveRows = () => {
    if (saveToggle) {
      saveMutation.mutate(csvData);
    } else {
      toast.info('Save toggle is off. Data will not be saved.');
    }
  };

  return (
    <div className="import-page">
      <h1 className="text-xl font-bold">Import CSV</h1>
      <div className="dropzone">
        <useDropzone onDrop={onDrop} />
      </div>
      <button onClick={handleGetInsights} className="btn btn-primary">
        Get Insights
      </button>
      <div className="save-toggle">
        <label>
          <input
            type="checkbox"
            checked={saveToggle}
            onChange={() => setSaveToggle(!saveToggle)}
          />
          Save to Item Table
        </label>
      </div>
      <button onClick={handleSaveRows} className="btn btn-secondary">
        Save Rows
      </button>
    </div>
  );
};

export default ImportPage;