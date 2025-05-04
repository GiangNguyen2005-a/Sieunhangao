<?php
require 'config.php';

try {
    $stmt = $conn->prepare("
        SELECT kl.*, nv.TenNV 
        FROM KyLuat kl 
        LEFT JOIN NhanVien nv ON kl.MaNV = nv.MaNV
    ");
    $stmt->execute();
    $disciplines = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $disciplines]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>