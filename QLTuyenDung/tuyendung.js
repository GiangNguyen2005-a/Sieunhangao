const pages = {
  interview: `
  <div class="header">
    <h1>Tạo lịch phỏng vấn</h1>
    <p class="sub">Lên lịch phỏng vấn cho ứng viên</p>
  </div>
  <form class="form-area" id="interview-form">
    <div class="form-group">
      <label for="candidate-name">Tên ứng viên</label>
      <input type="text" id="candidate-name" required />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="position">Vị trí ứng tuyển</label>
        <input type="text" id="position" />
      </div>
      <div class="form-group">
        <label for="department">Phòng ban</label>
        <input type="text" id="department" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="date">Ngày phỏng vấn</label>
        <input type="date" id="date" required />
      </div>
      <div class="form-group">
        <label for="time">Giờ phỏng vấn</label>
        <input type="time" id="time" required />
      </div>
      <div class="form-group">
        <label for="method">Hình thức</label>
        <select id="method">
          <option>Trực tiếp</option>
          <option>Online</option>
          <option>Điện thoại</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label for="notes">Ghi chú</label>
      <textarea id="notes" rows="3"></textarea>
    <div class="form-row">
    <button type="submit" class="submit-btn">Tạo lịch</button>
    <button type="search" class="submit-btn">Tra cứu</button>
  </form>
`,

  danhsachlichphongvan: `
<div class="header">
  <h1>Danh sách lịch phỏng vấn</h1>
  <p class="sub">Các lịch đã tạo gần đây</p>
</div>
<div class="form-area">
  <input type="text" id="searchInput" placeholder="Tìm kiếm theo tên, vị trí, phòng ban, hình thức..." />
  <div id="scheduleList" class="schedule-list"></div>
</div>
`,


  recruitment: `
  <div class="header">
    <h1>Tạo tin tuyển dụng</h1>
    <p class="sub">Nhập thông tin chi tiết cho vị trí cần tuyển</p>
  </div>
  <form id="recruitment-form" class="form-area">
    <div class="form-group">
      <label for="job-title">Tiêu đề</label>
      <input type="text" id="job-title" required/>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="batch">Đợt tuyển dụng</label>
        <input type="text" id="batch" placeholder="dd/mm/yyyy" pattern="\\d{2}/\\d{2}/\\d{4}" required />
      </div>
      <div class="form-group">
        <label for="department">Phòng ban</label>
        <input type="text" id="department" />
      </div>
      <div class="form-group">
        <label for="position">Vị trí</label>
        <input type="text" id="position" />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="quantity">Số lượng</label>
        <input type="number" id="quantity" min="1" value="1" />
      </div>
      <div class="form-group">
        <label for="type">Loại hình</label>
        <select id="type">
          <option>Toàn thời gian</option>
          <option>Bán thời gian</option>
          <option>Thực tập</option>
        </select>
      </div>
      <div class="form-group">
        <label for="salary">Mức lương</label>
        <input type="text" id="salary" />
      </div>
    </div>
    <div class="form-group">
      <label for="description">Mô tả công việc</label>
      <textarea id="description" rows="4"></textarea>
    </div>
    <div class="form-group">
      <label for="requirement">Yêu cầu ứng viên</label>
      <textarea id="requirement" rows="4"></textarea>
    <div class="form-row">
    <button type="submit" class="submit-btn">Tạo tin</button>
    <button type="search" class="submit-btn">Tra cứu</button>
  </form>
`,

  danhsachtintuyendung: `
<div class="header">
  <h1>Danh sách tin tuyển dụng</h1>
  <p class="sub">Tất cả các tin đã tạo</p>
</div>
<div class="form-area">
  <input type="text" id="searchInput" placeholder="Tìm kiếm theo tiêu đề, vị trí, phòng ban..." />
  <div id="recruitmentList" class="recruitment-list"></div>
</div>
`,

  evaluation: `
  <div class="header">
    <h1>Đánh giá ứng viên</h1>
    <p class="sub">Nhập thông tin đánh giá ứng viên sau khi phỏng vấn</p>
  </div>
  <form class="form-area" id="evaluation-form">
    <div class="form-group">
      <label for="name">Tên ứng viên:</label>
      <input type="text" id="name" placeholder="VD: Trần Thị B" />
    </div>
    <div class="form-group">
      <label for="position">Vị trí ứng tuyển:</label>
      <input type="text" id="position" placeholder="VD: Nhân viên kinh doanh" />
    </div>
    <div class="form-group">
      <label for="score">Điểm đánh giá (1-10):</label>
      <input type="number" id="score" min="1" max="10" />
    </div>
    <div class="form-group">
      <label for="comment">Nhận xét:</label>
      <textarea id="comment" rows="4" placeholder="Ghi nhận xét chi tiết..."></textarea>
    <div class="form-row">
    <button type="submit" class="submit-btn">Gửi đánh giá</button>
    <button type="search" class="submit-btn">Tra cứu</button>
  </form>
`,

  danhsachdanhgia: `
<div class="header">
  <h1>Danh sách đánh giá ứng viên</h1>
</div>
<div class="form-area">
  <input type="text" id="searchInput" placeholder="Tìm kiếm theo tên, vị trí hoặc nhận xét..." />
  <div class="recruitment-list" id="evaluationList"></div>
</div>
`,

  report: `
  <div class="header">
    <h1>Báo cáo chất lượng tuyển dụng</h1>
    <p class="sub">So sánh số lượng nhân viên đã tuyển với kế hoạch</p>
  </div>
  <form class="report-form" id="report-form">
    <div class="form-group">
      <label for="department">Phòng ban</label>
      <input type="text" id="department" required />
    </div>
    <div class="form-group">
      <label for="month">Tháng</label>
      <input type="month" id="month" required />
    </div>
    <div class="form-group">
      <label for="planned">Số lượng theo kế hoạch</label>
      <input type="number" id="planned" required />
    </div>
    <div class="form-group">
      <label for="actual">Số lượng thực tế</label>
      <input type="number" id="actual" required />
    </div>
    <div class="form-group full-width">
      <label for="note">Ghi chú</label>
      <textarea id="note" placeholder="Ghi chú thêm nếu có"></textarea>
    <div class="form-row">
    <button type="submit" class="submit-btn">Tạo báo cáo</button>
    <button type="search" class="submit-btn">Tra cứu</button>
  </form>
`,

  danhsachbaocao: `
<div class="header">
  <h1>Danh sách báo cáo chất lượng tuyển dụng</h1>
</div>
<div class="form-area">
  <input type="text" id="searchInput" placeholder="Tìm theo phòng ban hoặc tháng..." />
  <div class="report-list" id="contentWrapper"></div>
</div>
`,
  approval: `
<div class="header">
<h1>Phê duyệt ứng viên</h1>
<p class="sub">Danh sách ứng viên chờ phê duyệt từ giám đốc</p>
</div>
<div class="form-area">
<input type="text" id="searchInput" placeholder="Tìm kiếm theo tên ứng viên..." />
<button type="search" class="submit-btn">Tra cứu</button>
<div id="applicantList" class="approval-list"></div>
</div>
`,

  danhsachpheduyet: `
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
`,
};

