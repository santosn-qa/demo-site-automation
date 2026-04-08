import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export type WebTableRecord = {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
};

/**
 * Page object for DemoQA's Web Tables.
 *
 * Approach:
 * - Locate table rows via ARIA roles instead of CSS selectors; DemoQA's DOM is
 *   fairly stable in terms of roles even when markup shifts.
 * - Isolate row editing + row reading so tests can express intent as
 *   "update record" and assert on the returned data.
 */
export class WebTablesPage extends BasePage {
  private readonly tableRows: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly ageInput: Locator;
  private readonly salaryInput: Locator;
  private readonly departmentInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    // First rowgroup is header; second rowgroup contains data rows.
    this.tableRows = this.page.getByRole('rowgroup').nth(1).getByRole('row');

    // Registration form modal inputs (placeholders are more reliable than labels on DemoQA)
    this.firstNameInput = this.page.getByPlaceholder('First Name');
    this.lastNameInput = this.page.getByPlaceholder('Last Name');
    this.emailInput = this.page.getByPlaceholder('name@example.com');
    this.ageInput = this.page.getByPlaceholder('Age');
    this.salaryInput = this.page.getByPlaceholder('Salary');
    this.departmentInput = this.page.getByPlaceholder('Department');
    this.submitButton = this.page.getByRole('button', { name: 'Submit' });
  }

  private getRowByIndex(index: number): Locator {
    return this.tableRows.nth(index);
  }

  async editRow(index: number, data: WebTableRecord): Promise<void> {
    const row = this.getRowByIndex(index);
    await this.waitForElement(row);
    await this.click(row.getByTitle('Edit'));

    await this.fill(this.firstNameInput, data.firstName);
    await this.fill(this.lastNameInput, data.lastName);
    await this.fill(this.emailInput, data.email);
    await this.fill(this.ageInput, data.age);
    await this.fill(this.salaryInput, data.salary);
    await this.fill(this.departmentInput, data.department);
  }

  async updateRecord(index: number, data: WebTableRecord): Promise<WebTableRecord> {
    await this.editRow(index, data);
    await this.submitForm();
    return this.getRowData(index);
  }

  async submitForm(): Promise<void> {
    await this.click(this.submitButton);
  }

  async getRowData(index: number): Promise<WebTableRecord> {
    const row = this.getRowByIndex(index);
    await this.waitForElement(row);
    const cells = await row.getByRole('cell').allTextContents();

    // DemoQA cell order (as displayed): First Name, Last Name, Age, Email, Salary, Department
    // We normalize by trimming so asserts aren't sensitive to whitespace.

    return {
      firstName: cells[0]?.trim() ?? '',
      lastName: cells[1]?.trim() ?? '',
      age: cells[2]?.trim() ?? '',
      email: cells[3]?.trim() ?? '',
      salary: cells[4]?.trim() ?? '',
      department: cells[5]?.trim() ?? ''
    };
  }
}
