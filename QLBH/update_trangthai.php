<?php
include '../Chung/config.php'; // Kết nối cơ sở dữ liệu

if (isset($_POST['manv'])) {
    $manv = $_POST['manv'];
    $sql = "UPDATE kbbh SET trangthai = 'Đã gửi', ngaygui = CURDATE() WHERE mabh IN (SELECT mabh FROM ttbh WHERE manv = '$manv')";
    if (mysqli_query($conn, $sql)) {
        echo "success";
    } else {
        echo "error";
    }
} elseif (isset($_POST['send_all'])) {
    $sql = "UPDATE kbbh SET trangthai = 'Đã gửi' WHERE trangthai = 'Đang xử lý'";
    if (mysqli_query($conn, $sql)) {
        echo "success";
    } else {
        echo "error";
    }
}

mysqli_close($conn);
?>