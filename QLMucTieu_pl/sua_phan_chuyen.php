<?php
// Nhúng file cấu hình kết nối database
require_once 'config.php';

// Kiểm tra xem có tham số id được truyền vào qua URL không
if (!isset($_GET['id']) || empty($_GET['id'])) {
    // Nếu không có id, chuyển hướng về trang danh sách phân chuyền
    header('Location: phan_chuyen.php');
    exit();
}

// Lấy id phân chuyền cần sửa từ URL
$id = $_GET['id'];

// Chuẩn bị câu lệnh SQL để lấy thông tin phân chuyền
$sql = "SELECT * FROM phan_chuyen WHERE id = ?";

// Chuẩn bị statement để thực thi câu lệnh SQL
$stmt = mysqli_prepare($conn, $sql);

// Gán giá trị cho tham số id trong câu lệnh SQL
mysqli_stmt_bind_param($stmt, "i", $id);

// Thực thi câu lệnh SQL
mysqli_stmt_execute($stmt);

// Lấy kết quả từ statement
$result = mysqli_stmt_get_result($stmt);

// Lấy dữ liệu phân chuyền dạng mảng kết hợp
$phan_chuyen = mysqli_fetch_assoc($result);

// Kiểm tra xem có tìm thấy phân chuyền không
if (!$phan_chuyen) {
    // Nếu không tìm thấy, chuyển hướng về trang danh sách
    header('Location: phan_chuyen.php');
    exit();
}

