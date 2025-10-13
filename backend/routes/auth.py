# routes/auth.py
from flask import Blueprint, request, jsonify
from models import db, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        name = data.get("name")
        role = data.get("role", "viewer")
        
        if not email or not password or not name:
            return jsonify({"error": "Email, password and name are required"}), 400
            
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "User already exists"}), 400
            
        user = User(
            email=email,
            username=email,
            name=name,
            role=role
        )
        user.set_password(password)
        
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
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
            
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid credentials"}), 401
            
        token = create_access_token(identity=user.id)
        return jsonify({
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "role": user.role
            }
        })
    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500

@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({"message": "Logged out successfully"})