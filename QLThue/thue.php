<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hệ thống quản lý thuế TNCN</title>
    <link rel="stylesheet" href="thue.css" />
    <?php include '../Chung/relink.php'; ?>
</head>

<body>
    <div class="d-flex">
        <!-- sửa  -->
        <!-- Sidebarchung -->
        <?php include '../Chung/sidebar.php'; ?>
        <div class="main-content p-4">
            <h2 class="mb-4">Quản lý chấm công</h2>
            <div class="content-wrapper">
                <div class="top-nav">
                    <div class="nav-section">
                        <!-- sửa  -->
                        <nav class="nav-links">
                            <a href="#" data-page="form"><i class="fas fa-file-alt"></i> Nhập thông tin thuế</a>
                            <a href="#" data-page="declare" class="active"><i class="fas fa-calculator"></i> Tạo tờ khai</a>
                            <a href="#" data-page="xacnhan"><i class="fas fa-check-circle"></i> Xác nhận đã nộp</a>
                            <a href="#" data-page="tracuu"><i class="fas fa-search"></i> Tra cứu thuế</a>
                        </nav>
                    </div>
                </div>
                <!-- Main content -->
                <!-- sửa  -->
                <div id="main-content">
                    <div class="wrapper">
                        <h1>Chọn nhân viên để tạo tờ khai thuế</h1>
                        <input type="text" id="searchEmployee" placeholder="Tìm kiếm nhân viên...">
                        <ul id="employeeList"></ul>
                    </div>
                    </main>
                </div>
            </div>
        </div>
        <script src="thue.js"></script>
</body>

</html>