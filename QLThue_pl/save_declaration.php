
<?php
header('Content-Type: application/json');
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $maTK = 'TK-' . substr(time(), -6) . '-' . strtoupper(substr(md5(rand()), 0, 4));
    $maNV = $_POST['tax-id'] ?? '';
    $kyKeKhai = $_POST['period'] ?? '';
    $tongThuNhap = $_POST['income'] ?? 0;
    $tongThuePhaiNop = $_POST['tax-amount'] ?? 0;

    if (empty($maNV) || empty($kyKeKhai)) {
        echo json_encode(["error" => "Thiếu thông tin bắt buộc"]);
        exit;
    }

    $sql = "INSERT INTO ToKhaiThue (MaTK, MaNV, KyKeKhai, TongThuNhap, TongThuePhaiNop) 
            VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssdd", $maTK, $maNV, $kyKeKhai, $tongThuNhap, $tongThuePhaiNop);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Tạo tờ khai thành công", "maTK" => $maTK]);
    } else {
        echo json_encode(["error" => "Lưu thất bại: " . $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>