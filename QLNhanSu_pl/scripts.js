/**
 * scripts.js - Quản lý giao diện SPA cho Hệ thống Quản lý Nhân sự
 */
console.log("SCRIPT START: scripts.js running...");

// Biến toàn cục để lưu trữ danh sách phòng ban và vị trí
let departments = [];
let positions = [];

// Hàm lấy danh sách phòng ban từ API
async function fetchDepartments() {
    try {
        const response = await fetch('get_departments.php');
        if (!response.ok) throw new Error('Không thể kết nối đến API: ' + response.statusText);
        const data = await response.json();
        if (data.status === 'success') {
            departments = data.data;
            console.log("Departments fetched successfully:", departments);
        } else {
            console.error("API error:", data.message);
            departments = [];
        }
    } catch (error) {
        console.error("Fetch departments error:", error);
        departments = [];
    }
}

// Hàm lấy danh sách vị trí từ API
async function fetchPositions() {
    try {
        const response = await fetch('get_positions.php');
        if (!response.ok) throw new Error('Không thể kết nối đến API: ' + response.statusText);
        const data = await response.json();
        if (data.status === 'success') {
            positions = data.data;
            console.log("Positions fetched successfully:", positions);
        } else {
            console.error("API error:", data.message);
            positions = [];
        }
    } catch (error) {
        console.error("Fetch positions error:", error);
        positions = [];
    }
}

// --- Nội dung HTML cho các trang ---
const pages = {
    'ho-so': `
        <div class="header"> <h1>Quản lý hồ sơ nhân viên</h1></div>
        <button class="main-action-btn" id="btn-show-add-employee-form"><i class="fas fa-plus"></i> Thêm nhân viên mới</button>
        <div id="employee-form-container" class="hidden-form"> 
            <h3 id="employee-form-title">Thêm nhân viên mới</h3> 
            <form id="employee-form" class="form-area"> 
                <input type="hidden" id="employee-id" name="employee-id">
                
                    <legend><h4>1.1 Thông tin cá nhân</h4></legend> 
                    <div class="form-row"> 
                        <div class="form-group"> <label for="ho-ten">Họ tên:</label> <input type="text" id="ho-ten" name="ho-ten" required> </div>
                        <div class="form-group"> <label for="ngay-sinh">Ngày sinh:</label> <input type="date" id="ngay-sinh" name="ngay-sinh"> </div>
                        <div class="form-group"> <label for="gioi-tinh">Giới tính:</label> 
                            <select id="gioi-tinh" name="gioi-tinh"> 
                                <option value="Nam">Nam</option> 
                                <option value="Nữ">Nữ</option> 
                                <option value="Khác">Khác</option> 
                            </select> 
                        </div> 
                    </div>
                    <div class="form-row"> 
                        <div class="form-group"> <label for="cmnd-cccd">Số CMND/CCCD:</label> <input type="text" id="cmnd-cccd" name="cmnd-cccd"> </div>
                        <div class="form-group"> <label for="lien-he">Liên hệ (SĐT):</label> <input type="text" id="lien-he" name="lien-he"> </div>
                    </div>
                    <div class="form-group"> <label for="dia-chi">Địa chỉ:</label> <textarea id="dia-chi" name="dia-chi" rows="2"></textarea> </div>
                
                    <legend><h4>1.2 Quá trình công tác</h4></legend> 
                    <div id="work-history-section"> 
                        <div class="form-row"> 
                            <div class="form-group"> <label for="vi-tri">Vị trí hiện tại:</label> <select id="vi-tri" name="vi-tri"></select> </div>
                            <div class="form-group"> <label for="phong-ban">Phòng ban:</label> <select id="phong-ban" name="phong-ban"></select> </div>
                            <div class="form-group"> <label for="ngay-vao-lam">Ngày vào làm:</label> <input type="date" id="ngay-vao-lam" name="ngay-vao-lam"> </div>
                        </div>
                    </div>
                
                    <legend><h4>1.3 Bằng cấp, chứng chỉ</h4></legend> 
                    <div class="form-group"> 
                        <label for="chung-chi">Các chứng chỉ/kỹ năng:</label> 
                        <textarea id="chung-chi" name="chung-chi" rows="3" placeholder="Liệt kê các chứng chỉ, kỹ năng..."></textarea> 
                    </div>
               
                <div style="margin-top: 20px;"> 
                    <button type="submit" class="submit-btn"><i class="fas fa-save"></i> Lưu thông tin</button>
                    <button type="button" class="submit-btn cancel-btn" id="btn-cancel-employee-form">Hủy bỏ</button>
                </div>
            </form>
        </div>
        <h3>Danh sách nhân viên</h3>
        <div class="table-responsive-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Mã NV</th>
                        <th>Họ tên</th>
                        <th>Ngày sinh</th>
                        <th>Giới tính</th>
                        <th>Phòng ban</th>
                        <th>Vị trí</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody id="employee-list-body"></tbody>
            </table>
        </div>
    `,
    'hop-dong': `
        <div class="header"> <h1>Quản lý hợp đồng lao động</h1> </div>
        <button class="main-action-btn" id="btn-show-add-contract-form"><i class="fas fa-plus"></i> Tạo hợp đồng mới</button>
        <div id="contract-form-container" class="hidden-form">
            <h3 id="contract-form-title">Tạo hợp đồng mới</h3>
            <form id="contract-form" class="form-area">
                <input type="hidden" id="contract-id" name="contract-id">
                <div class="form-row">
                    <div class="form-group">
                        <label for="contract-employee">Nhân viên:</label>
                        <select id="contract-employee" name="contract-employee" required></select>
                    </div>
                    <div class="form-group">
                        <label for="contract-code">Số hợp đồng:</label>
                        <input type="text" id="contract-code" name="contract-code" placeholder="VD: HDLD/2025/001">
                    </div>
                    <div class="form-group">
                        <label for="contract-type">Loại hợp đồng:</label>
                        <select id="contract-type" name="contract-type" required>
                            <option value="Thử việc">Thử việc (2 tháng)</option>
                            <option value="XĐTH 1 năm">XĐTH 1 năm</option>
                            <option value="XĐTH 3 năm">XĐTH 3 năm</option>
                            <option value="KXĐTH">KXĐTH</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="contract-sign-date">Ngày ký:</label>
                        <input type="date" id="contract-sign-date" name="contract-sign-date" required>
                    </div>
                    <div class="form-group">
                        <label for="contract-start-date">Ngày hiệu lực:</label>
                        <input type="date" id="contract-start-date" name="contract-start-date" required>
                    </div>
                    <div class="form-group">
                        <label for="contract-end-date">Ngày hết hạn:</label>
                        <input type="date" id="contract-end-date" name="contract-end-date">
                        <small>(Để trống nếu là KXĐTH)</small>
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <button type="submit" class="submit-btn"><i class="fas fa-save"></i> Lưu hợp đồng</button>
                    <button type="button" class="submit-btn cancel-btn" id="btn-cancel-contract-form">Hủy bỏ</button>
                </div>
            </form>
        </div>
        <h3>Danh sách hợp đồng</h3>
        <div class="table-responsive-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Số HĐ</th>
                        <th>Nhân viên</th>
                        <th>Loại hợp đồng</th>
                        <th>Ngày ký</th>
                        <th>Ngày hiệu lực</th>
                        <th>Ngày hết hạn</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody id="contract-list-body"></tbody>
            </table>
        </div>
    `,
    'thu-tuc': `
        <div class="header"> <h1>Quản lý các thủ tục nhân sự</h1></div>
        <button class="main-action-btn" data-action="show-procedure-form" data-type="decision"><i class="fas fa-plus"></i> Tạo quyết định</button>
        <button class="main-action-btn delete" data-action="show-procedure-form" data-type="termination"><i class="fas fa-user-minus"></i> Ghi nhận nghỉ việc</button>
        <div id="decision-form-container" class="hidden-form procedure-form">
            <h3 id="decision-form-title">Tạo quyết định nhân sự</h3>
            <form id="decision-form" class="form-area">
                <input type="hidden" id="decision-id" name="decision-id">
                <div class="form-row">
                    <div class="form-group">
                        <label>Loại Quyết định:</label>
                        <select id="decision-type" required>
                            <option value="Bổ nhiệm">Bổ nhiệm</option>
                            <option value="Miễn nhiệm">Miễn nhiệm</option>
                            <option value="Thuyên chuyển">Thuyên chuyển</option>
                            <option value="Tăng lương">Tăng lương</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nhân viên:</label>
                        <select id="decision-employee" required>
                            <option value="">-- Chọn NV --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Ngày hiệu lực:</label>
                        <input type="date" id="decision-date" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Nội dung/ Lý do:</label>
                    <textarea id="decision-reason" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label>Số quyết định:</label>
                    <input type="text" id="decision-code" placeholder="VD: QĐ-BN/2025/01" required>
                </div>
                <button type="submit" class="submit-btn"><i class="fas fa-save"></i> Lưu quyết định</button>
                <button type="button" class="submit-btn cancel-btn" data-action="hide-procedure-forms">Hủy</button>
            </form>
        </div>
        <div id="termination-form-container" class="hidden-form procedure-form">
            <h3 id="termination-form-title">Ghi nhận thông tin nghỉ việc</h3>
            <form id="termination-form" class="form-area">
                <input type="hidden" id="termination-id" name="termination-id">
                <div class="form-row">
                    <div class="form-group">
                        <label>Nhân viên:</label>
                        <select id="termination-employee" required>
                            <option value="">-- Chọn NV --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Ngày nộp đơn:</label>
                        <input type="date" id="termination-apply-date">
                    </div>
                    <div class="form-group">
                        <label>Ngày nghỉ chính thức:</label>
                        <input type="date" id="termination-date" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Lý do nghỉ việc:</label>
                    <textarea id="termination-reason" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label>Trạng thái bàn giao:</label>
                    <select id="termination-status">
                        <option value="Chưa bắt đầu">Chưa bắt đầu</option>
                        <option value="Đang bàn giao">Đang bàn giao</option>
                        <option value="Đã hoàn tất">Đã hoàn tất</option>
                    </select>
                </div>
                <button type="submit" class="submit-btn"><i class="fas fa-save"></i> Lưu thông tin nghỉ việc</button>
                <button type="button" class="submit-btn cancel-btn" data-action="hide-procedure-forms">Hủy</button>
            </form>
        </div>
       
        <h3>Danh sách quyết định</h3>
        <div class="table-responsive-wrapper">
            <table id="decision-list-table">
                <thead>
                     <tr>
                        <th>Số QĐ</th>
                        <th>Loại QĐ</th>
                        <th>Nhân viên</th>
                        <th>Ngày hiệu lực</th>
                        <th>Nội dung</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody id="decision-list-body"></tbody>
            </table>
        </div>
        
        <div style="margin-top: 30px;">
            <h3 id="termination-list-header">Danh sách nghỉ việc</h3>
            <div class="table-responsive-wrapper">
                <table id="termination-list-table">
                    <thead>
                        <tr>
                            <th>Nhân viên</th>
                            <th>Ngày nộp đơn</th>
                            <th>Ngày nghỉ</th>
                            <th>Lý do</th>
                            <th>Trạng thái bàn giao</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody id="termination-list-body"></tbody>
                </table>
            </div>
        </div>
    `,
    'khen-thuong-ky-luat': `
        <div class="header"> <h1>Quản lý khen thưởng & kỷ luật</h1> <p class="sub"></div>
        <button class="main-action-btn btn-add" data-action="show-ktkl-form" data-type="reward"><i class="fas fa-plus-circle"></i> Thêm khen thưởng</button>
        <button class="main-action-btn delete" data-action="show-ktkl-form" data-type="discipline"><i class="fas fa-exclamation-triangle"></i> Thêm kỷ luật</button>
        <div id="reward-form-container" class="hidden-form reward-discipline-form">
            <h3 id="reward-form-title">Thêm quyết định khen thưởng</h3>
            <form id="reward-form" class="form-area">
                <input type="hidden" id="reward-id" name="reward-id">
                <div class="form-row">
                    <div class="form-group">
                        <label>Nhân viên:</label>
                        <select id="reward-employee" required>
                            <option value="">-- Chọn NV --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Ngày quyết định:</label>
                        <input type="date" id="reward-date" required>
                    </div>
                    <div class="form-group">
                        <label>Hình thức:</label>
                        <input type="text" id="reward-type" placeholder="VD: Thưởng nóng...">
                    </div>
                </div>
                <div class="form-group">
                    <label>Lý do/ Thành tích:</label>
                    <textarea id="reward-reason" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label>Số QĐ:</label>
                    <input type="text" id="reward-code" placeholder="VD: QĐKT/2025/01" required>
                </div>
                <div class="form-group">
                    <label>Mức thưởng (VNĐ):</label>
                    <input type="number" id="reward-amount" placeholder="VD: 1000000">
                </div>
                <button type="submit" class="submit-btn"><i class="fas fa-save"></i> Lưu khen thưởng</button>
                <button type="button" class="submit-btn cancel-btn" data-action="hide-ktkl-forms">Hủy</button>
            </form>
        </div>
        <div id="discipline-form-container" class="hidden-form reward-discipline-form">
            <h3 id="discipline-form-title">Thêm quyết định/biên bản kỷ luật</h3>
            <form id="discipline-form" class="form-area">
                <input type="hidden" id="discipline-id" name="discipline-id">
                <div class="form-row">
                    <div class="form-group">
                        <label>Nhân viên:</label>
                        <select id="discipline-employee" required>
                            <option value="">-- Chọn NV --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Ngày quyết định:</label>
                        <input type="date" id="discipline-date" required>
                    </div>
                    <div class="form-group">
                        <label>Hình thức kỷ luật:</label>
                        <select id="discipline-type" required>
                            <option value="">-- Chọn hình thức --</option>
                            <option value="Nhắc nhở">Nhắc nhở</option>
                            <option value="Khiển trách">Khiển trách</option>
                            <option value="Sa thải">Sa thải</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Lý do/ Vi phạm:</label>
                    <textarea id="discipline-reason" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label>Số QĐ/BB:</label>
                    <input type="text" id="discipline-code" placeholder="VD: BBKL/2025/01" required>
                </div>
                <button type="submit" class="submit-btn delete"><i class="fas fa-save"></i> Lưu kỷ luật</button>
                <button type="button" class="submit-btn cancel-btn" data-action="hide-ktkl-forms">Hủy</button>
            </form>
        </div>
        <h3>Danh sách khen thưởng</h3>
        <div class="table-responsive-wrapper">
            <table id="reward-list-table">
                <thead>
                    <tr>
                        <th>Số QĐ</th>
                        <th>Nhân viên</th>
                        <th>Ngày QĐ</th>
                        <th>Hình thức</th>
                        <th>Lý do/ Thành tích</th>
                        <th>Mức thưởng</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody id="reward-list-body"></tbody>
            </table>
        </div>
        <h3 style="margin-top: 30px;">Danh sách kỷ luật</h3>
        <div class="table-responsive-wrapper">
            <table id="discipline-list-table">
                <thead>
                    <tr>
                        <th>Số QĐ/BB</th>
                        <th>Nhân viên</th>
                        <th>Ngày</th>
                        <th>Hình thức</th>
                        <th>Lý do/ Vi phạm</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody id="discipline-list-body"></tbody>
            </table>
        </div>
    `,
    'bao-cao': `
        <div class="header"> <h1>Báo cáo thống kê nhân sự</h1>  </div>
        <p>Chọn loại báo cáo bạn muốn xem:</p>
        <div class="report-buttons">
            <button class="main-action-btn" data-report-type="tong-hop"><i class="fas fa-users"></i> Tổng hợp cơ cấu</button>
            <button class="main-action-btn" data-report-type="bien-dong"><i class="fas fa-exchange-alt"></i> Biến động NS</button>
        </div>
        <div id="report-filters" class="form-area">
            <div class="form-row">
                <div class="form-group">
                    <label>Từ ngày:</label>
                    <input type="date" id="report-start-date">
                </div>
                <div class="form-group">
                    <label>Đến ngày:</label>
                    <input type="date" id="report-end-date">
                </div>
                <div class="form-group">
                    <label>Phòng ban:</label>
                    <select id="report-department">
                        <option value="">Tất cả</option>
                    </select>
                </div>
            </div>
            <button class="submit-btn" id="btn-generate-report"><i class="fas fa-eye"></i> Xem báo cáo</button>
        </div>
        <div id="report-area">
            <h3>Kết quả báo cáo</h3>
            <div id="report-results-container">
                <p><i>Chọn loại báo cáo, đặt bộ lọc và nhấn "Xem báo cáo"...</i></p>
            </div>
            <canvas id="reportChart" width="400" height="200" style="display: none; margin-top: 20px;"></canvas>
        </div>
    `
}

