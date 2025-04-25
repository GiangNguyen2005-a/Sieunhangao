<?php
// Nhúng file cấu hình kết nối database
require_once 'config.php';

// Kiểm tra xem có tham số id được truyền vào qua URL không
if (!isset($_GET['id']) || empty($_GET['id'])) {
    // Nếu không có id, chuyển hướng về trang danh sách mục tiêu
    header('Location: muc_tieu.php');
    exit();
}

// Lấy id mục tiêu cần sửa từ URL
$id = $_GET['id'];

// Chuẩn bị câu lệnh SQL để lấy thông tin mục tiêu
$sql = "SELECT * FROM muc_tieu WHERE id = ?";

// Chuẩn bị statement để thực thi câu lệnh SQL
$stmt = mysqli_prepare($conn, $sql);

// Gán giá trị cho tham số id trong câu lệnh SQL
mysqli_stmt_bind_param($stmt, "i", $id);

// Thực thi câu lệnh SQL
mysqli_stmt_execute($stmt);

// Lấy kết quả từ statement
$result = mysqli_stmt_get_result($stmt);

// Lấy dữ liệu mục tiêu dạng mảng kết hợp
$muc_tieu = mysqli_fetch_assoc($result);

// Kiểm tra xem có tìm thấy mục tiêu không
if (!$muc_tieu) {
    // Nếu không tìm thấy, chuyển hướng về trang danh sách
    header('Location: muc_tieu.php');
    exit();
}

