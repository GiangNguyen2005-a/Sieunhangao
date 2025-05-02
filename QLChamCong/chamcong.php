<?php
// Nhúng file cấu hình kết nối database
require_once 'config.php';
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hệ thống quản lý</title>
    <link rel="stylesheet" href="chamcong.css" />
    <?php include '../Chung/relink.php'; ?>
    <script defer src="chamcong.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="d-flex">
        <?php include '../Chung/sidebar.php'; ?>
        <div class="main-content p-4">
            <h2 class="mb-4">Quản lý chấm công</h2>
            <div class="content-wrapper">
                <div class="top-nav">
                    <div class="nav-section">
                        <nav class="main-nav">
                            <a href="#" id="menuChamCong"><i class="fas fa-clock"></i>Chấm công</a>
                            <a href="#" id="menuNghiPhep"><i class="fas fa-plane-departure"></i>Xin nghỉ phép</a>
                            <a href="#" id="menuTongHopChamCong"><i class="fas fa-list-check"></i>Tổng hợp chấm công</a>
                            <a href="#" id="btnDanhSachNghiPhep"><i class="fas fa-calendar-alt"></i>Danh sách đơn xin nghỉ phép</a>
                            <a href="#" id="menuBaoCao"><i class="fas fa-chart-line"></i>Báo cáo</a>
                        </nav>
                    </div>
                </div>
                <div class="main-area">
                    <!-- Chấm công -->
                    <div id="chamCongSection" style="display: none;">
                        <div class="content-box">
                            <div class="checkin-button-wrapper">
                                <button id="checkinButton" class="checkin-button">Chấm công đến</button>
                            </div>
                            <div class="filter-bar">
                                Từ ngày: <input type="date" id="tuNgayChamCong">
                                Đến ngày: <input type="date" id="denNgayChamCong">
                                <button class="apply-button" id="btnLocChamCong">Áp dụng</button>
                                <button class="apply-button reset-button" id="btnResetChamCong">Reset</button>
                            </div>
                            <table class="attendance-table" id="attendanceTable">
                                <thead>
                                    <tr>
                                        <th>Ngày</th>
                                        <th>Giờ đến</th>
                                        <th>Giờ về</th>
                                        <th>Trạng thái</th>
                                        <th>Phản hồi</th>
                                    </tr>
                                </thead>
                                <tbody id="attendanceBody"></tbody>
                            </table>
                            <div id="feedbackPopup" class="feedback-popup" style="display:none;">
                                <h3>Gửi phản hồi</h3>
                                <label>Nội dung:</label>
                                <textarea id="feedbackContentInput" rows="3" style="width: 100%; margin-bottom: 8px;"></textarea>
                                <label>Ảnh bằng chứng:</label>
                                <input type="file" id="feedbackImageInput" accept="image/*"/>
                                <div style="margin-top: 12px;">
                                    <button onclick="submitFeedback()" class="apply-button">Gửi</button>
                                    <button onclick="closeFeedback()" class="apply-button reset-button">Quay lại</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Xin nghỉ phép -->
                    <div id="xinNghiPhepSection" style="display: none;">
                        <div class="content-box">
                            <h2><i class="fas fa-envelope-open-text"></i> Xin nghỉ phép</h2>
                            <div class="leave-form-container">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="startDate">Ngày bắt đầu:</label>
                                        <input type="date" id="startDate" class="form-control" />
                                    </div>
                                    <div class="form-group">
                                        <label for="endDate">Ngày kết thúc:</label>
                                        <input type="date" id="endDate" class="form-control" />
                                    </div>
                                </div>
                                <div class="form-group full-width">
                                    <label for="reason">Lý do nghỉ phép:</label>
                                    <textarea id="reason" class="form-control" rows="4"></textarea>
                                </div>
                                <div class="form-group right-align">
                                    <button id="submitLeave" class="submit-button">
                                        <i class="fas fa-paper-plane"></i> Gửi đơn nghỉ
                                    </button>
                                </div>
                            </div>
                            <h3><i class="fas fa-scroll"></i> Lịch sử nộp đơn xin nghỉ phép</h3>
                            <table class="leave-history-table">
                                <thead>
                                    <tr>
                                        <th>Mã NV</th>
                                        <th>Tên NV</th>
                                        <th>Ngày bắt đầu</th>
                                        <th>Ngày kết thúc</th>
                                        <th>Lý do</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody id="leaveHistoryBody"></tbody>
                            </table>
                        </div>
                    </div>
                    <!-- Danh sách đơn xin nghỉ phép -->
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
                                <tbody id="donNghiPhepTableBody"></tbody>
                            </table>
                            <div style="margin-top: 16px; text-align: right;">
                                <button id="btnLuuTrangThai" class="apply-button">Lưu trạng thái</button>
                            </div>
                        </div>
                    </div>
                    <!-- Tổng hợp chấm công -->
                    <div id="tonghopChamCong" style="display: none;">
                        <div class="content-box">
                            <h2>📊Tổng hợp dữ liệu chấm công</h2>
                            <div class="filter-row">
                                <select id="filterPhongBan">
                                    <option>-- Lọc phòng ban --</option>
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
                                    <option>Đi làm</option>
                                    <option>Vắng mặt</option>
                                    <option>Đi muộn</option>
                                    <option>Về sớm</option>
                                    <option>Nghỉ phép</option>
                                </select>
                                <select id="filterPhanHoi">
                                    <option>-- Lọc phản hồi --</option>
                                    <option>Đã phản hồi</option>
                                    <option>Chưa phản hồi</option>
                                </select>
                                <button class="btn btn-primary" onclick="filterTongHopChamCong()">Áp dụng</button>
                                <button class="btn btn-danger" onclick="resetTongHopChamCong()">Reset</button>
                            </div>
                            <div class="table-container">
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
                        </div>
                    </div>
                    <!-- Báo cáo -->
                    <div id="baoCaoSection" style="display: none;">
                        <div class="content-box">
                            <h2 class="section-title"><i class="fas fa-chart-line"></i> Báo cáo tổng hợp</h2>
                            <div class="filter-row">
                                <select id="loaiBaoCao">
                                    <option value="chamcong">Báo cáo chấm công</option>
                                    <option value="nghiphep">Báo cáo nghỉ phép</option>
                                </select>
                                <select id="locPhongBC">
                                    <option value="">-- Lọc phòng ban --</option>
                                </select>
                                <select id="locThangBC">
                                    <option value="">-- Lọc tháng --</option>
                                    <option value="01">01</option>
                                    <option value="02">02</option>
                                    <option value="03">03</option>
                                    <option value="04">04</option>
                                    <option value="05">05</option>
                                    <option value="06">06</option>
                                    <option value="07">07</option>
                                    <option value="08">08</option>
                                    <option value="09">09</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select>
                                <select id="locNamBC">
                                    <option value="">-- Lọc năm --</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                </select>
                                <button id="btnApDungBC" class="apply-button">Tạo báo cáo</button>
                            </div>
                            <div id="baoCaoTableArea"></div>
                            <div id="baoCaoCharts" style="margin-top: 40px;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>