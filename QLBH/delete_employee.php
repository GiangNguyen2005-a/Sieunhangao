<?php
include '../Chung/config.php';

$manv = $_POST['manv'];

try {
    $conn->begin_transaction();

    // Xóa từ ttbh
    $sql_ttbh = "DELETE FROM ttbh WHERE manv = ?";
    $stmt_ttbh = $conn->prepare($sql_ttbh);
    $stmt_ttbh->bind_param("s", $manv);
    $stmt_ttbh->execute();

    // Xóa từ qlbh
    $sql_qlbh = "DELETE FROM qlbh WHERE manv = ?";
    $stmt_qlbh = $conn->prepare($sql_qlbh);
    $stmt_qlbh->bind_param("s", $manv);
    $stmt_qlbh->execute();

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Xóa thành công']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conn->close();
?>