<?php
require 'config.php';

$maNVNghi = $_GET["maNVNghi"];

try {
    $stmt = $conn->prepare("DELETE FROM NghiViec WHERE MaNVNghi = :MaNVNghi");
    $stmt->execute(["MaNVNghi" => $maNVNghi]);
    echo json_encode(["status" => "success", "message" => "Xóa thông tin nghỉ việc thành công"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>