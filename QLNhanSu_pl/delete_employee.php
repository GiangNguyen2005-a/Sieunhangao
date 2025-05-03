<?php
require 'config.php';

$maNV = $_GET["maNV"];

try {
    $stmt = $conn->prepare("DELETE FROM NhanVien WHERE MaNV = :MaNV");
    $stmt->execute(["MaNV" => $maNV]);
    echo json_encode(["status" => "success", "message" => "Xóa nhân viên thành công"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>