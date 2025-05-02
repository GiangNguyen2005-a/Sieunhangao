<?php
// Bật hiển thị lỗi
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Nhúng file cấu hình kết nối database
require_once 'config.php';

// Kiểm tra xem form đã được submit bằng phương thức POST chưa
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // In ra dữ liệu nhận được từ form để debug
    echo "<pre>";
    print_r($_POST);
    echo "</pre>";

    // Lấy dữ liệu từ form và gán vào các biến
    $ma_chuyen = $_POST['ma_chuyen'];        // Mã chuyền
    $ten_chuyen = $_POST['ten_chuyen'];      // Tên chuyền
    $ma_phong = $_POST['ma_phong'];          // Mã phòng

    // Chuẩn bị câu lệnh SQL để thêm dữ liệu vào bảng phan_chuyen
    $sql = "INSERT INTO phan_chuyen (ma_chuyen, ten_chuyen, ma_phong) 
            VALUES (?, ?, ?)";
    
    // In ra câu lệnh SQL để debug
    echo "SQL: " . $sql . "<br>";
    echo "Parameters: " . $ma_chuyen . ", " . $ten_chuyen . ", " . $ma_phong . "<br>";
    
    // Chuẩn bị statement để thực thi câu lệnh SQL
    $stmt = mysqli_prepare($conn, $sql);
    
    if ($stmt) {
        // Gán giá trị cho các tham số trong câu lệnh SQL
        // "sss" là chuỗi định dạng kiểu dữ liệu cho các tham số:
        // s: string (chuỗi)
        mysqli_stmt_bind_param($stmt, "sss", 
            $ma_chuyen, 
            $ten_chuyen,
            $ma_phong
        );
        
        // Thực thi câu lệnh SQL
        if (mysqli_stmt_execute($stmt)) {
            // Nếu thêm thành công, chuyển hướng về trang danh sách phân chuyền
            header("Location: phan_chuyen.php");
            exit();
        } else {
            // Nếu có lỗi, lấy thông báo lỗi và chuyển hướng về trang thêm phân chuyền với thông báo lỗi
            $error = mysqli_error($conn);
            echo "Lỗi khi thực thi câu lệnh SQL: " . $error . "<br>";
            header("Location: them_phan_chuyen.php?error=" . urlencode($error));
            exit();
        }
        
        // Đóng statement
        mysqli_stmt_close($stmt);
    } else {
        // Nếu không thể chuẩn bị statement, lấy thông báo lỗi và chuyển hướng
        $error = mysqli_error($conn);
        echo "Lỗi khi chuẩn bị câu lệnh SQL: " . $error . "<br>";
        header("Location: them_phan_chuyen.php?error=" . urlencode($error));
        exit();
    }
} else {
    // Nếu không phải phương thức POST, chuyển hướng về trang thêm phân chuyền
    header("Location: them_phan_chuyen.php");
    exit();
}

// Đóng kết nối database
mysqli_close($conn);
?> 