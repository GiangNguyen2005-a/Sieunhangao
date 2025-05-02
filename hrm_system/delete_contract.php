<?php
require 'db_connect.php';

$maHD = $_GET["maHD"];

try {
    $stmt = $conn->prepare("DELETE FROM HopDong WHERE MaHD = :MaHD");
    $stmt->execute(["MaHD" => $maHD]);
    echo json_encode(["status" => "success", "message" => "Xóa hợp đồng thành công"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>