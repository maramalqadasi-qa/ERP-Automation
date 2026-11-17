import { test, expect } from '@playwright/test'
test("UI-06 إضافة عميل بالحقول الإلزامية", async ({ page }) => {
    test.setTimeout(60000)
    const loginForm = page.locator("#form_login")
    const login = await page.goto(`/login`);
    await loginForm.locator('[name="company"]').fill(process.env.ERP_COMPANY!)
    await loginForm.locator('[name="identity"]').fill(process.env.ERP_USER!)
    await loginForm.locator('[name="password"]').fill(process.env.ERP_PASSWORD!)
    await loginForm.locator('button[type="submit"]').click()
    await expect(page).toHaveURL(/welcome/);
    await page.goto(`/customers/index`)
    // بيانات فريدة لهذا التشغيل
    const stamp = Date.now();
    const customerName = `AUTO-${stamp}`;
    const customerPhone = `5${String(stamp).slice(-8)}`;
    //النقر على زر الإضافة 
    await page.getByTitle('Add').click();
   // إدخال الاسم
  
    await page.getByLabel('Name', { exact: true }).fill(customerName);
    //إدخال بيانات رقم الهاتف
    await page.getByLabel('Phone').fill(customerPhone);
    // حفظ العميل 
    await page.getByRole('button', { name: 'Save' }).click();
   //التحقق من ظهور رسالة النجاح
    await expect (page.getByRole('heading', { name: 'Customer successfully Added' })).toBeVisible()
    await expect(page.getByRole('dialog', { name: 'Add Customer' })).toBeHidden();


})

test('UI-07 العميل الجديد يظهر في قائمة العملاء', async ({ page }) => {
    test.setTimeout(90000);

  // بيانات فريدة لهذا التشغيل
  const stamp = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const customerName = `AUTO-${stamp}`;
  const customerPhone = `5${String(stamp).slice(-8)}`;
   // 1. الدخول
  const loginForm = page.locator('#form_login');
  await page.goto('/login');
  await loginForm.locator('[name="company"]').fill(process.env.ERP_COMPANY!);
  await loginForm.locator('[name="identity"]').fill(process.env.ERP_USER!);
  await loginForm.locator('[name="password"]').fill(process.env.ERP_PASSWORD!);
  await loginForm.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/welcome/);

  // 2. تجهيز البيانات: إضافة عميل (خطوات UI-06)
  await page.goto('/customers/index');
  await page.getByTitle('Add').click();
  const dialog = page.getByRole('dialog', { name: 'Add Customer' });
  await dialog.getByLabel('Name', { exact: true }).fill(customerName);
  await dialog.getByLabel('Phone', { exact: true }).fill(customerPhone);
  await dialog.getByRole('button', { name: 'Save' }).click();
  await expect(dialog).toBeHidden();

  // إغلاق رسالة النجاح
  const successDialog = page.getByRole('dialog', { name: 'Customer successfully added' });
  await successDialog.getByRole('button', { name: 'OK' }).click();
  await expect(successDialog).toBeHidden();

  // 3. البحث عن العميل في القائمة
  const searchBox =  page.getByPlaceholder('Name', { exact: true }).first();
  await searchBox.fill(customerName);
  await searchBox.press('Enter');

  // 4. التحقق: العميل ظهر وحده، وببياناته الصحيحة
  const rows = page.locator('table tbody tr');
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText(customerName);
  await expect(rows.first()).toContainText(customerPhone);
    
 
})