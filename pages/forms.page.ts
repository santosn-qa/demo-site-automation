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
    this.firstNameInput = this.page.locator('#firstName');
    this.lastNameInput = this.page.locator('#lastName');
    this.emailInput = this.page.locator('#userEmail');
    this.mobileInput = this.page.locator('#userNumber');
    this.dateOfBirthInput = this.page.locator('#dateOfBirthInput');
    this.subjectsInput = this.page.locator('#subjectsInput');
    this.currentAddressInput = this.page.locator('#currentAddress');
    this.stateContainer = this.page.locator('#state');
    this.stateInput = this.page.locator('#react-select-3-input');
    this.cityContainer = this.page.locator('#city');
    this.cityInput = this.page.locator('#react-select-4-input');
    this.submitButton = this.page.getByRole('button', { name: 'Submit' });
    this.confirmationRows = this.page.locator('.table-responsive tbody tr');
  }

  async fillStudentForm(data: StudentFormData): Promise<void> {
    await this.fill(this.firstNameInput, data.firstName);
    await this.fill(this.lastNameInput, data.lastName);
    await this.fill(this.emailInput, data.email);

    await this.click(
      this.page
        .locator('label[for^="gender-radio"]')
        .filter({ hasText: data.gender })
        .first()
    );
    await this.fill(this.mobileInput, data.mobile);

    await this.click(this.dateOfBirthInput);
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.type(data.dateOfBirth);
    await this.page.keyboard.press('Enter');

    for (const subject of data.subjects) {
      await this.fill(this.subjectsInput, subject);
      await this.subjectsInput.press('Enter');
    }

    for (const hobby of data.hobbies) {
      await this.click(
        this.page
          .locator('label[for^="hobbies-checkbox"]')
          .filter({ hasText: hobby })
          .first()
      );
    }

    await this.fill(this.currentAddressInput, data.address);

    // DemoQA uses a react-select control here, so keyboard entry is the most stable way to pick values.
    await this.click(this.stateContainer);
    await this.fill(this.stateInput, data.state);
    await this.page.getByRole('option', { name: data.state, exact: true }).click();

    await this.click(this.cityContainer);
    await this.fill(this.cityInput, data.city);
    await this.page.getByRole('option', { name: data.city, exact: true }).click();
  }

  async submitForm(): Promise<void> {
    // If the form was already submitted (e.g. by a key event), avoid clicking behind the modal.
    if (await this.page.getByRole('dialog').isVisible().catch(() => false)) {
      return;
    }
    await this.click(this.submitButton);
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
