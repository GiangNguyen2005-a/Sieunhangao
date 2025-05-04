<?php
require 'config.php';

try {
    $stmt = $conn->prepare("SELECT * FROM ViTri");
    $stmt->execute();
    $positions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $positions]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>