import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { Table } from '@tanstack/react-table';
import { parse } from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface CsvDropzoneProps {
  onSave: (data: any[]) => void;
}

/**
 * CsvDropzone component allows users to drag-and-drop CSV files for upload.
 * It parses the CSV file and calculates descriptive statistics.
 * Users can optionally save the data to an existing Item table.
 */
const CsvDropzone: React.FC<CsvDropzoneProps> = ({ onSave }) => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => toast.error('File reading was aborted');
      reader.onerror = () => toast.error('File reading has failed');
      reader.onload = () => {
        const text = reader.result as string;
        const parsedData = parse(text, { header: true });
        if (parsedData.errors.length) {
          toast.error('Error parsing CSV file');
        } else {
          setCsvData(parsedData.data);
        }
      };

      reader.readAsText(file);
    });
  }, []);

  const { mutate: saveData } = useMutation(
    (data: any[]) => fetch('/api_v1/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }),
    {
      onSuccess: () => {
        toast.success('Data saved successfully');
        navigate('/items');
      },
      onError: () => {
        toast.error('Failed to save data');
      },
    }
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="p-4 border-dashed border-2 border-gray-300 rounded-md" {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop a CSV file here, or click to select one</p>
      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        onClick={() => saveData(csvData)}
      >
        Save Data
      </button>
    </div>
  );
};

export default CsvDropzone;