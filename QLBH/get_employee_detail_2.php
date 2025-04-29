<?php
include '../Chung/config.php';

if(isset($_POST['cccd'])) {
    $cccd = $_POST['cccd'];
    
    $sql = "SELECT nv.*, kb.*
            FROM nhanvien nv
            LEFT JOIN ttbh tt ON nv.manv = tt.manv
            LEFT JOIN kbbh kb ON tt.mabh = kb.mabh
            WHERE nv.cccd = ?";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $cccd);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if($row = $result->fetch_assoc()) {
        echo json_encode($row);
    } else {
        echo json_encode(['error' => 'Không tìm thấy thông tin nhân viên']);
    }
    
    $conn->close();
}
?>