// --- Mảng lưu trữ các hàm hủy listener của trang hiện tại ---
let currentPageCleanupFunctions = [];

// --- Hàm dọn dẹp listener cũ ---
function cleanupPageEventListeners() {
    currentPageCleanupFunctions.forEach(cleanup => { try { cleanup(); } catch(e){} });
    currentPageCleanupFunctions = [];
}

// --- Hàm tiện ích để thêm listener và đăng ký hàm hủy ---
function addManagedEventListener(element, type, listener) {
    if (!element) return;
    element.addEventListener(type, listener);
    currentPageCleanupFunctions.push(() => { try { element.removeEventListener(type, listener); } catch(e){} });
}

// --- Hàm load nội dung trang ---
function loadPage(page) {
    console.log(`LOAD PAGE START: Loading page "${page}"`);
    const mainContent = document.getElementById("main-content");
    if (!mainContent) { 
        console.error("FATAL ERROR: #main-content not found!");
        return; 
    }

    mainContent.innerHTML = '';
    cleanupPageEventListeners();

    if (pages[page]) {
        mainContent.innerHTML = pages[page];
        console.log(`LOAD PAGE: Rendered HTML for page "${page}".`);
        try {
            if (page === 'ho-so') bindHoSoPageEvents();
            else if (page === 'hop-dong') bindHopDongPageEvents();
            else if (page === 'thu-tuc') bindThuTucPageEvents();
            else if (page === 'khen-thuong-ky-luat') bindKTKLPageEvents();
            else if (page === 'bao-cao') bindBaoCaoPageEvents();
            else console.warn(`No specific binding function defined for page: ${page}`);

            console.log(`LOAD PAGE SUCCESS: Events bound for page "${page}".`);
            window.scrollTo(0, 0);
        } catch (error) {
            console.error(`LOAD PAGE ERROR: Error binding events for page ${page}:`, error);
            mainContent.innerHTML += `<p style="color:red; margin-top: 20px;">Lỗi khi tải tương tác cho trang '${page}'.</p>`;
        }
    } else {
        console.error(`LOAD PAGE ERROR: Page content for "${page}" not found.`);
        mainContent.innerHTML = `<div class="header"><h1>Lỗi: Trang "${page}" không tìm thấy</h1></div>`;
    }
    console.log(`LOAD PAGE END: Finished loading page "${page}".`);
}

