<?php
// Nhúng file cấu hình kết nối database
require_once 'config.php';

// Kiểm tra xem có tham số id được truyền vào qua URL không
if (!isset($_GET['id']) || empty($_GET['id'])) {
    // Nếu không có id, chuyển hướng về trang danh sách phân chuyền
    header('Location: phan_chuyen.php');
    exit();
}

// Lấy id phân chuyền cần xóa từ URL
$id = $_GET['id'];

// Chuẩn bị câu lệnh SQL để xóa phân chuyền
$sql = "DELETE FROM phan_chuyen WHERE id = ?";

// Chuẩn bị statement để thực thi câu lệnh SQL
$stmt = mysqli_prepare($conn, $sql);

// Gán giá trị cho tham số id trong câu lệnh SQL
mysqli_stmt_bind_param($stmt, "i", $id);

// Thực thi câu lệnh xóa
if (mysqli_stmt_execute($stmt)) {
    // Nếu xóa thành công, chuyển hướng về trang danh sách phân chuyền
    header('Location: phan_chuyen.php');
} else {
    // Nếu có lỗi, chuyển hướng về trang danh sách với thông báo lỗi
    header('Location: phan_chuyen.php?error=' . urlencode("Không thể xóa phân chuyền"));
}

// Đóng statement và kết nối database
mysqli_stmt_close($stmt);
mysqli_close($conn);
?> 