// Load page content
function loadPage(page) {
  document.getElementById("main-content").innerHTML = pages[page];
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

// thêm
document.addEventListener("DOMContentLoaded", () => {
  const mainNav = document.querySelector('.main-nav');
  if (mainNav) {
      mainNav.addEventListener('click', (e) => {
          if (e.target.closest('a')) {
              e.preventDefault();
              const page = e.target.closest('a').dataset.page;
              // Xóa class active khỏi tất cả các liên kết
              document.querySelectorAll('.main-nav a').forEach(a =>
                  a.classList.remove('active')
              );
              // Thêm class active cho liên kết được click
              e.target.closest('a').classList.add('active');
              // Load trang tương ứng
              loadPage(page);
          }
      });
  }
});

// Sidebar navigation
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
      const page = link.dataset.page;
      if (page) {
          e.preventDefault();
          document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
          link.classList.add('active');
          loadPage(page);
      }
      // Nếu không có data-page (ví dụ link về index.php), để mặc định cho trình duyệt xử lý
  });
});

// FORM: Tạo lịch phỏng vấn
function bindInterviewForm() {
  const form = document.getElementById("interview-form");
  const searchBtn = form.querySelector("button[type='search']");
  const submitBtn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", e => {
      e.preventDefault();

      const data = {
          ten: document.getElementById("candidate-name").value,
          vitri: document.getElementById("position").value,
          phongban: document.getElementById("department").value,
          ngay: document.getElementById("date").value,
          gio: document.getElementById("time").value,
          hinhthuc: document.getElementById("method").value,
          ghichu: document.getElementById("notes").value,
      };

      const stored = JSON.parse(localStorage.getItem("interviewSchedules")) || [];
      stored.push(data);
      localStorage.setItem("interviewSchedules", JSON.stringify(stored));

      loadPage("danhsachlichphongvan");
  });

  searchBtn.addEventListener("click", e => {
      e.preventDefault();
      loadPage("danhsachlichphongvan");
  });
}

