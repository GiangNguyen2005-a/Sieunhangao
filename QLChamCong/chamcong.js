function anTatCaNoiDung() {
  document.getElementById("attendance-container").classList.add("hidden");
  document.getElementById("donNghiPhepSection").style.display = "none";
  document.getElementById("tonghopChamCong").style.display = "none";
  document.getElementById("tonghopNghiPhep").style.display = "none";
  document.getElementById("baoCaoSection").style.display = "none";

}
const duLieuChamCong = [{
      maNV: "NV002",
      tenNV: "Trần Thị B",
      phongBan: "Marketing",
      ngay: "16/04/2025",
      gioDen: "08:20",
      gioVe: "16:30",
      trangThai: "Thiếu giờ làm",
      phanHoi: "Đã phản hồi",
      noiDungPhanHoi: "Em về sớm để đi khám bệnh",
      anhPhanHoi: "https://via.placeholder.com/300x180.png?text=Giay+khambenh"
  },
  {
      maNV: "NV003",
      tenNV: "Lê Văn C",
      phongBan: "Kỹ thuật",
      ngay: "15/04/2025",
      gioDen: "07:55",
      gioVe: "17:15",
      trangThai: "Hoàn thành",
      phanHoi: "Chưa phản hồi",
      noiDungPhanHoi: "",
      anhPhanHoi: ""
  }
];
const ketQuaPhanHoi = {}; // key: mã NV + ngày, value: trạng thái (duyệt/không)

// Danh sách dữ liệu đơn xin nghỉ phép (demo)
// Dữ liệu nghỉ phép mẫu
// ======================= DỮ LIỆU MẪU CHO NGHỈ PHÉP ======================
const duLieuBaoCaoChamCong = [{
      maNV: "NV001",
      tenNV: "Nguyễn Văn A",
      phongBan: "Phòng Kỹ thuật",
      ngay: "15/04/2025",
      gioDen: "08:00",
      gioVe: "17:00",
      trangThai: "Hoàn thành"
  },
  {
      maNV: "NV002",
      tenNV: "Trần Thị B",
      phongBan: "Phòng Kế toán",
      ngay: "15/04/2025",
      gioDen: "08:30",
      gioVe: "16:00",
      trangThai: "Thiếu giờ làm"
  },
  {
      maNV: "NV003",
      tenNV: "Lê Văn C",
      phongBan: "Marketing",
      ngay: "15/04/2025",
      gioDen: "08:20",
      gioVe: "16:30",
      trangThai: "Chấm công muộn"
  }
];
const duLieuBaoCaoNghiPhep = [{
      maNV: "NV001",
      tenNV: "Nguyễn Văn A",
      phongBan: "Phòng Kỹ thuật",
      ngayGui: "14/04/2025",
      tuNgay: "18/04/2025",
      denNgay: "20/04/2025",
      lyDo: "Về quê",
      trangThai: "Phê duyệt"
  },
  {
      maNV: "NV002",
      tenNV: "Trần Thị B",
      phongBan: "Phòng Kế toán",
      ngayGui: "14/04/2025",
      tuNgay: "21/04/2025",
      denNgay: "22/04/2025",
      lyDo: "Khám bệnh",
      trangThai: "Không phê duyệt"
  },
  {
      maNV: "NV003",
      tenNV: "Lê Văn C",
      phongBan: "Marketing",
      ngayGui: "14/04/2025",
      tuNgay: "24/04/2025",
      denNgay: "25/04/2025",
      lyDo: "Việc riêng",
      trangThai: "Phê duyệt"
  }
];

const duLieuNghiPhep = [{
      maNV: "NV001",
      tenNV: "Nguyễn Văn A",
      phongBan: "Phòng Kỹ thuật",
      ngayGui: "14/04/2025",
      tuNgay: "18/04/2025",
      denNgay: "20/04/2025",
      lyDo: "Về quê",
      trangThai: "Phê duyệt"
  },
  {
      maNV: "NV002",
      tenNV: "Trần Thị B",
      phongBan: "Phòng Kế toán",
      ngayGui: "10/04/2025",
      tuNgay: "15/04/2025",
      denNgay: "16/04/2025",
      lyDo: "Khám bệnh",
      trangThai: "Không phê duyệt"
  },
  {
      maNV: "NV003",
      tenNV: "Lê Văn C",
      phongBan: "Phòng Nhân sự",
      ngayGui: "12/04/2025",
      tuNgay: "17/04/2025",
      denNgay: "18/04/2025",
      lyDo: "Đưa con đi học",
      trangThai: "Phê duyệt"
  },
  {
      maNV: "NV004",
      tenNV: "Hoàng Thị D",
      phongBan: "Phòng IT",
      ngayGui: "13/04/2025",
      tuNgay: "19/04/2025",
      denNgay: "21/04/2025",
      lyDo: "Việc cá nhân",
      trangThai: "Không phê duyệt"
  }
];


