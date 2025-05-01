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

    // Cập nhật ttbh
    $sql_ttbh = "UPDATE ttbh SET mabh = ?, nbd = ?, nkt = ? WHERE manv = ?";
    $stmt_ttbh = $conn->prepare($sql_ttbh);
    $stmt_ttbh->bind_param("ssss", $mabh, $nbd, $nkt, $manv);
    $stmt_ttbh->execute();

    // Cập nhật qlbh
    $sql_qlbh = "UPDATE qlbh SET trangthai = ?, mucdongnld = ?, mucdongdn = ? WHERE manv = ?";
    $stmt_qlbh = $conn->prepare($sql_qlbh);
    $stmt_qlbh->bind_param("sdds", $trangthai, $tlnld, $tldn, $manv);
    $stmt_qlbh->execute();

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Cập nhật thành công']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
?>