import {test,expect} from '@playwright/test'

test('UI-05 البحث عن صنف موجود بالكود', async ({ page }) => {
  test.setTimeout(60000); // شاشة الأصناف بطيئة (قرابة 15 ثانية)، فنعطي الاختبار دقيقة
  const loginForm = page.locator("#form_login")
  const login = await page.goto(`/login`);
  await loginForm.locator('[name="company"]').fill(process.env.ERP_COMPANY!)
  await loginForm.locator('[name="identity"]').fill(process.env.ERP_USER!)
  await loginForm.locator('[name="password"]').fill(process.env.ERP_PASSWORD!)
  await loginForm.locator('button[type="submit"]').click()
  await expect(page).toHaveURL(/welcome/);
  //فتح صفحة قائمة الأصناف  
  await page.goto(`/products/index`)
  //الفلترة عن طريق ال id
  await page.getByRole('row', { name: 'Image Currency Product Type' }).getByPlaceholder('ID').click();
  await page.getByRole('row', { name: 'Image Currency Product Type' }).getByPlaceholder('ID').fill('2747');
  //التحقق من نتيجة الفلترة
  await expect(page.getByRole('gridcell', { name: '2747', exact: true })).toBeVisible();   // الصحيح

})
