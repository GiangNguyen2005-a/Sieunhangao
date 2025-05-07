// Hàm tải nội dung trang từ template
function loadPage(page) {
    const mainContent = document.getElementById("main-content");
    const template = document.getElementById(`${page}-template`);
    
    if (template) {
        mainContent.innerHTML = '';
        mainContent.appendChild(template.content.cloneNode(true));
    } else {
        // Trang mặc định nếu không tìm thấy template
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
    }

    // Gắn các hàm xử lý cho từng trang
    if (page === "interview") bindInterviewForm();
    if (page === "danhsachlichphongvan") loadInterviewList();
    if (page === "recruitment") bindRecruitmentForm();
    if (page === "danhsachtintuyendung") loadRecruitmentList();
    if (page === "evaluation") bindEvaluationForm();
    if (page === "danhsachdanhgia") loadEvaluationList();
    if (page === "report") bindReportForm();
    if (page === "danhsachbaocao") loadReportList();
    if (page === "approval") bindApprovalForm();
    if (page === "danhsachpheduyet") loadApprovalList();
}

// Hàm mã hóa HTML để tránh XSS
function escapeHTML(str) {
    // Kiểm tra nếu str không phải chuỗi, trả về chuỗi rỗng hoặc giá trị mặc định
    if (typeof str !== 'string' || str === null || str === undefined) {
        return '';
    }
    return str
        .replace(/&/g, "&")
        .replace(/</g, "<")
        .replace(/>/g, ">")
        .replace(/"/g, "\"")
        .replace(/'/g, "'");
}

// Xử lý sự kiện khi trang tải
document.addEventListener("DOMContentLoaded", () => {
    const mainNav = document.querySelector('.main-nav');
    if (mainNav) {
        mainNav.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                e.preventDefault();
                const page = e.target.closest('a').dataset.page;
                document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
                e.target.closest('a').classList.add('active');
                loadPage(page);
            }
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', e => {
            const page = link.dataset.page;
            if (page) {
                e.preventDefault();
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
                loadPage(page);
            }
        });
    });

    document.addEventListener('click', (e) => {
        const actionBox = e.target.closest('.action-box');
        if (actionBox) {
            e.preventDefault();
            const page = actionBox.getAttribute('data-page');
            loadPage(page);
        }
    });

    // Tải trang mặc định
    loadPage("recruitment");
});

// FORM: Tạo lịch phỏng vấn
function bindInterviewForm() {
    const form = document.getElementById("interview-form");
    const searchBtn = form.querySelector("button[type='button']");

    form.addEventListener("submit", e => {
        const maUV = document.getElementById("MaUV").value;
        if (!maUV) {
            e.preventDefault();
            alert("Vui lòng nhập mã ứng viên!");
        }
    });

    searchBtn.addEventListener("click", e => {
        e.preventDefault();
        loadPage("danhsachlichphongvan");
    });
}

// DANH SÁCH LỊCH PHỎNG VẤN
function loadInterviewList() {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
        <div class="header">
            <h1>Danh sách lịch phỏng vấn</h1>
            <p class="sub">Các lịch đã tạo gần đây</p>
        </div>
        <div class="form-area">
            <input type="text" id="searchInput" placeholder="Tìm kiếm theo mã ứng viên, vị trí, hình thức..." />
            <div id="scheduleList" class="schedule-list"></div>
        </div>
    `;

    const searchInput = document.getElementById("searchInput");
    const scheduleList = document.getElementById("scheduleList");

    function renderList() {
        const keyword = searchInput.value;

        fetch(`lay_danhsachlichphongvan.php?keyword=${encodeURIComponent(keyword)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error("Dữ liệu trả về không phải là mảng!");
                }
                scheduleList.innerHTML = data.length === 0
                    ? `<p>Không có lịch nào.</p>`
                    : data.map(s => `
                        <div class="schedule-item">
                            <p><strong>Mã ứng viên:</strong> ${escapeHTML(s.MaUV)}</p>
                            <p><strong>Mã tin:</strong> ${escapeHTML(s.MaTin)}</p>
                            <p><strong>Vị trí:</strong> ${escapeHTML(s.ViTri)}</p>
                            <p><strong>Ngày:</strong> ${escapeHTML(s.NgayPV)}</p>
                            <p><strong>Giờ:</strong> ${escapeHTML(s.GioPV)}</p>
                            <p><strong>Hình thức:</strong> ${escapeHTML(s.HinhThuc)}</p>
                            <p><strong>Ghi chú:</strong> ${escapeHTML(s.GhiChu || "Không có")}</p>
                        </div>
                    `).join("");
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách lịch phỏng vấn:", error.message);
                scheduleList.innerHTML = `<p>Lỗi khi tải danh sách: ${error.message}</p>`;
            });
    }

    searchInput.addEventListener("input", renderList);
    renderList();
}

