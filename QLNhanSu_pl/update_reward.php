<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

try {
    $stmt = $conn->prepare("
        UPDATE KhenThuong 
        SET MaNV = :MaNV, SoQD = :SoQD, NgayQD = :NgayQD, 
            HinhThucKT = :HinhThucKT, LyDoKT = :LyDoKT, MucThuong = :MucThuong
        WHERE MaKT = :MaKT
    ");
    $stmt->execute([
        "MaKT" => $data["MaKT"],
        "MaNV" => $data["MaNV"],
        "SoQD" => $data["SoQD"],
        "NgayQD" => $data["NgayQD"],
        "HinhThucKT" => $data["HinhThucKT"],
        "LyDoKT" => $data["LyDoKT"],
        "MucThuong" => $data["MucThuong"]
    ]);
    echo json_encode(["status" => "success", "message" => "Cập nhật khen thưởng thành công"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>