
<?php
header('Content-Type: application/json');
require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $maNV = $data['maNV'] ?? '';
    if (empty($maNV)) {
        echo json_encode(["error" => "Thiếu mã nhân viên"]);
        exit;
    }
    $sql = "SELECT 
    NhanVien.MaNV, 
    NhanVien.TenNV, 
    NhanVien.NgaySinh, 
    NhanVien.CCCD, 
    NhanVien.DiaChi, 
    thongtinthue.ThuNhapChinh,
    thongtinthue.Thuong, 
    thongtinthue.MaThue, 
    thongtinthue.PhuCap, 
    thongtinthue.NhomNhanVien, 
    thongtinthue.BaoHiem, 
    thongtinthue.GiamTru
FROM 
    NhanVien
LEFT JOIN 
    thongtinthue ON NhanVien.MaNV = thongtinthue.MaNV
WHERE 
    NhanVien.MaNV = ?";
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