// --- Các hàm bind sự kiện cho từng trang ---

function bindHoSoPageEvents() {
    console.log("Binding HoSo events...");
    const mainContent = document.getElementById('main-content');
    const btnShowAddForm = mainContent?.querySelector('#btn-show-add-employee-form');
    const employeeFormContainer = mainContent?.querySelector('#employee-form-container');
    const btnCancel = mainContent?.querySelector('#btn-cancel-employee-form');
    const employeeForm = mainContent?.querySelector('#employee-form');
    const employeeTableBody = mainContent?.querySelector('#employee-list-body');
    const phongBanSelect = mainContent?.querySelector('#phong-ban');
    const viTriSelect = mainContent?.querySelector('#vi-tri');

    if (!employeeFormContainer || !employeeTableBody || !employeeForm || !btnShowAddForm || !btnCancel || !phongBanSelect || !viTriSelect) {
        console.error("HoSo page elements missing! Cannot bind events.");
        return;
    }

    // Populate department dropdown
    phongBanSelect.innerHTML = '<option value="">-- Chọn phòng ban --</option>';
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.MaPB;
        option.textContent = dept.TenPB;
        phongBanSelect.appendChild(option);
    });

    // Populate position dropdown
    viTriSelect.innerHTML = '<option value="">-- Chọn vị trí --</option>';
    positions.forEach(pos => {
        const option = document.createElement('option');
        option.value = pos.MaVT;
        option.textContent = pos.TenVT;
        viTriSelect.appendChild(option);
    });

    employeeFormContainer.style.display = 'none';

    // Load initial employee data
    fetch('get_employees.php')
        .then(response => {
            if (!response.ok) throw new Error('Không thể kết nối đến API: ' + response.statusText);
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                data.data.forEach(emp => {
                    const dataAttrs = `data-id="${emp.MaNV}" data-cmnd="${emp.CCCD || ''}" data-lienhe="${emp.SDT || ''}" data-diachi="${emp.DiaChi || ''}" data-chungchi="${emp.ChungChi || ''}" data-ngayvaolam="${emp.NgayVaoLam || ''}"`;
                    const newRowHTML = `
                        <tr ${dataAttrs}>
                            <td>${emp.MaNV}</td>
                            <td>${emp.TenNV}</td>
                            <td>${emp.NgaySinh || 'N/A'}</td>
                            <td>${emp.GioiTinh || 'N/A'}</td>
                            <td>${emp.TenPB || 'N/A'}</td>
                            <td>${emp.TenVT || 'N/A'}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="table-action-btn btn-view-edit" data-id="${emp.MaNV}" data-name="${emp.TenNV}"><i class="fas fa-edit"></i> Xem/ Sửa</button>
                                    <button class="table-action-btn btn-delete" data-id="${emp.MaNV}"><i class="fas fa-trash-alt"></i> Xóa</button>
                                </div>
                            </td>
                        </tr>`;
                    employeeTableBody.insertAdjacentHTML('beforeend', newRowHTML);
                });
            } else {
                console.error("API error:", data.message);
                employeeTableBody.innerHTML = `<tr><td colspan="7">Lỗi: ${data.message}</td></tr>`;
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            employeeTableBody.innerHTML = `<tr><td colspan="7">Lỗi: Không thể tải dữ liệu nhân viên - ${error.message}</td></tr>`;
        });

    addManagedEventListener(btnShowAddForm, 'click', () => {
        const formTitle = document.getElementById('employee-form-title');
        const employeeIdInput = document.getElementById('employee-id');
        employeeForm.reset();
        if (formTitle) formTitle.textContent = 'Thêm nhân viên mới';
        if (employeeIdInput) employeeIdInput.value = '';
        employeeFormContainer.style.display = 'block';
        btnShowAddForm.style.display = 'none';
        window.scrollTo(0, 0);
        employeeFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    addManagedEventListener(btnCancel, 'click', () => {
        employeeFormContainer.style.display = 'none';
        if (btnShowAddForm) btnShowAddForm.style.display = 'inline-block';
        employeeForm.reset();
    });

    addManagedEventListener(employeeForm, 'submit', (e) => {
        e.preventDefault();
        const employeeIdInput = document.getElementById('employee-id');
        const employeeId = employeeIdInput?.value;
        const hoTen = document.getElementById('ho-ten')?.value || 'N/A';
        const ngaySinh = document.getElementById('ngay-sinh')?.value || null;
        const gioiTinh = document.getElementById('gioi-tinh')?.value || '';
        const phongBan = document.getElementById('phong-ban')?.value || '';
        const viTri = document.getElementById('vi-tri')?.value || '';
        const cmnd = document.getElementById('cmnd-cccd')?.value || '';
        const lienhe = document.getElementById('lien-he')?.value || '';
        const diachi = document.getElementById('dia-chi')?.value || '';
        const chungchi = document.getElementById('chung-chi')?.value || '';
        const ngayvaolam = document.getElementById('ngay-vao-lam')?.value || null;

        const employeeData = {
            MaNV: employeeId || `NV${Date.now().toString().slice(-4)}`,
            TenNV: hoTen,
            NgaySinh: ngaySinh,
            GioiTinh: gioiTinh,
            CCCD: cmnd,
            SDT: lienhe,
            NgayVaoLam: ngayvaolam,
            DiaChi: diachi,
            MaPB: phongBan,
            MaVT: viTri,
            ChungChi: chungchi
        };

        const url = employeeId ? 'update_employee.php' : 'add_employee.php';
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(employeeId ? `Đã CẬP NHẬT thông tin cho nhân viên: ${hoTen}!` : `Đã THÊM MỚI nhân viên: ${hoTen}!`);
                loadPage('ho-so');
            } else {
                alert('Lỗi: ' + data.message);
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            alert('Lỗi khi lưu thông tin nhân viên: ' + error.message);
        });

        employeeFormContainer.style.display = 'none';
        if (btnShowAddForm) btnShowAddForm.style.display = 'inline-block';
        employeeForm.reset();
    });

    addManagedEventListener(employeeTableBody, 'click', handleEmployeeTableActions);
}

function handleEmployeeTableActions(event) {
    const targetButton = event.target.closest('.table-action-btn');
    if (!targetButton) return;

    const row = targetButton.closest('tr');
    if (!row) return;
    const employeeId = row.dataset.id;
    const employeeName = targetButton.dataset.name || row.cells[1]?.textContent || `NV ${employeeId}`;

    if (targetButton.classList.contains('btn-view-edit')) {
        console.log("Edit button clicked for Employee:", employeeId);
        const employeeFormContainer = document.getElementById('employee-form-container');
        const employeeForm = document.getElementById('employee-form');
        const formTitle = document.getElementById('employee-form-title');
        const employeeIdInput = document.getElementById('employee-id');
        const btnShowAddForm = document.getElementById('btn-show-add-employee-form');

        if (!employeeForm || !formTitle || !employeeIdInput || !employeeFormContainer || !btnShowAddForm) {
            console.error("Cannot find employee form elements for editing."); 
            return;
        }
        employeeForm.reset();
        formTitle.textContent = `Sửa thông tin: ${employeeName}`;
        employeeIdInput.value = employeeId;

        document.getElementById('ho-ten').value = row.cells[1]?.textContent || '';
        document.getElementById('ngay-sinh').value = row.cells[2]?.textContent === 'N/A' ? '' : row.cells[2]?.textContent || '';
        document.getElementById('gioi-tinh').value = row.cells[3]?.textContent === 'N/A' ? 'Nam' : row.cells[3]?.textContent || 'Nam';
        document.getElementById('phong-ban').value = departments.find(dept => dept.TenPB === row.cells[4]?.textContent)?.MaPB || '';
        document.getElementById('vi-tri').value = positions.find(pos => pos.TenVT === row.cells[5]?.textContent)?.MaVT || '';
        document.getElementById('cmnd-cccd').value = row.dataset.cmnd || '';
        document.getElementById('lien-he').value = row.dataset.lienhe || '';
        document.getElementById('dia-chi').value = row.dataset.diachi || '';
        document.getElementById('chung-chi').value = row.dataset.chungchi || '';
        document.getElementById('ngay-vao-lam').value = row.dataset.ngayvaolam || '';

        employeeFormContainer.style.display = 'block';
        btnShowAddForm.style.display = 'none';
        window.scrollTo(0, 0);
        employeeFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } else if (targetButton.classList.contains('btn-delete')) {
        console.log("Delete button clicked for Employee:", employeeId);
        if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ nhân viên ${employeeName} (ID: ${employeeId})?`)) {
            fetch(`delete_employee.php?maNV=${employeeId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert(`Đã XÓA nhân viên ${employeeId}.`);
                        loadPage('ho-so');
                    } else {
                        alert('Lỗi: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error("Fetch error:", error);
                    alert('Lỗi khi xóa nhân viên: ' + error.message);
                });
        }
    }
}

