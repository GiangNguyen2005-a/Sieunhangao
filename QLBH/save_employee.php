<?php
include '../Chung/config.php';

// Nhận dữ liệu từ form
$manv = $_POST['manv'];
$tennv = $_POST['tennv']; 
$cccd = $_POST['cccd'];
$ngaysinh = $_POST['ngaysinh'];
$gioitinh = $_POST['gioitinh'];
$sdt = $_POST['sdt'];
$diachi = $_POST['diachi'];
$chucvu = $_POST['chucvu'];
$phongban = $_POST['phongban'];
$daCoMaBHXH = $_POST['daCoMaBHXH'];
$mabh = $_POST['mabh'];
$phuongankb = $_POST['phuongankb'];
// Set default values if not provided
$tlndl = isset($_POST['tlnld']) ? $_POST['tlnld'] : 0;
$tldn = isset($_POST['tldn']) ? $_POST['tldn'] : 0;
$nbd = $_POST['nbd'];
$nkt = $_POST['nkt'];

try {
    // Tạo makb ngẫu nhiên và kiểm tra trùng lặp
    do {
        $makb = 'KB' . str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT);
        
        // Kiểm tra xem makb đã tồn tại chưa
        $check_makb = "SELECT makb FROM kbbh WHERE makb = ?";
        $stmt_makb = $conn->prepare($check_makb);
        $stmt_makb->bind_param("s", $makb);
        $stmt_makb->execute();
        $result_makb = $stmt_makb->get_result();
    } while ($result_makb->num_rows > 0);

    // Kiểm tra điều kiện mã BHXH
    if ($daCoMaBHXH === 'Có' && empty($mabh)) {
        throw new Exception('Vui lòng nhập mã BHXH khi đã có mã BHXH');
    }

    // Chỉ kiểm tra trùng lặp nếu có mã BHXH
    if (!empty($mabh)) {
        // Kiểm tra xem mã BHXH đã tồn tại trong bảng kbbh chưa
        $check_sql = "SELECT mabh FROM kbbh WHERE mabh = ?";
        $check_stmt = $conn->prepare($check_sql);
        $check_stmt->bind_param("s", $mabh);
        $check_stmt->execute();
        $result = $check_stmt->get_result();
        
        if ($result->num_rows > 0) {
            throw new Exception('Mã BHXH đã tồn tại trong hệ thống');
        }
    }

    // Bắt đầu transaction
    $conn->begin_transaction();

    // Thêm thông tin vào bảng kbbh với điều kiện
    if (!empty($mabh)) {
        $sql_kb = "INSERT INTO kbbh (makb, mabh, thamgiabh, phuongankb, mucdongnld, mucdongdn, trangthai) 
                   VALUES (?, ?, ?, ?, ?, ?, 'Đang xử lý')";
        $stmt_kb = $conn->prepare($sql_kb);
        $stmt_kb->bind_param("ssssdd", $makb, $mabh, $daCoMaBHXH, $phuongankb, $tlndl, $tldn);
        $stmt_kb->execute();
    }

    // Commit transaction nếu mọi thứ OK
    $conn->commit();
    
    echo json_encode(['success' => true, 'message' => 'Đã lưu thông tin thành công']);

} catch (Exception $e) {
    // Rollback nếu có lỗi
    if ($conn->connect_error === null) {
        $conn->rollback();
    }
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
?>