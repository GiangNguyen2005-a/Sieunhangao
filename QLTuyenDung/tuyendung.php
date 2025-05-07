<?php
require_once 'config.php';
?>
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
    <div class="d-flex">
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
                            <a href="#" data-page="approval"><i class="fas fa-check-circle"></i> Phê duyệt</a>
                        </nav>
                    </div>
                </div>
                <div class="main-area">
                    <div id="main-content">
                        <div class="header">
                            <h1>Chào mừng trở lại, <span>HR Manager!</span></h1>
                            <p class="sub">Hệ thống quản lý tuyển dụng</p>
                        </div>
                        <div class="actions">
                            <div class="action-box lightblue" data-page="recruitment">
                                <i class="fas fa-plus"></i>
                                <h3>Tạo tin tuyển dụng</h3>
                            </div>
                            <div class="action-box lightgreen" data-page="interview">
                                <i class="fas fa-calendar-alt"></i>
                                <h3>Tạo lịch phỏng vấn</h3>
                            </div>
                            <div class="action-box lightpurple" data-page="evaluation">
                                <i class="fas fa-star"></i>
                                <h3>Đánh giá ứng viên</h3>
                            </div>
                            <div class="action-box lightpink" data-page="report">
                                <i class="fas fa-chart-line"></i>
                                <h3>Báo cáo chất lượng</h3>
                            </div>
                            <div class="action-box lightorange" data-page="approval">
                                <i class="fas fa-check-circle"></i>
                                <h3>Phê duyệt</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Các template -->
    <template id="recruitment-template">
        <form action="them_tintuyendung.php" method="POST" id="recruitment-form" class="form-area">
            <div class="form-group">
                <label for="job-title">Tiêu đề</label>
                <input type="text" id="job-title" name="TieuDe" required/>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="batch">Đợt tuyển dụng</label>
                    <input type="text" id="batch" name="DotTuyenDung" placeholder="dd/mm/yyyy" required />
                </div>
                <div class="form-group">
                    <label for="department">Phòng ban</label>
                    <input type="text" id="department" name="PhongBan" />
                </div>
                <div class="form-group">
                    <label for="position">Vị trí</label>
                    <input type="text" id="position" name="ViTri" />
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="quantity">Số lượng</label>
                    <input type="number" id="quantity" name="SoLuong" min="1" value="1" />
                </div>
                <div class="form-group">
                    <label for="type">Loại hình</label>
                    <select id="type" name="LoaiHinh">
                        <option value="Toàn thời gian">Toàn thời gian</option>
                        <option value="Bán thời gian">Bán thời gian</option>
                        <option value="Thực tập">Thực tập</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="salary">Mức lương</label>
                    <input type="text" id="salary" name="MucLuong" />
                </div>
            </div>
            <div class="form-group">
                <label for="description">Mô tả công việc</label>
                <textarea id="description" name="MoTa" rows="4"></textarea>
            </div>
            <div class="form-group">
                <label for="requirement">Yêu cầu ứng viên</label>
                <textarea id="requirement" name="YeuCau" rows="4"></textarea>
            </div>
            <div class="form-row">
                <button type="submit" class="submit-btn">Tạo tin</button>
                <button type="button" class="submit-btn" onclick="loadPage('danhsachtintuyendung')">Tra cứu</button>
            </div>
        </form>
    </template>

    <template id="danhsachpheduyet-template">
        <div class="header">
            <h1>Danh sách phê duyệt</h1>
            <p class="sub">Danh sách ứng viên đã được phê duyệt hoặc từ chối</p>
        </div>
        <div class="form-area">
            <div class="filter-area">
                <input type="text" id="searchApproval" placeholder="Tìm kiếm ứng viên...">
                <select id="filterStatus">
                    <option value="">Tất cả trạng thái</option>
                    <option value="Đã duyệt">Đã duyệt</option>
                    <option value="Từ chối">Từ chối</option>
                </select>
                <button onclick="renderApprovalList()">Tìm kiếm</button>
            </div>
            <table id="approvalTable" class="table">
                <thead>
                    <tr>
                        <th>Tên ứng viên</th>
                        <th>Vị trí ứng tuyển</th>
                        <th>Điểm</th>
                        <th>Nhận xét</th>
                        <th>Trạng thái</th>
                        <th>Lý do</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </template>

    <template id="interview-template">
        <form action="them_lichphongvan.php" method="POST" class="form-area" id="interview-form">
            <div class="form-group">
                <label for="MaUV">Mã ứng viên</label>
                <input type="text" id="MaUV" name="MaUV" required>
            </div>
            <div class="form-group">
                <label for="MaTin">Mã tin tuyển dụng</label>
                <input type="text" id="MaTin" name="MaTin" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="ViTri">Vị trí</label>
                    <input type="text" id="ViTri" name="ViTri" required>
                </div>
                <div class="form-group">
                    <label for="NgayPV">Ngày phỏng vấn</label>
                    <input type="date" id="NgayPV" name="NgayPV" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="GioPV">Giờ phỏng vấn</label>
                    <input type="time" id="GioPV" name="GioPV" required>
                </div>
                <div class="form-group">
                    <label for="HinhThuc">Hình thức phỏng vấn</label>
                    <select id="HinhThuc" name="HinhThuc" required>
                        <option value="Trực tiếp">Trực tiếp</option>
                        <option value="Online">Online</option>
                        <option value="Điện thoại">Điện thoại</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="GhiChu">Ghi chú</label>
                <textarea id="GhiChu" name="GhiChu" rows="3"></textarea>
            </div>
            <div class="form-row">
                <button type="submit" class="submit-btn">Tạo lịch</button>
                <button type="button" class="submit-btn" onclick="loadPage('danhsachlichphongvan')">Tra cứu</button>
            </div>
        </form>
    </template>

    <template id="evaluation-template">
        <form action="them_danhgia.php" method="POST" class="form-area" id="evaluation-form">
            <div class="form-group">
                <label for="name">Tên ứng viên:</label>
                <input type="text" id="name" name="TenUV" placeholder="VD: Trần Thị B" required />
            </div>
            <div class="form-group">
                <label for="position">Vị trí ứng tuyển:</label>
                <input type="text" id="position" name="ViTriUV" placeholder="VD: Nhân viên kinh doanh" required />
            </div>
            <div class="form-group">
                <label for="score">Điểm đánh giá (1-10):</label>
                <input type="number" id="score" name="Diem" min="1" max="10" required />
            </div>
            <div class="form-group">
                <label for="comment">Nhận xét:</label>
                <textarea id="comment" name="NhanXet" rows="4" placeholder="Ghi nhận xét chi tiết..." required></textarea>
            </div>
            <div class="form-row">
                <button type="submit" class="submit-btn">Gửi đánh giá</button>
                <button type="button" class="submit-btn" onclick="loadPage('danhsachdanhgia')">Tra cứu</button>
            </div>
        </form>
    </template>

    <template id="report-template">
        <form action="them_baocao.php" method="POST" class="report-form" id="report-form">
            <div class="form-group">
                <label for="department">Phòng ban</label>
                <input type="text" id="department" name="PhongBan" required />
            </div>
            <div class="form-group">
                <label for="month">Tháng</label>
                <input type="month" id="month" name="Thang" required />
            </div>
            <div class="form-group">
                <label for="planned">Số lượng theo kế hoạch</label>
                <input type="number" id="planned" name="SoLuongKeHoach" required />
            </div>
            <div class="form-group">
                <label for="actual">Số lượng thực tế</label>
                <input type="number" id="actual" name="SoLuongThucTe" required />
            </div>
            <div class="form-group full-width">
                <label for="note">Ghi chú</label>
                <textarea id="note" name="GhiChu" placeholder="Ghi chú thêm nếu có"></textarea>
            </div>
            <div class="form-row">
                <button type="submit" class="submit-btn">Tạo báo cáo</button>
                <button type="button" class="submit-btn" onclick="loadPage('danhsachbaocao')">Tra cứu</button>
            </div>
        </form>
    </template>

    <template id="evaluation-list-template">
        <div class="header">
            <h1>Danh sách đánh giá ứng viên</h1>
            <p class="sub">Tra cứu các đánh giá đã thực hiện</p>
        </div>
        <div class="form-area">
            <input type="text" id="searchInput" placeholder="Tìm kiếm theo tên, vị trí..." />
            <div id="evaluationList" class="evaluation-list"></div>
        </div>
    </template>

    <template id="approval-template">
        <div class="approval-area">
            <h3>Danh sách phê duyệt</h3>
            <div class="filter-area">
                <input type="text" id="searchApproval" placeholder="Tìm kiếm ứng viên...">
                <select id="filterStatus">
                    <option value="">Tất cả trạng thái</option>
                    <option value="Chờ duyệt">Chờ duyệt</option>
                    <option value="Đã duyệt">Đã duyệt</option>
                    <option value="Từ chối">Từ chối</option>
                </select>
                <button onclick="searchApproval()">Tìm kiếm</button>
                <button type="button" class="submit-btn" onclick="loadPage('danhsachpheduyet')">Xem danh sách đã phê duyệt</button>
            </div>
            <table id="approvalTable" class="table">
                <thead>
                    <tr>
                        <th>Tên ứng viên</th>
                        <th>Vị trí ứng tuyển</th>
                        <th>Điểm</th>
                        <th>Nhận xét</th>
                        <th>Trạng thái</th>
                        <th>Lý do</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </template>

    <script src="tuyendung.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.main-nav a, .action-box').forEach(element => {
                element.addEventListener('click', function(e) {
                    e.preventDefault();
                    const page = this.getAttribute('data-page');
                    loadPage(page);
                });
            });

            function loadPage(page) {
                const mainContent = document.getElementById('main-content');
                const template = document.getElementById(`${page}-template`);
                
                if (template) {
                    mainContent.innerHTML = '';
                    mainContent.appendChild(template.content.cloneNode(true));
                    if (page === "interview") bindInterviewForm();
                    if (page === "danhsachlichphongvan") loadInterviewList();
                    if (page === "recruitment") bindRecruitmentForm();
                    if (page === "danhsachtintuyendung") loadRecruitmentList();
                    if (page === "evaluation") bindEvaluationForm();
                    if (page === "danhsachdanhgia") loadEvaluationList();
                    if (page === "report") bindReportForm();
                    if (page === "danhsachbaocao") loadReportList();
                    if (page === "approval") {
                        bindApprovalForm();
                    }
                    if (page === "danhsachpheduyet") loadApprovalList();
                } else {
                    mainContent.innerHTML = `
                        <div class="header">
                            <h1>Chào mừng trở lại, <span>HR Manager!</span></h1>
                            <p class="sub">Hệ thống quản lý tuyển dụng</p>
                        </div>
                        <div class="actions">
                            <div class="action-box lightblue" data-page="recruitment">
                                <i class="fas fa-plus"></i>
                                <h3>Tạo tin tuyển dụng</h3>
                            </div>
                            <div class="action-box lightgreen" data-page="interview">
                                <i class="fas fa-calendar-alt"></i>
                                <h3>Tạo lịch phỏng vấn</h3>
                            </div>
                            <div class="action-box lightpurple" data-page="evaluation">
                                <i class="fas fa-star"></i>
                                <h3>Đánh giá ứng viên</h3>
                            </div>
                            <div class="action-box lightpink" data-page="report">
                                <i class="fas fa-chart-line"></i>
                                <h3>Báo cáo chất lượng</h3>
                            </div>
                            <div class="action-box lightorange" data-page="approval">
                                <i class="fas fa-check-circle"></i>
                                <h3>Phê duyệt</h3>
                            </div>
                        </div>
                    `;
                    document.querySelectorAll('.action-box').forEach(box => {
                        box.addEventListener('click', function(e) {
                            e.preventDefault();
                            const page = this.getAttribute('data-page');
                            loadPage(page);
                        });
                    });
                }
            }

            window.searchApproval = function() {
                const keyword = document.getElementById('searchApproval')?.value || '';
                const status = document.getElementById('filterStatus')?.value || '';
                loadApprovalList(keyword, status);
            };
        });
    </script>
</body>
</html>