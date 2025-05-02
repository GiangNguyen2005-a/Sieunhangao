document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("main-content");
  const links = document.querySelectorAll(".nav-links a");
  let employees = [];

  // Lấy danh sách nhân viên từ backend
  fetch("get_employees.php")
    .then(response => response.json())
    .then(data => {
      employees = data;
      loadPage("tracuu");
    })
    .catch(error => console.error("Lỗi khi lấy danh sách nhân viên:", error));

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
        ${generateInput("maNV", "Mã nhân viên")}
        ${generateInput("hoTen", "Họ và tên")}
        ${generateInput("ngaySinh", "Ngày sinh", "date")}
        ${generateInput("cccd", "Số CCCD")}
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
    <div class="employee-card-list" id="employeeCardListTax"></div>
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
    <form class="search-form" id="searchEmployeeForm">
      <input type="text" id="searchEmployee" placeholder="Nhập mã nhân viên hoặc tên nhân viên...">
      <button type="submit">🔍 Tìm kiếm</button>
    </form>
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
      <div id="maToKhaiBox" class="result" style="display: none;"></div>
    </div>
  </div>`;

  const confirmTemplate = `
  <div class="wrapper">
    <h1>Chọn nhân viên để xác nhận đã nộp thuế</h1>
    <form class="search-form" id="searchEmployeeConfirmForm">
      <input type="text" id="searchEmployeeConfirm" placeholder="Nhập mã nhân viên hoặc tên nhân viên...">
      <button type="submit">🔍 Tìm kiếm</button>
    </form>
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

  function selectEmployeeForTax(emp) {
    // Điền mã nhân viên và họ tên
    document.getElementById("maNV").value = emp.id;
    document.getElementById("hoTen").value = emp.name;

    // Gọi API để lấy thông tin chi tiết của nhân viên
    fetch("get_employee_info.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maNV: emp.id })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Lỗi server: " + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Điền các thông tin khác từ bảng NhanVien vào form
        document.getElementById("ngaySinh").value = data.data.NgaySinh || "";
        document.getElementById("cccd").value = data.data.CCCD || "";
        document.getElementById("quocTich").value = data.data.QuocTich || "";
        document.getElementById("diaChi").value = data.data.DiaChi || "";
      } else {
        alert("Lỗi: " + data.error);
      }
    })
    .catch(error => alert("Lỗi khi lấy thông tin nhân viên: " + error.message));
  }

  function selectEmployeeForDeclaration(emp) {
    document.getElementById("tax-id").value = emp.id;
    document.getElementById("full-name").value = emp.name;
    document.querySelector(".form-wrapper").style.display = "block";
 // Gọi API để lấy thông tin thuế và điền tổng thu nhập
 handleFetch(
  "get_tax_info.php",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ maNV: emp.id })
  },
  data => {
    // Điền tổng thu nhập vào trường "income"
    document.getElementById("income").value = data.data.TongThuNhap || 0;
  },
  error => {
    console.error("Lỗi khi lấy thông tin thuế:", error);
    document.getElementById("income").value = 0; // Đặt mặc định là 0 nếu không tìm thấy
  }
);
  }

  function selectEmployeeForConfirmation(emp) {
    document.getElementById("mst").value = emp.id;
    document.getElementById("hoTen").value = emp.name;
    document.querySelector(".form-wrapper").style.display = "block";
  }

  function tinhThue() {
    const thuNhap = parseFloat(document.getElementById("thuNhap").value) || 0;
    const thuong = parseFloat(document.getElementById("thuong").value) || 0;
    const phuCap = parseFloat(document.getElementById("phuCap").value) || 0;
    const giamTru = parseFloat(document.getElementById("giamTru").value) || 0;
    const baoHiem = parseFloat(document.getElementById("baoHiem").value) || 0;
    const nhomNV = document.getElementById("nhomNV").value;

    const thuNhapChiuThue = thuNhap + thuong + phuCap - giamTru - baoHiem;
    let thuePhaiNop = 0;

    if (nhomNV === "co_hop_dong") {
      thuePhaiNop = tinhThueLuyTien(thuNhapChiuThue);
    } else if (nhomNV === "khong_hop_dong") {
      thuePhaiNop = thuNhapChiuThue * 0.1;
    } else if (nhomNV === "khong_cu_tru") {
      thuePhaiNop = thuNhapChiuThue * 0.2;
    }

    const ketQuaThue = document.getElementById("ketQuaThue");
    ketQuaThue.innerHTML = `
      <h3>Kết quả tính thuế</h3>
      <p><strong>Thu nhập chịu thuế:</strong> ${thuNhapChiuThue.toLocaleString("vi-VN")} VND</p>
      <p><strong>Thuế phải nộp:</strong> ${thuePhaiNop.toLocaleString("vi-VN")} VND</p>
    `;
    ketQuaThue.style.display = "block";
  }

  function tinhThueLuyTien(thuNhapChiuThue) {
    let thue = 0;
    if (thuNhapChiuThue <= 0) return 0;

    if (thuNhapChiuThue <= 5000000) {
      thue = thuNhapChiuThue * 0.05;
    } else if (thuNhapChiuThue <= 10000000) {
      thue = 5000000 * 0.05 + (thuNhapChiuThue - 5000000) * 0.1;
    } else if (thuNhapChiuThue <= 18000000) {
      thue = 5000000 * 0.05 + 5000000 * 0.1 + (thuNhapChiuThue - 10000000) * 0.15;
    } else if (thuNhapChiuThue <= 32000000) {
      thue = 5000000 * 0.05 + 5000000 * 0.1 + 8000000 * 0.15 + (thuNhapChiuThue - 18000000) * 0.2;
    } else if (thuNhapChiuThue <= 52000000) {
      thue = 5000000 * 0.05 + 5000000 * 0.1 + 8000000 * 0.15 + 14000000 * 0.2 + (thuNhapChiuThue - 32000000) * 0.25;
    } else if (thuNhapChiuThue <= 80000000) {
      thue = 5000000 * 0.05 + 5000000 * 0.1 + 8000000 * 0.15 + 14000000 * 0.2 + 20000000 * 0.25 + (thuNhapChiuThue - 52000000) * 0.3;
    } else {
      thue = 5000000 * 0.05 + 5000000 * 0.1 + 8000000 * 0.15 + 14000000 * 0.2 + 20000000 * 0.25 + 28000000 * 0.3 + (thuNhapChiuThue - 80000000) * 0.35;
    }

    return thue;
  }

  function loadPage(page) {
    links.forEach(link => link.classList.remove("active"));
    document.querySelector(`[data-page="${page}"]`)?.classList.add("active");
  
    if (page === "form") {
      content.innerHTML = formTemplate;
      renderEmployeeCards("employeeCardListTax", employees, selectEmployeeForTax);
      document.getElementById("taxForm")?.addEventListener("submit", e => {
        e.preventDefault();
        e.preventDefault();
  const thuNhap = parseFloat(document.getElementById("thuNhap").value) || 0;
  const thuong = parseFloat(document.getElementById("thuong").value) || 0;
  const phuCap = parseFloat(document.getElementById("phuCap").value) || 0;
  const giamTru = parseFloat(document.getElementById("giamTru").value) || 0;
  const baoHiem = parseFloat(document.getElementById("baoHiem").value) || 0;

  // Kiểm tra giá trị âm
  if (thuNhap < 0 || thuong < 0 || phuCap < 0 || giamTru < 0 || baoHiem < 0) {
    alert("Các giá trị thu nhập, thưởng, phụ cấp, giảm trừ, bảo hiểm không được âm!");
    return;
  }
        const formData = new FormData(e.target);
        fetch("save_tax_info.php", {
          method: "POST",
          body: formData
        })
        .then(response => {
          if (!response.ok) {
            throw new Error("Lỗi server: " + response.statusText);
          }
          return response.text();
        })
        .then(text => {
          console.log("Dữ liệu trả về:", text);
          try {
            const data = JSON.parse(text);
            if (data.success) {
              alert(data.message);
              e.target.reset();
            } else {
              alert("Lỗi: " + data.error);
            }
          } catch (error) {
            alert("Lỗi phân tích dữ liệu từ server: " + error.message + "\nDữ liệu trả về: " + text);
          }
        })
        .catch(error => alert("Lỗi kết nối: " + error.message));
      });
    } else if (page === "tracuu") {
      content.innerHTML = tracuuTemplate;
      document.querySelector(".search-form")?.addEventListener("submit", e => {
        e.preventDefault();
        const searchInput = document.getElementById("searchInput").value.trim();
        const resultSection = document.getElementById("resultSection");
  
        if (!searchInput) {
          resultSection.innerHTML = "<p>Vui lòng nhập thông tin để tra cứu.</p>";
          return;
        }
  
        fetch("search_tax.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchInput })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            resultSection.innerHTML = `
              <h3>Kết quả tra cứu</h3>
              <p><strong>Họ tên:</strong> ${data.data.TenNV}</p>
              <p><strong>Mã số thuế:</strong> ${data.data.MST}</p>
              <p><strong>CCCD:</strong> ${data.data.CCCD}</p>
              <p><strong>Thuế đã nộp:</strong> ${Number(data.data.TongThueNop || 0).toLocaleString("vi-VN")} VND</p>
            `;
          } else {
            resultSection.innerHTML = "<p>" + data.error + "</p>";
          }
        })
        .catch(error => resultSection.innerHTML = "<p>Lỗi kết nối: " + error + "</p>");
      });
    } else if (page === "declare") {
      content.innerHTML = declarationTemplate;
      renderEmployeeCards("employeeCardListDeclare", employees, selectEmployeeForDeclaration);
      document.getElementById("searchEmployee")?.addEventListener("input", e => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredEmployees = employees.filter(emp => 
          emp.name.toLowerCase().includes(searchTerm) || emp.id.includes(searchTerm)
        );
        renderEmployeeCards("employeeCardListDeclare", filteredEmployees, selectEmployeeForDeclaration);
      });
      document.getElementById("searchEmployeeForm")?.addEventListener("submit", e => {
        e.preventDefault();
        const searchTerm = document.getElementById("searchEmployee").value.toLowerCase();
        const filteredEmployees = employees.filter(emp => 
          emp.name.toLowerCase().includes(searchTerm) || emp.id.includes(searchTerm)
        );
        renderEmployeeCards("employeeCardListDeclare", filteredEmployees, selectEmployeeForDeclaration);
      });
      document.getElementById("declarationForm")?.addEventListener("submit", e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        fetch("save_declaration.php", {
          method: "POST",
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          const box = document.getElementById("maToKhaiBox");
          if (data.success) {
            box.innerHTML = `✅ Đã tạo tờ khai cho <strong>${formData.get("full-name")}</strong><br>Mã tờ khai: <strong>${data.maTK}</strong>`;
            box.style.display = "block";
          } else {
            box.innerHTML = `<p>Lỗi: ${data.error}</p>`;
            box.style.display = "block";
          }
        })
        .catch(error => {
          const box = document.getElementById("maToKhaiBox");
          box.innerHTML = `<p>Lỗi kết nối: ${error}</p>`;
          box.style.display = "block";
        });
      });
    } else if (page === "xacnhan") {
      content.innerHTML = confirmTemplate;
      renderEmployeeCards("employeeCardListConfirm", employees, selectEmployeeForConfirmation);
      document.getElementById("searchEmployeeConfirm")?.addEventListener("input", e => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredEmployees = employees.filter(emp => 
          emp.name.toLowerCase().includes(searchTerm) || emp.id.includes(searchTerm)
        );
        renderEmployeeCards("employeeCardListConfirm", filteredEmployees, selectEmployeeForConfirmation);
      });
      document.getElementById("searchEmployeeConfirmForm")?.addEventListener("submit", e => {
        e.preventDefault();
        const searchTerm = document.getElementById("searchEmployeeConfirm").value.toLowerCase();
        const filteredEmployees = employees.filter(emp => 
          emp.name.toLowerCase().includes(searchTerm) || emp.id.includes(searchTerm)
        );
        renderEmployeeCards("employeeCardListConfirm", filteredEmployees, selectEmployeeForConfirmation);
      });
      document.getElementById("confirmForm")?.addEventListener("submit", e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        fetch("save_confirmation.php", {
          method: "POST",
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          const result = document.getElementById("result");
          if (data.success) {
            result.innerHTML = `✅ Đã xác nhận nộp thuế thành công cho <strong>${formData.get("hoTen")}</strong><br>Mã xác nhận: ${data.maXN}`;
            result.style.display = "block";
          } else {
            result.innerHTML = `<p>Lỗi: ${data.error}</p>`;
            result.style.display = "block";
          }
        })
        .catch(error => {
          const result = document.getElementById("result");
          result.innerHTML = `<p>Lỗi kết nối: ${error}</p>`;
          result.style.display = "block";
        });
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
});