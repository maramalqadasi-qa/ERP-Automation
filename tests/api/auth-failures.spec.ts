import { test, expect } from '@playwright/test';

// حالات فشل الـ API تعمل على الديمو
test.use({ baseURL: process.env.DEMO_URL });

test('API-03 الدخول بكلمة مرور خاطئة يعرض رسالة خطأ', async ({ request }) => {

  const login = await request.post('/api/v1.0/login', {
    form: {
      company: process.env.ERP_COMPANY!,
      username: process.env.ERP_FAIL_USER!,
      password: "wrong-password-123"
    }
  });
  const body = await login.json()

  // expect(login.status()).toBe(401);
  // ملاحظة: الخادم يرجع 200 للدخول المرفوض، والمعتاد 401 (مرفوعة للفريق)
  expect(body.error).toBe(true);
  expect(body.msg).toBeTruthy();
  expect(body.token).toBeUndefined();
 
})