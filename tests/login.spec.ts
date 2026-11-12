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
test('UI-01 الدخول ببيانات صحيحة  ', async ({ page }) => {
  const loginForm = page.locator('#form_login');
  await page.goto(`${process.env.ERP_URL}/login`);
  await loginForm.getByPlaceholder('Company name').fill(process.env.ERP_COMPANY!);

  await loginForm.getByPlaceholder('Username').fill(process.env.ERP_USER!);
  await loginForm.getByPlaceholder('Password').fill(process.env.ERP_PASSWORD!)

  await loginForm.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/welcome/);
  await expect(page.getByRole('link', { name: process.env.ERP_COMPANY! })).toBeVisible();
});

test('UI-04 الخروج ثم منع الوصول إلى صفحة داخلية',async ({page})=>{
const loginForm=page.locator('#form_login');

  // 1. الدخول (الخطوات نفسها في UI-01)
await page.goto(`${process.env.ERP_URL!}/login`);
await loginForm.locator('[name="company"]').fill(process.env.ERP_COMPANY!)
await loginForm.locator('[name="identity"]').fill(process.env.ERP_USER!)
await loginForm.locator('[name="password"]').fill(process.env.ERP_PASSWORD!)

await loginForm.locator('button[type="submit"]').click()
await expect(page).toHaveURL(/welcome/);
await page.waitForLoadState('load');

// 2. الخروج: فتح القائمة، ثم النقر على Logout
 await page.getByRole('button', { name: 'owner owner ' }).click();
await page.getByRole('link', { name: 'Logout' }).click();


  // 3. التحقق: عدنا إلى نموذج الدخول
  await expect(loginForm).toBeVisible();
  
  // 4. محاولة فتح صفحة داخلية بعد الخروج
  await page.goto('/welcome');

   // 5. التحقق: النظام أعادنا إلى الدخول، ولم يفتح لوحة التحكم
  await expect(loginForm).toBeVisible();
  await expect(page).not.toHaveURL(/welcome/);


});








