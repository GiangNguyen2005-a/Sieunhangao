<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thêm mục tiêu mới - Hệ thống quản lý nhân sự</title>
    <?php include '../Chung/relink.php'; ?>
</head>
<body>
    <!-- Main Content -->
    <div class="d-flex">
        <!-- Sidebarchung -->
        <?php include '../Chung/sidebar.php'; ?>

        <div class="main-content flex-grow-1 p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">Thêm mục tiêu mới</h2>
            </div>

            <!-- Form Section -->
            <div class="card">
                <div class="card-body">
                    <form>
                        <div class="row g-4">
                            <!-- Thông tin cơ bản -->
                            <div class="col-md-12">
                                <h5 class="card-title mb-3">Thông tin cơ bản</h5>
                            </div>
                            
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="form-label">Mã mục tiêu</label>
                                    <input type="text" class="form-control" placeholder="Nhập mã mục tiêu">
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="form-label">Phòng ban phụ trách</label>
                                    <select class="form-select">
                                        <option selected disabled>Chọn phòng ban</option>
                                        <option>Phòng Nhân sự</option>
                                        <option>Phòng Kỹ thuật</option>
                                        <option>Phòng Kinh doanh</option>
                                    </select>
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="form-group">
                                    <label class="form-label">Tên mục tiêu</label>
                                    <input type="text" class="form-control" placeholder="Nhập tên mục tiêu">
                                </div>
                            </div>

                            <div class="col-md-12">
                                <div class="form-group">
                                    <label class="form-label">Mô tả mục tiêu</label>
                                    <textarea class="form-control" rows="4" placeholder="Nhập mô tả chi tiết về mục tiêu"></textarea>
                                </div>
                            </div>

                            <!-- Thời gian và trạng thái -->
                            <div class="col-md-12">
                                <h5 class="card-title mb-3">Thời gian và trạng thái</h5>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="form-label">Ngày bắt đầu</label>
                                    <input type="date" class="form-control">
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="form-label">Hạn hoàn thành</label>
                                    <input type="date" class="form-control">
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="form-label">Trạng thái</label>
                                    <select class="form-select">
                                        <option selected disabled>Chọn trạng thái</option>
                                        <option>Đang thực hiện</option>
                                        <option>Hoàn thành</option>
                                        <option>Tạm dừng</option>
                                    </select>
                                </div>
                            </div>

                            <div class="col-md-3">
                                <div class="form-group">
                                    <label class="form-label">Số lượng yêu cầu
                                    </label>
                                    <input type="number" class="form-control" min="0" max="100" value="0">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label class="form-label">Số lượng đã đạt </label>
                                    <input type="number" class="form-control" min="0" max="100" value="0">
                                </div>
                            </div>
                            <!-- Buttons -->
                            <div class="col-12 mt-4">
                                <div class="d-flex justify-content-end gap-2">
                                    <a href="muc-tieu.php" class="btn btn-light">
                                        <i class="fas fa-times"></i> Hủy
                                    </a>
                                    <button type="submit" class="btn btn-primary">
                                        <i class="fas fa-save"></i> Lưu mục tiêu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
