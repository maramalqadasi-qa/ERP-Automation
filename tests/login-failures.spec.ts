import { test, expect } from '@playwright/test';

// كل اختبارات هذا الملف تعمل على الديمو
test.use({ baseURL: process.env.DEMO_URL });

test('UI-02 كلمة مرور خاطئة تُظهر رسالة خطأ', async ({ page }) => {
  const loginForm = page.locator('#form_login');
  await page.goto('/login');

  await loginForm.locator('[name="company"]').fill(process.env.ERP_COMPANY!);
  await loginForm.locator('[name="identity"]').fill(process.env.ERP_FAIL_USER!);
  await loginForm.locator('[name="password"]').fill('wrong-password-123');
  await loginForm.locator('button[type="submit"]').click();

  await expect(page.getByText('خطأ في بيانات تسجيل الدخول!!')).toBeVisible();
  await expect(page).toHaveURL(/login/);
});

test('UI-03 الحقول الفارغة تُعطّل زر الدخول', async ({ page }) => {
  const loginForm = page.locator('#form_login');
  await page.goto('/login');
  const loginButton = loginForm.locator('button[type="submit"]');

  // 1. الصفحة فارغة: الزر معطّل
  await expect(loginButton).toBeDisabled();

  // 2. كلمة المرور ما زالت فارغة: الزر ما زال معطّلًا
  await loginForm.locator('[name="company"]').fill('any-company');
  await loginForm.locator('[name="identity"]').fill('any-user');
  await expect(loginButton).toBeDisabled();

  // 3. الحقول الثلاثة ممتلئة: الزر يُفعَّل
  await loginForm.locator('[name="password"]').fill('any-password');
  await expect(loginButton).toBeEnabled();

    await loginForm.locator('[name="password"]').fill('');
  await expect(loginButton).toBeDisabled();
});