// Xử lý khi form được submit
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Lấy dữ liệu từ form
    $ten_muc_tieu = $_POST['ten_muc_tieu'];      // Tên mục tiêu
    $phan_chuyen = $_POST['phan_chuyen'];        // Phân chuyền
    $ngay_bat_dau = $_POST['ngay_bat_dau'];      // Ngày bắt đầu
    $ngay_ket_thuc = $_POST['ngay_ket_thuc'];    // Ngày kết thúc
    $trang_thai = $_POST['trang_thai'];          // Trạng thái
    $so_luong_de_ra = $_POST['so_luong_de_ra'];  // Số lượng đề ra
    $so_luong_da_dat = $_POST['so_luong_da_dat'];// Số lượng đã đạt

    // Chuẩn bị câu lệnh SQL để cập nhật thông tin mục tiêu
    $sql = "UPDATE muc_tieu SET 
            ten_muc_tieu = ?, 
            phan_chuyen = ?, 
            ngay_bat_dau = ?, 
            ngay_ket_thuc = ?, 
            trang_thai = ?, 
            so_luong_de_ra = ?, 
            so_luong_da_dat = ? 
            WHERE id = ?";
    
    // Chuẩn bị statement để thực thi câu lệnh SQL
    $stmt = mysqli_prepare($conn, $sql);

    // Gán giá trị cho các tham số trong câu lệnh SQL
    // "sssssiii" là chuỗi định dạng kiểu dữ liệu cho các tham số:
    // s: string (chuỗi)
    // i: integer (số nguyên)
    mysqli_stmt_bind_param($stmt, "sssssiii", 
        $ten_muc_tieu, 
        $phan_chuyen, 
        $ngay_bat_dau, 
        $ngay_ket_thuc, 
        $trang_thai, 
        $so_luong_de_ra, 
        $so_luong_da_dat, 
        $id
    );

    // Thực thi câu lệnh SQL
    if (mysqli_stmt_execute($stmt)) {
        // Nếu cập nhật thành công, chuyển hướng về trang danh sách với thông báo thành công
        header('Location: muc_tieu.php?success=1');
        exit();
    } else {
        // Nếu có lỗi, gán thông báo lỗi vào biến $error
        $error = "Có lỗi xảy ra khi cập nhật mục tiêu";
    }
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sửa mục tiêu</title>
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
        /* CSS cho phần profile */
        .profile-section {
            text-align: center;
            padding: 20px;
            margin-bottom: 20px;
        }
        .profile-image {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin-bottom: 10px;
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
                    <h2>Sửa mục tiêu</h2>
                    <a href="muc_tieu.php" class="btn btn-secondary">
                        <i class="fas fa-arrow-left"></i> Quay lại
                    </a>
                </div>

                <!-- Hiển thị thông báo lỗi nếu có -->
                <?php if (isset($error)): ?>
                    <div class="alert alert-danger"><?php echo $error; ?></div>
                <?php endif; ?>

                <!-- Form container -->
                <div class="form-container">
                    <!-- Form sửa mục tiêu -->
                    <form method="POST" action="">
                        <div class="row mb-3">
                            <!-- Mã mục tiêu -->
                            <div class="col-md-6">
                                <label class="form-label">Mã mục tiêu</label>
                                <input type="text" class="form-control" name="ma_muc_tieu" 
                                       value="<?php echo htmlspecialchars($muc_tieu['ma_muc_tieu']); ?>" required>
                            </div>
                            <!-- Tên mục tiêu -->
                            <div class="col-md-6">
                                <label class="form-label">Tên mục tiêu</label>
                                <input type="text" class="form-control" name="ten_muc_tieu" 
                                       value="<?php echo htmlspecialchars($muc_tieu['ten_muc_tieu']); ?>" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <!-- Phòng ban -->
                            <div class="col-md-6">
                                <label class="form-label">Phòng ban</label>
                                <select class="form-select" id="ma_phong" name="ma_phong" required>
                                    <option value="">Chọn phòng ban</option>
                                    <?php
                                    // Lấy danh sách phòng ban từ database
                                    $sql = "SELECT * FROM phong_ban ORDER BY ma_phong";
                                    $result = mysqli_query($conn, $sql);
                                    
                                    if (mysqli_num_rows($result) > 0) {
                                        while($row = mysqli_fetch_assoc($result)) {
                                            $selected = ($muc_tieu['ma_phong'] == $row['ma_phong']) ? 'selected' : '';
                                            echo "<option value='" . htmlspecialchars($row['ma_phong']) . "' $selected>" . 
                                                 htmlspecialchars($row['ma_phong']) . " - " . 
                                                 htmlspecialchars($row['ten_phong']) . "</option>";
                                        }
                                    }
                                    ?>
                                </select>
                            </div>
                            <!-- Phân chuyền -->
                            <div class="col-md-6">
                                <label class="form-label">Phân chuyền</label>
                                <select class="form-select" id="phan_chuyen" name="phan_chuyen" required>
                                    <option value="">Chọn phân chuyền</option>
                                </select>
                                <div class="invalid-feedback">Vui lòng chọn phân chuyền</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <!-- Trạng thái -->
                            <div class="col-md-6">
                                <label class="form-label">Trạng thái mục tiêu</label>
                                <select class="form-select" name="trang_thai" required>
                                    <option value="Đang thực hiện" <?php echo $muc_tieu['trang_thai'] == 'Đang thực hiện' ? 'selected' : ''; ?>>Đang thực hiện</option>
                                    <option value="Hoàn thành" <?php echo $muc_tieu['trang_thai'] == 'Hoàn thành' ? 'selected' : ''; ?>>Hoàn thành</option>
                                    <option value="Tạm dừng" <?php echo $muc_tieu['trang_thai'] == 'Tạm dừng' ? 'selected' : ''; ?>>Tạm dừng</option>
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <!-- Ngày bắt đầu -->
                            <div class="col-md-6">
                                <label class="form-label">Ngày bắt đầu</label>
                                <input type="date" class="form-control" name="ngay_bat_dau" 
                                       value="<?php echo $muc_tieu['ngay_bat_dau']; ?>" required>
                            </div>
                            <!-- Ngày kết thúc -->
                            <div class="col-md-6">
                                <label class="form-label">Ngày kết thúc</label>
                                <input type="date" class="form-control" name="ngay_ket_thuc" 
                                       value="<?php echo $muc_tieu['ngay_ket_thuc']; ?>" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <!-- Số lượng đề ra -->
                            <div class="col-md-6">
                                <label class="form-label">Số lượng đề ra</label>
                                <input type="number" class="form-control" name="so_luong_de_ra" min="0" 
                                       value="<?php echo $muc_tieu['so_luong_de_ra']; ?>" required>
                            </div>
                            <!-- Số lượng đã đạt -->
                            <div class="col-md-6">
                                <label class="form-label">Số lượng đã đạt</label>
                                <input type="number" class="form-control" name="so_luong_da_dat" min="0" 
                                       value="<?php echo $muc_tieu['so_luong_da_dat']; ?>" required>
                            </div>
                        </div>
                        <!-- Mô tả mục tiêu -->
                        <div class="mb-3">
                            <label class="form-label">Mô tả mục tiêu</label>
                            <textarea class="form-control" name="mo_ta" rows="3"><?php echo htmlspecialchars($muc_tieu['mo_ta']); ?></textarea>
                        </div>
                        <!-- Chi tiết mục tiêu -->
                        <div class="mb-3">
                            <label class="form-label">Chi tiết mục tiêu</label>
                            <textarea class="form-control" name="chi_tiet" rows="4"><?php echo htmlspecialchars($muc_tieu['chi_tiet']); ?></textarea>
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
    <script>
        // Hàm cập nhật danh sách phân chuyền
        function updatePhanChuyen() {
            var phanChuyenSelect = document.getElementById('phan_chuyen');
            
            // Xóa tất cả các option hiện tại
            phanChuyenSelect.innerHTML = '<option value="">Chọn phân chuyền</option>';
            
            // Gửi AJAX request để lấy danh sách phân chuyền
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'get_phan_chuyen.php', true);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    var phanChuyenList = JSON.parse(xhr.responseText);
                    phanChuyenList.forEach(function(phanChuyen) {
                        var option = document.createElement('option');
                        option.value = phanChuyen.ma_chuyen;
                        option.textContent = phanChuyen.ten_chuyen;
                        if (phanChuyen.ma_chuyen === '<?php echo $muc_tieu['phan_chuyen']; ?>') {
                            option.selected = true;
                        }
                        phanChuyenSelect.appendChild(option);
                    });
                }
            };
            xhr.send();
        }

        // Thêm validation cho form
        document.querySelector('form').addEventListener('submit', function(event) {
            const phanChuyenSelect = document.getElementById('phan_chuyen');
            if (!phanChuyenSelect.value) {
                phanChuyenSelect.classList.add('is-invalid');
                event.preventDefault();
            } else {
                phanChuyenSelect.classList.remove('is-invalid');
            }
        });

        // Tải danh sách phân chuyền khi trang được tải
        document.addEventListener('DOMContentLoaded', function() {
            updatePhanChuyen();
        });
    </script>
</body>
</html> 