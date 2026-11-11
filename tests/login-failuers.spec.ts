import { test, expect } from '@playwright/test';

// كل اختبارات هذا الملف تعمل على الديمو
test.use({ baseURL: process.env.DEMO_URL });

test('UI-02 كلمة مرور خاطئة تُظهر رسالة خطأ', async ({ page }) => {
  const loginForm = page.locator('#form_login');
  await page.goto('/login');

  await loginForm.locator('[name="company"]').fill(process.env.DEMO_COMPANY!);
  await loginForm.locator('[name="identity"]').fill(process.env.DEMO_FAIL_USER!);
  await loginForm.locator('[name="password"]').fill('wrong-password-123');
  await loginForm.locator('button[type="submit"]').click();

  await expect(page.getByText('خطأ في بيانات تسجيل الدخول!!')).toBeVisible();
  await expect(page).toHaveURL(/login/);
});