function bindHopDongPageEvents() {
    console.log("Binding HopDong events...");
    const mainContent = document.getElementById('main-content');
    const btnShowAddForm = mainContent?.querySelector('#btn-show-add-contract-form');
    const contractFormContainer = mainContent?.querySelector('#contract-form-container');
    const btnCancel = mainContent?.querySelector('#btn-cancel-contract-form');
    const contractForm = mainContent?.querySelector('#contract-form');
    const contractTableBody = mainContent?.querySelector('#contract-list-body');
    const employeeSelect = mainContent?.querySelector('#contract-employee');

    if (!contractFormContainer || !contractTableBody || !contractForm || !btnShowAddForm || !btnCancel || !employeeSelect) {
        console.error("HopDong page elements missing! Cannot bind events."); 
        return;
    }

    // Populate employee dropdown
    fetch('get_employees.php')
        .then(response => {
            if (!response.ok) throw new Error('Không thể kết nối đến API: ' + response.statusText);
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                employeeSelect.innerHTML = '<option value="">-- Chọn NV --</option>';
                data.data.forEach(emp => {
                    const option = document.createElement('option');
                    option.value = emp.MaNV;
                    option.textContent = `${emp.TenNV} (${emp.MaNV})`;
                    employeeSelect.appendChild(option);
                });
            } else {
                console.error("API error:", data.message);
                employeeSelect.innerHTML = `<option value="">Lỗi: ${data.message}</option>`;
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            employeeSelect.innerHTML = `<option value="">Lỗi: Không thể tải danh sách nhân viên - ${error.message}</option>`;
        });

    contractFormContainer.style.display = 'none';

    // Load initial contract data
    fetch('get_contracts.php')
        .then(response => {
            if (!response.ok) throw new Error('Không thể kết nối đến API: ' + response.statusText);
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                data.data.forEach(contract => {
                    const today = new Date();
                    const endDate = contract.NgayHetHan ? new Date(contract.NgayHetHan) : null;
                    let status = '<span class="status-active">Còn hiệu lực</span>';
                    if (endDate) {
                        if (endDate < today) {
                            status = '<span class="status-expired">Đã hết hạn</span>';
                        } else if ((endDate - today) / (1000 * 60 * 60 * 24) <= 30) {
                            status = '<span class="status-warning">Sắp hết hạn</span>';
                        }
                    }
                    const dataAttrs = `data-id="${contract.MaHD}" data-employee-value="${contract.MaNV}" data-type="${contract.LoaiHD}" data-sign-date="${contract.NgayKy}" data-start-date="${contract.NgayHieuLuc}" data-end-date="${contract.NgayHetHan || 'N/A'}" data-code="${contract.SoHD}"`;
                    const newRowHTML = `
                        <tr ${dataAttrs}>
                            <td data-label="Số HĐ">${contract.SoHD}</td>
                            <td data-label="Nhân viên">${contract.TenNV}</td>
                            <td data-label="Loại HĐ">${contract.LoaiHD}</td>
                            <td data-label="Ngày ký">${contract.NgayKy || 'N/A'}</td>
                            <td data-label="Ngày hiệu lực">${contract.NgayHieuLuc || 'N/A'}</td>
                            <td data-label="Ngày hết hạn">${contract.NgayHetHan || 'N/A'}</td>
                            <td data-label="Trạng thái">${status}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="table-action-btn btn-view-edit" data-id="${contract.MaHD}"><i class="fas fa-edit"></i> Xem/ Sửa</button>
                                    <button class="table-action-btn btn-delete" data-id="${contract.MaHD}"><i class="fas fa-trash-alt"></i> Xóa</button>
                                </div>
                            </td>
                        </tr>`;
                    contractTableBody.insertAdjacentHTML('beforeend', newRowHTML);
                });
            } else {
                console.error("API error:", data.message);
                contractTableBody.innerHTML = `<tr><td colspan="8">Lỗi: ${data.message}</td></tr>`;
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            contractTableBody.innerHTML = `<tr><td colspan="8">Lỗi: Không thể tải dữ liệu hợp đồng - ${error.message}</td></tr>`;
        });

    addManagedEventListener(btnShowAddForm, 'click', () => {
        const formTitle = document.getElementById('contract-form-title');
        const contractIdInput = document.getElementById('contract-id');
        contractForm.reset();
        if (formTitle) formTitle.textContent = 'Tạo hợp đồng mới';
        if (contractIdInput) contractIdInput.value = '';
        contractFormContainer.style.display = 'block';
        btnShowAddForm.style.display = 'none';
        window.scrollTo(0, 0);
        contractFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    addManagedEventListener(btnCancel, 'click', () => {
        contractFormContainer.style.display = 'none';
        if (btnShowAddForm) btnShowAddForm.style.display = 'inline-block';
        contractForm.reset();
    });

    addManagedEventListener(contractForm, 'submit', (e) => {
        e.preventDefault();
        const contractIdInput = document.getElementById('contract-id');
        const contractId = contractIdInput?.value;
        const employeeSelect = document.getElementById('contract-employee');
        const employeeText = employeeSelect?.options[employeeSelect.selectedIndex]?.text || 'N/A';
        const employeeValue = employeeSelect?.value || 'N/A';
        const contractCode = document.getElementById('contract-code')?.value || '';
        const contractType = document.getElementById('contract-type')?.value || '';
        const signDate = document.getElementById('contract-sign-date')?.value || null;
        const startDate = document.getElementById('contract-start-date')?.value || null;
        const endDate = document.getElementById('contract-end-date')?.value || null;

        const contractData = {
            MaHD: contractId || `HD${Date.now().toString().slice(-4)}`,
            MaNV: employeeValue,
            SoHD: contractCode,
            LoaiHD: contractType,
            NgayKy: signDate,
            NgayHieuLuc: startDate,
            NgayHetHan: endDate
        };

        const url = contractId ? 'update_contract.php' : 'add_contract.php';
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contractData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(contractId ? `Đã CẬP NHẬT hợp đồng ${contractCode}!` : `Đã THÊM MỚI hợp đồng ${contractCode} cho ${employeeText}!`);
                loadPage('hop-dong');
            } else {
                alert('Lỗi: ' + data.message);
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            alert('Lỗi khi lưu hợp đồng: ' + error.message);
        });

        contractFormContainer.style.display = 'none';
        if (btnShowAddForm) btnShowAddForm.style.display = 'inline-block';
        contractForm.reset();
    });

    addManagedEventListener(contractTableBody, 'click', handleContractTableActions);
}

