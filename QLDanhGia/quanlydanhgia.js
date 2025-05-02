document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navLinks = document.querySelectorAll('.main-nav a');
    const tabs = document.querySelectorAll('.tab');
    const subNavItems = document.querySelectorAll('.sub-nav-item');
    const subTabContents = document.querySelectorAll('.sub-tab-content');
    const addBtn = document.getElementById('addBtn');
    const formContainer = document.getElementById('formContainer');
    const evaluationForm = document.getElementById('evaluationForm');
    const formTitle = document.getElementById('formTitle');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const evaluationList = document.getElementById('evaluation-list');
    const confirmPopup = document.getElementById('confirmPopup');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');
    const currentUserId = document.getElementById('currentUserId').value;

    // Form Fields
    const maKyDGInput = document.getElementById('maKyDG');
    const tenKyInput = document.getElementById('tenKy');
    const hanQuanLyDanhGiaInput = document.getElementById('hanQuanLyDanhGia');
    const viTriDanhGiaSelect = document.getElementById('viTriDanhGia');
    const phuongPhapInput = document.getElementById('phuongPhap');
    const thangApDungSelect = document.getElementById('thangApDung');
    const namApDungSelect = document.getElementById('namApDung');
    const employeeListContainer = document.getElementById('employeeListContainer');
    const checkAllBtn = document.getElementById('checkAllEmployees');
    const uncheckAllBtn = document.getElementById('uncheckAllEmployees');

    // Self-Evaluation Elements
    const tuDanhGiaKySelect = document.getElementById('tuDanhGiaKy');
    const saveTuDanhGiaBtn = document.getElementById('saveTuDanhGiaBtn');

    // Manager Evaluation View Elements
    const xemQlKySelect = document.getElementById('xemQlKy');
    const ketQuaQlArea = document.getElementById('ketQuaQlArea');
    const guiPhanHoiBtn = document.getElementById('guiPhanHoiBtn');
    const phanHoiInputArea = document.getElementById('phanHoiInputArea');
    const phanHoiText = document.getElementById('phanHoiText');
    const submitPhanHoiBtn = document.getElementById('submitPhanHoiBtn');
    const cancelPhanHoiBtn = document.getElementById('cancelPhanHoiBtn');
    const phanHoiCountMsg = document.getElementById('phanHoiCountMsg');
    const lichSuPhanHoi = document.getElementById('lichSuPhanHoi');

    // Subordinate Evaluation Elements
    const danhGiaNvKySelect = document.getElementById('danhGiaNvKy');
    const subordinateTableBody = document.getElementById('subordinateTableBody');
    const employeeEvaluationDetail = document.getElementById('employeeEvaluationDetail');
    const closeEmployeeDetail = document.getElementById('closeEmployeeDetail');
    const employeeDetailTitle = document.getElementById('employeeDetailTitle');
    const employeeSelfScores = document.getElementById('employeeSelfScores');
    const employeeSelfTotal = document.getElementById('employeeSelfTotal');
    const employeeSelfComment = document.getElementById('employeeSelfComment');
    const managerEvaluationForm = document.getElementById('managerEvaluationForm');
    const saveManagerEvaluationBtn = document.getElementById('saveManagerEvaluationBtn');
    const feedbackHistory = document.getElementById('feedbackHistory');
    const managerReplyArea = document.getElementById('managerReplyArea');
    const managerReplyText = document.getElementById('managerReplyText');
    const sendReplyBtn = document.getElementById('sendReplyBtn');

    // Report Elements
    const baoCaoKySelect = document.getElementById('baoCaoKy');
    const taoBaoCaoBtn = document.getElementById('taoBaoCaoBtn');
    const baoCaoContent = document.getElementById('baoCaoContent');
    const summaryTableBody = document.getElementById('summaryTableBody');
    const top10List = document.getElementById('top10List');
    const sendReportBtn = document.getElementById('sendReportBtn');
    const reportChartCanvas = document.getElementById('reportChartCanvas');

    // State
    let isEditing = false;
    let currentRow = null;
    let rowToDelete = null;
    let feedbackCount = 3;
    let chartInstance = null;
    let currentEmpId = null;

    // Utility Functions
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }

    function showError(message) {
        alert(message);
    }

    async function fetchData(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: { 'Content-Type': 'application/json' },
                ...options
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Request failed');
            return data;
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            throw error;
        }
    }

    // Navigation
    function switchTab(tabId) {
        navLinks.forEach(link => link.classList.remove('active'));
        tabs.forEach(tab => tab.classList.remove('active-tab'));
        document.querySelector(`.main-nav a[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active-tab');
        resetForm();
    }

    function switchSubTab(subTabId) {
        subNavItems.forEach(item => item.classList.remove('active'));
        subTabContents.forEach(content => content.classList.remove('active-sub-tab'));
        document.querySelector(`.sub-nav-item[data-subtab="${subTabId}"]`).classList.add('active');
        document.getElementById(subTabId).classList.add('active-sub-tab');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            switchTab(link.dataset.tab);
        });
    });

    subNavItems.forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            switchSubTab(item.dataset.subtab);
        });
    });

    // Evaluation Period Management
    async function loadEvaluationPeriods() {
        try {
            const periods = await fetchData('api/evaluation_periods.php');
            evaluationList.innerHTML = '';
            periods.forEach(period => {
                const row = document.createElement('tr');
                row.dataset.maKyDG = period.MaKyDG;
                row.dataset.employeeIds = period.employee_ids.join(',');
                row.innerHTML = `
                    <td>${period.TenKyDG}</td>
                    <td>${formatDate(period.ThoiGianApDung)}</td>
                    <td>${formatDate(period.HanQuanLyDanhGia)}</td>
                    <td>${period.ViTriDG}</td>
                    <td>${period.TrangThai}</td>
                    <td>
                        <i class="fas fa-edit action-icon edit"></i>
                        <i class="fas fa-trash-alt action-icon delete"></i>
                    </td>
                `;
                evaluationList.appendChild(row);
                row.querySelector('.edit').addEventListener('click', () => editPeriod(row));
                row.querySelector('.delete').addEventListener('click', () => showDeleteConfirm(row));
            });
        } catch (error) {
            showError('Không thể tải danh sách kỳ đánh giá.');
        }
    }

    async function populateEmployeeList(position, checkedIds = []) {
        employeeListContainer.innerHTML = '';
        try {
            const employees = await fetchData(`api/employees.php?position=${position}`);
            if (employees.length === 0) {
                employeeListContainer.innerHTML = '<p>Không có nhân viên nào phù hợp.</p>';
                checkAllBtn.disabled = true;
                uncheckAllBtn.disabled = true;
                return;
            }
            checkAllBtn.disabled = false;
            uncheckAllBtn.disabled = false;
            employees.forEach(emp => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <input type="checkbox" name="nhanvien" value="${emp.MaNV}" ${checkedIds.includes(emp.MaNV) ? 'checked' : ''}>
                    <span class="employee-name">${emp.TenNV}</span>
                    <span class="employee-position">(${emp.TenVT})</span>
                `;
                employeeListContainer.appendChild(div);
            });
        } catch (error) {
            showError('Không thể tải danh sách nhân viên.');
        }
    }

    function getSelectedEmployeeIds() {
        return Array.from(employeeListContainer.querySelectorAll('input[name="nhanvien"]:checked')).map(cb => cb.value);
    }

    function resetForm() {
        evaluationForm.reset();
        viTriDanhGiaSelect.value = 'tatca';
        employeeListContainer.innerHTML = '<p>Vui lòng chọn vị trí đánh giá để xem danh sách nhân viên.</p>';
        checkAllBtn.disabled = true;
        uncheckAllBtn.disabled = true;
        formContainer.style.display = 'none';
        isEditing = false;
        currentRow = null;
    }

    async function editPeriod(row) {
        resetForm();
        isEditing = true;
        currentRow = row;
        formTitle.textContent = 'Sửa kỳ đánh giá';
        saveBtn.textContent = 'Cập nhật';
        try {
            const period = await fetchData(`api/evaluation_periods.php?id=${row.dataset.maKyDG}`);
            maKyDGInput.value = period.MaKyDG;
            tenKyInput.value = period.TenKyDG;
            hanQuanLyDanhGiaInput.value = period.HanQuanLyDanhGia.split(' ')[0];
            viTriDanhGiaSelect.value = period.ViTriDG;
            phuongPhapInput.value = period.PhuongPhapDanhGia;
            const tgDate = new Date(period.ThoiGianApDung);
            thangApDungSelect.value = (tgDate.getMonth() + 1).toString().padStart(2, '0');
            namApDungSelect.value = tgDate.getFullYear();
            await populateEmployeeList(period.ViTriDG, period.employee_ids);
            formContainer.style.display = 'block';
        } catch (error) {
            showError('Không thể tải thông tin kỳ đánh giá.');
        }
    }

    function showDeleteConfirm(row) {
        rowToDelete = row;
        confirmPopup.style.display = 'flex';
    }

    viTriDanhGiaSelect.addEventListener('change', () => populateEmployeeList(viTriDanhGiaSelect.value, getSelectedEmployeeIds()));
    checkAllBtn.addEventListener('click', () => employeeListContainer.querySelectorAll('input[name="nhanvien"]').forEach(cb => cb.checked = true));
    uncheckAllBtn.addEventListener('click', () => employeeListContainer.querySelectorAll('input[name="nhanvien"]').forEach(cb => cb.checked = false));
    addBtn.addEventListener('click', () => {
        resetForm();
        isEditing = false;
        formTitle.textContent = 'Thêm kỳ đánh giá';
        saveBtn.textContent = 'Lưu';
        populateEmployeeList('tatca');
        formContainer.style.display = 'block';
    });
    cancelBtn.addEventListener('click', resetForm);

    evaluationForm.addEventListener('submit', async e => {
        e.preventDefault();
        const data = {
            MaKyDG: maKyDGInput.value.trim(),
            TenKyDG: tenKyInput.value.trim(),
            ViTriDG: viTriDanhGiaSelect.value,
            HanQuanLyDanhGia: hanQuanLyDanhGiaInput.value,
            PhuongPhapDanhGia: phuongPhapInput.value.trim(),
            ThoiGianApDung: `${namApDungSelect.value}-${thangApDungSelect.value}-01`,
            MaNV_NguoiTao: currentUserId,
            employee_ids: getSelectedEmployeeIds()
        };

        if (!data.MaKyDG) return showError('Vui lòng nhập Mã kỳ đánh giá.');
        if (!data.TenKyDG) return showError('Vui lòng nhập Tên kỳ đánh giá.');
        if (!data.HanQuanLyDanhGia) return showError('Vui lòng chọn Hạn đánh giá.');
        if (data.employee_ids.length === 0) return showError('Vui lòng chọn ít nhất một nhân viên.');

        try {
            await fetchData(`api/evaluation_periods.php${isEditing ? `?id=${currentRow.dataset.maKyDG}` : ''}`, {
                method: isEditing ? 'PUT' : 'POST',
                body: JSON.stringify(data)
            });
            alert(isEditing ? 'Cập nhật kỳ đánh giá thành công!' : 'Thêm kỳ đánh giá thành công!');
            await loadEvaluationPeriods();
            resetForm();
        } catch (error) {
            showError('Không thể lưu kỳ đánh giá.');
        }
    });

    cancelDelete.addEventListener('click', () => {
        rowToDelete = null;
        confirmPopup.style.display = 'none';
    });

    confirmDelete.addEventListener('click', async () => {
        if (rowToDelete) {
            try {
                await fetchData(`api/evaluation_periods.php?id=${rowToDelete.dataset.maKyDG}`, { method: 'DELETE' });
                alert('Xóa kỳ đánh giá thành công!');
                rowToDelete.remove();
                rowToDelete = null;
                confirmPopup.style.display = 'none';
            } catch (error) {
                showError('Không thể xóa kỳ đánh giá.');
            }
        }
    });

    // Self-Evaluation
    async function loadPeriodsForSelect(selectElement) {
        try {
            const periods = await fetchData('api/evaluation_periods.php');
            selectElement.innerHTML = '<option value="">-- Chọn kỳ đánh giá --</option>';
            periods.forEach(period => {
                selectElement.innerHTML += `<option value="${period.MaKyDG}">${period.TenKyDG} (Hạn: ${formatDate(period.HanQuanLyDanhGia)})</option>`;
            });
        } catch (error) {
            showError('Không thể tải danh sách kỳ đánh giá.');
        }
    }

    if (tuDanhGiaKySelect) {
        loadPeriodsForSelect(tuDanhGiaKySelect);
        saveTuDanhGiaBtn.addEventListener('click', async () => {
            if (!tuDanhGiaKySelect.value) return showError('Vui lòng chọn kỳ đánh giá.');
            const scores = {
                AMSP: document.getElementById('tc1').value,
                AHNV: document.getElementById('tc2').value,
                QuanLy: document.getElementById('tc3').value,
                PhanTich: document.getElementById('tc4').value,
                QLDUAN: document.getElementById('tc5').value,
                GiaiQuyetVanDe: document.getElementById('tc6').value,
                TinhThanTN: document.getElementById('tc7').value,
                ThaiDo: document.getElementById('tc8').value
            };
            if (Object.values(scores).some(score => !score)) return showError('Vui lòng chọn điểm cho tất cả tiêu chí.');
            const comments = document.getElementById('tuNhanXet').value.trim();
            const data = {
                MaPTDG: `PT${Date.now()}`,
                MaNV: currentUserId,
                MaKyDG: tuDanhGiaKySelect.value,
                scores,
                NhanXet: comments
            };
            try {
                await fetchData('api/self_evaluations.php', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                alert('Lưu tự đánh giá thành công!');
                tuDanhGiaKySelect.value = '';
                document.querySelectorAll('#tu-danh-gia select:not(#tuDanhGiaKy)').forEach(s => s.value = '');
                document.getElementById('tuNhanXet').value = '';
            } catch (error) {
                showError('Không thể lưu tự đánh giá.');
            }
        });
    }

    // Manager Evaluation View
    if (xemQlKySelect) {
        loadPeriodsForSelect(xemQlKySelect);
        xemQlKySelect.addEventListener('change', async () => {
            if (!xemQlKySelect.value) {
                ketQuaQlArea.style.display = 'none';
                return;
            }
            try {
                const evaluation = await fetchData(`api/manager_evaluations.php?MaNV=${currentUserId}&MaKyDG=${xemQlKySelect.value}`);
                document.getElementById('maPhieuQl').textContent = evaluation.MAQLDG;
                document.getElementById('ql_tc1').textContent = evaluation.AMSP;
                document.getElementById('ql_tc2').textContent = evaluation.AHNV;
                document.getElementById('ql_tc3').textContent = evaluation.QuanLy;
                document.getElementById('ql_tc4').textContent = evaluation.PhanTich;
                document.getElementById('ql_tc5').textContent = evaluation.QLDUAN;
                document.getElementById('ql_tc6').textContent = evaluation.GiaiQuyetVanDe;
                document.getElementById('ql_tc7').textContent = evaluation.TinhThanTN;
                document.getElementById('ql_tc8').textContent = evaluation.ThaiDo;
                document.getElementById('ql_tongdiem').textContent = evaluation.TongDiem;
                document.getElementById('ql_nhanxet').textContent = evaluation.NhanXet || 'Không có nhận xét';
                ketQuaQlArea.style.display = 'block';
                feedbackCount = 3;
                phanHoiCountMsg.textContent = `(Bạn còn ${feedbackCount} lượt phản hồi)`;
                guiPhanHoiBtn.disabled = false;
                lichSuPhanHoi.innerHTML = '';
                const feedback = await fetchData(`api/feedback.php?MaQLDG=${evaluation.MAQLDG}`);
                feedback.forEach(fb => {
                    const feedbackItem = document.createElement('div');
                    feedbackItem.className = `feedback-item ${fb.MaNV_NguoiGui === currentUserId ? 'employee-feedback' : 'manager-feedback'}`;
                    feedbackItem.innerHTML = `<strong>${fb.MaNV_NguoiGui === currentUserId ? 'Bạn' : 'Quản lý'}:</strong> ${fb.NoiDung} <small>(${new Date(fb.ThoiGianGui).toLocaleDateString('vi-VN')})</small>`;
                    lichSuPhanHoi.appendChild(feedbackItem);
                });
                phanHoiInputArea.style.display = 'none';
            } catch (error) {
                showError('Không tìm thấy đánh giá từ quản lý.');
                ketQuaQlArea.style.display = 'none';
            }
        });

        guiPhanHoiBtn.addEventListener('click', () => {
            if (feedbackCount <= 0) return showError('Bạn đã hết lượt phản hồi.');
            phanHoiInputArea.style.display = 'block';
        });

        cancelPhanHoiBtn.addEventListener('click', () => {
            phanHoiInputArea.style.display = 'none';
            phanHoiText.value = '';
        });

        submitPhanHoiBtn.addEventListener('click', async () => {
            const content = phanHoiText.value.trim();
            if (!content) return showError('Vui lòng nhập nội dung phản hồi.');
            const data = {
                MaPhanHoi: `PH${Date.now()}`,
                MAQLDG: document.getElementById('maPhieuQl').textContent,
                MaNV_NguoiGui: currentUserId,
                NoiDung: content
            };
            try {
                await fetchData('api/feedback.php', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                feedbackCount--;
                phanHoiCountMsg.textContent = `(Bạn còn ${feedbackCount} lượt phản hồi)`;
                const feedbackItem = document.createElement('div');
                feedbackItem.className = 'feedback-item employee-feedback';
                feedbackItem.innerHTML = `<strong>Bạn:</strong> ${content} <small>(${new Date().toLocaleDateString('vi-VN')})</small>`;
                lichSuPhanHoi.appendChild(feedbackItem);
                alert('Gửi phản hồi thành công!');
                phanHoiInputArea.style.display = 'none';
                phanHoiText.value = '';
                if (feedbackCount <= 0) guiPhanHoiBtn.disabled = true;
            } catch (error) {
                showError('Không thể gửi phản hồi.');
            }
        });
    }

    // Subordinate Evaluation
    async function loadSubordinates(kyId) {
        try {
            const employees = await fetchData(`api/employees.php?position=tatca&MaKyDG=${kyId}`);
            subordinateTableBody.innerHTML = '';
            employees.forEach(emp => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${emp.TenNV}</td>
                    <td>${emp.TenVT}</td>
                    <td><span class="status-tag status-${emp.TrangThaiQLDanhGia === 'Đã đánh giá' ? 'completed' : 'pending'}">${emp.TrangThaiQLDanhGia}</span></td>
                    <td><button class="btn btn-primary btn-sm evaluate-btn" data-id="${emp.MaNV}" data-name="${emp.TenNV}">Đánh giá</button></td>
                `;
                subordinateTableBody.appendChild(row);
            });
        } catch (error) {
            showError('Không thể tải danh sách nhân viên.');
        }
    }

    if (danhGiaNvKySelect) {
        loadPeriodsForSelect(danhGiaNvKySelect);
        danhGiaNvKySelect.addEventListener('change', () => {
            employeeEvaluationDetail.style.display = 'none';
            loadSubordinates(danhGiaNvKySelect.value);
        });

        subordinateTableBody.addEventListener('click', async e => {
            const btn = e.target.closest('.evaluate-btn');
            if (!btn) return;
            currentEmpId = btn.dataset.id;
            const empName = btn.dataset.name;
            try {
                const selfEval = await fetchData(`api/self_evaluations.php?MaNV=${currentEmpId}&MaKyDG=${danhGiaNvKySelect.value}`);
                employeeDetailTitle.textContent = `Đánh giá chi tiết cho: ${empName}`;
                const scores = [
                    { label: 'Am hiểu về sản phẩm', value: selfEval.AMSP },
                    { label: 'Am hiểu nghiệp vụ', value: selfEval.AHNV },
                    { label: 'Quản lý', value: selfEval.QuanLy },
                    { label: 'Phân tích', value: selfEval.PhanTich },
                    { label: 'Quản lý dự án', value: selfEval.QLDUAN },
                    { label: 'Giải quyết vấn đề', value: selfEval.GiaiQuyetVanDe },
                    { label: 'Tinh thần trách nhiệm', value: selfEval.TinhThanTN },
                    { label: 'Thái độ', value: selfEval.ThaiDo }
                ];
                employeeSelfScores.innerHTML = scores.map(s => `<li>${s.label}: ${s.value}</li>`).join('');
                employeeSelfComment.textContent = selfEval.NhanXet || 'Không có nhận xét';
                const total = scores.reduce((sum, s) => sum + Number(s.value), 0);
                employeeSelfTotal.textContent = total;
                managerEvaluationForm.reset();
                document.getElementById('managerComment').value = '';
                feedbackHistory.innerHTML = '';
                const feedback = await fetchData(`api/feedback.php?MaNV=${currentEmpId}&MaKyDG=${danhGiaNvKySelect.value}`);
                feedback.forEach(fb => {
                    const feedbackItem = document.createElement('div');
                    feedbackItem.className = `feedback-item ${fb.MaNV_NguoiGui === currentUserId ? 'manager-feedback' : 'employee-feedback'}`;
                    feedbackItem.innerHTML = `<strong>${fb.MaNV_NguoiGui === currentUserId ? 'Bạn' : 'Nhân viên'}:</strong> ${fb.NoiDung} <small>(${new Date(fb.ThoiGianGui).toLocaleDateString('vi-VN')})</small>`;
                    feedbackHistory.appendChild(feedbackItem);
                });
                employeeFeedbackSection.style.display = feedback.length > 0 ? 'block' : 'none';
                managerReplyArea.style.display = 'none';
                employeeEvaluationDetail.style.display = 'block';
            } catch (error) {
                showError('Không thể tải thông tin tự đánh giá.');
            }
        });

        closeEmployeeDetail.addEventListener('click', () => {
            employeeEvaluationDetail.style.display = 'none';
            currentEmpId = null;
        });

        saveManagerEvaluationBtn.addEventListener('click', async () => {
            const scores = {
                AMSP: document.getElementById('mgr_tc1').value,
                AHNV: document.getElementById('mgr_tc2').value,
                QuanLy: document.getElementById('mgr_tc3').value,
                PhanTich: document.getElementById('mgr_tc4').value,
                QLDUAN: document.getElementById('mgr_tc5').value,
                GiaiQuyetVanDe: document.getElementById('mgr_tc6').value,
                TinhThanTN: document.getElementById('mgr_tc7').value,
                ThaiDo: document.getElementById('mgr_tc8').value
            };
            if (Object.values(scores).some(score => !score)) return showError('Vui lòng chọn điểm cho tất cả tiêu chí.');
            const comment = document.getElementById('managerComment').value.trim();
            const data = {
                MAQLDG: `QL${Date.now()}`,
                MaPTDG: `PT${Date.now()}`,
                MaNV: currentEmpId,
                MaNV_QuanLy: currentUserId,
                MaKyDG: danhGiaNvKySelect.value,
                scores,
                NhanXet: comment
            };
            try {
                await fetchData('api/manager_evaluations.php', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                alert('Lưu đánh giá thành công!');
                employeeEvaluationDetail.style.display = 'none';
                loadSubordinates(danhGiaNvKySelect.value);
                currentEmpId = null;
            } catch (error) {
                showError('Không thể lưu đánh giá.');
            }
        });

        sendReplyBtn.addEventListener('click', async () => {
            const content = managerReplyText.value.trim();
            if (!content) return showError('Vui lòng nhập nội dung trả lời.');
            const data = {
                MaPhanHoi: `PH${Date.now()}`,
                MAQLDG: document.getElementById('maPhieuQl').textContent,
                MaNV_NguoiGui: currentUserId,
                NoiDung: content
            };
            try {
                await fetchData('api/feedback.php', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                const feedbackItem = document.createElement('div');
                feedbackItem.className = 'feedback-item manager-feedback';
                feedbackItem.innerHTML = `<strong>Bạn:</strong> ${content} <small>(${new Date().toLocaleDateString('vi-VN')})</small>`;
                feedbackHistory.appendChild(feedbackItem);
                alert('Gửi trả lời thành công!');
                managerReplyArea.style.display = 'none';
                managerReplyText.value = '';
            } catch (error) {
                showError('Không thể gửi trả lời.');
            }
        });
    }

    // Report Generation
    if (baoCaoKySelect) {
        loadPeriodsForSelect(baoCaoKySelect);
        taoBaoCaoBtn.addEventListener('click', async () => {
            if (!baoCaoKySelect.value) return showError('Vui lòng chọn kỳ đánh giá.');
            try {
                const report = await fetchData(`api/reports.php?MaKyDG=${baoCaoKySelect.value}`);
                summaryTableBody.innerHTML = '';
                let totalGt80 = 0, total50_80 = 0, totalLt50 = 0, totalAll = 0;
                report.summary.forEach(dept => {
                    summaryTableBody.innerHTML += `
                        <tr>
                            <td>${dept.department}</td>
                            <td>${dept.gt80}</td>
                            <td>${dept['50_80']}</td>
                            <td>${dept.lt50}</td>
                            <td>${dept.total}</td>
                        </tr>
                    `;
                    totalGt80 += Number(dept.gt80);
                    total50_80 += Number(dept['50_80']);
                    totalLt50 += Number(dept.lt50);
                    totalAll += Number(dept.total);
                });
                document.getElementById('total_gt80').textContent = totalGt80;
                document.getElementById('total_50_80').textContent = total50_80;
                document.getElementById('total_lt50').textContent = totalLt50;
                document.getElementById('total_all').textContent = totalAll;

                top10List.innerHTML = report.top10.map(emp => `<li>${emp.name} (${emp.department}): ${emp.score} điểm</li>`).join('');

                if (chartInstance) chartInstance.destroy();
                chartInstance = new Chart(reportChartCanvas, {
                    type: 'bar',
                    data: {
                        labels: report.summary.map(dept => dept.department),
                        datasets: [
                            { label: '> 80 điểm', data: report.summary.map(dept => dept.gt80), backgroundColor: '#28a745' },
                            { label: '50-80 điểm', data: report.summary.map(dept => dept['50_80']), backgroundColor: '#ffc107' },
                            { label: '< 50 điểm', data: report.summary.map(dept => dept.lt50), backgroundColor: '#dc3545' }
                        ]
                    },
                    options: {
                        scales: { y: { beginAtZero: true } },
                        plugins: { legend: { position: 'top' } }
                    }
                });

                baoCaoContent.style.display = 'block';
            } catch (error) {
                showError('Không thể tạo báo cáo.');
            }
        });

        sendReportBtn.addEventListener('click', async () => {
            const data = {
                MaBC: `BC${Date.now()}`,
                TenBC: `Báo cáo kỳ ${baoCaoKySelect.options[baoCaoKySelect.selectedIndex].text}`,
                NgayLapBC: new Date().toISOString().split('T')[0],
                MaKyDG: baoCaoKySelect.value,
                MaNV_NguoiLap: currentUserId,
                LoaiBaoCao: 'Tổng hợp theo kỳ'
            };
            try {
                await fetchData('api/reports.php', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                alert('Báo cáo đã được gửi cho Giám đốc!');
            } catch (error) {
                showError('Không thể gửi báo cáo.');
            }
        });
    }

    // Initialize
    loadEvaluationPeriods();
    switchTab('thietlap');
    switchSubTab('tu-danh-gia');
});