<?php
// api/reports.php
require_once '../config.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        if (!isset($_GET['MaKyDG'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Thiếu MaKyDG']);
            exit;
        }
        try {
            // Thống kê theo phòng ban
            $stmt = $pdo->prepare("
                SELECT 
                    pb.TenPB AS department,
                    SUM(CASE WHEN p.TongDiem > 80 THEN 1 ELSE 0 END) AS gt80,
                    SUM(CASE WHEN p.TongDiem BETWEEN 50 AND 80 THEN 1 ELSE 0 END) AS '50_80',
                    SUM(CASE WHEN p.TongDiem < 50 THEN 1 ELSE 0 END) AS lt50,
                    COUNT(p.MaNV) AS total
                FROM PhieuQuanLyDanhGia p
                JOIN NhanVien nv ON p.MaNV = nv.MaNV
                JOIN PhongBan pb ON nv.MaPB = pb.MaPB
                WHERE p.MaKyDG = ?
                GROUP BY pb.TenPB
            ");
            $stmt->execute([$_GET['MaKyDG']]);
            $summary = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Top 10 nhân viên xuất sắc
            $stmt = $pdo->prepare("
                SELECT 
                    nv.TenNV AS name,
                    pb.TenPB AS department,
                    p.TongDiem AS score
                FROM PhieuQuanLyDanhGia p
                JOIN NhanVien nv ON p.MaNV = nv.MaNV
                JOIN PhongBan pb ON nv.MaPB = pb.MaPB
                WHERE p.MaKyDG = ?
                ORDER BY p.TongDiem DESC
                LIMIT 10
            ");
            $stmt->execute([$_GET['MaKyDG']]);
            $top10 = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'summary' => $summary,
                'top10' => $top10
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Không thể tạo báo cáo: ' . $e->getMessage()]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $stmt = $pdo->prepare("INSERT INTO BaoCaoDanhGia (MaBC, TenBC, NgayLapBC, MaKyDG, MaNV_NguoiLap, LoaiBaoCao) 
                                   VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['MaBC'],
                $data['TenBC'],
                $data['NgayLapBC'],
                $data['MaKyDG'],
                $data['MaNV_NguoiLap'],
                $data['LoaiBaoCao']
            ]);
            echo json_encode(['message' => 'Lưu báo cáo thành công']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Không thể lưu báo cáo: ' . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Phương thức không được hỗ trợ']);
        break;
}
?>