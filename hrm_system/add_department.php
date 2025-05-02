<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'hr_system';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);
    $maPB = $data['MaPB'];
    $tenPB = $data['TenPB'];

    $stmt = $pdo->prepare("INSERT INTO PhongBan (MaPB, TenPB) VALUES (?, ?)");
    $stmt->execute([$maPB, $tenPB]);

    echo json_encode(['status' => 'success']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Lỗi: ' . $e->getMessage()]);
}
?>