<?php
include '../Chung/config.php';

header('Content-Type: application/json');
// Lấy mã nhân viên từ tham số GET
$ma_nhan_vien = $_GET['manv'];

// Truy vấn cơ sở dữ liệu
$sql = "SELECT * FROM nhanvien nv
        LEFT JOIN vitri vt ON vt.mavt = nv.mavt
        LEFT JOIN phongban pb ON pb.mapb = nv.mapb
        LEFT JOIN ttbh tt ON tt.manv = nv.manv
        WHERE nv.manv = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $ma_nhan_vien); // "s" biểu thị kiểu string
$stmt->execute();
$result = $stmt->get_result();

$data = [];
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc(); // Lấy dữ liệu nhân viên
    echo json_encode($row); // Trả về dữ liệu dưới dạng JSON
} else {
    echo json_encode(['error' => 'Không tìm thấy nhân viên']); // Trả về lỗi nếu không tìm thấy
}
// Đóng kết nối
$stmt->close();
$conn->close();

?>