<?php
// Nhúng file cấu hình kết nối database
require_once 'config.php';
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thêm mục tiêu mới</title>    
    <?php include '../Chung/relink.php'; ?>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <?php include '../Chung/sidebar.php'; ?>

            <!-- Main Content -->
            <div class="col-md-10 main-content">
                <!-- Tiêu đề và nút quay lại -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Thêm mục tiêu mới</h2>
                    <a href="muc_tieu.php" class="btn btn-secondary">
                        <i class="fas fa-arrow-left"></i> Quay lại
                    </a>
                </div>

                <!-- Hiển thị thông báo lỗi nếu có -->
                <?php if (isset($_GET['error'])): ?>
                    <div class="alert alert-danger">
                        <?php echo htmlspecialchars($_GET['error']); ?>
                    </div>
                <?php endif; ?>

                <!-- Form container -->
                <div class="form-container">
                    <!-- Form thêm mục tiêu -->
                    <form action="process_add_goal.php" method="POST">
                        <div class="row mb-3">
                            <!-- Mã mục tiêu -->
                            <div class="col-md-6">
                                <label class="form-label">Mã mục tiêu</label>
                                <input type="text" class="form-control" name="ma_muc_tieu" required>
                            </div>
                            <!-- Tên mục tiêu -->
                            <div class="col-md-6">
                                <label class="form-label">Tên mục tiêu</label>
                                <input type="text" class="form-control" name="ten_muc_tieu" required>
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
                                            echo "<option value='" . htmlspecialchars($row['ma_phong']) . "'>" . 
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
                                    <option value="Đang thực hiện">Đang thực hiện</option>
                                    <option value="Hoàn thành">Hoàn thành</option>
                                    <option value="Tạm dừng">Tạm dừng</option>
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <!-- Ngày bắt đầu -->
                            <div class="col-md-6">
                                <label class="form-label">Ngày bắt đầu</label>
                                <input type="date" class="form-control" name="ngay_bat_dau" required>
                            </div>
                            <!-- Ngày kết thúc -->
                            <div class="col-md-6">
                                <label class="form-label">Ngày kết thúc</label>
                                <input type="date" class="form-control" name="ngay_ket_thuc" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <!-- Số lượng đề ra -->
                            <div class="col-md-6">
                                <label class="form-label">Số lượng đề ra</label>
                                <input type="number" class="form-control" name="so_luong_de_ra" min="0" required>
                            </div>
                            <!-- Số lượng đã đạt -->
                            <div class="col-md-6">
                                <label class="form-label">Số lượng đã đạt</label>
                                <input type="number" class="form-control" name="so_luong_da_dat" min="0" required>
                            </div>
                        </div>
                        <!-- Mô tả mục tiêu -->
                        <div class="mb-3">
                            <label class="form-label">Mô tả mục tiêu</label>
                            <textarea class="form-control" name="mo_ta" rows="3"></textarea>
                        </div>
                        <!-- Chi tiết mục tiêu -->
                        <div class="mb-3">
                            <label class="form-label">Chi tiết mục tiêu</label>
                            <textarea class="form-control" name="chi_tiet" rows="4"></textarea>
                        </div>
                        <!-- Nút lưu mục tiêu -->
                        <div class="text-end">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Lưu mục tiêu
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
        // Hàm cập nhật danh sách phân chuyền khi phòng ban thay đổi
        function updatePhanChuyen() {
            var maPhong = document.getElementById('ma_phong').value;
            var phanChuyenSelect = document.getElementById('phan_chuyen');
            
            // Xóa tất cả các option hiện tại
            phanChuyenSelect.innerHTML = '<option value="">Chọn phân chuyền</option>';
            
            if (maPhong) {
                // Gửi AJAX request để lấy danh sách phân chuyền
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'get_phan_chuyen.php?ma_phong=' + maPhong, true);
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        var phanChuyenList = JSON.parse(xhr.responseText);
                        phanChuyenList.forEach(function(phanChuyen) {
                            var option = document.createElement('option');
                            option.value = phanChuyen.ma_chuyen;
                            option.textContent = phanChuyen.ten_chuyen;
                            phanChuyenSelect.appendChild(option);
                        });
                    }
                };
                xhr.send();
            }
        }

        // Thêm event listener cho select phòng ban
        document.getElementById('ma_phong').addEventListener('change', updatePhanChuyen);

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
    </script>
</body>
</html> 