function handleContractTableActions(event) {
    const targetButton = event.target.closest('.table-action-btn');
    if (!targetButton) return;

    const row = targetButton.closest('tr');
    if (!row) return;
    const contractId = row.dataset.id;
    const contractCode = row.dataset.code || `HĐ ${contractId}`;

    if (targetButton.classList.contains('btn-view-edit')) {
        console.log("Edit button clicked for Contract:", contractId);
        const contractFormContainer = document.getElementById('contract-form-container');
        const contractForm = document.getElementById('contract-form');
        const formTitle = document.getElementById('contract-form-title');
        const contractIdInput = document.getElementById('contract-id');
        const btnShowAddForm = document.getElementById('btn-show-add-contract-form');

        if (!contractForm || !formTitle || !contractIdInput || !contractFormContainer || !btnShowAddForm) {
            console.error("Cannot find contract form elements for editing."); 
            return;
        }
        contractForm.reset();
        formTitle.textContent = `Sửa hợp đồng: ${contractCode}`;
        contractIdInput.value = contractId;

        document.getElementById('contract-employee').value = row.dataset.employeeValue || '';
        document.getElementById('contract-code').value = row.dataset.code || '';
        document.getElementById('contract-type').value = row.dataset.type || '';
        document.getElementById('contract-sign-date').value = row.dataset.signDate || '';
        document.getElementById('contract-start-date').value = row.dataset.startDate || '';
        document.getElementById('contract-end-date').value = row.dataset.endDate === 'N/A' ? '' : row.dataset.endDate || '';

        contractFormContainer.style.display = 'block';
        btnShowAddForm.style.display = 'none';
        window.scrollTo(0, 0);
        contractFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } else if (targetButton.classList.contains('btn-delete')) {
        console.log("Delete button clicked for Contract:", contractId);
        if (confirm(`Bạn có chắc chắn muốn xóa hợp đồng ${contractCode} (ID: ${contractId})?`)) {
            fetch(`delete_contract.php?maHD=${contractId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert(`Đã XÓA hợp đồng ${contractCode}.`);
                        loadPage('hop-dong');
                    } else {
                        alert('Lỗi: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error("Fetch error:", error);
                    alert('Lỗi khi xóa hợp đồng: ' + error.message);
                });
        }
    }
}
/*
function bindHopDongPageEvents() {
    console.log("Binding HopDong events...");
    const mainContent = document.getElementById('main-content');
    const btnShowAddForm = mainContent?.querySelector('#btn-show-add-contract-form');
    const contractFormContainer = mainContent?.querySelector('#contract-form-container');
    const btnCancel = mainContent?.querySelector('#btn-cancel-contract-form');
    const contractForm = mainContent?.querySelector('#contract-form');
    const contractTableBody = mainContent?.querySelector('#contract-list-body');
    const employeeSelect = mainContent?.querySelector('#contract-employee');

    if (!contractFormContainer || !contractTableBody || !contractForm || !btnShowAddForm || !btnCancel || !employeeSelect) {
        console.error("HopDong page elements missing! Cannot bind events."); 
        return;
    }

    // Populate employee dropdown
    fetch('get_employees.php')
        .then(response => {
            if (!response.ok) throw new Error('Không thể kết nối đến API: ' + response.statusText);
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                employeeSelect.innerHTML = '<option value="">-- Chọn NV --</option>';
                data.data.forEach(emp => {
                    const option = document.createElement('option');
                    option.value = emp.MaNV;
                    option.textContent = `${emp.TenNV} (${emp.MaNV})`;
                    employeeSelect.appendChild(option);
                });
            } else {
                console.error("API error:", data.message);
                employeeSelect.innerHTML = `<option value="">Lỗi: ${data.message}</option>`;
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            employeeSelect.innerHTML = `<option value="">Lỗi: Không thể tải danh sách nhân viên - ${error.message}</option>`;
        });

    contractFormContainer.style.display = 'none';

    // Load initial contract data
    fetch('get_contracts.php')
        .then(response => {
            if (!response.ok) throw new Error('Không thể kết nối đến API: ' + response.statusText);
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                data.data.forEach(contract => {
                    const today = new Date();
                    const endDate = contract.NgayHetHan ? new Date(contract.NgayHetHan) : null;
                    let status = '<span class="status-active">Còn hiệu lực</span>';
                    if (endDate) {
                        if (endDate < today) {
                            status = '<span class="status-expired">Đã hết hạn</span>';
                        } else if ((endDate - today) / (1000 * 60 * 60 * 24) <= 30) {
                            status = '<span class="status-warning">Sắp hết hạn</span>';
                        }
                    }
                    const dataAttrs = `data-id="${contract.MaHD}" data-employee-value="${contract.MaNV}" data-type="${contract.LoaiHD}" data-sign-date="${contract.NgayKy}" data-start-date="${contract.NgayHieuLuc}" data-end-date="${contract.NgayHetHan || 'N/A'}" data-code="${contract.SoHD}"`;
                    const newRowHTML = `
                        <tr ${dataAttrs}>
                            <td data-label="Số HĐ">${contract.SoHD}</td>
                            <td data-label="Nhân viên">${contract.TenNV}</td>
                            <td data-label="Loại HĐ">${contract.LoaiHD}</td>
                            <td data-label="Ngày ký">${contract.NgayKy || 'N/A'}</td>
                            <td data-label="Ngày hiệu lực">${contract.NgayHieuLuc || 'N/A'}</td>
                            <td data-label="Ngày hết hạn">${contract.NgayHetHan || 'N/A'}</td>
                            <td data-label="Trạng thái">${status}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="table-action-btn btn-view-edit" data-id="${contract.MaHD}"><i class="fas fa-edit"></i> Xem/Sửa</button>
                                    <button class="table-action-btn btn-delete" data-id="${contract.MaHD}"><i class="fas fa-trash-alt"></i> Xóa</button>
                                </div>
                            </td>
                        </tr>`;
                    contractTableBody.insertAdjacentHTML('beforeend', newRowHTML);
                });
            } else {
                console.error("API error:", data.message);
                contractTableBody.innerHTML = `<tr><td colspan="8">Lỗi: ${data.message}</td></tr>`;
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            contractTableBody.innerHTML = `<tr><td colspan="8">Lỗi: Không thể tải dữ liệu hợp đồng - ${error.message}</td></tr>`;
        });

    addManagedEventListener(btnShowAddForm, 'click', () => {
        const formTitle = document.getElementById('contract-form-title');
        const contractIdInput = document.getElementById('contract-id');
        contractForm.reset();
        if (formTitle) formTitle.textContent = 'Tạo Hợp đồng Mới';
        if (contractIdInput) contractIdInput.value = '';
        contractFormContainer.style.display = 'block';
        btnShowAddForm.style.display = 'none';
        window.scrollTo(0, 0);
        contractFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    addManagedEventListener(btnCancel, 'click', () => {
        contractFormContainer.style.display = 'none';
        if (btnShowAddForm) btnShowAddForm.style.display = 'inline-block';
        contractForm.reset();
    });

    addManagedEventListener(contractForm, 'submit', (e) => {
        e.preventDefault();
        const contractIdInput = document.getElementById('contract-id');
        const contractId = contractIdInput?.value;
        const employeeSelect = document.getElementById('contract-employee');
        const employeeText = employeeSelect?.options[employeeSelect.selectedIndex]?.text || 'N/A';
        const employeeValue = employeeSelect?.value || 'N/A';
        const contractCode = document.getElementById('contract-code')?.value || '';
        const contractType = document.getElementById('contract-type')?.value || '';
        const signDate = document.getElementById('contract-sign-date')?.value || null;
        const startDate = document.getElementById('contract-start-date')?.value || null;
        const endDate = document.getElementById('contract-end-date')?.value || null;

        const contractData = {
            MaHD: contractId || `HD${Date.now().toString().slice(-4)}`,
            MaNV: employeeValue,
            SoHD: contractCode,
            LoaiHD: contractType,
            NgayKy: signDate,
            NgayHieuLuc: startDate,
            NgayHetHan: endDate
        };

        const url = contractId ? 'update_contract.php' : 'add_contract.php';
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contractData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(contractId ? `Đã CẬP NHẬT hợp đồng ${contractCode}!` : `Đã THÊM MỚI hợp đồng ${contractCode} cho ${employeeText}!`);
                loadPage('hop-dong');
            } else {
                alert('Lỗi: ' + data.message);
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            alert('Lỗi khi lưu hợp đồng: ' + error.message);
        });

        contractFormContainer.style.display = 'none';
        if (btnShowAddForm) btnShowAddForm.style.display = 'inline-block';
        contractForm.reset();
    });

    addManagedEventListener(contractTableBody, 'click', handleContractTableActions);
}

function handleContractTableActions(event) {
    const targetButton = event.target.closest('.table-action-btn');
    if (!targetButton) return;

    const row = targetButton.closest('tr');
    if (!row) return;
    const contractId = row.dataset.id;
    const contractCode = row.dataset.code || `HĐ ${contractId}`;

    if (targetButton.classList.contains('btn-view-edit')) {
        console.log("Edit button clicked for Contract:", contractId);
        const contractFormContainer = document.getElementById('contract-form-container');
        const contractForm = document.getElementById('contract-form');
        const formTitle = document.getElementById('contract-form-title');
        const contractIdInput = document.getElementById('contract-id');
        const btnShowAddForm = document.getElementById('btn-show-add-contract-form');

        if (!contractForm || !formTitle || !contractIdInput || !contractFormContainer || !btnShowAddForm) {
            console.error("Cannot find contract form elements for editing."); 
            return;
        }
        contractForm.reset();
        formTitle.textContent = `Sửa hợp đồng: ${contractCode}`;
        contractIdInput.value = contractId;

        document.getElementById('contract-employee').value = row.dataset.employeeValue || '';
        document.getElementById('contract-code').value = row.dataset.code || '';
        document.getElementById('contract-type').value = row.dataset.type || '';
        document.getElementById('contract-sign-date').value = row.dataset.signDate || '';
        document.getElementById('contract-start-date').value = row.dataset.startDate || '';
        document.getElementById('contract-end-date').value = row.dataset.endDate === 'N/A' ? '' : row.dataset.endDate || '';

        contractFormContainer.style.display = 'block';
        btnShowAddForm.style.display = 'none';
        window.scrollTo(0, 0);
        contractFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } else if (targetButton.classList.contains('btn-delete')) {
        console.log("Delete button clicked for Contract:", contractId);
        if (confirm(`Bạn có chắc chắn muốn xóa hợp đồng ${contractCode} (ID: ${contractId})?`)) {
            fetch(`delete_contract.php?maHD=${contractId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert(`Đã XÓA hợp đồng ${contractCode}.`);
                        loadPage('hop-dong');
                    } else {
                        alert('Lỗi: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error("Fetch error:", error);
                    alert('Lỗi khi xóa hợp đồng: ' + error.message);
                });
        }
    }
}
*/
function bindThuTucPageEvents() {
    console.log("Binding ThuTuc events...");
    const mainContent = document.getElementById('main-content');
    const decisionFormContainer = mainContent?.querySelector('#decision-form-container');
    const terminationFormContainer = mainContent?.querySelector('#termination-form-container');
    const decisionForm = mainContent?.querySelector('#decision-form');
    const terminationForm = mainContent?.querySelector('#termination-form');
    const decisionTableBody = mainContent?.querySelector('#decision-list-body');
    const terminationTableBody = mainContent?.querySelector('#termination-list-body');
    const decisionEmployeeSelect = mainContent?.querySelector('#decision-employee');
    const terminationEmployeeSelect = mainContent?.querySelector('#termination-employee');

    if (!decisionFormContainer || !terminationFormContainer || !decisionForm || !terminationForm || 
        !decisionTableBody || !terminationTableBody || !decisionEmployeeSelect || !terminationEmployeeSelect) {
        console.error("ThuTuc page elements missing! Cannot bind events."); 
        return;
    }

    // Populate employee dropdowns
    fetch('get_employees.php')
        .then(response => {
            if (!response.ok) throw new Error('Không thể kết nối đến API: ' + response.statusText);
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                const employeeOptions = data.data.map(emp => 
                    `<option value="${emp.MaNV}">${emp.TenNV} (${emp.MaNV})</option>`).join('');
                decisionEmployeeSelect.innerHTML = `<option value="">-- Chọn NV --</option>${employeeOptions}`;
                terminationEmployeeSelect.innerHTML = `<option value="">-- Chọn NV --</option>${employeeOptions}`;
            } else {
                console.error("API error:", data.message);
                decisionEmployeeSelect.innerHTML = `<option value="">Lỗi: ${data.message}</option>`;
                terminationEmployeeSelect.innerHTML = `<option value="">Lỗi: ${data.message}</option>`;
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            decisionEmployeeSelect.innerHTML = `<option value="">Lỗi: ${error.message}</option>`;
            terminationEmployeeSelect.innerHTML = `<option value="">Lỗi: ${error.message}</option>`;
        });

    // Hide forms initially
    decisionFormContainer.style.display = 'none';
    terminationFormContainer.style.display = 'none';

    // Load decisions
    fetch('get_decisions.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                data.data.forEach(decision => {
                    const dataAttrs = `data-id="${decision.MaQD}" data-type="${decision.LoaiQD}" data-employee="${decision.MaNV}" data-date="${decision.NgayHieuLuc}" data-reason="${decision.NoiDung}" data-code="${decision.SoQD}"`;
                    const rowHTML = `
                        <tr ${dataAttrs}>
                            <td>${decision.SoQD}</td>
                            <td>${decision.LoaiQD}</td>
                            <td>${decision.TenNV}</td>
                            <td>${decision.NgayHieuLuc || 'N/A'}</td>
                            <td>${decision.NoiDung}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="table-action-btn btn-view-edit" data-id="${decision.MaQD}"><i class="fas fa-edit"></i> Sửa</button>
                                    <button class="table-action-btn btn-delete" data-id="${decision.MaQD}"><i class="fas fa-trash-alt"></i> Xóa</button>
                                </div>
                            </td>
                        </tr>`;
                    decisionTableBody.insertAdjacentHTML('beforeend', rowHTML);
                });
            } else {
                decisionTableBody.innerHTML = `<tr><td colspan="6">Lỗi: ${data.message}</td></tr>`;
            }
        })
        .catch(error => {
            decisionTableBody.innerHTML = `<tr><td colspan="6">Lỗi: ${error.message}</td></tr>`;
        });

    // Load terminations
    fetch('get_terminations.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                data.data.forEach(termination => {
                    const dataAttrs = `data-id="${termination.MaNVNghi}" data-employee="${termination.MaNV}" data-apply-date="${termination.NgayNopDon}" data-date="${termination.NgayNghi}" data-reason="${termination.LyDoNghi}" data-status="${termination.TrangThai}"`;
                    const rowHTML = `
                        <tr ${dataAttrs}>
                            <td>${termination.TenNV}</td>
                            <td>${termination.NgayNopDon || 'N/A'}</td>
                            <td>${termination.NgayNghi || 'N/A'}</td>
                            <td>${termination.LyDoNghi || 'N/A'}</td>
                            <td>${termination.TrangThai || 'N/A'}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="table-action-btn btn-view-edit" data-id="${termination.MaNVNghi}"><i class="fas fa-edit"></i> Sửa</button>
                                    <button class="table-action-btn btn-delete" data-id="${termination.MaNVNghi}"><i class="fas fa-trash-alt"></i> Xóa</button>
                                </div>
                            </td>
                        </tr>`;
                    terminationTableBody.insertAdjacentHTML('beforeend', rowHTML);
                });
            } else {
                terminationTableBody.innerHTML = `<tr><td colspan="6">Lỗi: ${data.message}</td></tr>`;
            }
        })
        .catch(error => {
            terminationTableBody.innerHTML = `<tr><td colspan="6">Lỗi: ${error.message}</td></tr>`;
        });

    // Show/hide forms
    addManagedEventListener(mainContent, 'click', (e) => {
        const button = e.target.closest('button[data-action="show-procedure-form"]');
        if (button) {
            const type = button.dataset.type;
            if (type === 'decision') {
                decisionFormContainer.style.display = 'block';
                terminationFormContainer.style.display = 'none';
                decisionForm.reset();
                document.getElementById('decision-form-title').textContent = 'Tạo quyết định nhân sự';
                document.getElementById('decision-id').value = '';
            } else if (type === 'termination') {
                terminationFormContainer.style.display = 'block';
                decisionFormContainer.style.display = 'none';
                terminationForm.reset();
                document.getElementById('termination-form-title').textContent = 'Ghi nhận thông tin nghỉ việc';
                document.getElementById('termination-id').value = '';
            }
            window.scrollTo(0, 0);
        }

        const cancelButton = e.target.closest('button[data-action="hide-procedure-forms"]');
        if (cancelButton) {
            decisionFormContainer.style.display = 'none';
            terminationFormContainer.style.display = 'none';
            decisionForm.reset();
            terminationForm.reset();
        }
    });

    // Submit decision form
    addManagedEventListener(decisionForm, 'submit', (e) => {
        e.preventDefault();
        const decisionId = document.getElementById('decision-id')?.value;
        const type = document.getElementById('decision-type')?.value;
        const employee = document.getElementById('decision-employee')?.value;
        const date = document.getElementById('decision-date')?.value;
        const reason = document.getElementById('decision-reason')?.value;
        const code = document.getElementById('decision-code')?.value;

        const decisionData = {
            MaQD: decisionId || `QD${Date.now().toString().slice(-4)}`,
            LoaiQD: type,
            MaNV: employee,
            NgayHieuLuc: date,
            NoiDung: reason,
            SoQD: code
        };

        const url = decisionId ? 'update_decision.php' : 'add_decision.php';
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(decisionData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(decisionId ? `Đã CẬP NHẬT quyết định ${code}!` : `Đã THÊM MỚI quyết định ${code}!`);
                loadPage('thu-tuc');
            } else {
                alert('Lỗi: ' + data.message);
            }
        })
        .catch(error => {
            alert('Lỗi khi lưu quyết định: ' + error.message);
        });
    });

    // Submit termination form
    addManagedEventListener(terminationForm, 'submit', (e) => {
        e.preventDefault();
        const terminationId = document.getElementById('termination-id')?.value;
        const employee = document.getElementById('termination-employee')?.value;
        const applyDate = document.getElementById('termination-apply-date')?.value || null;
        const date = document.getElementById('termination-date')?.value;
        const reason = document.getElementById('termination-reason')?.value || '';
        const status = document.getElementById('termination-status')?.value;

        const terminationData = {
            MaNVNghi: terminationId || `NVN${Date.now().toString().slice(-4)}`,
            MaNV: employee,
            NgayNopDon: applyDate,
            NgayNghi: date,
            LyDoNghi: reason,
            TrangThai: status
        };

        const url = terminationId ? 'update_termination.php' : 'add_termination.php';
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(terminationData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(terminationId ? `Đã CẬP NHẬT thông tin nghỉ việc!` : `Đã THÊM MỚI thông tin nghỉ việc!`);
                loadPage('thu-tuc');
            } else {
                alert('Lỗi: ' + data.message);
            }
        })
        .catch(error => {
            alert('Lỗi khi lưu thông tin nghỉ việc: ' + error.message);
        });
    });

    // Handle decision table actions
    addManagedEventListener(decisionTableBody, 'click', (e) => {
        const targetButton = e.target.closest('.table-action-btn');
        if (!targetButton) return;

        const row = targetButton.closest('tr');
        if (!row) return;
        const decisionId = row.dataset.id;
        const decisionCode = row.dataset.code || `QĐ ${decisionId}`;

        if (targetButton.classList.contains('btn-view-edit')) {
            decisionFormContainer.style.display = 'block';
            terminationFormContainer.style.display = 'none';
            document.getElementById('decision-form-title').textContent = `Sửa quyết định: ${decisionCode}`;
            document.getElementById('decision-id').value = decisionId;
            document.getElementById('decision-type').value = row.dataset.type || '';
            document.getElementById('decision-employee').value = row.dataset.employee || '';
            document.getElementById('decision-date').value = row.dataset.date || '';
            document.getElementById('decision-reason').value = row.dataset.reason || '';
            document.getElementById('decision-code').value = row.dataset.code || '';
            window.scrollTo(0, 0);
        } else if (targetButton.classList.contains('btn-delete')) {
            if (confirm(`Bạn có chắc chắn muốn xóa quyết định ${decisionCode}?`)) {
                fetch(`delete_decision.php?maQD=${decisionId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            alert(`Đã XÓA quyết định ${decisionCode}.`);
                            loadPage('thu-tuc');
                        } else {
                            alert('Lỗi: ' + data.message);
                        }
                    })
                    .catch(error => {
                        alert('Lỗi khi xóa quyết định: ' + error.message);
                    });
            }
        }
    });

    // Handle termination table actions
    addManagedEventListener(terminationTableBody, 'click', (e) => {
        const targetButton = e.target.closest('.table-action-btn');
        if (!targetButton) return;

        const row = targetButton.closest('tr');
        if (!row) return;
        const terminationId = row.dataset.id;

        if (targetButton.classList.contains('btn-view-edit')) {
            terminationFormContainer.style.display = 'block';
            decisionFormContainer.style.display = 'none';
            document.getElementById('termination-form-title').textContent = `Sửa Thông tin Nghỉ việc`;
            document.getElementById('termination-id').value = terminationId;
            document.getElementById('termination-employee').value = row.dataset.employee || '';
            document.getElementById('termination-apply-date').value = row.dataset.applyDate || '';
            document.getElementById('termination-date').value = row.dataset.date || '';
            document.getElementById('termination-reason').value = row.dataset.reason || '';
            document.getElementById('termination-status').value = row.dataset.status || '';
            window.scrollTo(0, 0);
        } else if (targetButton.classList.contains('btn-delete')) {
            if (confirm(`Bạn có chắc chắn muốn xóa thông tin nghỉ việc này?`)) {
                fetch(`delete_termination.php?maNVNghi=${terminationId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            alert(`Đã XÓA thông tin nghỉ việc.`);
                            loadPage('thu-tuc');
                        } else {
                            alert('Lỗi: ' + data.message);
                        }
                    })
                    .catch(error => {
                        alert('Lỗi khi xóa thông tin nghỉ việc: ' + error.message);
                    });
            }
        }
    });
}

