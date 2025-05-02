<?php
require_once '../config.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case 'GET':
        if (!isset($_GET['MaNV']) || !isset($_GET['MaKyDG'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Thiếu MaNV hoặc MaKyDG']);
            exit;
        }
        try {
            $stmt = $pdo->prepare("SELECT * FROM PhieuTuDanhGia WHERE MaNV = ? AND MaKyDG = ?");
            $stmt->execute([$_GET['MaNV'], $_GET['MaKyDG']]);
            $eval = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($eval) {
                echo json_encode($eval);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Không tìm thấy tự đánh giá']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Không thể tải tự đánh giá: ' . $e->getMessage()]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $stmt = $pdo->prepare("INSERT INTO PhieuTuDanhGia (MaPTDG, MaKyDG, MaNV, AMSP, AHNV, QuanLy, PhanTich, QLDUAN, GiaiQuyetVanDe, TinhThanTN, ThaiDo, NhanXet) VALUES (?, ?,