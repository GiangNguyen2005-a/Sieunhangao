<?php
require_once '../config.php';
header('Content-Type: application/json');

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'chamcong':
        $data = json_decode(file_get_contents('php://input'), true);
        $phongBan = $data['phongBan'];
        $thang = $data['thang'];
        $nam = $data['nam'];
        $query = "SELECT c.MaNV, n.TenNV, pB.MaPB as phongBan, 
                         DATE_FORMAT(c.Ngay, '%d/%m/%Y') as ngay, 
                         c.GioDen, c.GioVe, c.TrangThai
                  FROM ChamCong c
                  JOIN NhanVien n ON c.MaNV = n.MaNV
                  JOIN PhongBan pB ON n.MaPB = pB.MaPB
                  WHERE pB.MaPB = '$phongBan' AND MONTH(c.Ngay) = '$thang' AND YEAR(c.Ngay) = '$nam'";
        $result = mysqli_query($conn, $query);
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = [
                'maNV' => $row['MaNV'],
                'tenNV' => $row['TenNV'],
                'phongBan' => $row['phongBan'],
                'ngay' => $row['ngay'],
                'gioDen' => $row['GioDen'] ? substr($row['GioDen'], 0, 5) : '',
                'gioVe' => $row['GioVe'] ? substr($row['GioVe'], 0, 5) : '',
                'trangThai' => $row['TrangThai']
            ];
        }
        echo json_encode($data);
        break;

    case 'nghiphep':
        $data = json_decode(file_get_contents('php://input'), true);
        $phongBan = $data['phongBan'];
        $thang = $data['thang'];
        $nam = $data['nam'];
        $query = "SELECT d.MaNV, n.TenNV, pB.MaPB as phongBan, 
                         DATE_FORMAT(d.TGBatDau, '%d/%m/%Y') as ngayGui,
                         DATE_FORMAT(d.TGBatDau, '%d/%m/%Y') as tuNgay, 
                         DATE_FORMAT(d.TGKetThuc, '%d/%m/%Y') as denNgay, 
                         d.LyDo, d.TinhTrang
                  FROM DonXinNghiPhep d
                  JOIN NhanVien n ON d.MaNV = n.MaNV
                  JOIN PhongBan pB ON n.MaPB = pB.MaPB
                  WHERE pB.MaPB = '$phongBan' AND MONTH(d.TGBatDau) = '$thang' AND YEAR(d.TGBatDau) = '$nam'";
        $result = mysqli_query($conn, $query);
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;
}
?>