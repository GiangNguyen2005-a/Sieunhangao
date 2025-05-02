
<!DOCTYPE html>

<html lang="vi">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hệ thống quản lý thuế TNCN</title>
    <link rel="stylesheet" href="thue.css" />
    <?php include '..\Chung\relink.php'; ?>
</head>
<body>
    <div class="d-flex">
        <?php include '..\Chung\sidebar.php'; ?>
        <div class="main-content p-4">
            <h2 class="mb-4">Quản lý thuế TNCN</h2>
            <div class="content-wrapper">
                <div class="top-nav">
                    <nav class="nav-links">
                        <a href="#" data-page="form"><i class="fas fa-file-alt"></i> Nhập thông tin thuế</a>
                        <a href="#" data-page="declare"><i class="fas fa-calculator"></i> Tạo tờ khai</a>
                        <a href="#" data-page="xacnhan"><i class="fas fa-check-circle"></i> Xác nhận đã nộp</a>
                        <a href="#" data-page="tracuu" class="active"><i class="fas fa-search"></i> Tra cứu thuế</a>
                    </nav>
                </div>
                <div id="main-content"></div>
            </div>
        </div>
    </div>
    <script src="quanlythue.js"></script>
</body>
</html>