// DANH SÁCH LỊCH PHỎNG VẤN
function loadInterviewList() {
  const searchInput = document.getElementById("searchInput");
  const scheduleList = document.getElementById("scheduleList");

  const defaultData = [{
          ten: "Nguyễn Văn A",
          vitri: "Lập trình viên",
          phongban: "CNTT",
          ngay: "2025-04-15",
          gio: "09:00",
          hinhthuc: "Trực tiếp",
          ghichu: "Mang theo laptop cá nhân"
      },
      {
          ten: "Trần Thị B",
          vitri: "Chuyên viên Marketing",
          phongban: "Marketing",
          ngay: "2025-04-16",
          gio: "14:30",
          hinhthuc: "Online",
          ghichu: "Zoom link gửi qua email"
      },
      {
          ten: "Lê Văn C",
          vitri: "Kế toán tổng hợp",
          phongban: "Tài chính",
          ngay: "2025-04-17",
          gio: "10:15",
          hinhthuc: "Trực tiếp",
          ghichu: ""
      }
  ];

  if (!localStorage.getItem("interviewSchedules")) {
      localStorage.setItem("interviewSchedules", JSON.stringify(defaultData));
  }

  function renderList() {
      const stored = JSON.parse(localStorage.getItem("interviewSchedules")) || [];
      const keyword = searchInput.value.toLowerCase();

      const filtered = stored.filter(s =>
          s.ten.toLowerCase().includes(keyword) ||
          s.vitri.toLowerCase().includes(keyword) ||
          s.phongban.toLowerCase().includes(keyword) ||
          s.hinhthuc.toLowerCase().includes(keyword)
      );

      scheduleList.innerHTML = filtered.length === 0 ?
          `<p>Không có lịch nào.</p>` :
          filtered.map(s => `
      <div class="schedule-item">
        <p><strong>Tên ứng viên:</strong> ${s.ten}</p>
        <p><strong>Vị trí:</strong> ${s.vitri}</p>
        <p><strong>Phòng ban:</strong> ${s.phongban}</p>
        <p><strong>Ngày:</strong> ${s.ngay}</p>
        <p><strong>Giờ:</strong> ${s.gio}</p>
        <p><strong>Hình thức:</strong> ${s.hinhthuc}</p>
        <p><strong>Ghi chú:</strong> ${s.ghichu || "Không có"}</p>
      </div>
    `).join("");
  }

  searchInput.addEventListener("input", renderList);
  renderList();
}

