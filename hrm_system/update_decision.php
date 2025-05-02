<?php
require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

try {
    $stmt = $conn->prepare("
        UPDATE QuyetDinh 
        SET SoQD = :SoQD, LoaiQD = :LoaiQD, MaNV = :MaNV, 
            NgayHieuLuc = :NgayHieuLuc, NoiDung = :NoiDung
        WHERE MaQD = :MaQD
    ");
    $stmt->execute([
        "MaQD" => $data["MaQD"],
        "SoQD" => $data["SoQD"],
        "LoaiQD" => $data["LoaiQD"],
        "MaNV" => $data["MaNV"],
        "NgayHieuLuc" => $data["NgayHieuLuc"],
        "NoiDung" => $data["NoiDung"]
    ]);
    echo json_encode(["status" => "success", "message" => "Cập nhật quyết định thành công"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>