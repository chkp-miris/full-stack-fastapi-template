import React from 'react';
import { useQuery } from 'react-query';
import { fetchAnalyticsData } from '../api/analyticsApi';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalyticsChart from '../components/AnalyticsChart';

/**
 * AnalyticsDashboardPage Component
 * 
 * This component serves as the main dashboard for displaying analytics data.
 * It fetches data using React Query, handles loading and error states, and displays
 * the data in a chart format.
 */
const AnalyticsDashboardPage: React.FC = () => {
  // Fetch analytics data using React Query
  const { data, error, isLoading } = useQuery('analyticsData', fetchAnalyticsData);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">An error occurred while fetching analytics data.</p>
      </div>
    );
  }

  // Render analytics data
  return (
    <ErrorBoundary>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
        <AnalyticsChart data={data} />
      </div>
    </ErrorBoundary>
  );
};

export default AnalyticsDashboardPage;