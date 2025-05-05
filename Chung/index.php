<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hệ thống quản lý nhân sự</title>
    <?php include '../Chung/relink.php'; ?>
</head>
<body>
    <div class="d-flex">
        <!-- Sidebarchung -->
        <?php include '../Chung/sidebar.php'; ?>

        <div class="main-content flex-grow-1 p-4">
            <div class="welcome-section mb-4">
                <h2>Chào mừng trở lại, <span class="text-primary">HR Manager!</span></h2>
                <p class="text-muted">Hệ thống quản lý nhân sự</p>
            </div>

            <!-- Management Cards - First Row -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="card management-card">
                        <a href="../QLMucTieu/muc_tieu.php" class="text-decoration-none text-dark">
                            <div class="card-body text-center">
                                <i class="fas fa-bullseye text-primary mb-3"></i>
                                <h5>Quản lý mục tiêu</h5>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card management-card">
                        <a href="../QLDanhGia/quanlydanhgia.php" class="text-decoration-none text-dark">
                            <div class="card-body text-center">
                                <i class="fas fa-star text-success mb-3"></i>
                                <h5>Quản lý đánh giá</h5>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card management-card">
                        <a href="../QLTuyenDung/tuyendung.php" class="text-decoration-none text-dark">
                            <div class="card-body text-center">
                                <i class="fas fa-users text-purple mb-3"></i>
                                <h5>Quản lý tuyển dụng</h5>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card management-card">
                        <a href="../QLChamCong/chamcong.php" class="text-decoration-none text-dark">
                            <div class="card-body text-center">
                                <i class="fas fa-clock text-warning mb-3"></i>
                                <h5>Quản lý chấm công</h5>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Management Cards - Second Row -->
            <div class="row">
                <div class="col-md-4">
                    <div class="card management-card">
                        <a href="../QLThue/quanlythue.php" class="text-decoration-none text-dark">
                            <div class="card-body text-center">
                                <i class="fas fa-money-bill text-danger mb-3"></i>
                                <h5>Quản lý thuế</h5>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card management-card">
                        <a href="../QLBH/qlbh.php" class="text-decoration-none text-dark">
                            <div class="card-body text-center">
                                <i class="fas fa-shield-alt text-warning mb-3"></i>
                                <h5>Quản lý bảo hiểm</h5>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card management-card">
                        <a href="../QLNhanSu/index.php" class="text-decoration-none text-dark">
                            <div class="card-body text-center">
                                <i class="fas fa-user-tie text-info mb-3"></i>
                                <h5>Quản lý nhân sự</h5>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
