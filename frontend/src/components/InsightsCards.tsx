import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useQuery } from 'react-query';
import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { saveAs } from 'file-saver';
import { fetchData, saveData } from '../api';
import { calculateStatistics } from '../utils/statistics';
import { ErrorBoundary } from './ErrorBoundary';
import './InsightsCards.css'; // Assuming Tailwind CSS is used

interface InsightsCardsProps {
  itemId?: string;
}

/**
 * InsightsCards component provides a UI for displaying data insights
 * through various charts and statistics. It supports drag-and-drop
 * CSV file upload, data visualization, and optional data saving.
 */
const InsightsCards: React.FC<InsightsCardsProps> = ({ itemId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [columns, setColumns] = useState<string[]>([]);

  // Fetch data using React Query
  const { data, error, isLoading } = useQuery('fetchData', () => fetchData(itemId), {
    enabled: !!itemId,
  });

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.csv',
  });

  // Handle data saving
  const handleSaveData = async () => {
    if (data) {
      try {
        await saveData(data);
        alert('Data saved successfully!');
      } catch (err) {
        console.error('Error saving data:', err);
        alert('Failed to save data.');
      }
    }
  };

  // Render chart based on selected type
  const renderChart = () => {
    if (!data) return null;
    const chartData = {
      labels: columns,
      datasets: [
        {
          label: 'Dataset 1',
          data: columns.map(column => data[column]),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    switch (chartType) {
      case 'bar':
        return <Bar data={chartData} />;
      case 'line':
        return <Line data={chartData} />;
      case 'pie':
        return <Pie data={chartData} />;
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="insights-cards">
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag 'n' drop a CSV file here, or click to select one</p>
        </div>
        {isLoading && <p>Loading data...</p>}
        {error && <p>Error loading data: {error.message}</p>}
        {data && (
          <div>
            <div className="chart-controls">
              <select value={chartType} onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'pie')}>
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
              <button onClick={handleSaveData}>Save Data</button>
            </div>
            {renderChart()}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default InsightsCards;