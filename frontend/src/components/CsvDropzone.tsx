import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { Table } from '@tanstack/react-table';
import { parse } from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface CsvDropzoneProps {
  onSaveToggle: (data: any) => void;
}

/**
 * CsvDropzone component allows users to drag and drop CSV files for processing.
 * It parses the CSV data, calculates descriptive statistics, and optionally saves the data.
 *
 * @param {CsvDropzoneProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered component.
 */
const CsvDropzone: React.FC<CsvDropzoneProps> = ({ onSaveToggle }) => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => toast.error('File reading was aborted');
      reader.onerror = () => toast.error('File reading has failed');
      reader.onload = () => {
        const text = reader.result as string;
        const parsedData = parse(text, { header: true }).data;
        setCsvData(parsedData);
        toast.success('File successfully uploaded');
      };

      reader.readAsText(file);
    });
  }, []);

  const mutation = useMutation(
    (data: any) => {
      // Replace with actual API call
      return fetch('/api_v1/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    },
    {
      onSuccess: () => {
        toast.success('Data successfully saved');
        navigate('/');
      },
      onError: () => {
        toast.error('Failed to save data');
      },
    }
  );

  const handleSaveToggle = () => {
    mutation.mutate(csvData);
    onSaveToggle(csvData);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.csv',
  });

  return (
    <div {...getRootProps()} className="border-dashed border-2 border-gray-400 p-6 rounded-md">
      <input {...getInputProps()} />
      <p>Drag 'n' drop a CSV file here, or click to select one</p>
      <button
        type="button"
        onClick={handleSaveToggle}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Save Data
      </button>
    </div>
  );
};

export default CsvDropzone;