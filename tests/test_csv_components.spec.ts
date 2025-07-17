import { test, expect } from '@playwright/test';

/**
 * End-to-end tests for the CSV upload workflow.
 * This suite tests the drag-and-drop functionality, descriptive statistics calculation,
 * and optional saving of data to an existing Item table.
 */
test.describe('CSV Upload Workflow', () => {
  /**
   * Test the drag-and-drop functionality for CSV upload.
   * Ensures that a CSV file can be uploaded via drag-and-drop and processed correctly.
   */
  test('should allow CSV file upload via drag-and-drop', async ({ page }) => {
    await page.goto('/csv-upload');

    // Simulate drag-and-drop of a CSV file
    const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
    await page.setInputFiles('input[type="file"]', {
      name: 'test.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('column1,column2\nvalue1,value2')
    });

    await page.dispatchEvent('input[type="file"]', 'drop', { dataTransfer });

    // Verify that the file was uploaded and processed
    await expect(page.locator('.upload-success')).toHaveText('Upload successful');
  });

  /**
   * Test the calculation and display of descriptive statistics from the uploaded CSV.
   * Ensures that statistics are correctly calculated and displayed on the UI.
   */
  test('should calculate and display descriptive statistics', async ({ page }) => {
    await page.goto('/csv-upload');

    // Simulate drag-and-drop of a CSV file
    const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
    await page.setInputFiles('input[type="file"]', {
      name: 'test.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('column1,column2\n1,2\n3,4')
    });

    await page.dispatchEvent('input[type="file"]', 'drop', { dataTransfer });

    // Verify that statistics are displayed
    await expect(page.locator('.statistics')).toContainText('Mean: 2.5');
    await expect(page.locator('.statistics')).toContainText('Sum: 10');
  });

  /**
   * Test the optional saving of data to an existing Item table.
   * Ensures that the user can choose to save the uploaded data.
   */
  test('should allow optional saving of data to Item table', async ({ page }) => {
    await page.goto('/csv-upload');

    // Simulate drag-and-drop of a CSV file
    const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
    await page.setInputFiles('input[type="file"]', {
      name: 'test.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('column1,column2\nvalue1,value2')
    });

    await page.dispatchEvent('input[type="file"]', 'drop', { dataTransfer });

    // Click the save button
    await page.click('button#save');

    // Verify that the data was saved
    await expect(page.locator('.save-success')).toHaveText('Data saved successfully');
  });
});