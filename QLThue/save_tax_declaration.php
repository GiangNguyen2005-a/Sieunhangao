<?php
header('Content-Type: application/json');
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $maNV = $data['MaNV'] ?? '';
    $kyKeKhai = $data['KyThue'] ?? ''; 
    $tongThuNhap = floatval($data['ThuNhapChiuThue'] ?? 0);
    $tongThuePhaiNop = floatval($data['ThuePhaiNop'] ?? 0);
     
    if (empty($maNV)) {
        echo json_encode(["error" => "Mã nhân viên và kỳ kê khai là bắt buộc"]);
        exit;
    }
    if (!preg_match('/^\d{4}-\d{2}$/', $kyKeKhai)) {
        echo json_encode(["error" => "Kỳ kê khai phải có định dạng YYYY-MM"]);
        exit;
    }

    
    if ($tongThuNhap < 0 || $tongThuePhaiNop < 0) {
        echo json_encode(["error" => "Thu nhập và thuế phải nộp không được âm"]);
        exit;
    }
    do {
        $maTK = 'TK-' . substr(time(), -6) . '-' . strtoupper(substr(md5(rand()), 0, 4));
        $checkSql = "SELECT MaTK FROM ToKhaiThue WHERE MaTK = ?";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bind_param("s", $maTK);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        $exists = $result->num_rows > 0;
        $checkStmt->close();
    } while ($exists);

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