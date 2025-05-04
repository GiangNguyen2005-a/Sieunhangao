<?php
require 'config.php';

try {
    $stmt = $conn->prepare("
        SELECT nvnghi.*, nv.TenNV 
        FROM NghiViec nvnghi 
        LEFT JOIN NhanVien nv ON nvnghi.MaNV = nv.MaNV
    ");
    $stmt->execute();
    $terminations = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $terminations]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>