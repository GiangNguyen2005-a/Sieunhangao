<?php
require_once 'config.php';

$keyword = isset($_GET['keyword']) ? mysqli_real_escape_string($conn, $_GET['keyword']) : '';

$sql = "SELECT * FROM danhgiaungvien WHERE TenUV LIKE ? OR ViTriUV LIKE ? OR NhanXet LIKE ?";
$stmt = $conn->prepare($sql);
$searchTerm = "%$keyword%";
$stmt->bind_param("sss", $searchTerm, $searchTerm, $searchTerm);
$stmt->execute();
$result = $stmt->get_result();

$evaluations = [];
while ($row = $result->fetch_assoc()) {
    $evaluations[] = $row;
}

header('Content-Type: application/json');
echo json_encode($evaluations);

$stmt->close();
$conn->close();
?>