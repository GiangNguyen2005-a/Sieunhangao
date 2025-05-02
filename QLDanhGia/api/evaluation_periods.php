<?php
require_once '../config.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM KyDanhGia WHERE MaKyDG = ?");
            $stmt->execute([$_GET['id']]);
            $period = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($period) {
                $stmt = $pdo->prepare("SELECT MaNV FROM DoiTuongKyDanhGia WHERE MaKyDG = ?");
                $stmt->execute([$_GET['id']]);
                $period['employee_ids'] = $stmt->fetchAll(PDO::FETCH_COLUMN);
                echo json_encode($period);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Kỳ đánh giá không tồn tại']);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM KyDanhGia");
            $periods = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($periods as &$period) {
                $stmt = $pdo->prepare("SELECT MaNV FROM DoiTuongKyDanhGia WHERE MaKyDG = ?");
                $stmt->execute([$period['MaKyDG']]);
                $period['employee_ids'] = $stmt->fetchAll(PDO::FETCH_COLUMN);
            }
            echo json_encode($periods);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare("INSERT INTO KyDanhGia (MaKyDG, TenKyDG, ViTriDG, ThoiGianApDung, HanQuanLyDanhGia, PhuongPhapDanhGia, MaNV_NguoiTao, TrangThai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['MaKyDG'],
                $data['TenKyDG'],
                $data['ViTriDG'],
                $data['ThoiGianApDung'],
                $data['HanQuanLyDanhGia'],
                $data['PhuongPhapDanhGia'],
                $data['MaNV_NguoiTao'],
                'Đang diễn ra'
            ]);
            foreach ($data['employee_ids'] as $maNV) {
                $stmt = $pdo->prepare("INSERT INTO DoiTuongKyDanhGia (MaKyDG, MaNV) VALUES (?, ?)");
                $stmt->execute([$data['MaKyDG'], $maNV]);
            }
            $pdo->commit();
            echo json_encode(['message' => 'Thêm kỳ đánh giá thành công']);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Không thể thêm kỳ đánh giá: ' . $e->getMessage()]);
        }
        break;

    case 'PUT':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Thiếu ID kỳ đánh giá']);
            exit;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare("UPDATE KyDanhGia SET TenKyDG = ?, ViTriDG = ?, ThoiGianApDung = ?, HanQuanLyDanhGia = ?, PhuongPhapDanhGia = ? WHERE MaKyDG = ?");
            $stmt->execute([
                $data['TenKyDG'],
                $data['ViTriDG'],
                $data['ThoiGianApDung'],
                $data['HanQuanLyDanhGia'],
                $data['PhuongPhapDanhGia'],
                $_GET['id']
            ]);
            $stmt = $pdo->prepare("DELETE FROM DoiTuongKyDanhGia WHERE MaKyDG = ?");
            $stmt->execute([$_GET['id']]);
            foreach ($data['employee_ids'] as $maNV) {
                $stmt = $pdo->prepare("INSERT INTO DoiTuongKyDanhGia (MaKyDG, MaNV) VALUES (?, ?)");
                $stmt->execute([$_GET['id'], $maNV]);
            }
            $pdo->commit();
            echo json_encode(['message' => 'Cập nhật kỳ đánh giá thành công']);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['error' => 'Không thể cập nhật kỳ đánh giá: ' . $e->getMessage()]);
        }
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Thiếu ID kỳ đánh giá']);
            exit;
        }
        try {
            $stmt = $pdo->prepare("DELETE FROM KyDanhGia WHERE MaKyDG = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode(['message' => 'Xóa kỳ đánh giá thành công']);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Không thể xóa kỳ đánh giá: ' . $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Phương thức không được hỗ trợ']);
        break;
}
?>