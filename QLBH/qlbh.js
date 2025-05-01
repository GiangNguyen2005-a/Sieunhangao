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
    formData.append('trangthai', document.getElementById('trangthai').value); // Thêm trường trạng thái
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
document.getElementById('manv').addEventListener('blur', function() {
    const manv = this.value;
    if (manv) {
        // Kiểm tra mã nhân viên trong bảng ttbh
        fetch('check_ttbh.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'manv=' + encodeURIComponent(manv)
        })
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                alert('Mã nhân viên đã tồn tại trong bảng ttbh');
                this.value = ''; // Xóa mã nhân viên nếu đã tồn tại
            } else {
                // Lấy thông tin từ nhanvien, phongban, vitri
                fetch('get_employee.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: 'manv=' + encodeURIComponent(manv)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        document.getElementById('tennv').value = data.TenNV || '';
                        document.getElementById('cccd').value = data.CCCD || '';
                        document.getElementById('ngaysinh').value = data.NgaySinh || '';
                        document.getElementById('gioitinh').value = data.GioiTinh || '';
                        document.getElementById('sdt').value = data.SDT || '';
                        document.getElementById('diachi').value = data.DiaChi || '';
                        document.getElementById('chucvu').value = data.TenVT || '';
                        document.getElementById('phongban').value = data.TenPB || '';
                        // Không điền thông tin BHXH
                    }
                })
                .catch(error => {
                    console.error('Lỗi:', error);
                    alert('Có lỗi xảy ra khi lấy thông tin nhân viên');
                });
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra khi kiểm tra mã nhân viên');
        });
    }
});

document.querySelectorAll('.btn-warning').forEach(btn => {
    btn.addEventListener('click', function() {
        const manv = this.getAttribute('data-manv');
        fetch('get_employee_detail.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'manv=' + encodeURIComponent(manv)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }
            // Điền thông tin vào form chỉnh sửa
            document.getElementById('edit_manv').value = data.MaNV || '';
            document.getElementById('edit_tennv').value = data.TenNV || '';
            document.getElementById('edit_cccd').value = data.CCCD || '';
            document.getElementById('edit_ngaysinh').value = data.NgaySinh || '';
            document.getElementById('edit_gioitinh').value = data.GioiTinh || '';
            document.getElementById('edit_sdt').value = data.SDT || '';
            document.getElementById('edit_diachi').value = data.DiaChi || '';
            document.getElementById('edit_chucvu').value = data.tenvt || '';
            document.getElementById('edit_phongban').value = data.tenpb || '';
            document.getElementById('edit_daCoMaBHXH').value = data.mabh ? 'Có' : 'Chưa';
            document.getElementById('edit_mabh').value = data.mabh || '';
            document.getElementById('edit_trangthai').value = data.trangthai || ''; // Điền trạng thái
            document.getElementById('edit_nbd').value = data.nbd || '';
            document.getElementById('edit_nkt').value = data.nkt || '';
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra khi lấy thông tin nhân viên');
        });
    });
});

document.getElementById('saveEditEmployee').addEventListener('click', function() {
    const form = document.getElementById('editEmployeeForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData();
    formData.append('manv', document.getElementById('edit_manv').value);
    formData.append('tennv', document.getElementById('edit_tennv').value);
    formData.append('cccd', document.getElementById('edit_cccd').value);
    formData.append('ngaysinh', document.getElementById('edit_ngaysinh').value);
    formData.append('gioitinh', document.getElementById('edit_gioitinh').value);
    formData.append('sdt', document.getElementById('edit_sdt').value);
    formData.append('diachi', document.getElementById('edit_diachi').value);
    formData.append('chucvu', document.getElementById('edit_chucvu').value);
    formData.append('phongban', document.getElementById('edit_phongban').value);
    formData.append('daCoMaBHXH', document.getElementById('edit_daCoMaBHXH').value);
    formData.append('mabh', document.getElementById('edit_mabh').value);
    formData.append('trangthai', document.getElementById('edit_trangthai').value); // Thêm trường trạng thái
    formData.append('nbd', document.getElementById('edit_nbd').value);
    formData.append('nkt', document.getElementById('edit_nkt').value);
    formData.append('tlnld', document.getElementById('edit_tlnld').value);
    formData.append('tldn', document.getElementById('edit_tldn').value);

    fetch('update_employee.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Cập nhật thông tin thành công');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editEmployeeModal'));
            modal.hide();
            window.location.reload();
        } else {
            alert('Lỗi: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi cập nhật thông tin');
    });
});