// FORM: Tạo tin tuyển dụng
function bindRecruitmentForm() {
    const form = document.getElementById("recruitment-form");
    const searchBtn = form.querySelector("button[type='button']");

    form.addEventListener("submit", e => {
        const jobTitle = document.getElementById("job-title").value;
        if (!jobTitle) {
            e.preventDefault();
            alert("Vui lòng nhập tiêu đề!");
        }
    });

    searchBtn.addEventListener("click", e => {
        e.preventDefault();
        loadPage("danhsachtintuyendung");
    });
}

// DANH SÁCH TIN TUYỂN DỤNG
function loadRecruitmentList() {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
        <div class="header">
            <h1>Danh sách tin tuyển dụng</h1>
            <p class="sub">Tất cả các tin đã tạo</p>
        </div>
        <div class="form-area">
            <input type="text" id="searchInput" placeholder="Tìm kiếm theo tiêu đề, vị trí, phòng ban..." />
            <div id="recruitmentList" class="recruitment-list"></div>
        </div>
    `;

    const searchInput = document.getElementById("searchInput");
    const listEl = document.getElementById("recruitmentList");

    function renderList() {
        const keyword = searchInput.value;

        fetch(`lay_danhsachtintuyendung.php?keyword=${encodeURIComponent(keyword)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error("Dữ liệu trả về không phải là mảng!");
                }
                listEl.innerHTML = data.length === 0
                    ? "<p>Không tìm thấy tin tuyển dụng nào.</p>"
                    : data.map(item => `
                        <div class="recruitment-item">
                            <strong>${escapeHTML(item.TieuDe)}</strong> - ${escapeHTML(item.ViTri)} (${escapeHTML(item.PhongBan)}, ${escapeHTML(item.DotTuyenDung)})
                            <p><em>Lương:</em> ${escapeHTML(item.MucLuong)} | <em>Hình thức:</em> ${escapeHTML(item.LoaiHinh)} | <em>Số lượng:</em> ${escapeHTML(item.SoLuong)}</p>
                            <p><strong>Mô tả:</strong> ${escapeHTML(item.MoTa)}</p>
                            <p><strong>Yêu cầu:</strong> ${escapeHTML(item.YeuCau)}</p>
                        </div>
                    `).join("");
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách tin tuyển dụng:", error.message);
                listEl.innerHTML = `<p>Lỗi khi tải danh sách: ${error.message}</p>`;
            });
    }

    searchInput.addEventListener("input", renderList);
    renderList();
}

// FORM: Đánh giá ứng viên
function bindEvaluationForm() {
    const form = document.getElementById("evaluation-form");
    const searchBtn = form.querySelector("button[type='button']");

    form.addEventListener("submit", e => {
        const name = document.getElementById("name").value;
        const score = document.getElementById("score").value;
        if (!name) {
            e.preventDefault();
            alert("Vui lòng nhập tên ứng viên!");
        }
        if (score < 1 || score > 10) {
            e.preventDefault();
            alert("Điểm đánh giá phải từ 1 đến 10!");
        }
    });

    searchBtn.addEventListener("click", e => {
        e.preventDefault();
        loadPage("danhsachdanhgia");
    });
}

