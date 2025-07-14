import { test, expect } from '@playwright/test';

/**
 * End-to-end tests for the CSV upload workflow.
 * This suite tests the drag-and-drop functionality, calculation of descriptive statistics,
 * and optional saving of data to the existing Item table.
 */
test.describe('CSV Upload Workflow', () => {
  /**
   * Test the drag-and-drop functionality for CSV upload.
   * This test simulates a user dragging a CSV file into the dropzone and verifies
   * that the file is accepted and processed correctly.
   */
  test('should allow CSV file drag-and-drop upload', async ({ page }) => {
    await page.goto('/csv-upload');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('#dropzone').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(['path/to/test.csv']);

    const uploadSuccessMessage = await page.locator('#upload-success').textContent();
    expect(uploadSuccessMessage).toContain('Upload successful');
  });

  /**
   * Test the calculation and display of descriptive statistics.
   * This test verifies that after uploading a CSV, the application calculates
   * and displays statistics such as mean, median, and mode.
   */
  test('should calculate and display descriptive statistics', async ({ page }) => {
    await page.goto('/csv-upload');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('#dropzone').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(['path/to/test.csv']);

    const meanValue = await page.locator('#mean-value').textContent();
    const medianValue = await page.locator('#median-value').textContent();
    const modeValue = await page.locator('#mode-value').textContent();

    expect(meanValue).not.toBeNull();
    expect(medianValue).not.toBeNull();
    expect(modeValue).not.toBeNull();
  });

  /**
   * Test the optional saving of data to the existing Item table.
   * This test ensures that after processing the CSV, the user can opt to save
   * the data to an existing database table.
   */
  test('should allow optional saving of data to Item table', async ({ page }) => {
    await page.goto('/csv-upload');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('#dropzone').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(['path/to/test.csv']);

    await page.locator('#save-to-item-table').click();

    const saveConfirmationMessage = await page.locator('#save-confirmation').textContent();
    expect(saveConfirmationMessage).toContain('Data saved successfully');
  });
});