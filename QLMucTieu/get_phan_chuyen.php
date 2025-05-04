<?php
// Nhúng file cấu hình kết nối database
require_once 'config.php';

// Kiểm tra xem có tham số ma_phong được truyền vào không
if (isset($_GET['ma_phong']) && !empty($_GET['ma_phong'])) {
    // Nếu có ma_phong, lấy danh sách phân chuyền theo phòng ban
    $ma_phong = $_GET['ma_phong'];
    $sql = "SELECT ma_chuyen, ten_chuyen FROM phan_chuyen WHERE ma_phong = ? ORDER BY ma_chuyen";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $ma_phong);
} else {
    // Nếu không có ma_phong, lấy tất cả phân chuyền
    $sql = "SELECT ma_chuyen, ten_chuyen FROM phan_chuyen ORDER BY ma_chuyen";
    $stmt = mysqli_prepare($conn, $sql);
}

// Thực thi câu lệnh SQL
mysqli_stmt_execute($stmt);

// Lấy kết quả từ statement
$result = mysqli_stmt_get_result($stmt);

// Tạo mảng để lưu kết quả
$phan_chuyen = [];

// Lấy dữ liệu từ kết quả
while ($row = mysqli_fetch_assoc($result)) {
    $phan_chuyen[] = $row;
}

// Trả về kết quả dưới dạng JSON
echo json_encode($phan_chuyen);

// Đóng statement và kết nối database
mysqli_stmt_close($stmt);
mysqli_close($conn);
?> 