// ======================= HIỂN THỊ BẢNG NGHỈ PHÉP ======================
function hienThiBangNghiPhep(data) {
  const tbody = document.getElementById("tonghopNghiPhepBody");
  tbody.innerHTML = "";
  data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
    <td>${item.maNV}</td>
    <td>${item.tenNV}</td>
    <td>${item.phongBan}</td>
    <td>${item.ngayBatDau}</td>
    <td>${item.ngayKetThuc}</td>
    <td>${item.lyDo}</td>
    <td>${item.trangThai}</td>
  `;
      tbody.appendChild(row);
  });
}

// SỰ KIỆN HIỂN THỊ DANH SÁCH NGHỈ PHÉP

// sửa
if (document.getElementById("menuDonNghiPhep")) {
  document.getElementById("menuDonNghiPhep").addEventListener("click", function(e) {
      e.preventDefault();
      setActiveSidebar("menuDonNghiPhep");
      document.getElementById("tonghopNghiPhep").style.display = "block";
      hienThiBangNghiPhep(duLieuNghiPhep);
  });
}

function hienPopupPhanHoi(tenNV, ngay, phanHoi, anhPhanHoi, iconElement) {
  const popup = document.createElement("div");
  popup.classList.add("phanhoi-popup");

  popup.innerHTML = `
  <div class="phanhoi-noidung">
    <h3>Phản hồi từ: ${tenNV}</h3>
    <p><strong>Ngày:</strong> ${ngay}</p>
    <p><strong>Nội dung:</strong></p>
    <p>${phanHoi}</p>
    ${anhPhanHoi ? `<img src="${anhPhanHoi}" alt="Ảnh bằng chứng" style="width:100%; border-radius:6px; margin-top:12px;">` : ""}
    <div style="margin-top: 16px;">
      <button class="btn-duyet">✅ Duyệt</button>
      <button class="btn-khongduyet">❌ Không duyệt</button>
      <button onclick="this.closest('.phanhoi-popup').remove()">Đóng</button>
    </div>
  </div>
`;

  document.body.appendChild(popup);

  // Gắn sự kiện cho nút
  popup.querySelector(".btn-duyet").addEventListener("click", () => {
      iconElement.innerHTML = `<i class="fas fa-inbox"></i> <i class="fas fa-check-circle" style="color:green; font-size:0.7em;"></i>`;
      popup.remove();
  });

  popup.querySelector(".btn-khongduyet").addEventListener("click", () => {
      iconElement.innerHTML = `<i class="fas fa-inbox"></i> <i class="fas fa-times-circle" style="color:red; font-size:0.7em;"></i>`;
      popup.remove();
  });
}

// sửa
// Đổi active khi click menu
const navLinks = document.querySelector(".main-nav").querySelectorAll("nav a");

function setActiveSidebar(id) {
  navLinks.forEach(link => {
      link.classList.remove("active");
  });
  const activeLink = document.getElementById(id);
  if (activeLink) activeLink.classList.add("active");
}

// sửa

function hienThiBangChamCong(data) {
  const tbody = document.querySelector("#bangTongHopChamCong tbody");
  tbody.innerHTML = "";

  data.forEach((item, index) => {
      const row = document.createElement("tr");
      const iconHTML = item.noiDungPhanHoi && item.noiDungPhanHoi.trim() !== "" ?
          `<span class="feedback-icon-wrap" data-index="${index}" style="cursor:pointer;">
       <i class="fas fa-inbox"></i>
     </span>` :
          "";



      row.innerHTML = `
    <td>${item.maNV}</td>
    <td>${item.tenNV}</td>
    <td>${item.phongBan}</td>
    <td>${item.ngay}</td>
    <td>${item.gioDen}</td>
    <td>${item.gioVe}</td>
    <td>${item.trangThai}</td>
    <td>${iconHTML}</td>
  `;

      tbody.appendChild(row);
  });

  // Gắn sự kiện click cho icon phản hồi
  const iconList = document.querySelectorAll(".feedback-icon");
  document.querySelectorAll(".feedback-icon-wrap").forEach(icon => {
      icon.addEventListener("click", function() {
          const index = this.dataset.index;
          const dataPhanHoi = data[index];
          hienPopupPhanHoi(dataPhanHoi.tenNV, dataPhanHoi.ngay, dataPhanHoi.noiDungPhanHoi, dataPhanHoi.anhPhanHoi, this);
      });
  });
}

// sửa
// Rồi sau đó mới gọi trong sự kiện click:
document.getElementById("menuTongHopChamCong").addEventListener("click", function(e) {
  e.preventDefault();
  document.getElementById("attendance-container").classList.add("hidden");
  document.getElementById("donNghiPhepSection").style.display = "none";
  document.getElementById("tonghopNghiPhep").style.display = "none";
  setActiveSidebar("menuTongHopChamCong");
  document.getElementById("tonghopChamCong").style.display = "block";
  hienThiBangChamCong(duLieuChamCong);

  // ✅ Lúc này DOM đã hiển thị rồi, gắn sự kiện ngay lúc này mới đúng
  document.querySelector("#tonghopChamCong .btn-primary").onclick = () => {
      const phongBan = document.getElementById("filterPhongBan").value;
      const thang = document.getElementById("filterThang").value;
      const trangThai = document.getElementById("filterTrangThai").value;
      const phanHoi = document.getElementById("filterPhanHoi").value;

      const ketQua = duLieuChamCong.filter(item => {
          const thangItem = item.ngay.split("/")[1];
          const daPhanHoi = item.noiDungPhanHoi && item.noiDungPhanHoi.trim() !== "";

          return (
              (phongBan === "-- Lọc phòng ban --" || item.phongBan === phongBan) &&
              (thang === "-- Lọc tháng --" || thangItem === thang) &&
              (trangThai === "-- Lọc trạng thái --" || item.trangThai === trangThai) &&
              (phanHoi === "-- Lọc phản hồi --" ||
                  (phanHoi === "Đã phản hồi" && daPhanHoi) ||
                  (phanHoi === "Chưa phản hồi" && !daPhanHoi))
          );
      });

      hienThiBangChamCong(ketQua);
  };

  document.querySelector("#tonghopChamCong .btn-danger").onclick = () => {
      document.getElementById("filterPhongBan").selectedIndex = 0;
      document.getElementById("filterThang").selectedIndex = 0;
      document.getElementById("filterTrangThai").selectedIndex = 0;
      document.getElementById("filterPhanHoi").selectedIndex = 0;
      hienThiBangChamCong(duLieuChamCong);
  };
});



// Hiệu ứng click card
const cards = document.querySelectorAll(".card");
cards.forEach(card => {
  card.addEventListener("click", () => {
      // Không alert nếu là card "Quản lý chấm công"
      if (!card.classList.contains("card-orange")) {
          alert(`Bạn đã chọn: ${card.innerText.trim()}`);
      }
  });
});

const chamCongCard = document.querySelector(".card-orange");
const container = document.getElementById("attendance-container");
const content = document.getElementById("attendance-content");
const buttons = document.querySelectorAll(".attendance-buttons button");

function setActiveButton(activeId) {
  buttons.forEach(btn => {
      if (btn.id === activeId) {
          btn.classList.add("active");
      } else {
          btn.classList.remove("active");
      }
  });
}

// sửa
document.getElementById("menuChamCong").addEventListener("click", (e) => {
  e.preventDefault();
  setActiveSidebar("menuChamCong");
  document.getElementById("donNghiPhepSection").style.display = "none";
  document.getElementById("tonghopChamCong").style.display = "none";
  document.getElementById("tonghopNghiPhep").style.display = "none";
  const container = document.getElementById("attendance-container");
  container.classList.remove("hidden");
  container.classList.add("visible");
  showChamCong();
});

document.getElementById("btnChamCong").addEventListener("click", () => {
  setActiveButton("btnChamCong");
  showChamCong();
});
document.getElementById("btnNghiPhep").addEventListener("click", () => {
  setActiveButton("btnNghiPhep");
  showXinNghiPhep();
});

function showChamCong() {
  content.innerHTML = `
  <div class="content-box">
    <div class="checkin-button-wrapper">
      <button id="checkinButton" class="checkin-button">Chấm công đến</button>
    </div>

    <div class="filter-bar">
      Từ ngày: <input type="date">
      Đến ngày: <input type="date">
      <button class="apply-button">Áp dụng</button>
    </div>

    <table class="attendance-table" id="attendanceTable">
      <thead>
        <tr>
          <th>Ngày</th>
          <th>Giờ đến</th>
          <th>Giờ về</th>
          <th>Trạng thái</th>
          <th>Phản hồi</th> <!>
        </tr>
      </thead>
      <tbody id="attendanceBody"></tbody>
    </table>
 <div id="feedbackPopup" class="feedback-popup" style="display:none;">
<h3>Gửi phản hồi</h3>
<label>Nội dung:</label>
<textarea id="feedbackContentInput" rows="3" style="width: 100%; margin-bottom: 8px;"></textarea>
<label>Ảnh bằng chứng:</label>
<input type="file" id="feedbackImageInput" accept="image/*"/>
<div style="margin-top: 12px;">
  <button onclick="submitFeedback()" class="apply-button">Gửi</button>
  <button onclick="closeFeedback()" class="apply-button reset-button">Quay lại</button>
</div>
</div>

`;

  const button = document.getElementById("checkinButton");
  const tbody = document.getElementById("attendanceBody");

  let isChamDen = false;
  let currentRow = null;
  let gioDen = null;

  button.addEventListener("click", () => {
      const now = new Date();
      const gio = now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
      });
      const ngay = now.toLocaleDateString('vi-VN');
      const gioGoc = now.getHours();

      if (!isChamDen) {
          const row = tbody.insertRow();
          currentRow = row;
          gioDen = now;

          // sau khi đã chấm công đến
          row.insertCell(0).innerText = ngay;
          row.insertCell(1).innerText = gio;
          row.insertCell(2).innerText = "";
          row.insertCell(3).innerHTML = gioGoc >= 8 ?
              '<span class="status-late">Chấm công muộn</span>' :
              '<span class="status-pending">Đang làm việc</span>';
          row.insertCell(4).innerHTML = '<i class="fas fa-comment-dots feedback-icon" onclick="openFeedback(this)"></i>';

          isChamDen = true;
          button.innerText = "Chấm công về";
          button.style.backgroundColor = "#e53935";
      } else {
          const gioVe = now;
          const gioVeStr = gioVe.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit'
          });
          const gioVeGoc = gioVe.getHours();

          currentRow.cells[2].innerText = gioVeStr;

          if (gioVeGoc < 17) {
              currentRow.cells[3].innerHTML = `<span class="status-warning">Thiếu giờ làm</span>`;
          } else if (gioDen.getHours() >= 8) {
              currentRow.cells[3].innerHTML = `<span class="status-late">Chấm công muộn</span>`;
          } else {
              currentRow.cells[3].innerHTML = `<span class="status-success">Hoàn thành</span>`;
          }

          // Reset để người dùng có thể tiếp tục
          isChamDen = false;
          currentRow = null;
          gioDen = null;

          button.innerText = "Chấm công đến";
          button.style.backgroundColor = "#2196f3";
      }
  });
}



function openFeedback(iconElement) {
  document.getElementById("feedbackPopup").style.display = "block";
}

function closeFeedback() {
  document.getElementById("feedbackPopup").style.display = "none";
}

function submitFeedback() {
  const content = document.getElementById("feedbackContentInput").value;
  const file = document.getElementById("feedbackImageInput").files[0];
  alert("Đã gửi phản hồi!\\nNội dung: " + content + (file ? "\\nẢnh: " + file.name : ""));
  closeFeedback();
}



function showXinNghiPhep() {
  content.innerHTML = `
  <div class="content-box">
    <h2><i class="fas fa-envelope-open-text"></i> Xin nghỉ phép</h2>
    <div class="leave-form-container">
      <div class="form-row">
        <div class="form-group">
          <label for="startDate">Ngày bắt đầu:</label>
          <input type="date" id="startDate" class="form-control" />
        </div>
        <div class="form-group">
          <label for="endDate">Ngày kết thúc:</label>
          <input type="date" id="endDate" class="form-control" />
        </div>
      </div>
      <div class="form-group full-width">
        <label for="reason">Lý do nghỉ phép:</label>
        <textarea id="reason" class="form-control" rows="4"></textarea>
      </div>
      <div class="form-group right-align">
        <button class="submit-button">
          <i class="fas fa-paper-plane"></i> Gửi đơn nghỉ
        </button>
      </div>
    </div>

    <h3><i class="fas fa-scroll"></i> Lịch sử nộp đơn xin nghỉ phép</h3>
    <table class="leave-history-table">
      <thead>
        <tr>
          <th>Mã NV</th>
          <th>Tên NV</th>
          <th>Ngày bắt đầu</th>
          <th>Ngày kết thúc</th>
          <th>Lý do</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        <!-- Dữ liệu lịch sử đơn nghỉ sẽ được thêm ở đây -->
      </tbody>
    </table>
  </div>
`;
  // Lắng nghe click nút gửi đơn
  document.querySelector(".submit-button").addEventListener("click", () => {
      const start = document.getElementById("startDate").value;
      const end = document.getElementById("endDate").value;
      const reason = document.getElementById("reason").value;

      if (!start || !end || !reason) {
          alert("Vui lòng điền đầy đủ thông tin!");
          return;
      }

      const tbody = document.querySelector(".leave-history-table tbody");

      const row = tbody.insertRow();
      row.insertCell(0).innerText = "NV001"; // Ghi cứng
      row.insertCell(1).innerText = "Nguyễn Văn A";
      row.insertCell(2).innerText = start;
      row.insertCell(3).innerText = end;
      row.insertCell(4).innerText = reason;
      row.insertCell(5).innerHTML = '<span class="status-pending">Đang chờ duyệt</span>';

      // ✅ Thêm vào dsDonNghiPhep để admin thấy
      dsDonNghiPhep.push({
          maNV: "NV001",
          tenNV: "Nguyễn Văn A",
          phongBan: "Phòng Kỹ thuật", // Tạm thời ghi cứng
          ngayGui: new Date().toLocaleDateString('vi-VN'),
          tuNgay: start,
          denNgay: end,
          lyDo: reason,
          trangThai: "Chờ duyệt"
      });

      // ✅ Cập nhật bảng danh sách (admin)
      renderDonNghiPhep(dsDonNghiPhep);

      // Xóa form
      document.getElementById("startDate").value = "";
      document.getElementById("endDate").value = "";
      document.getElementById("reason").value = "";
  });


}

// sửa
document.getElementById("menuNghiPhep").addEventListener("click", (e) => {
  e.preventDefault();
  setActiveSidebar("menuNghiPhep");
  document.getElementById("tonghopChamCong").style.display = "none";
  document.getElementById("tonghopNghiPhep").style.display = "none";
  document.getElementById("donNghiPhepSection").style.display = "none";
  const container = document.getElementById("attendance-container");
  container.classList.remove("hidden");
  container.classList.add("visible");

  // 👇 Gọi đúng hàm này để hiển thị giao diện:
  showXinNghiPhep();
});

// Hiển thị giao diện đơn nghỉ phép khi người dùng chọn chức năng
document.addEventListener("DOMContentLoaded", () => {
  const btnMenuXinNghiPhep = document.getElementById("menuXinNghiPhep");
  if (btnMenuXinNghiPhep) {
      btnMenuXinNghiPhep.addEventListener("click", () => {
          document.getElementById("donNghiPhepSection").style.display = "block";
          document.getElementById("chamCongSection").style.display = "none";
          document.getElementById("tongHopChamCong").style.display = "none";
      });
  }
});



// Hiển thị dữ liệu vào bảng
function renderDonNghiPhep(data) {
  const tbody = document.getElementById("donNghiPhepTableBody");
  tbody.innerHTML = "";
  data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
    <td>${item.maNV}</td>
    <td>${item.tenNV}</td>
    <td>${item.phongBan}</td>
    <td>${item.ngayGui}</td>
    <td>${item.tuNgay}</td>
    <td>${item.denNgay}</td>
    <td>${item.lyDo}</td>
    <td>
<select class="select-trangthai">
  <option ${item.trangThai === "Phê duyệt" ? "selected" : ""}>Phê duyệt</option>
  <option ${item.trangThai === "Không phê duyệt" ? "selected" : ""}>Không phê duyệt</option>
</select>
</td>

  `;
      tbody.appendChild(row);
  });
}
document.getElementById("btnLuuTrangThai").addEventListener("click", () => {
  const rows = document.querySelectorAll("#donNghiPhepTableBody tr");
  const ketQua = [];

  rows.forEach(row => {
      const maNV = row.cells[0].innerText;
      const tenNV = row.cells[1].innerText;
      const phongBan = row.cells[2].innerText;
      const ngayGui = row.cells[3].innerText;
      const tuNgay = row.cells[4].innerText;
      const denNgay = row.cells[5].innerText;
      const lyDo = row.cells[6].innerText;
      const trangThai = row.querySelector("select").value;

      ketQua.push({
          maNV,
          tenNV,
          phongBan,
          ngayGui,
          tuNgay,
          denNgay,
          lyDo,
          trangThai
      });
  });

  console.log("Dữ liệu sau khi lưu:", ketQua);
  alert("Đã lưu trạng thái thành công!");
});

