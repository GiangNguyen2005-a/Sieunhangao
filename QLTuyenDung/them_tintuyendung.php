<?php
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Lấy dữ liệu từ form
    $tieuDe = mysqli_real_escape_string($conn, $_POST['TieuDe']);
    $dotTuyenDung = mysqli_real_escape_string($conn, $_POST['DotTuyenDung']);
    $phongBan = mysqli_real_escape_string($conn, $_POST['PhongBan']);
    $viTri = mysqli_real_escape_string($conn, $_POST['ViTri']);
    $soLuong = (int)$_POST['SoLuong'];
    $loaiHinh = mysqli_real_escape_string($conn, $_POST['LoaiHinh']);
    $mucLuong = mysqli_real_escape_string($conn, $_POST['MucLuong']);
    $moTa = mysqli_real_escape_string($conn, $_POST['MoTa']);
    $yeuCau = mysqli_real_escape_string($conn, $_POST['YeuCau']);

    // Tạo câu lệnh SQL
    $sql = "INSERT INTO tintuyendung (TieuDe, DotTuyenDung, PhongBan, ViTri, SoLuong, LoaiHinh, MucLuong, MoTa, YeuCau, NgayTao) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssissss", $tieuDe, $dotTuyenDung, $phongBan, $viTri, $soLuong, $loaiHinh, $mucLuong, $moTa, $yeuCau);
    
    if ($stmt->execute()) {
        echo "<script>alert('Tạo tin tuyển dụng thành công!'); window.location.href='tuyendung.php';</script>";
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