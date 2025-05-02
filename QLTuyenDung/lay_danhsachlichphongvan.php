<?php
require_once 'config.php';

$keyword = isset($_GET['keyword']) ? mysqli_real_escape_string($conn, $_GET['keyword']) : '';

$sql = "SELECT * FROM lichphongvan WHERE MaUV LIKE ? OR ViTri LIKE ? OR HinhThuc LIKE ?";
$stmt = $conn->prepare($sql);
$searchTerm = "%$keyword%";
$stmt->bind_param("sss", $searchTerm, $searchTerm, $searchTerm);
$stmt->execute();
$result = $stmt->get_result();

$schedules = [];
while ($row = $result->fetch_assoc()) {
    $schedules[] = $row;
}

header('Content-Type: application/json');
echo json_encode($schedules);

$stmt->close();
$conn->close();
?>