document.getElementById('add_manv').addEventListener('blur', function() {
    const manv = this.value;
    if (manv) {
        fetch('check_qlbh.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'manv=' + encodeURIComponent(manv)
        })
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                alert('Nhân viên đã có thông tin BHXH, vui lòng sử dụng chức năng sửa.');
                this.value = ''; // Clear the input
            } else {
                fetch('get_employee.php?manv=' + encodeURIComponent(manv))
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error('Server trả về lỗi: ' + text) });
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        document.getElementById('add_tennv').value = data.TenNV || '';
                        document.getElementById('add_cccd').value = data.CCCD || '';
                        document.getElementById('add_ngaysinh').value = data.NgaySinh || '';
                        document.getElementById('add_gioitinh').value = data.GioiTinh || '';
                        document.getElementById('add_sdt').value = data.SDT || '';
                        document.getElementById('add_diachi').value = data.DiaChi || '';
                        document.getElementById('add_chucvu').value = data.TenVT || '';
                        document.getElementById('add_phongban').value = data.TenPB || '';
                    }
                })
                .catch(error => {
                    console.error('Lỗi:', error);
                    alert('Có lỗi xảy ra: ' + error.message);
                });
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra khi kiểm tra mã nhân viên');
        });
    }
});
// ... (Phần mã hiện có của qlbh.js giữ nguyên)

// Thêm sự kiện cho nút saveNewEmployee
document.addEventListener('DOMContentLoaded', function() {
    const saveNewEmployeeBtn = document.getElementById('saveNewEmployee');
    if (saveNewEmployeeBtn) {
        saveNewEmployeeBtn.addEventListener('click', function() {
            const form = document.getElementById('addEmployeeForm');
            
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const daThamGiaBHXH = document.getElementById('daThamGiaBHXH').value;
            const mabh = document.getElementById('mabh1').value;
            if (daThamGiaBHXH === 'Có' && !mabh) {
                alert('Vui lòng nhập mã số BHXH khi nhân viên đã tham gia BHXH.');
                return;
            }

            const formData = new FormData();
            formData.append('manv', document.getElementById('add_manv').value);
            formData.append('mabh', mabh || '');
            formData.append('nbd', document.getElementById('add_nbd').value);
            formData.append('nkt', document.getElementById('add_nkt').value || '');
            formData.append('trangthai', document.getElementById('add_trangthai').value);
            formData.append('tlnld', document.getElementById('tlnld').value);
            formData.append('tldn', document.getElementById('tldn').value);

            fetch('save_employee.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Thêm mới thành công');
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addEmployeeModal'));
                    modal.hide();
                    form.reset();
                    window.location.reload();
                } else {
                    alert('Lỗi: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Lỗi:', error);
                alert('Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại.');
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Xử lý nút Xóa
    document.querySelectorAll('.btn-danger').forEach(function(button) {
        button.addEventListener('click', function() {
            const manv = this.getAttribute('data-manv');
            if (confirm('Bạn có chắc chắn muốn xóa thông tin BHXH của nhân viên này?')) {
                deleteEmployee(manv, this);
            }
        });
    });

    function deleteEmployee(manv, button) {
        fetch('delete_employee.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'manv=' + encodeURIComponent(manv)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Xóa thành công');
                // Xóa hàng trong bảng
                const row = button.closest('tr');
                row.remove();
            } else {
                alert('Lỗi: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra khi xóa thông tin');
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const queryForm = document.getElementById('queryForm');
    const queryResult = document.getElementById('queryResult');

    queryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const insuranceId = document.getElementById('insuranceId').value;

        if (!kiemTraMaBHXH(insuranceId)) {
            queryResult.innerHTML = `<div class="alert alert-danger">Mã số BHXH không hợp lệ. Vui lòng nhập 10 chữ số.</div>`;
            return;
        }

        fetch('tra_cuu_bhxh.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'insuranceId=' + encodeURIComponent(insuranceId)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                queryResult.innerHTML = `<div class="alert alert-danger">${data.error}</div>`;
            } else {
                queryResult.innerHTML = `
                    <h5>Thông tin BHXH</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Mã số BHXH:</strong> ${data.mabh}</p>
                            <p><strong>Họ và tên:</strong> ${data.tennv}</p>
                            <p><strong>CCCD/CMND:</strong> ${data.cccd}</p>
                            <p><strong>Ngày sinh:</strong> ${data.ngaysinh}</p>
                            <p><strong>Giới tính:</strong> ${data.gioitinh}</p>
                            <p><strong>Điện thoại:</strong> ${data.sdt}</p>
                        </div>
                `;
            }
            queryResult.classList.add('show');
        })
        .catch(error => {
            console.error('Lỗi:', error);
            queryResult.innerHTML = `<div class="alert alert-danger">Đã xảy ra lỗi khi tra cứu. Vui lòng thử lại sau.</div>`;
        });
    });

    function kiemTraMaBHXH(id) {
        return /^\d{10}$/.test(id);
    }

});