<?php
// Cấu hình thông tin kết nối database
$host = 'localhost';         // Địa chỉ máy chủ database
$username = 'root';         // Tên đăng nhập database
$password = '';            // Mật khẩu database
$database = 'quanlydanhgia'; // Tên database

// Tạo kết nối đến database sử dụng mysqli
$conn = mysqli_connect($host, $username, $password, $database);

// Kiểm tra kết nối có thành công không
if (!$conn) {
    // Nếu kết nối thất bại, hiển thị thông báo lỗi và dừng script
    die("Kết nối thất bại: " . mysqli_connect_error());
}

// Định nghĩa các biến cho PDO
$dsn = "mysql:host=$host;dbname=$database;charset=utf8"; // Chuỗi DSN cho MySQL
$user = $username;                                       // Tên người dùng
$pass = $password;                                       // Mật khẩu

try {
    // Khởi tạo PDO, bật ERRMODE cho Exception
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Nếu không kết nối được, dừng script và xuất lỗi
    die("Kết nối thất bại: " . $e->getMessage());
}

// Thiết lập bảng mã UTF-8 cho kết nối để hỗ trợ tiếng Việt
mysqli_set_charset($conn, 'utf8');
?>