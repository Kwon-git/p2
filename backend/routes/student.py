from flask import Flask, request, jsonify,Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import users,User
import random
import string
from mail import send_email
from flask_bcrypt import Bcrypt
from collections import defaultdict
from datetime import datetime
from bson import ObjectId

bcrypt = Bcrypt()
student_bp=Blueprint("student",__name__)
mp = defaultdict(int)
def get_random_string(length):
    # choose from all lowercase letter
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str

def get_email(name, mssv):
    name = name.lower()
    name_array = name.split(" ")
    leng = len(name_array)
    res = ""
    res = res + name_array[leng-1] + '.'
    for i in range(0,leng-1):
        res = res + name_array[i][0]
    res = res + mssv[2:] + "@sis.hust.edu.vn"
    return res

def normalize_name(name):
    res = ""
    ten = name.strip()
    i=0
    while(i<len(ten)):
        while(ten[i] == " " and ten[i+1]==" "):
            i = i+1
        res = res + ten[i]
        i = i+1
    return res        
        

    
@student_bp.route("/create-student",methods = ["POST"])
@jwt_required()
def create_student():
    current_user = get_jwt_identity()
    data= request.json
    hoten = data["hoten"]
    hoten = normalize_name(hoten)
    mssv = data["mssv"]
    student = users.find_one({"mssv": mssv})
    if(student):
        return jsonify({"error":"Da co sinh vien nay trong danh sach!"}),400
    if (not hoten or not mssv):
        return jsonify({"error":"Hay nhap day du thong tin!"}),400
    user = User.find_by_username(current_user)
    users.insert_one({
        "hoten": hoten,
        "mssv": mssv,
        "role":"student",
        "lecturer_id":user["_id"]
    })
    if "dssv" in user:
        a = user["dssv"]
        a.append(mssv)
        users.update_one(
            {"username": current_user},    # Điều kiện lọc (filter)
            {"$set": {"dssv": a}}
        )
    else:
        a= []
        a.append(mssv)
        users.update_one(
            {"username": current_user},         
            {"$set": {"dssv": a}}
        )      
    return jsonify({"message": "Them sinh vien thành công!"})


@student_bp.route("/create-account/<mssv>",methods=["POST"])
@jwt_required()
def create_account(mssv):
    current_user = get_jwt_identity()
    user = User.find_by_username(current_user)
    print(user)
    password = get_random_string(6)
    password2 = password
    username = mssv+ str(mp[mssv])
    mp[mssv] += 1
    student = users.find_one({"mssv":mssv, "lecturer_id":user["_id"]})
    if not student:
     return jsonify({"error": "Không tìm thấy sinh viên"}), 404
    password = bcrypt.generate_password_hash(password).decode("utf-8")
    users.update_one({"_id": student["_id"]},
                     {"$set":{"username":username, "password":password}})
   
    send_email(get_email(student["hoten"],mssv),"Da cap tai khoan",f"Tai khoan cua ban: TK:{username}; MK: {password2}")
    print(password2)
    return jsonify({"message":"Tao thanh cong"})
    

@student_bp.route("/delete/<mssv>",methods=["POST"])
@jwt_required()
def delete_student(mssv):
    current_user=get_jwt_identity()
    user = User.find_by_username(current_user)
    users.delete_one({"mssv":mssv, "lecturer_id": user["_id"]})
    a = user["dssv"]
    a.remove(mssv)
    users.update_one({"_id": user["_id"]},
                     {"$set":{"dssv":a}})
    return jsonify({"message":"Xoa thanh cong"})
        
        