// DANH SÁCH ĐÁNH GIÁ ỨNG VIÊN
function loadEvaluationList() {
    const mainContent = document.getElementById("main-content");
    const template = document.getElementById("evaluation-list-template");
    mainContent.innerHTML = '';
    mainContent.appendChild(template.content.cloneNode(true));

    const searchInput = document.getElementById("searchInput");
    const evaluationList = document.getElementById("evaluationList");

    function render() {
        const keyword = searchInput.value;

        fetch(`lay_danhsachdanhgia.php?keyword=${encodeURIComponent(keyword)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error("Dữ liệu trả về không phải là mảng!");
                }
                evaluationList.innerHTML = data.length === 0
                    ? "<p>Không có đánh giá nào phù hợp.</p>"
                    : data.map(e => `
                        <div class="evaluation-item">
                            <p><strong>Tên ứng viên:</strong> ${escapeHTML(e.TenUV)}</p>
                            <p><strong>Vị trí ứng tuyển:</strong> ${escapeHTML(e.ViTriUV)}</p>
                            <p><strong>Điểm đánh giá:</strong> ${e.Diem || '-'}</p>
                            <p><strong>Nhận xét:</strong> ${escapeHTML(e.NhanXet || '-')}</p>
                            <p><strong>Ngày đánh giá:</strong> ${escapeHTML(e.NgayDanhGia)}</p>
                        </div>
                    `).join("");
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách đánh giá:", error.message);
                evaluationList.innerHTML = `<p>Lỗi khi tải danh sách: ${error.message}</p>`;
            });
    }

    window.renderEvaluationList = render;

    searchInput.addEventListener("input", render);
    render();
}

// FORM: Báo cáo chất lượng
function bindReportForm() {
    const form = document.getElementById("report-form");
    const searchBtn = form.querySelector("button[type='button']");

    form.addEventListener("submit", e => {
        const department = document.getElementById("department").value;
        const month = document.getElementById("month").value;
        const planned = document.getElementById("planned").value;
        const actual = document.getElementById("actual").value;

        if (!department || !month || !planned || !actual) {
            e.preventDefault();
            alert("Vui lòng điền đầy đủ thông tin!");
        }
    });

    searchBtn.addEventListener("click", e => {
        e.preventDefault();
        loadPage("danhsachbaocao");
    });
}

// DANH SÁCH BÁO CÁO
function loadReportList() {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
        <div class="header">
            <h1>Danh sách báo cáo chất lượng tuyển dụng</h1>
        </div>
        <div class="form-area">
            <input type="text" id="searchInput" placeholder="Tìm theo phòng ban hoặc tháng..." />
            <div class="report-list" id="contentWrapper"></div>
        </div>
    `;

    const wrapper = document.getElementById("contentWrapper");
    const searchInput = document.getElementById("searchInput");

    function render() {
        const keyword = searchInput.value;

        fetch(`lay_danhsachbaocao.php?keyword=${encodeURIComponent(keyword)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error("Dữ liệu trả về không phải là mảng!");
                }
                wrapper.innerHTML = "";
                if (data.length === 0) {
                    wrapper.innerHTML = "<p>Không tìm thấy báo cáo nào.</p>";
                    return;
                }
                data.forEach((item, index) => {
                    const card = document.createElement("div");
                    card.className = "report-card";
                    card.innerHTML = `
                        <div>
                            <p><strong>Phòng ban:</strong> ${escapeHTML(item.PhongBan)}</p>
                            <p><strong>Tháng:</strong> ${escapeHTML(item.Thang)}</p>
                            <p><strong>Kế hoạch:</strong> ${escapeHTML(item.SoLuongKeHoach)}</p>
                            <p><strong>Thực tế:</strong> ${escapeHTML(item.SoLuongThucTe)}</p>
                            <p><strong>Ghi chú:</strong> ${escapeHTML(item.GhiChu)}</p>
                        </div>
                        <div class="chart-container">
                            <canvas id="chart-${index}"></canvas>
                        </div>
                    `;
                    wrapper.appendChild(card);

                    const ctx = document.getElementById(`chart-${index}`);
                    new Chart(ctx, {
                        type: "bar",
                        data: {
                            labels: ["Kế hoạch", "Thực tế"],
                            datasets: [{
                                label: escapeHTML(item.PhongBan),
                                data: [item.SoLuongKeHoach, item.SoLuongThucTe],
                                backgroundColor: ["#4fc3f7", "#81d4fa"]
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                });
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách báo cáo:", error.message);
                wrapper.innerHTML = `<p>Lỗi khi tải danh sách: ${error.message}</p>`;
            });
    }

    searchInput.addEventListener("input", render);
    render();
}

// FORM: Phê duyệt ứng viên
function bindApprovalForm() {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
        <div class="header">
            <h1>Phê duyệt ứng viên</h1>
            <p class="sub">Danh sách ứng viên chờ phê duyệt từ giám đốc</p>
        </div>
        <div class="form-area">
            <div class="filter-area">
                <input type="text" id="searchInput" placeholder="Tìm kiếm theo tên ứng viên..." />
                <button type="button" class="submit-btn" onclick="loadPage('danhsachpheduyet')">Xem danh sách đã phê duyệt</button>
            </div>
            <div id="applicantList" class="approval-list"></div>
        </div>
    `;

    const listContainer = document.getElementById("applicantList");
    const searchInput = document.getElementById("searchInput");

    function render() {
        const keyword = searchInput.value.toLowerCase();

        Promise.all([
            fetch(`lay_danhsachpheduyet.php?keyword=${encodeURIComponent(keyword)}`).then(res => res.json()),
            fetch(`lay_danhsachpheduyet.php`).then(res => res.json())
        ]).then(([evaluations, approvals]) => {
            listContainer.innerHTML = "";
            evaluations.forEach((app, index) => {
                const alreadyHandled = approvals.find(a => a.TenUV === app.TenUV && a.ViTriUV === app.ViTriUV && a.TrangThai !== "Chờ duyệt");
                if (!alreadyHandled) {
                    if (!app.TenUV.toLowerCase().includes(keyword)) return;

                    const item = document.createElement("div");
                    item.className = "evaluation-item";
                    item.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap;">
                            <div>
                                <strong>${escapeHTML(app.TenUV)}</strong>
                                <p>Vị trí: ${escapeHTML(app.ViTriUV)}</p>
                                <p>Điểm: ${app.Diem}</p>
                                <p><em>${escapeHTML(app.NhanXet)}</em></p>
                            </div>
                            <div class="actions-inline">
                                <button class="btn approve approve-btn" data-index="${index}" data-tenuv="${escapeHTML(app.TenUV)}" data-vitriuv="${escapeHTML(app.ViTriUV)}">Phê duyệt</button>
                                <button class="btn reject reject-btn" data-index="${index}" data-tenuv="${escapeHTML(app.TenUV)}" data-vitriuv="${escapeHTML(app.ViTriUV)}">Từ chối</button>
                            </div>
                        </div>
                    `;
                    listContainer.appendChild(item);

                    // Xử lý nút Phê duyệt
                    item.querySelector(".approve-btn").addEventListener("click", () => {
                        if (!confirm("Bạn có chắc chắn muốn phê duyệt ứng viên này?")) return;
                        const tenUV = item.querySelector(".approve-btn").getAttribute("data-tenuv").trim();
                        const viTriUV = item.querySelector(".approve-btn").getAttribute("data-vitriuv").trim();
                        const lyDo = prompt("Nhập lý do phê duyệt:");
                        if (lyDo === null) return; // Thoát nếu nhấn Cancel
                        // Hiển thị loading
                        const btn = item.querySelector(".approve-btn");
                        btn.innerHTML = "Đang xử lý...";
                        btn.disabled = true;
                        fetch("xu_ly_pheduyet.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            body: `TenUV=${encodeURIComponent(tenUV)}&ViTriUV=${encodeURIComponent(viTriUV)}&TrangThai=approved&LyDo=${encodeURIComponent(lyDo || "")}`
                        })
                        .then(response => {
                            if (!response.ok) throw new Error("Lỗi mạng: " + response.status);
                            return response.json();
                        })
                        .then(data => {
                            if (data.success) {
                                loadPage("danhsachpheduyet");
                            } else {
                                alert(data.message);
                            }
                        })
                        .catch(error => {
                            console.error("Lỗi khi gửi yêu cầu:", error);
                            alert("Đã có lỗi xảy ra. Vui lòng thử lại!");
                        })
                        .finally(() => {
                            btn.innerHTML = "Phê duyệt";
                            btn.disabled = false;
                        });
                    });

                    // Xử lý nút Từ chối
                    item.querySelector(".reject-btn").addEventListener("click", () => {
                        if (!confirm("Bạn có chắc chắn muốn từ chối ứng viên này?")) return;
                        const tenUV = item.querySelector(".reject-btn").getAttribute("data-tenuv").trim();
                        const viTriUV = item.querySelector(".reject-btn").getAttribute("data-vitriuv").trim();
                        const lyDo = prompt("Nhập lý do từ chối:");
                        if (lyDo === null) return; // Thoát nếu nhấn Cancel
                        // Hiển thị loading
                        const btn = item.querySelector(".reject-btn");
                        btn.innerHTML = "Đang xử lý...";
                        btn.disabled = true;
                        fetch("xu_ly_pheduyet.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            body: `TenUV=${encodeURIComponent(tenUV)}&ViTriUV=${encodeURIComponent(viTriUV)}&TrangThai=rejected&LyDo=${encodeURIComponent(lyDo || "")}`
                        })
                        .then(response => {
                            if (!response.ok) throw new Error("Lỗi mạng: " + response.status);
                            return response.json();
                        })
                        .then(data => {
                            if (data.success) {
                                loadPage("danhsachpheduyet");
                            } else {
                                alert(data.message);
                            }
                        })
                        .catch(error => {
                            console.error("Lỗi khi gửi yêu cầu:", error);
                            alert("Đã có lỗi xảy ra. Vui lòng thử lại!");
                        })
                        .finally(() => {
                            btn.innerHTML = "Từ chối";
                            btn.disabled = false;
                        });
                    });
                }
            });

            if (listContainer.innerHTML === "") {
                listContainer.innerHTML = "<p>Không còn ứng viên cần xử lý.</p>";
            }
        }).catch(error => {
            console.error("Lỗi khi lấy danh sách ứng viên:", error);
            listContainer.innerHTML = "<p>Lỗi khi tải danh sách.</p>";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", render);
    } else {
        console.error("Không tìm thấy searchInput!");
    }
    render();
}

// DANH SÁCH PHÊ DUYỆT
function loadApprovalList(keyword = '', status = '') {
    const mainContent = document.getElementById("main-content");
    const template = document.getElementById("danhsachpheduyet-template");
    mainContent.innerHTML = '';
    mainContent.appendChild(template.content.cloneNode(true));

    const searchInput = document.getElementById("searchApproval");
    const filterStatus = document.getElementById("filterStatus");
    const tbody = document.querySelector("#approvalTable tbody");

    function renderApprovalList() {
        const keyword = searchInput ? searchInput.value || '' : '';
        const status = filterStatus ? filterStatus.value || '' : '';

        fetch(`lay_danhsachpheduyet.php?keyword=${encodeURIComponent(keyword)}&status=${encodeURIComponent(status)}`)
            .then(response => {
                if (!response.ok) throw new Error("Lỗi mạng: " + response.status);
                return response.json();
            })
            .then(data => {
                tbody.innerHTML = '';
                if (data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6">Không có ứng viên nào.</td></tr>';
                } else {
                    data.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${escapeHTML(item.TenUV || '-')}</td>
                            <td>${escapeHTML(item.ViTriUV || '-')}</td>
                            <td>${item.Diem || '-'}</td>
                            <td>${escapeHTML(item.NhanXet || '-')}</td>
                            <td>${escapeHTML(item.TrangThai || 'Chờ duyệt')}</td>
                            <td>${escapeHTML(item.LyDo || '-')}</td>
                        `;
                        tbody.appendChild(row);
                    });
                }
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách phê duyệt:", error);
                tbody.innerHTML = '<tr><td colspan="6">Lỗi khi tải dữ liệu.</td></tr>';
            });
    }

    window.renderApprovalList = renderApprovalList;
    if (searchInput) searchInput.addEventListener("input", renderApprovalList);
    if (filterStatus) filterStatus.addEventListener("change", renderApprovalList);
    renderApprovalList();
}