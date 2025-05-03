<?php
// Cấu hình thông tin kết nối database
$host = 'localhost';         // Địa chỉ máy chủ database
$username = 'root';         // Tên đăng nhập database
$password = '';            // Mật khẩu database
$database = 'quanlynhansu'; // Tên database

// Tạo kết nối đến database sử dụng mysqli
$conn = mysqli_connect($host, $username, $password, $database);

// Kiểm tra kết nối có thành công không
if (!$conn) {
    // Nếu kết nối thất bại, hiển thị thông báo lỗi và dừng script
    die("Kết nối thất bại: " . mysqli_connect_error());
}

// Thiết lập bảng mã UTF-8 cho kết nối để hỗ trợ tiếng Việt
mysqli_set_charset($conn, 'utf8');
?> 