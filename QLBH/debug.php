<?php
// Bao gồm file config.php để sử dụng kết nối
include '../Chung/config.php';

// Kiểm tra kết nối
if ($conn) {
    echo "Kết nối cơ sở dữ liệu thành công!<br>";

    // Thực hiện một truy vấn đơn giản để kiểm tra
    $sql = "SELECT DATABASE() AS current_db";
    $result = mysqli_query($conn, $sql);

    if ($result) {
        $row = mysqli_fetch_assoc($result);
        echo "Đang sử dụng cơ sở dữ liệu: " . $row['current_db'];
    } else {
        echo "Truy vấn thất bại: " . mysqli_error($conn);
    }
} else {
    echo "Kết nối thất bại: " . mysqli_connect_error();
}

// Đóng kết nối
mysqli_close($conn);
?>