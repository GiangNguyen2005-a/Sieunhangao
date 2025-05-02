<?php
require_once 'config.php';

$keyword = isset($_GET['keyword']) ? mysqli_real_escape_string($conn, $_GET['keyword']) : '';

$sql = "SELECT * FROM baocaotuyendung WHERE PhongBan LIKE ? OR Thang LIKE ?";
$stmt = $conn->prepare($sql);
$searchTerm = "%$keyword%";
$stmt->bind_param("ss", $searchTerm, $searchTerm);
$stmt->execute();
$result = $stmt->get_result();

$reports = [];
while ($row = $result->fetch_assoc()) {
    $reports[] = $row;
}

header('Content-Type: application/json');
echo json_encode($reports);

$stmt->close();
$conn->close();
?>