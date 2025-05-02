<?php
// Nhúng file cấu hình kết nối database
require_once 'config.php';

// Kiểm tra xem form đã được submit bằng phương thức POST chưa
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Lấy dữ liệu từ form và gán vào các biến
    $ma_muc_tieu = $_POST['ma_muc_tieu'];        // Mã mục tiêu
    $ten_muc_tieu = $_POST['ten_muc_tieu'];      // Tên mục tiêu
    $phan_chuyen = $_POST['phan_chuyen'];        // Mã chuyền
    $ngay_bat_dau = $_POST['ngay_bat_dau'];      // Ngày bắt đầu
    $ngay_ket_thuc = $_POST['ngay_ket_thuc'];    // Ngày kết thúc
    $mo_ta = $_POST['mo_ta'];                    // Mô tả mục tiêu
    $chi_tiet = $_POST['chi_tiet'];              // Chi tiết mục tiêu
    $so_luong_de_ra = $_POST['so_luong_de_ra'];  // Số lượng đề ra
    $so_luong_da_dat = $_POST['so_luong_da_dat'];// Số lượng đã đạt
    $trang_thai = $_POST['trang_thai'];          // Trạng thái mục tiêu

    // Kiểm tra dữ liệu đầu vào
    if (empty($ma_muc_tieu) || empty($ten_muc_tieu) || empty($phan_chuyen) || 
        empty($ngay_bat_dau) || empty($ngay_ket_thuc) || empty($trang_thai)) {
        header("Location: them_muc_tieu.php?error=" . urlencode("Vui lòng điền đầy đủ thông tin bắt buộc"));
        exit();
    }

    // Kiểm tra ngày kết thúc phải sau ngày bắt đầu
    if (strtotime($ngay_ket_thuc) < strtotime($ngay_bat_dau)) {
        header("Location: them_muc_tieu.php?error=" . urlencode("Ngày kết thúc phải sau ngày bắt đầu"));
        exit();
    }

    // Kiểm tra số lượng đã đạt không được lớn hơn số lượng đề ra
    if ($so_luong_da_dat > $so_luong_de_ra) {
        header("Location: them_muc_tieu.php?error=" . urlencode("Số lượng đã đạt không được lớn hơn số lượng đề ra"));
        exit();
    }

    // Chuẩn bị câu lệnh SQL để thêm dữ liệu vào bảng muc_tieu
    $sql = "INSERT INTO muc_tieu (ma_muc_tieu, ten_muc_tieu, phan_chuyen, ngay_bat_dau, ngay_ket_thuc, mo_ta, chi_tiet, so_luong_de_ra, so_luong_da_dat, trang_thai) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    // Chuẩn bị statement để thực thi câu lệnh SQL
    $stmt = mysqli_prepare($conn, $sql);
    
    if ($stmt) {
        // Gán giá trị cho các tham số trong câu lệnh SQL
        // "sssssssiis" là chuỗi định dạng kiểu dữ liệu cho các tham số:
        // s: string (chuỗi)
        // i: integer (số nguyên)
        mysqli_stmt_bind_param($stmt, "sssssssiis", 
            $ma_muc_tieu, 
            $ten_muc_tieu, 
            $phan_chuyen, 
            $ngay_bat_dau, 
            $ngay_ket_thuc, 
            $mo_ta, 
            $chi_tiet, 
            $so_luong_de_ra, 
            $so_luong_da_dat, 
            $trang_thai
        );
        
        // Thực thi câu lệnh SQL
        if (mysqli_stmt_execute($stmt)) {
            // Nếu thêm thành công, chuyển hướng về trang danh sách mục tiêu
            header("Location: muc_tieu.php");
            exit();
        } else {
            // Nếu có lỗi, lấy thông báo lỗi và chuyển hướng về trang thêm mục tiêu với thông báo lỗi
            $error = mysqli_error($conn);
            header("Location: them_muc_tieu.php?error=" . urlencode($error));
            exit();
        }
        
        // Đóng statement
        mysqli_stmt_close($stmt);
    } else {
        // Nếu không thể chuẩn bị statement, lấy thông báo lỗi và chuyển hướng
        $error = mysqli_error($conn);
        header("Location: them_muc_tieu.php?error=" . urlencode($error));
        exit();
    }
} else {
    // Nếu không phải phương thức POST, chuyển hướng về trang thêm mục tiêu
    header("Location: them_muc_tieu.php");
    exit();
}

// Đóng kết nối database
mysqli_close($conn);
?> 