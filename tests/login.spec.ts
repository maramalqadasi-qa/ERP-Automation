import { test, expect } from '@playwright/test';


test('UI-00 صفحة الدخول تُظهر حقولها', async ({ page }) => {
  const loginForm = page.locator('#form_login');
  await page.goto(`${process.env.ERP_URL}/login`);
  await expect(page).toHaveURL(/login/);

  await expect(loginForm.getByPlaceholder('Company name')).toBeVisible();


  await expect(loginForm.getByPlaceholder('Username')).toBeVisible();

  await expect(loginForm.getByPlaceholder('Password')).toBeVisible();
  await expect(loginForm.getByPlaceholder('Password')).toHaveAttribute('type', 'password');

  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();

});
test('UI-01الدخول ببيانات صحيحة  ', async ({ page }) => {
  const loginForm = page.locator('#form_login');
  await page.goto(`${process.env.ERP_URL}/login`);
  await loginForm.getByPlaceholder('Company name').fill(process.env.ERP_COMPANY!);

  await loginForm.getByPlaceholder('Username').fill(process.env.ERP_USER!);
  await loginForm.getByPlaceholder('Password').fill(process.env.ERP_PASSWORD!)

  await loginForm.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/welcome/);
  await expect(page.getByRole('link', { name: process.env.ERP_COMPANY! })).toBeVisible();
});