const dsDonNghiPhep = [{
      maNV: "NV001",
      tenNV: "Nguyễn Văn A",
      phongBan: "Phòng Kỹ thuật",
      ngayGui: "14/04/2025",
      tuNgay: "18/04/2025",
      denNgay: "20/04/2025",
      lyDo: "Về quê",
      trangThai: "Chờ duyệt"
  },
  {
      maNV: "NV002",
      tenNV: "Trần Thị B",
      phongBan: "Phòng Kế toán",
      ngayGui: "15/04/2025",
      tuNgay: "22/04/2025",
      denNgay: "24/04/2025",
      lyDo: "Khám bệnh",
      trangThai: "Chờ duyệt"
  },
  {
      maNV: "NV003",
      tenNV: "Lê Văn C",
      phongBan: "Phòng Nhân sự",
      ngayGui: "16/04/2025",
      tuNgay: "25/04/2025",
      denNgay: "26/04/2025",
      lyDo: "Việc gia đình",
      trangThai: "Chờ duyệt"
  },
  {
      maNV: "NV004",
      tenNV: "Nguyễn Thị D",
      phongBan: "Phòng IT",
      ngayGui: "16/04/2025",
      tuNgay: "27/04/2025",
      denNgay: "29/04/2025",
      lyDo: "Du lịch",
      trangThai: "Chờ duyệt"
  },
  {
      maNV: "NV005",
      tenNV: "Phạm Văn E",
      phongBan: "Phòng Marketing",
      ngayGui: "17/04/2025",
      tuNgay: "01/05/2025",
      denNgay: "03/05/2025",
      lyDo: "Về quê cưới",
      trangThai: "Chờ duyệt"
  }
];

