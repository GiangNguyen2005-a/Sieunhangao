<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $tenUV = mysqli_real_escape_string($conn, $_POST['TenUV']);
    $viTriUV = mysqli_real_escape_string($conn, $_POST['ViTriUV']);
    $diem = (int)$_POST['Diem'];
    $nhanXet = mysqli_real_escape_string($conn, $_POST['NhanXet']);

    // Thêm vào bảng danhgiaungvien
    $sql = "INSERT INTO danhgiaungvien (TenUV, ViTriUV, Diem, NhanXet, NgayDanhGia) 
            VALUES (?, ?, ?, ?, NOW())";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssis", $tenUV, $viTriUV, $diem, $nhanXet);
    
    if ($stmt->execute()) {
        // Kiểm tra xem ứng viên đã có trong bảng pheduyetungvien chưa
        $sql_check = "SELECT * FROM pheduyetungvien WHERE TenUV = ? AND ViTriUV = ?";
        $stmt_check = $conn->prepare($sql_check);
        $stmt_check->bind_param("ss", $tenUV, $viTriUV);
        $stmt_check->execute();
        $result_check = $stmt_check->get_result();

        if ($result_check->num_rows == 0) {
            // Thêm vào bảng pheduyetungvien với trạng thái "Chờ duyệt"
            $sql_approval = "INSERT INTO pheduyetungvien (TenUV, ViTriUV, TrangThai, NgayPheDuyet) 
                             VALUES (?, ?, 'Chờ duyệt', NOW())";
            $stmt_approval = $conn->prepare($sql_approval);
            $stmt_approval->bind_param("ss", $tenUV, $viTriUV);
            $stmt_approval->execute();
            $stmt_approval->close();
        }
        $stmt_check->close();

        echo "<script>alert('Đánh giá ứng viên thành công và đã chuyển sang chờ phê duyệt!'); window.location.href='tuyendung.php';</script>";
    } else {
        echo "<script>alert('Lỗi: " . $stmt->error . "'); window.history.back();</script>";
    }

    $stmt->close();
    $conn->close();
} else {
    header("Location: tuyendung.php");
    exit();
}
?>