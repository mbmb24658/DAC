import pandas as pd
from models import db, PurchaseRequest
from app import create_app

app = create_app()
app.app_context().push()

# مسیر فایل اکسل (فایل شما)
xlsx_path = "D:/Media/Office/Programming/Project/Cursor/supplychain-app/backend/DB.xlsx"

df = pd.read_excel(xlsx_path, sheet_name="DataSet1", dtype=str)

# تبدیل نام ستون‌های فارسی به نام‌های مدل
col_map = {
    "شماره درخواست": "request_number",
    "تعداد قلم": "item_count",
    "صنعتی/غیر صنعتی": "industrial_flag",
    "دایره خرید": "purchase_department",
    "کارشناس خرید": "purchase_expert",
    "متقاضی": "applicant",
    "شرکت متقاضی": "applicant_company",
    "واحد متقاضی": "applicant_unit",
    "شرکت مصرف کننده": "consumer_company",
    "واحد مصرف کننده": "consumer_unit",
    "آخرین وضعیت درخواست": "latest_status",
    "منبع برنده": "winning_source",
    "تاریخ درخواست": "date_request",
    "تاریخ  MRS": "date_mrs",
    "تاریخ ورود به دایره خرید": "date_entry",
    "بازه خرید": "purchase_duration",
    "مبلغ اولیه": "initial_amount",
    "واحد پول": "currency_unit",
    "مبلغ سفارش": "order_amount",
    "ارز سفارش": "order_currency",
    "مبلغ کل هزینه های جانبی به ریال": "extra_cost_rial",
    "مبلغ کل هزينه خريد تبدیل شده به ر": "converted_cost_rial",
    "توضیحات": "notes",
    "نوع معامله": "transaction_type",
    "ID": "external_id",
    "تاریخ شروع": "date_start",
    "تاریخ پایان": "date_end",
    "رمز فوریت": "urgency_code",
    "تاریخ سفارش": "date_order",
    "شرح آیتم اول": "first_item_description"
}

# rename cols if exist
df = df.rename(columns={k:v for k,v in col_map.items() if k in df.columns})

for _, row in df.iterrows():
    # اگر شماره درخواست موجود هست آپدیت کن، وگرنه ایجاد کن
    req_num = row.get("request_number")
    if not req_num:
        continue
    existing = PurchaseRequest.query.filter_by(request_number=req_num).first()
    if existing:
        # آپدیت فیلدها (مثال ساده)
        for k,v in row.items():
            if hasattr(existing, k):
                try:
                    setattr(existing, k, v)
                except:
                    pass
        db.session.add(existing)
    else:
        data = {k: row.get(k) for k in row.index if hasattr(PurchaseRequest, k)}
        pr = PurchaseRequest(**data)
        db.session.add(pr)
db.session.commit()
print("Import finished.")
