document.addEventListener('DOMContentLoaded', function() {
    // Main tab navigation
    const mainNavLinks = document.querySelectorAll('.main-nav .nav-link');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Khôi phục tab đã chọn từ localStorage
    const activeTabId = localStorage.getItem('activeTab');
    if (activeTabId) {
        const activeTab = document.querySelector(`[data-target="${activeTabId}"]`);
        if (activeTab) {
            // Kích hoạt tab đã lưu
            mainNavLinks.forEach(item => item.classList.remove('active'));
            tabPanes.forEach(tab => tab.classList.remove('show', 'active'));
            
            activeTab.classList.add('active');
            document.getElementById(activeTabId).classList.add('show', 'active');
        }
    }

    mainNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and tabs
            mainNavLinks.forEach(item => item.classList.remove('active'));
            tabPanes.forEach(tab => tab.classList.remove('show', 'active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show the corresponding tab
            const targetId = this.getAttribute('data-target');
            const targetTab = document.getElementById(targetId);
            targetTab.classList.add('show', 'active');

            // Lưu tab đang active vào localStorage
            localStorage.setItem('activeTab', targetId);
        });
    });

    // Sub tab navigation
    const subNavButtons = document.querySelectorAll('.sub-nav-item');

    subNavButtons.forEach(button => {
        button.addEventListener('click', function() {
            const subtabId = this.getAttribute('data-subtab');
            const parentTab = this.closest('.tab-pane');
            
            if (!parentTab) return; // Exit if no parent tab found
            
            const parentTabId = parentTab.id;
            
            // Remove active class from all buttons and hide all contents within this tab pane
            const currentTabButtons = document.querySelectorAll(`#${parentTabId} .sub-nav-item`);
            const currentTabContents = document.querySelectorAll(`#${parentTabId} .sub-tab-content`);
            
            currentTabButtons.forEach(btn => btn.classList?.remove('active'));
            currentTabContents.forEach(content => {
                if (content) {
                    content.classList?.remove('active-sub-tab');
                    content.style.display = 'none';
                }
            });
            
            // Add active class to clicked button and show corresponding content
            this.classList?.add('active');
            const targetContent = document.getElementById(subtabId);
            if (targetContent) {
                targetContent.classList?.add('active-sub-tab');
                targetContent.style.display = 'block';
            }
        });
    });

    // Form submissions
    const queryForm = document.getElementById('queryForm');
    const queryResult = document.getElementById('queryResult');

    // Query Form
    queryForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const insuranceId = document.getElementById('insuranceId').value;
        
        if (!kiemTraMaBHXH(insuranceId)) {
            alert('Mã số BHXH không hợp lệ. Vui lòng nhập 10 chữ số.');
            return;
        }
 
        // Giả lập gọi API
        setTimeout(() => {
            // In qlbh.js, find the setTimeout function in the queryForm event listener
            // Replace the queryResult.innerHTML = `...` part with:
            queryResult.innerHTML = `
            <h5>Thông tin BHXH</h5>
            <div class="row">
                <div class="col-md-6">
                    <p><strong>Mã số BHXH:</strong> ${insuranceId}</p>
                    <p><strong>Họ và tên:</strong> Nguyễn Văn A</p>
                    <p><strong>CCCD/CMND:</strong> 001200123456</p>
                    <p><strong>Ngày sinh:</strong> 01/01/1990</p>
                    <p><strong>Giới tính:</strong> Nam</p>
                    <p><strong>Điện thoại:</strong> 0901234567</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Ngày tham gia:</strong> 01/01/2023</p>
                    <p><strong>Tình trạng:</strong> <span class="badge bg-success">Đang tham gia</span></p>
                    <p><strong>Thời gian đóng BHXH:</strong> 1 năm 3 tháng</p>
                    <p><strong>Mức lương đóng BHXH:</strong> ${formatCurrency(10000000)}</p>
                    <p><strong>Đơn vị tham gia:</strong> Công ty TNHH ABC</p>
                    <p><strong>Nơi KCB ban đầu:</strong> Bệnh viện XYZ</p>
                </div>
            </div>
            <div class="mt-3">
                <h6>Lịch sử đóng BHXH</h6>
                <div class="table-responsive">
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>Thời gian</th>
                                <th>Đơn vị</th>
                                <th>Mức đóng</th>
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>01/2023 - 12/2023</td>
                                <td>Công ty TNHH ABC</td>
                                <td>${formatCurrency(8000000)}</td>
                                <td>Đóng đủ</td>
                            </tr>
                            <tr>
                                <td>01/2024 - Hiện tại</td>
                                <td>Công ty TNHH ABC</td>
                                <td>${formatCurrency(10000000)}</td>
                                <td>Đóng đủ</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            `;
            queryResult.classList.add('show');
        }, 500);
    });

    function kiemTraMaBHXH(id) {
        return /^\d{10}$/.test(id);
    }
});
// Add to qlbh.js (after the existing code)
document.addEventListener('DOMContentLoaded', function() {
    // Add specific event listeners for the sub-tabs in "khai báo bảo hiểm"
    const nhapThongTinBtn = document.querySelector('[data-subtab="nhapThongTin"]');
    const guiLenCoQuanBtn = document.querySelector('[data-subtab="guiLenCoQuan"]');
    const kiemTraTienDoBtn = document.querySelector('[data-subtab="kiemTra"]');
    const kiemTraTienDoSection = document.getElementById('kiemTra');
    
    // Function to show/hide the progress section
    function toggleProgressSection(shouldShow) {
        if (kiemTraTienDoSection) {
            kiemTraTienDoSection.style.display = shouldShow ? 'block' : 'none';
        }
    }
    
    // Add click event listeners for each tab
    if (nhapThongTinBtn) {
        nhapThongTinBtn.addEventListener('click', function() {
            toggleProgressSection(false); // Hide progress section
        });
    }
    
    if (guiLenCoQuanBtn) {
        guiLenCoQuanBtn.addEventListener('click', function() {
            toggleProgressSection(false); // Hide progress section
        });
    }
    
    if (kiemTraTienDoBtn) {
        kiemTraTienDoBtn.addEventListener('click', function() {
            toggleProgressSection(true); // Show progress section
        });
    }
    
    // Initialize - hide progress section if not on that tab
    const activeSubTab = document.querySelector('.sub-nav-item.active');
    if (activeSubTab && activeSubTab.getAttribute('data-subtab') !== 'kiemTraTienDo') {
        toggleProgressSection(false);
    }
});

