import { test, expect } from '@playwright/test';

/**
 * End-to-end tests for the CSV upload workflow.
 * This suite tests the drag-and-drop functionality, descriptive statistics calculation,
 * and optional saving of data to the existing Item table.
 */
test.describe('CSV Upload Workflow', () => {
  /**
   * Test the drag-and-drop functionality for CSV upload.
   */
  test('should allow CSV file to be uploaded via drag-and-drop', async ({ page }) => {
    await page.goto('/csv-upload');

    // Simulate drag-and-drop of a CSV file
    const dataTransfer = await page.evaluateHandle(() => {
      const data = new DataTransfer();
      data.items.add(new File(['name,age\nJohn Doe,30'], 'test.csv', { type: 'text/csv' }));
      return data;
    });

    await page.dispatchEvent('#dropzone', 'drop', { dataTransfer });

    // Verify the file was uploaded
    const fileName = await page.textContent('#uploaded-file-name');
    expect(fileName).toBe('test.csv');
  });

  /**
   * Test calculation and display of descriptive statistics.
   */
  test('should calculate and display descriptive statistics', async ({ page }) => {
    await page.goto('/csv-upload');

    // Simulate drag-and-drop of a CSV file
    const dataTransfer = await page.evaluateHandle(() => {
      const data = new DataTransfer();
      data.items.add(new File(['name,age\nJohn Doe,30\nJane Doe,25'], 'test.csv', { type: 'text/csv' }));
      return data;
    });

    await page.dispatchEvent('#dropzone', 'drop', { dataTransfer });

    // Verify statistics are displayed
    const stats = await page.textContent('#statistics');
    expect(stats).toContain('Average Age: 27.5');
  });

  /**
   * Test optional saving of data to the existing Item table.
   */
  test('should allow saving data to the Item table', async ({ page }) => {
    await page.goto('/csv-upload');

    // Simulate drag-and-drop of a CSV file
    const dataTransfer = await page.evaluateHandle(() => {
      const data = new DataTransfer();
      data.items.add(new File(['name,age\nJohn Doe,30'], 'test.csv', { type: 'text/csv' }));
      return data;
    });

    await page.dispatchEvent('#dropzone', 'drop', { dataTransfer });

    // Click save button
    await page.click('#save-button');

    // Verify data was saved
    const notification = await page.textContent('#notification');
    expect(notification).toBe('Data saved successfully.');
  });
});
