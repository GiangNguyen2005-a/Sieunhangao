<?php
header('Content-Type: application/json');
require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);
$maTK = $data['maTK'] ?? '';

if (empty($maTK)) {
    echo json_encode(["error" => "Mã tờ khai (maTK) là bắt buộc"]);
    exit;
}

$sql = "SELECT tk.MaTK, tk.MaNV, tk.KyKeKhai, tk.TongThuNhap, tk.TongThuePhaiNop, nv.TenNV as name, pb.TenPB as department
        FROM ToKhaiThue tk
        JOIN NhanVien nv ON tk.MaNV = nv.MaNV
        JOIN PhongBan pb ON nv.MaPB = pb.MaPB
        WHERE tk.MaTK = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $maTK);
$stmt->execute();

$result = $stmt->get_result();

$row = $result->fetch_assoc();

if (!$row) {
    echo json_encode(["error" => "Không tìm thấy tờ khai thuế với mã TK: " . $maTK]);
} else {
    echo json_encode($row);
}

$stmt->close();
$conn->close();
?>
