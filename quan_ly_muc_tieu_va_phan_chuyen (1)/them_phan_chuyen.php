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
                    <h2>Thêm phân chuyền mới</h2>
                    <a href="danh_sach_phan_chuyen.php" class="btn btn-secondary">
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