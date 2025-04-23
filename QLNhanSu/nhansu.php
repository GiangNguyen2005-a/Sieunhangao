<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hệ thống Quản lý Nhân sự</title>
    <link rel="stylesheet" href="nhansu.css" />
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <?php include '../Chung/relink.php'; ?>
</head>
<body>
<div class="d-flex">
    <!-- Sidebarchung -->
    <?php include '../Chung/sidebar.php'; ?>
    <!-- Main Content -->
    <div class="main-content p-4">
        <h2 class="mb-4">Quản lý Nhân Sự</h2>
        
        <div class="top-nav">
            <div class="nav-section">
                <div class="nav-links">
                    <a href="#" data-page="ho-so"><i class="fas fa-users"></i> Quản lý Hồ sơ</a>
                    <a href="#" data-page="hop-dong"><i class="fas fa-file-contract"></i> Quản lý Hợp đồng</a>
                    <a href="#" data-page="thu-tuc"><i class="fas fa-tasks"></i> Quản lý Thủ tục</a>
                    <a href="#" data-page="khen-thuong-ky-luat"><i class="fas fa-award"></i> Khen thưởng & Kỷ luật</a>
                    <a href="#" data-page="bao-cao"><i class="fas fa-chart-bar"></i> Báo cáo Thống kê</a>
                </div>
            </div>
        </div>
        <div id="main-content">
        </div>
    </div>
</div>

    <script src="nhansu.js"></script>
</body>

</html>