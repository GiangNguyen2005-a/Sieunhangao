document.addEventListener("DOMContentLoaded", () => {
    // --- Các phần tử DOM ---
    const navLinks = document.querySelectorAll(".main-nav a"); // sửa
    const tabs = document.querySelectorAll(".tab");
    const addBtn = document.getElementById("addBtn");
    const formContainer = document.getElementById("formContainer");
    const evaluationForm = document.getElementById("evaluationForm");
    const formTitle = document.getElementById("formTitle");
    const saveBtn = document.getElementById("saveBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const tbody = document.getElementById("evaluation-list");
    const popup = document.getElementById("confirmPopup");
    const cancelDelete = document.getElementById("cancelDelete");
    const confirmDelete = document.getElementById("confirmDelete");

    // Form fields
    const tenKyInput = document.getElementById("tenKy");
    const hanDanhGiaInput = document.getElementById("hanDanhGia");
    const viTriDanhGiaSelect = document.getElementById("viTriDanhGia");
    const phuongPhapInput = document.getElementById("phuongPhap");
    const thangApDungSelect = document.getElementById("thangApDung");
    const namApDungSelect = document.getElementById("namApDung");
    const employeeListContainer = document.getElementById("employeeListContainer");
    const checkAllBtn = document.getElementById("checkAllEmployees");
    const uncheckAllBtn = document.getElementById("uncheckAllEmployees");

    // --- Trạng thái ---
    let isEditing = false;
    let currentRow = null;
    let rowToDelete = null;
    let selectedEmployeeIds = []; // Lưu ID nhân viên được chọn khi sửa

    // --- Dữ liệu mẫu Nhân viên (THAY THẾ BẰNG DỮ LIỆU THỰC TẾ) ---
    const allEmployees = [
        { id: 'nv001', name: 'Nguyễn Văn A', position: 'vanphong' },
        { id: 'nv002', name: 'Trần Thị B', position: 'vanphong' },
        { id: 'nv003', name: 'Lê Văn C', position: 'xuong' },
        { id: 'nv004', name: 'Phạm Thị D', position: 'xuong' },
        { id: 'nv005', name: 'Hoàng Văn E', position: 'vanphong' },
        { id: 'nv006', name: 'Vũ Thị F', position: 'xuong' },
        { id: 'nv007', name: 'Đặng Thị G', position: 'vanphong' },
        { id: 'nv008', name: 'Bùi Văn H', position: 'xuong' }
    ];

    // --- Hàm cập nhật danh sách nhân viên trong Form ---
    function populateEmployeeList(filterPosition, checkedIds = []) {
        employeeListContainer.innerHTML = ''; // Xóa danh sách cũ
        let filteredEmployees = [];

        if (filterPosition === 'tatca') {
            filteredEmployees = allEmployees;
        } else {
            filteredEmployees = allEmployees.filter(emp => emp.position === filterPosition);
        }

        if (filteredEmployees.length === 0) {
            employeeListContainer.innerHTML = '<p>Không có nhân viên nào phù hợp.</p>';
            checkAllBtn.disabled = true; // Vô hiệu hóa nút nếu không có NV
            uncheckAllBtn.disabled = true;
            return;
        }

        // Kích hoạt lại nút nếu có NV
        checkAllBtn.disabled = false;
        uncheckAllBtn.disabled = false;

        filteredEmployees.forEach(emp => {
            const isChecked = checkedIds.includes(emp.id);
            const template = document.getElementById('employee-item-template');
            const clone = template.content.cloneNode(true);
            const checkbox = clone.querySelector('input[type="checkbox"]');
            checkbox.value = emp.id;
            checkbox.checked = isChecked;
            clone.querySelector('.employee-name').innerText = emp.name;
            clone.querySelector('.employee-position').innerText = `(${emp.position === 'vanphong' ? 'Văn phòng' : 'Xưởng'})`;
            employeeListContainer.appendChild(clone);
        });
    }

    // --- Hàm lấy danh sách ID nhân viên đang được chọn trong form ---
    function getSelectedEmployeeIdsFromForm() {
        const checkboxes = employeeListContainer.querySelectorAll('input[name="nhanvien"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    // --- Hàm reset Form ---
    function resetForm() {
        evaluationForm.reset();
        viTriDanhGiaSelect.value = 'tatca';
        // Xóa nội dung và hiển thị thông báo mặc định
        employeeListContainer.innerHTML = '<p>Vui lòng chọn vị trí đánh giá để xem danh sách nhân viên.</p>';
        checkAllBtn.disabled = true; // Vô hiệu hóa nút ban đầu
        uncheckAllBtn.disabled = true;
        selectedEmployeeIds = [];
        formContainer.style.display = 'none';
        isEditing = false;
        currentRow = null;
        // Reset validation states if any (optional)
        // Bỏ các lớp báo lỗi nếu có
    }

    // --- Sự kiện thay đổi Vị trí đánh giá ---
    viTriDanhGiaSelect.addEventListener('change', (e) => {
        // Luôn lấy danh sách ID đang được tick hiện tại trên form TRƯỚC KHI populate lại
        // Điều này giữ lại lựa chọn nếu người dùng đổi vị trí qua lại
        const currentSelectedIdsInForm = getSelectedEmployeeIdsFromForm();
        populateEmployeeList(e.target.value, currentSelectedIdsInForm);
    });

    // --- Sự kiện nút Chọn/Bỏ chọn tất cả nhân viên ---
    checkAllBtn.addEventListener('click', () => {
        employeeListContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    });

    uncheckAllBtn.addEventListener('click', () => {
        employeeListContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    });

    // --- Chuyển tab ---
    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            if (link.classList.contains('active')) return; // Không làm gì nếu tab đã active

            navLinks.forEach(el => el.classList.remove("active"));
            tabs.forEach(tab => tab.classList.remove("active-tab"));
            link.classList.add("active");
            const tabId = link.dataset.tab;
            document.getElementById(tabId).classList.add("active-tab");
            resetForm(); // Luôn ẩn và reset form khi chuyển tab
        });
    });

    // --- Hiển thị form Thêm mới ---
    addBtn.addEventListener("click", () => {
        resetForm(); // Đảm bảo form sạch sẽ trước khi hiển thị
        isEditing = false;
        formTitle.innerText = "Thêm kỳ đánh giá";
        saveBtn.innerText = "Lưu";
        // Hiển thị danh sách nhân viên ban đầu (tất cả)
        populateEmployeeList('tatca');
        formContainer.style.display = "block";
        tenKyInput.focus();
    });

    // --- Nút Hủy trên Form ---
    cancelBtn.addEventListener("click", () => {
        resetForm();
    });

    // --- Hàm gắn sự kiện Sửa ---
    function attachEdit(row) {
        const editIcon = row.querySelector(".fa-edit");
        if (editIcon) {
            editIcon.addEventListener("click", (e) => {
                // Ngăn chặn sự kiện nổi bọt nếu cần
                e.stopPropagation();

                resetForm(); // Reset trước khi điền dữ liệu mới
                currentRow = row;
                isEditing = true;
                formTitle.innerText = "Sửa kỳ đánh giá";
                saveBtn.innerText = "Cập nhật";

                const cells = row.querySelectorAll("td");

                // Lấy dữ liệu từ bảng và data-*
                const tenKy = cells[0].innerText;
                const hanDGText = cells[2].innerText; // DD/MM/YYYY
                const viTriApDungText = cells[3].innerText;
                const phuongphapData = row.dataset.phuongphap || '';
                const thangData = row.dataset.thang || '';
                const namData = row.dataset.nam || '';
                const employeeIdsData = row.dataset.employeeIds || '';

                // --- Điền dữ liệu vào Form ---
                tenKyInput.value = tenKy;
                phuongPhapInput.value = phuongphapData;

                // Chuyển đổi DD/MM/YYYY thành YYYY-MM-DD
                const dateParts = hanDGText.split('/');
                if (dateParts.length === 3) {
                    hanDanhGiaInput.value = `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
                } else {
                    hanDanhGiaInput.value = ''; // Xử lý trường hợp định dạng không đúng
                }

                // Xác định value cho select Vị trí
                let viTriValue = 'tatca';
                if (viTriApDungText.includes("văn phòng")) viTriValue = 'vanphong';
                else if (viTriApDungText.includes("xưởng")) viTriValue = 'xuong';
                viTriDanhGiaSelect.value = viTriValue;

                 // Điền Thời gian áp dụng
                thangApDungSelect.value = thangData.padStart(2, '0'); // Đảm bảo 2 chữ số
                namApDungSelect.value = namData;

                // --- Xử lý danh sách nhân viên được chọn ---
                selectedEmployeeIds = employeeIdsData ? employeeIdsData.split(',') : [];

                // Hiển thị danh sách nhân viên tương ứng và tick các ô đã chọn
                populateEmployeeList(viTriValue, selectedEmployeeIds);

                formContainer.style.display = "block";
                tenKyInput.focus(); // Focus vào trường đầu tiên

                // Cuộn tới form để dễ nhìn hơn (tùy chọn)
                formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }

    // --- Hàm gắn sự kiện Xóa (hiển thị popup) ---
    function attachDelete(row) {
        const deleteIcon = row.querySelector(".fa-trash-alt");
        if (deleteIcon) {
            deleteIcon.addEventListener("click", (e) => {
                e.stopPropagation(); // Ngăn chặn sự kiện nổi bọt
                rowToDelete = row;
                popup.style.display = "flex";
            });
        }
    }

    // --- Hàm gắn cả hai sự kiện Sửa và Xóa ---
    function attachEvents(row) {
        attachEdit(row);
        attachDelete(row);
    }

    // --- Gắn sự kiện cho các hàng đã có sẵn khi tải trang ---
    function initializeTableData() {
        tbody.querySelectorAll('tr').forEach(row => {
            // Thêm data mẫu nếu chưa có (chỉ để demo)
            if (!row.dataset.thang) row.dataset.thang = '01';
            if (!row.dataset.nam) row.dataset.nam = '2025';
            if (!row.dataset.phuongphap) row.dataset.phuongphap = 'KPIs';
            if (!row.dataset.employeeIds) row.dataset.employeeIds = 'nv001,nv002';

            attachEvents(row);
        });
    }
    initializeTableData();


    // --- Xử lý Submit Form (Thêm mới hoặc Cập nhật) ---
    evaluationForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Lấy dữ liệu từ form
        const ten = tenKyInput.value.trim(); // Trim để loại bỏ khoảng trắng thừa
        const hanValue = hanDanhGiaInput.value; // YYYY-MM-DD
        const vitriValue = viTriDanhGiaSelect.value;
        const phuongphap = phuongPhapInput.value.trim();
        const thang = thangApDungSelect.value; // Đã là 2 chữ số
        const nam = namApDungSelect.value;
        const selectedIds = getSelectedEmployeeIdsFromForm();

        // --- Validation cơ bản (có thể thêm nhiều hơn) ---
        if (!ten) {
            alert("Vui lòng nhập Tên kỳ đánh giá.");
            tenKyInput.focus();
            return;
        }
        if (!hanValue) {
            alert("Vui lòng chọn Hạn đánh giá.");
            hanDanhGiaInput.focus();
            return;
        }
         if (selectedIds.length === 0) {
            alert("Vui lòng chọn ít nhất một đối tượng đánh giá.");
            // Có thể làm nổi bật phần chọn nhân viên
            employeeListContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Định dạng lại dữ liệu để hiển thị trên bảng
        const viTriHienThi = vitriValue === 'vanphong' ? 'Nhân viên văn phòng' :
                             vitriValue === 'xuong' ? 'Nhân viên xưởng' : 'Tất cả';

        let hanHienThi = '';
        try {
            if (hanValue) {
                const [year, month, day] = hanValue.split('-');
                if (year && month && day) {
                   hanHienThi = `${day}/${month}/${year}`;
                }
            }
        } catch (error) {
            console.error("Lỗi định dạng ngày:", error);
            hanHienThi = hanValue; // Hiển thị nguyên gốc nếu lỗi
        }


        // Tạo text thời gian mục tiêu (chính xác hơn)
        let thoiGianMucTieu = '';
        const currentYear = parseInt(nam);
        const currentMonth = parseInt(thang);
        if (!isNaN(currentYear) && !isNaN(currentMonth) && currentMonth >= 1 && currentMonth <= 12) {
             const firstDay = `01`;
             const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate(); // Lấy ngày cuối của tháng
             const paddedMonth = String(currentMonth).padStart(2, '0');
             thoiGianMucTieu = `${paddedMonth}/${firstDay} - ${paddedMonth}/${lastDayOfMonth}`;
        } else {
            thoiGianMucTieu = `${thang}/?? - ${thang}/??`; // Trường hợp dữ liệu không hợp lệ
        }


        if (isEditing && currentRow) { // --- Chế độ Sửa ---
            const cells = currentRow.querySelectorAll("td");
            cells[0].innerText = ten;
            cells[1].innerText = thoiGianMucTieu;
            cells[2].innerText = hanHienThi;
            cells[3].innerText = viTriHienThi;
            cells[4].innerText = "Đã chỉnh sửa";

            // Lưu các thông tin khác vào data-*
            currentRow.dataset.thang = thang;
            currentRow.dataset.nam = nam;
            currentRow.dataset.phuongphap = phuongphap;
            currentRow.dataset.employeeIds = selectedIds.join(',');

            alert("Cập nhật kỳ đánh giá thành công!");

        } else { // --- Chế độ Thêm mới ---
            const newRow = tbody.insertRow(); // Thêm vào cuối bảng
            newRow.innerHTML = `
              <td>${ten}</td>
              <td>${thoiGianMucTieu}</td>
              <td>${hanHienThi}</td>
              <td>${viTriHienThi}</td>
              <td>Đang diễn ra</td> <!-- Trạng thái mặc định khi thêm -->
              <td>
                <i class="fas fa-edit action-icon"></i>
                <i class="fas fa-trash-alt action-icon delete"></i>
              </td>
            `;
            // Lưu các thông tin khác vào data-* cho hàng mới
            newRow.dataset.thang = thang;
            newRow.dataset.nam = nam;
            newRow.dataset.phuongphap = phuongphap;
            newRow.dataset.employeeIds = selectedIds.join(',');

            attachEvents(newRow); // Gắn sự kiện cho hàng mới
            alert("Thêm kỳ đánh giá thành công!");
        }

        resetForm(); // Reset và ẩn form sau khi lưu
    });

    // --- Xử lý nút Hủy trong Popup xóa ---
    cancelDelete.addEventListener("click", () => {
        rowToDelete = null;
        popup.style.display = "none";
    });

    // --- Xử lý nút Xác nhận xóa trong Popup ---
    confirmDelete.addEventListener("click", () => {
        if (rowToDelete) {
            rowToDelete.remove();
            rowToDelete = null;
            alert("Đã xóa kỳ đánh giá thành công!");
        }
        popup.style.display = "none";
    });

    // --- Khởi tạo trạng thái ban đầu ---
    // sửa
    if (navLinks && navLinks.length > 0) {
        // Remove active từ tất cả trước
        navLinks.forEach(link => {
            if (link && link.classList) {
                link.classList.remove('active');
            }
        });
        tabs.forEach(tab => {
            if (tab && tab.classList) {
                tab.classList.remove('active-tab');
            }
        });

        // Set active cho tab đầu tiên
        const firstLink = navLinks[0];
        const firstTabId = firstLink.getAttribute('data-tab');
        
        if (firstLink && firstLink.classList) {
            firstLink.classList.add('active');
        }
        
        const firstTab = document.getElementById(firstTabId);
        if (firstTab && firstTab.classList) {
            firstTab.classList.add('active-tab');
        }
    }

    // Reset form nếu cần
    if (typeof resetForm === 'function') {
        resetForm();
    }

        // --- LOGIC CHO TAB "THỰC HIỆN ĐÁNH GIÁ" ---

        const subNavItems = document.querySelectorAll('.sub-nav-item');
        const subTabContents = document.querySelectorAll('.sub-tab-content');
    
        // --- Chuyển Sub-tab ---
        subNavItems.forEach(item => {
            item.addEventListener('click', () => {
                // Bỏ active khỏi tất cả
                subNavItems.forEach(i => i.classList.remove('active'));
                subTabContents.forEach(c => c.classList.remove('active-sub-tab'));
    
                // Thêm active cho item được click
                item.classList.add('active');
                const subtabId = item.dataset.subtab;
                const targetContent = document.getElementById(subtabId);
                if (targetContent) {
                    targetContent.classList.add('active-sub-tab');
                }
    
                // Reset các trạng thái khi chuyển tab (ví dụ: ẩn khu vực chi tiết NV)
                hideEmployeeDetailView();
                hideFeedbackInput();
                hideManagerReplyArea();
    
            });
        });
    
        // --- Logic cho Tự đánh giá ---
        const saveTuDanhGiaBtn = document.getElementById('saveTuDanhGiaBtn');
        const tuDanhGiaKySelect = document.getElementById('tuDanhGiaKy');
        if (saveTuDanhGiaBtn) {
            saveTuDanhGiaBtn.addEventListener('click', () => {
                if (!tuDanhGiaKySelect.value) {
                    alert('Vui lòng chọn Kỳ đánh giá.');
                    tuDanhGiaKySelect.focus();
                    return;
                }
                // Lấy điểm (ví dụ)
                const diemTC1 = document.getElementById('tc1').value;
                if (!diemTC1) {
                     alert('Vui lòng chọn điểm cho tất cả tiêu chí.');
                     document.getElementById('tc1').focus();
                     return;
                }
                // ... (Thêm logic lấy hết điểm và validate)
    
                // Giả lập lưu thành công
                alert('Đã lưu bản tự đánh giá thành công!');
                // Reset form (tùy chọn)
                // document.getElementById('evaluationForm').reset(); // Reset form cha có thể ảnh hưởng tab khác
                tuDanhGiaKySelect.value = '';
                document.querySelectorAll('#tu-danh-gia select:not(#tuDanhGiaKy)').forEach(s => s.value = '');
                document.getElementById('tuNhanXet').value = '';
    
            });
        }
    
        // --- Logic cho Xem QL đánh giá ---
        const xemQlKySelect = document.getElementById('xemQlKy');
        const ketQuaQlArea = document.getElementById('ketQuaQlArea');
        const guiPhanHoiBtn = document.getElementById('guiPhanHoiBtn');
        const phanHoiInputArea = document.getElementById('phanHoiInputArea');
        const submitPhanHoiBtn = document.getElementById('submitPhanHoiBtn');
        const cancelPhanHoiBtn = document.getElementById('cancelPhanHoiBtn');
        const phanHoiText = document.getElementById('phanHoiText');
        const phanHoiCountMsg = document.getElementById('phanHoiCountMsg');
        const lichSuPhanHoiContainer = document.getElementById('lichSuPhanHoi');
        let feedbackCount = 3; // Giả lập số lượt phản hồi còn lại
    
        function hideFeedbackInput() {
             if(phanHoiInputArea) phanHoiInputArea.style.display = 'none';
             if(phanHoiText) phanHoiText.value = '';
        }
    
        if (xemQlKySelect && ketQuaQlArea) {
            xemQlKySelect.addEventListener('change', () => {
                if (xemQlKySelect.value) {
                    // Giả lập load dữ liệu QL đánh giá cho kỳ đã chọn
                    document.getElementById('maPhieuQl').innerText = `#MGR-EVL-${Math.floor(Math.random() * 1000)}`;
                    document.getElementById('ql_tc1').innerText = Math.floor(Math.random() * 5) + 6; // Random 6-10
                    document.getElementById('ql_tc2').innerText = Math.floor(Math.random() * 5) + 6;
                    // ... load điểm các tiêu chí khác ...
                    document.getElementById('ql_tc8').innerText = Math.floor(Math.random() * 5) + 6;
                    document.getElementById('ql_tongdiem').innerText = Math.floor(Math.random() * 20) + 60; // Random 60-80
                    document.getElementById('ql_nhanxet').innerText = "Nhận xét mẫu: Nhân viên cần chủ động hơn. Đã đạt mục tiêu đề ra.";
                    ketQuaQlArea.style.display = 'block';
                    feedbackCount = 3; // Reset lượt khi chọn kỳ mới
                    phanHoiCountMsg.innerText = `(Bạn còn ${feedbackCount} lượt phản hồi)`;
                    guiPhanHoiBtn.disabled = false;
                    lichSuPhanHoiContainer.innerHTML = ''; // Xóa lịch sử cũ
                    hideFeedbackInput();
                } else {
                    ketQuaQlArea.style.display = 'none';
                }
            });
        }
    
        if (guiPhanHoiBtn) {
            guiPhanHoiBtn.addEventListener('click', () => {
                if (feedbackCount > 0) {
                    phanHoiInputArea.style.display = 'block';
                    phanHoiText.focus();
                } else {
                    alert('Bạn đã hết lượt phản hồi cho kỳ đánh giá này.');
                }
            });
        }
    
        if (cancelPhanHoiBtn) {
            cancelPhanHoiBtn.addEventListener('click', hideFeedbackInput);
        }
    
        if (submitPhanHoiBtn) {
            submitPhanHoiBtn.addEventListener('click', () => {
                const noiDungPhanHoi = phanHoiText.value.trim();
                if (noiDungPhanHoi) {
                    feedbackCount--;
                    phanHoiCountMsg.innerText = `(Bạn còn ${feedbackCount} lượt phản hồi)`;
    
                    // Thêm phản hồi vào lịch sử (Giả lập)
                    const newFeedback = document.createElement('div');
                    newFeedback.classList.add('feedback-item', 'employee-feedback');
                    newFeedback.innerHTML = `<strong>Bạn:</strong> <span>${noiDungPhanHoi}</span> <small>(${new Date().toLocaleDateString('vi-VN')})</small>`;
                    lichSuPhanHoiContainer.appendChild(newFeedback);
    
                    alert('Gửi phản hồi thành công!');
                    hideFeedbackInput();
                    if (feedbackCount <= 0) {
                        guiPhanHoiBtn.disabled = true;
                    }
                    // Trong thực tế: gửi noiDungPhanHoi lên server
                } else {
                    alert('Vui lòng nhập nội dung phản hồi.');
                    phanHoiText.focus();
                }
            });
        }
    
        // --- Logic cho Đánh giá NV cấp dưới ---
        const danhGiaNvKySelect = document.getElementById('danhGiaNvKy');
        const subordinateTableBody = document.querySelector('.subordinate-table tbody');
        const employeeDetailView = document.getElementById('employeeEvaluationDetail');
        const employeeDetailTitle = document.getElementById('employeeDetailTitle');
        const closeEmployeeDetailBtn = document.getElementById('closeEmployeeDetail');
        const employeeSelfScoresContainer = document.getElementById('employeeSelfScores');
        const employeeSelfComment = document.getElementById('employeeSelfComment');
        const employeeSelfTotal = document.getElementById('employeeSelfTotal');
        const managerEvaluationForm = document.getElementById('managerEvaluationForm');
        const managerTotalScoreSpan = document.getElementById('managerTotalScore');
        const saveManagerEvaluationBtn = document.getElementById('saveManagerEvaluationBtn');
        const feedbackSection = document.getElementById('employeeFeedbackSection');
        const managerReplyArea = document.getElementById('managerReplyArea');
        const feedbackHistoryContainer = document.getElementById('feedbackHistory');
        const managerReplyText = document.getElementById('managerReplyText');
        const sendReplyBtn = document.getElementById('sendReplyBtn');
    
        function hideEmployeeDetailView() {
            if(employeeDetailView) employeeDetailView.style.display = 'none';
        }
        function hideManagerReplyArea() {
            if(managerReplyArea) managerReplyArea.style.display = 'none';
        }
    
        if (danhGiaNvKySelect && subordinateTableBody) {
            danhGiaNvKySelect.addEventListener('change', () => {
                // Giả lập load lại danh sách nhân viên theo kỳ
                console.log("Đã chọn kỳ:", danhGiaNvKySelect.value);
                // Trong thực tế: fetch API lấy danh sách NV cho kỳ này và render lại bảng
                hideEmployeeDetailView(); // Ẩn chi tiết khi đổi kỳ
            });
        }
    
        if (subordinateTableBody) {
            subordinateTableBody.addEventListener('click', (e) => {
                const targetButton = e.target.closest('.action-btn');
                if (!targetButton) return;
    
                const action = targetButton.dataset.action;
                const employeeId = targetButton.dataset.employeeId;
                const employeeRow = targetButton.closest('tr');
                const employeeName = employeeRow.querySelector('td:first-child').innerText;
    
                console.log(`Action: ${action}, Employee ID: ${employeeId}, Name: ${employeeName}`);
    
                // --- Giả lập dữ liệu chi tiết của nhân viên ---
                const selfScores = { tc1: 7, tc2: 8, tc3: 6, tc4: 7, tc5: 7, tc6: 8, tc7: 9, tc8: 8 };
                const selfTotal = Object.values(selfScores).reduce((sum, score) => sum + score, 0);
                const selfCommentText = "Em đã hoàn thành tốt các chỉ tiêu được giao trong kỳ.";
    
                const managerScores = (action === 'evaluate') ? {} : { mgr_tc1: 7, mgr_tc2: 7, mgr_tc3: 8, mgr_tc4: 6, mgr_tc6: 7, mgr_tc7: 9 }; // Điểm QL đã lưu (trừ evaluate)
                 const managerCommentText = (action === 'evaluate') ? '' : "Cần chủ động hơn trong việc học hỏi nghiệp vụ mới.";
    
    
                // --- Hiển thị phần chi tiết ---
                employeeDetailTitle.innerText = `Đánh giá chi tiết cho: ${employeeName}`;
    
                // Hiển thị điểm tự đánh giá
                employeeSelfScoresContainer.innerHTML = ''; // Clear old scores
                Object.entries(selfScores).forEach(([key, value]) => {
                    const criteriaName = document.querySelector(`label[for="${key}"]`)?.innerText || key; // Lấy tên tiêu chí từ label
                    const li = document.createElement('li');
                    li.innerHTML = `${criteriaName}: <span class="score-value">${value}</span>`;
                    employeeSelfScoresContainer.appendChild(li);
                });
                employeeSelfTotal.innerText = selfTotal;
                employeeSelfComment.innerText = selfCommentText;
    
    
                 // Điền điểm và nhận xét của quản lý (nếu có) và reset form
                managerEvaluationForm.reset(); // Reset trước khi điền
                document.querySelectorAll('#managerEvaluationForm select').forEach(select => {
                    const scoreKey = select.id;
                    select.value = managerScores[scoreKey] || ''; // Điền điểm đã lưu hoặc rỗng
                     // Tạo options 1-10 nếu chưa có
                    if(select.options.length <= 1) {
                        for(let i = 1; i <= 10; i++) {
                             const option = new Option(i, i);
                             select.add(option);
                        }
                    }
                });
                document.getElementById('managerComment').value = managerCommentText;
                updateManagerTotalScore(); // Tính lại tổng điểm ban đầu
    
                // Xử lý trạng thái các nút và vùng dựa trên action
                const managerInputs = managerEvaluationForm.querySelectorAll('select, textarea');
                if (action === 'evaluate') {
                    managerInputs.forEach(input => input.disabled = false);
                    saveManagerEvaluationBtn.style.display = 'inline-block';
                    feedbackSection.style.display = 'none'; // Ẩn phản hồi khi đang đánh giá mới
                } else { // view hoặc view-feedback
                    managerInputs.forEach(input => input.disabled = true); // Xem thì disable input
                    saveManagerEvaluationBtn.style.display = 'none';      // Ẩn nút lưu
                    if (action === 'view-feedback' || action === 'feedback-limit') { // Hiển thị phản hồi nếu có
                         feedbackSection.style.display = 'block';
                         // Giả lập load lịch sử phản hồi
                         feedbackHistoryContainer.innerHTML = `
                            <div class="feedback-item employee-feedback">
                               <strong>${employeeName}:</strong> <span>Em nghĩ điểm Quản lý dự án nên cao hơn vì dự án XYZ đã hoàn thành tốt.</span> <small>(20/03/2024)</small>
                            </div>
                            <div class="feedback-item manager-reply">
                               <strong>Quản lý:</strong> <span>Đồng ý dự án XYZ tốt, nhưng cần xem xét cả quá trình xử lý rủi ro chưa tối ưu.</span> <small>(21/03/2024)</small>
                            </div>
                            <div class="feedback-item employee-feedback">
                               <strong>${employeeName}:</strong> <span>Vâng em hiểu rồi ạ.</span> <small>(22/03/2024)</small>
                            </div>
                         `;
                         // Chỉ hiện ô trả lời nếu còn phản hồi cần trả lời (logic phức tạp hơn cần thêm)
                         managerReplyArea.style.display = 'block'; // Tạm thời luôn hiện khi có feedback
                    } else {
                         feedbackSection.style.display = 'none'; // Ẩn nếu chỉ xem
                    }
                }
    
                employeeDetailView.style.display = 'block';
                employeeDetailView.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
         // Tính tổng điểm của quản lý khi thay đổi điểm
        if(managerEvaluationForm) {
            managerEvaluationForm.addEventListener('change', (e) => {
                if(e.target.tagName === 'SELECT') {
                    updateManagerTotalScore();
                }
            });
        }
        function updateManagerTotalScore() {
            let total = 0;
            managerEvaluationForm.querySelectorAll('select').forEach(select => {
                const score = parseInt(select.value);
                if (!isNaN(score)) {
                    total += score;
                }
            });
            if(managerTotalScoreSpan) managerTotalScoreSpan.innerText = total;
        }
    
        // Nút đóng chi tiết
        if (closeEmployeeDetailBtn) {
            closeEmployeeDetailBtn.addEventListener('click', hideEmployeeDetailView);
        }
    
        // Nút lưu đánh giá của quản lý
        if (saveManagerEvaluationBtn) {
            saveManagerEvaluationBtn.addEventListener('click', () => {
                // Validate điểm đã chọn hết chưa
                let allSelected = true;
                managerEvaluationForm.querySelectorAll('select').forEach(select => {
                    if (!select.value) allSelected = false;
                });
                if (!allSelected) {
                    alert('Vui lòng chấm điểm đầy đủ các tiêu chí.');
                    return;
                }
                // Giả lập lưu thành công
                alert('Đã lưu đánh giá cho nhân viên thành công!');
                hideEmployeeDetailView();
                // Trong thực tế: gửi dữ liệu lên server, cập nhật trạng thái trong bảng
                // Ví dụ cập nhật trạng thái trên frontend:
                // const rowToUpdate = document.querySelector(`.action-btn[data-employee-id="${currentEmployeeId}"]`).closest('tr');
                // rowToUpdate.querySelector('.status-tag').className = 'status-tag status-completed';
                // rowToUpdate.querySelector('.status-tag').innerText = 'Đã đánh giá';
                // rowToUpdate.querySelector('.action-btn').outerHTML = '<button class="btn btn-info btn-sm action-btn" data-action="view" data-employee-id="..."><i class="fas fa-eye"></i> Xem</button>';
                // Cần lấy currentEmployeeId khi mở chi tiết
            });
        }
    
         // Nút gửi trả lời phản hồi
        if (sendReplyBtn) {
            sendReplyBtn.addEventListener('click', () => {
                const replyText = managerReplyText.value.trim();
                if (replyText) {
                     // Thêm trả lời vào lịch sử (Giả lập)
                    const newReply = document.createElement('div');
                    newReply.classList.add('feedback-item', 'manager-reply');
                    newReply.innerHTML = `<strong>Quản lý:</strong> <span>${replyText}</span> <small>(${new Date().toLocaleDateString('vi-VN')})</small>`;
                    feedbackHistoryContainer.appendChild(newReply);
    
                    alert('Đã gửi trả lời phản hồi!');
                    managerReplyText.value = '';
                     // Trong thực tế: gửi trả lời lên server, cập nhật trạng thái
                } else {
                    alert('Vui lòng nhập nội dung trả lời.');
                    managerReplyText.focus();
                }
            });
        }
    
            // --- LOGIC CHO TAB "BÁO CÁO" ---
    const baoCaoTab = document.getElementById('baocao'); // Lấy phần tử cha của tab báo cáo

    if (baoCaoTab) { // Chỉ chạy code này nếu tab báo cáo tồn tại trong DOM
        const baoCaoKySelect = baoCaoTab.querySelector('#baoCaoKy');
        const taoBaoCaoBtn = baoCaoTab.querySelector('#taoBaoCaoBtn');
        const baoCaoContent = baoCaoTab.querySelector('#baoCaoContent');
        const sendReportBtn = baoCaoTab.querySelector('#sendReportBtn'); // Nút gửi báo cáo

        // Table cells
        const xuong_gt80 = baoCaoTab.querySelector('#xuong_gt80');
        const xuong_50_80 = baoCaoTab.querySelector('#xuong_50_80');
        const xuong_lt50 = baoCaoTab.querySelector('#xuong_lt50');
        const xuong_total = baoCaoTab.querySelector('#xuong_total');
        const vp_gt80 = baoCaoTab.querySelector('#vp_gt80');
        const vp_50_80 = baoCaoTab.querySelector('#vp_50_80');
        const vp_lt50 = baoCaoTab.querySelector('#vp_lt50');
        const vp_total = baoCaoTab.querySelector('#vp_total');
        const total_gt80 = baoCaoTab.querySelector('#total_gt80');
        const total_50_80 = baoCaoTab.querySelector('#total_50_80');
        const total_lt50 = baoCaoTab.querySelector('#total_lt50');
        const total_all = baoCaoTab.querySelector('#total_all');

        // Top 10 list
        const top10ListContainer = baoCaoTab.querySelector('#top10List');

        // Chart variables
        const reportChartCanvas = baoCaoTab.querySelector('#reportChartCanvas');
        let reportChartInstance = null; // Biến lưu trữ đối tượng Chart

        // Hàm cập nhật nội dung ô bảng (thêm kiểm tra null)
        function updateTableCell(element, value) {
            if (element) {
                element.innerText = value;
            } else {
                console.warn("Không tìm thấy phần tử bảng để cập nhật.");
            }
        }

        if (taoBaoCaoBtn && baoCaoKySelect) {
            taoBaoCaoBtn.addEventListener('click', () => {
                const selectedKy = baoCaoKySelect.value;
                if (!selectedKy) {
                    alert('Vui lòng chọn Kỳ đánh giá để tạo báo cáo.');
                    baoCaoKySelect.focus();
                    return;
                }

                // --- Giả lập tạo dữ liệu báo cáo ---
                // Trong thực tế, bạn sẽ fetch dữ liệu này từ server dựa vào selectedKy
                console.log(`Tạo báo cáo cho kỳ: ${selectedKy}`);

                // 1. Dữ liệu bảng thống kê (Ví dụ)
                const baseGt80 = selectedKy === 'ky-cuoi-2023' ? 8 : 10;
                const base50_80 = selectedKy === 'ky-cuoi-2023' ? 15 : 12;
                const baseLt50 = selectedKy === 'ky-cuoi-2023' ? 2 : 3;
                // Tính toán tổng dựa trên các thành phần để đảm bảo nhất quán
                const xuongTotal = baseGt80 + base50_80 + baseLt50;
                const vpGt80 = baseGt80 + 4;
                const vp50_80 = base50_80 - 7 > 0 ? base50_80 - 7 : 1;
                const vpLt50 = baseLt50 - 1 > 0 ? baseLt50 - 1 : 0;
                const vpTotal = vpGt80 + vp50_80 + vpLt50;

                const summaryData = {
                    xuong: { gt80: baseGt80, '50_80': base50_80, lt50: baseLt50, total: xuongTotal },
                    vp: { gt80: vpGt80, '50_80': vp50_80, lt50: vpLt50, total: vpTotal }
                };

                // Cập nhật bảng sử dụng hàm helper
                updateTableCell(xuong_gt80, summaryData.xuong.gt80);
                updateTableCell(xuong_50_80, summaryData.xuong['50_80']);
                updateTableCell(xuong_lt50, summaryData.xuong.lt50);
                updateTableCell(xuong_total, summaryData.xuong.total);
                updateTableCell(vp_gt80, summaryData.vp.gt80);
                updateTableCell(vp_50_80, summaryData.vp['50_80']);
                updateTableCell(vp_lt50, summaryData.vp.lt50);
                updateTableCell(vp_total, summaryData.vp.total);

                // Tính tổng công ty
                updateTableCell(total_gt80, summaryData.xuong.gt80 + summaryData.vp.gt80);
                updateTableCell(total_50_80, summaryData.xuong['50_80'] + summaryData.vp['50_80']);
                updateTableCell(total_lt50, summaryData.xuong.lt50 + summaryData.vp.lt50);
                updateTableCell(total_all, summaryData.xuong.total + summaryData.vp.total);

                // 2. Dữ liệu và vẽ Biểu đồ
                if (reportChartCanvas && typeof Chart !== 'undefined') { // Kiểm tra Chart.js đã tải chưa
                    const ctx = reportChartCanvas.getContext('2d');

                    // Hủy biểu đồ cũ nếu tồn tại
                    if (reportChartInstance) {
                        reportChartInstance.destroy();
                        reportChartInstance = null; // Đặt lại biến sau khi hủy
                    }

                    try { // Thêm try-catch để bắt lỗi khi tạo chart
                        reportChartInstance = new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: ['Xưởng', 'Văn phòng'],
                                datasets: [
                                    {
                                        label: '> 80 điểm',
                                        data: [summaryData.xuong.gt80, summaryData.vp.gt80],
                                        backgroundColor: 'rgba(40, 167, 69, 0.7)',
                                        borderColor: 'rgba(40, 167, 69, 1)',
                                        borderWidth: 1
                                    },
                                    {
                                        label: '50 - 80 điểm',
                                        data: [summaryData.xuong['50_80'], summaryData.vp['50_80']],
                                        backgroundColor: 'rgba(255, 193, 7, 0.7)',
                                        borderColor: 'rgba(255, 193, 7, 1)',
                                        borderWidth: 1
                                    },
                                    {
                                        label: '< 50 điểm',
                                        data: [summaryData.xuong.lt50, summaryData.vp.lt50],
                                        backgroundColor: 'rgba(220, 53, 69, 0.7)',
                                        borderColor: 'rgba(220, 53, 69, 1)',
                                        borderWidth: 1
                                    }
                                ]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    title: {
                                        display: true,
                                        text: `Biểu đồ Phân loại Kết quả Đánh giá - Kỳ ${selectedKy.replace('ky-','').replace('-',' ')}`, // Định dạng lại tên kỳ cho đẹp hơn
                                        font: { size: 16 }
                                    },
                                    legend: {
                                        display: true,
                                        position: 'top',
                                    },
                                    tooltip: {
                                        mode: 'index',
                                        intersect: false,
                                    }
                                },
                                scales: {
                                    x: {
                                        stacked: true,
                                        title: {
                                            display: true,
                                            text: 'Phòng Ban'
                                        }
                                    },
                                    y: {
                                        stacked: true,
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Số lượng nhân viên'
                                        }
                                    }
                                }
                            }
                        });
                    } catch (chartError) {
                        console.error("Lỗi khi tạo biểu đồ:", chartError);
                        // Có thể hiển thị thông báo lỗi cho người dùng ở đây
                    }

                } else if (!reportChartCanvas) {
                    console.warn("Không tìm thấy canvas 'reportChartCanvas' để vẽ biểu đồ.");
                } else if (typeof Chart === 'undefined') {
                     console.error("Thư viện Chart.js chưa được tải.");
                     // Có thể hiển thị thông báo lỗi cho người dùng ở đây
                }

                // 3. Dữ liệu Top 10 (Ví dụ)
                const topEmployees = [
                    { name: 'Hoàng Văn E', department: 'Xưởng', score: 92 },
                    { name: 'Nguyễn Thị X', department: 'Văn phòng', score: 91 },
                    { name: 'Trần Văn Y', department: 'Văn phòng', score: 90 },
                    { name: 'Lê Thị Z', department: 'Xưởng', score: 88 },
                    { name: 'Phạm Văn T', department: 'Xưởng', score: 87 },
                    { name: 'Vũ Công Q', department: 'Văn phòng', score: 85 },
                    { name: 'Đinh Thị P', department: 'Xưởng', score: 84 },
                    { name: 'Bùi Văn O', department: 'Xưởng', score: 82 },
                    { name: 'Mai Thị N', department: 'Xưởng', score: 81 },
                    { name: 'Hà Văn M', department: 'Văn phòng', score: 80 }
                ].sort((a, b) => b.score - a.score); // Đảm bảo sắp xếp

                // Cập nhật danh sách Top 10
                if (top10ListContainer) {
                    top10ListContainer.innerHTML = ''; // Xóa danh sách cũ
                    if (topEmployees.length > 0) {
                         topEmployees.slice(0, 10).forEach((emp) => {
                            const li = document.createElement('li');
                            li.innerHTML = `
                                <span class="employee-name">${emp.name} <span class="employee-department">(${emp.department})</span></span>
                                <span class="employee-score">${emp.score} điểm</span>
                            `;
                            top10ListContainer.appendChild(li);
                        });
                    } else {
                         // Hiển thị thông báo nếu không có dữ liệu top 10
                         const li = document.createElement('li');
                         li.innerText = "Chưa có dữ liệu xếp hạng.";
                         li.style.textAlign = 'center';
                         li.style.color = '#888';
                         top10ListContainer.appendChild(li);
                    }

                } else {
                     console.warn("Không tìm thấy container 'top10List'.");
                }


                // --- Hiển thị nội dung báo cáo ---
                if (baoCaoContent) {
                    baoCaoContent.style.display = 'block';
                    // Cuộn tới đầu báo cáo cho dễ nhìn
                    const reportControlsElement = baoCaoTab.querySelector('.report-controls');
                    if (reportControlsElement) {
                        reportControlsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                } else {
                    console.warn("Không tìm thấy container 'baoCaoContent'.");
                }
            });
        }

        // Sự kiện nút Gửi báo cáo
        if (sendReportBtn) {
            sendReportBtn.addEventListener('click', () => {
                // Giả lập hành động gửi
                alert('Đã gửi báo cáo cho Giám đốc!');
                // Tùy chọn: Vô hiệu hóa nút sau khi gửi
                // sendReportBtn.disabled = true;
                // sendReportBtn.innerHTML = '<i class="fas fa-check"></i> Đã gửi';
            });
        }

        // Ẩn nội dung báo cáo và hủy chart khi chọn kỳ mới
         if (baoCaoKySelect) {
            baoCaoKySelect.addEventListener('change', () => {
                if(baoCaoContent) baoCaoContent.style.display = 'none';
                if (reportChartInstance) {
                    reportChartInstance.destroy();
                    reportChartInstance = null;
                }
                // Reset nút gửi nếu cần
                // if (sendReportBtn) {
                //    sendReportBtn.disabled = false;
                //    sendReportBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi báo cáo cho Giám đốc';
                // }
            });
         }

         // Logic ẩn báo cáo khi chuyển tab đã được tích hợp vào sự kiện chuyển tab chính ở trên

    } // Kết thúc if (baoCaoTab)
    // --- Kết thúc phần logic cho tab "Báo cáo" ---
    
}); // Đóng sự kiện DOMContentLoaded chính"