// Xử lý khi form được submit
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Lấy dữ liệu từ form
    $ten_phan_chuyen = $_POST['ten_phan_chuyen'];      // Tên phân chuyền
    $nguoi_duoc_phan_chuyen = $_POST['nguoi_duoc_phan_chuyen']; // Người được phân chuyền
    $nguoi_phan_chuyen = $_POST['nguoi_phan_chuyen'];  // Người phân chuyền
    $phong_ban = $_POST['phong_ban'];                  // Phòng ban
    $ngay_bat_dau = $_POST['ngay_bat_dau'];           // Ngày bắt đầu
    $ngay_ket_thuc = $_POST['ngay_ket_thuc'];         // Ngày kết thúc
    $mo_ta = $_POST['mo_ta'];                         // Mô tả
    $chi_tiet = $_POST['chi_tiet'];                   // Chi tiết
    $trang_thai = $_POST['trang_thai'];               // Trạng thái

    // Chuẩn bị câu lệnh SQL để cập nhật thông tin phân chuyền
    $sql = "UPDATE phan_chuyen SET 
            ten_phan_chuyen = ?, 
            nguoi_duoc_phan_chuyen = ?,
            nguoi_phan_chuyen = ?,
            phong_ban = ?, 
            ngay_bat_dau = ?, 
            ngay_ket_thuc = ?, 
            mo_ta = ?,
            chi_tiet = ?,
            trang_thai = ? 
            WHERE id = ?";
    
    // Chuẩn bị statement để thực thi câu lệnh SQL
    $stmt = mysqli_prepare($conn, $sql);

    // Gán giá trị cho các tham số trong câu lệnh SQL
    // "sssssssssi" là chuỗi định dạng kiểu dữ liệu cho các tham số:
    // s: string (chuỗi)
    // i: integer (số nguyên)
    mysqli_stmt_bind_param($stmt, "sssssssssi", 
        $ten_phan_chuyen, 
        $nguoi_duoc_phan_chuyen,
        $nguoi_phan_chuyen,
        $phong_ban, 
        $ngay_bat_dau, 
        $ngay_ket_thuc, 
        $mo_ta,
        $chi_tiet,
        $trang_thai, 
        $id
    );

    // Thực thi câu lệnh SQL
    if (mysqli_stmt_execute($stmt)) {
        // Nếu cập nhật thành công, chuyển hướng về trang danh sách với thông báo thành công
        header('Location: phan_chuyen.php?success=1');
        exit();
    } else {
        // Nếu có lỗi, gán thông báo lỗi vào biến $error
        $error = "Có lỗi xảy ra khi cập nhật phân chuyền";
    }
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sửa phân chuyền</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        /* CSS cho sidebar */
        .sidebar {
            background-color: #2196F3;
            color: white;
            min-height: 100vh;
            padding: 20px 0;
        }
        .sidebar .nav-link {
            color: white;
            padding: 10px 20px;
        }
        .sidebar .nav-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        .sidebar .nav-link.active {
            background-color: rgba(255, 255, 255, 0.2);
        }
        /* CSS cho phần nội dung chính */
        .main-content {
            padding: 20px;
        }
        /* CSS cho form container */
        .form-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <?php include 'sidebar.php'; ?>

            <!-- Main Content -->
            <div class="col-md-10 main-content">
                <!-- Tiêu đề và nút quay lại -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Sửa phân chuyền</h2>
                    <a href="phan_chuyen.php" class="btn btn-secondary">
                        <i class="fas fa-arrow-left"></i> Quay lại
                    </a>
                </div>

                <!-- Hiển thị thông báo lỗi nếu có -->
                <?php if (isset($error)): ?>
                    <div class="alert alert-danger"><?php echo $error; ?></div>
                <?php endif; ?>

                <!-- Form sửa phân chuyền -->
                <div class="form-container">
                    <form method="POST" action="">
                        <div class="row mb-3">
                            <!-- Mã phân chuyền (readonly) -->
                            <div class="col-md-6">
                                <label class="form-label">Mã phân chuyền</label>
                                <input type="text" class="form-control" value="<?php echo htmlspecialchars($phan_chuyen['ma_phan_chuyen']); ?>" readonly>
                            </div>
                            <!-- Tên phân chuyền -->
                            <div class="col-md-6">
                                <label class="form-label">Tên phân chuyền</label>
                                <input type="text" class="form-control" name="ten_phan_chuyen" 
                                       value="<?php echo htmlspecialchars($phan_chuyen['ten_phan_chuyen']); ?>" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <!-- Người được phân chuyền -->
                            <div class="col-md-6">
                                <label class="form-label">Người được phân chuyền</label>
                                <input type="text" class="form-control" name="nguoi_duoc_phan_chuyen" 
                                       value="<?php echo htmlspecialchars($phan_chuyen['nguoi_duoc_phan_chuyen']); ?>" required>
                            </div>
                            <!-- Người phân chuyền -->
                            <div class="col-md-6">
                                <label class="form-label">Người phân chuyền</label>
                                <input type="text" class="form-control" name="nguoi_phan_chuyen" 
                                       value="<?php echo htmlspecialchars($phan_chuyen['nguoi_phan_chuyen']); ?>" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <!-- Phòng ban -->
                            <div class="col-md-6">
                                <label class="form-label">Phòng ban</label>
                                <select class="form-select" name="phong_ban" required>
                                    <option value="Phòng Nhân sự" <?php echo $phan_chuyen['phong_ban'] == 'Phòng Nhân sự' ? 'selected' : ''; ?>>Phòng Nhân sự</option>
                                    <option value="Phòng Kỹ thuật" <?php echo $phan_chuyen['phong_ban'] == 'Phòng Kỹ thuật' ? 'selected' : ''; ?>>Phòng Kỹ thuật</option>
                                    <option value="Phòng Kinh doanh" <?php echo $phan_chuyen['phong_ban'] == 'Phòng Kinh doanh' ? 'selected' : ''; ?>>Phòng Kinh doanh</option>
                                </select>
                            </div>
                            <!-- Trạng thái -->
                            <div class="col-md-6">
                                <label class="form-label">Trạng thái</label>
                                <select class="form-select" name="trang_thai" required>
                                    <option value="Chưa bắt đầu" <?php echo $phan_chuyen['trang_thai'] == 'Chưa bắt đầu' ? 'selected' : ''; ?>>Chưa bắt đầu</option>
                                    <option value="Đang thực hiện" <?php echo $phan_chuyen['trang_thai'] == 'Đang thực hiện' ? 'selected' : ''; ?>>Đang thực hiện</option>
                                    <option value="Hoàn thành" <?php echo $phan_chuyen['trang_thai'] == 'Hoàn thành' ? 'selected' : ''; ?>>Hoàn thành</option>
                                    <option value="Tạm dừng" <?php echo $phan_chuyen['trang_thai'] == 'Tạm dừng' ? 'selected' : ''; ?>>Tạm dừng</option>
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <!-- Ngày bắt đầu -->
                            <div class="col-md-6">
                                <label class="form-label">Ngày bắt đầu</label>
                                <input type="date" class="form-control" name="ngay_bat_dau" 
                                       value="<?php echo $phan_chuyen['ngay_bat_dau']; ?>" required>
                            </div>
                            <!-- Ngày kết thúc -->
                            <div class="col-md-6">
                                <label class="form-label">Ngày kết thúc</label>
                                <input type="date" class="form-control" name="ngay_ket_thuc" 
                                       value="<?php echo $phan_chuyen['ngay_ket_thuc']; ?>" required>
                            </div>
                        </div>
                        <!-- Mô tả -->
                        <div class="mb-3">
                            <label class="form-label">Mô tả</label>
                            <textarea class="form-control" name="mo_ta" rows="3"><?php echo htmlspecialchars($phan_chuyen['mo_ta']); ?></textarea>
                        </div>
                        <!-- Chi tiết -->
                        <div class="mb-3">
                            <label class="form-label">Chi tiết</label>
                            <textarea class="form-control" name="chi_tiet" rows="4"><?php echo htmlspecialchars($phan_chuyen['chi_tiet']); ?></textarea>
                        </div>
                        <!-- Nút lưu thay đổi -->
                        <div class="text-end">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 