// thêm grok 
// Xử lý nút "Sửa"
const editBtns = document.querySelectorAll('.btn-warning');
editBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const row = this.closest('tr');
        // Giả lập mở form chỉnh sửa
        alert(`Mở form chỉnh sửa cho nhân viên: ${row.cells[0].textContent}`);
        // Thay alert bằng logic hiển thị modal nếu cần
    });
});

// Xử lý nút "Xóa"
const deleteBtns = document.querySelectorAll('.btn-danger');
deleteBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const row = this.closest('tr');
        if (confirm(`Bạn có chắc chắn muốn xóa nhân viên ${row.cells[0].textContent}?`)) {
            row.remove();
            // Thay row.remove() bằng logic gửi API xóa nếu cần
        }
    });
});
// thêm nhân viên
// Đảm bảo mã chạy sau khi DOM đã tải
document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử
    const daThamGiaBHXH = document.getElementById('daThamGiaBHXH');
    const maBHXHInput = document.getElementById('mabh1');

    // Kiểm tra xem các phần tử có tồn tại không
    if (daThamGiaBHXH && maBHXHInput) {
        // Mặc định disable input mã BHXH
        maBHXHInput.style.disabled = true;

        // Thêm sự kiện thay đổi cho select "Đã tham gia BHXH"
        daThamGiaBHXH.addEventListener('change', function() {
            if (this.value === 'Có') {
                maBHXHInput.disabled = false; // Cho phép nhập khi chọn "Có"
                maBHXHInput.required = true;  // Bắt buộc nhập khi chọn "Có"
            } else {
                maBHXHInput.disabled = true;  // Không cho phép nhập khi chọn "Chưa"
                maBHXHInput.required = false; // Không bắt buộc nhập khi chọn "Chưa"
                maBHXHInput.value = '';      // Xóa giá trị khi disable
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử
    const daCoMaBHXH = document.getElementById('daCoMaBHXH');
    const kbbhField = document.getElementById('mabh');
    if (daCoMaBHXH && kbbhField) {
        kbbhField.style.disabled = true;

        // Thêm sự kiện thay đổi cho select "Đã tham gia BHXH"
        daCoMaBHXH.addEventListener('change', function() {
            if (this.value === 'Có') {
                kbbhField.disabled = false; // Cho phép nhập khi chọn "Có"
                kbbhField.required = true;  // Bắt buộc nhập khi chọn "Có"
            } else {
                kbbhField.disabled = true;  // Không cho phép nhập khi chọn "Chưa"
                kbbhField.required = false; // Không bắt buộc nhập khi chọn "Chưa"
                kbbhField.value = '';      // Xóa giá trị khi disable
            }
        });
    }
});
// Xử lý modal thêm mới lao động
document.addEventListener('DOMContentLoaded', function() {
    const addEmployeeModal = document.getElementById('addEmployeeModal');
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    const saveNewEmployee = document.getElementById('saveNewEmployee');

    // Xử lý hiển thị/ẩn trường mã BHXH
    const maBHXHField = document.getElementById('maBHXHField');
    // Xử lý nút lưu thông tin
    if (saveNewEmployee) {
        saveNewEmployee.addEventListener('click', function() {
            // Kiểm tra form hợp lệ
            if (!addEmployeeForm.checkValidity()) {
                addEmployeeForm.reportValidity();
                return;
            }

            // Giả lập lưu thông tin
            alert('Đã lưu thông tin nhân viên mới thành công!');
            
            // Đóng modal và reset form
            const modal = bootstrap.Modal.getInstance(addEmployeeModal);
            modal.hide();
            addEmployeeForm.reset();
        });
    }

    // Reset form khi đóng modal
    if (addEmployeeModal) {
        addEmployeeModal.addEventListener('hidden.bs.modal', function() {
            addEmployeeForm.reset();
            if (maBHXHField) {
                maBHXHField.style.display = 'none';
            }
        });
    }
});

document.getElementById('manv').addEventListener('blur', function() {
    var maNhanVien = this.value; // Lấy giá trị mã nhân viên
    if (maNhanVien) { // Kiểm tra nếu mã nhân viên không rỗng
        fetch('get_employee.php?manv=' + encodeURIComponent(maNhanVien))
            .then(response => {
                if (!response.ok) {
                    // Nếu trạng thái không phải 200 OK (ví dụ: 404), ném lỗi với nội dung phản hồi
                    return response.text().then(text => { throw new Error('Server trả về lỗi: ' + text) });
                }
                return response.json(); // Nếu OK, parse JSON
            })
            .then(data => {
                if (data.error) { // Nếu có lỗi từ server
                    alert(data.error);
                } else { // Nếu tìm thấy thông tin nhân viên
                    document.getElementById('tennv').value = data.TenNV;
                    document.getElementById('cccd').value = data.CCCD;
                    document.getElementById('ngaysinh').value = data.NgaySinh;
                    document.getElementById('gioitinh').value = data.GioiTinh;
                    document.getElementById('sdt').value = data.SDT;
                    document.getElementById('diachi').value = data.DiaChi;
                    document.getElementById('chucvu').value = data.TenVT;
                    document.getElementById('phongban').value = data.TenPB;                    
                    document.getElementById('mabh').value = data.mabh;
                    document.getElementById('nbd').value = data.nbd;
                    document.getElementById('nkt').value = data.nkt;
                }
            })
            .catch(error => {
                console.error('Lỗi:', error); // Xử lý lỗi nếu fetch thất bại
                alert('Có lỗi xảy ra: ' + error.message);
            });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Xử lý nút "Gửi" cho từng nhân viên
    document.querySelectorAll('.send-btn').forEach(function(button) {
        button.addEventListener('click', function() {
            var manv = this.getAttribute('data-manv');
            sendRequest({manv: manv});
        });
    });

    // Xử lý nút "Gửi tất cả"
    document.querySelector('.btn-success').addEventListener('click', function() {
        sendRequest({send_all: true});
    });

    function sendRequest(data) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'update_trangthai.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            if (xhr.status === 200) {
                location.reload(); // Tải lại trang khi cập nhật thành công
            } else {
                alert('Có lỗi xảy ra khi cập nhật trạng thái');
            }
        };
        var params = new URLSearchParams(data).toString();
        xhr.send(params);
    }
});

