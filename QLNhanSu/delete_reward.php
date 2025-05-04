<?php
require 'config.php';

$maKT = $_GET["maKT"];

try {
    $stmt = $conn->prepare("DELETE FROM KhenThuong WHERE MaKT = :MaKT");
    $stmt->execute(["MaKT" => $maKT]);
    echo json_encode(["status" => "success", "message" => "Xóa khen thưởng thành công"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>