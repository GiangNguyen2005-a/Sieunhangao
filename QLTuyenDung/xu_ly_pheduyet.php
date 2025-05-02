<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $tenUV = mysqli_real_escape_string($conn, $_POST['TenUV']);
    $viTriUV = mysqli_real_escape_string($conn, $_POST['ViTriUV']);
    $trangThai = mysqli_real_escape_string($conn, $_POST['TrangThai']);
    $lyDo = isset($_POST['LyDo']) ? mysqli_real_escape_string($conn, $_POST['LyDo']) : '';

    // Kiểm tra xem ứng viên đã được phê duyệt chưa
    $sql_check = "SELECT * FROM pheduyetungvien WHERE TenUV = ? AND ViTriUV = ?";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("ss", $tenUV, $viTriUV);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    header('Content-Type: application/json');
    if ($result_check->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Ứng viên này đã được xử lý!']);
        exit();
    }

    $sql = "INSERT INTO pheduyetungvien (TenUV, ViTriUV, TrangThai, LyDo, NgayPheDuyet) 
            VALUES (?, ?, ?, ?, NOW())";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $tenUV, $viTriUV, $trangThai, $lyDo);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Cập nhật trạng thái thành công!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Lỗi: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    header("Location: tuyendung.php?page=approval");
    exit();
}
?>