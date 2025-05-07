<?php
require_once 'config.php';

// Đặt locale tiếng Việt
setlocale(LC_ALL, 'vi_VN.UTF-8');

// Lấy tham số tìm kiếm và lọc trạng thái
$keyword = isset($_GET['keyword']) ? mysqli_real_escape_string($conn, $_GET['keyword']) : '';
$status = isset($_GET['status']) ? mysqli_real_escape_string($conn, $_GET['status']) : '';

// Xây dựng câu lệnh SQL để lấy danh sách
$sql = "SELECT d.TenUV, d.ViTriUV, d.Diem, d.NhanXet, p.TrangThai, p.LyDo 
        FROM danhgiaungvien d 
        LEFT JOIN pheduyetungvien p ON d.TenUV = p.TenUV AND d.ViTriUV = p.ViTriUV 
        WHERE (d.TenUV LIKE ? OR d.ViTriUV LIKE ?)";
$params = ["%$keyword%", "%$keyword%"];
$types = "ss";

// Thêm điều kiện lọc theo trạng thái nếu có
if ($status !== '') {
    if ($status === 'Chờ duyệt') {
        $sql .= " AND (p.TrangThai IS NULL OR p.TrangThai = 'Chờ duyệt')";
    } else {
        $sql .= " AND p.TrangThai = ?";
        $params[] = $status;
        $types .= "s";
    }
}

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode([]);
    error_log("Lỗi chuẩn bị câu lệnh: " . $conn->error);
    exit();
}

$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$approvals = [];
while ($row = $result->fetch_assoc()) {
    $row['TrangThai'] = $row['TrangThai'] ?? 'Chờ duyệt'; // Đảm bảo trạng thái mặc định
    $approvals[] = $row;
}

header('Content-Type: application/json');
echo json_encode($approvals);

$stmt->close();
$conn->close();
?>