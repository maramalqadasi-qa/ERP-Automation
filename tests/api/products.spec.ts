import {test,expect} from '@playwright/test'
test("API-05 قائمة الأصناف، الحالة وشكل الرد" , async ({request})=>{
   // عيب معروف: products/index يرجع صنفًا واحدًا بدل قائمة (بانتظار إصلاح الفريق)
  test.fail();
  const login = await request.post('/api/v1.0/login',{
    form:{
      company:process.env.ERP_COMPANY!,
      username:process.env.ERP_USER!,
      password:process.env.ERP_PASSWORD!

    }
  }) 
  const {token} = await login.json();
  const response= await request.post('/api/v1.0/products/index',{
    params:{token,company:process.env.ERP_COMPANY!}
  })
  const body = await response.json()


   // 1. هل نجح الطلب؟
  expect(response.status()).toBe(200);
  expect(body.error).toBe(false);

  // 2. هل الشكل صحيح؟
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.data.length).toBeGreaterThan(0);

  const first = body.data[0];
  expect(first).toHaveProperty('id');
  expect(first).toHaveProperty('name');
  expect(first).toHaveProperty('code');
  expect(first).toHaveProperty('price');

  // 3. هل القيم منطقية؟
  expect(body.data.length).toBeLessThanOrEqual(20);
  expect(Number(body.total)).toBeGreaterThanOrEqual(body.data.length);

})
