<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

try {
    $stmt = $conn->prepare("
        INSERT INTO NhanVien (MaNV, TenNV, NgaySinh, GioiTinh, CCCD, SDT, DiaChi, MaPB, MaVT, NgayVaoLam, ChungChi)
        VALUES (:MaNV, :TenNV, :NgaySinh, :GioiTinh, :CCCD, :SDT, :DiaChi, :MaPB, :MaVT, :NgayVaoLam, :ChungChi)
    ");
    $stmt->execute([
        "MaNV" => $data["MaNV"],
        "TenNV" => $data["TenNV"],
        "NgaySinh" => $data["NgaySinh"],
        "GioiTinh" => $data["GioiTinh"],
        "CCCD" => $data["CCCD"],
        "SDT" => $data["SDT"],
        "DiaChi" => $data["DiaChi"],
        "MaPB" => $data["MaPB"],
        "MaVT" => $data["MaVT"],
        "NgayVaoLam" => $data["NgayVaoLam"],
        "ChungChi" => $data["ChungChi"]
    ]);
    echo json_encode(["status" => "success", "message" => "Thêm nhân viên thành công"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>