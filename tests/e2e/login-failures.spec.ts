import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage'

// كل اختبارات هذا الملف تعمل على الديمو
test.use({ baseURL: process.env.DEMO_URL });

test('UI-02 كلمة مرور خاطئة تُظهر رسالة خطأ', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.login(process.env.ERP_COMPANY!, process.env.ERP_FAIL_USER!, 'wrong-password-123')

  await expect(page.getByText('خطأ في بيانات تسجيل الدخول!!')).toBeVisible();
  await expect(page).toHaveURL(/login/);
});

test('UI-03 الحقول الفارغة تُعطّل زر الدخول', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // 1. الصفحة فارغة: الزر معطّل
  await expect(loginPage.submitButton).toBeDisabled();

  // 2. كلمة المرور ما زالت فارغة: الزر ما زال معطّلًا
  await loginPage.companyInput.fill('any-company');
  await loginPage.usernameInput.fill('any-user');
  await expect(loginPage.submitButton).toBeDisabled();

  // 3. الحقول الثلاثة ممتلئة: الزر يُفعَّل
  await loginPage.passwordInput.fill('any-password');
  await expect(loginPage.submitButton).toBeEnabled();

  // 4. مسح كلمة المرور: الزر يعود معطّلًا
  await loginPage.passwordInput.fill('');
  await expect(loginPage.submitButton).toBeDisabled();
});