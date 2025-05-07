<?php
header('Content-Type: application/json');
require 'db_connect.php';


$sql = "SELECT tk.MaTK, tk.MaNV, tk.KyKeKhai, tk.TongThuNhap, tk.TongThuePhaiNop, nv.TenNV as name, pb.TenPB as department
        FROM ToKhaiThue tk
        JOIN NhanVien nv ON tk.MaNV = nv.MaNV
        JOIN PhongBan pb ON nv.MaPB = pb.MaPB";

$result = $conn->query($sql);

$taxDeclarations = [];
while ($row = $result->fetch_assoc()) {
    $taxDeclarations[] = $row;
}
echo json_encode($taxDeclarations);
$conn->close();
?>