@student_bp.route("/get-all-student", methods=["GET"])
@jwt_required()
def getAllStudent():
    current_user = get_jwt_identity()
    user = User.find_by_username(current_user)
    
    student_ids = user.get("dssv", [])
    lecturer_id = user["_id"]
    
    student_list = list(users.find(
        {
            "mssv": {"$in": student_ids},
            "lecturer_id": lecturer_id
        },
        {
            "_id": 0,  # Ẩn trường _id
            "lecturer_id":0
        }
    )) 
    for student in student_list:
        notes = student.get('note', [])
        for n in notes:
            if '_id' in n:
               n['_id'] = str(n['_id'])
    
    return jsonify({"data": student_list, "message": "OK"})

@student_bp.route('/take-note/<mssv>',methods=['POST'])
@jwt_required()
def takeNote(mssv):
    current_user = get_jwt_identity()
    user = User.find_by_username(current_user)
    data = request.json
    message = data['note_message']
    sent = data['sent']
    title = data['title']
    student = users.find_one({'lecturer_id':user['_id'],'mssv':mssv})
    if not student:
        return jsonify({"error":"Khong tim thay student"}), 404
    note_data = {
            "_id":ObjectId(),
            "title": title,
            "message" : message,
            "sent": sent,
            "timestamp": datetime.utcnow()
        }
    if 'note' not in student:
        note = []
        note.append(note_data)
        users.update_one({"_id": student['_id']},
                         {"$set" :{"note": note}})
    else:
        note = student["note"]
        note.append(note_data)   
        users.update_one({"_id": student['_id']},
                         {"$set" :{"note": note}}) 
    return jsonify({"message":"ok"})


@student_bp.route('/get-all-note/<mssv>',methods=["GET"])
@jwt_required()
def getAllNote(mssv):
    current_user = get_jwt_identity()
    user = User.find_by_username(current_user)
    student = users.find_one({'lecturer_id':user['_id'],'mssv':mssv})
    notes = student.get('note', [])
    for n in notes:
        if '_id' in n:
           n['_id'] = str(n['_id'])
    if not student:
        return jsonify({"error":"Khong tim thay student"}), 404
    note = student.get('note')
    if not note:
        return jsonify({"note":[]})
    return jsonify({"message":"ok", "note": note})


@student_bp.route('/send-note/<mssv>/<noteId>',methods=['POST'])
@jwt_required()
def sendNote(mssv,noteId):
    current_user = get_jwt_identity()
    user = User.find_by_username(current_user)
    student = users.find_one({'lecturer_id':user['_id'],'mssv':mssv})
    if not student:
        return jsonify({"error": "Không tìm thấy sinh viên"}), 404

    result = users.update_one(
        {
            '_id':student['_id'],
            'note._id': ObjectId(noteId)
        },
        {
            '$set': {
                'note.$.sent': '1'
            }
        }
    )
    if result.modified_count == 1:
        return jsonify({"message": "Gửi ghi chú thành công"}), 200
    else:
        return jsonify({"error": "Không cập nhật được ghi chú"}), 400


@student_bp.route('/delete-note/<mssv>/<noteId>',methods=['POST'])
@jwt_required()
def DeleteNote(mssv,noteId):
    current_user = get_jwt_identity()
    user = User.find_by_username(current_user)
    student = users.find_one({'lecturer_id':user['_id'],'mssv':mssv})
    if not student:
        return jsonify({"error": "Không tìm thấy sinh viên"}), 404
    result = users.update_one(
        {'_id': student['_id']},
        {'$pull': {'note': {'_id': ObjectId(noteId)}}}
    )

    if result.modified_count == 1:
        return jsonify({"message": "Xóa ghi chú thành công"}), 200
    else:
        return jsonify({"error": "Không tìm thấy ghi chú để xóa"}), 404
    
    
    
#for student
@student_bp.route("/get-note",methods = ["GET"])
@jwt_required()
def getNode():
    current_user = get_jwt_identity() 
    student = users.find_one({"username": current_user})
    note_sent = []
    for note in student['note']:
        if note['sent'] == '1':
            note['_id'] = str(note['_id'])
            note_sent.append(note)
    return jsonify({"message": 'ok', 'note': note_sent})        
    