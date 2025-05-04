<?php
require 'config.php';

try {
    $stmt = $conn->prepare("SELECT * FROM PhongBan");
    $stmt->execute();
    $departments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $departments]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>