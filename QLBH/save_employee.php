<?php
include '../Chung/config.php';

$manv = $_POST['manv'];
$mabh = $_POST['mabh'];
$nbd = $_POST['nbd'];
$nkt = $_POST['nkt'];
$trangthai = $_POST['trangthai'];
$tlnld = $_POST['tlnld'];
$tldn = $_POST['tldn'];

try {
    // Kiểm tra mã nhân viên đã tồn tại trong bảng ttbh chưa
    $check_manv = "SELECT manv FROM ttbh WHERE manv = ?";
    $stmt_check = $conn->prepare($check_manv);
    $stmt_check->bind_param("s", $manv);
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();
    
    if ($result_check->num_rows > 0) {
        throw new Exception("Nhân viên này đã có thông tin BHXH trong hệ thống!");
    }

    // Kiểm tra mã nhân viên đã tồn tại trong bảng qlbh chưa
    $check_manv_qlbh = "SELECT manv FROM qlbh WHERE manv = ?";
    $stmt_check_qlbh = $conn->prepare($check_manv_qlbh);
    $stmt_check_qlbh->bind_param("s", $manv);
    $stmt_check_qlbh->execute();
    $result_check_qlbh = $stmt_check_qlbh->get_result();
    
    if ($result_check_qlbh->num_rows > 0) {
        throw new Exception("Nhân viên này đã có thông tin quản lý BHXH trong hệ thống!");
    }

    do {
        $maqlbh = 'QLBH' . str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT);
        
        // Kiểm tra xem makb đã tồn tại chưa
        $check_makb = "SELECT maqlbh FROM qlbh WHERE maqlbh = ?";
        $stmt_makb = $conn->prepare($check_makb);
        $stmt_makb->bind_param("s", $maqlbh);
        $stmt_makb->execute();
        $result_makb = $stmt_makb->get_result();
    } while ($result_makb->num_rows > 0);

    $conn->begin_transaction();

    // Thêm vào ttbh
    $sql_ttbh = "INSERT INTO ttbh (mabh, manv, nbd, nkt) VALUES (?, ?, ?, ?)";
    $stmt_ttbh = $conn->prepare($sql_ttbh);
    $stmt_ttbh->bind_param("ssss", $mabh, $manv, $nbd, $nkt);
    $stmt_ttbh->execute();

    // Thêm vào qlbh
    $sql_qlbh = "INSERT INTO qlbh (maqlbh, manv, trangthai, mucdongnld, mucdongdn) VALUES (?, ?, ?, ?, ?)";
    $stmt_qlbh = $conn->prepare($sql_qlbh);
    $stmt_qlbh->bind_param("sssdd", $maqlbh, $manv, $trangthai, $tlnld, $tldn);
    $stmt_qlbh->execute();

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Thêm mới thành công']);
} catch (Exception $e) {
    $conn->rollback();
    $errorMsg = $e->getMessage();
    if (stripos($errorMsg, 'duplicate') !== false) {
        $errorMsg = 'Nhân viên đã có thông tin BHXH, vui lòng kiểm tra lại.';
    }
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => $errorMsg]);
    exit;
}

$conn->close();
?>