function bindRecruitmentForm() {
  const form = document.getElementById("recruitment-form");
  const searchBtn = form.querySelector("button[type='search']");

  form.addEventListener("submit", e => {
      e.preventDefault();

      const data = {
          jobTitle: document.getElementById("job-title").value,
          batch: document.getElementById("batch").value,
          department: document.getElementById("department").value,
          position: document.getElementById("position").value,
          quantity: document.getElementById("quantity").value,
          type: document.getElementById("type").value,
          salary: document.getElementById("salary").value,
          description: document.getElementById("description").value,
          requirement: document.getElementById("requirement").value,
      };

      const stored = JSON.parse(localStorage.getItem("recruitmentList")) || [];
      stored.push(data);
      localStorage.setItem("recruitmentList", JSON.stringify(stored));

      loadPage("danhsachtintuyendung");
  });

  searchBtn.addEventListener("click", e => {
      e.preventDefault();
      loadPage("danhsachtintuyendung");
  });
}

function loadRecruitmentList() {
  const searchInput = document.getElementById("searchInput");
  const listEl = document.getElementById("recruitmentList");

  const defaultData = [{
          jobTitle: "Nhân viên kinh doanh",
          batch: "10/04/2025",
          department: "Kinh doanh",
          position: "Sales",
          quantity: 5,
          type: "Toàn thời gian",
          salary: "15-20 triệu",
          description: "Phụ trách khu vực miền Nam.",
          requirement: "Tốt nghiệp ĐH, có laptop, giao tiếp tốt."
      },
      {
          jobTitle: "Lập trình viên Frontend",
          batch: "15/04/2025",
          department: "IT",
          position: "Frontend Developer",
          quantity: 2,
          type: "Full-time",
          salary: "20-25 triệu",
          description: "Xây dựng giao diện hệ thống nội bộ.",
          requirement: "ReactJS, ít nhất 1 năm kinh nghiệm."
      }
  ];

  if (!localStorage.getItem("recruitmentList")) {
      localStorage.setItem("recruitmentList", JSON.stringify(defaultData));
  }

  function renderList() {
      const keyword = searchInput.value.toLowerCase();
      const stored = JSON.parse(localStorage.getItem("recruitmentList")) || [];

      const filtered = stored.filter(item =>
          item.jobTitle.toLowerCase().includes(keyword) ||
          item.position.toLowerCase().includes(keyword) ||
          item.department.toLowerCase().includes(keyword) ||
          item.batch.toLowerCase().includes(keyword)
      );

      listEl.innerHTML = filtered.length === 0 ?
          "<p>Không tìm thấy tin tuyển dụng nào.</p>" :
          filtered.map(item => `
      <div class="recruitment-item">
        <strong>${item.jobTitle}</strong> - ${item.position} (${item.department}, ${item.batch})
        <p><em>Lương:</em> ${item.salary} | <em>Hình thức:</em> ${item.type} | <em>Số lượng:</em> ${item.quantity}</p>
        <p><strong>Mô tả:</strong> ${item.description}</p>
        <p><strong>Yêu cầu:</strong> ${item.requirement}</p>
      </div>
    `).join("");
  }

  searchInput.addEventListener("input", renderList);
  renderList();
}


function bindEvaluationForm() {
  const form = document.getElementById("evaluation-form");
  const searchBtn = form.querySelector("button[type='search']");

  form.addEventListener("submit", e => {
      e.preventDefault();

      const data = {
          ten: document.getElementById("name").value,
          vitri: document.getElementById("position").value,
          diem: parseInt(document.getElementById("score").value),
          nhanxet: document.getElementById("comment").value
      };

      const stored = JSON.parse(localStorage.getItem("candidateEvaluations")) || [];
      stored.push(data);
      localStorage.setItem("candidateEvaluations", JSON.stringify(stored));

      loadPage("danhsachdanhgia");
  });

  searchBtn.addEventListener("click", e => {
      e.preventDefault();
      loadPage("danhsachdanhgia");
  });
}

