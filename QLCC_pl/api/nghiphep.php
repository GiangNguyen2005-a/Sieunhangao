<?php
require_once '../config.php';
header('Content-Type: application/json');

$action = isset($_GET['action']) ? $_GET['action'] : '';

function generateMaDXNP($conn) {
    $result = mysqli_query($conn, "SELECT MAX(MaDXNP) as maxMaDXNP FROM DonXinNghiPhep");
    $row = mysqli_fetch_assoc($result);
    $maxMaDXNP = $row['maxMaDXNP'];
    if (!$maxMaDXNP) return 'DXNP001';
    $num = (int)substr($maxMaDXNP, 4) + 1;
    return 'DXNP' . str_pad($num, 3, '0', STR_PAD_LEFT);
}

function generateMaPXDNP($conn) {
    $result = mysqli_query($conn, "SELECT MAX(MaPXDNP) as maxMaPXDNP FROM P_XetDuyetNP");
    $row = mysqli_fetch_assoc($result);
    $maxMaPXDNP = $row['maxMaPXDNP'];
    if (!$maxMaPXDNP) return 'PXDNP001';
    $num = (int)substr($maxMaPXDNP, 5) + 1;
    return 'PXDNP' . str_pad($num, 3, '0', STR_PAD_LEFT);
}

switch ($action) {
    case 'submitLeave':
        $data = json_decode(file_get_contents('php://input'), true);
        $maNV = $data['maNV'];
        $start = $data['start'];
        $end = $data['end'];
        $reason = mysqli_real_escape_string($conn, $data['reason']);
        $maDXNP = generateMaDXNP($conn);
        $query = "INSERT INTO DonXinNghiPhep (MaDXNP, MaNV, LyDo, TGBatDau, TGKetThuc, TinhTrang) 
                  VALUES ('$maDXNP', '$maNV', '$reason', '$start 00:00:00', '$end 23:59:59', 'Chờ duyệt')";
        if (mysqli_query($conn, $query)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Lỗi khi gửi đơn nghỉ phép']);
        }
        break;

    case 'getDonNghiPhep':
        $data = json_decode(file_get_contents('php://input'), true);
        $phongBan = $data['phongBan'] === '-- Lọc phòng ban --' ? '' : $data['phongBan'];
        $thang = $data['thang'] === '-- Lọc tháng --' ? '' : $data['thang'];
        $nam = $data['nam'] === '-- Lọc năm --' ? '' : $data['nam'];
        $trangThai = $data['trangThai'] === '-- Lọc trạng thái --' ? '' : $data['trangThai'];
        $query = "SELECT d.MaDXNP, d.MaNV, n.TenNV, pB.MaPB as phongBan, 
                         DATE_FORMAT(d.TGBatDau, '%d/%m/%Y') as tuNgay, 
                         DATE_FORMAT(d.TGKetThuc, '%d/%m/%Y') as denNgay, 
                         d.LyDo, d.TinhTrang,
                         DATE_FORMAT(d.TGBatDau, '%d/%m/%Y') as ngayGui
                  FROM DonXinNghiPhep d
                  JOIN NhanVien n ON d.MaNV = n.MaNV
                  JOIN PhongBan pB ON n.MaPB = pB.MaPB
                  WHERE 1=1";
        if ($phongBan) $query .= " AND pB.MaPB = '$phongBan'";
        if ($thang) $query .= " AND MONTH(d.TGBatDau) = '$thang'";
        if ($nam) $query .= " AND YEAR(d.TGBatDau) = '$nam'";
        if ($trangThai) $query .= " AND d.TinhTrang = '$trangThai'";
        $result = mysqli_query($conn, $query);
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }
        echo json_encode($data);
        break;

    case 'updateLeaveStatus':
        $data = json_decode(file_get_contents('php://input'), true);
        $updates = $data['updates'];
        $success = true;
        foreach ($updates as $update) {
            $maDXNP = $update['maDXNP'];
            $tinhTrang = $update['tinhTrang'];
            $maPXDNP = generateMaPXDNP($conn);
            $tgXetDuyet = date('Y-m-d H:i:s');
            $query1 = "UPDATE DonXinNghiPhep SET TinhTrang = '$tinhTrang' WHERE MaDXNP = '$maDXNP'";
            $query2 = "INSERT INTO P_XetDuyetNP (MaPXDNP, MaDXNP, TinhTrang, TGXetDuyet) 
                       VALUES ('$maPXDNP', '$maDXNP', '$tinhTrang', '$tgXetDuyet')";
            if (!mysqli_query($conn, $query1) || !mysqli_query($conn, $query2)) {
                $success = false;
            }
        }
        $query = "SELECT d.MaDXNP, d.MaNV, n.TenNV, pB.MaPB as phongBan, 
                         DATE_FORMAT(d.TGBatDau, '%d/%m/%Y') as tuNgay, 
                         DATE_FORMAT(d.TGKetThuc, '%d/%m/%Y') as denNgay, 
                         d.LyDo, d.TinhTrang,
                         DATE_FORMAT(d.TGBatDau, '%d/%m/%Y') as ngayGui
                  FROM DonXinNghiPhep d
                  JOIN NhanVien n ON d.MaNV = n.MaNV
                  JOIN PhongBan pB ON n.MaPB = pB.MaPB";
        $result = mysqli_query($conn, $query);
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }
        echo json_encode(['success' => $success, 'data' => $data]);
        break;
}
?>