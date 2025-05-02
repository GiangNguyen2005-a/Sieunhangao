<?php
require_once '../config.php';
header('Content-Type: application/json');

$action = isset($_GET['action']) ? $_GET['action'] : $_POST['action'];

function generateMaCC($conn) {
    $result = mysqli_query($conn, "SELECT MAX(MaCC) as maxMaCC FROM ChamCong");
    $row = mysqli_fetch_assoc($result);
    $maxMaCC = $row['maxMaCC'];
    if (!$maxMaCC) return 'CC001';
    $num = (int)substr($maxMaCC, 2) + 1;
    return 'CC' . str_pad($num, 3, '0', STR_PAD_LEFT);
}

function generateMaPHCC($conn) {
    $result = mysqli_query($conn, "SELECT MAX(MaPHCC) as maxMaPHCC FROM PhanHoiChamCong");
    $row = mysqli_fetch_assoc($result);
    $maxMaPHCC = $row['maxMaPHCC'];
    if (!$maxMaPHCC) return 'PHCC001';
    $num = (int)substr($maxMaPHCC, 4) + 1;
    return 'PHCC' . str_pad($num, 3, '0', STR_PAD_LEFT);
}

switch ($action) {
    case 'getFilterOptions':
        $phongBan = mysqli_query($conn, "SELECT DISTINCT MaPB as phongBan FROM PhongBan");
        $phongBanOptions = [];
        while ($row = mysqli_fetch_assoc($phongBan)) {
            $phongBanOptions[] = $row['phongBan'];
        }
        $thangOptions = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        $namOptions = ['2023', '2024', '2025', '2026', '2027'];
        $trangThaiNghiOptions = ['Chờ duyệt', 'Đã duyệt', 'Từ chối'];
        echo json_encode([
            'phongBanOptions' => $phongBanOptions,
            'thangOptions' => $thangOptions,
            'namOptions' => $namOptions,
            'trangThaiNghiOptions' => $trangThaiNghiOptions
        ]);
        break;

    case 'checkChamCongToday':
        $today = date('Y-m-d');
        $query = "SELECT GioDen, GioVe FROM ChamCong WHERE MaNV = 'NV001' AND Ngay = '$today'";
        $result = mysqli_query($conn, $query);
        $data = mysqli_fetch_assoc($result);
        echo json_encode($data ?: []);
        break;

    case 'checkIn':
        $data = json_decode(file_get_contents('php://input'), true);
        $maNV = $data['maNV'];
        $today = date('Y-m-d');
        $gioDen = date('H:i:s');
        $maCC = generateMaCC($conn);
        $trangThai = (date('H') >= 8) ? 'Đi muộn' : 'Đi làm';
        $query = "INSERT INTO ChamCong (MaCC, MaNV, Ngay, GioDen, TrangThai) VALUES ('$maCC', '$maNV', '$today', '$gioDen', '$trangThai')";
        if (mysqli_query($conn, $query)) {
            echo json_encode(['success' => true, 'maCC' => $maCC]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Lỗi khi chấm công']);
        }
        break;

    case 'checkOut':
        $data = json_decode(file_get_contents('php://input'), true);
        $maNV = $data['maNV'];
        $today = date('Y-m-d');
        $gioVe = date('H:i:s');
        $trangThai = (date('H') < 17) ? 'Về sớm' : 'Đi làm';
        $query = "UPDATE ChamCong SET GioVe = '$gioVe', TrangThai = '$trangThai' WHERE MaNV = '$maNV' AND Ngay = '$today' AND GioVe IS NULL";
        if (mysqli_query($conn, $query)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Lỗi khi chấm công']);
        }
        break;

    case 'getChamCongCaNhan':
        $data = json_decode(file_get_contents('php://input'), true);
        $maNV = $data['maNV'];
        $tuNgay = $data['tuNgay'] ?: '1970-01-01';
        $denNgay = $data['denNgay'] ?: '9999-12-31';
        $query = "SELECT c.MaCC, c.Ngay, c.GioDen, c.GioVe, c.TrangThai, p.NoiDung as noiDungPhanHoi, p.BangChung
                  FROM ChamCong c
                  LEFT JOIN PhanHoiChamCong p ON c.MaCC = p.MaCC
                  WHERE c.MaNV = '$maNV' AND c.Ngay BETWEEN '$tuNgay' AND '$denNgay'";
        $result = mysqli_query($conn, $query);
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = [
                'maCC' => $row['MaCC'],
                'ngay' => date('d/m/Y', strtotime($row['Ngay'])),
                'gioDen' => $row['GioDen'] ? substr($row['GioDen'], 0, 5) : '',
                'gioVe' => $row['GioVe'] ? substr($row['GioVe'], 0, 5) : '',
                'trangThai' => $row['TrangThai'],
                'noiDungPhanHoi' => $row['noiDungPhanHoi'],
                'bangChung' => $row['BangChung']
            ];
        }
        echo json_encode($data);
        break;

    case 'getTongHopChamCong':
        $data = json_decode(file_get_contents('php://input'), true);
        $phongBan = $data['phongBan'] === '-- Lọc phòng ban --' ? '' : $data['phongBan'];
        $thang = $data['thang'] === '-- Lọc tháng --' ? '' : $data['thang'];
        $trangThai = $data['trangThai'] === '-- Lọc trạng thái --' ? '' : $data['trangThai'];
        $phanHoi = $data['phanHoi'] === '-- Lọc phản hồi --' ? '' : $data['phanHoi'];
        $query = "SELECT c.MaCC, c.MaNV, n.TenNV, pB.MaPB as phongBan, c.Ngay, c.GioDen, c.GioVe, c.TrangThai, p.NoiDung as noiDungPhanHoi, p.BangChung
                  FROM ChamCong c
                  JOIN NhanVien n ON c.MaNV = n.MaNV
                  JOIN PhongBan pB ON n.MaPB = pB.MaPB
                  LEFT JOIN PhanHoiChamCong p ON c.MaCC = p.MaCC
                  WHERE 1=1";
        if ($phongBan) $query .= " AND pB.MaPB = '$phongBan'";
        if ($thang) $query .= " AND MONTH(c.Ngay) = '$thang'";
        if ($trangThai) $query .= " AND c.TrangThai = '$trangThai'";
        if ($phanHoi === 'Đã phản hồi') $query .= " AND p.NoiDung IS NOT NULL";
        if ($phanHoi === 'Chưa phản hồi') $query .= " AND p.NoiDung IS NULL";
        $result = mysqli_query($conn, $query);
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = [
                'maCC' => $row['MaCC'],
                'maNV' => $row['MaNV'],
                'tenNV' => $row['TenNV'],
                'phongBan' => $row['phongBan'],
                'ngay' => date('d/m/Y', strtotime($row['Ngay'])),
                'gioDen' => $row['GioDen'] ? substr($row['GioDen'], 0, 5) : '',
                'gioVe' => $row['GioVe'] ? substr($row['GioVe'], 0, 5) : '',
                'trangThai' => $row['TrangThai'],
                'noiDungPhanHoi' => $row['noiDungPhanHoi'],
                'bangChung' => $row['BangChung']
            ];
        }
        echo json_encode($data);
        break;

    case 'submitFeedback':
        $maCC = $_POST['maCC'];
        $noiDung = $_POST['noiDung'];
        $maPHCC = generateMaPHCC($conn);
        $bangChung = '';
        if (isset($_FILES['bangChung']) && $_FILES['bangChung']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = 'uploads/';
            if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);
            $bangChung = $uploadDir . basename($_FILES['bangChung']['name']);
            move_uploaded_file($_FILES['bangChung']['tmp_name'], $bangChung);
        }
        $query = "INSERT INTO PhanHoiChamCong (MaPHCC, MaCC, NoiDung, BangChung) VALUES ('$maPHCC', '$maCC', '$noiDung', '$bangChung')";
        if (mysqli_query($conn, $query)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Lỗi khi gửi phản hồi']);
        }
        break;

    case 'approveFeedback':
        $data = json_decode(file_get_contents('php://input'), true);
        $maCC = $data['maCC'];
        $status = $data['status'];
        $query = "UPDATE PhanHoiChamCong SET NoiDung = CONCAT(NoiDung, ' [$status]') WHERE MaCC = '$maCC'";
        if (mysqli_query($conn, $query)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Lỗi khi duyệt phản hồi']);
        }
        break;
}
?>