<?php
header('Content-Type: application/json');
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $searchInput = $data['searchInput'] ?? '';

    if (empty($searchInput)) {
        echo json_encode(["error" => "Vui lòng nhập thông tin để tra cứu"]);
        exit;
    }

    // Truy vấn thông tin nhân viên
    $sqlNV = "SELECT MaNV, TenNV, CCCD FROM NhanVien WHERE MaNV = ? OR CCCD = ? OR TenNV LIKE ?";
    $stmtNV = $conn->prepare($sqlNV);
    $likeSearch = "%$searchInput%";
    $stmtNV->bind_param("sss", $searchInput, $searchInput, $likeSearch);
    $stmtNV->execute();
    $resultNV = $stmtNV->get_result();

    if ($resultNV->num_rows > 0) {
        $nvData = $resultNV->fetch_assoc();
        $maNV = $nvData['MaNV'];

        // Truy vấn Xác nhận tờ khai
        $sqlXn = "SELECT
            COUNT(*) AS TongSoBanGhi,
            COUNT(CASE WHEN SoTienNop > 0 THEN 1 END) AS SoLuongDaNop,
            COUNT(CASE WHEN SoTienNop <= 0 OR SoTienNop IS NULL THEN 1 END) AS SoLuongChuaNop,
            COALESCE(SUM(SoTienNop), 0) AS TongTienDaNop
        FROM XacNhanToKhai
        WHERE MaNV = ?";
        $stmtXn = $conn->prepare($sqlXn);
        $stmtXn->bind_param("s", $maNV);
        $stmtXn->execute();
        $resultXn = $stmtXn->get_result();
        $rowXn = $resultXn->fetch_assoc();

        // Truy vấn Tờ khai thuế
        $sqlTk = "SELECT
            COUNT(*) AS TongSoBanGhi,
            COALESCE(SUM(TongThuNhap), 0) AS TongThuNhap,
            COALESCE(SUM(TongThuePhaiNop), 0) AS TongThuePhaiNop
        FROM ToKhaiThue
        WHERE MaNV = ?";
        $stmtTk = $conn->prepare($sqlTk);
        $stmtTk->bind_param("s", $maNV);
        $stmtTk->execute();
        $resultTk = $stmtTk->get_result();
        $rowTk = $resultTk->fetch_assoc();

        // Truy vấn Thông tin thuế
        $sqlThongTinThue = "SELECT
            COALESCE(SUM(ThuNhapChinh), 0) AS TongThuNhapChinh,
            COALESCE(SUM(Thuong), 0) AS TongThuong,
            COALESCE(SUM(PhuCap), 0) AS TongPhuCap,
            COALESCE(SUM(GiamTru), 0) AS TongGiamTru,
            COALESCE(SUM(BaoHiem), 0) AS TongBaoHiem
        FROM ThongTinThue
        WHERE MaNV = ?";
        $stmtThongTinThue = $conn->prepare($sqlThongTinThue);
        $stmtThongTinThue->bind_param("s", $maNV);
        $stmtThongTinThue->execute();
        $resultThongTinThue = $stmtThongTinThue->get_result();
        $rowThongTinThue = $resultThongTinThue->fetch_assoc();

        // Tạo mảng kết quả
        $data = [
            'TenNV' => $nvData['TenNV'],
            'MaNV' => $nvData['MaNV'],
            'CCCD' => $nvData['CCCD'],
            'XacNhanToKhai' => [
                'TongSoBanGhi' => (int)$rowXn['TongSoBanGhi'],
                'SoLuongDaNop' => (int)$rowXn['SoLuongDaNop'],
                'SoLuongChuaNop' => (int)$rowXn['SoLuongChuaNop'],
                'TongTienDaNop' => number_format((float)$rowXn['TongTienDaNop'], 2, '.', '')
            ],
            'ToKhaiThue' => [
                'TongSoBanGhi' => (int)$rowTk['TongSoBanGhi'],
                'TongThuNhap' => number_format((float)$rowTk['TongThuNhap'], 2, '.', ''),
                'TongThuePhaiNop' => number_format((float)$rowTk['TongThuePhaiNop'], 2, '.', '')
            ],
            'ThongTinThue' => [
                'TongThuNhapChinh' => number_format((float)$rowThongTinThue['TongThuNhapChinh'], 2, '.', ''),
                'TongThuong' => number_format((float)$rowThongTinThue['TongThuong'], 2, '.', ''),
                'TongPhuCap' => number_format((float)$rowThongTinThue['TongPhuCap'], 2, '.', ''),
                'TongGiamTru' => number_format((float)$rowThongTinThue['TongGiamTru'], 2, '.', ''),
                'TongBaoHiem' => number_format((float)$rowThongTinThue['TongBaoHiem'], 2, '.', '')
            ],
            'TrangThai' => ($rowXn['TongTienDaNop'] > 0) ? 'Đã nộp' : 'Chưa nộp'
        ];

        echo json_encode(["success" => true, "data" => $data]);
    } else {
        echo json_encode(["error" => "Không tìm thấy thông tin"]);
    }

    // Đóng statement
    $stmtNV->close();
    $stmtXn->close();
    $stmtTk->close();
    $stmtThongTinThue->close();
}

$conn->close();
?>