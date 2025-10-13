# app.py
from flask import Flask, jsonify, request
from config import Config
from models import db, User, PurchaseRequest
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import traceback

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # CORS با تنظیمات کامل
    CORS(app, origins=app.config['CORS_ORIGINS'], supports_credentials=True)
    
    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)

    from routes.auth import auth_bp
    from routes.requests import requests_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(requests_bp, url_prefix="/api")

    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok", "message": "Procurement API is running"})

    @app.route('/api/auth/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            
            if not data or not data.get('email') or not data.get('password'):
                return jsonify({"error": "Email and password required"}), 400
            
            user = User.query.filter_by(email=data.get('email')).first()
            
            if user and user.check_password(data.get('password')):
                access_token = create_access_token(identity=user.id)
                
                user_data = {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name or user.username,
                    "role": user.role
                }
                
                return jsonify({
                    "token": access_token, 
                    "user": user_data,
                    "message": "Login successful"
                }), 200
            
            return jsonify({"error": "Invalid email or password"}), 401
        except Exception as e:
            print(f"Login error: {str(e)}")
            return jsonify({"error": f"Login failed: {str(e)}"}), 500

    @app.route('/api/auth/register', methods=['POST'])
    def register():
        try:
            data = request.get_json()
            
            required_fields = ['email', 'password', 'name']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({"error": f"{field} is required"}), 400
            
            if User.query.filter_by(email=data.get('email')).first():
                return jsonify({"error": "User already exists"}), 400
            
            user = User(
                email=data.get('email'),
                username=data.get('email'),
                name=data.get('name'),
                role=data.get('role', 'viewer')
            )
            user.set_password(data.get('password'))
            
            db.session.add(user)
            db.session.commit()
            
            return jsonify({
                "message": "User created successfully",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "role": user.role
                }
            }), 201
        except Exception as e:
            db.session.rollback()
            print(f"Registration error: {str(e)}")
            return jsonify({"error": f"Registration failed: {str(e)}"}), 500

    @app.route('/api/auth/verify', methods=['GET'])
    @jwt_required()
    def verify_token():
        try:
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user:
                return jsonify({"error": "User not found"}), 404
                
            return jsonify({
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name,
                    "role": user.role
                }
            }), 200
        except Exception as e:
            print(f"Token verification error: {str(e)}")
            return jsonify({"error": "Token verification failed"}), 401

    return app

if __name__ == "__main__":
    app = create_app()
    
    with app.app_context():
        try:
            # ایجاد جداول
            db.create_all()
            print("Database tables created successfully")
            
            # ایجاد کاربر پیش‌فرض اگر وجود ندارد
            if not User.query.filter_by(email='admin@procurement.com').first():
                admin_user = User(
                    email='admin@procurement.com',
                    username='admin',
                    name='Administrator',
                    role='admin'
                )
                admin_user.set_password('admin123')
                db.session.add(admin_user)
                db.session.commit()
                print("Default admin user created: admin@procurement.com / admin123")
            else:
                print("Admin user already exists")
                
        except Exception as e:
            print(f"Database initialization error: {str(e)}")
            traceback.print_exc()
    
    print("Starting Flask server on http://localhost:5001")
    app.run(debug=True, port=5001, host='0.0.0.0')