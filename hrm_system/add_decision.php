<?php
require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

try {
    $stmt = $conn->prepare("
        INSERT INTO QuyetDinh (MaQD, SoQD, LoaiQD, MaNV, NgayHieuLuc, NoiDung)
        VALUES (:MaQD, :SoQD, :LoaiQD, :MaNV, :NgayHieuLuc, :NoiDung)
    ");
    $stmt->execute([
        "MaQD" => $data["MaQD"],
        "SoQD" => $data["SoQD"],
        "LoaiQD" => $data["LoaiQD"],
        "MaNV" => $data["MaNV"],
        "NgayHieuLuc" => $data["NgayHieuLuc"],
        "NoiDung" => $data["NoiDung"]
    ]);
    echo json_encode(["status" => "success", "message" => "Thêm quyết định thành công"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>