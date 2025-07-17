import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useQuery } from 'react-query';
import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { saveAs } from 'file-saver';
import { fetchData, saveData } from '../api/dataService';
import { calculateStatistics } from '../utils/statistics';
import { TailwindCSS } from 'tailwindcss';

interface InsightsCardProps {
  title: string;
  dataKey: string;
}

/**
 * InsightsCards component displays KPI cards with data statistics and charts.
 * It supports drag-and-drop functionality for data upload and allows users to select chart types.
 *
 * @component
 * @example
 * return (
 *   <InsightsCards title="Sales Data" dataKey="sales" />
 * )
 */
const InsightsCards: React.FC<InsightsCardProps> = ({ title, dataKey }) => {
  const [data, setData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<string>('bar');
  const [statistics, setStatistics] = useState<any>({});

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        const csvData = reader.result;
        // Assuming CSV parsing logic is implemented here
        const parsedData = parseCSVData(csvData);
        setData(parsedData);
        setStatistics(calculateStatistics(parsedData));
      };
      reader.readAsText(file);
    },
  });

  const { data: fetchedData, error, isLoading } = useQuery(['fetchData', dataKey], () => fetchData(dataKey), {
    onSuccess: (data) => {
      setData(data);
      setStatistics(calculateStatistics(data));
    },
  });

  const handleSave = () => {
    saveData(dataKey, data).then(() => {
      alert('Data saved successfully!');
    }).catch((error) => {
      console.error('Error saving data:', error);
      alert('Failed to save data.');
    });
  };

  const handleChartTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setChartType(event.target.value);
  };

  const renderChart = () => {
    const chartData = {
      labels: data.map(item => item.label),
      datasets: [{
        label: title,
        data: data.map(item => item.value),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }],
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div {...getRootProps()} className="border-dashed border-2 border-gray-300 p-4 mb-4">
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <div className="mb-4">
        <label htmlFor="chartType" className="block text-sm font-medium text-gray-700">Select Chart Type:</label>
        <select id="chartType" name="chartType" value={chartType} onChange={handleChartTypeChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
        </select>
      </div>
      <div className="mb-4">
        {renderChart()}
      </div>
      <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Save Data
      </button>
    </div>
  );
};

export default InsightsCards;