// Xử lý submit form đăng ký BHXH
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Thu thập dữ liệu từ form
    const formData = new FormData();
    formData.append('manv', document.getElementById('manv').value);
    formData.append('tennv', document.getElementById('tennv').value);
    formData.append('cccd', document.getElementById('cccd').value);
    formData.append('ngaysinh', document.getElementById('ngaysinh').value);
    formData.append('gioitinh', document.getElementById('gioitinh').value);
    formData.append('sdt', document.getElementById('sdt').value);
    formData.append('diachi', document.getElementById('diachi').value);
    formData.append('chucvu', document.getElementById('chucvu').value);
    formData.append('phongban', document.getElementById('phongban').value);
    formData.append('daCoMaBHXH', document.getElementById('daCoMaBHXH').value);
    formData.append('mabh', document.getElementById('mabh').value);
    formData.append('phuongankb', document.querySelector('select[name="phuongankb"]').value);
    formData.append('nbd', document.getElementById('nbd').value);
    formData.append('nkt', document.getElementById('nkt').value);
    formData.append('tlnld', document.getElementById('tlnld').value);
    formData.append('tldn', document.getElementById('tldn').value);

    // Gửi request đến server
    fetch('save_employee.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Reset form sau khi lưu thành công
            window.location.reload();
            document.getElementById('registerForm').reset();
        } else {
            alert('Lỗi: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Đã xảy ra lỗi khi lưu thông tin');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[detail-btn]').forEach(btn => {
        btn.addEventListener('click', function() {
            const manv = this.getAttribute('data-manv');
            
            fetch('get_employee_detail.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'manv=' + manv
            })
            .then(response => response.json())
            .then(data => {
                if(data.error) {
                    alert(data.error);
                    return;
                }
                
                // Cập nhật thông tin vào modal hiện có
                updateModalContent(data);
            })
            .catch(error => console.error('Error:', error));
        });
    });
});

