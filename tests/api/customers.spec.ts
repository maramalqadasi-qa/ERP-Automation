import { test, expect } from '@playwright/test'

test("API-06 البحث في العملاء يرجع المطابق فقط'", async ({ request }) => {
    // عيب معروف: فلترا name وq في customers/index لا يعملان، ويرجع كل العملاء (بانتظار إصلاح الفريق)
    test.fail();
    //أولا إرسال الطلب ببيانات مسموحة
    const login = await request.post('/api/v1.0/login', {
        form: {
            company: process.env.ERP_COMPANY!,
            username: process.env.ERP_USER!,
            password: process.env.ERP_PASSWORD!
        }
    })
    // استخدام التوكن للوصول للعملاء والبحث عن اسم عميل 
    const { token } = await login.json()
    const searchWord = "عميل"
    const response = await request.post('/api/v1.0/customers/index', {
        params: { token, company: process.env.ERP_COMPANY!, name: searchWord }
    })
    const body = await response.json()  // 1. هل نجح الطلب؟
    expect(response.status()).toBe(200);
    expect(body.error).toBe(false);

    // 2. هل الشكل صحيح؟
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    // 3. هل كل النتائج تطابق البحث؟
    for (const customer of body.data) {
        expect(customer.name).toContain(searchWord);
    }

})

test("API-07 إنشاء عميل يرجع معرّفه", async ({ request }) => {
    // بيانات فريدة لهذا التشغيل
    const stamp = Date.now();
    const customerName = `AUTO-API-${stamp}`;
    const customerPhone = `5${String(stamp).slice(-8)}`;
    // 1. الدخول
    const login = await request.post('/api/v1.0/login', {
        form: {
            company: process.env.ERP_COMPANY!,
            username: process.env.ERP_USER!,
            password: process.env.ERP_PASSWORD!
        }
    })
    const { token } = await login.json()
    // 2. إنشاء العميل
    const response = await request.post('/api/v1.0/customers/add', {
        params: { token, company: process.env.ERP_COMPANY! },
        form: { name: customerName, phone: customerPhone }
    })
    const body = await response.json()

    expect(response.status()).toBe(200);
    expect(body.error).toBe(false);
    expect(Number(body.item_id)).toBeGreaterThan(0);
    expect(Number(body.item_id)).toBe(body.id);
})

