<?php
header('Content-Type: application/json');
require 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

$maTK = $data['MaTK'] ?? '';
$maNV = $data['MaNV'] ?? '';
$ngayXacNhan = $data['NgayXacNhan'] ?? '';
$SoTienNop = $data['SoTienNop'] ??"";
if (empty($maTK) || empty($maNV) || empty($ngayXacNhan)) {
    echo json_encode(["error" => "Các trường MaTK, MaNV và NgayXacNhan là bắt buộc"]);
    exit;
}


$sqlInsert = "INSERT INTO XacNhanToKhai (MaTK, MaNV, NgayXacNhan,SoTienNop) VALUES (?, ?, ?,?)";
$stmtInsert = $conn->prepare($sqlInsert);
$stmtInsert->bind_param("ssss", $maTK, $maNV, $ngayXacNhan,$SoTienNop);

if ($stmtInsert->execute()) {

    $sqlDelete = "DELETE FROM ToKhaiThue WHERE MaTK = ?";
    $stmtDelete = $conn->prepare($sqlDelete);
    $stmtDelete->bind_param("s", $maTK);

    if ($stmtDelete->execute()) {
        echo json_encode(["success" => true, "message" => "Xác nhận thành công và tờ khai thuế đã bị xóa"]);
    } else {
        echo json_encode(["error" => "Xóa tờ khai thuế thất bại: " . $stmtDelete->error]);
    }

    $stmtDelete->close();
} else {
    echo json_encode(["error" => "Lưu thất bại: " . $stmtInsert->error]);
}

$stmtInsert->close();
$conn->close();
?>
