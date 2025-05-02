<?php
require_once 'config.php';

$keyword = isset($_GET['keyword']) ? mysqli_real_escape_string($conn, $_GET['keyword']) : '';

$sql = "SELECT * FROM tintuyendung WHERE TieuDe LIKE ? OR ViTri LIKE ? OR PhongBan LIKE ? OR DotTuyenDung LIKE ?";
$stmt = $conn->prepare($sql);
$searchTerm = "%$keyword%";
$stmt->bind_param("ssss", $searchTerm, $searchTerm, $searchTerm, $searchTerm);
$stmt->execute();
$result = $stmt->get_result();

$recruitments = [];
while ($row = $result->fetch_assoc()) {
    $recruitments[] = $row;
}

header('Content-Type: application/json');
echo json_encode($recruitments);

$stmt->close();
$conn->close();
?>