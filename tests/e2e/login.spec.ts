import {test,expect} from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage';
test('UI-00 صفحة الدخول تُظهر حقولها', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await expect(page).toHaveURL(/login/);

  await expect(loginPage.companyInput).toBeVisible();
  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  await expect(loginPage.submitButton).toBeVisible();
});

test('UI-01 الدخول ببيانات صحيحة', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(process.env.ERP_COMPANY!, process.env.ERP_USER!, process.env.ERP_PASSWORD!);

  await expect(page).toHaveURL(/welcome/);
  await expect(page.getByRole('link', { name: process.env.ERP_COMPANY! })).toBeVisible({ timeout: 15000 });
});

test('UI-04 الخروج ثم منع الوصول إلى صفحة داخلية', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // 1. الدخول
  await loginPage.login(process.env.ERP_COMPANY!, process.env.ERP_USER!, process.env.ERP_PASSWORD!);
  await expect(page).toHaveURL(/welcome/);
  await page.waitForLoadState('load');

  // 2. الخروج: فتح القائمة، ثم النقر على Logout
  await page.getByRole('button', { name: 'owner owner ' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();

  // 3. التحقق: عدنا إلى نموذج الدخول
  await expect(loginPage.form).toBeVisible();
  // 4. محاولة فتح صفحة داخلية بعد الخروج
  await page.goto('/welcome');

  // 5. التحقق: النظام أعادنا إلى الدخول، ولم يفتح لوحة التحكم
  await expect(loginPage.form).toBeVisible();
  await expect(page).not.toHaveURL(/welcome/);
});