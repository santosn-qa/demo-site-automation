import { expect, test } from '@playwright/test';
import testData from '../fixtures/testData.json';
import { WebTablesPage } from '../pages/webTables.page';

test.describe('Web Tables', () => {
  test('edits an existing record and saves updated data', async ({ page }) => {
    const webTablesPage = new WebTablesPage(page);
    const editRecord = testData.webTables.editRecord;

    // Arrange
    await webTablesPage.navigate('/webtables');

    // Act
    await webTablesPage.editRow(editRecord.rowIndex, editRecord.data);
    await webTablesPage.submitForm();
    const updatedRow = await webTablesPage.getRowData(editRecord.rowIndex);

    // Assert
    expect(updatedRow).toEqual(editRecord.data);
  });
});
