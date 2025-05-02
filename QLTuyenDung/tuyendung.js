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
  
    // Xử lý sidebar navigation
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
  
    // Xử lý click cho action box
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
            .then(response => response.json())
            .then(data => {
                scheduleList.innerHTML = data.length === 0
                    ? `<p>Không có lịch nào.</p>`
                    : data.map(s => `
                        <div class="schedule-item">
                            <p><strong>Mã ứng viên:</strong> ${s.MaUV}</p>
                            <p><strong>Mã tin:</strong> ${s.MaTin}</p>
                            <p><strong>Vị trí:</strong> ${s.ViTri}</p>
                            <p><strong>Ngày:</strong> ${s.NgayPV}</p>
                            <p><strong>Giờ:</strong> ${s.GioPV}</p>
                            <p><strong>Hình thức:</strong> ${s.HinhThuc}</p>
                            <p><strong>Ghi chú:</strong> ${s.GhiChu || "Không có"}</p>
                        </div>
                    `).join("");
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách lịch phỏng vấn:", error);
                scheduleList.innerHTML = "<p>Lỗi khi tải danh sách.</p>";
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
            .then(response => response.json())
            .then(data => {
                listEl.innerHTML = data.length === 0
                    ? "<p>Không tìm thấy tin tuyển dụng nào.</p>"
                    : data.map(item => `
                        <div class="recruitment-item">
                            <strong>${item.TieuDe}</strong> - ${item.ViTri} (${item.PhongBan}, ${item.DotTuyenDung})
                            <p><em>Lương:</em> ${item.MucLuong} | <em>Hình thức:</em> ${item.LoaiHinh} | <em>Số lượng:</em> ${item.SoLuong}</p>
                            <p><strong>Mô tả:</strong> ${item.MoTa}</p>
                            <p><strong>Yêu cầu:</strong> ${item.YeuCau}</p>
                        </div>
                    `).join("");
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách tin tuyển dụng:", error);
                listEl.innerHTML = "<p>Lỗi khi tải danh sách.</p>";
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
        // Form sẽ gửi đến them_danhgia.php
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
            .then(response => response.json())
            .then(data => {
                evaluationList.innerHTML = data.length === 0
                    ? "<p>Không có đánh giá nào phù hợp.</p>"
                    : data.map(e => `
                        <div class="evaluation-item">
                            <p><strong>Tên ứng viên:</strong> ${e.TenUV}</p>
                            <p><strong>Vị trí ứng tuyển:</strong> ${e.ViTriUV}</p>
                            <p><strong>Điểm đánh giá:</strong> ${e.Diem}</p>
                            <p><strong>Nhận xét:</strong> ${e.NhanXet}</p>
                            <p><贯彻落实
  
  System: **strong>Ngày đánh giá:</strong> ${e.NgayDanhGia || 'Không có'}</p>
                        </div>
                    `).join("");
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách đánh giá:", error);
                evaluationList.innerHTML = "<p>Lỗi khi tải danh sách.</p>";
            });
    }
  
    // Gắn hàm render vào window để nút Tìm kiếm có thể gọi
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
        const planned = document.getElementById("planned").value;
        const actual = document.getElementById("actual").value;
        if (!department) {
            e.preventDefault();
            alert("Vui lòng nhập phòng ban!");
        }
        if (planned < 0 || actual < 0) {
            e.preventDefault();
            alert("Số lượng không được âm!");
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
            .then(response => response.json())
            .then(data => {
                wrapper.innerHTML = "";
                data.forEach((item, index) => {
                    const card = document.createElement("div");
                    card.className = "report-card";
                    card.innerHTML = `
                        <div>
                            <p><strong>Phòng ban:</strong> ${item.PhongBan}</p>
                            <p><strong>Tháng:</strong> ${item.Thang}</p>
                            <p><strong>Kế hoạch:</strong> ${item.SoLuongKeHoach}</p>
                            <p><strong>Thực tế:</strong> ${item.SoLuongThucTe}</p>
                            <p><strong>Ghi chú:</strong> ${item.GhiChu}</p>
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
                                label: item.PhongBan,
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
                console.error("Lỗi khi lấy danh sách báo cáo:", error);
                wrapper.innerHTML = "<p>Lỗi khi tải danh sách.</p>";
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
            <input type="text" id="searchInput" placeholder="Tìm kiếm theo tên ứng viên..." />
            <button type="button" class="submit-btn" onclick="loadPage('danhsachpheduyet')">Tra cứu</button>
            <div id="applicantList" class="approval-list"></div>
        </div>
    `;
  
    const listContainer = document.getElementById("applicantList");
    const searchInput = document.getElementById("searchInput");
  
    function render() {
        const keyword = searchInput.value;
  
        fetch(`lay_danhsachdanhgia.php?keyword=${encodeURIComponent(keyword)}`)
            .then(response => response.json())
            .then(evaluations => {
                fetch("lay_danhsachpheduyet.php")
                    .then(res => res.json())
                    .then(approvalData => {
                        listContainer.innerHTML = "";
                        evaluations.forEach((app, index) => {
                            const alreadyHandled = approvalData.find(a => a.TenUV === app.TenUV && a.ViTriUV === app.ViTriUV);
                            if (alreadyHandled) return;
  
                            if (!app.TenUV.toLowerCase().includes(keyword.toLowerCase())) return;
  
                            const item = document.createElement("div");
                            item.className = "evaluation-item";
                            item.innerHTML = `
                                <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap;">
                                    <div>
                                        <strong>${app.TenUV}</strong>
                                        <p>Vị trí: ${app.ViTriUV}</p>
                                        <p>Điểm: ${app.Diem}</p>
                                        <p><em>${app.NhanXet}</em></p>
                                    </div>
                                    <div class="actions-inline">
                                        <button class="btn approve approve-btn" data-index="${index}">Phê duyệt</button>
                                        <button class="btn reject reject-btn" data-index="${index}">Từ chối</button>
                                    </div>
                                </div>
                            `;
                            listContainer.appendChild(item);
  
                            item.querySelector(".approve-btn").addEventListener("click", () => {
                                fetch("xu_ly_pheduyet.php", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                                    body: `TenUV=${encodeURIComponent(app.TenUV)}&ViTriUV=${encodeURIComponent(app.ViTriUV)}&TrangThai=approved`
                                }).then(() => render());
                            });
  
                            item.querySelector(".reject-btn").addEventListener("click", () => {
                                const lyDo = prompt("Nhập lý do từ chối (nếu có):");
                                fetch("xu_ly_pheduyet.php", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                                    body: `TenUV=${encodeURIComponent(app.TenUV)}&ViTriUV=${encodeURIComponent(app.ViTriUV)}&TrangThai=rejected&LyDo=${encodeURIComponent(lyDo || "")}`
                                }).then(() => render());
                            });
                        });
  
                        if (listContainer.innerHTML === "") {
                            listContainer.innerHTML = "<p>Không còn ứng viên cần xử lý.</p>";
                        }
                    });
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách ứng viên:", error);
                listContainer.innerHTML = "<p>Lỗi khi tải danh sách.</p>";
            });
    }
  
    searchInput?.addEventListener("input", render);
    render();
  }
  
  // DANH SÁCH PHÊ DUYỆT
  function loadApprovalList() {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `
        <div class="header">
            <h1>Danh sách phê duyệt ứng viên</h1>
            <p>Tra cứu trạng thái phê duyệt các ứng viên</p>
            <input type="text" id="searchInput" placeholder="Tìm kiếm theo tên ứng viên..." />
            <div class="filter-buttons">
                <button class="filter-btn active" data-status="all">Tất cả</button>
                <button class="filter-btn" data-status="approved">Phê duyệt</button>
                <button class="filter-btn" data-status="rejected">Từ chối</button>
            </div>
            <div class="recruitment-list" id="approvalList"></div>
        </div>
    `;
  
    const searchInput = document.getElementById("searchInput");
    const approvalListEl = document.getElementById("approvalList");
    const filterButtons = document.querySelectorAll(".filter-btn");
  
    let currentFilter = "all";
  
    function renderList() {
        const keyword = searchInput.value;
  
        fetch(`lay_danhsachpheduyet.php?keyword=${encodeURIComponent(keyword)}`)
            .then(response => response.json())
            .then(data => {
                approvalListEl.innerHTML = "";
                data
                    .filter(app => {
                        const matchesSearch = app.TenUV.toLowerCase().includes(keyword.toLowerCase());
                        const matchesFilter = currentFilter === "all" || app.TrangThai === currentFilter;
                        return matchesSearch && matchesFilter;
                    })
                    .forEach(app => {
                        const item = document.createElement("div");
                        item.className = "evaluation-item";
                        item.innerHTML = `
                            <strong>${app.TenUV}</strong>
                            <p>Vị trí: ${app.ViTriUV}</p>
                            <p>Điểm: ${app.Diem}</p>
                            <p><em>${app.NhanXet}</em></p>
                            <span class="status-label ${app.TrangThai === "approved" ? "status-approved" : "status-rejected"}">
                                ${app.TrangThai === "approved" ? "ĐÃ PHÊ DUYỆT" : "ĐÃ TỪ CHỐI"}
                            </span>
                            ${app.LyDo ? `<p><strong>Lý do:</strong> ${app.LyDo}</p>` : ""}
                        `;
                        approvalListEl.appendChild(item);
                    });
  
                if (approvalListEl.innerHTML === "") {
                    approvalListEl.innerHTML = "<p>Không có dữ liệu phê duyệt.</p>";
                }
            })
            .catch(error => {
                console.error("Lỗi khi lấy danh sách phê duyệt:", error);
                approvalListEl.innerHTML = "<p>Lỗi khi tải danh sách.</p>";
            });
    }
  
    searchInput.addEventListener("input", renderList);
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.status;
            renderList();
        });
    });
  
    renderList();
  }