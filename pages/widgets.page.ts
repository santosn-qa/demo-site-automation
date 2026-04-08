import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Page object for DemoQA's Select Menu widget.
 *
 * This page is useful as a small "control zoo":
 * - a native <select> (Old Style Select Menu)
 * - a react-select single select (Select One)
 * - a react-select multi select (Multiselect drop down)
 *
 * Approach:
 * - Use Playwright's native select support for <select>.
 * - For react-select, focus the container/input, type the label, then press Enter.
 *   This mirrors a real user interaction and avoids brittle DOM-specific option selectors.
 */
export class WidgetsPage extends BasePage {
  private readonly standardDropdown: Locator;
  private readonly customContainer: Locator;
  private readonly customInput: Locator;
  private readonly customValueContainer: Locator;
  private readonly multiSelectInput: Locator;
  private readonly multiValueContainer: Locator;

  constructor(page: Page) {
    super(page);
    // Old Style Select Menu (native <select>)
    this.standardDropdown = this.page.locator('#oldSelectMenu');

    // Select One (react-select)
    this.customContainer = this.page.locator('#selectOne');
    this.customInput = this.page.locator('#react-select-3-input');
    this.customValueContainer = this.page.locator('#selectOne');

    // The multi select doesn't have a clean unique id on the input, so we anchor
    // to the row label text and then search within that section.
    const multiSelectRow = this.page.getByText('Multiselect drop down').locator('..').locator('..');
    this.multiSelectInput = multiSelectRow.locator('input[role="combobox"]');
    this.multiValueContainer = multiSelectRow;
  }

  async selectStandardDropdown(value: string): Promise<void> {
    await this.standardDropdown.selectOption({ label: value });
  }

  async selectCustomDropdown(value: string): Promise<void> {
    await this.click(this.customContainer);
    await this.fill(this.customInput, value);
    // react-select commits the highlighted match on Enter.
    await this.customInput.press('Enter');
  }

  async selectMultiValues(values: string[]): Promise<void> {
    for (const value of values) {
      await this.click(this.multiSelectInput);
      await this.fill(this.multiSelectInput, value);
      await this.multiSelectInput.press('Enter');
    }
  }

  async configureSelectMenu(options: {
    standard: string;
    custom: string;
    multi: string[];
  }): Promise<void> {
    await this.selectStandardDropdown(options.standard);
    await this.selectCustomDropdown(options.custom);
    await this.selectMultiValues(options.multi);
  }

  async getStandardDropdownValue(): Promise<string> {
    return this.standardDropdown.locator('option:checked').textContent().then((t) => t?.trim() ?? '');
  }

  async getCustomDropdownValue(): Promise<string> {
    return this.getText(this.customValueContainer);
  }

  async getMultiValuesText(): Promise<string> {
    return this.getText(this.multiValueContainer);
  }
}
