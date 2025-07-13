import React from 'react';
import { useQuery } from 'react-query';
import { fetchOverviewData } from '../api/overviewApi';
import { ErrorBoundary } from './ErrorBoundary';
import { Spinner } from './Spinner';

interface OverviewCardProps {
  title: string;
  value: string | number;
  description?: string;
}

/**
 * A functional component to display individual overview cards.
 * @param title - The title of the card.
 * @param value - The main value to display in the card.
 * @param description - Optional description for additional context.
 */
const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
};

/**
 * A functional component to display a collection of overview cards.
 * Fetches data using React Query and displays loading or error states as needed.
 */
const OverviewCards: React.FC = () => {
  const { data, isLoading, isError } = useQuery('overviewData', fetchOverviewData);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center">Failed to load overview data. Please try again later.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item: { id: string; title: string; value: string | number; description?: string }) => (
        <OverviewCard
          key={item.id}
          title={item.title}
          value={item.value}
          description={item.description}
        />
      ))}
    </div>
  );
};

/**
 * Wraps the OverviewCards component with an error boundary for robust error handling.
 */
const OverviewCardsWithBoundary: React.FC = () => {
  return (
    <ErrorBoundary>
      <OverviewCards />
    </ErrorBoundary>
  );
};

export default OverviewCardsWithBoundary;