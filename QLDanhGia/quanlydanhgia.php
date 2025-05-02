<?php
// quanlydanhgia.php
require_once 'config.php';
session_start();
$current_user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'NV001'; // Giả sử user_id từ session
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Quản lý đánh giá</title>
    <link rel="stylesheet" href="quanlydanhgia.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script defer src="quanlydanhgia.js"></script>
    <?php include '../Chung/relink.php'; ?>
</head>
<body>
    <div class="d-flex">
        <?php include '../Chung/sidebar.php'; ?>
        <div class="main-content p-4">
            <h2 class="mb-4">Đánh giá nhân viên</h2>
            <input type="hidden" id="currentUserId" value="<?php echo htmlspecialchars($current_user_id); ?>">
            <div class="content-wrapper">
                <div class="top-nav">
                    <div class="nav-section">
                        <nav class="main-nav">
                            <a href="#" class="active" data-tab="thietlap"><i class="fas fa-sliders-h"></i>Thiết lập kỳ đánh giá</a>
                            <a href="#" data-tab="thuchien"><i class="fas fa-edit"></i>Thực hiện đánh giá</a>
                            <a href="#" data-tab="baocao"><i class="fas fa-chart-bar"></i>Báo cáo</a>
                        </nav>
                    </div>
                </div>
                <div class="main-area">
                    <div id="thietlap" class="tab active-tab">
                        <div class="header-area">
                            <h2>Thiết lập kỳ đánh giá</h2>
                            <button id="addBtn">Thêm kỳ đánh giá</button>
                        </div>
                        <div class="table-responsive">
                            <table class="evaluation-table">
                                <thead>
                                    <tr>
                                        <th>Tên kỳ đánh giá</th>
                                        <th>Thời gian áp dụng</th>
                                        <th>Hạn đánh giá</th>
                                        <th>Vị trí áp dụng</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody id="evaluation-list"></tbody>
                            </table>
                        </div>
                        <div class="form-container" id="formContainer">
                            <h3 id="formTitle">Thêm kỳ đánh giá</h3>
                            <form id="evaluationForm">
                                <fieldset>
                                    <legend>Thiết lập chung</legend>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="maKyDG">Mã kỳ đánh giá:</label>
                                            <input type="text" id="maKyDG" name="maKyDG" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="tenKy">Tên kỳ đánh giá:</label>
                                            <input type="text" id="tenKy" name="ten" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="hanQuanLyDanhGia">Hạn đánh giá:</label>
                                            <input type="date" id="hanQuanLyDanhGia" name="han" required>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="viTriDanhGia">Vị trí đánh giá:</label>
                                            <select name="vitri" id="viTriDanhGia" required>
                                                <option value="tatca">Tất cả</option>
                                                <option value="Nhân viên văn phòng">Nhân viên văn phòng</option>
                                                <option value="Nhân viên xưởng">Nhân viên xưởng</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="phuongPhap">Phương pháp đánh giá:</label>
                                            <input type="text" id="phuongPhap" name="phuongphap">
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label>Thời gian áp dụng:</label>
                                            <div class="time-apply">
                                                <select name="thang" id="thangApDung" required>
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
                                                <select name="nam" id="namApDung" required>
                                                    <option>2025</option>
                                                    <option>2024</option>
                                                    <option>2023</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <legend>Đối tượng đánh giá</legend>
                                    <div class="employee-actions">
                                        <button type="button" id="checkAllEmployees">Chọn tất cả</button>
                                        <button type="button" id="uncheckAllEmployees">Bỏ chọn tất cả</button>
                                    </div>
                                    <div id="employeeListContainer" class="employee-list">
                                        <p>Vui lòng chọn vị trí đánh giá để xem danh sách nhân viên.</p>
                                    </div>
                                </fieldset>
                                <div class="form-actions">
                                    <button type="submit" id="saveBtn">Lưu</button>
                                    <button type="button" id="cancelBtn">Hủy</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div id="thuchien" class="tab">
                        <div class="sub-nav">
                            <button class="sub-nav-item active" data-subtab="tu-danh-gia"><i class="fas fa-user-check"></i> Tự đánh giá</button>
                            <button class="sub-nav-item" data-subtab="xem-ql-danh-gia"><i class="fas fa-user-tie"></i> Xem QL đánh giá</button>
                            <button class="sub-nav-item" data-subtab="danh-gia-nv"><i class="fas fa-users"></i> Đánh giá NV cấp dưới</button>
                        </div>
                        <div class="sub-tab-content active-sub-tab" id="tu-danh-gia">
                            <div class="evaluation-form-container card">
                                <h3 class="form-title">Phiếu Tự Đánh Giá</h3>
                                <div class="form-group">
                                    <label for="tuDanhGiaKy">Chọn Kỳ Đánh giá để thực hiện <span class="required">*</span></label>
                                    <select id="tuDanhGiaKy" name="tuDanhGiaKy" required></select>
                                </div>
                                <fieldset class="criteria-group">
                                    <legend>Tiêu chí đánh giá (Thang điểm 1-10)</legend>
                                    <div class="criteria-grid">
                                        <div class="form-group">
                                            <label for="tc1">Am hiểu về sản phẩm</label>
                                            <select id="tc1" name="tc1">
                                                <option value="">- Chọn điểm -</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="tc2">Am hiểu nghiệp vụ</label>
                                            <select id="tc2" name="tc2">
                                                <option value="">- Chọn điểm -</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="tc3">Quản lý</label>
                                            <select id="tc3" name="tc3">
                                                <option value="">- Chọn điểm -</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="tc4">Phân tích</label>
                                            <select id="tc4" name="tc4">
                                                <option value="">- Chọn điểm -</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="tc5">Quản lý dự án</label>
                                            <select id="tc5" name="tc5">
                                                <option value="">- Chọn điểm -</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="tc6">Giải quyết vấn đề</label>
                                            <select id="tc6" name="tc6">
                                                <option value="">- Chọn điểm -</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="tc7">Tinh thần trách nhiệm</label>
                                            <select id="tc7" name="tc7">
                                                <option value="">- Chọn điểm -</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label for="tc8">Thái độ</label>
                                            <select id="tc8" name="tc8">
                                                <option value="">- Chọn điểm -</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="tuNhanXet">Nhận xét chung (tùy chọn):</label>
                                        <textarea id="tuNhanXet" name="tuNhanXet" rows="4"></textarea>
                                    </div>
                                </fieldset>
                                <div class="form-actions">
                                    <button type="button" id="saveTuDanhGiaBtn" class="btn btn-primary"><i class="fas fa-save"></i> Lưu Tự đánh giá</button>
                                </div>
                            </div>
                        </div>
                        <div class="sub-tab-content" id="xem-ql-danh-gia">
                            <div class="evaluation-view-container card">
                                <h3 class="form-title">Xem Kết quả Đánh giá từ Quản lý</h3>
                                <div class="form-group">
                                    <label for="xemQlKy">Chọn Kỳ Đánh giá để xem <span class="required">*</span></label>
                                    <select id="xemQlKy" name="xemQlKy" required></select>
                                </div>
                                <div id="ketQuaQlArea" style="display: none;">
                                    <h4>Kết quả Đánh giá từ Quản lý</h4>
                                    <p><strong>Mã phiếu:</strong> <span id="maPhieuQl"></span></p>
                                    <div class="result-details">
                                        <div class="scores">
                                            <strong>Điểm số chi tiết (Thang 1-10):</strong>
                                            <ul>
                                                <li>Am hiểu về sản phẩm: <span class="score-value" id="ql_tc1"></span></li>
                                                <li>Am hiểu nghiệp vụ: <span class="score-value" id="ql_tc2"></span></li>
                                                <li>Quản lý: <span class="score-value" id="ql_tc3"></span></li>
                                                <li>Phân tích: <span class="score-value" id="ql_tc4"></span></li>
                                                <li>Quản lý dự án: <span class="score-value" id="ql_tc5"></span></li>
                                                <li>Giải quyết vấn đề: <span class="score-value" id="ql_tc6"></span></li>
                                                <li>Tinh thần trách nhiệm: <span class="score-value" id="ql_tc7"></span></li>
                                                <li>Thái độ: <span class="score-value" id="ql_tc8"></span></li>
                                            </ul>
                                            <strong class="total-score">Tổng điểm: <span id="ql_tongdiem"></span></strong>
                                        </div>
                                        <div class="comments">
                                            <strong>Nhận xét từ Quản lý:</strong>
                                            <div class="comment-box" id="ql_nhanxet"></div>
                                            <button type="button" id="guiPhanHoiBtn" class="btn btn-secondary"><i class="fas fa-comment-dots"></i> Gửi Phản hồi về Đánh giá</button>
                                            <span id="phanHoiCountMsg" style="font-size: 0.9em; color: grey; margin-left: 10px;"></span>
                                            <div id="phanHoiInputArea" style="display: none; margin-top: 15px;">
                                                <textarea id="phanHoiText" rows="4" placeholder="Nhập nội dung phản hồi của bạn..."></textarea>
                                                <button type="button" id="submitPhanHoiBtn" class="btn btn-primary" style="margin-top: 5px;">Gửi</button>
                                                <button type="button" id="cancelPhanHoiBtn" class="btn btn-secondary" style="margin-top: 5px;">Hủy</button>
                                            </div>
                                            <div id="lichSuPhanHoi" style="margin-top: 20px;"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="sub-tab-content" id="danh-gia-nv">
                            <div class="evaluate-subordinates-container card">
                                <h3 class="form-title">Đánh giá nhân viên cấp dưới</h3>
                                <div class="form-group">
                                    <label for="danhGiaNvKy">Chọn Kỳ đánh giá:</label>
                                    <select id="danhGiaNvKy" name="danhGiaNvKy"></select>
                                </div>
                                <h4>Danh sách nhân viên cần đánh giá:</h4>
                                <table class="subordinate-table">
                                    <thead>
                                        <tr>
                                            <th>Tên nhân viên</th>
                                            <th>Vị trí</th>
                                            <th>Trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody id="subordinateTableBody"></tbody>
                                </table>
                                <div id="employeeEvaluationDetail" class="card" style="display: none; margin-top: 20px; background-color: #f9f9f9; position: relative;">
                                    <h4 id="employeeDetailTitle">Đánh giá chi tiết cho: [Tên nhân viên]</h4>
                                    <button id="closeEmployeeDetail" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 1.5em; cursor: pointer; line-height: 1; padding:0;">×</button>
                                    <div class="employee-self-evaluation">
                                        <h5><i class="fas fa-user"></i> Bản tự đánh giá của nhân viên</h5>
                                        <div class="result-details">
                                            <div class="scores">
                                                <strong>Điểm tự đánh giá:</strong>
                                                <ul id="employeeSelfScores"></ul>
                                                <strong class="total-score">Tổng điểm tự đánh giá: <span id="employeeSelfTotal"></span></strong>
                                            </div>
                                            <div class="comments">
                                                <strong>Nhận xét của nhân viên:</strong>
                                                <div class="comment-box" id="employeeSelfComment"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr style="margin: 20px 0;">
                                    <div class="manager-evaluation">
                                        <h5><i class="fas fa-user-tie"></i> Đánh giá của Quản lý</h5>
                                        <form id="managerEvaluationForm">
                                            <fieldset class="criteria-group">
                                                <legend>Chấm điểm tiêu chí (Thang 1-10)</legend>
                                                <div class="criteria-grid">
                                                    <div class="form-group">
                                                        <label for="mgr_tc1">Am hiểu về sản phẩm</label>
                                                        <select id="mgr_tc1" name="mgr_tc1">
                                                            <option value="">- Chọn điểm -</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                            <option value="6">6</option>
                                                            <option value="7">7</option>
                                                            <option value="8">8</option>
                                                            <option value="9">9</option>
                                                            <option value="10">10</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="mgr_tc2">Am hiểu nghiệp vụ</label>
                                                        <select id="mgr_tc2" name="mgr_tc2">
                                                            <option value="">- Chọn điểm -</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                            <option value="6">6</option>
                                                            <option value="7">7</option>
                                                            <option value="8">8</option>
                                                            <option value="9">9</option>
                                                            <option value="10">10</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="mgr_tc3">Quản lý</label>
                                                        <select id="mgr_tc3" name="mgr_tc3">
                                                            <option value="">- Chọn điểm -</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                            <option value="6">6</option>
                                                            <option value="7">7</option>
                                                            <option value="8">8</option>
                                                            <option value="9">9</option>
                                                            <option value="10">10</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="mgr_tc4">Phân tích</label>
                                                        <select id="mgr_tc4" name="mgr_tc4">
                                                            <option value="">- Chọn điểm -</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                            <option value="6">6</option>
                                                            <option value="7">7</option>
                                                            <option value="8">8</option>
                                                            <option value="9">9</option>
                                                            <option value="10">10</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="mgr_tc5">Quản lý dự án</label>
                                                        <select id="mgr_tc5" name="mgr_tc5">
                                                            <option value="">- Chọn điểm -</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                            <option value="6">6</option>
                                                            <option value="7">7</option>
                                                            <option value="8">8</option>
                                                            <option value="9">9</option>
                                                            <option value="10">10</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="mgr_tc6">Giải quyết vấn đề</label>
                                                        <select id="mgr_tc6" name="mgr_tc6">
                                                            <option value="">- Chọn điểm -</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                            <option value="6">6</option>
                                                            <option value="7">7</option>
                                                            <option value="8">8</option>
                                                            <option value="9">9</option>
                                                            <option value="10">10</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="mgr_tc7">Tinh thần trách nhiệm</label>
                                                        <select id="mgr_tc7" name="mgr_tc7">
                                                            <option value="">- Chọn điểm -</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                            <option value="6">6</option>
                                                            <option value="7">7</option>
                                                            <option value="8">8</option>
                                                            <option value="9">9</option>
                                                            <option value="10">10</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group">
                                                        <label for="mgr_tc8">Thái độ</label>
                                                        <select id="mgr_tc8" name="mgr_tc8">
                                                            <option value="">- Chọn điểm -</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                            <option value="6">6</option>
                                                            <option value="7">7</option>
                                                            <option value="8">8</option>
                                                            <option value="9">9</option>
                                                            <option value="10">10</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="form-group" style="margin-top:10px;">
                                                    <strong>Tổng điểm: <span id="managerTotalScore">0</span></strong>
                                                </div>
                                            </fieldset>
                                            <div class="form-group">
                                                <label for="managerComment">Nhận xét của Quản lý:</label>
                                                <textarea id="managerComment" name="managerComment" rows="4"></textarea>
                                            </div>
                                            <div class="form-actions">
                                                <button type="button" id="saveManagerEvaluationBtn" class="btn btn-primary"><i class="fas fa-save"></i> Lưu Đánh giá</button>
                                            </div>
                                        </form>
                                    </div>
                                    <div id="employeeFeedbackSection" style="margin-top: 20px; display: none;">
                                        <h5><i class="fas fa-comments"></i> Lịch sử Phản hồi</h5>
                                        <div id="feedbackHistory"></div>
                                        <div class="form-group" id="managerReplyArea" style="display: none;">
                                            <label for="managerReplyText">Trả lời phản hồi:</label>
                                            <textarea id="managerReplyText" rows="3" placeholder="Nhập nội dung trả lời..."></textarea>
                                            <button type="button" id="sendReplyBtn" class="btn btn-primary btn-sm" style="margin-top: 5px;">Gửi trả lời</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="baocao" class="tab">
                        <h2 class="main-title">Báo cáo Kết quả Đánh giá</h2>
                        <div class="report-controls card">
                            <div class="form-group">
                                <label for="baoCaoKy">Chọn Kỳ đánh giá để xem báo cáo:</label>
                                <select id="baoCaoKy" name="baoCaoKy" required></select>
                            </div>
                            <button type="button" id="taoBaoCaoBtn" class="btn btn-primary"><i class="fas fa-file-alt"></i> Tạo Báo cáo</button>
                        </div>
                        <div id="baoCaoContent" style="display: none;">
                            <div class="report-section card">
                                <h4><i class="fas fa-table"></i> Bảng Thống kê Kết quả</h4>
                                <table class="summary-table">
                                    <thead>
                                        <tr>
                                            <th>Phòng Ban</th>
                                            <th>Số NV > 80 điểm</th>
                                            <th>Số NV 50 - 80 điểm</th>
                                            <th>Số NV < 50 điểm</th>
                                            <th>Tổng số NV</th>
                                        </tr>
                                    </thead>
                                    <tbody id="summaryTableBody"></tbody>
                                    <tfoot>
                                        <tr>
                                            <td>Tổng Công ty</td>
                                            <td id="total_gt80"></td>
                                            <td id="total_50_80"></td>
                                            <td id="total_lt50"></td>
                                            <td id="total_all"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div class="report-section card">
                                <h4><i class="fas fa-chart-bar"></i> Biểu đồ Phân loại Kết quả</h4>
                                <div class="chart-container">
                                    <canvas id="reportChartCanvas"></canvas>
                                </div>
                            </div>
                            <div class="report-section card">
                                <h4><i class="fas fa-trophy"></i> Top 10 Nhân viên Xuất sắc nhất</h4>
                                <ol class="top-employee-list" id="top10List"></ol>
                            </div>
                            <div class="report-actions">
                                <button type="button" id="sendReportBtn" class="btn btn-success"><i class="fas fa-paper-plane"></i> Gửi báo cáo cho Giám đốc</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="confirmPopup" class="popup-overlay">
        <div class="popup-content">
            <p>Bạn có chắc chắn muốn xóa kỳ đánh giá này?</p>
            <button id="confirmDelete">Có</button>
            <button id="cancelDelete">Không</button>
        </div>
    </div>
</body>
</html>