function bindKTKLPageEvents() {
    console.log("Binding KTKL events...");
    const mainContent = document.getElementById('main-content');
    const rewardFormContainer = mainContent?.querySelector('#reward-form-container');
    const disciplineFormContainer = mainContent?.querySelector('#discipline-form-container');
    const rewardForm = mainContent?.querySelector('#reward-form');
    const disciplineForm = mainContent?.querySelector('#discipline-form');
    const rewardTableBody = mainContent?.querySelector('#reward-list-body');
    const disciplineTableBody = mainContent?.querySelector('#discipline-list-body');
    const rewardEmployeeSelect = mainContent?.querySelector('#reward-employee');
    const disciplineEmployeeSelect = mainContent?.querySelector('#discipline-employee');

    if (!rewardFormContainer || !disciplineFormContainer || !rewardForm || !disciplineForm || 
        !rewardTableBody || !disciplineTableBody || !rewardEmployeeSelect || !disciplineEmployeeSelect) {
        console.error("KTKL page elements missing! Cannot bind events."); 
        return;
    }

    // Populate employee dropdowns
    fetch('get_employees.php')
        .then(response => {
            if (!response.ok) throw new Error('Không thể kết nối đến API: ' + response.statusText);
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                const employeeOptions = data.data.map(emp => 
                    `<option value="${emp.MaNV}">${emp.TenNV} (${emp.MaNV})</option>`).join('');
                rewardEmployeeSelect.innerHTML = `<option value="">-- Chọn NV --</option>${employeeOptions}`;
                disciplineEmployeeSelect.innerHTML = `<option value="">-- Chọn NV --</option>${employeeOptions}`;
            } else {
                console.error("API error:", data.message);
                rewardEmployeeSelect.innerHTML = `<option value="">Lỗi: ${data.message}</option>`;
                disciplineEmployeeSelect.innerHTML = `<option value="">Lỗi: ${data.message}</option>`;
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
            rewardEmployeeSelect.innerHTML = `<option value="">Lỗi: ${error.message}</option>`;
            disciplineEmployeeSelect.innerHTML = `<option value="">Lỗi: ${error.message}</option>`;
        });

    // Hide forms initially
    rewardFormContainer.style.display = 'none';
    disciplineFormContainer.style.display = 'none';

    // Load rewards
    fetch('get_rewards.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                data.data.forEach(reward => {
                    const dataAttrs = `data-id="${reward.MaKT}" data-employee="${reward.MaNV}" data-date="${reward.NgayQD}" data-type="${reward.HinhThucKT}" data-reason="${reward.LyDoKT}" data-code="${reward.SoQD}" data-amount="${reward.MucThuong}"`;
                    const rowHTML = `
                        <tr ${dataAttrs}>
                            <td>${reward.SoQD}</td>
                            <td>${reward.TenNV}</td>
                            <td>${reward.NgayQD || 'N/A'}</td>
                            <td>${reward.HinhThucKT || 'N/A'}</td>
                            <td>${reward.LyDoKT}</td>
                            <td>${reward.MucThuong ? Number(reward.MucThuong).toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="table-action-btn btn-view-edit" data-id="${reward.MaKT}"><i class="fas fa-edit"></i> Sửa</button>
                                    <button class="table-action-btn btn-delete" data-id="${reward.MaKT}"><i class="fas fa-trash-alt"></i> Xóa</button>
                                </div>
                            </td>
                        </tr>`;
                    rewardTableBody.insertAdjacentHTML('beforeend', rowHTML);
                });
            } else {
                rewardTableBody.innerHTML = `<tr><td colspan="7">Lỗi: ${data.message}</td></tr>`;
            }
        })
        .catch(error => {
            rewardTableBody.innerHTML = `<tr><td colspan="7">Lỗi: ${error.message}</td></tr>`;
        });

    // Load disciplines
    fetch('get_disciplines.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                data.data.forEach(discipline => {
                    const dataAttrs = `data-id="${discipline.MaKL}" data-employee="${discipline.MaNV}" data-date="${discipline.NgayViPham}" data-type="${discipline.HinhThucKL}" data-reason="${discipline.LyDoKL}" data-code="${discipline.SoBBQD}"`;
                    const rowHTML = `
                        <tr ${dataAttrs}>
                            <td>${discipline.SoBBQD}</td>
                            <td>${discipline.TenNV}</td>
                            <td>${discipline.NgayViPham || 'N/A'}</td>
                            <td>${discipline.HinhThucKL}</td>
                            <td>${discipline.LyDoKL}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="table-action-btn btn-view-edit" data-id="${discipline.MaKL}"><i class="fas fa-edit"></i> Sửa</button>
                                    <button class="table-action-btn btn-delete" data-id="${discipline.MaKL}"><i class="fas fa-trash-alt"></i> Xóa</button>
                                </div>
                            </td>
                        </tr>`;
                    disciplineTableBody.insertAdjacentHTML('beforeend', rowHTML);
                });
            } else {
                disciplineTableBody.innerHTML = `<tr><td colspan="6">Lỗi: ${data.message}</td></tr>`;
            }
        })
        .catch(error => {
            disciplineTableBody.innerHTML = `<tr><td colspan="6">Lỗi: ${error.message}</td></tr>`;
        });

    // Show/hide forms
    addManagedEventListener(mainContent, 'click', (e) => {
        const button = e.target.closest('button[data-action="show-ktkl-form"]');
        if (button) {
            const type = button.dataset.type;
            if (type === 'reward') {
                rewardFormContainer.style.display = 'block';
                disciplineFormContainer.style.display = 'none';
                rewardForm.reset();
                document.getElementById('reward-form-title').textContent = 'Thêm quyết định khen thưởng';
                document.getElementById('reward-id').value = '';
            } else if (type === 'discipline') {
                disciplineFormContainer.style.display = 'block';
                rewardFormContainer.style.display = 'none';
                disciplineForm.reset();
                document.getElementById('discipline-form-title').textContent = 'Thêm quyết định/ biên bản kỷ luật';
                document.getElementById('discipline-id').value = '';
            }
            window.scrollTo(0, 0);
        }

        const cancelButton = e.target.closest('button[data-action="hide-ktkl-forms"]');
        if (cancelButton) {
            rewardFormContainer.style.display = 'none';
            disciplineFormContainer.style.display = 'none';
            rewardForm.reset();
            disciplineForm.reset();
        }
    });

    // Submit reward form
    addManagedEventListener(rewardForm, 'submit', (e) => {
        e.preventDefault();
        const rewardId = document.getElementById('reward-id')?.value;
        const employee = document.getElementById('reward-employee')?.value;
        const date = document.getElementById('reward-date')?.value;
        const type = document.getElementById('reward-type')?.value || '';
        const reason = document.getElementById('reward-reason')?.value;
        const code = document.getElementById('reward-code')?.value;
        const amount = document.getElementById('reward-amount')?.value || null;

        const rewardData = {
            MaKT: rewardId || `KT${Date.now().toString().slice(-4)}`,
            MaNV: employee,
            NgayQD: date,
            HinhThucKT: type,
            LyDoKT: reason,
            SoQD: code,
            MucThuong: amount
        };

        const url = rewardId ? 'update_reward.php' : 'add_reward.php';
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rewardData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(rewardId ? `Đã CẬP NHẬT khen thưởng ${code}!` : `Đã THÊM MỚI khen thưởng ${code}!`);
                loadPage('khen-thuong-ky-luat');
            } else {
                alert('Lỗi: ' + data.message);
            }
        })
        .catch(error => {
            alert('Lỗi khi lưu khen thưởng: ' + error.message);
        });
    });

    // Submit discipline form
    addManagedEventListener(disciplineForm, 'submit', (e) => {
        e.preventDefault();
        const disciplineId = document.getElementById('discipline-id')?.value;
        const employee = document.getElementById('discipline-employee')?.value;
        const date = document.getElementById('discipline-date')?.value;
        const type = document.getElementById('discipline-type')?.value;
        const reason = document.getElementById('discipline-reason')?.value;
        const code = document.getElementById('discipline-code')?.value;

        const disciplineData = {
            MaKL: disciplineId || `KL${Date.now().toString().slice(-4)}`,
            MaNV: employee,
            NgayViPham: date,
            HinhThucKL: type,
            LyDoKL: reason,
            SoBBQD: code
        };

        const url = disciplineId ? 'update_discipline.php' : 'add_discipline.php';
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(disciplineData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(disciplineId ? `Đã CẬP NHẬT kỷ luật ${code}!` : `Đã THÊM MỚI kỷ luật ${code}!`);
                loadPage('khen-thuong-ky-luat');
            } else {
                alert('Lỗi: ' + data.message);
            }
        })
        .catch(error => {
            alert('Lỗi khi lưu kỷ luật: ' + error.message);
        });
    });

    // Handle reward table actions
    addManagedEventListener(rewardTableBody, 'click', (e) => {
        const targetButton = e.target.closest('.table-action-btn');
        if (!targetButton) return;

        const row = targetButton.closest('tr');
        if (!row) return;
        const rewardId = row.dataset.id;
        const rewardCode = row.dataset.code || `QĐKT ${rewardId}`;

        if (targetButton.classList.contains('btn-view-edit')) {
            rewardFormContainer.style.display = 'block';
            disciplineFormContainer.style.display = 'none';
            document.getElementById('reward-form-title').textContent = `Sửa Khen thưởng: ${rewardCode}`;
            document.getElementById('reward-id').value = rewardId;
            document.getElementById('reward-employee').value = row.dataset.employee || '';
            document.getElementById('reward-date').value = row.dataset.date || '';
            document.getElementById('reward-type').value = row.dataset.type || '';
            document.getElementById('reward-reason').value = row.dataset.reason || '';
            document.getElementById('reward-code').value = row.dataset.code || '';
            document.getElementById('reward-amount').value = row.dataset.amount || '';
            window.scrollTo(0, 0);
        } else if (targetButton.classList.contains('btn-delete')) {
            if (confirm(`Bạn có chắc chắn muốn xóa khen thưởng ${rewardCode}?`)) {
                fetch(`delete_reward.php?maKT=${rewardId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            alert(`Đã XÓA khen thưởng ${rewardCode}.`);
                            loadPage('khen-thuong-ky-luat');
                        } else {
                            alert('Lỗi: ' + data.message);
                        }
                    })
                    .catch(error => {
                        alert('Lỗi khi xóa khen thưởng: ' + error.message);
                    });
            }
        }
    });

    // Handle discipline table actions
    addManagedEventListener(disciplineTableBody, 'click', (e) => {
        const targetButton = e.target.closest('.table-action-btn');
        if (!targetButton) return;

        const row = targetButton.closest('tr');
        if (!row) return;
        const disciplineId = row.dataset.id;
        const disciplineCode = row.dataset.code || `BBKL ${disciplineId}`;

        if (targetButton.classList.contains('btn-view-edit')) {
            disciplineFormContainer.style.display = 'block';
            rewardFormContainer.style.display = 'none';
            document.getElementById('discipline-form-title').textContent = `Sửa Kỷ luật: ${disciplineCode}`;
            document.getElementById('discipline-id').value = disciplineId;
            document.getElementById('discipline-employee').value = row.dataset.employee || '';
            document.getElementById('discipline-date').value = row.dataset.date || '';
            document.getElementById('discipline-type').value = row.dataset.type || '';
            document.getElementById('discipline-reason').value = row.dataset.reason || '';
            document.getElementById('discipline-code').value = row.dataset.code || '';
            window.scrollTo(0, 0);
        } else if (targetButton.classList.contains('btn-delete')) {
            if (confirm(`Bạn có chắc chắn muốn xóa kỷ luật ${disciplineCode}?`)) {
                fetch(`delete_discipline.php?maKL=${disciplineId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            alert(`Đã XÓA kỷ luật ${disciplineCode}.`);
                            loadPage('khen-thuong-ky-luat');
                        } else {
                            alert('Lỗi: ' + data.message);
                        }
                    })
                    .catch(error => {
                        alert('Lỗi khi xóa kỷ luật: ' + error.message);
                    });
            }
        }
    });
}

