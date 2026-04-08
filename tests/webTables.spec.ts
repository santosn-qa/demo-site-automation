import { expect, test } from '@playwright/test';
import testData from '../fixtures/testData.json';
import { WebTablesPage } from '../pages/webTables.page';

test.describe('Web Tables', () => {
  // Suite intent: prove we can edit an existing record and read back the table state.
  test('edits an existing record and saves updated data', async ({ page }) => {
    // Page Object Model: tests express intent; page classes handle selectors + UI mechanics.
    const webTablesPage = new WebTablesPage(page);
    const editRecord = testData.webTables.editRecord;

    // Arrange
    await webTablesPage.navigate('/webtables');

    // Act
    const updatedRow = await webTablesPage.updateRecord(editRecord.rowIndex, editRecord.data);

    // Assert
    expect(updatedRow).toEqual(editRecord.data);
  });
});
