<?php
require 'db_connect.php';

try {
    $stmt = $conn->prepare("
        SELECT qd.*, nv.TenNV 
        FROM QuyetDinh qd 
        LEFT JOIN NhanVien nv ON qd.MaNV = nv.MaNV
    ");
    $stmt->execute();
    $decisions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $decisions]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>