import { Locator, Page } from '@playwright/test';

/**
 * Base class for Page Object Model (POM) pages.
 *
 * Approach:
 * - Keep raw Playwright interactions (wait/scroll/click/fill) centralized so all
 *   pages benefit from the same stability defaults.
 * - Keep tests declarative: tests call page methods; pages handle UI mechanics.
 *
 * Note: DemoQA is a public demo site and occasionally renders overlays/ads that
 * can intercept clicks. We proactively hide common obstructive elements after
 * navigation to reduce flake.
 */
export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    // Use domcontentloaded instead of networkidle to avoid hanging on analytics/ads.
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.hideObstructiveElements();
  }

  async click(locator: Locator): Promise<void> {
    // Consistent click contract: element is visible and in view before clicking.
    await this.waitForElement(locator);
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    // Consistent fill contract: visible + in view, then fill.
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
