<?php
require 'config.php';

$maKL = $_GET["maKL"];

try {
    $stmt = $conn->prepare("DELETE FROM KyLuat WHERE MaKL = :MaKL");
    $stmt->execute(["MaKL" => $maKL]);
    echo json_encode(["status" => "success", "message" => "Xóa kỷ luật thành công"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>