document.addEventListener("DOMContentLoaded", function() {
  const phongBanOptions = ["Phòng Kỹ thuật", "Phòng Kế toán", "Phòng Nhân sự", "Phòng IT", "Phòng Marketing"];
  const thangOptions = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const namOptions = ["2024", "2025"];
  const trangThaiOptions = ["Phê duyệt", "Không phê duyệt", "Chờ duyệt"];

  function themOption(id, options) {
      const select = document.getElementById(id);
      options.forEach(opt => {
          const option = document.createElement("option");
          option.value = opt;
          option.text = opt;
          select.appendChild(option);
      });
  }

  themOption("filterPhongBanNghi", phongBanOptions);
  themOption("filterThangNghi", thangOptions);
  themOption("filterNamNghi", namOptions);
  themOption("filterTrangThaiNghi", trangThaiOptions);
});

// Gọi hiển thị dữ liệu ban đầu
renderDonNghiPhep(dsDonNghiPhep);

function apDungLocNghi() {
  const phongBan = document.getElementById("filterPhongBanNghi").value;
  const thang = document.getElementById("filterThangNghi").value;
  const nam = document.getElementById("filterNamNghi").value;
  const trangThai = document.getElementById("filterTrangThaiNghi").value;

  const ketQua = dsDonNghiPhep.filter(item => {
      const ngayGui = new Date(item.ngayGui.split("/").reverse().join("-")); // "dd/mm/yyyy" → "yyyy-mm-dd"
      const thangGui = (ngayGui.getMonth() + 1).toString().padStart(2, '0');
      const namGui = ngayGui.getFullYear().toString();

      return (
          (phongBan === "-- Lọc phòng ban --" || item.phongBan === phongBan) &&
          (thang === "-- Lọc tháng --" || thangGui === thang) &&
          (nam === "-- Lọc năm --" || namGui === nam) &&
          (trangThai === "-- Lọc trạng thái --" || item.trangThai === trangThai)
      );
  });

  renderDonNghiPhep(ketQua); // 👉 cập nhật bảng hiển thị
}



