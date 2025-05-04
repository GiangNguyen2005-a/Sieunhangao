function anTatCaNoiDung() {
  document.getElementById("chamCongSection").style.display = "none";
  document.getElementById("xinNghiPhepSection").style.display = "none";
  document.getElementById("donNghiPhepSection").style.display = "none";
  document.getElementById("tonghopChamCong").style.display = "none";
  document.getElementById("baoCaoSection").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  // Load filter options
  fetch('api/chamcong.php?action=getFilterOptions')
    .then(response => response.json())
    .then(data => {
      const { phongBanOptions, thangOptions, namOptions, trangThaiNghiOptions } = data;
      themOption("filterPhongBanNghi", phongBanOptions);
      themOption("filterThangNghi", thangOptions);
      themOption("filterNamNghi", namOptions);
      themOption("filterTrangThaiNghi", trangThaiNghiOptions);
      themOption("filterPhongBan", phongBanOptions);
      themOption("locPhongBC", phongBanOptions);
    });
  // Hiển thị chấm công mặc định
  showChamCong();
});

function themOption(id, options) {
  const select = document.getElementById(id);
  select.innerHTML = `<option>-- ${id.includes('Phong') ? 'Lọc phòng ban' : id.includes('Thang') ? 'Lọc tháng' : id.includes('Nam') ? 'Lọc năm' : 'Lọc trạng thái'} --</option>`;
  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.text = opt;
    select.appendChild(option);
  });
}

function hienPopupPhanHoi(tenNV, ngay, phanHoi, anhPhanHoi, iconElement, maCC) {
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
  popup.querySelector(".btn-duyet").addEventListener("click", () => {
    fetch('api/chamcong.php?action=approveFeedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maCC, status: 'Duyệt' })
    }).then(() => {
      iconElement.innerHTML = `<i class="fas fa-inbox"></i> <i class="fas fa-check-circle" style="color:green; font-size:0.7em;"></i>`;
      popup.remove();
    });
  });
  popup.querySelector(".btn-khongduyet").addEventListener("click", () => {
    fetch('api/chamcong.php?action=approveFeedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maCC, status: 'Không duyệt' })
    }).then(() => {
      iconElement.innerHTML = `<i class="fas fa-inbox"></i> <i class="fas fa-times-circle" style="color:red; font-size:0.7em;"></i>`;
      popup.remove();
    });
  });
}

const navLinks = document.querySelectorAll(".main-nav a");
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    navLinks.forEach(el => el.classList.remove("active"));
    link.classList.add("active");
  });
});

function setActiveNav(id) {
  navLinks.forEach(link => link.classList.remove("active"));
  const activeLink = document.getElementById(id);
  if (activeLink) activeLink.classList.add("active");
}

function hienThiBangChamCong(data) {
  const tbody = document.querySelector("#bangTongHopChamCong tbody");
  tbody.innerHTML = "";
  data.forEach((item, index) => {
    const row = document.createElement("tr");
    const iconHTML = item.noiDungPhanHoi && item.noiDungPhanHoi.trim() !== ""
      ? `<span class="feedback-icon-wrap" data-index="${index}" data-maCC="${item.maCC}" style="cursor:pointer;">
           <i class="fas fa-inbox"></i>
         </span>`
      : "";
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
  document.querySelectorAll(".feedback-icon-wrap").forEach(icon => {
    icon.addEventListener("click", function () {
      const index = this.dataset.index;
      const maCC = this.dataset.maCC;
      const dataPhanHoi = data[index];
      hienPopupPhanHoi(dataPhanHoi.tenNV, dataPhanHoi.ngay, dataPhanHoi.noiDungPhanHoi, dataPhanHoi.bangChung, this, maCC);
    });
  });
}

function filterTongHopChamCong() {
  const phongBan = document.getElementById("filterPhongBan").value;
  const thang = document.getElementById("filterThang").value;
  const trangThai = document.getElementById("filterTrangThai").value;
  const phanHoi = document.getElementById("filterPhanHoi").value;
  fetch('api/chamcong.php?action=getTongHopChamCong', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phongBan, thang, trangThai, phanHoi })
  })
    .then(response => response.json())
    .then(data => hienThiBangChamCong(data))
    .catch(error => console.error('Error:', error));
}

