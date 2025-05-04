<?php
require 'config.php';

try {
    $stmt = $conn->prepare("
        SELECT kt.*, nv.TenNV 
        FROM KhenThuong kt 
        LEFT JOIN NhanVien nv ON kt.MaNV = nv.MaNV
    ");
    $stmt->execute();
    $rewards = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $rewards]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>