import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useQuery } from 'react-query';
import { Bar, Line, Histogram } from 'react-chartjs-2';
import 'chart.js/auto';
import { fetchData, saveData } from '../api/dataService';
import { ErrorBoundary } from './ErrorBoundary';
import { TailwindCSS } from 'tailwindcss';

interface InsightsCardsProps {
  itemId?: string;
}

/**
 * InsightsCards component
 * 
 * This component displays KPI cards with data statistics and charts.
 * It supports drag-and-drop functionality to upload data files and
 * allows users to select chart types and columns for visualization.
 * Optionally, users can save data to an existing Item table.
 * 
 * @param {InsightsCardsProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const InsightsCards: React.FC<InsightsCardsProps> = ({ itemId }) => {
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'line' | 'histogram'>('bar');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const { data, error, isLoading } = useQuery('fetchData', fetchData);

  const onDrop = (acceptedFiles: File[]) => {
    // Handle file upload
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = reader.result;
        // Process file data
      };
      reader.onerror = () => {
        console.error('Error reading file:', reader.error);
      };
      reader.readAsText(file);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSaveData = async () => {
    try {
      await saveData(itemId, data);
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data.');
    }
  };

  const renderChart = () => {
    switch (selectedChartType) {
      case 'bar':
        return <Bar data={data} options={{ responsive: true }} />;
      case 'line':
        return <Line data={data} options={{ responsive: true }} />;
      case 'histogram':
        return <Histogram data={data} options={{ responsive: true }} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    // Effect to handle data fetching or processing
  }, [selectedColumns]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <ErrorBoundary>
      <div className="insights-cards">
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <div className="chart-selection">
          <label htmlFor="chartType">Select Chart Type:</label>
          <select
            id="chartType"
            value={selectedChartType}
            onChange={(e) => setSelectedChartType(e.target.value as 'bar' | 'line' | 'histogram')}
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="histogram">Histogram</option>
          </select>
        </div>
        <div className="chart-container">
          {renderChart()}
        </div>
        <button onClick={handleSaveData} className="save-button">
          Save Data
        </button>
      </div>
    </ErrorBoundary>
  );
};

export default InsightsCards;