<?php
require 'config.php';

$startDate = isset($_GET["startDate"]) ? $_GET["startDate"] : null;
$endDate = isset($_GET["endDate"]) ? $_GET["endDate"] : null;
$department = isset($_GET["department"]) ? $_GET["department"] : null;

try {
    // Tổng số nhân viên
    $query = "SELECT COUNT(*) as total FROM NhanVien";
    $conditions = [];
    $params = [];
    if ($department) {
        $conditions[] = "MaPB = :MaPB";
        $params["MaPB"] = $department;
    }
    if ($startDate && $endDate) {
        $conditions[] = "NgayVaoLam BETWEEN :startDate AND :endDate";
        $params["startDate"] = $startDate;
        $params["endDate"] = $endDate;
    }
    if ($conditions) {
        $query .= " WHERE " . implode(" AND ", $conditions);
    }
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $totalEmployees = $stmt->fetch(PDO::FETCH_ASSOC)["total"];

    // Theo phòng ban
    $query = "
        SELECT pb.TenPB, COUNT(nv.MaNV) as count 
        FROM NhanVien nv 
        LEFT JOIN PhongBan pb ON nv.MaPB = pb.MaPB
    ";
    $conditions = [];
    $params = [];
    if ($department) {
        $conditions[] = "nv.MaPB = :MaPB";
        $params["MaPB"] = $department;
    }
    if ($startDate && $endDate) {
        $conditions[] = "nv.NgayVaoLam BETWEEN :startDate AND :endDate";
        $params["startDate"] = $startDate;
        $params["endDate"] = $endDate;
    }
    if ($conditions) {
        $query .= " WHERE " . implode(" AND ", $conditions);
    }
    $query .= " GROUP BY nv.MaPB";
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $byDepartment = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $byDepartment[$row["TenPB"] ?: "Chưa phân bổ"] = $row["count"];
    }

    // Theo loại hợp đồng
    $query = "
        SELECT hd.LoaiHD, COUNT(hd.MaHD) as count 
        FROM HopDong hd 
        LEFT JOIN NhanVien nv ON hd.MaNV = nv.MaNV
    ";
    $conditions = [];
    $params = [];
    if ($department) {
        $conditions[] = "nv.MaPB = :MaPB";
        $params["MaPB"] = $department;
    }
    if ($startDate && $endDate) {
        $conditions[] = "hd.NgayHieuLuc BETWEEN :startDate AND :endDate";
        $params["startDate"] = $startDate;
        $params["endDate"] = $endDate;
    }
    if ($conditions) {
        $query .= " WHERE " . implode(" AND ", $conditions);
    }
    $query .= " GROUP BY hd.LoaiHD";
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $byContractType = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $byContractType[$row["LoaiHD"]] = $row["count"];
    }

    echo json_encode([
        "status" => "success",
        "totalEmployees" => $totalEmployees,
        "byDepartment" => $byDepartment,
        "byContractType" => $byContractType
    ]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>