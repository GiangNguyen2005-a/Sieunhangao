<?php
require_once '../config.php';
header('Content-Type: application/json');

$position = isset($_GET['position']) ? $_GET['position'] : 'tatca';
$maKyDG = isset($_GET['MaKyDG']) ? $_GET['MaKyDG'] : null;

try {
    $query = "SELECT NhanVien.MaNV, NhanVien.TenNV, ViTri.TenVT";
    if ($maKyDG) {
        $query .= ", DoiTuongKyDanhGia.TrangThaiQLDanhGia";
        $query .= " FROM NhanVien JOIN ViTri ON NhanVien.MaVT = ViTri.MaVT";
        $query .= " JOIN DoiTuongKyDanhGia ON NhanVien.MaNV = DoiTuongKyDanhGia.MaNV";
        $query .= " WHERE DoiTuongKyDanhGia.MaKyDG = ?";
        $params = [$maKyDG];
        if ($position !== 'tatca') {
            $query .= " AND ViTri.TenVT = ?";
            $params[] = $position;
        }
    } else {
        $query .= " FROM NhanVien JOIN ViTri ON NhanVien.MaVT = ViTri.MaVT";
        $params = [];
        if ($position !== 'tatca') {
            $query .= " WHERE ViTri.TenVT = ?";
            $params[] = $position;
        }
    }
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($employees);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Không thể tải danh sách nhân viên: ' . $e->getMessage()]);
}
?>