function resetTongHopChamCong() {
  document.getElementById("filterPhongBan").selectedIndex = 0;
  document.getElementById("filterThang").selectedIndex = 0;
  document.getElementById("filterTrangThai").selectedIndex = 0;
  document.getElementById("filterPhanHoi").selectedIndex = 0;
  filterTongHopChamCong();
}

document.getElementById("menuTongHopChamCong").addEventListener("click", function (e) {
  e.preventDefault();
  setActiveNav("menuTongHopChamCong");
  anTatCaNoiDung();
  document.getElementById("tonghopChamCong").style.display = "block";
  filterTongHopChamCong();
});

function hienThiBangChamCongCaNhan(data) {
  const tbody = document.getElementById("attendanceBody");
  tbody.innerHTML = "";
  data.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.ngay}</td>
      <td>${item.gioDen}</td>
      <td>${item.gioVe}</td>
      <td>${item.trangThai}</td>
      <td>
        ${item.noiDungPhanHoi ? 
          '<i class="fas fa-comment-dots" title="Đã phản hồi"></i>' :
          `<i class="fas fa-comment-dots feedback-icon" data-maCC="${item.maCC}" onclick="openFeedback(this)"></i>`}
      </td>
    `;
    tbody.appendChild(row);
  });
}

function showChamCong() {
  anTatCaNoiDung();
  const section = document.getElementById("chamCongSection");
  section.style.display = "block";
  setActiveNav("menuChamCong");
  const button = document.getElementById("checkinButton");
  const tbody = document.getElementById("attendanceBody");
  const tuNgayInput = document.getElementById("tuNgayChamCong");
  const denNgayInput = document.getElementById("denNgayChamCong");
  const btnLoc = document.getElementById("btnLocChamCong");
  const btnReset = document.getElementById("btnResetChamCong");
  let isChamDen = false;

  // Kiểm tra trạng thái chấm công hôm nay
  fetch('api/chamcong.php?action=checkChamCongToday')
    .then(response => response.json())
    .then(data => {
      if (data.gioDen && !data.gioVe) {
        isChamDen = true;
        button.innerText = "Chấm công về";
        button.style.backgroundColor = "#e53935";
      }
      // Load dữ liệu chấm công
      fetchChamCongCaNhan();
    });

  button.onclick = () => {
    const action = isChamDen ? 'checkOut' : 'checkIn';
    fetch('api/chamcong.php?action=' + action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maNV: 'NV001' })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          isChamDen = !isChamDen;
          button.innerText = isChamDen ? "Chấm công về" : "Chấm công đến";
          button.style.backgroundColor = isChamDen ? "#e53935" : "#2196f3";
          fetchChamCongCaNhan();
        } else {
          alert(data.message || 'Lỗi khi chấm công');
        }
      });
  };

  btnLoc.onclick = () => {
    const tuNgay = tuNgayInput.value;
    const denNgay = denNgayInput.value;
    if (!tuNgay || !denNgay) {
      tbody.innerHTML = `<tr><td colspan="5">Vui lòng chọn đầy đủ Từ ngày và Đến ngày.</td></tr>`;
      return;
    }
    fetchChamCongCaNhan(tuNgay, denNgay);
  };

  btnReset.onclick = () => {
    tuNgayInput.value = "";
    denNgayInput.value = "";
    fetchChamCongCaNhan();
  };

  function fetchChamCongCaNhan(tuNgay = '', denNgay = '') {
    fetch('api/chamcong.php?action=getChamCongCaNhan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maNV: 'NV001', tuNgay, denNgay })
    })
      .then(response => response.json())
      .then(data => hienThiBangChamCongCaNhan(data))
      .catch(error => console.error('Error:', error));
  }
}

function openFeedback(iconElement) {
  document.getElementById("feedbackPopup").style.display = "block";
  document.getElementById("feedbackPopup").dataset.maCC = iconElement.dataset.maCC;
}

function closeFeedback() {
  document.getElementById("feedbackPopup").style.display = "none";
}

function submitFeedback() {
  const maCC = document.getElementById("feedbackPopup").dataset.maCC;
  const content = document.getElementById("feedbackContentInput").value;
  const fileInput = document.getElementById("feedbackImageInput");
  const formData = new FormData();
  formData.append('action', 'submitFeedback');
  formData.append('maCC', maCC);
  formData.append('noiDung', content);
  if (fileInput.files[0]) {
    formData.append('bangChung', fileInput.files[0]);
  }

  fetch('api/chamcong.php', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        closeFeedback();
        showChamCong();
      } else {
        alert(data.message || 'Lỗi khi gửi phản hồi');
      }
    });
}

function showXinNghiPhep() {
  anTatCaNoiDung();
  document.getElementById("xinNghiPhepSection").style.display = "block";
  setActiveNav("menuNghiPhep");
  document.getElementById("submitLeave").addEventListener("click", () => {
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;
    const reason = document.getElementById("reason").value;
    if (start && end && reason) {
      fetch('api/nghiphep.php?action=submitLeave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maNV: 'NV001', start, end, reason })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const tbody = document.getElementById("leaveHistoryBody");
            const row = tbody.insertRow();
            row.insertCell(0).innerText = "NV001";
            row.insertCell(1).innerText = "Nguyễn Văn A";
            row.insertCell(2).innerText = start;
            row.insertCell(3).innerText = end;
            row.insertCell(4).innerText = reason;
            row.insertCell(5).innerHTML = '<span class="status-pending">Chờ duyệt</span>';
            document.getElementById("startDate").value = "";
            document.getElementById("endDate").value = "";
            document.getElementById("reason").value = "";
          } else {
            alert(data.message || 'Lỗi khi gửi đơn nghỉ phép');
          }
        });
    }
  }, { once: true });
}

document.getElementById("menuNghiPhep").addEventListener("click", (e) => {
  e.preventDefault();
  showXinNghiPhep();
});

function renderDonNghiPhep(data) {
  const tbody = document.getElementById("donNghiPhepTableBody");
  tbody.innerHTML = "";
  data.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.MaNV}</td>
      <td>${item.TenNV}</td>
      <td>${item.phongBan}</td>
      <td>${item.ngayGui}</td>
      <td>${item.tuNgay}</td>
      <td>${item.denNgay}</td>
      <td>${item.LyDo}</td>
      <td>
        <select class="select-trangthai" data-maDXNP="${item.maDXNP}">
          <option ${item.tinhTrang === "Chờ duyệt" ? "selected" : ""}>Chờ duyệt</option>
          <option ${item.tinhTrang === "Đã duyệt" ? "selected" : ""}>Đã duyệt</option>
          <option ${item.tinhTrang === "Từ chối" ? "selected" : ""}>Từ chối</option>
        </select>
      </td>
    `;
    tbody.appendChild(row);
  });
}

