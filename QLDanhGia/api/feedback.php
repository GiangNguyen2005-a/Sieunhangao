<?php
// api/feedback.php
require_once '../config.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        if (!isset($_GET['MaQLDG']) && !(isset($_GET['MaNV']) && isset($_GET['MaKyDG']))) {
            http_response_code(400);
            echo json_encode(['error' => 'Thiếu MaQLDG hoặc MaNV và MaKyDG']);
            exit;
        }
        try {
            if (isset($_GET['MaQLDG'])) {
                $stmt = $pdo->prepare("SELECT MaPhanHoi, MaQLDG, MaNV_NguoiGui, NoiDung, ThoiGianGui 
                                       FROM ChiTietPhanHoiDanhGia 
                                       WHERE MaQLDG = ? 
                                       ORDER BY ThoiGianGui");
                $stmt->execute([$_GET['MaQLDG']]);
            } else {
                $stmt = $pdo->prepare("SELECT c.MaPhanHoi, c.MaQLDG, c.MaNV_NguoiGui, c.NoiDung, c.ThoiGianGui 
                                       FROM ChiTietPhanHoiDanhGia c
                                       JOIN PhieuQuanLyDanhGia p ON c.MaQLDG = p.MAQLDG
                                       WHERE p.MaNV = ? AND p.MaKyDG = ?
                                       ORDER BY c.ThoiGianGui");
                $stmt->execute([$_GET['MaNV'], $_GET['MaKyDG']]);
            }
            $feedback = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($feedback);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Không thể tải phản hồi: ' . $e->getMessage()]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $stmt = $pdo->prepare("INSERT INTO ChiTietPhanHoiDanhGia (MaPhanHoi, MaQLDG, MaNV_NguoiGui, NoiDung) 
                                   VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data['MaPhanHoi'],
                $data['MAQLDG'],
                $data['MaNV_NguoiGui'],
                $data['NoiDung']
            ]);
            echo json_encode(['message' => 'Gửi phản hồi thành công']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Không thể gửi phản hồi: ' . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Phương thức không được hỗ trợ']);
        break;
}
?>