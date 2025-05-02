<?php
require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

try {
    $stmt = $conn->prepare("
        INSERT INTO KyLuat (MaKL, MaNV, SoBBQD, NgayViPham, HinhThucKL, LyDoKL)
        VALUES (:MaKL, :MaNV, :SoBBQD, :NgayViPham, :HinhThucKL, :LyDoKL)
    ");
    $stmt->execute([
        "MaKL" => $data["MaKL"],
        "MaNV" => $data["MaNV"],
        "SoBBQD" => $data["SoBBQD"],
        "NgayViPham" => $data["NgayViPham"],
        "HinhThucKL" => $data["HinhThucKL"],
        "LyDoKL" => $data["LyDoKL"]
    ]);
    echo json_encode(["status" => "success", "message" => "Thêm kỷ luật thành công"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>