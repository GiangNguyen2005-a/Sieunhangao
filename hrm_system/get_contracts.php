<?php
require 'db_connect.php';

try {
    $stmt = $conn->prepare("
        SELECT hd.*, nv.TenNV 
        FROM HopDong hd 
        LEFT JOIN NhanVien nv ON hd.MaNV = nv.MaNV
    ");
    $stmt->execute();
    $contracts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $contracts]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>