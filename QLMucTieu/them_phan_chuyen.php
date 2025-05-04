<?php
// Nhúng file cấu hình kết nối database
require_once 'config.php';
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thêm phân chuyền mới</title>
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
                    <h2>Thêm phân chuyền mới</h2>
                    <a href="phan_chuyen.php" class="btn btn-secondary">
                        <i class="fas fa-arrow-left"></i> Quay lại
                    </a>
                </div>

                <!-- Form container -->
                <div class="form-container">
                    <!-- Form thêm phân chuyền -->
                    <form action="process_add_phan_chuyen.php" method="POST">
                        <div class="row mb-3">
                            <!-- Mã phòng -->
                            <div class="col-md-12">
                                <label class="form-label">Mã phòng</label>
                                <select class="form-select" name="ma_phong" required>
                                    <option value="">Chọn mã phòng</option>
                                    <?php
                                    // Lấy danh sách phòng ban từ database
                                    $sql = "SELECT * FROM phong_ban ORDER BY ma_phong";
                                    $result = mysqli_query($conn, $sql);
                                    
                                    if (mysqli_num_rows($result) > 0) {
                                        while($row = mysqli_fetch_assoc($result)) {
                                            echo "<option value='" . htmlspecialchars($row['ma_phong']) . "'>" . htmlspecialchars($row['ma_phong']) . " - " . htmlspecialchars($row['ten_phong']) . "</option>";
                                        }
                                    }
                                    ?>
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <!-- Mã chuyền -->
                            <div class="col-md-6">
                                <label class="form-label">Mã chuyền</label>
                                <input type="text" class="form-control" name="ma_chuyen" required>
                            </div>
                            <!-- Tên chuyền -->
                            <div class="col-md-6">
                                <label class="form-label">Tên chuyền</label>
                                <input type="text" class="form-control" name="ten_chuyen" required>
                            </div>
                        </div>
                        <!-- Nút lưu phân chuyền -->
                        <div class="text-end">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Lưu phân chuyền
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