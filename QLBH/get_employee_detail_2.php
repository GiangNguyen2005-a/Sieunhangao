<?php
include '../Chung/config.php';

if(isset($_POST['makb'])) {
    $cccd = $_POST['makb'];
    
    $sql = "SELECT nv.tennv, nv.cccd, kb.ngaygui, kb.phuongankb, kb.trangthai, kb.makb, tt.*
            from kbbh kb
            left join nhanvien nv on kb.manv = nv.manv
            left JOIN ttbh tt ON nv.manv = tt.manv
            WHERE kb.trangthai <> 'Đang xử lý' and kb.makb = ?";
            
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