<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hệ thống quản lý</title>

    <!-- CSS -->
    <link rel="stylesheet" href="chamcong.css" />

    <!-- Icon + Font đẹp -->
    <?php include '../Chung/relink.php'; ?>

    <!-- JS -->
    <script defer src="chamcong.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

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
                        <nav class="main-nav">
                            <a href="#" id="menuChamCong"><i class="fas fa-clock"></i>Chấm công</a>
                            <a href="#" id="menuNghiPhep"><i class="fas fa-plane-departure"></i>Xin nghỉ phép</a>
                            <a href="#" id="menuTongHopChamCong"><i class="fas fa-list-check"></i>Tổng hợp chấm công</a>
                            <a href="#" id="btnDanhSachNghiPhep"><i class="fas fa-calendar-alt"></i>Danh sách đơn xin nghỉ phép</a>
                            <a href="#" id="menuBaoCao"><i class="fas fa-chart-line"></i>Báo cáo</a>
                        </nav>
                    </div>
                </div>

                <!-- KHU VỰC CHÍNH -->
                <div class="main-area">
                    <!-- sửa  -->

                    <!-- PHẦN 2: Giao diện chức năng (ẩn ban đầu) -->
                    <div id="attendance-container" class="hidden">
                        <!-- Ẩn các nút chức năng vì đã chuyển sang sidebar -->
                        <div class="attendance-buttons" style="display: none;">
                            <button id="btnChamCong">Chấm công</button>
                            <button id="btnNghiPhep">Xin nghỉ phép</button>
                            <button id="btnTongHopChamCong">Tổng hợp chấm công</button>
                            <button id="btnTongHopNghiPhep">Tổng hợp nghỉ phép</button>
                            <button id="btnBaoCao">Báo cáo</button>
                        </div>

                        <!-- Nội dung động -->
                        <div id="attendance-content"></div>
                    </div>
                    <!-- DANH SÁCH ĐƠN XIN NGHỈ PHÉP -->
                    <div id="donNghiPhepSection" style="display: none;">
                        <div class="content-box">
                            <h2 class="section-title">Danh sách đơn xin nghỉ phép</h2>
                            <div class="filters">
                                <select id="filterPhongBanNghi">
                                    <option>-- Lọc phòng ban --</option>
                                </select>
                                <select id="filterThangNghi">
                                    <option>-- Lọc tháng --</option>
                                </select>
                                <select id="filterNamNghi">
                                    <option>-- Lọc năm --</option>
                                </select>
                                <select id="filterTrangThaiNghi">
                                    <option>-- Lọc trạng thái --</option>
                                </select>
                                <button class="apply-btn" onclick="apDungLocNghi()">Áp dụng</button>

                                <button class="reset-btn" onclick="resetLocNghi()">Reset</button>
                            </div>

                            <table class="custom-table">
                                <thead>
                                    <tr>
                                        <th>Mã NV</th>
                                        <th>Tên NV</th>
                                        <th>Phòng ban</th>
                                        <th>Ngày gửi</th>
                                        <th>Từ ngày</th>
                                        <th>Đến ngày</th>
                                        <th>Lý do</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody id="donNghiPhepTableBody">
                                    <!-- Dữ liệu đơn nghỉ phép sẽ được thêm bằng JS -->
                                </tbody>
                            </table>
                            <!-- ✅ Nút lưu -->
                            <div style="margin-top: 16px; text-align: right;">
                                <button id="btnLuuTrangThai" class="apply-button">Lưu trạng thái</button>
                            </div>
                        </div>
                    </div>
                    <div id="tonghopChamCong" style="display: none;">
                        <div class="content-box">
                            <h2>📊Tổng hợp dữ liệu chấm công</h2>
                            <div class="filter-row">
                                <select id="filterPhongBan">
                                    <option>-- Lọc phòng ban --</option>
                                    <option>Kỹ thuật</option>
                                    <option>Marketing</option>
                                </select>
                                <select id="filterThang">
                                    <option>-- Lọc tháng --</option>
                                    <option>01</option>
                                    <option>02</option>
                                    <option>03</option>
                                    <option>04</option>
                                    <option>05</option>
                                    <option>06</option>
                                    <option>07</option>
                                    <option>08</option>
                                    <option>09</option>
                                    <option>10</option>
                                    <option>11</option>
                                    <option>12</option>
                                </select>

                                <select id="filterTrangThai">
                                    <option>-- Lọc trạng thái --</option>
                                    <option>Hoàn thành</option>
                                    <option>Chấm công muộn</option>
                                    <option>Thiếu giờ làm</option>
                                    <option>Đã chấm công</option>
                                </select>

                                <select id="filterPhanHoi">
                                    <option>-- Lọc phản hồi --</option>
                                    <option>Đã phản hồi</option>
                                    <option>Chưa phản hồi</option>
                                </select>
                                <button class="btn btn-primary">Áp dụng</button>
                                <button class="btn btn-danger">Reset</button>
                            </div>

                            <div class="table-container"></div>
                            <table id="bangTongHopChamCong" class="bang-tonghop">

                                <thead>
                                    <tr>
                                        <th>Mã NV</th>
                                        <th>Tên NV</th>
                                        <th>Phòng ban</th>
                                        <th>Ngày</th>
                                        <th>Giờ đến</th>
                                        <th>Giờ về</th>
                                        <th>Trạng thái</th>
                                        <th>Phản hồi</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>

                        <!-- DANH SÁCH NGHỈ PHÉP CHO MENU "Danh sách đơn xin nghỉ phép" -->
                        <div id="tonghopNghiPhep" style="display: none;">
                            <h2 class="section-title">Danh sách đơn xin nghỉ phép</h2>
                            <div class="filter-row">
                                <select id="filterPhongBan">
                                    <option>-- Lọc phòng ban --</option>
                                    <option>Kỹ thuật</option>
                                    <option>Marketing</option>
                                    <option>Kế toán</option>
                                    <option>IT</option>
                                    <option>Nhân sự</option>
                                </select>

                                <select id="filterThang">
                                    <option>-- Lọc tháng --</option>
                                    <option>01</option>
                                    <option>02</option>
                                    <option>03</option>
                                    <option>04</option>
                                    <option>05</option>
                                    <option>06</option>
                                    <option>07</option>
                                    <option>08</option>
                                    <option>09</option>
                                    <option>10</option>
                                    <option>11</option>
                                    <option>12</option>
                                </select>

                                <select id="filterTrangThai">
                                    <option>-- Lọc trạng thái --</option>
                                    <option>Hoàn thành</option>
                                    <option>Chấm công muộn</option>
                                    <option>Thiếu giờ làm</option>
                                    <option>Đã chấm công</option>
                                </select>

                                <select id="filterPhanHoi">
                                    <option>-- Lọc phản hồi --</option>
                                    <option>Đã phản hồi</option>
                                    <option>Chưa phản hồi</option>
                                </select>

                                <button class="btn btn-primary">Áp dụng</button>
                                <button class="btn btn-danger">Reset</button>
                            </div>


                            <table class="bang-nghi-phep">
                                <thead>
                                    <tr>
                                        <th>Mã NV</th>
                                        <th>Tên NV</th>
                                        <th>Phòng ban</th>
                                        <th>Ngày bắt đầu</th>
                                        <th>Ngày kết thúc</th>
                                        <th>Lý do</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody id="tonghopNghiPhepBody"></tbody>

                            </table>
                            <div style="margin-top: 16px; text-align: right;">
                                <button id="btnLuuPhanHoi" class="apply-button">Lưu phản hồi</button>
                            </div>
                        </div>



                    </div>
                </div>
            </div>
</body>

</html>