function bindBaoCaoPageEvents() {
    console.log("Binding BaoCao events...");
    const mainContent = document.getElementById('main-content');
    const reportButtons = mainContent?.querySelector('.report-buttons');
    const reportFilters = mainContent?.querySelector('#report-filters');
    const btnGenerateReport = mainContent?.querySelector('#btn-generate-report');
    const reportResultsContainer = mainContent?.querySelector('#report-results-container');
    const reportDepartmentSelect = mainContent?.querySelector('#report-department');
    const reportChartCanvas = mainContent?.querySelector('#reportChart');

    if (!reportButtons || !reportFilters || !btnGenerateReport || !reportResultsContainer || !reportDepartmentSelect || !reportChartCanvas) {
        console.error("BaoCao page elements missing! Cannot bind events.");
        return;
    }

    // Initialize Chart.js instance
    let reportChart = null;

    // Populate department dropdown
    reportDepartmentSelect.innerHTML = '<option value="">Tất cả</option>';
    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.MaPB;
        option.textContent = dept.TenPB;
        reportDepartmentSelect.appendChild(option);
    });

    // Handle report type selection
    let selectedReportType = null;
    addManagedEventListener(reportButtons, 'click', (e) => {
        const button = e.target.closest('button[data-report-type]');
        if (button) {
            selectedReportType = button.dataset.reportType;
            reportButtons.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            reportResultsContainer.innerHTML = `<p><i>Đã chọn báo cáo: ${button.textContent}. Vui lòng đặt bộ lọc và nhấn "Xem báo cáo"...</i></p>`;
            if (reportChart) {
                reportChart.destroy();
                reportChart = null;
            }
            reportChartCanvas.style.display = 'none';
        }
    });

    // Handle report generation
    addManagedEventListener(btnGenerateReport, 'click', () => {
        if (!selectedReportType) {
            alert('Vui lòng chọn loại báo cáo trước!');
            return;
        }

        const startDate = document.getElementById('report-start-date')?.value || '';
        const endDate = document.getElementById('report-end-date')?.value || '';
        const department = reportDepartmentSelect?.value || '';

        // Validate dates
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            alert('Ngày bắt đầu không được lớn hơn ngày kết thúc!');
            return;
        }

        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (department) params.append('department', department);

        if (selectedReportType === 'tong-hop') {
            fetch(`get_structure_report.php?${params.toString()}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Display summary
                        reportResultsContainer.innerHTML = `
                            <h4>Báo cáo cơ cấu nhân sự</h4>
                            <p>Tổng số nhân viên: ${data.totalEmployees}</p>
                            <p>Số nhân viên theo phòng ban:</p>
                            <ul>
                                ${Object.entries(data.byDepartment).map(([dept, count]) => `<li>${dept}: ${count} nhân viên</li>`).join('')}
                            </ul>
                            <p>Số nhân viên theo loại hợp đồng:</p>
                            <ul>
                                ${Object.entries(data.byContractType).map(([type, count]) => `<li>${type}: ${count} nhân viên</li>`).join('')}
                            </ul>
                        `;

                        // Draw chart
                        if (reportChart) reportChart.destroy();
                        reportChartCanvas.style.display = 'block';
                        reportChart = new Chart(reportChartCanvas, {
                            type: 'bar',
                            data: {
                                labels: Object.keys(data.byDepartment),
                                datasets: [{
                                    label: 'Số nhân viên theo phòng ban',
                                    data: Object.values(data.byDepartment).map(val => parseInt(val)), // Chuyển đổi thành số nguyên
                                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                scales: {
                                    y: { 
                                        beginAtZero: true, 
                                        title: { display: true, text: 'Số nhân viên' },
                                        ticks: {
                                            stepSize: 1, // Đảm bảo bước là 1 (số nguyên)
                                            precision: 0 // Không hiển thị số thập phân
                                        }
                                    },
                                    x: { title: { display: true, text: 'Phòng ban' } }
                                },
                                plugins: {
                                    legend: { display: true },
                                    title: { display: true, text: 'Cơ cấu nhân sự theo phòng ban' }
                                }
                            }
                        });
                    } else {
                        reportResultsContainer.innerHTML = `<p style="color: red;">Lỗi: ${data.message}</p>`;
                        reportChartCanvas.style.display = 'none';
                    }
                })
                .catch(error => {
                    reportResultsContainer.innerHTML = `<p style="color: red;">Lỗi: ${error.message}</p>`;
                    reportChartCanvas.style.display = 'none';
                });

        } else if (selectedReportType === 'bien-dong') {
            fetch(`get_turnover_report.php?${params.toString()}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Lọc các tháng có biến động (new > 0 hoặc terminated > 0)
                        const monthsWithMovement = Object.entries(data.byMonth).filter(([_, stats]) => stats.new > 0 || stats.terminated > 0);

                        // Display summary
                        reportResultsContainer.innerHTML = `
                            <h4>Báo cáo biến động nhân sự</h4>
                            <p>Tổng số nhân viên mới: ${data.newEmployees}</p>
                            <p>Tổng số nhân viên nghỉ việc: ${data.terminatedEmployees}</p>
                            <p>Biến động theo tháng:</p>
                            <ul>
                                ${monthsWithMovement.map(([month, stats]) => 
                                    `<li>${month}: +${stats.new} (mới), -${stats.terminated} (nghỉ)</li>`
                                ).join('')}
                            </ul>
                        `;

                        // Draw chart with filtered data
                        if (reportChart) reportChart.destroy();
                        reportChartCanvas.style.display = 'block';
                        reportChart = new Chart(reportChartCanvas, {
                            type: 'line',
                            data: {
                                labels: monthsWithMovement.map(([month]) => month),
                                datasets: [
                                    {
                                        label: 'Nhân viên mới',
                                        data: monthsWithMovement.map(([_, stats]) => parseInt(stats.new)), // Chuyển đổi thành số nguyên
                                        borderColor: 'rgba(75, 192, 192, 1)',
                                        fill: false
                                    },
                                    {
                                        label: 'Nhân viên nghỉ',
                                        data: monthsWithMovement.map(([_, stats]) => parseInt(stats.terminated)), // Chuyển đổi thành số nguyên
                                        borderColor: 'rgba(255, 99, 132, 1)',
                                        fill: false
                                    }
                                ]
                            },
                            options: {
                                scales: {
                                    y: { 
                                        beginAtZero: true, 
                                        title: { display: true, text: 'Số lượng' },
                                        ticks: {
                                            stepSize: 1, // Đảm bảo bước là 1 (số nguyên)
                                            precision: 0 // Không hiển thị số thập phân
                                        }
                                    },
                                    x: { title: { display: true, text: 'Tháng' } }
                                },
                                plugins: {
                                    legend: { display: true },
                                    title: { display: true, text: 'Biến động nhân sự theo tháng' }
                                }
                            }
                        });
                    } else {
                        reportResultsContainer.innerHTML = `<p style="color: red;">Lỗi: ${data.message}</p>`;
                        reportChartCanvas.style.display = 'none';
                    }
                })
                .catch(error => {
                    reportResultsContainer.innerHTML = `<p style="color: red;">Lỗi: ${error.message}</p>`;
                    reportChartCanvas.style.display = 'none';
                });
        }
    });
}

// --- Khởi tạo ứng dụng ---
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOM loaded, initializing app...");
    await Promise.all([fetchDepartments(), fetchPositions()]);
    
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            loadPage(page);
        });
    });

    // Load default page
    const defaultLink = document.querySelector('.main-nav a[data-page="ho-so"]');
    if (defaultLink) {
        defaultLink.classList.add('active');
        loadPage('ho-so');
    }
    console.log("App initialized successfully.");
});