// Reset bộ lọc
function resetLocNghi() {
  document.getElementById("filterPhongBanNghi").selectedIndex = 0;
  document.getElementById("filterThangNghi").selectedIndex = 0;
  document.getElementById("filterNamNghi").selectedIndex = 0;
  document.getElementById("filterTrangThaiNghi").selectedIndex = 0;
  renderDonNghiPhep(dsDonNghiPhep);
}

// sửa
document.addEventListener("DOMContentLoaded", function() {
  const btnCardTongHop = document.getElementById("cardTongHopChamCong");
  if (btnCardTongHop) {
      btnCardTongHop.addEventListener("click", function() {
          document.getElementById("tonghopChamCong").style.display = "block";
      });
  }
});


document.querySelector("#tonghopNghiPhep .btn-primary").onclick = () => {
  const phongBan = document.getElementById("filterNghiPhongBan").value;
  const thang = document.getElementById("filterNghiThang").value;
  const nam = document.getElementById("filterNghiNam").value;
  const trangThai = document.getElementById("filterNghiTrangThai").value;

  const ketQua = duLieuNghiPhep.filter(item => {
      const ngayBD = new Date(item.ngayBatDau);
      const thangItem = (ngayBD.getMonth() + 1).toString().padStart(2, '0');
      const namItem = ngayBD.getFullYear().toString();

      return (
          (phongBan === "-- Lọc phòng ban --" || item.phongBan === phongBan) &&
          (thang === "-- Lọc tháng --" || thangItem === thang) &&
          (nam === "-- Lọc năm --" || namItem === nam) &&
          (trangThai === "-- Lọc trạng thái --" || item.trangThai === trangThai)
      );
  });

  hienThiBangNghiPhep(ketQua);
};

