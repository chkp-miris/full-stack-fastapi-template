import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { BarChart, LineChart, Histogram } from 'recharts';
import { useQuery } from 'react-query';
import { fetchData } from '../api/dataApi';
import { calculateStatistics } from '../utils/statistics';
import { saveDataToItemTable } from '../api/itemApi';
import './QuickChartPanel.css';

interface QuickChartPanelProps {
  onSaveToggle: (isSaving: boolean) => void;
}

/**
 * QuickChartPanel component allows users to upload CSV files, select chart types, and visualize data.
 * It supports drag-and-drop functionality for file uploads and provides options to save data.
 */
const QuickChartPanel: React.FC<QuickChartPanelProps> = ({ onSaveToggle }) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'histogram'>('bar');
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target?.result;
      if (typeof csvData === 'string') {
        const parsedData = parseCsv(csvData);
        setData(parsedData);
        setColumns(Object.keys(parsedData[0]));
      }
    };
    reader.readAsText(file);
  }, []);

  const { data: fetchedData, error } = useQuery('fetchData', fetchData);

  const handleSaveToggle = () => {
    setIsSaving(!isSaving);
    onSaveToggle(!isSaving);
    if (!isSaving) {
      saveDataToItemTable(data);
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <BarChart data={data} />;
      case 'line':
        return <LineChart data={data} />;
      case 'histogram':
        return <Histogram data={data} />;
      default:
        return null;
    }
  };

  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <div className="quick-chart-panel">
      <div {...useDropzone({ onDrop })} className="dropzone">
        Drag and drop a CSV file here
      </div>
      <div className="chart-type-selector">
        <label>
          Select Chart Type:
          <select value={chartType} onChange={(e) => setChartType(e.target.value as 'bar' | 'line' | 'histogram')}>
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="histogram">Histogram</option>
          </select>
        </label>
      </div>
      <div className="chart-container">
        {renderChart()}
      </div>
      <button onClick={handleSaveToggle} className="save-toggle">
        {isSaving ? 'Stop Saving' : 'Start Saving'}
      </button>
    </div>
  );
};

/**
 * Parses CSV data into a JSON format.
 * @param csvData - The CSV data as a string.
 * @returns Parsed data as an array of objects.
 */
function parseCsv(csvData: string): any[] {
  // Implement CSV parsing logic here
  return [];
}

export default QuickChartPanel;