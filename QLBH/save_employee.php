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
    $conn->begin_transaction();

    // Thêm vào ttbh
    $sql_ttbh = "INSERT INTO ttbh (manv, mabh, nbd, nkt) VALUES (?, ?, ?, ?)";
    $stmt_ttbh = $conn->prepare($sql_ttbh);
    $stmt_ttbh->bind_param("ssss", $manv, $mabh, $nbd, $nkt);
    $stmt_ttbh->execute();

    // Thêm vào qlbh
    $sql_qlbh = "INSERT INTO qlbh (manv, trangthai, mucdongnld, mucdongdn) VALUES (?, ?, ?, ?)";
    $stmt_qlbh = $conn->prepare($sql_qlbh);
    $stmt_qlbh->bind_param("ssdd", $manv, $trangthai, $tlnld, $tldn);
    $stmt_qlbh->execute();

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Thêm mới thành công']);
} catch (Exception $e) {
    $conn->rollback();
    $errorMsg = $e->getMessage();
    if (stripos($errorMsg, 'duplicate') !== false) {
        $errorMsg = 'Nhân viên đã có thông tin BHXH, vui lòng kiểm tra lại.';
    }
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
?>