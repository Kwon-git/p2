from pymongo import MongoClient
from flask_bcrypt import Bcrypt

# Kết nối MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["schedule_db"]
users = db["users"]

bcrypt = Bcrypt()

class User:
    def __init__(self, username, password):
        self.username = username
        self.password = bcrypt.generate_password_hash(password).decode("utf-8")
        self.schedule = {}  # Mặc định là object rỗng

    def save(self):
        """Lưu user vào MongoDB"""
        users.insert_one({
            "username": self.username,
            "password": self.password,
            "schedule": self.schedule,# Lưu schedule mặc định
            "role":"lecturer"
        })

    @staticmethod
    def find_by_username(username):
        """Tìm user theo username"""
        return users.find_one({"username": username})

    @staticmethod
    def verify_password(stored_password, provided_password):
        """Kiểm tra mật khẩu"""
        return bcrypt.check_password_hash(stored_password, provided_password)

    @staticmethod
    def update_schedule(username, new_schedule):
        """Cập nhật schedule cho user"""
        users.update_one(
            {"username": username},
            {"$set": {"schedule": new_schedule}}
        )
