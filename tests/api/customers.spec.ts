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

test('API-08 رفض عميل دون اسم', async ({ request }) => {
    // عيب معروف: customers/add يُنشئ عميلًا دون الحقل الإلزامي name (بانتظار إصلاح الفريق)
    test.fail();
    const stamp = `${Date.now()}${Math.floor(Math.random() * 1000)}`
    const customerPhone = `5${String(stamp).slice(-8)}`

    const login = await request.post('/api/v1.0/login', {
        form: {
            company: process.env.ERP_COMPANY!,
            username: process.env.ERP_USER!,
            password: process.env.ERP_PASSWORD!
        }
    })
    const { token } = await login.json()

    const response = await request.post('/api/v1.0/customers/add', {
        params: { token, company: process.env.ERP_COMPANY! },
        form: { phone: customerPhone }
    })
    const body = await response.json()

    expect(body.error).toBe(true);
    expect(body.msg).toBeTruthy();
    expect(body.item_id).toBeUndefined();
})

test('API-09 جلب العميل ومطابقة بياناته',async ({request})=>{
    // بيانات فريدة لهذا التشغيل
    const stamp = `${Date.now()}${Math.floor(Math.random() * 1000)}`
    const customerName = `AUTO-API-${stamp}`;
    const customerPhone = `5${String(stamp).slice(-8)}`
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
    //التحقق من نجاح الإضافة
    expect(body.error).toBe(false)

    const customerID = body.item_id;
    
    const getCustomerDetails =await request.get(`/api/v1.0/customers/${customerID}`,{
        params: { token, company: process.env.ERP_COMPANY! },
    })
    const customerDetails=await getCustomerDetails.json();


    //التحقق من بيانات العميل 

    expect(getCustomerDetails.status()).toBe(200);
    expect(customerDetails.error).toBe(false);
    expect(customerDetails.data.id).toBe(customerID);
    expect(customerDetails.data.name).toBe(customerName);
    expect(customerDetails.data.phone).toBe(customerPhone);
    
    



})