/**
 * scripts.js - Quản lý giao diện SPA cho Hệ thống Quản lý Nhân sự (v7.2 - Thêm log chi tiết, try-catch)
 */
console.log("SCRIPT START: scripts.js running (V7.2)...");

// --- Nội dung HTML cho các trang ---
// (Giữ nguyên nội dung HTML của 'pages' object từ phiên bản trước V7.1/V8)
const pages = {
    'ho-so': `
    <div class="header"> <h1>1. Quản lý Hồ sơ Nhân viên</h1> <p class="sub">Xem, thêm, sửa, xóa thông tin nhân viên</p> </div>
    <button class="main-action-btn" id="btn-show-add-employee-form"><i class="fas fa-plus"></i> Thêm Nhân viên Mới</button>
    <div id="employee-form-container" class="hidden-form"> <h3 id="employee-form-title">Thêm Nhân viên Mới</h3> <form id="employee-form" class="form-area"> <input type="hidden" id="employee-id" name="employee-id"> <fieldset> <legend><h4>1.1 Thông tin cá nhân</h4></legend> <div class="form-row"> <div class="form-group"> <label for="ho-ten">Họ tên:</label> <input type="text" id="ho-ten" name="ho-ten" required> </div> <div class="form-group"> <label for="ngay-sinh">Ngày sinh:</label> <input type="date" id="ngay-sinh" name="ngay-sinh"> </div> <div class="form-group"> <label for="gioi-tinh">Giới tính:</label> <select id="gioi-tinh" name="gioi-tinh"> <option value="Nam">Nam</option> <option value="Nữ">Nữ</option> <option value="Khác">Khác</option> </select> </div> </div> <div class="form-row"> <div class="form-group"> <label for="cmnd-cccd">Số CMND/CCCD:</label> <input type="text" id="cmnd-cccd" name="cmnd-cccd"> </div> <div class="form-group"> <label for="lien-he">Liên hệ (SĐT, Email):</label> <input type="text" id="lien-he" name="lien-he"> </div> </div> <div class="form-group"> <label for="dia-chi">Địa chỉ:</label> <textarea id="dia-chi" name="dia-chi" rows="2"></textarea> </div> </fieldset> <fieldset> <legend><h4>1.2 Quá trình công tác</h4></legend> <div id="work-history-section"> <div class="form-row"> <div class="form-group"> <label for="vi-tri">Vị trí hiện tại:</label> <input type="text" id="vi-tri" name="vi-tri"> </div> <div class="form-group"> <label for="phong-ban">Phòng ban:</label> <input type="text" id="phong-ban" name="phong-ban"> </div> <div class="form-group"> <label for="ngay-vao-lam">Ngày vào làm:</label> <input type="date" id="ngay-vao-lam" name="ngay-vao-lam"> </div> </div> <p style="font-size:0.9em; color:#666;"><i>(Ghi chú: Chức năng chi tiết quản lý lịch sử công tác (nhiều vị trí) cần phát triển thêm)</i></p> </div> <button type="button" class="submit-btn btn-other" style="padding: 6px 10px; font-size: 0.9em; margin-top: 5px;" onclick="alert('Chức năng Thêm lịch sử công tác chưa được cài đặt.')"><i class="fas fa-plus"></i> Thêm quá trình</button> </fieldset> <fieldset> <legend><h4>1.3 Bằng cấp, Chứng chỉ</h4></legend> <div class="form-group"> <label for="trinh-do-hoc-van">Trình độ học vấn cao nhất:</label> <input type="text" id="trinh-do-hoc-van" name="trinh-do-hoc-van"> </div> <div class="form-group"> <label for="chung-chi">Các chứng chỉ/Kỹ năng:</label> <textarea id="chung-chi" name="chung-chi" rows="3" placeholder="Liệt kê các chứng chỉ, kỹ năng..."></textarea> </div> <button type="button" class="submit-btn btn-other" style="padding: 6px 10px; font-size: 0.9em;" onclick="alert('Chức năng Thêm bằng cấp/chứng chỉ chi tiết chưa được cài đặt.')"><i class="fas fa-plus"></i> Thêm bằng cấp/chứng chỉ</button> </fieldset> <fieldset> <legend><h4>1.4 Giấy tờ liên quan</h4></legend> <div class="form-group"> <label for="giay-to">Upload giấy tờ (CV, Sơ yếu lý lịch, Quyết định,...):</label> <input type="file" id="giay-to" name="giay-to" multiple> <small>Chọn một hoặc nhiều file</small> <div id="uploaded-files-list" style="margin-top: 10px; font-size: 0.9em;"> <p><i>(Danh sách file đã upload sẽ hiện ở đây)</i></p> </div> </div> </fieldset> <div style="margin-top: 20px;"> <button type="submit" class="submit-btn"><i class="fas fa-save"></i> Lưu Thông Tin</button> <button type="button" class="submit-btn cancel-btn" id="btn-cancel-employee-form">Hủy Bỏ</button> </div> </form> </div>
    <h3>Danh sách Nhân viên</h3> <div class="table-responsive-wrapper"> <table> <thead> <tr> <th>Mã NV</th> <th>Họ Tên</th> <th>Ngày Sinh</th> <th>Giới tính</th> <th>Phòng Ban</th> <th>Vị Trí</th> <th>Hành động</th> </tr> </thead> <tbody id="employee-list-body"> <tr data-id="NV001" data-cmnd="" data-lienhe="" data-diachi="" data-trinhdo="Đại học" data-chungchi="Tiếng Anh B1" data-ngayvaolam="2023-01-15"> <td>NV001</td> <td>Nguyễn Văn An</td> <td>1990-01-15</td> <td>Nam</td> <td>Kinh Doanh</td> <td>Trưởng phòng</td> <td> <div class="action-buttons"> <button class="table-action-btn btn-view-edit" data-id="NV001" data-name="Nguyễn Văn An"><i class="fas fa-edit"></i> Xem/Sửa</button> <button class="table-action-btn btn-delete" data-id="NV001"><i class="fas fa-trash-alt"></i> Xóa</button> </div> </td> </tr> <tr data-id="NV002" data-cmnd="" data-lienhe="" data-diachi="" data-trinhdo="Cao đẳng" data-chungchi="AWS Certified Developer" data-ngayvaolam="2024-03-01"> <td>NV002</td> <td>Trần Thị Bích</td> <td>1995-05-20</td> <td>Nữ</td> <td>Kỹ Thuật</td> <td>Lập trình viên</td> <td> <div class="action-buttons"> <button class="table-action-btn btn-view-edit" data-id="NV002" data-name="Trần Thị Bích"><i class="fas fa-edit"></i> Xem/Sửa</button> <button class="table-action-btn btn-delete" data-id="NV002"><i class="fas fa-trash-alt"></i> Xóa</button> </div> </td> </tr> <tr data-id="NV003" data-cmnd="" data-lienhe="" data-diachi="" data-trinhdo="Đại học" data-chungchi="Chứng chỉ Hành chính Nhân sự" data-ngayvaolam="2022-11-10"> <td>NV003</td> <td>Lê Minh Cường</td> <td>1988-11-02</td> <td>Nam</td> <td>Nhân sự</td> <td>Chuyên viên</td> <td> <div class="action-buttons"> <button class="table-action-btn btn-view-edit" data-id="NV003" data-name="Lê Minh Cường"><i class="fas fa-edit"></i> Xem/Sửa</button> <button class="table-action-btn btn-delete" data-id="NV003"><i class="fas fa-trash-alt"></i> Xóa</button> </div> </td> </tr> </tbody> </table> </div>
  `,
    'hop-dong': `
    <div class="header"> <h1>2. Quản lý Hợp đồng Lao động</h1> <p class="sub">Theo dõi, tạo mới, gia hạn, quản lý các loại hợp đồng</p> </div>
     <button class="main-action-btn" id="btn-show-add-contract-form"><i class="fas fa-plus"></i> Tạo Hợp đồng Mới</button>
    <div id="contract-form-container" class="hidden-form"> <h3 id="contract-form-title">Tạo Hợp đồng Mới</h3> <form id="contract-form" class="form-area"> <input type="hidden" id="contract-id" name="contract-id"> <div class="form-row"> <div class="form-group"> <label for="contract-employee">Nhân viên:</label> <select id="contract-employee" name="contract-employee" required> <option value="">-- Chọn nhân viên --</option> <option value="NV001">Nguyễn Văn An (NV001)</option> <option value="NV002">Trần Thị Bích (NV002)</option> <option value="NV003">Lê Minh Cường (NV003)</option> </select> </div> <div class="form-group"> <label for="contract-code">Số hợp đồng:</label> <input type="text" id="contract-code" name="contract-code" placeholder="VD: HDLD/2025/001"> </div> <div class="form-group"> <label for="contract-type">Loại hợp đồng:</label> <select id="contract-type" name="contract-type" required> <option value="Thử việc">Thử việc (2 tháng)</option> <option value="XĐTH 1 năm">XĐTH 1 năm</option> <option value="XĐTH 3 năm">XĐTH 3 năm</option> <option value="KXĐTH">KXĐTH</option> <option value="Phụ lục hợp đồng">Phụ lục hợp đồng</option> <option value="Học việc/Đào tạo">Học việc/Đào tạo</option> </select> </div> </div> <div class="form-row"> <div class="form-group"> <label for="contract-sign-date">Ngày ký:</label> <input type="date" id="contract-sign-date" name="contract-sign-date" required> </div> <div class="form-group"> <label for="contract-start-date">Ngày hiệu lực:</label> <input type="date" id="contract-start-date" name="contract-start-date" required> </div> <div class="form-group"> <label for="contract-end-date">Ngày hết hạn:</label> <input type="date" id="contract-end-date" name="contract-end-date"> <small>(Để trống nếu là KXĐTH)</small> </div> </div> <div class="form-group"> <label for="contract-salary">Mức lương & Phụ cấp:</label> <textarea id="contract-salary" name="contract-salary" rows="2" placeholder="Ghi rõ lương chính, phụ cấp nếu có..."></textarea> </div> <div class="form-group"> <label for="contract-notes">Điều khoản khác/Ghi chú:</label> <textarea id="contract-notes" name="contract-notes" rows="3"></textarea> </div> <div class="form-group"> <label for="contract-file">Upload file Hợp đồng (Scan):</label> <input type="file" id="contract-file" name="contract-file" accept=".pdf,.doc,.docx,.jpg,.png"> <div id="contract-uploaded-file" style="margin-top: 5px; font-size: 0.9em;"><i>(Chưa có file)</i></div> </div> <div style="margin-top: 20px;"> <button type="submit" class="submit-btn"><i class="fas fa-save"></i> Lưu Hợp đồng</button> <button type="button" class="submit-btn cancel-btn" id="btn-cancel-contract-form">Hủy Bỏ</button> </div> </form> </div>
    <h3>Danh sách Hợp đồng</h3> <div class="table-responsive-wrapper"> <table> <thead> <tr> <th>Số HĐ</th> <th>Nhân viên</th> <th>Loại Hợp đồng</th> <th>Ngày ký</th> <th>Ngày hiệu lực</th> <th>Ngày hết hạn</th> <th>Trạng thái</th> <th>Hành động</th> </tr> </thead> <tbody id="contract-list-body"> <tr data-id="HD001" data-employee-value="NV001" data-type="XĐTH 1 năm" data-sign-date="2024-01-01" data-start-date="2024-01-01" data-end-date="2024-12-31" data-salary="20,000,000 VND" data-notes="Thỏa thuận khác..." data-code="HD001"> <td data-label="Số HĐ">HD001</td> <td data-label="Nhân viên">Nguyễn Văn An</td> <td data-label="Loại HĐ">XĐTH 1 năm</td> <td data-label="Ngày ký">2024-01-01</td> <td data-label="Ngày hiệu lực">2024-01-01</td> <td data-label="Ngày hết hạn">2024-12-31</td> <td data-label="Trạng thái"><span style="color: orange; font-weight: bold;">Sắp hết hạn</span></td> <td> <div class="action-buttons"> <button class="table-action-btn btn-view-edit" data-id="HD001"><i class="fas fa-edit"></i> Xem/Sửa</button> <button class="table-action-btn btn-other" data-id="HD001" data-action="renew"><i class="fas fa-sync-alt"></i> Gia hạn</button> <button class="table-action-btn btn-delete btn-delete-contract" data-id="HD001"><i class="fas fa-trash-alt"></i> Xóa</button> </div> </td> </tr> <tr data-id="HDTV002" data-employee-value="NV002" data-type="Thử việc" data-sign-date="2025-03-15" data-start-date="2025-03-15" data-end-date="2025-05-14" data-salary="15,000,000 VND" data-notes="" data-code="HDTV002"> <td data-label="Số HĐ">HDTV002</td> <td data-label="Nhân viên">Trần Thị Bích</td> <td data-label="Loại HĐ">Thử việc</td> <td data-label="Ngày ký">2025-03-15</td> <td data-label="Ngày hiệu lực">2025-03-15</td> <td data-label="Ngày hết hạn">2025-05-14</td> <td data-label="Trạng thái"><span style="color: #757575;">Đã hết hạn</span></td> <td> <div class="action-buttons"> <button class="table-action-btn btn-view-edit" data-id="HDTV002"><i class="fas fa-edit"></i> Xem/Sửa</button> <button class="table-action-btn btn-add" data-id="HDTV002" data-action="sign-official"><i class="fas fa-file-signature"></i> Ký chính thức</button> <button class="table-action-btn btn-delete btn-delete-contract" data-id="HDTV002"><i class="fas fa-trash-alt"></i> Xóa</button> </div> </td> </tr> <tr data-id="HD003" data-employee-value="NV003" data-type="KXĐTH" data-sign-date="2023-06-01" data-start-date="2023-06-01" data-end-date="N/A" data-salary="25,000,000 VND" data-notes="" data-code="HD003"> <td data-label="Số HĐ">HD003</td> <td data-label="Nhân viên">Lê Minh Cường</td> <td data-label="Loại HĐ">KXĐTH</td> <td data-label="Ngày ký">2023-06-01</td> <td data-label="Ngày hiệu lực">2023-06-01</td> <td data-label="Ngày hết hạn">N/A</td> <td data-label="Trạng thái"><span style="color: green;">Còn hiệu lực</span></td> <td> <div class="action-buttons"> <button class="table-action-btn btn-view-edit" data-id="HD003"><i class="fas fa-edit"></i> Xem/Sửa</button> <button class="table-action-btn btn-delete btn-delete-contract" data-id="HD003"><i class="fas fa-trash-alt"></i> Xóa</button> </div> </td> </tr> </tbody> </table> </div>
  `,

    'thu-tuc': `
     <div class="header"> <h1>3. Quản lý các Thủ tục Nhân sự</h1> <p class="sub">Tạo quyết định, ghi nhận nghỉ việc...</p> </div>
    <button class="main-action-btn" data-action="show-procedure-form" data-type="decision"><i class="fas fa-plus"></i> Tạo Quyết định</button>
    <button class="main-action-btn delete" data-action="show-procedure-form" data-type="termination"><i class="fas fa-user-minus"></i> Ghi nhận Nghỉ việc</button>

    <div id="decision-form-container" class="hidden-form procedure-form"> <h3 id="decision-form-title">Tạo Quyết định Nhân sự</h3> <form id="decision-form" class="form-area"> <div class="form-row"> <div class="form-group"><label>Loại Quyết định:</label><select id="decision-type" required><option value="Bổ nhiệm">Bổ nhiệm</option><option value="Miễn nhiệm">Miễn nhiệm</option><option value="Thuyên chuyển">Thuyên chuyển</option><option value="Tăng lương">Tăng lương</option><option value="Điều chỉnh chức danh">Điều chỉnh chức danh</option></select></div> <div class="form-group"><label>Nhân viên:</label><select id="decision-employee" required><option value="">-- Chọn NV --</option><option value="NV001">NV001 - Nguyễn Văn An</option><option value="NV002">NV002 - Trần Thị Bích</option><option value="NV003">NV003 - Lê Minh Cường</option></select></div> <div class="form-group"><label>Ngày hiệu lực:</label><input type="date" id="decision-date" required></div> </div> <div class="form-group"><label>Nội dung/Lý do:</label><textarea id="decision-reason" rows="3" required></textarea></div> <div class="form-group"><label>Số Quyết Định:</label><input type="text" id="decision-code" placeholder="VD: QĐ-BN/2025/01" required></div> <button type="submit" class="submit-btn"><i class="fas fa-plus"></i> Tạo Quyết định</button> <button type="button" class="submit-btn cancel-btn" data-action="hide-procedure-forms">Hủy</button> </form> </div>
    <div id="termination-form-container" class="hidden-form procedure-form"> <h3 id="termination-form-title">Ghi nhận Thông tin Nghỉ việc</h3> <form id="termination-form" class="form-area"> <div class="form-row"> <div class="form-group"><label>Nhân viên:</label><select id="termination-employee" required><option value="">-- Chọn NV --</option><option value="NV001">NV001 - Nguyễn Văn An</option><option value="NV002">NV002 - Trần Thị Bích</option><option value="NV003">NV003 - Lê Minh Cường</option></select></div> <div class="form-group"><label>Ngày nộp đơn:</label><input type="date" id="termination-apply-date"></div> <div class="form-group"><label>Ngày nghỉ chính thức:</label><input type="date" id="termination-date" required></div> </div> <div class="form-group"><label>Lý do nghỉ việc:</label><textarea id="termination-reason" rows="2"></textarea></div> <div class="form-group"><label>Trạng thái bàn giao:</label><select id="termination-status"><option value="Chưa bắt đầu">Chưa bắt đầu</option><option value="Đang bàn giao">Đang bàn giao</option><option value="Đã hoàn tất">Đã hoàn tất</option></select></div> <button type="submit" class="submit-btn"><i class="fas fa-plus"></i> Ghi nhận Nghỉ việc</button> <button type="button" class="submit-btn cancel-btn" data-action="hide-procedure-forms">Hủy</button> </form> </div>

    <div style="margin-top: 30px;"> <h3 id="decision-list-header">Danh sách Quyết định</h3> <div class="table-responsive-wrapper"> <table id="decision-list-table"> <thead><tr><th>Số QĐ</th><th>Loại QĐ</th><th>Nhân viên</th><th>Ngày hiệu lực</th><th>Nội dung</th></tr></thead> <tbody id="decision-list-body"></tbody> </table> </div> </div>
    <div style="margin-top: 30px;"> <h3 id="termination-list-header">Danh sách Nghỉ việc</h3> <div class="table-responsive-wrapper"> <table id="termination-list-table"> <thead><tr><th>Nhân viên</th><th>Ngày nộp đơn</th><th>Ngày nghỉ</th><th>Lý do</th><th>Trạng thái bàn giao</th></tr></thead> <tbody id="termination-list-body"></tbody> </table> </div> </div>
    `,
    'khen-thuong-ky-luat': `
     <div class="header"> <h1>4. Quản lý Khen thưởng & Kỷ luật</h1> <p class="sub">Thêm mới các quyết định khen thưởng, kỷ luật</p> </div>
    <button class="main-action-btn btn-add" data-action="show-ktkl-form" data-type="reward"><i class="fas fa-plus-circle"></i> Thêm Khen thưởng</button>
    <button class="main-action-btn delete" data-action="show-ktkl-form" data-type="discipline"><i class="fas fa-exclamation-triangle"></i> Thêm Kỷ luật</button>

     <div id="reward-form-container" class="hidden-form reward-discipline-form"> <h3>Thêm Quyết định Khen thưởng</h3> <form id="reward-form" class="form-area"> <div class="form-row"> <div class="form-group"><label>Nhân viên:</label><select id="reward-employee" required><option value="">-- Chọn NV --</option><option value="NV001">NV001 - Nguyễn Văn An</option><option value="NV002">NV002 - Trần Thị Bích</option><option value="NV003">NV003 - Lê Minh Cường</option></select></div> <div class="form-group"><label>Ngày Quyết định:</label><input type="date" id="reward-date" required></div> <div class="form-group"><label>Hình thức:</label><input type="text" id="reward-type" placeholder="VD: Thưởng nóng..."></div> </div> <div class="form-group"><label>Lý do/Thành tích:</label><textarea id="reward-reason" rows="3" required></textarea></div> <div class="form-group"><label>Số QĐ:</label><input type="text" id="reward-code" placeholder="VD: QĐKT/2025/01" required></div> <div class="form-group"><label>Mức thưởng (nếu có):</label><input type="text" id="reward-amount" placeholder="VD: 1.000.000 VNĐ"></div> <button type="submit" class="submit-btn"><i class="fas fa-plus"></i> Thêm Khen thưởng</button> <button type="button" class="submit-btn cancel-btn" data-action="hide-ktkl-forms">Hủy</button> </form> </div>
     <div id="discipline-form-container" class="hidden-form reward-discipline-form"> <h3>Thêm Quyết định/Biên bản Kỷ luật</h3> <form id="discipline-form" class="form-area"> <div class="form-row"> <div class="form-group"><label>Nhân viên:</label><select id="discipline-employee" required><option value="">-- Chọn NV --</option><option value="NV001">NV001 - Nguyễn Văn An</option><option value="NV002">NV002 - Trần Thị Bích</option><option value="NV003">NV003 - Lê Minh Cường</option></select></div> <div class="form-group"><label>Ngày xảy ra/Quyết định:</label><input type="date" id="discipline-date" required></div> <div class="form-group"><label>Hình thức kỷ luật:</label><select id="discipline-type" required><option value="">-- Chọn hình thức --</option><option value="Nhắc nhở">Nhắc nhở</option><option value="Khiển trách">Khiển trách</option><option value="Kéo dài thời hạn nâng lương">Kéo dài thời hạn nâng lương</option><option value="Cách chức">Cách chức</option><option value="Sa thải">Sa thải</option></select></div> </div> <div class="form-group"><label>Lý do/Vi phạm:</label><textarea id="discipline-reason" rows="3" required></textarea></div> <div class="form-group"><label>Số QĐ/BB:</label><input type="text" id="discipline-code" placeholder="VD: BBKL/2025/01" required></div> <button type="submit" class="submit-btn delete"><i class="fas fa-plus"></i> Thêm Kỷ luật</button> <button type="button" class="submit-btn cancel-btn" data-action="hide-ktkl-forms">Hủy</button> </form> </div>

    <h3 style="margin-top: 30px;">Danh sách Khen thưởng</h3> <div class="table-responsive-wrapper"> <table id="reward-list-table"> <thead> <tr> <th>Số QĐ</th> <th>Nhân viên</th> <th>Ngày QĐ</th> <th>Hình thức</th> <th>Lý do/Thành tích</th> </tr> </thead> <tbody id="reward-list-body"></tbody> </table> </div>
    <h3 style="margin-top: 30px;">Danh sách Kỷ luật</h3> <div class="table-responsive-wrapper"> <table id="discipline-list-table"> <thead> <tr> <th>Số QĐ/BB</th> <th>Nhân viên</th> <th>Ngày</th> <th>Hình thức</th> <th>Lý do/Vi phạm</th> </tr> </thead> <tbody id="discipline-list-body"></tbody> </table> </div>
    `,
    'bao-cao': `
     <div class="header"> <h1>5. Báo cáo Thống kê Nhân sự</h1> <p class="sub">Tổng hợp và phân tích dữ liệu nhân sự theo thời gian</p> </div>
     <p>Chọn loại báo cáo bạn muốn xem:</p>
    <div class="report-buttons"> <button class="main-action-btn" data-report-type="tong-hop"><i class="fas fa-users"></i> Tổng hợp cơ cấu</button> <button class="main-action-btn" data-report-type="bien-dong"><i class="fas fa-exchange-alt"></i> Biến động NS</button> <button class="main-action-btn" data-report-type="luong-thuong"><i class="fas fa-coins"></i> Lương/Thưởng</button> <button class="main-action-btn" data-report-type="ky-luat"><i class="fas fa-exclamation-triangle"></i> Kỷ luật</button> </div>
    <div id="report-filters" class="form-area"> <div class="form-group"> <label>Từ ngày:</label> <input type="date" id="report-start-date"> </div> <div class="form-group"> <label>Đến ngày:</label> <input type="date" id="report-end-date"> </div> <div class="form-group"> <label>Phòng ban:</label> <select id="report-department"> <option value="">Tất cả</option> <option value="Kinh Doanh">Kinh Doanh</option> <option value="Kỹ Thuật">Kỹ Thuật</option><option value="Nhân sự">Nhân sự</option> </select> </div> <button class="submit-btn" id="btn-generate-report"><i class="fas fa-eye"></i> Xem báo cáo</button> </div>
    <div id="report-area"> <h3>Kết quả Báo cáo</h3> <div id="report-results-container"> <p><i>Chọn loại báo cáo, đặt bộ lọc và nhấn "Xem báo cáo"...</i></p> </div> <canvas id="reportChart" width="400" height="200" style="display: none; margin-top: 20px;"></canvas> </div>
    `,
}
// --- Mảng lưu trữ các hàm hủy listener của trang hiện tại ---

