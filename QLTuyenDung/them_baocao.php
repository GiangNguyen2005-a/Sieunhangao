<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $phongBan = mysqli_real_escape_string($conn, $_POST['PhongBan']);
    $thang = mysqli_real_escape_string($conn, $_POST['Thang']);
    $soLuongKeHoach = (int)$_POST['SoLuongKeHoach'];
    $soLuongThucTe = (int)$_POST['SoLuongThucTe'];
    $ghiChu = mysqli_real_escape_string($conn, $_POST['GhiChu']);

    $sql = "INSERT INTO baocaotuyendung (PhongBan, Thang, SoLuongKeHoach, SoLuongThucTe, GhiChu, NgayTao) 
            VALUES (?, ?, ?, ?, ?, NOW())";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssiis", $phongBan, $thang, $soLuongKeHoach, $soLuongThucTe, $ghiChu);
    
    if ($stmt->execute()) {
        echo "<script>alert('Tạo báo cáo thành công!'); window.location.href='tuyendung.php';</script>";
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