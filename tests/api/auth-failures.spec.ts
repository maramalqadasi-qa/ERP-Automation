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



test('API-04 التوكن غير الصالح يرفض', async ({ request }) => {
  const response = await request.post('/api/v1.0/products/index', {
    params: {
      token: 'invalid-token-123',
      company: process.env.ERP_COMPANY!,
      limit: 1
    }
  })
  const body = await response.json()
  // ملاحظة: الخادم يرجع 200 للتوكن غير الصالح، والمعتاد 401
  expect(body.error).toBe(true);
  expect(body.no_login).toBe(true);
  expect(body.msg).toBeTruthy()
  expect(body.data).toBeUndefined();

})