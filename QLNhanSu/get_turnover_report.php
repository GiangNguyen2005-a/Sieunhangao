<?php
require 'config.php';

$startDate = isset($_GET["startDate"]) ? $_GET["startDate"] : null;
$endDate = isset($_GET["endDate"]) ? $_GET["endDate"] : null;
$department = isset($_GET["department"]) ? $_GET["department"] : null;

try {
    // Số nhân viên mới
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
    $newEmployees = $stmt->fetch(PDO::FETCH_ASSOC)["total"];

    // Số nhân viên nghỉ
    $query = "SELECT COUNT(*) as total FROM NghiViec";
    $conditions = [];
    $params = [];
    if ($department) {
        $conditions[] = "MaNV IN (SELECT MaNV FROM NhanVien WHERE MaPB = :MaPB)";
        $params["MaPB"] = $department;
    }
    if ($startDate && $endDate) {
        $conditions[] = "NgayNghi BETWEEN :startDate AND :endDate";
        $params["startDate"] = $startDate;
        $params["endDate"] = $endDate;
    }
    if ($conditions) {
        $query .= " WHERE " . implode(" AND ", $conditions);
    }
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $terminatedEmployees = $stmt->fetch(PDO::FETCH_ASSOC)["total"];

    // Biến động theo tháng
    $byMonth = [];
    if ($startDate && $endDate) {
        $start = new DateTime($startDate);
        $end = new DateTime($endDate);
        $interval = new DateInterval('P1M'); // 1 tháng
        $period = new DatePeriod($start, $interval, $end);

        foreach ($period as $dt) {
            $month = $dt->format("Y-m");
            $monthStart = $dt->format("Y-m-01");
            $monthEnd = $dt->format("Y-m-t");

            // Nhân viên mới trong tháng
            $query = "SELECT COUNT(*) as total FROM NhanVien WHERE NgayVaoLam BETWEEN :monthStart AND :monthEnd";
            $params = ["monthStart" => $monthStart, "monthEnd" => $monthEnd];
            if ($department) {
                $query .= " AND MaPB = :MaPB";
                $params["MaPB"] = $department;
            }
            $stmt = $conn->prepare($query);
            $stmt->execute($params);
            $new = $stmt->fetch(PDO::FETCH_ASSOC)["total"];

            // Nhân viên nghỉ trong tháng
            $query = "SELECT COUNT(*) as total FROM NghiViec WHERE NgayNghi BETWEEN :monthStart AND :monthEnd";
            $params = ["monthStart" => $monthStart, "monthEnd" => $monthEnd];
            if ($department) {
                $query .= " AND MaNV IN (SELECT MaNV FROM NhanVien WHERE MaPB = :MaPB)";
                $params["MaPB"] = $department;
            }
            $stmt = $conn->prepare($query);
            $stmt->execute($params);
            $terminated = $stmt->fetch(PDO::FETCH_ASSOC)["total"];

            $byMonth[$month] = ["new" => $new, "terminated" => $terminated];
        }
    }

    echo json_encode([
        "status" => "success",
        "newEmployees" => $newEmployees,
        "terminatedEmployees" => $terminatedEmployees,
        "byMonth" => $byMonth
    ]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>