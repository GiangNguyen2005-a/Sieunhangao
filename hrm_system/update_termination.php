<?php
require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

try {
    $stmt = $conn->prepare("
        UPDATE NghiViec 
        SET MaNV = :MaNV, NgayNopDon = :NgayNopDon, NgayNghi = :NgayNghi, 
            LyDoNghi = :LyDoNghi, TrangThai = :TrangThai
        WHERE MaNVNghi = :MaNVNghi
    ");
    $stmt->execute([
        "MaNVNghi" => $data["MaNVNghi"],
        "MaNV" => $data["MaNV"],
        "NgayNopDon" => $data["NgayNopDon"],
        "NgayNghi" => $data["NgayNghi"],
        "LyDoNghi" => $data["LyDoNghi"],
        "TrangThai" => $data["TrangThai"]
    ]);
    echo json_encode(["status" => "success", "message" => "Cập nhật thông tin nghỉ việc thành công"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>