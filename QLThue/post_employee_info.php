<?php
header('Content-Type: application/json');
require 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// Lấy dữ liệu JSON từ body (dù là POST hay PUT)
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "Dữ liệu không hợp lệ"]);
    exit;
}

// Lấy biến
$maNV = $data['MaNV'] ?? '';
$tenNV = $data['TenNV'] ?? '';
$ngaySinh = $data['NgaySinh'] ?? '';
$cccd = $data['CCCD'] ?? '';
$diaChi = $data['DiaChi'] ?? '';
$thuNhapChinh = $data['ThuNhapChinh'] ?? '';
$thuong = $data['Thuong'] ?? '';
$maThue = $data['MaThue'] ?? '';
$phuCap = $data['PhuCap'] ?? '';
$nhomNhanVien = $data['NhomNhanVien'] ?? '';
$baoHiem = $data['BaoHiem'] ?? '';
$giamTru = $data['GiamTru'] ?? '';

if ($method === 'POST') {
    // Validate MaNV không được trống khi thêm mới
    if (empty($maNV)) {
        echo json_encode(["error" => "Thiếu mã nhân viên khi thêm mới"]);
        exit;
    }

    // Insert NhanVien
    $stmt = $conn->prepare("INSERT INTO NhanVien (MaNV, TenNV, NgaySinh, CCCD, DiaChi) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $maNV, $tenNV, $ngaySinh, $cccd, $diaChi);
    $stmt->execute();
    $stmt->close();

    // Insert thongtinthue
    $stmt2 = $conn->prepare("INSERT INTO thongtinthue (MaNV, ThuNhapChinh, Thuong, MaThue, PhuCap, NhomNhanVien, BaoHiem, GiamTru) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt2->bind_param("ssssssss", $maNV, $thuNhapChinh, $thuong, $maThue, $phuCap, $nhomNhanVien, $baoHiem, $giamTru);
    $stmt2->execute();
    $stmt2->close();

    echo json_encode(["success" => true, "message" => "Đã thêm mới nhân viên"]);

} elseif ($method === 'PUT') {
    if (empty($maNV)) {
        echo json_encode(["error" => "Thiếu mã nhân viên khi cập nhật"]);
        exit;
    }

    // Update NhanVien
    $stmt = $conn->prepare("UPDATE NhanVien SET TenNV=?, NgaySinh=?, CCCD=?, DiaChi=? WHERE MaNV=?");
    $stmt->bind_param("sssss", $tenNV, $ngaySinh, $cccd, $diaChi, $maNV);
    $stmt->execute();
    $stmt->close();

    // Update thongtinthue
    $stmt2 = $conn->prepare("UPDATE thongtinthue SET ThuNhapChinh=?, Thuong=?, MaThue=?, PhuCap=?, NhomNhanVien=?, BaoHiem=?, GiamTru=? WHERE MaNV=?");
    $stmt2->bind_param("ssssssss", $thuNhapChinh, $thuong, $maThue, $phuCap, $nhomNhanVien, $baoHiem, $giamTru, $maNV);
    $stmt2->execute();
    $stmt2->close();

    echo json_encode(["success" => true, "message" => "Đã cập nhật thông tin nhân viên"]);

} else {
    echo json_encode(["error" => "Phương thức không hợp lệ"]);
}

$conn->close();
?>
