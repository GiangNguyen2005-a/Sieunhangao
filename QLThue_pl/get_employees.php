
<?php
header('Content-Type: application/json');
require 'db_connect.php';

$sql = "SELECT nv.MaNV as id, nv.TenNV as name, pb.TenPB as department
        FROM NhanVien nv
        JOIN PhongBan pb ON nv.MaPB = pb.MaPB";
$result = $conn->query($sql);

$employees = [];
while ($row = $result->fetch_assoc()) {
    $employees[] = $row;
}

echo json_encode($employees);

$conn->close();
?>