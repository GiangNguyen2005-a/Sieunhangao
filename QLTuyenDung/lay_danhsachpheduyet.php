<?php
require_once 'config.php';

$keyword = isset($_GET['keyword']) ? mysqli_real_escape_string($conn, $_GET['keyword']) : '';
$status = isset($_GET['status']) ? mysqli_real_escape_string($conn, $_GET['status']) : '';

$sql = "SELECT d.TenUV, d.ViTriUV, d.Diem, d.NhanXet, p.TrangThai, p.LyDo 
        FROM danhgiaungvien d 
        LEFT JOIN pheduyetungvien p ON d.TenUV = p.TenUV AND d.ViTriUV = p.ViTriUV 
        WHERE (d.TenUV LIKE ? OR d.ViTriUV LIKE ?)";
$params = ["%$keyword%", "%$keyword%"];
$types = "ss";

if ($status !== '') {
    $sql .= " AND p.TrangThai = ?";
    $params[] = $status;
    $types .= "s";
}

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$approvals = [];
while ($row = $result->fetch_assoc()) {
    $approvals[] = $row;
}

header('Content-Type: application/json');
echo json_encode($approvals);

$stmt->close();
$conn->close();
?>