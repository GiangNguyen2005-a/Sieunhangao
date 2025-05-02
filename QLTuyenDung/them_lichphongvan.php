<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Lấy dữ liệu từ form
    $maUV = mysqli_real_escape_string($conn, $_POST['MaUV']);
    $maTin = mysqli_real_escape_string($conn, $_POST['MaTin']);
    $viTri = mysqli_real_escape_string($conn, $_POST['ViTri']);
    $ngayPV = mysqli_real_escape_string($conn, $_POST['NgayPV']);
    $gioPV = mysqli_real_escape_string($conn, $_POST['GioPV']);
    $hinhThuc = mysqli_real_escape_string($conn, $_POST['HinhThuc']);
    $ghiChu = mysqli_real_escape_string($conn, $_POST['GhiChu']);

    // Tạo câu lệnh SQL
    $sql = "INSERT INTO lichphongvan (MaUV, MaTin, ViTri, NgayPV, GioPV, HinhThuc, GhiChu, TrangThai) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Chưa diễn ra')";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssss", $maUV, $maTin, $viTri, $ngayPV, $gioPV, $hinhThuc, $ghiChu);
    
    if ($stmt->execute()) {
        echo "<script>alert('Tạo lịch phỏng vấn thành công!'); window.location.href='tuyendung.php';</script>";
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