// scripts.js

document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("main-content");
  const links = document.querySelectorAll(".nav-links a");

  const employees = [{
          id: "NV123456",
          name: "Nguyễn Văn A",
          department: "Phòng Kế toán"
      },
      {
          id: "NV123457",
          name: "Trần Thị B",
          department: "Phòng Nhân sự"
      },
      {
          id: "NV123458",
          name: "Lê Văn C",
          department: "Phòng IT"
      },
  ];

  const homeTemplate = `
  <div class="wrapper">
    <h1>Chào mừng trở lại!</h1>
    <p>Hệ thống quản lý thuế TNCN</p>
    <div class="menu-wrapper">
      <div class="menu-row">
        <div class="menu-item blue" data-page="form"><div class="icon"><i class="fas fa-file-alt"></i></div>Nhập thông tin thuế</div>
        <div class="menu-item yellow" data-page="declare"><div class="icon"><i class="fas fa-calculator"></i></div>Tạo tờ khai</div>
      </div>
      <div class="menu-row">
        <div class="menu-item green" data-page="xacnhan"><div class="icon"><i class="fas fa-check-circle"></i></div>Xác nhận thuế đã nộp</div>
        <div class="menu-item red" data-page="tracuu"><div class="icon"><i class="fas fa-search"></i></div>Tra cứu thuế</div>
      </div>
    </div>
  </div>`;

  const formTemplate = `
  <div class="wrapper">
    <h1>Nhập thông tin thuế TNCN</h1>
    <form id="taxForm" class="tax-form">
      <div class="form-left">
        ${generateInput("mst", "Mã số thuế")}
        ${generateInput("hoTen", "Họ và tên")}
        ${generateInput("ngaySinh", "Ngày sinh", "date")}
        ${generateInput("cccd", "Số CCCD")}
        ${generateInput("quocTich", "Quốc tịch")}
        ${generateInput("diaChi", "Địa chỉ cư trú")}
      </div>
      <div class="form-right">
        ${generateInput("thuNhap", "Thu nhập chính", "number")}
        ${generateInput("thuong", "Thưởng", "number")}
        ${generateInput("phuCap", "Phụ cấp", "number")}
        ${generateInput("giamTru", "Giảm trừ bản thân", "number")}
        ${generateInput("baoHiem", "Bảo hiểm", "number")}
        <div class="form-group">
          <label for="nhomNV">Nhóm nhân viên:</label>
          <select id="nhomNV">
            <option value="co_hop_dong">Cư trú có HĐLĐ > 3 tháng</option>
            <option value="khong_hop_dong">Cư trú không HĐLĐ (khấu trừ 10%)</option>
            <option value="khong_cu_tru">Không cư trú (khấu trừ 20%)</option>
          </select>
        </div>
        <button type="submit" class="submit-btn">Lưu thông tin</button>
        <button type="button" class="calculate-btn" onclick="tinhThue()">Tính thuế</button>
        <div id="ketQuaThue" class="result" style="display: none;"></div>
      </div>
    </form>
  </div>`;

  const tracuuTemplate = `
  <div class="wrapper">
    <h1>Tra cứu thông tin thuế</h1>
    <form class="search-form">
      <input type="text" id="searchInput" placeholder="Nhập mã số thuế, họ tên hoặc CCCD">
      <button type="submit">🔍 Tra cứu</button>
    </form>
    <div class="result-section" id="resultSection"></div>
  </div>`;

  const declarationTemplate = `
  <div class="wrapper">
    <h1>Chọn nhân viên để tạo tờ khai thuế</h1>
    <div class="employee-card-list" id="employeeCardListDeclare"></div>

    <div class="form-wrapper" style="display: none;">
      <h2>Tạo tờ khai thuế</h2>
      <form class="declaration-form" id="declarationForm">
        ${generateInput("tax-id", "Mã số thuế")}
        ${generateInput("full-name", "Họ và tên")}
        ${generateInput("period", "Kỳ kê khai", "month")}
        ${generateInput("income", "Tổng thu nhập", "number")}
        ${generateInput("tax-amount", "Tổng thuế phải nộp", "number")}
        <button type="submit" class="submit-btn">Tạo tờ khai</button>
      </form>
    </div>
  </div>`;

  const confirmTemplate = `
  <div class="wrapper">
    <h1>Chọn nhân viên để xác nhận đã nộp thuế</h1>
    <div class="employee-card-list" id="employeeCardListConfirm"></div>

    <div class="form-wrapper" style="display: none;">
      <h2>Xác nhận thuế đã nộp</h2>
      <form class="confirm-form" id="confirmForm">
        ${generateInput("mst", "Mã số thuế")}
        ${generateInput("hoTen", "Họ và tên")}
        ${generateInput("ky", "Kỳ tính thuế", "month")}
        ${generateInput("soTien", "Số tiền đã nộp", "number")}
        ${generateInput("ngayNop", "Ngày nộp", "date")}
        <button type="submit" class="submit-btn">Xác nhận</button>
      </form>
      <div id="result" class="result" style="display: none;"></div>
    </div>
  </div>`;

  function generateInput(id, label, type = "text") {
      return `<div class="form-group"><label for="${id}">${label}:</label><input type="${type}" id="${id}" required></div>`;
  }

  function loadEmployeeTable(targetId, employees, handler) {
      const tbody = document.getElementById(targetId);
      if (!tbody) return;
      tbody.innerHTML = "";
      employees.forEach(emp => {
          const row = document.createElement("tr");
          row.innerHTML = `
      <td>${emp.id}</td>
      <td>${emp.name}</td>
      <td>${emp.department}</td>
      <td><button class="select-btn" data-id="${emp.id}" data-name="${emp.name}">Chọn</button></td>
    `;
          row.querySelector(".select-btn").addEventListener("click", () => handler(emp));
          tbody.appendChild(row);
      });
  }

  function selectEmployeeForDeclaration(emp) {
      document.getElementById("tax-id").value = emp.id;
      document.getElementById("full-name").value = emp.name;
      document.querySelector(".form-wrapper").style.display = "block";
  }

  function selectEmployeeForConfirmation(emp) {
      document.getElementById("mst").value = emp.id;
      document.getElementById("hoTen").value = emp.name;
      document.querySelector(".form-wrapper").style.display = "block";
  }

  function loadPage(page) {
      links.forEach(link => link.classList.remove("active"));
      document.querySelector(`[data-page="${page}"]`)?.classList.add("active");

      if (page === "form") {
          content.innerHTML = formTemplate;
          document.getElementById("taxForm")?.addEventListener("submit", e => {
              e.preventDefault();
              alert("Đã lưu thông tin thuế thành công!");
          });
      } else if (page === "tracuu") {
          content.innerHTML = tracuuTemplate;
          document.querySelector(".search-form")?.addEventListener("submit", e => {
              e.preventDefault();
              const input = document.getElementById("searchInput").value.trim();
              const resultSection = document.getElementById("resultSection");

              if (!input) {
                  resultSection.innerHTML = "<p>Vui lòng nhập thông tin để tra cứu.</p>";
              } else {
                  resultSection.innerHTML = `
          <h3>Kết quả tra cứu</h3>
          <p><strong>Họ tên:</strong> Nguyễn Văn B</p>
          <p><strong>Mã số thuế:</strong> 123456789</p>
          <p><strong>CCCD:</strong> 012345678900</p>
          <p><strong>Thuế đã nộp:</strong> 12.000.000 VNĐ</p>`;
              }
          });
      } else if (page === "declare") {
          content.innerHTML = declarationTemplate;
          renderEmployeeCards("employeeCardListDeclare", employees, selectEmployeeForDeclaration);
          document.getElementById("declarationForm")?.addEventListener("submit", e => {
              e.preventDefault();
              const name = document.getElementById("full-name").value;
              const code = `TK-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
              let box = document.getElementById("maToKhaiBox");
              if (!box) {
                  box = document.createElement("div");
                  box.id = "maToKhaiBox";
                  box.className = "result";
                  document.getElementById("declarationForm").appendChild(box);
              }
              box.innerHTML = `✅ Đã tạo tờ khai cho <strong>${name}</strong><br>Mã tờ khai: <strong>${code}</strong>`;
              box.style.display = "block";
          });
      } else if (page === "xacnhan") {
          content.innerHTML = confirmTemplate;
          renderEmployeeCards("employeeCardListConfirm", employees, selectEmployeeForConfirmation);
          document.getElementById("confirmForm")?.addEventListener("submit", e => {
              e.preventDefault();
              const hoTen = document.getElementById("hoTen").value;
              const mst = document.getElementById("mst").value;
              const ky = document.getElementById("ky").value;
              const soTien = document.getElementById("soTien").value;
              const ngayNop = document.getElementById("ngayNop").value;

              const result = document.getElementById("result");
              result.innerHTML = `✅ Đã xác nhận nộp thuế thành công cho <strong>${hoTen}</strong><br>Mã số thuế: ${mst}<br>Kỳ tính thuế: ${ky}<br>Số tiền: ${Number(soTien).toLocaleString("vi-VN")} VND<br>Ngày nộp: ${ngayNop}`;
              result.style.display = "block";
          });
      } else {
          content.innerHTML = homeTemplate;
      }
  }

  links.forEach(link => {
      link.addEventListener("click", e => {
          e.preventDefault();
          loadPage(link.dataset.page);
      });
  });

  document.addEventListener("click", e => {
      const box = e.target.closest(".menu-item");
      if (box?.dataset.page) {
          loadPage(box.dataset.page);
      }
  });

  loadPage("tracuu");
});

function renderEmployeeCards(containerId, data, handler) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  data.forEach(emp => {
      const card = document.createElement("div");
      card.className = "employee-card";
      card.innerHTML = `
    <h3>${emp.name}</h3>
    <p><strong>Mã NV:</strong> ${emp.id}</p>
    <p><strong>Phòng ban:</strong> ${emp.department}</p>
    <button class="select-btn">Chọn</button>
  `;
      card.querySelector("button").addEventListener("click", () => handler(emp));
      container.appendChild(card);
  });
}