<?php
require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

try {
    $stmt = $conn->prepare("
        INSERT INTO HopDong (MaHD, MaNV, SoHD, LoaiHD, NgayKy, NgayHieuLuc, NgayHetHan)
        VALUES (:MaHD, :MaNV, :SoHD, :LoaiHD, :NgayKy, :NgayHieuLuc, :NgayHetHan)
    ");
    $stmt->execute([
        "MaHD" => $data["MaHD"],
        "MaNV" => $data["MaNV"],
        "SoHD" => $data["SoHD"],
        "LoaiHD" => $data["LoaiHD"],
        "NgayKy" => $data["NgayKy"],
        "NgayHieuLuc" => $data["NgayHieuLuc"],
        "NgayHetHan" => $data["NgayHetHan"]
    ]);
    echo json_encode(["status" => "success", "message" => "Thêm hợp đồng thành công"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>