document.getElementById("btnLuuTrangThai").addEventListener("click", () => {
  const rows = document.querySelectorAll("#donNghiPhepTableBody tr");
  const updates = [];
  rows.forEach(row => {
    const maDXNP = row.querySelector("select").dataset.maDXNP;
    const tinhTrang = row.querySelector("select").value;
    updates.push({ maDXNP, tinhTrang });
  });
  fetch('api/nghiphep.php?action=updateLeaveStatus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ updates })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Cập nhật trạng thái thành công');
        renderDonNghiPhep(data.data);
      } else {
        alert(data.message || 'Lỗi khi cập nhật trạng thái');
      }
    });
});

function apDungLocNghi() {
  const phongBan = document.getElementById("filterPhongBanNghi").value;
  const thang = document.getElementById("filterThangNghi").value;
  const nam = document.getElementById("filterNamNghi").value;
  const trangThai = document.getElementById("filterTrangThaiNghi").value;
  fetch('api/nghiphep.php?action=getDonNghiPhep', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phongBan, thang, nam, trangThai })
  })
    .then(response => response.json())
    .then(data => renderDonNghiPhep(data))
    .catch(error => console.error('Error:', error));
}

function resetLocNghi() {
  document.getElementById("filterPhongBanNghi").selectedIndex = 0;
  document.getElementById("filterThangNghi").selectedIndex = 0;
  document.getElementById("filterNamNghi").selectedIndex = 0;
  document.getElementById("filterTrangThaiNghi").selectedIndex = 0;
  apDungLocNghi();
}

