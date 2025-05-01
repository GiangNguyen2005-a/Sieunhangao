<?php
include '../Chung/config.php';
$manv = $_POST['manv'];
$sql = "SELECT COUNT(*) as count FROM qlbh WHERE manv = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $manv);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
echo json_encode(['exists' => $row['count'] > 0]);
$conn->close();
?>