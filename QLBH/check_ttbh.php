<?php
include '../Chung/config.php';
$manv = $_POST['manv'];
$sql = "SELECT * FROM ttbh WHERE manv = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $manv);
$stmt->execute();
$result = $stmt->get_result();
echo json_encode(['exists' => $result->num_rows > 0]);
$conn->close();
?>