
<?php
header('Content-Type: application/json');
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $maXN = 'XN' . substr(time(), -6);
    $maNV = $_POST['mst'] ?? '';
    $kyTinhThue = $_POST['ky'] ?? '';
    $soTienNop = $_POST['soTien'] ?? 0;
    $ngayNop = $_POST['ngayNop'] ?? '';

    if (empty($maNV) || empty($kyTinhThue) || empty($ngayNop)) {
        echo json_encode(["error" => "Thiếu thông tin bắt buộc"]);
        exit;
    }

    $sql = "INSERT INTO XacNhanThue (MaXN, MaNV, KyTinhThue, SoTienNop, NgayNop) 
            VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssdds", $maXN, $maNV, $kyTinhThue, $soTienNop, $ngayNop);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Xác nhận thuế thành công", "maXN" => $maXN]);
    } else {
        echo json_encode(["error" => "Lưu thất bại: " . $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>