function updateModalContent(data) {
    // Cập nhật từng trường thông tin
    const fields = {
        'manv': data.MaNV || '',
        'tennv': data.TenNV || '',
        'CCCD': data.cccd || '',
        'ngaysinh': data.NgaySinh || '',
        'gioitinh': data.GioiTinh || '',
        'sdt': data.SDT || '',
        'diachi': data.DiaChi || '',
        'tenvt': data.tenvt || '',
        'tenpb': data.tenpb || '',
        'mabh': data.mabh || '',
        'phuongankb': data.phuongankb || '',
        'nbd': data.nbd || '',
        'nkt': data.nkt || '',
        'mucdongnld': data.mucdongnld || '',
        'mucdongdn': data.mucdongdn || ''
    };

    // Cập nhật từng trường trong modal
    Object.keys(fields).forEach(key => {
        const element = document.getElementById('detail_' + key);
        if (element) {
            element.textContent = fields[key];
        }
    });
}


document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('[detail-btn-2]').forEach(btn => {
        btn.addEventListener('click', function() {
            const cccd = this.getAttribute('data-cccd');
            
            fetch('get_employee_detail_2.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'cccd=' + cccd
            })
            .then(response => response.json())
            .then(data => {
                if(data.error) {
                    alert(data.error);
                    return;
                }
                
                // Cập nhật thông tin vào modal
                updateProcessDetail(data);
            })
            .catch(error => console.error('Error:', error));
        });
    });
});

// Tạo hàm mới để cập nhật modal tiến độ
function updateProcessDetail(data) {
    // Cập nhật từng trường thông tin
    const fields = {
        'kq_tennv': data.TenNV || '',
        'kq_cccd': data.CCCD || '',
        'kq_phuongankb': data.phuongankb || '',
        'kq_ngaygui': data.ngaygui || '',
        'kq_trangthai': data.trangthai || '',
        'kq_mabh': data.mabh || ''
    };

    // Cập nhật từng trường trong modal
    Object.keys(fields).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = fields[key];
        }
    });
}