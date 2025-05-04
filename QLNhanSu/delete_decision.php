<?php
require 'config.php';

$maQD = $_GET["maQD"];

try {
    $stmt = $conn->prepare("DELETE FROM QuyetDinh WHERE MaQD = :MaQD");
    $stmt->execute(["MaQD" => $maQD]);
    echo json_encode(["status" => "success", "message" => "Xóa quyết định thành công"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>