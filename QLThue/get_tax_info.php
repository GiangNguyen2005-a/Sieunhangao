<?php
header('Content-Type: application/json');
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $maNV = $_POST['maNV'] ?? '';

    if (empty($maNV)) {
        echo json_encode(["error" => "Thiếu mã nhân viên"]);
        exit;
    }

    $sql = "SELECT MaNV, MST, ThuNhapChinh, Thuong, PhuCap 
            FROM ThongTinThue 
            WHERE MaNV = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $maNV);
    $stmt->execute();
    $result = $stmt->get_result();
    $taxInfo = $result->fetch_assoc();

    if ($taxInfo) {
        // Tính tổng thu nhập
        $tongThuNhap = $taxInfo['ThuNhapChinh'] + $taxInfo['Thuong'] + $taxInfo['PhuCap'];
        $taxInfo['TongThuNhap'] = $tongThuNhap;
        echo json_encode(["success" => true, "data" => $taxInfo]);
    } else {
        echo json_encode(["error" => "Không tìm thấy thông tin thuế"]);
    }

    $stmt->close();
}

$conn->close();
?>