// sửa

let currentPageCleanupFunctions = [];

// --- Hàm dọn dẹp listener cũ ---
function cleanupPageEventListeners() {
    currentPageCleanupFunctions.forEach(cleanup => {
        try {
            cleanup();
        } catch (e) {}
    });
    currentPageCleanupFunctions = [];
}

// --- Hàm tiện ích để thêm listener và đăng ký hàm hủy ---
function addManagedEventListener(element, type, listener) {
    if (!element) return;
    element.addEventListener(type, listener);
    currentPageCleanupFunctions.push(() => {
        try {
            element.removeEventListener(type, listener);
        } catch (e) {}
    });
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

    // sửa
    if (pages[page]) {
        mainContent.innerHTML = pages[page];
        console.log(`LOAD PAGE: Rendered HTML for page "${page}".`);
        try {
            // Gọi hàm bind sự kiện tường minh
            if (page === 'ho-so') bindHoSoPageEvents();
            else if (page === 'hop-dong') bindHopDongPageEvents();
            else if (page === 'thu-tuc') bindThuTucPageEvents();
            else if (page === 'khen-thuong-ky-luat') bindKTKLPageEvents();
            else if (page === 'bao-cao') bindBaoCaoPageEvents();

            console.log(`LOAD PAGE SUCCESS: Events bound for page "${page}".`);
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


// --- Các hàm bind sự kiện cho từng trang (Vẫn giữ logic V6/V7.1) ---

function bindHoSoPageEvents() {
    console.log("Binding HoSo events...");
    const mainContent = document.getElementById('main-content');
    const btnShowAddForm = mainContent?.querySelector('#btn-show-add-employee-form');
    const employeeFormContainer = mainContent?.querySelector('#employee-form-container');
    const btnCancel = mainContent?.querySelector('#btn-cancel-employee-form');
    const employeeForm = mainContent?.querySelector('#employee-form');
    const employeeTableBody = mainContent?.querySelector('#employee-list-body');

    if (!employeeFormContainer || !employeeTableBody || !employeeForm || !btnShowAddForm || !btnCancel) {
        console.error("HoSo page elements missing! Cannot bind events.");
        return; // Dừng nếu thiếu element
    }

    employeeFormContainer.style.display = 'none';

    addManagedEventListener(btnShowAddForm, 'click', () => {
        const formTitle = document.getElementById('employee-form-title');
        const employeeIdInput = document.getElementById('employee-id');
        employeeForm.reset();
        if (formTitle) formTitle.textContent = 'Thêm Nhân viên Mới';
        if (employeeIdInput) employeeIdInput.value = '';
        employeeFormContainer.style.display = 'block';
        btnShowAddForm.style.display = 'none';
        window.scrollTo(0, 0);
        employeeFormContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
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
        const ngaySinh = document.getElementById('ngay-sinh')?.value || '';
        const gioiTinh = document.getElementById('gioi-tinh')?.value || '';
        const phongBan = document.getElementById('phong-ban')?.value || '';
        const viTri = document.getElementById('vi-tri')?.value || '';
        const cmnd = document.getElementById('cmnd-cccd')?.value || '';
        const lienhe = document.getElementById('lien-he')?.value || '';
        const diachi = document.getElementById('dia-chi')?.value || '';
        const trinhdo = document.getElementById('trinh-do-hoc-van')?.value || '';
        const chungchi = document.getElementById('chung-chi')?.value || '';
        const ngayvaolam = document.getElementById('ngay-vao-lam')?.value || '';


        if (employeeId) { // Sửa
            alert(`Đã CẬP NHẬT thông tin cho nhân viên: ${hoTen} (ID: ${employeeId})!\n(Mô phỏng)`);
            const rowToUpdate = employeeTableBody.querySelector(`tr[data-id="${employeeId}"]`);
            if (rowToUpdate) {
                rowToUpdate.cells[1].textContent = hoTen;
                rowToUpdate.cells[2].textContent = ngaySinh;
                rowToUpdate.cells[3].textContent = gioiTinh;
                rowToUpdate.cells[4].textContent = phongBan;
                rowToUpdate.cells[5].textContent = viTri;
                rowToUpdate.dataset.name = hoTen;
                rowToUpdate.dataset.cmnd = cmnd;
                rowToUpdate.dataset.lienhe = lienhe;
                rowToUpdate.dataset.diachi = diachi;
                rowToUpdate.dataset.trinhdo = trinhdo;
                rowToUpdate.dataset.chungchi = chungchi;
                rowToUpdate.dataset.ngayvaolam = ngayvaolam;
                const editButton = rowToUpdate.querySelector('.btn-view-edit');
                if (editButton) editButton.dataset.name = hoTen;
            } else {
                console.warn("Row to update not found:", employeeId);
            }
        } else { // Thêm
            const newId = `NV${Date.now().toString().slice(-4)}`;
            alert(`Đã THÊM MỚI nhân viên: ${hoTen} (ID tạm: ${newId})!\n(Mô phỏng)`);
            const dataAttrs = `data-id="${newId}" data-cmnd="${cmnd}" data-lienhe="${lienhe}" data-diachi="${diachi}" data-trinhdo="${trinhdo}" data-chungchi="${chungchi}" data-ngayvaolam="${ngayvaolam}"`;
            const newRowHTML = `
                    <tr ${dataAttrs}>
                        <td>${newId}</td> <td>${hoTen}</td> <td>${ngaySinh}</td> <td>${gioiTinh}</td> <td>${phongBan}</td> <td>${viTri}</td>
                        <td> <div class="action-buttons"> <button class="table-action-btn btn-view-edit" data-id="${newId}" data-name="${hoTen}"><i class="fas fa-edit"></i> Xem/Sửa</button> <button class="table-action-btn btn-delete" data-id="${newId}"><i class="fas fa-trash-alt"></i> Xóa</button> </div> </td>
                    </tr>`;
            employeeTableBody.insertAdjacentHTML('beforeend', newRowHTML);

        }
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

        // Lấy dữ liệu từ data-* attributes của hàng TR
        document.getElementById('ho-ten').value = row.cells[1]?.textContent || '';
        document.getElementById('ngay-sinh').value = row.cells[2]?.textContent || '';
        document.getElementById('gioi-tinh').value = row.cells[3]?.textContent || 'Nam';
        document.getElementById('phong-ban').value = row.cells[4]?.textContent || '';
        document.getElementById('vi-tri').value = row.cells[5]?.textContent || '';
        document.getElementById('cmnd-cccd').value = row.dataset.cmnd || '';
        document.getElementById('lien-he').value = row.dataset.lienhe || '';
        document.getElementById('dia-chi').value = row.dataset.diachi || '';
        document.getElementById('trinh-do-hoc-van').value = row.dataset.trinhdo || '';
        document.getElementById('chung-chi').value = row.dataset.chungchi || '';
        document.getElementById('ngay-vao-lam').value = row.dataset.ngayvaolam || '';

        employeeFormContainer.style.display = 'block';
        btnShowAddForm.style.display = 'none';
        window.scrollTo(0, 0);
        employeeFormContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

    } else if (targetButton.classList.contains('btn-delete')) {
        console.log("Delete button clicked for Employee:", employeeId);
        if (confirm(`Bạn có chắc chắn muốn xóa hồ sơ nhân viên ${employeeName} (ID: ${employeeId})?`)) {
            alert(`Đã XÓA nhân viên ${employeeId}.\n(Mô phỏng frontend)`);
            row.remove();
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

    if (!contractFormContainer || !contractTableBody || !contractForm || !btnShowAddForm || !btnCancel) {
        console.error("HopDong page elements missing! Cannot bind events.");
        return;
    }
    contractFormContainer.style.display = 'none';

    addManagedEventListener(btnShowAddForm, 'click', () => {
        const formTitle = document.getElementById('contract-form-title');
        const contractIdInput = document.getElementById('contract-id');
        contractForm.reset();
        if (formTitle) formTitle.textContent = 'Tạo Hợp đồng Mới';
        if (contractIdInput) contractIdInput.value = '';
        contractFormContainer.style.display = 'block';
        btnShowAddForm.style.display = 'none';
        window.scrollTo(0, 0);
        contractFormContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
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
        const type = document.getElementById('contract-type')?.value || 'N/A';
        const code = document.getElementById('contract-code')?.value || `HD${Date.now().toString().slice(-4)}`;
        const signDate = document.getElementById('contract-sign-date')?.value || '';
        const startDate = document.getElementById('contract-start-date')?.value || '';
        const endDate = document.getElementById('contract-end-date')?.value || 'N/A';
        const salary = document.getElementById('contract-salary')?.value || '';
        const notes = document.getElementById('contract-notes')?.value || '';

        if (contractId) { // Sửa
            alert(`Đã CẬP NHẬT hợp đồng ID: ${contractId} cho ${employeeText}!\n(Mô phỏng)`);
            const rowToUpdate = contractTableBody.querySelector(`tr[data-id="${contractId}"]`);
            if (rowToUpdate) {
                rowToUpdate.cells[0].textContent = code;
                rowToUpdate.cells[1].textContent = employeeText;
                rowToUpdate.cells[2].textContent = type;
                rowToUpdate.cells[3].textContent = signDate;
                rowToUpdate.cells[4].textContent = startDate;
                rowToUpdate.cells[5].textContent = endDate;
                rowToUpdate.dataset.employeeValue = employeeValue;
                rowToUpdate.dataset.type = type;
                rowToUpdate.dataset.signDate = signDate;
                rowToUpdate.dataset.startDate = startDate;
                rowToUpdate.dataset.endDate = endDate;
                rowToUpdate.dataset.salary = salary;
                rowToUpdate.dataset.notes = notes;
                rowToUpdate.dataset.code = code;
            } else {
                console.warn("Row to update not found:", contractId);
            }
        } else { // Thêm
            alert(`Đã THÊM MỚI hợp đồng ${code} loại "${type}" cho ${employeeText}!\n(Mô phỏng)`);
            const dataAttrs = `data-id="${code}" data-employee-value="${employeeValue}" data-type="${type}" data-sign-date="${signDate}" data-start-date="${startDate}" data-end-date="${endDate}" data-salary="${salary}" data-notes="${notes}" data-code="${code}"`;
            const newRowHTML = `
                <tr ${dataAttrs}>
                    <td data-label="Số HĐ">${code}</td> <td data-label="Nhân viên">${employeeText}</td> <td data-label="Loại HĐ">${type}</td> <td data-label="Ngày ký">${signDate}</td> <td data-label="Ngày hiệu lực">${startDate}</td> <td data-label="Ngày hết hạn">${endDate}</td> <td data-label="Trạng thái"><span style="color: green;">Mới tạo</span></td>
                    <td> <div class="action-buttons"> <button class="table-action-btn btn-view-edit" data-id="${code}"><i class="fas fa-edit"></i> Xem/Sửa</button> <button class="table-action-btn btn-other" data-id="${code}" data-action="renew"><i class="fas fa-sync-alt"></i> Gia hạn</button> <button class="table-action-btn btn-delete btn-delete-contract" data-id="${code}"><i class="fas fa-trash-alt"></i> Xóa</button> </div> </td>
                </tr>`;
            contractTableBody.insertAdjacentHTML('beforeend', newRowHTML);
        }
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
    const action = targetButton.dataset.action;

    if (targetButton.classList.contains('btn-delete-contract')) {
        if (confirm(`Bạn chắc chắn muốn xóa hợp đồng ${contractId}?`)) {
            alert(`Đã XÓA hợp đồng ${contractId}.\n(Mô phỏng frontend)`);
            row.remove();
        }
    } else if (action === 'renew') {
        alert(`Yêu cầu GIA HẠN hợp đồng ${contractId}.\n(Mô phỏng frontend)`);
    } else if (action === 'sign-official') {
        alert(`Yêu cầu KÝ HĐ CHÍNH THỨC sau thử việc (HĐ gốc ${contractId}).\n(Mô phỏng frontend)`);
        document.getElementById('btn-show-add-contract-form')?.click();
    } else { // Xem/Sửa
        console.log("Edit contract clicked:", contractId);
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
        formTitle.textContent = `Sửa Hợp đồng: ${contractId}`;
        contractIdInput.value = contractId;

        document.getElementById('contract-code').value = row.dataset.code || row.cells[0]?.textContent || contractId;
        document.getElementById('contract-employee').value = row.dataset.employeeValue || '';
        document.getElementById('contract-type').value = row.dataset.type || '';
        document.getElementById('contract-sign-date').value = row.dataset.signDate || '';
        document.getElementById('contract-start-date').value = row.dataset.startDate || '';
        document.getElementById('contract-end-date').value = row.dataset.endDate === 'N/A' ? '' : (row.dataset.endDate || '');
        document.getElementById('contract-salary').value = row.dataset.salary || '';
        document.getElementById('contract-notes').value = row.dataset.notes || '';

        contractFormContainer.style.display = 'block';
        btnShowAddForm.style.display = 'none';
        window.scrollTo(0, 0);
        contractFormContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}


// --- Helper functions for Thủ Tục & KTKL (Đã kiểm tra lại) ---
// !!! THAY THẾ các hàm helper này !!!
function hideProcedureForms() {
    console.log("Hiding procedure forms...");
    document.querySelectorAll('#thu-tuc .procedure-form').forEach(form => { // Thêm selector #thu-tuc để đảm bảo chỉ ẩn form trong trang này
        if (form) form.style.display = 'none';
    });
}

function showProcedureForm(formType) {
    console.log(`Attempting to show procedure form: ${formType}`);
    hideProcedureForms();
    const formContainerId = `${formType}-form-container`;
    const formContainer = document.getElementById(formContainerId);
    const form = formContainer?.querySelector('form');

    if (formContainer && form) {
        form.reset();
        const titleElement = formContainer.querySelector('h3');
        const actionText = `Tạo ${formType === 'decision' ? 'Quyết định' : 'Nghỉ việc'} Mới`;
        if (titleElement) titleElement.textContent = actionText;
        formContainer.style.display = 'block';
        formContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        form.querySelector('input, select, textarea')?.focus();
        console.log(`Form ${formContainerId} displayed.`);
    } else {
        console.error(`Could not find form container or form for procedure type: ${formType} (ID: ${formContainerId})`);
        alert(`Lỗi: Không tìm thấy form cho ${formType}`);
    }
}

function hideRewardDisciplineForms() {
    console.log("Hiding KTKL forms...");
    document.querySelectorAll('#khen-thuong-ky-luat .reward-discipline-form').forEach(form => { // Thêm selector #khen-thuong-ky-luat
        if (form) form.style.display = 'none';
    });
}

function showRewardDisciplineForm(formType) {
    console.log(`Attempting to show KTKL form: ${formType}`);
    hideRewardDisciplineForms();
    const formContainerId = `${formType}-form-container`;
    const formContainer = document.getElementById(formContainerId);
    const form = formContainer?.querySelector('form');

    if (formContainer && form) {
        form.reset();
        const titleElement = formContainer.querySelector('h3');
        const typeText = formType === 'reward' ? 'Khen thưởng' : 'Kỷ luật';
        if (titleElement) titleElement.textContent = `Thêm ${typeText} Mới`;
        formContainer.style.display = 'block';
        formContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        form.querySelector('select, input, textarea')?.focus();
        console.log(`Form ${formContainerId} displayed.`);
    } else {
        console.error(`Could not find form container or form for KTKL type: ${formType} (ID: ${formContainerId})`);
        alert(`Lỗi: Không tìm thấy form cho ${formType}`);
    }
}

function handleSubmitDecisionForm(event) {
    event.preventDefault();
    console.log("Form Tạo Quyết định đã được submit!");
    // Lấy dữ liệu từ các trường form
    const decisionType = document.getElementById('decision-type').value;
    const decisionEmployee = document.getElementById('decision-employee').value;
    const decisionDate = document.getElementById('decision-date').value;
    const decisionReason = document.getElementById('decision-reason').value;
    const decisionCode = document.getElementById('decision-code').value;

    console.log("Dữ liệu quyết định:", {
        type: decisionType,
        employee: decisionEmployee,
        date: decisionDate,
        reason: decisionReason,
        code: decisionCode
    });

    // THÊM LOGIC XỬ LÝ DỮ LIỆU CỦA BẠN Ở ĐÂY
    alert("Đã tạo quyết định!");
    document.getElementById('decision-form').reset(); // Reset form sau khi submit
    document.querySelector('#decision-form-container').style.display = 'none';
    document.querySelector('[data-action="show-procedure-form"][data-type="decision"]').style.display = 'inline-block';
}

function handleSubmitTerminationForm(event) {
    event.preventDefault();
    console.log("Form Ghi nhận Nghỉ việc đã được submit!");
    // Lấy dữ liệu từ các trường form
    const terminationEmployee = document.getElementById('termination-employee').value;
    const terminationApplyDate = document.getElementById('termination-apply-date').value;
    const terminationDate = document.getElementById('termination-date').value;
    const terminationReason = document.getElementById('termination-reason').value;
    const terminationStatus = document.getElementById('termination-status').value;

    console.log("Dữ liệu nghỉ việc:", {
        employee: terminationEmployee,
        applyDate: terminationApplyDate,
        date: terminationDate,
        reason: terminationReason,
        status: terminationStatus
    });

    // THÊM LOGIC XỬ LÝ DỮ LIỆU CỦA BẠN Ở ĐÂY
    alert("Đã ghi nhận nghỉ việc!");
    document.getElementById('termination-form').reset();
    document.querySelector('#termination-form-container').style.display = 'none';
    document.querySelector('[data-action="show-procedure-form"][data-type="termination"]').style.display = 'inline-block';
}

function handleSubmitRewardForm(event) {
    event.preventDefault();
    console.log("Form Thêm Khen thưởng đã được submit!");
    // Lấy dữ liệu từ các trường form
    const rewardEmployee = document.getElementById('reward-employee').value;
    const rewardDate = document.getElementById('reward-date').value;
    const rewardType = document.getElementById('reward-type').value;
    const rewardReason = document.getElementById('reward-reason').value;
    const rewardCode = document.getElementById('reward-code').value;
    const rewardAmount = document.getElementById('reward-amount').value;

    console.log("Dữ liệu khen thưởng:", {
        employee: rewardEmployee,
        date: rewardDate,
        type: rewardType,
        reason: rewardReason,
        code: rewardCode,
        amount: rewardAmount
    });

    // THÊM LOGIC XỬ LÝ DỮ LIỆU CỦA BẠN Ở ĐÂY
    alert("Đã thêm khen thưởng!");
    document.getElementById('reward-form').reset();
    document.querySelector('#reward-form-container').style.display = 'none';
    document.querySelector('[data-action="show-ktkl-form"][data-type="reward"]').style.display = 'inline-block';
}

function handleSubmitDisciplineForm(event) {
    event.preventDefault();
    console.log("Form Thêm Kỷ luật đã được submit!");
    // Lấy dữ liệu từ các trường form
    const disciplineEmployee = document.getElementById('discipline-employee').value;
    const disciplineDate = document.getElementById('discipline-date').value;
    const disciplineType = document.getElementById('discipline-type').value;
    const disciplineReason = document.getElementById('discipline-reason').value;
    const disciplineCode = document.getElementById('discipline-code').value;

    console.log("Dữ liệu kỷ luật:", {
        employee: disciplineEmployee,
        date: disciplineDate,
        type: disciplineType,
        reason: disciplineReason,
        code: disciplineCode
    });

    // THÊM LOGIC XỬ LÝ DỮ LIỆU CỦA BẠN Ở ĐÂY
    alert("Đã thêm kỷ luật!");
    document.getElementById('discipline-form').reset();
    document.querySelector('#discipline-form-container').style.display = 'none';
    document.querySelector('[data-action="show-ktkl-form"][data-type="discipline"]').style.display = 'inline-block';
}

function bindThuTucPageEvents() {
    console.log("Binding ThuTuc events...");
    const decisionForm = document.getElementById('decision-form');
    const terminationForm = document.getElementById('termination-form');
    const showProcedureFormButtons = document.querySelectorAll('[data-action="show-procedure-form"]');
    const hideProcedureFormButtons = document.querySelectorAll('[data-action="hide-procedure-forms"]');
    const decisionFormContainer = document.getElementById('decision-form-container');
    const terminationFormContainer = document.getElementById('termination-form-container');

    if (decisionForm) {
        addManagedEventListener(decisionForm, 'submit', handleSubmitDecisionForm);
    } else {
        console.error("Không tìm thấy form 'decision-form'");
    }

    if (terminationForm) {
        addManagedEventListener(terminationForm, 'submit', handleSubmitTerminationForm);
    } else {
        console.error("Không tìm thấy form 'termination-form'");
    }

    showProcedureFormButtons.forEach(button => {
        addManagedEventListener(button, 'click', function() {
            const type = this.dataset.type;
            if (type === 'decision' && decisionFormContainer) {
                decisionFormContainer.style.display = 'block';
                terminationFormContainer.style.display = 'none';
                document.querySelector('[data-action="show-procedure-form"][data-type="decision"]').style.display = 'none';
                if (document.getElementById('decision-form-title')) {
                    document.getElementById('decision-form-title').textContent = 'Tạo Quyết định Nhân sự';
                }
                document.getElementById('decision-form')?.reset();
                window.scrollTo(0, 0);
                decisionFormContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else if (type === 'termination' && terminationFormContainer) {
                terminationFormContainer.style.display = 'block';
                decisionFormContainer.style.display = 'none';
                document.querySelector('[data-action="show-procedure-form"][data-type="termination"]').style.display = 'none';
                if (document.getElementById('termination-form-title')) {
                    document.getElementById('termination-form-title').textContent = 'Ghi nhận Thông tin Nghỉ việc';
                }
                document.getElementById('termination-form')?.reset();
                window.scrollTo(0, 0);
                terminationFormContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    hideProcedureFormButtons.forEach(button => {
        addManagedEventListener(button, 'click', function() {
            decisionFormContainer.style.display = 'none';
            terminationFormContainer.style.display = 'none';
            document.querySelector('[data-action="show-procedure-form"][data-type="decision"]').style.display = 'inline-block';
            document.querySelector('[data-action="show-procedure-form"][data-type="termination"]').style.display = 'inline-block';
            document.getElementById('decision-form')?.reset();
            document.getElementById('termination-form')?.reset();
        });
    });
}


/**
 * Gắn các sự kiện cho trang Khen thưởng - Kỷ luật (Chỉ Thêm - Đã sửa lỗi)
 * !!! THAY THẾ TOÀN BỘ HÀM NÀY !!!
 */
function bindKTKLPageEvents() {
    console.log("Binding KTKL events...");
    const rewardForm = document.getElementById('reward-form');
    const disciplineForm = document.getElementById('discipline-form');
    const showKTKLFormButtons = document.querySelectorAll('[data-action="show-ktkl-form"]');
    const hideKTKLFormButtons = document.querySelectorAll('[data-action="hide-ktkl-forms"]');
    const rewardFormContainer = document.getElementById('reward-form-container');
    const disciplineFormContainer = document.getElementById('discipline-form-container');

    if (rewardForm) {
        addManagedEventListener(rewardForm, 'submit', handleSubmitRewardForm);
    } else {
        console.error("Không tìm thấy form 'reward-form'");
    }

    if (disciplineForm) {
        addManagedEventListener(disciplineForm, 'submit', handleSubmitDisciplineForm);
    } else {
        console.error("Không tìm thấy form 'discipline-form'");
    }

    showKTKLFormButtons.forEach(button => {
        addManagedEventListener(button, 'click', function() {
            const type = this.dataset.type;
            if (type === 'reward' && rewardFormContainer) {
                rewardFormContainer.style.display = 'block';
                disciplineFormContainer.style.display = 'none';
                document.querySelector('[data-action="show-ktkl-form"][data-type="reward"]').style.display = 'none';
                if (document.querySelector('#reward-form-container h3')) {
                    document.querySelector('#reward-form-container h3').textContent = 'Thêm Quyết định Khen thưởng';
                }
                document.getElementById('reward-form')?.reset();
                window.scrollTo(0, 0);
                rewardFormContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else if (type === 'discipline' && disciplineFormContainer) {
                disciplineFormContainer.style.display = 'block';
                rewardFormContainer.style.display = 'none';
                document.querySelector('[data-action="show-ktkl-form"][data-type="discipline"]').style.display = 'none';
                if (document.querySelector('#discipline-form-container h3')) {
                    document.querySelector('#discipline-form-container h3').textContent = 'Thêm Quyết định/Biên bản Kỷ luật';
                }
                document.getElementById('discipline-form')?.reset();
                window.scrollTo(0, 0);
                disciplineFormContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    hideKTKLFormButtons.forEach(button => {
        addManagedEventListener(button, 'click', function() {
            rewardFormContainer.style.display = 'none';
            disciplineFormContainer.style.display = 'none';
            document.querySelector('[data-action="show-ktkl-form"][data-type="reward"]').style.display = 'inline-block';
            document.querySelector('[data-action="show-ktkl-form"][data-type="discipline"]').style.display = 'inline-block';
            document.getElementById('reward-form')?.reset();
            document.getElementById('discipline-form')?.reset();
        });
    });
}

// --- CÁC HÀM HELPER (show/hide form) ---
// !!! Đảm bảo bạn có các hàm này trong file scripts.js !!!
function hideProcedureForms() {
    console.log("Hiding procedure forms...");
    document.querySelectorAll('#thu-tuc .procedure-form').forEach(form => {
        if (form) form.style.display = 'none';
    });
}

function showProcedureForm(formType) {
    console.log(`Attempting to show procedure form: ${formType}`);
    hideProcedureForms();
    const formContainerId = `${formType}-form-container`;
    const formContainer = document.getElementById(formContainerId);
    const form = formContainer?.querySelector('form');

    if (formContainer && form) {
        form.reset();
        const titleElement = formContainer.querySelector('h3');
        const actionText = `Tạo ${formType === 'decision' ? 'Quyết định' : 'Nghỉ việc'} Mới`;
        if (titleElement) titleElement.textContent = actionText;
        formContainer.style.display = 'block';
        formContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        form.querySelector('input, select, textarea')?.focus();
        console.log(`Form ${formContainerId} displayed.`);
    } else {
        console.error(`Could not find form container or form for procedure type: ${formType} (ID: ${formContainerId})`);
        alert(`Lỗi: Không tìm thấy form cho ${formType}`);
    }
}

function hideRewardDisciplineForms() {
    console.log("Hiding KTKL forms...");
    document.querySelectorAll('#khen-thuong-ky-luat .reward-discipline-form').forEach(form => {
        if (form) form.style.display = 'none';
    });
}

function showRewardDisciplineForm(formType) {
    console.log(`Attempting to show KTKL form: ${formType}`);
    hideRewardDisciplineForms();
    const formContainerId = `${formType}-form-container`;
    const formContainer = document.getElementById(formContainerId);
    const form = formContainer?.querySelector('form');

    if (formContainer && form) {
        form.reset();
        const titleElement = formContainer.querySelector('h3');
        const typeText = formType === 'reward' ? 'Khen thưởng' : 'Kỷ luật';
        if (titleElement) titleElement.textContent = `Thêm ${typeText} Mới`;
        formContainer.style.display = 'block';
        formContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        form.querySelector('select, input, textarea')?.focus();
        console.log(`Form ${formContainerId} displayed.`);
    } else {
        console.error(`Could not find form container or form for KTKL type: ${formType} (ID: ${formContainerId})`);
        alert(`Lỗi: Không tìm thấy form cho ${formType}`);
    }
}

function bindBaoCaoPageEvents() {
    console.log("Binding BaoCao events...");
    const reportTypeButtons = document.querySelectorAll('.report-buttons button');
    const generateReportButton = document.getElementById('btn-generate-report');
    const reportFilters = document.getElementById('report-filters');
    const reportResultsContainer = document.getElementById('report-results-container');
    const reportChartCanvas = document.getElementById('reportChart');
    const reportStartDateInput = document.getElementById('report-start-date');
    const reportEndDateInput = document.getElementById('report-end-date');
    const reportDepartmentSelect = document.getElementById('report-department');

    if (reportFilters) {
        reportFilters.style.display = 'none'; // Ẩn bộ lọc ban đầu

        reportTypeButtons.forEach(button => {
            addManagedEventListener(button, 'click', function() {
                const reportType = this.dataset.reportType;
                console.log(`User selected report type: ${reportType}`);
                reportFilters.style.display = 'block'; // Hiển thị bộ lọc khi chọn loại báo cáo
                reportResultsContainer.innerHTML = `<p>Bạn đã chọn báo cáo "${reportType}". Vui lòng chọn bộ lọc và nhấn "Xem báo cáo".</p>`;
                if (reportChartCanvas) {
                    reportChartCanvas.style.display = 'none'; // Ẩn biểu đồ cũ nếu có
                }
                // Bạn có thể thêm logic để hiển thị/ẩn các bộ lọc cụ thể dựa trên loại báo cáo ở đây
            });
        });

        if (generateReportButton) {
            addManagedEventListener(generateReportButton, 'click', function() {
                console.log("Generate report button clicked!");
                if (reportStartDateInput && reportEndDateInput && reportDepartmentSelect && reportResultsContainer) {
                    const startDate = reportStartDateInput.value;
                    const endDate = reportEndDateInput.value;
                    const department = reportDepartmentSelect.value;

                    console.log("Report filters:", {
                        startDate,
                        endDate,
                        department
                    });

                    reportResultsContainer.innerHTML = `<p>Đang tải báo cáo với bộ lọc: Từ ${startDate}, Đến ${endDate}, Phòng ban: ${department}...</p>`;
                    if (reportChartCanvas) {
                        reportChartCanvas.style.display = 'none'; // Ẩn canvas trong khi tải

                        // **ĐÂY LÀ NƠI BẠN SẼ GỌI API HOẶC THỰC HIỆN LOGIC TẠO BÁO CÁO**
                        // Ví dụ (mô phỏng):
                        setTimeout(() => {
                            const reportData = {
                                type: "Tổng hợp cơ cấu",
                                filters: {
                                    startDate,
                                    endDate,
                                    department
                                },
                                results: [{
                                        department: "Kinh Doanh",
                                        employeeCount: 10
                                    },
                                    {
                                        department: "Kỹ Thuật",
                                        employeeCount: 15
                                    },
                                    {
                                        department: "Nhân sự",
                                        employeeCount: 5
                                    }
                                ]
                            };
                            displayReportResults(reportData); // Gọi hàm hiển thị kết quả
                        }, 1500);
                    } else {
                        // Nếu không có canvas, chỉ hiển thị dữ liệu dạng văn bản
                        setTimeout(() => {
                            const reportData = {
                                type: "Tổng hợp cơ cấu",
                                filters: {
                                    startDate,
                                    endDate,
                                    department
                                },
                                resultsText: "Báo cáo tổng hợp cơ cấu (mô phỏng): ... (dữ liệu văn bản)"
                            };
                            reportResultsContainer.innerHTML = `<p>${reportData.resultsText}</p>`;
                        }, 1500);
                    }
                } else {
                    console.error("Một hoặc nhiều phần tử bộ lọc/kết quả báo cáo không tìm thấy.");
                }
            });
        } else {
            console.error("Không tìm thấy nút 'Xem báo cáo'.");
        }
    } else {
        console.error("Không tìm thấy phần tử 'report-filters'.");
    }
}

// Hàm hiển thị kết quả báo cáo (ví dụ: dạng bảng hoặc vẽ biểu đồ)
function displayReportResults(data) {
    const reportResultsContainer = document.getElementById('report-results-container');
    const reportChartCanvas = document.getElementById('reportChart');

    if (reportResultsContainer) {
        let resultsHTML = `<h3>Kết quả báo cáo "${data.type}"</h3>`;
        resultsHTML += `<p>Bộ lọc: Từ ${data.filters.startDate || 'Không có'}, Đến ${data.filters.endDate || 'Không có'}, Phòng ban: ${data.filters.department || 'Tất cả'}</p>`;

        if (data.results && data.results.length > 0) {
            resultsHTML += `<table><thead><tr><th>Phòng ban</th><th>Số lượng nhân viên</th></tr></thead><tbody>`;
            data.results.forEach(item => {
                resultsHTML += `<tr><td>${item.department}</td><td>${item.employeeCount}</td></tr>`;
            });
            resultsHTML += `</tbody></table>`;
            reportResultsContainer.innerHTML = resultsHTML;

            // **ĐÂY LÀ NƠI BẠN SẼ VẼ BIỂU ĐỒ (NẾU CẦN)**
            if (reportChartCanvas && typeof Chart !== 'undefined') {
                reportChartCanvas.style.display = 'block';
                const labels = data.results.map(item => item.department);
                const values = data.results.map(item => item.employeeCount);
                const ctx = reportChartCanvas.getContext('2d');
                new Chart(ctx, {
                    type: 'bar', // Hoặc 'pie', 'line', ... tùy vào loại báo cáo
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Số lượng nhân viên',
                            data: values,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.6)',
                                'rgba(54, 162, 235, 0.6)',
                                'rgba(255, 206, 86, 0.6)',
                                // Thêm màu khác nếu có nhiều phòng ban hơn
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Số lượng'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Phòng ban'
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Biểu đồ Cơ cấu Nhân sự theo Phòng ban',
                                font: {
                                    size: 16
                                }
                            },
                            legend: {
                                display: false, // Ẩn chú giải nếu chỉ có một dataset
                            }
                        }
                    }
                });
            }
        } else {
            reportResultsContainer.innerHTML = `<p>Không có dữ liệu báo cáo phù hợp với tiêu chí đã chọn.</p>`;
            if (reportChartCanvas) {
                reportChartCanvas.style.display = 'none';
            }
        }
    }
}


// --- Khởi tạo và xử lý điều hướng (Giữ nguyên từ V7.1) ---
function setActiveSidebarLink(page) {
    // Thêm kiểm tra null cho nav-links
    const navLinksContainer = document.querySelector('.nav-links');
    if (!navLinksContainer) return;
    navLinksContainer.querySelectorAll('a').forEach(a => {
        a.classList.toggle("active", a.dataset.page === page);
    });
}

// sửa
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Initializing Navigation (V7.2 - Add Only)...");
    const mainContainer = document.querySelector('.main-content');
    if (!mainContainer) {
        console.error("Fatal Error: '.main-content' element not found!");
        return;
    }

    mainContainer.addEventListener('click', (event) => {
        // console.log("Navigation click detected."); // Giảm bớt log ở đây
        let pageToLoad = null;

        const sidebarLink = event.target.closest('.nav-links a[data-page]');
        const dashboardBox = event.target.closest('.action-box[data-page]');

        if (sidebarLink) {
            event.preventDefault();
            pageToLoad = sidebarLink.dataset.page;
            // console.log(`Sidebar link clicked: Target page = ${pageToLoad}`);
        } else if (dashboardBox) {
            pageToLoad = dashboardBox.dataset.page;
            // console.log(`Dashboard box clicked: Target page = ${pageToLoad}`);
        } else {
            return;
        }


        if (pageToLoad) {
            const correspondingSidebarLink = document.querySelector(`.nav-links a[data-page="${pageToLoad}"]`);
            if (correspondingSidebarLink && !correspondingSidebarLink.classList.contains('active')) {
                console.log(`Navigating to page: ${pageToLoad}`);
                setActiveSidebarLink(pageToLoad);
                loadPage(pageToLoad);
            } else if (!correspondingSidebarLink) {
                console.warn(`Sidebar link for page "${pageToLoad}" not found.`);
            } else {
                // console.log(`Page ${pageToLoad} is already active.`); // Bỏ log này cho đỡ rối
            }
        }
    });

    const initialPage = 'ho-so';
    console.log(`Loading initial page: ${initialPage}`);
    setActiveSidebarLink(initialPage);
    loadPage(initialPage);
});