document.querySelector("#tonghopNghiPhep .btn-danger").onclick = () => {
  document.getElementById("filterNghiPhongBan").selectedIndex = 0;
  document.getElementById("filterNghiThang").selectedIndex = 0;
  document.getElementById("filterNghiNam").selectedIndex = 0;
  document.getElementById("filterNghiTrangThai").selectedIndex = 0;
  hienThiBangNghiPhep(duLieuNghiPhep);
};

// sửa


function themDongChamCong(data) {
  const table = document.getElementById("bangTongHopChamCong").getElementsByTagName('tbody')[0];

  const newRow = table.insertRow();

  newRow.innerHTML = `
  <td>${data.maNV}</td>
  <td>${data.tenNV}</td>
  <td>${data.phongBan}</td>
  <td>${data.ngay}</td>
  <td>${data.gioDen}</td>
  <td>${data.gioVe}</td>
  <td>${data.trangThai}</td>
  <td>
    <button class="btn btn-sm btn-light">Chi tiết</button>
  </td>
`;
}
document.getElementById("btnChamCong").addEventListener("click", function() {
  // Giả sử đây là dữ liệu người dùng vừa chấm công:
  const dataMoi = {
      maNV: "NV001",
      tenNV: "Nguyễn Văn A",
      phongBan: "Phòng Kỹ thuật",
      ngay: new Date().toLocaleDateString(),
      gioDen: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
      }),
      gioVe: "--", // Chưa có giờ về
      trangThai: "Đã chấm công"
  };

  // Gọi hàm thêm vào bảng
  themDongChamCong(dataMoi);
});

// sửa
document.getElementById("menuTongHopChamCong").addEventListener("click", function(e) {
  e.preventDefault();
  setActiveSidebar("menuTongHopChamCong");
  document.getElementById("tonghopChamCong").style.display = "block";
  hienThiBangChamCong(duLieuChamCong);

  // Đăng ký sự kiện cho nút áp dụng và reset ở đây để chắc chắn phần tử đã tồn tại
  document.querySelector("#tonghopChamCong .btn-primary").onclick = () => {
      const phongBan = document.getElementById("filterPhongBan").value;
      const thang = document.getElementById("filterThang").value;
      const trangThai = document.getElementById("filterTrangThai").value;
      const phanHoi = document.getElementById("filterPhanHoi").value;

      const ketQua = duLieuChamCong.filter(item => {
          const thangItem = item.ngay.split("/")[1];
          const daPhanHoi = item.noiDungPhanHoi && item.noiDungPhanHoi.trim() !== "";

          return (
              (phongBan === "-- Lọc phòng ban --" || item.phongBan === phongBan) &&
              (thang === "-- Lọc tháng --" || thangItem === thang) &&
              (trangThai === "-- Lọc trạng thái --" || item.trangThai === trangThai) &&
              (phanHoi === "-- Lọc phản hồi --" ||
                  (phanHoi === "Đã phản hồi" && daPhanHoi) ||
                  (phanHoi === "Chưa phản hồi" && !daPhanHoi))
          );
      });

      hienThiBangChamCong(ketQua);
  };

  document.querySelector("#tonghopChamCong .btn-danger").onclick = () => {
      document.getElementById("filterPhongBan").selectedIndex = 0;
      document.getElementById("filterThang").selectedIndex = 0;
      document.getElementById("filterTrangThai").selectedIndex = 0;
      document.getElementById("filterPhanHoi").selectedIndex = 0;
      hienThiBangChamCong(duLieuChamCong);
  };
});

