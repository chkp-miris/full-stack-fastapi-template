import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { BarChart, LineChart, Histogram } from 'recharts';
import { useQuery } from 'react-query';
import { fetchChartData, saveDataToTable } from '../api';
import { calculateStatistics } from '../utils/statistics';
import { ChartTypeSelector } from './ChartTypeSelector';
import { ColumnSelector } from './ColumnSelector';
import { SaveToggle } from './SaveToggle';
import { UploadCSV } from './UploadCSV';
import { GetInsights } from './GetInsights';
import { SaveRows } from './SaveRows';
import { ImportRoute } from './ImportRoute';

interface QuickChartPanelProps {
  initialData?: any[];
}

/**
 * QuickChartPanel component allows users to upload CSV files, select chart types and columns,
 * and generate dynamic charts using Recharts. It also provides options to save data to an existing table.
 */
const QuickChartPanel: React.FC<QuickChartPanelProps> = ({ initialData = [] }) => {
  const [data, setData] = useState<any[]>(initialData);
  const [chartType, setChartType] = useState<string>('bar');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [saveData, setSaveData] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle file upload and parse CSV
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result;
        // Parse CSV and update state
        // Assume parseCSV is a utility function to parse CSV data
        const parsedData = parseCSV(csvData);
        setData(parsedData);
      };
      reader.onerror = () => {
        console.error('File reading has failed');
      };
      reader.readAsText(file);
    });
  }, []);

  const { data: chartData, error } = useQuery(['chartData', data], () => fetchChartData(data), {
    enabled: data.length > 0,
  });

  const handleSaveData = () => {
    if (saveData) {
      saveDataToTable(data).catch((err) => console.error('Error saving data:', err));
    }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <BarChart data={chartData} />;
      case 'line':
        return <LineChart data={chartData} />;
      case 'histogram':
        return <Histogram data={chartData} />;
      default:
        return null;
    }
  };

  return (
    <div className="quick-chart-panel">
      <UploadCSV onDrop={onDrop} />
      <ChartTypeSelector chartType={chartType} setChartType={setChartType} />
      <ColumnSelector columns={Object.keys(data[0] || {})} selectedColumns={selectedColumns} setSelectedColumns={setSelectedColumns} />
      <SaveToggle saveData={saveData} setSaveData={setSaveData} />
      <GetInsights data={data} />
      <SaveRows data={data} onSave={handleSaveData} />
      <ImportRoute />
      {error ? <div className="error">Error loading chart data</div> : renderChart()}
    </div>
  );
};

export default QuickChartPanel;