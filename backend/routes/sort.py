from flask import Flask, request, jsonify,Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import users,User
from queue import Queue
from itertools import combinations
INF = 2147483647
NIL = None

sort_bp=Blueprint("sort",__name__)

class BipGraph:
    def __init__(self, people, time_slots):
        """Khởi tạo đồ thị hai phía từ danh sách người và các khoảng thời gian"""
        self.people = people  # Danh sách người (tập U)
        self.time_slots = time_slots  # Danh sách thời gian (tập V)
        self.n = len(people)
        self.m = len(time_slots)
        self.adj = {person: [] for person in people}  # Danh sách kề

    def addEdge(self, person, time_slot):
        """Thêm cạnh từ một người đến một khoảng thời gian khả dụng"""
        if person in self.adj:
            self.adj[person].append(time_slot)

    def bfs(self):
        """Tìm đường tăng bằng BFS"""
        Q = Queue()
        for person in self.people:
            if self.pairU[person] == NIL:  # Nếu chưa được ghép
                self.dist[person] = 0
                Q.put(person)
            else:
                self.dist[person] = INF

        self.dist[NIL] = INF  # Khoảng cách từ NIL là vô cực

        while not Q.empty():
            person = Q.get()
            if self.dist[person] < self.dist[NIL]:
                for time in self.adj[person]:
                    if self.dist[self.pairV[time]] == INF:
                        self.dist[self.pairV[time]] = self.dist[person] + 1
                        Q.put(self.pairV[time])

        return self.dist[NIL] != INF

    def dfs(self, person):
        """Dùng DFS để tìm đường tăng"""
        if person != NIL:
            for time in self.adj[person]:
                if self.dist[self.pairV[time]] == self.dist[person] + 1:
                    if self.dfs(self.pairV[time]):
                        self.pairV[time] = person
                        self.pairU[person] = time
                        return True
            self.dist[person] = INF
            return False
        return True

    def hopcroftKarp(self):
        """Tìm matching cực đại"""
        self.pairU = {person: NIL for person in self.people}  # Matching của nhóm người
        self.pairV = {time: NIL for time in self.time_slots}  # Matching của nhóm thời gian
        self.dist = {person: 0 for person in self.people}  # Khoảng cách trong BFS
        self.dist[NIL] = INF  # Đặt khoảng cách của NIL

        matching_size = 0
        while self.bfs():
            for person in self.people:
                if self.pairU[person] == NIL and self.dfs(person):
                    matching_size += 1
        return matching_size

    def getMatchingPairs(self):
        """Trả về danh sách các cặp matching"""
        return [(person, time) for time, person in self.pairV.items() if person != NIL]
    

def getEdge(time,schedule):
    for key,value in schedule.items():
        for value2 in value:
            a = float(value2["start_time"])
            b = float(value2['end_time'])
            a = 24*(int(key)-2) + a
            b = 24*(int(key)-2) + b
            if time >= a and time <= b:
                return 1
    return 0        

@sort_bp.route('/sort-schedule',methods=['POST'])
@jwt_required()
def sort():
    current_user= get_jwt_identity()
    data = request.json
    dssv = data.get("dssv")
    user = User.find_by_username(current_user)
    dis = float(user['duration'])
    lec_sche = []
    day = []
    for key,value in user['schedule'].items():
        if value:
            day.append(int(key))
        for value2 in value:
            a = float(value2["start_time"])
            b = float(value2['end_time'])
            while(a<b):
                lec_sche.append(24*(int(key)-2)+a)
                a = a + dis
    all_combinations = []
    for r in range(1, len(day) + 1):
        all_combinations.extend(combinations(day, r))

    # Chuyển danh sách tổ hợp từ tuple sang list
    all_combinations = [list(combo) for combo in all_combinations]
    
    check = -1e9
    schedule = list()
    days = list()        
    for whichday in all_combinations:
        copylec_sche= lec_sche.copy() 
        ok = [0] * len(lec_sche)
        for day in whichday:
            a = (day-2)*24
            b = a + 24
            i = 0
            while(i<len(ok)):
                if(copylec_sche[i]>=a and copylec_sche[i]<=b):
                    ok[i] = 1
                i = i + 1    
        i = 0
        while(i < len(lec_sche)):
            if(ok[i] != 1): 
                copylec_sche[i] = -1
            i = i + 1
        
        g = BipGraph(dssv, copylec_sche)
        j = 0
        print(dssv)
        while(j < len(dssv)):
            s = users.find_one({
            "mssv": dssv[j][:8],
            "lecturer_id": user['_id']
            })
            print(s)
            if s and 'schedule' in s:
               for time in copylec_sche:
                   if getEdge(time, s['schedule']) == 1:
                       g.addEdge(s['mssv']+'-'+s['hoten'], time)
            else:
                print(f"Lỗi: sinh viên {s['mssv'] if s else dssv[j]} không có trường 'schedule'")
            j = j + 1

        max_matching = g.hopcroftKarp() 
        matching_pairs = g.getMatchingPairs()
        if(max_matching>check):
            check = max_matching
            schedule = matching_pairs
            days=whichday
            if(max_matching == len(dssv)):
               break
    print("Days: ",days)            
    print("Max matching: ",check)
    print(schedule)
    users.update_one(
            {"username": current_user},         # Điều kiện lọc (filter)
            {"$set": {"lichhen": schedule}}
        )       
    # return jsonify({"message": "OK","schedule_res":schedule})
    return jsonify({"message": "OK"})

@sort_bp.route('/get-lichhen',methods=['GET'])
@jwt_required()
def getLichhen():
    current_user=get_jwt_identity()
    user = User.find_by_username(current_user)
    res = user['lichhen']
    if(not res):
        return jsonify({'error':"Chua xep lich hen"}), 404
    return jsonify({'message':'OK', 'lichhen':res})
    