// sửa
document.addEventListener("DOMContentLoaded", function() {
  const menuTongHop = document.getElementById("menuTongHopNghiPhep");
  if (menuTongHop) {
      menuTongHop.addEventListener("click", function(e) {
          e.preventDefault();
          setActiveSidebar("menuTongHopNghiPhep");
          document.getElementById("tonghopNghiPhep").style.display = "block";
          hienThiBangNghiPhep(duLieuNghiPhep);

          // Lọc
          document.querySelector("#tonghopNghiPhep .btn-primary").onclick = () => {
              /* ... */ };

          // Reset
          document.querySelector("#tonghopNghiPhep .btn-danger").onclick = () => {
              /* ... */ };
      });
  }
});

// sửa
document.getElementById("btnDanhSachNghiPhep").addEventListener("click", function(e) {
  e.preventDefault();
  document.getElementById("attendance-container").classList.add("hidden");
  document.getElementById("tonghopChamCong").style.display = "none";
  document.getElementById("tonghopNghiPhep").style.display = "none";
  setActiveSidebar("btnDanhSachNghiPhep");
  document.getElementById("donNghiPhepSection").style.display = "block"; // 👈 phần đúng cần hiển thị
  renderDonNghiPhep(dsDonNghiPhep); // 👈 dữ liệu đúng của bảng "đơn xin nghỉ phép"
});


// sửa
document.addEventListener("DOMContentLoaded", function() {
  const menuDonNghiPhep = document.getElementById("menuDonNghiPhep");
  if (menuDonNghiPhep) {
      menuDonNghiPhep.addEventListener("click", function(e) {
          e.preventDefault();
          setActiveSidebar("menuDonNghiPhep");
          document.getElementById("tonghopNghiPhep").style.display = "block";
          hienThiBangNghiPhep(duLieuNghiPhep);
      });
  }
});

function capNhatDanhSachPhongBanTuData(data) {
  const phongBanSet = new Set();
  data.forEach(item => phongBanSet.add(item.phongBan));

  const select = document.getElementById("filterPhongBan");
  select.innerHTML = '<option>-- Lọc phòng ban --</option>'; // reset mặc định

  phongBanSet.forEach(pb => {
      const opt = document.createElement("option");
      opt.value = pb;
      opt.innerText = pb;
      select.appendChild(opt);
  });
}


