import { test, expect } from '@playwright/test';

test('API-01 الدخول الصحيح يرجع توكن', async ({ request }) => {
  const response = await request.post('/api/v1.0/login', {
    form: {
      company: process.env.ERP_COMPANY!,
      username: process.env.ERP_USER!,
      password: process.env.ERP_PASSWORD!,
    },
  });
  const body = await response.json();
  expect(response.status()).toBe(200);
  expect(body.error).toBe(false);
  expect(body.token).toBeTruthy();
  expect(body.company).toBe(process.env.ERP_COMPANY!);

});

test('API-02 التوكن الصالح يفتح طلبًا محميًا', async ({ request }) => {
  // 1. الدخول للحصول على التوكن
  const login = await request.post('/api/v1.0/login', {
    form: {
      company: process.env.ERP_COMPANY!,
      username: process.env.ERP_USER!,
      password: process.env.ERP_PASSWORD!,
    },
  });
  const { token } = await login.json();
  // // 2. استخدام التوكن في طلب محمي
  const response = await request.post('/api/v1.0/products/index', {
    params: { token, company: process.env.ERP_COMPANY!, limit: 1 },
  });

  const body = await response.json();

  // 3. التحقق
  expect(response.status()).toBe(200);
  expect(body.error).toBe(false);
  expect(body.data).toBeTruthy();
});

