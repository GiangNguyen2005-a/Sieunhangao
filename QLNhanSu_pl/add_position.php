<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'hrm_system_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);
    $maVT = $data['MaVT'];
    $tenVT = $data['TenVT'];

    $stmt = $pdo->prepare("INSERT INTO ViTri (MaVT, TenVT) VALUES (?, ?)");
    $stmt->execute([$maVT, $tenVT]);

    echo json_encode(['status' => 'success']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Lỗi: ' . $e->getMessage()]);
}
?>