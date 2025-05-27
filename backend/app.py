from flask import Flask, request, jsonify
from flask_jwt_extended import create_access_token, JWTManager,jwt_required, get_jwt_identity
from models import User,users  # Import class User
import pyotp
from flask_cors import CORS
from dotenv import load_dotenv
from mail import init_mail, send_email
import os
from routes.student import student_bp
from routes.sort import sort_bp

app = Flask(__name__)
CORS(app)
app.config['MAIL_SERVER'] = os.getenv("MAIL_SERVER")
app.config['MAIL_PORT'] = int(os.getenv("MAIL_PORT"))
app.config['MAIL_USE_TLS'] = os.getenv("MAIL_USE_TLS") == "True"
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
init_mail(app)
load_dotenv()
app.config["JWT_SECRET_KEY"]= 'supersecret'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False
jwt = JWTManager(app)
temp_user_store = {}


@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    if User.find_by_username(username):
        return jsonify({"error": "Username đã tồn tại"}), 400
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(s=secret,interval=300)
    send_email(username,"Xac thuc ma OTP",f"Ma OTP cua ban la :{totp.now()}")
    print("Sent")
    temp_user_store[username] = {
        "password": password,
        "secret": secret
    }
    print(totp.now())
    return jsonify({"message": "Hãy xác thực mã OTP"}), 201

@app.route("/verify-otp",methods=['POST'])
def verify_otp():
    data = request.json
    username = data.get("username")
    otp = data.get("otp")
    temp_data = temp_user_store.get(username)
    if not temp_data:
        return jsonify({"error": "Không tìm thấy thông tin xác minh"}), 404

    totp = pyotp.TOTP(temp_data["secret"], interval=300)
    print("OTP from client:", otp)
    print("OTP now on server:", totp.now())
    if totp.verify(otp) :
        # Tạo user vào DB
        new_user = User(username=username, password=temp_data["password"])
        new_user.save()
        del temp_user_store[username]  # Xóa sau khi dùng
        return jsonify({"message": "Xác minh thành công, tài khoản đã tạo!"}), 201
    else:
        return jsonify({"error": "OTP không hợp lệ"}), 400
    

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = User.find_by_username(username)
    print(user)
    if not user or not User.verify_password(user["password"], password):
        return jsonify({"error": "Sai tài khoản hoặc mật khẩu"}), 401

    access_token = create_access_token(identity=username)
    return jsonify({"token": access_token, "role":user["role"],"message": "Đăng nhập thành công!"})


@app.route("/update_schedule", methods=["POST"])
@jwt_required()  # Chỉ user đã đăng nhập mới có thể cập nhật
def update_schedule():
    current_user = get_jwt_identity() # Lấy username từ token
    print("Received request JSON:", request.json)  
    data = request.json.get("schedule")  # Lịch trình mới

    if not data:
        return jsonify({"error": "Lịch trình không hợp lệ"}), 400

    User.update_schedule(current_user, data)
    return jsonify({"message": "Cập nhật lịch trình thành công!"})


@app.route("/get_schedule", methods=["GET"])
@jwt_required()
def get_schedule():
    current_user = get_jwt_identity()  

    user = User.find_by_username(current_user)  # Tìm user trong database
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"username": current_user, "schedule": user.get("schedule", {})}), 200


# @app.route()
@app.route('/update-duration',methods=["POST"])
@jwt_required()
def duration():
    current_user = get_jwt_identity()
    user = User.find_by_username(current_user)
    data = request.json
    if(not data):
        return jsonify({"error":"Hay chon thoi gian"}), 400
    duration =data.get("duration")
    users.update_one({"_id":user["_id"]},
                     {"$set":{"duration": duration}})
    return jsonify({"message":"Thanh cong"})

    
@app.route('/get-duration',methods=["GET"])
@jwt_required()
def getDuration():
    current_user = get_jwt_identity()
    user = User.find_by_username(current_user)
    data = user.get("duration")
    if(not data):
        return jsonify({"error":"Time Not found"}),404
    return jsonify({"message":"Thanh cong","duration":data})    


app.register_blueprint(student_bp)
app.register_blueprint(sort_bp)
if __name__ == "__main__":
    app.run(debug=True)