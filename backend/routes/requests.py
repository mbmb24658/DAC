from flask import Blueprint, request, jsonify
from models import db, PurchaseRequest, History
from flask_jwt_extended import jwt_required, get_jwt_identity

requests_bp = Blueprint("requests", __name__)

@requests_bp.route("/requests", methods=["GET"])
def list_requests():
    # پشتیبانی از فیلتر query params: q (search), department, expert, limit, offset
    q = request.args.get("q")
    department = request.args.get("department")
    expert = request.args.get("expert")
    limit = int(request.args.get("limit", 100))
    query = PurchaseRequest.query
    if q:
        query = query.filter(PurchaseRequest.request_number.ilike(f"%{q}%"))
    if department:
        query = query.filter_by(purchase_department=department)
    if expert:
        query = query.filter_by(purchase_expert=expert)
    results = query.limit(limit).all()
    out = []
    for r in results:
        out.append({
            "id": r.id,
            "request_number": r.request_number,
            "purchase_department": r.purchase_department,
            "purchase_expert": r.purchase_expert,
            "latest_status": r.latest_status,
            "initial_amount": r.initial_amount
        })
    return jsonify(out)

@requests_bp.route("/requests/<int:request_id>", methods=["GET"])
def get_request(request_id):
    r = PurchaseRequest.query.get_or_404(request_id)
    data = {c.name: getattr(r, c.name) for c in r.__table__.columns}
    # اضافه کن تاریخچه تغییرات از جدول history
    history = History.query.filter_by(request_id=r.id).order_by(History.change_timestamp.desc()).all()
    hist_list = [{"field": h.field_changed, "old": h.old_value, "new": h.new_value, "at": h.change_timestamp.isoformat()} for h in history]
    return jsonify({"request": data, "history": hist_list})

# نمونه endpoint برای داشبورد دایره خرید
@requests_bp.route("/departments/<string:dept_name>/summary", methods=["GET"])
def dept_summary(dept_name):
    # محاسبه‌ی ساده: تعداد درخواست، میانگین مبلغ اولیه، میانگین زمان (اینجا فرضی)
    reqs = PurchaseRequest.query.filter_by(purchase_department=dept_name).all()
    total = len(reqs)
    avg_initial = sum((r.initial_amount or 0) for r in reqs) / max(1, total)
    return jsonify({"department": dept_name, "total_requests": total, "avg_initial_amount": avg_initial})

@requests_bp.route("/requests/<int:request_id>/timing", methods=["GET"])
def request_timing(request_id):
    # محاسبه زمان ماند با استفاده از تاریخچه (نمونه‌ی ساده)
    # برگرداندن durations per stage + predicted_remaining
    return jsonify(...)