function showBaoCao() {
  content.innerHTML = `
  <div class="content-box">
    <h2 class="section-title"><i class="fas fa-chart-line"></i> Báo cáo tổng hợp</h2>
    <div class="filter-row">
      <select id="loaiBaoCao">
        <option value="chamcong">Báo cáo chấm công</option>
        <option value="nghiphep">Báo cáo nghỉ phép</option>
      </select>
      <select id="locPhongBC">
        <option value="">-- Lọc phòng ban --</option>
        <option>Phòng Kỹ thuật</option>
        <option>Phòng Kế toán</option>
        <option>Marketing</option>
      </select>
      <select id="locThangBC">
<option value="">-- Lọc tháng --</option>
${[...Array(12)].map((_, i) => {
  const month = String(i + 1).padStart(2, "0");
  return `<option value="${month}">${month}</option>`;
}).join("")}
</select>

<select id="locNamBC">
<option value="">-- Lọc năm --</option>
${[2023, 2024, 2025, 2026, 2027].map(y => `<option value="${y}">${y}</option>`).join("")}
</select>

      <button id="btnApDungBC" class="apply-button">Tạo báo cáo</button>
    </div>

    <div id="baoCaoTableArea"></div>
    <div id="baoCaoCharts" style="margin-top: 40px;"></div>
  </div>
`;

  document.getElementById("btnApDungBC").addEventListener("click", () => {
      const loai = document.getElementById("loaiBaoCao").value;
      const phongBan = document.getElementById("locPhongBC").value;
      const thang = document.getElementById("locThangBC").value;
      const nam = document.getElementById("locNamBC").value;

      const tableArea = document.getElementById("baoCaoTableArea");
      const chartArea = document.getElementById("baoCaoCharts");
      tableArea.innerHTML = "";
      chartArea.innerHTML = "";

      if (!phongBan || !thang || !nam) {
          alert("Vui lòng chọn đầy đủ bộ lọc.");
          return;
      }

      if (loai === "chamcong") {
          const duLieuLoc = duLieuBaoCaoChamCong.filter(item => {
              const ngay = item.ngay.split("/");
              const thangItem = ngay[1];
              const namItem = ngay[2];

              return (
                  (phongBan === "" || item.phongBan === phongBan) &&
                  (thang === "" || thangItem === thang) &&
                  (nam === "" || namItem === nam)
              );
          });


          // Tạo bảng HTML
          let html = `
      <table class="bang-tonghop">
        <thead>
          <tr>
            <th>Mã NV</th>
            <th>Tên NV</th>
            <th>Phòng ban</th>
            <th>Ngày</th>
            <th>Giờ đến</th>
            <th>Giờ về</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          ${duLieuLoc.map(row => `
            <tr>
              <td>${row.maNV}</td>
              <td>${row.tenNV}</td>
              <td>${row.phongBan}</td>
              <td>${row.ngay}</td>
              <td>${row.gioDen}</td>
              <td>${row.gioVe}</td>
              <td>${row.trangThai}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
          tableArea.innerHTML = html;

          const tongHop = {};
          duLieuLoc.forEach(item => { // <- sửa dòng này
              if (!tongHop[item.tenNV]) tongHop[item.tenNV] = {
                  gio: 0,
                  muon: 0,
                  thieu: 0
              };
              const gioDen = parseInt(item.gioDen.split(":")[0]);
              const gioVe = parseInt(item.gioVe.split(":")[0]);
              tongHop[item.tenNV].gio += (gioVe - gioDen);
              if (item.trangThai === "Chấm công muộn") tongHop[item.tenNV].muon++;
              if (item.trangThai === "Thiếu giờ làm") tongHop[item.tenNV].thieu++;
          });

          const labels = Object.keys(tongHop);
          renderBarChart(chartArea, labels, labels.map(nv => tongHop[nv].gio), "Tổng giờ làm", "#42a5f5");
          renderBarChart(chartArea, labels, labels.map(nv => tongHop[nv].muon), "Số lần đi muộn", "#ff9800");
          renderBarChart(chartArea, labels, labels.map(nv => tongHop[nv].thieu), "Số lần thiếu giờ", "#ef5350");

      } else if (loai === "nghiphep") {
          const data = duLieuBaoCaoNghiPhep.filter(item => {
              const [d, m, y] = item.ngayGui.split("/");
              return item.phongBan === phongBan && m === thang && y === nam;
          });

          if (data.length === 0) {
              tableArea.innerHTML = `<p style="color:red">⚠️ Không tìm thấy dữ liệu báo cáo nghỉ phép.</p>`;
              return;
          }

          tableArea.innerHTML = `
      <table class="bang-tonghop">
        <thead>
          <tr>
            <th>Mã NV</th>
            <th>Tên NV</th>
            <th>Phòng ban</th>
            <th>Ngày gửi</th>
            <th>Từ ngày</th>
            <th>Đến ngày</th>
            <th>Lý do</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(item => `
            <tr>
              <td>${item.maNV}</td>
              <td>${item.tenNV}</td>
              <td>${item.phongBan}</td>
              <td>${item.ngayGui}</td>
              <td>${item.tuNgay}</td>
              <td>${item.denNgay}</td>
              <td>${item.lyDo}</td>
              <td>${item.trangThai}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

          const thongKe = {};
          data.forEach(item => {
              if (!thongKe[item.tenNV]) thongKe[item.tenNV] = {
                  soNgay: 0,
                  soDonDuyet: 0
              };
              const start = new Date(item.tuNgay);
              const end = new Date(item.denNgay);
              const soNgay = (end - start) / (1000 * 60 * 60 * 24) + 1;
              thongKe[item.tenNV].soNgay += soNgay;
              if (item.trangThai === "Phê duyệt") thongKe[item.tenNV].soDonDuyet++;
          });

          const labels = Object.keys(thongKe);
          renderBarChart(chartArea, labels, labels.map(nv => thongKe[nv].soNgay), "Tổng số ngày nghỉ", "#66bb6a");
          renderBarChart(chartArea, labels, labels.map(nv => thongKe[nv].soDonDuyet), "Số đơn được duyệt", "#42a5f5");
      }
  });
}

function renderBarChart(container, labels, data, title, color) {
  const canvas = document.createElement("canvas");
  canvas.style.marginBottom = "30px";
  canvas.style.maxWidth = "600px";
  canvas.style.margin = "20px auto";
  container.appendChild(canvas);

  new Chart(canvas.getContext("2d"), {
      type: 'bar',
      data: {
          labels,
          datasets: [{
              label: title,
              data,
              backgroundColor: color
          }]
      },
      options: {
          responsive: true,
          plugins: {
              title: {
                  display: true,
                  text: title
              }
          },
          scales: {
              y: {
                  beginAtZero: true,
                  ticks: {
                      stepSize: 1
                  }
              }
          }
      }
  });
}




// sửa
document.getElementById("menuBaoCao").addEventListener("click", function(e) {
  e.preventDefault();
  setActiveSidebar("menuBaoCao");
  document.getElementById("tonghopChamCong").style.display = "none";
  document.getElementById("tonghopNghiPhep").style.display = "none";
  document.getElementById("donNghiPhepSection").style.display = "none";
  // Hiển thị khối container và gọi hàm showBaoCao
  document.getElementById("attendance-container").classList.remove("hidden");
  document.getElementById("attendance-container").classList.add("visible");
  showBaoCao();

});

// sửa

// thêm

document.addEventListener("DOMContentLoaded", function() {
  // Thiết lập active sidebar
  setActiveSidebar("menuChamCong");
  // Hiển thị container chấm công
  const container = document.getElementById("attendance-container");
  container.classList.remove("hidden");
  container.classList.add("visible");

  // Hiển thị giao diện chấm công
  showChamCong();
});