function loadEvaluationList() {
  const searchInput = document.getElementById("searchInput");
  const evaluationList = document.getElementById("evaluationList");

  const defaultData = [{
          ten: "Nguyễn Văn A",
          vitri: "Nhân viên kinh doanh",
          diem: 8,
          nhanxet: "Ứng viên có kỹ năng giao tiếp tốt."
      },
      {
          ten: "Trần Thị B",
          vitri: "Chăm sóc khách hàng",
          diem: 7,
          nhanxet: "Phù hợp với công việc, cần đào tạo thêm."
      },
  ];

  if (!localStorage.getItem("candidateEvaluations")) {
      localStorage.setItem("candidateEvaluations", JSON.stringify(defaultData));
  }

  function render() {
      const keyword = searchInput.value.toLowerCase();
      const stored = JSON.parse(localStorage.getItem("candidateEvaluations")) || [];

      const filtered = stored.filter(e =>
          e.ten.toLowerCase().includes(keyword) ||
          e.vitri.toLowerCase().includes(keyword) ||
          e.nhanxet.toLowerCase().includes(keyword)
      );

      evaluationList.innerHTML = "";

      if (filtered.length === 0) {
          evaluationList.innerHTML = "<p>Không có đánh giá nào phù hợp.</p>";
          return;
      }

      filtered.forEach(e => {
          const div = document.createElement("div");
          div.className = "evaluation-item";
          div.innerHTML = `
      <p><strong>Tên ứng viên:</strong> ${e.ten}</p>
      <p><strong>Vị trí ứng tuyển:</strong> ${e.vitri}</p>
      <p><strong>Điểm đánh giá:</strong> ${e.diem}</p>
      <p><strong>Nhận xét:</strong> ${e.nhanxet}</p>
    `;
          evaluationList.appendChild(div);
      });
  }

  searchInput.addEventListener("input", render);
  render();
}

function bindReportForm() {
  const form = document.getElementById("report-form");
  const searchBtn = form.querySelector("button[type='search']");

  form.addEventListener("submit", e => {
      e.preventDefault();

      const data = {
          phongBan: document.getElementById("department").value,
          thang: document.getElementById("month").value,
          keHoach: parseInt(document.getElementById("planned").value),
          thucTe: parseInt(document.getElementById("actual").value),
          ghiChu: document.getElementById("note").value
      };

      const stored = JSON.parse(localStorage.getItem("reportList")) || [];
      stored.push(data);
      localStorage.setItem("reportList", JSON.stringify(stored));

      loadPage("danhsachbaocao");
  });

  searchBtn.addEventListener("click", e => {
      e.preventDefault();
      loadPage("danhsachbaocao");
  });
}


