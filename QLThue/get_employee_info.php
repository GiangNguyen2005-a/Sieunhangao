
<?php
header('Content-Type: application/json');
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $maNV = $_POST['maNV'] ?? '';

    if (empty($maNV)) {
        echo json_encode(["error" => "Thiếu mã nhân viên"]);
        exit;
    }

    $sql = "SELECT MaNV, TenNV, NgaySinh, CCCD, DiaChi 
            FROM NhanVien 
            WHERE MaNV = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $maNV);
    $stmt->execute();
    $result = $stmt->get_result();
    $employee = $result->fetch_assoc();

    if ($employee) {
        echo json_encode(["success" => true, "data" => $employee]);
    } else {
        echo json_encode(["error" => "Không tìm thấy nhân viên"]);
    }

    $stmt->close();
}

$conn->close();
?>