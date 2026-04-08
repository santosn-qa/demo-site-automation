import { expect, test } from '@playwright/test';
import testData from '../fixtures/testData.json';
import { WidgetsPage } from '../pages/widgets.page';

test.describe('Select Menu Widget', () => {
  test('selects values from standard, custom and multi select controls', async ({ page }) => {
    const widgetsPage = new WidgetsPage(page);

    // Arrange
    await widgetsPage.navigate('/select-menu');

    // Act
    await widgetsPage.selectStandardDropdown(testData.widgets.standardDropdown);
    await widgetsPage.selectCustomDropdown(testData.widgets.customDropdown);
    await widgetsPage.selectMultiValues(testData.widgets.multiValues);

    const standardValue = await widgetsPage.getStandardDropdownValue();
    const customValue = await widgetsPage.getCustomDropdownValue();
    const multiValuesText = await widgetsPage.getMultiValuesText();

    // Assert
    expect(standardValue).toBe(testData.widgets.standardDropdown);
    expect(customValue).toContain(testData.widgets.customDropdown);

    for (const value of testData.widgets.multiValues) {
      expect(multiValuesText).toContain(value);
    }
  });
});
