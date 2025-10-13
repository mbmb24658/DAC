# models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class PurchaseRequest(db.Model):
    __tablename__ = "purchase_requests"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    request_number = db.Column(db.String, unique=True, index=True)
    item_count = db.Column(db.Integer)
    industrial_flag = db.Column(db.String)
    purchase_department = db.Column(db.String, index=True)
    purchase_expert = db.Column(db.String, index=True)
    applicant = db.Column(db.String)
    applicant_company = db.Column(db.String)
    applicant_unit = db.Column(db.String)
    consumer_company = db.Column(db.String)
    consumer_unit = db.Column(db.String)
    latest_status = db.Column(db.String, index=True)
    winning_source = db.Column(db.String)
    date_request = db.Column(db.String)
    date_mrs = db.Column(db.String)
    date_entry = db.Column(db.String)
    purchase_duration = db.Column(db.String)
    initial_amount = db.Column(db.Float)
    currency_unit = db.Column(db.String)
    order_amount = db.Column(db.Float)
    order_currency = db.Column(db.String)
    extra_cost_rial = db.Column(db.Float)
    converted_cost_rial = db.Column(db.Float)
    notes = db.Column(db.Text)
    transaction_type = db.Column(db.String)
    external_id = db.Column(db.String)
    date_start = db.Column(db.String)
    date_end = db.Column(db.String)
    urgency_code = db.Column(db.String)
    date_order = db.Column(db.String)
    first_item_description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class History(db.Model):
    __tablename__ = "history"
    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('purchase_requests.id'), nullable=False)
    field_changed = db.Column(db.String)
    old_value = db.Column(db.Text)
    new_value = db.Column(db.Text)
    change_timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, index=True)
    username = db.Column(db.String, unique=True, index=True)
    name = db.Column(db.String(100))
    password_hash = db.Column(db.String)
    role = db.Column(db.String, default="viewer")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)