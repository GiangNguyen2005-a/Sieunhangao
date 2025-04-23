<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hệ thống tuyển dụng</title>
    <link rel="stylesheet" href="tuyendung.css" />
    <?php include '../Chung/relink.php'; ?>
</head>

<body>
    <!-- sửa -->
    <div class="d-flex">
        <!-- sửa  -->
        <!-- Sidebarchung -->
        <?php include '../Chung/sidebar.php'; ?>
        <div class="main-content p-4">
            <h2 class="mb-4">Quản lý tuyển dụng</h2>
            <div class="content-wrapper">
                <div class="top-nav">
                    <div class="nav-section">
                        <nav class="main-nav">
                            <a href="#" data-page="recruitment"><i class="fas fa-plus-circle"></i> Tạo tin tuyển dụng</a>
                            <a href="#" data-page="interview"><i class="fas fa-calendar-alt"></i> Tạo lịch phỏng vấn</a>
                            <a href="#" data-page="evaluation"><i class="fas fa-star"></i> Đánh giá ứng viên</a>
                            <a href="#" data-page="report"><i class="fas fa-chart-line"></i> Báo cáo chất lượng</a>
                            <a href="#" data-page="approval"><i class="fas fa-check-circle"></i>Phê duyệt</a>
                        </nav>
                    </div>
                </div>
                <!-- Main content -->
                <div class="main-area">
                    <div id="main-content">
                        <!-- Nội dung SPA sẽ hiển thị ở đây -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="tuyendung.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</body>

</html>