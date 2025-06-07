#  Hướng dẫn cách chạy
 -> backend chạy lệnh:  python app.py
 -> frontend chạy lệnh: npm run dev
 -> Truy cập vào đường dẫn:  http://localhost:5173/login
# Mô tả chương trình:
-Giảng viên đăng nhập vào chương trình với vai trò "lecturer", tạo danh sách sinh viên, cung cấp cho sinh viên tài khoản với vai trò "student" qua email trường của sinh viên(xem log phía backend để xem tk mk của sinh viên).
-Giảng viên và sinh viên chọn khung giờ rảnh trong tuần, sinh viên dùng tài khoản được giảng viên cấp
-Giảng viên lựa chọn chức năng xếp lịch, hệ thống đưa ra lịch gặp sinh viên trong tuần
# CHÚ Ý: 
Chức năng xếp lịch chỉ sử dụng được khi đã có sinh viên và có lịch hẹn thỏa mãn 
Yêu cầu:  MongoDB (chạy local tại mongodb://localhost:27017)

# DEMO với 1 sinh viên (tương tự nếu thêm nhiều sinh viên hơn)
Giao diện thêm sinh viên
![image](https://github.com/user-attachments/assets/909627ec-12bf-48be-9a60-258d531d1040)

Ví dụ về tài khoản của 1 sinh viên
![image](https://github.com/user-attachments/assets/c7e2869c-31c5-4498-99f6-480ee05a87be)

Giao diện khi login bằng tài khoản sinh viên
![image](https://github.com/user-attachments/assets/9e2249b0-d176-484f-a9ec-ac39481c4a34)

Sinh viên thêm lịch thứ 2 và thứ 3
![image](https://github.com/user-attachments/assets/48ac955e-5acc-497e-8b62-0529bd87975f)

Giảng viên chọn thời gian mỗi cuộc hẹn với 1 bạn sinh viên và chọn thời gian rảnh( Ví dụ thứ 2)
![image](https://github.com/user-attachments/assets/5983475e-4907-40a5-8b16-5300d470e828)

Giảng viên chọn danh sách sinh viên để xếp lịch hẹn
![image](https://github.com/user-attachments/assets/90746fb7-0e38-445d-a6d0-ddccfd20d74f)

Kết quả lịch hẹn với sinh viên vừa chọn
![image](https://github.com/user-attachments/assets/22cc908a-830f-4d71-8c80-890abfde285b)







