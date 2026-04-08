import { Locator, Page } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.hideObstructiveElements();
  }

  async click(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.scrollIntoViewIfNeeded();
    await locator.fill(value);
  }

  async getText(locator: Locator): Promise<string> {
    const text = await locator.textContent();
    return text?.trim() ?? '';
  }

  async waitForElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }

  private async hideObstructiveElements(): Promise<void> {
    // DemoQA renders fixed ad containers that can overlap fields in headed mode.
    await this.page.evaluate(() => {
      const selectors = [
        '#fixedban',
        '.advertisement',
        'iframe[id*="google_ads_iframe"]',
        'iframe[src*="doubleclick"]',
        '[id*="google_ads_iframe"]'
      ];

      for (const selector of selectors) {
        for (const element of document.querySelectorAll(selector)) {
          if (element instanceof HTMLElement) {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.pointerEvents = 'none';
          }
        }
      }
    });
  }
}
