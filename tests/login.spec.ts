import { test, expect } from '@playwright/test';

test('UI-00 صفحة الدخول تُظهر حقولها', async ({ page }) => {
    const loginForm = page.locator('#form_login');
  await page.goto('https://smarterp.top/login');

  // 1. حقل الشركة ظاهر
  await expect(loginForm.getByPlaceholder('Company name')).toBeVisible();

  // 2. حقل اسم المستخدم ظاهر
 await expect (loginForm.getByPlaceholder('Username')).toBeVisible();

  // 3. حقل كلمة المرور ظاهر ونوعه password
  // تلميح: تحتاجين إلى سطرين، الثاني يستخدم toHaveAttribute('type', 'password')
    await expect(loginForm.getByPlaceholder('Password')).toBeVisible();
    await expect(loginForm.getByPlaceholder('Password')).toHaveAttribute('type', 'password');

  // 4. زر Login ظاهر
  // اكتبيه أنتِ
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});