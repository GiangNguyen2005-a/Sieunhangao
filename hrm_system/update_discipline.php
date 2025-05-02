<?php
require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

try {
    $stmt = $conn->prepare("
        UPDATE KyLuat 
        SET MaNV = :MaNV, SoBBQD = :SoBBQD, NgayViPham = :NgayViPham, 
            HinhThucKL = :HinhThucKL, LyDoKL = :LyDoKL
        WHERE MaKL = :MaKL
    ");
    $stmt->execute([
        "MaKL" => $data["MaKL"],
        "MaNV" => $data["MaNV"],
        "SoBBQD" => $data["SoBBQD"],
        "NgayViPham" => $data["NgayViPham"],
        "HinhThucKL" => $data["HinhThucKL"],
        "LyDoKL" => $data["LyDoKL"]
    ]);
    echo json_encode(["status" => "success", "message" => "Cập nhật kỷ luật thành công"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>