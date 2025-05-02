
<?php
header('Content-Type: application/json');
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $searchInput = $_POST['searchInput'] ?? '';

    if (empty($searchInput)) {
        echo json_encode(["error" => "Vui lòng nhập thông tin để tra cứu"]);
        exit;
    }

    $sql = "SELECT nv.TenNV, t.MST, nv.CCCD, SUM(xn.SoTienNop) as TongThueNop
            FROM NhanVien nv
            LEFT JOIN ThongTinThue t ON nv.MaNV = t.MaNV
            LEFT JOIN XacNhanThue xn ON nv.MaNV = xn.MaNV
            WHERE t.MST = ? OR nv.CCCD = ? OR nv.TenNV LIKE ?
            GROUP BY nv.MaNV";
    $stmt = $conn->prepare($sql);
    $likeSearch = "%$searchInput%";
    $stmt->bind_param("sss", $searchInput, $searchInput, $likeSearch);

    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();

    if ($data) {
        echo json_encode(["success" => true, "data" => $data]);
    } else {
        echo json_encode(["error" => "Không tìm thấy thông tin"]);
    }

    $stmt->close();
}

$conn->close();
?>