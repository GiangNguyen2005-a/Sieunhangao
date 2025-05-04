<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

try {
    $stmt = $conn->prepare("
        UPDATE NhanVien 
        SET TenNV = :TenNV, NgaySinh = :NgaySinh, GioiTinh = :GioiTinh, CCCD = :CCCD, 
            SDT = :SDT, DiaChi = :DiaChi, MaPB = :MaPB, MaVT = :MaVT, 
            NgayVaoLam = :NgayVaoLam, ChungChi = :ChungChi
        WHERE MaNV = :MaNV
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
    echo json_encode(["status" => "success", "message" => "Cập nhật nhân viên thành công"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>