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
    // DemoQA WebTables is currently rendered as a real table (thead/tbody).
    // First rowgroup is the header, second rowgroup contains the data rows.
    this.tableRows = this.page.getByRole('rowgroup').nth(1).getByRole('row');

    // Registration form modal inputs
    this.firstNameInput = this.page.locator('#firstName');
    this.lastNameInput = this.page.locator('#lastName');
    this.emailInput = this.page.locator('#userEmail');
    this.ageInput = this.page.locator('#age');
    this.salaryInput = this.page.locator('#salary');
    this.departmentInput = this.page.locator('#department');
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

  async submitForm(): Promise<void> {
    await this.click(this.submitButton);
  }

  async getRowData(index: number): Promise<WebTableRecord> {
    const row = this.getRowByIndex(index);
    await this.waitForElement(row);
    const cells = await row.getByRole('cell').allTextContents();

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
