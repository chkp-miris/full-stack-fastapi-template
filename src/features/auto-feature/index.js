import React from 'react';
import { useQuery } from 'react-query';
import { fetchData } from '../../utils/api';

/**
 * AutoFeature Component
 *
 * This component is responsible for displaying data fetched from an API.
 * It uses React Query for data fetching and caching.
 *
 * @returns {JSX.Element} The rendered component
 */
const AutoFeature = () => {
  // Fetch data using React Query
  const { data, error, isLoading } = useQuery('autoFeatureData', fetchData);

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    console.error('Error fetching data:', error);
    return <div>Error loading data. Please try again later.</div>;
  }

  // Render fetched data
  return (
    <div className="auto-feature">
      <h1>Auto Feature Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default AutoFeature;