document.getElementById("btnDanhSachNghiPhep").addEventListener("click", function (e) {
  e.preventDefault();
  setActiveNav("btnDanhSachNghiPhep");
  anTatCaNoiDung();
  document.getElementById("donNghiPhepSection").style.display = "block";
  apDungLocNghi();
});

function showBaoCao() {
  anTatCaNoiDung();
  document.getElementById("baoCaoSection").style.display = "block";
  setActiveNav("menuBaoCao");
  document.getElementById("baoCaoTableArea").innerHTML = "";
  document.getElementById("baoCaoCharts").innerHTML = "";
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
      tableArea.innerHTML = `<p style="color:red">Vui lòng chọn đầy đủ phòng ban, tháng và năm.</p>`;
      return;
    }
    fetch(`api/baocao.php?action=${loai}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phongBan, thang, nam })
    })
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          tableArea.innerHTML = `<p style="color:red">Không tìm thấy dữ liệu.</p>`;
          return;
        }
        if (loai === "chamcong") {
          tableArea.innerHTML = `
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
                ${data.map(row => `
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
          const tongHop = {};
          data.forEach(item => {
            if (!tongHop[item.tenNV]) tongHop[item.tenNV] = { gio: 0, muon: 0, thieu: 0 };
            const gioDen = parseInt(item.gioDen.split(":")[0]);
            const gioVe = parseInt(item.gioVe.split(":")[0]);
            tongHop[item.tenNV].gio += (gioVe - gioDen);
            if (item.trangThai === "Đi muộn") tongHop[item.tenNV].muon++;
            if (item.trangThai === "Về sớm") tongHop[item.tenNV].thieu++;
          });
          const labels = Object.keys(tongHop);
          renderBarChart(chartArea, labels, labels.map(nv => tongHop[nv].gio), "Tổng giờ làm", "#42a5f5");
          renderBarChart(chartArea, labels, labels.map(nv => tongHop[nv].muon), "Số lần đi muộn", "#ff9800");
          renderBarChart(chartArea, labels, labels.map(nv => tongHop[nv].thieu), "Số lần về sớm", "#ef5350");
        } else if (loai === "nghiphep") {
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
                    <td>${item.MaNV}</td>
                    <td>${item.TenNV}</td>
                    <td>${item.phongBan}</td>
                    <td>${item.ngayGui}</td>
                    <td>${item.tuNgay}</td>
                    <td>${item.denNgay}</td>
                    <td>${item.LyDo}</td>
                    <td>${item.TinhTrang}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          `;
          const thongKe = {};
          data.forEach(item => {
            if (!thongKe[item.tenNV]) thongKe[item.tenNV] = { soNgay: 0, soDonDuyet: 0, soDon: 1 };
            const start = new Date(item.tuNgay.split("/").reverse().join("-"));
            const end = new Date(item.denNgay.split("/").reverse().join("-"));
            const soNgay = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
            thongKe[item.tenNV].soNgay += soNgay;
            if (item.tinhTrang === "Đã duyệt") thongKe[item.tenNV].soDonDuyet++;
            if (thongKe[item.tenNV].soDon) thongKe[item.tenNV].soDon++;
          });
          const labels = Object.keys(thongKe);
          renderBarChart(chartArea, labels, labels.map(nv => thongKe[nv].soNgay), "Tổng số ngày nghỉ", "#66bb6a");
          renderBarChart(chartArea, labels, labels.map(nv => thongKe[nv].soDonDuyet), "Số đơn được duyệt", "#42a5f5");
          renderBarChart(chartArea, labels, labels.map(nv => thongKe[nv].soDon), "Tổng số đơn nghỉ phép", "#ff9800");
        }
      });
  }, { once: true });
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

document.getElementById("menuChamCong").addEventListener("click", (e) => {
  e.preventDefault();
  showChamCong();
});

document.getElementById("menuBaoCao").addEventListener("click", function(e) {
  e.preventDefault();
  showBaoCao();
});