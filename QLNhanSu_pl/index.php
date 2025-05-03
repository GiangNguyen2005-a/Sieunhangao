<?php
require_once 'config.php';
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hệ thống quản lý nhân sự</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <?php include '..\Chung\relink.php'; ?>
</head>
<body>
    <div class="d-flex">
        <?php include '..\Chung\sidebar.php'; ?>
        <div class="main-content p-4">
            <h2 class="mb-4">Quản lý nhân sự</h2>
            <div class="content-wrapper">
                <!-- Thanh điều hướng trên cùng -->
                <div class="top-nav">            
                    <nav class="main-nav">
                        <a href="#" data-page="ho-so"> Quản lý hồ sơ</a>
                        <a href="#" data-page="hop-dong"> Quản lý hợp đồng</a>
                        <a href="#" data-page="thu-tuc"> Quản lý thủ tục</a>
                        <a href="#" data-page="khen-thuong-ky-luat"> Khen thưởng & Kỷ luật</a>
                        <a href="#" data-page="bao-cao"> Báo cáo thống kê</a>
                    </nav>
                </div>
                <!-- Nội dung chính -->
                <div id="main-content" class="main-content"></div>
            </div> <!-- Đóng content-wrapper -->
        </div>
    </div>
    <script src="scripts.js"></script>
</body>
</html>