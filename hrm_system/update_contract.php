<?php
require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

try {
    $stmt = $conn->prepare("
        UPDATE HopDong 
        SET MaNV = :MaNV, SoHD = :SoHD, LoaiHD = :LoaiHD, 
            NgayKy = :NgayKy, NgayHieuLuc = :NgayHieuLuc, NgayHetHan = :NgayHetHan
        WHERE MaHD = :MaHD
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
    echo json_encode(["status" => "success", "message" => "Cập nhật hợp đồng thành công"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>