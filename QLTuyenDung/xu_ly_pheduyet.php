<?php
require_once 'config.php';

// Kiểm tra kết nối cơ sở dữ liệu
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Lỗi kết nối: ' . $conn->connect_error]);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Lấy dữ liệu từ form và thoát các ký tự đặc biệt để tránh SQL Injection
    $tenUV = mysqli_real_escape_string($conn, $_POST['TenUV']);
    $viTriUV = mysqli_real_escape_string($conn, $_POST['ViTriUV']);
    $trangThai = mysqli_real_escape_string($conn, $_POST['TrangThai']);
    $lyDo = isset($_POST['LyDo']) ? mysqli_real_escape_string($conn, $_POST['LyDo']) : '';

    // Ánh xạ trạng thái từ frontend sang backend
    if ($trangThai === 'approved') {
        $mappedStatus = 'Đã duyệt';
    } elseif ($trangThai === 'rejected') {
        $mappedStatus = 'Từ chối';
    } else {
        $mappedStatus = 'Chờ duyệt';
    }

    // Kiểm tra xem ứng viên đã tồn tại trong bảng chưa
    $sql_check = "SELECT * FROM pheduyetungvien WHERE TenUV = ? AND ViTriUV = ?";
    $stmt_check = $conn->prepare($sql_check);
    if (!$stmt_check) {
        echo json_encode(['success' => false, 'message' => 'Lỗi chuẩn bị câu lệnh kiểm tra: ' . $conn->error]);
        exit();
    }
    $stmt_check->bind_param("ss", $tenUV, $viTriUV);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();

    if ($result_check->num_rows > 0) {
        // Nếu đã tồn tại, thực hiện cập nhật (UPDATE)
        $sql = "UPDATE pheduyetungvien SET TrangThai = ?, LyDo = ?, NgayPheDuyet = NOW() WHERE TenUV = ? AND ViTriUV = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Lỗi chuẩn bị câu lệnh cập nhật: ' . $conn->error]);
            exit();
        }
        $stmt->bind_param("ssss", $mappedStatus, $lyDo, $tenUV, $viTriUV);
    } else {
        // Nếu chưa tồn tại, thực hiện thêm mới (INSERT)
        $sql = "INSERT INTO pheduyetungvien (TenUV, ViTriUV, TrangThai, LyDo, NgayPheDuyet) VALUES (?, ?, ?, ?, NOW())";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Lỗi chuẩn bị câu lệnh thêm mới: ' . $conn->error]);
            exit();
        }
        $stmt->bind_param("ssss", $tenUV, $viTriUV, $mappedStatus, $lyDo);
    }

    // Thực thi câu lệnh và trả về kết quả
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Cập nhật trạng thái thành công!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Lỗi thực thi: ' . $stmt->error]);
    }

    // Đóng các câu lệnh và kết nối
    $stmt->close();
    $stmt_check->close();
    $conn->close();
} else {
    header("Location: tuyendung.php?page=approval");
    exit();
}
?>