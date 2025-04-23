<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản lý mục tiêu - Hệ thống quản lý nhân sự</title>
    <?php include '../Chung/relink.php'; ?>
</head>
<body>
    <div class="d-flex">
        <!-- Sidebarchung -->
        <?php include '../Chung/sidebar.php'; ?>

        <!-- Main Content -->
        <div class="main-content flex-grow-1 p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Quản lý mục tiêu</h2>                
                <a href="themmuctieu.php">
                    <button class="btn btn-primary">
                            <i class="fas fa-plus"></i>
                            Thêm mục tiêu mới
                    </button>
                </a>
            </div>

            <!-- Search and Filter Section -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="input-group">
                                <span class="input-group-text bg-light">
                                    <i class="fas fa-search"></i>
                                </span>
                                <input type="text" class="form-control" placeholder="Tìm kiếm mục tiêu...">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select">
                                <option selected>Trạng thái</option>
                                <option>Đang thực hiện</option>
                                <option>Hoàn thành</option>
                                <option>Tạm dừng</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select">
                                <option selected>Phòng ban</option>
                                <option>Phòng Nhân sự</option>
                                <option>Phòng Kỹ thuật</option>
                                <option>Phòng Kinh doanh</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-outline-secondary w-100">
                                <i class="fas fa-filter"></i> Lọc
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Goals List -->
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>Mã mục tiêu</th>
                                    <th>Tên mục tiêu</th>
                                    <th>Phòng ban</th>
                                    <th>Ngày bắt đầu</th>
                                    <th>Hạn hoàn thành</th>
                                    <th>Trạng thái</th>
                                    <th>Tiến độ</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>MT001</td>
                                    <td>Tăng doanh số bán hàng Q2/2024</td>
                                    <td>Phòng Kinh doanh</td>
                                    <td>01/04/2024</td>
                                    <td>30/06/2024</td>
                                    <td><span class="badge bg-primary">Đang thực hiện</span></td>
                                    <td>
                                        <div class="progress" style="height: 5px;">
                                            <div class="progress-bar" role="progressbar" style="width: 65%"></div>
                                        </div>
                                        <small class="text-muted">65%</small>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary me-1">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>MT002</td>
                                    <td>Triển khai hệ thống quản lý mới</td>
                                    <td>Phòng Kỹ thuật</td>
                                    <td>15/03/2024</td>
                                    <td>15/05/2024</td>
                                    <td><span class="badge bg-success">Hoàn thành</span></td>
                                    <td>
                                        <div class="progress" style="height: 5px;">
                                            <div class="progress-bar bg-success" role="progressbar" style="width: 100%"></div>
                                        </div>
                                        <small class="text-muted">100%</small>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary me-1">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>MT003</td>
                                    <td>Tuyển dụng nhân sự cho dự án mới</td>
                                    <td>Phòng Nhân sự</td>
                                    <td>01/05/2024</td>
                                    <td>31/07/2024</td>
                                    <td><span class="badge bg-warning text-dark">Tạm dừng</span></td>
                                    <td>
                                        <div class="progress" style="height: 5px;">
                                            <div class="progress-bar bg-warning" role="progressbar" style="width: 30%"></div>
                                        </div>
                                        <small class="text-muted">30%</small>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-primary me-1">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <nav class="mt-3">
                        <ul class="pagination justify-content-end">
                            <li class="page-item disabled">
                                <a class="page-link" href="#"><i class="fas fa-chevron-left"></i></a>
                            </li>
                            <li class="page-item active"><a class="page-link" href="#">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                            <li class="page-item">
                                <a class="page-link" href="#"><i class="fas fa-chevron-right"></i></a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>