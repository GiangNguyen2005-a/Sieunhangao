<?php
include '../Chung/config.php';

if (isset($_POST['insuranceId'])) {
    $insuranceId = $_POST['insuranceId'];

    $sql = "SELECT nv.tennv, nv.cccd, nv.ngaysinh, nv.gioitinh, nv.sdt, tt.mabh
            FROM nhanvien nv
            INNER JOIN ttbh tt ON nv.manv = tt.manv
            WHERE tt.mabh = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $insuranceId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        echo json_encode($data);
    } else {
        echo json_encode(['error' => 'Không tìm thấy thông tin cho mã số BHXH này.']);
    }
} else {
    echo json_encode(['error' => 'Vui lòng nhập mã số BHXH.']);
}
?>