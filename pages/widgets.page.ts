import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

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

    // Select One (react-select, titles like "Mr.", "Mrs."...)
    this.customContainer = this.page.locator('#selectOne');
    this.customInput = this.page.locator('#react-select-3-input');
    this.customValueContainer = this.page.locator('#selectOne');

    const multiSelectSection = this.page.locator('p:has-text("Multiselect drop down")').locator('..');
    this.multiSelectInput = multiSelectSection.locator('input[role="combobox"]');
    this.multiValueContainer = multiSelectSection;
  }

  async selectStandardDropdown(value: string): Promise<void> {
    await this.standardDropdown.selectOption({ label: value });
  }

  async selectCustomDropdown(value: string): Promise<void> {
    await this.click(this.customContainer);
    await this.fill(this.customInput, value);
    await this.customInput.press('Enter');
  }

  async selectMultiValues(values: string[]): Promise<void> {
    for (const value of values) {
      await this.click(this.multiSelectInput);
      await this.fill(this.multiSelectInput, value);
      await this.multiSelectInput.press('Enter');
    }
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
