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