# Quản Lý Mục Tiêu Giảng

Dự án quản lý mục tiêu giảng dạy được phát triển bằng PHP và MySQL.

## Yêu cầu hệ thống

- PHP 7.4 trở lên
- MySQL 5.7 trở lên
- XAMPP hoặc tương đương
- Trình duyệt web hiện đại
- Kết nối internet (để tải các thư viện CSS và JS)

## Cài đặt và cấu hình

### 1. Cài đặt XAMPP

- Tải XAMPP từ trang chủ: https://www.apachefriends.org/
- Chọn phiên bản phù hợp với hệ điều hành của bạn
- Chạy file cài đặt và làm theo hướng dẫn
- Đảm bảo chọn cài đặt cả Apache và MySQL

### 2. Cấu hình cơ sở dữ liệu

1. Khởi động XAMPP:

   - Mở XAMPP Control Panel
   - Nhấn "Start" cho Apache và MySQL
   - Đợi cho đến khi cả hai dịch vụ chuyển sang màu xanh lá cây

2. Tạo cơ sở dữ liệu:

   - Mở trình duyệt web
   - Truy cập: http://localhost/phpmyadmin
   - Nhấn "New" để tạo database mới
   - Đặt tên database là `quanlymuctieugiang`
   - Chọn "Create"

3. Import cấu trúc database:
   - Trong phpMyAdmin, chọn database vừa tạo
   - Chọn tab "Import"
   - Nhấn "Choose File" và chọn file SQL từ thư mục `database` của dự án
   - Nhấn "Go" để import

### 3. Cấu hình dự án

1. Đặt mã nguồn:

   - Copy toàn bộ thư mục dự án vào thư mục `htdocs` của XAMPP
   - Đường dẫn thường là: `C:\xampp\htdocs\quanLyMucTieuGiang` (Windows) hoặc `/Applications/XAMPP/xamppfiles/htdocs/quanLyMucTieuGiang` (Mac)

2. Cấu hình kết nối database:
   - Mở file `config.php`
   - Kiểm tra và cập nhật các thông tin sau nếu cần:
     ```php
     $servername = "localhost";
     $username = "root";    // Tên đăng nhập MySQL mặc định của XAMPP
     $password = "";        // Mật khẩu MySQL mặc định của XAMPP
     $dbname = "quanlymuctieugiang";
     ```

## Chạy file muc_tieu.php

1. Khởi động dịch vụ:

   - Mở XAMPP Control Panel
   - Đảm bảo Apache và MySQL đang chạy (màu xanh lá cây)

2. Truy cập file:

   - Mở trình duyệt web
   - Truy cập địa chỉ: http://localhost/quanLyMucTieuGiang/muc_tieu.php

3. Kiểm tra các thành phần:
   - Giao diện sẽ hiển thị danh sách mục tiêu
   - Có thể tìm kiếm, lọc theo trạng thái và phân chuyền
   - Có thể thêm, sửa, xóa mục tiêu

## Xử lý lỗi thường gặp

1. Lỗi kết nối database:

   - Kiểm tra XAMPP đã chạy chưa
   - Kiểm tra thông tin kết nối trong `config.php`
   - Kiểm tra database đã được tạo và import chưa

2. Lỗi hiển thị giao diện:

   - Kiểm tra kết nối internet
   - Kiểm tra các file CSS và JS đã được tải đúng
   - Kiểm tra console của trình duyệt để xem lỗi

3. Lỗi PHP:
   - Kiểm tra phiên bản PHP
   - Kiểm tra các extension PHP cần thiết đã được bật
   - Kiểm tra log lỗi của PHP

## Hỗ trợ

tìm hiểu thêm ở link: https://unitop.com.vn/ke-noi-php-mysql.html/