function loadReportList() {
  const wrapper = document.getElementById("contentWrapper");
  const searchInput = document.getElementById("searchInput");

  const defaultData = [{
          phongBan: "Kinh doanh",
          thang: "2024-11",
          keHoach: 10,
          thucTe: 8,
          ghiChu: "Thiếu ứng viên phù hợp"
      },
      {
          phongBan: "IT",
          thang: "2024-12",
          keHoach: 5,
          thucTe: 6,
          ghiChu: "Tuyển vượt nhờ đẩy mạnh referral"
      },
      {
          phongBan: "Marketing",
          thang: "2025-01",
          keHoach: 4,
          thucTe: 4,
          ghiChu: "Đúng kế hoạch"
      },
      {
          phongBan: "Nhân sự",
          thang: "2025-01",
          keHoach: 3,
          thucTe: 2,
          ghiChu: "Thiếu ứng viên"
      }
  ];

  if (!localStorage.getItem("reportList")) {
      localStorage.setItem("reportList", JSON.stringify(defaultData));
  }

  function render() {
      const keyword = searchInput.value.toLowerCase();
      const stored = JSON.parse(localStorage.getItem("reportList")) || [];
      const filtered = stored.filter(item =>
          item.phongBan.toLowerCase().includes(keyword) ||
          item.thang.includes(keyword)
      );

      wrapper.innerHTML = "";

      filtered.forEach((item, index) => {
          const card = document.createElement("div");
          card.className = "report-card";
          card.innerHTML = `
      <div>
        <p><strong>Phòng ban:</strong> ${item.phongBan}</p>
        <p><strong>Tháng:</strong> ${item.thang}</p>
        <p><strong>Kế hoạch:</strong> ${item.keHoach}</p>
        <p><strong>Thực tế:</strong> ${item.thucTe}</p>
        <p><strong>Ghi chú:</strong> ${item.ghiChu}</p>
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
                      label: item.phongBan,
                      data: [item.keHoach, item.thucTe],
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
  }

  searchInput.addEventListener("input", render);
  render();
}


function loadApprovalList() {
  const searchInput = document.getElementById("searchInput");
  const approvalListEl = document.getElementById("approvalList");
  const filterButtons = document.querySelectorAll(".filter-btn");

  const data = JSON.parse(localStorage.getItem("approvalList")) || [];

  let currentFilter = "all";

  function renderList() {
      const keyword = searchInput.value.toLowerCase();
      approvalListEl.innerHTML = "";

      data
          .filter(app => {
              const matchesSearch = app.name.toLowerCase().includes(keyword);
              const matchesFilter =
                  currentFilter === "all" || app.status === currentFilter;
              return matchesSearch && matchesFilter;
          })
          .forEach(app => {
              const item = document.createElement("div");
              item.className = "evaluation-item";
              item.innerHTML = `
        <strong>${app.name}</strong>
        <p>Vị trí: ${app.position}</p>
        <p>Điểm: ${app.score}</p>
        <p><em>${app.note}</em></p>
        <span class="status-label ${
          app.status === "approved" ? "status-approved" : "status-rejected"
        }">
          ${app.status === "approved" ? "ĐÃ PHÊ DUYỆT" : "ĐÃ TỪ CHỐI"}
        </span>
      `;
              approvalListEl.appendChild(item);
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

function bindApprovalForm() {
  const listContainer = document.getElementById("applicantList");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.querySelector("button[type='search']");

  const evaluations = JSON.parse(localStorage.getItem("candidateEvaluations")) || [];
  let approvalData = JSON.parse(localStorage.getItem("approvalList")) || [];

  function render() {
      const keyword = searchInput.value.toLowerCase();
      listContainer.innerHTML = "";

      evaluations.forEach((app, index) => {
          // Nếu đã xử lý rồi thì bỏ qua
          const alreadyHandled = approvalData.find(a => a.name === app.ten && a.position === app.vitri);
          if (alreadyHandled) return;

          if (!app.ten.toLowerCase().includes(keyword)) return;

          const item = document.createElement("div");
          item.className = "evaluation-item";
          item.innerHTML = `
       <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap;">
  <div>
    <strong>${app.ten}</strong>
    <p>Vị trí: ${app.vitri}</p>
    <p>Điểm: ${app.diem}</p>
    <p><em>${app.nhanxet}</em></p>
  </div>
  <div class="actions-inline">
    <button class="btn approve approve-btn">Phê duyệt</button>
    <button class="btn reject reject-btn">Từ chối</button>
  </div>
</div>
`;
          // Gắn sự kiện
          const approveBtn = item.querySelector(".approve-btn");
          const rejectBtn = item.querySelector(".reject-btn");

          approveBtn.addEventListener("click", () => {
              approvalData.push({
                  name: app.ten,
                  position: app.vitri,
                  score: app.diem,
                  note: app.nhanxet,
                  status: "approved"
              });
              localStorage.setItem("approvalList", JSON.stringify(approvalData));
              render(); // cập nhật lại danh sách
          });

          rejectBtn.addEventListener("click", () => {
              approvalData.push({
                  name: app.ten,
                  position: app.vitri,
                  score: app.diem,
                  note: app.nhanxet,
                  status: "rejected"
              });
              localStorage.setItem("approvalList", JSON.stringify(approvalData));
              render(); // cập nhật lại danh sách
          });

          listContainer.appendChild(item);
      });

      if (listContainer.innerHTML === "") {
          listContainer.innerHTML = "<p>Không còn ứng viên cần xử lý.</p>";
      }
  }

  searchBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      loadPage("danhsachpheduyet");
  });

  searchInput?.addEventListener("input", render);
  render();
}

// sửa
// Load default page
loadPage("recruitment");

localStorage.removeItem("interviewSchedules");