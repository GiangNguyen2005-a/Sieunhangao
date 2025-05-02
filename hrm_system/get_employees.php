<?php
require 'db_connect.php';

try {
    $stmt = $conn->prepare("
        SELECT nv.*, pb.TenPB, vt.TenVT 
        FROM NhanVien nv 
        LEFT JOIN PhongBan pb ON nv.MaPB = pb.MaPB 
        LEFT JOIN ViTri vt ON nv.MaVT = vt.MaVT
    ");
    $stmt->execute();
    $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $employees]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>