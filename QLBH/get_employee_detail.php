<?php
include '../Chung/config.php';

if(isset($_POST['manv'])) {
    $manv = $_POST['manv'];
    
    $sql = "SELECT nv.*, tt.mabh, tt.nbd, tt.nkt, kb.phuongankb, kb.trangthai, 
            kb.mucdongnld, kb.mucdongdn, vt.tenvt, pb.tenpb, nv.cccd
            FROM nhanvien nv
            LEFT JOIN ttbh tt ON nv.manv = tt.manv
            LEFT JOIN kbbh kb ON tt.manv = kb.manv
            LEFT JOIN vitri vt ON nv.mavt = vt.mavt
            LEFT JOIN phongban pb ON nv.mapb = pb.mapb
            WHERE nv.manv = ?";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $manv);
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