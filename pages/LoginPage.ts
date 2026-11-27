import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly form: Locator;
  readonly companyInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(private page: Page) {
    this.form = page.locator('#form_login');
    this.companyInput = this.form.locator('[name="company"]');
    this.usernameInput = this.form.locator('[name="identity"]');
    this.passwordInput = this.form.locator('[name="password"]');
    this.submitButton = this.form.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(company: string, username: string, password: string) {
    await this.goto();
    await this.companyInput.fill(company);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}