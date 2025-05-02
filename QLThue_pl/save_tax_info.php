
<?php
header('Content-Type: application/json');
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $maThue = 'THUE' . substr(time(), -6);
    $maNV = $_POST['maNV'] ?? '';
    $mst = $_POST['mst'] ?? '';
    $quocTich = $_POST['quocTich'] ?? '';
    $thuNhapChinh = $_POST['thuNhap'] ?? 0;
    $thuong = $_POST['thuong'] ?? 0;
    $phuCap = $_POST['phuCap'] ?? 0;
    $giamTru = $_POST['giamTru'] ?? 0;
    $baoHiem = $_POST['baoHiem'] ?? 0;
    $nhomNV = $_POST['nhomNV'] ?? '';

    if (empty($maNV) || empty($mst)) {
        echo json_encode(["error" => "Thiếu thông tin bắt buộc"]);
        exit;
    }

    $sql = "INSERT INTO ThongTinThue (MaThue, MaNV, MST, QuocTich, ThuNhapChinh, Thuong, PhuCap, GiamTru, BaoHiem, NhomNhanVien) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssddddds", $maThue, $maNV, $mst, $quocTich, $thuNhapChinh, $thuong, $phuCap, $giamTru, $baoHiem, $nhomNV);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Lưu thông tin thuế thành công", "maThue" => $maThue]);
    } else {
        echo json_encode(["error" => "Lưu thất bại: " . $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>