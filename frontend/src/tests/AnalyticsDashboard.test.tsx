import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

/**
 * Test suite for the AnalyticsDashboard component.
 * Ensures that the component renders correctly and handles data fetching and error states properly.
 */
describe('AnalyticsDashboard Component', () => {
    const queryClient = new QueryClient();

    /**
     * Utility function to render the AnalyticsDashboard component within a QueryClientProvider.
     */
    const renderComponent = () => {
        render(
            <QueryClientProvider client={queryClient}>
                <AnalyticsDashboard />
            </QueryClientProvider>
        );
    };

    test('renders loading state initially', () => {
        renderComponent();
        // Assert that the loading indicator is displayed
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test('renders data correctly when fetched successfully', async () => {
        renderComponent();

        // Wait for the data to be displayed
        await waitFor(() => {
            expect(screen.getByText(/dashboard data/i)).toBeInTheDocument();
        });
    });

    test('renders error message on data fetch failure', async () => {
        // Mock the query client to simulate an error state
        queryClient.setQueryDefaults('analyticsData', {
            queryFn: async () => {
                throw new Error('Failed to fetch data');
            },
        });

        renderComponent();

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/failed to fetch data/i)).toBeInTheDocument();
        });
    });
});