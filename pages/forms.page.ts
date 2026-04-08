import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export type StudentFormData = {
  firstName: string;
  lastName: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  dateOfBirth: string;
  subjects: string[];
  hobbies: Array<'Sports' | 'Reading' | 'Music'>;
  address: string;
  state: string;
  city: string;
};

export class FormsPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly mobileInput: Locator;
  private readonly dateOfBirthInput: Locator;
  private readonly subjectsInput: Locator;
  private readonly currentAddressInput: Locator;
  private readonly stateContainer: Locator;
  private readonly stateInput: Locator;
  private readonly cityContainer: Locator;
  private readonly cityInput: Locator;
  private readonly submitButton: Locator;
  private readonly confirmationRows: Locator;

  constructor(page: Page) {
    super(page);
    // DemoQA doesn't consistently associate <label> with inputs, so placeholder/id locators are the most stable here.
    this.firstNameInput = this.page.getByPlaceholder('First Name');
    this.lastNameInput = this.page.getByPlaceholder('Last Name');
    this.emailInput = this.page.getByPlaceholder('name@example.com');
    this.mobileInput = this.page.getByPlaceholder('Mobile Number');
    this.dateOfBirthInput = this.page.locator('#dateOfBirthInput');
    this.subjectsInput = this.page.locator('#subjectsInput');
    this.currentAddressInput = this.page.getByPlaceholder('Current Address');

    this.stateContainer = this.page.locator('#state');
    this.stateInput = this.page.locator('#react-select-3-input');
    this.cityContainer = this.page.locator('#city');
    this.cityInput = this.page.locator('#react-select-4-input');
    this.submitButton = this.page.getByRole('button', { name: 'Submit' });
    this.confirmationRows = this.page.getByRole('dialog').locator('tbody tr');
  }

  async fillStudentForm(data: StudentFormData): Promise<void> {
    await this.fill(this.firstNameInput, data.firstName);
    await this.fill(this.lastNameInput, data.lastName);
    await this.fill(this.emailInput, data.email);

    await this.page.getByLabel(data.gender, { exact: true }).check();
    await this.fill(this.mobileInput, data.mobile);

    // Avoid Enter while editing DOB; it can submit the form and open the modal mid-fill.
    await this.click(this.dateOfBirthInput);
    await this.fill(this.dateOfBirthInput, data.dateOfBirth);
    await this.dateOfBirthInput.press('Tab');

    for (const subject of data.subjects) {
      await this.fill(this.subjectsInput, subject);
      // Selecting by clicking the option is more stable than pressing Enter.
      await this.page.getByRole('option', { name: subject, exact: true }).click();
    }

    for (const hobby of data.hobbies) {
      await this.page.getByLabel(hobby, { exact: true }).check();
    }

    await this.fill(this.currentAddressInput, data.address);

    // DemoQA uses react-select here; typing then choosing an option is the most stable.
    await this.click(this.stateContainer);
    await this.fill(this.stateInput, data.state);
    await this.page.getByRole('option', { name: data.state, exact: true }).click();

    await this.click(this.cityContainer);
    await this.fill(this.cityInput, data.city);
    await this.page.getByRole('option', { name: data.city, exact: true }).click();
  }

  async submitForm(): Promise<void> {
    // If the modal is already open, avoid clicking behind it.
    if (await this.page.getByRole('dialog').isVisible().catch(() => false)) {
      return;
    }
    await this.click(this.submitButton);
  }

  async submitStudentForm(data: StudentFormData): Promise<Record<string, string>> {
    await this.fillStudentForm(data);
    await this.submitForm();
    return this.getConfirmationData();
  }

  async getConfirmationData(): Promise<Record<string, string>> {
    await this.waitForElement(this.confirmationRows.first());

    const entries = await this.confirmationRows.evaluateAll((rows: Element[]) => {
      return rows.map((row: Element) => {
        const cells = row.querySelectorAll('td');
        const key = cells[0]?.textContent?.trim() ?? '';
        const value = cells[1]?.textContent?.trim() ?? '';
        return [key, value] as [string, string];
      });
    });

    return Object.fromEntries(entries);
  }
}
