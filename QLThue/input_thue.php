<?php 
// PHP code remains unchanged
?>
<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hệ thống quản lý thuế TNCN</title>
    <link rel="stylesheet" href="thue.css" />
    <script src="https://cdn.tailwindcss.com"></script>
    <?php include '..\Chung\relink.php'; ?>
    <style>
    .drawer {
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    }

    .drawer.open {
        transform: translateX(0);
    }
    </style>
</head>

<body class="bg-gray-100 font-sans">
    <div class="container flex min-h-screen">
        <?php  include_once('../Chung/sidebar.php') ?>
        <div class="main-content p-6">
            <h2 class="text-3xl font-bold text-gray-800 mb-8">Quản lý thuế TNCN</h2>
            <div class="bg-white rounded-xl shadow-lg p-8">
                <!-- Navigation -->
                <nav class="flex space-x-6 mb-8 border-b pb-4">
                <a href="../QLThue/input_thue.php" class="text-blue-600 hover:text-blue-600 flex items-center"><i
                            class="fas fa-file-alt mr-2"></i> Nhập thông tin thuế</a>
                    <a href="../QLThue/create_tokhai.php" data-page="declare" class="text-gray-600 hover:text-blue-600 flex items-center"><i
                            class="fas fa-calculator mr-2"></i> Tạo tờ khai</a>
                    <a href="../QLThue/veri_nopthue.php" data-page="xacnhan" class="text-gray-600 font-semibold flex items-center"><i
                            class="fas fa-check-circle mr-2"></i> Xác nhận đã nộp</a>
                    <a href="../QLThue/tracu_thue.php" data-page="tracuu" class="text-gray-600 hover:text-blue-600 flex items-center"><i
                            class="fas fa-search mr-2"></i> Tra cứu thuế</a>
                </nav>
                <div class="flex justify-between mb-4  gap-2 items-center">
                    <input type="text" id="searchInput" class="px-4 flex-1 py-2 border border-gray-300 rounded-lg"
                        placeholder="Tìm kiếm...">
                    <button id="openDrawer" class="px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Mở
                        Nhập Thuế</button>
                </div>

                <div class="grid grid-cols-1">
                    <!-- Table with Scroll -->
                    <div class="overflow-y-auto max-h-96">
                        <table class="min-w-full border-collapse bg-white rounded-lg shadow">
                            <thead class="bg-gray-50 sticky top-0">
                                <tr>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Mã Nhân viên</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Tên nhân viên</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Phòng Ban</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Hành động</th>
                                </tr>
                            </thead>
                            <tbody class="data"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Drawer -->
    <div id="drawer"
        class="drawer fixed top-0 right-0 h-full w-full sm:w-1/3 bg-white shadow-2xl p-6 overflow-y-auto z-50">
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-gray-800">Nhập thông tin thuế</h3>
            <button id="closeDrawer" class="text-gray-600 hover:text-gray-800">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                    </path>
                </svg>
            </button>
        </div>
        <form id="taxForm" action="#" method="get" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="ma_so_thue" class="block text-sm font-medium text-gray-700">Mã số thuế</label>
                    <input type="text" id="ma_so_thue" name="ma_so_thue" placeholder="Nhập mã số thuế"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div hidden>
                    <label for="ma_nhan_vien" class="block text-sm font-medium text-gray-700">Mã nhân viên</label>
                    <input type="text" id="ma_nhan_vien" name="ma_nhan_vien" placeholder="Nhập mã nhân viên"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="phu_cap" class="block text-sm font-medium text-gray-700">Phụ cấp</label>
                    <input type="number" id="phu_cap" name="phu_cap" placeholder="Nhập phụ cấp"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label for="thuong" class="block text-sm font-medium text-gray-700">Thưởng</label>
                    <input type="number" id="thuong" name="thuong" placeholder="Nhập thưởng"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="giam_tru_ban_than" class="block text-sm font-medium text-gray-700">Giảm trừ bản
                        thân</label>
                    <input type="number" id="giam_tru_ban_than" name="giam_tru_ban_than"
                        placeholder="Nhập giảm trừ bản thân"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label for="bao_hiem" class="block text-sm font-medium text-gray-700">Bảo hiểm</label>
                    <input type="number" id="bao_hiem" name="bao_hiem" placeholder="Nhập bảo hiểm"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
            </div>
            <div>
                <label for="ho_ten" class="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input type="text" id="ho_ten" name="ho_ten" placeholder="Nhập họ và tên"
                    class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="ngay_sinh" class="block text-sm font-medium text-gray-700">Ngày sinh</label>
                    <input type="date" id="ngay_sinh" name="ngay_sinh"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label for="so_cccd" class="block text-sm font-medium text-gray-700">Số CCCD</label>
                    <input type="text" id="so_cccd" name="so_cccd" placeholder="Nhập số CCCD"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
            </div>
            <div>
                <label for="dia_chi" class="block text-sm font-medium text-gray-700">Địa chỉ cư trú</label>
                <input type="text" id="dia_chi" name="dia_chi" placeholder="Nhập địa chỉ cư trú"
                    class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label for="nhom_nhan_vien" class="block text-sm font-medium text-gray-700">Nhóm nhân viên</label>
                    <select id="nhom_nhan_vien" name="nhom_nhan_vien"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="co_hop_dong">Cư trú có HĐLĐ > 3 tháng</option>
                        <option value="khong_hop_dong">Cư trú không HĐLĐ (khấu trừ 10%)</option>
                        <option value="khong_cu_tru">Không cư trú (khấu trừ 20%)</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Thuế phải nộp</label>
                    <span id="tinh_thue" class="mt-1 block text-sm text-gray-700"></span>
                </div>
            </div>
            <div>
                <label for="thu_nhap_chinh" class="block text-sm font-medium text-gray-700">Thu nhập chính</label>
                <input type="number" id="thu_nhap_chinh" name="thu_nhap_chinh" placeholder="Nhập thu nhập chính"
                    class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="flex justify-end space-x-4">
                <button type="button" id="saveEmployee"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">Lưu
                    thông tin</button>
                <button type="button" id="calculateTax"
                    class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500">Tính
                    thuế</button>
            </div>
        </form>
    </div>

    <script>
    const maSoThue = document.getElementById('ma_so_thue');
    const maNhanVien = document.getElementById('ma_nhan_vien');
    const phuCap = document.getElementById('phu_cap');
    const thuong = document.getElementById('thuong');
    const giamTruBanThan = document.getElementById('giam_tru_ban_than');
    const baoHiem = document.getElementById('bao_hiem');
    const hoTen = document.getElementById('ho_ten');
    const ngaySinh = document.getElementById('ngay_sinh');
    const soCCCD = document.getElementById('so_cccd');
    const diaChi = document.getElementById('dia_chi');
    const nhomNhanVien = document.getElementById('nhom_nhan_vien');
    const thuNhapChinh = document.getElementById('thu_nhap_chinh');
    const tinhThueSpan = document.getElementById('tinh_thue');
    const saveEmployeeBtn = document.getElementById('saveEmployee');
    const calculateTaxBtn = document.getElementById('calculateTax');
    const tbody = document.querySelector(".data");
    let ResultTable = [];
    document.addEventListener('DOMContentLoaded', function() {
        fetchData();
        const searchInput = document.getElementById('searchInput');
        const drawer = document.getElementById('drawer');
        const openDrawerBtn = document.getElementById('openDrawer');
        const closeDrawerBtn = document.getElementById('closeDrawer');


        openDrawerBtn.addEventListener('click', () => {
            drawer.classList.add('open');
            tinhThueSpan.textContent = ''; // Xóa kết quả thuế khi mở drawer
        });

        closeDrawerBtn.addEventListener('click', () => {
            drawer.classList.remove('open');
            resetForm();
            tinhThueSpan.textContent = ''; // Xóa kết quả thuế khi đóng drawer
        });

        // ==============================================
        searchInput.addEventListener("input", () => {
            const keyword = searchInput.value.trim().toLowerCase();
            const filteredData = ResultTable.filter((emp) => (
                emp.id.toLowerCase().includes(keyword) ||
                emp.name.toLowerCase().includes(keyword) ||
                emp.department.toLowerCase().includes(keyword)
            ))
            tbody.innerHTML = '';
            if (filteredData.length === 0) {
                tbody.innerHTML =
                    '<tr><td colspan="4" class="text-center py-4 text-gray-500">Không tìm thấy dữ liệu</td></tr>';
            } else {
                renderTable(filteredData);
            }
        })

        saveEmployeeBtn.addEventListener('click', saveEmployee);
        calculateTaxBtn.addEventListener('click', tinhThue);
    });

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
            thue = 5000000 * 0.05 + 5000000 * 0.1 + 8000000 * 0.15 + 14000000 * 0.2 + (thuNhapChiuThue - 32000000) *
                0.25;
        } else if (thuNhapChiuThue <= 80000000) {
            thue = 5000000 * 0.05 + 5000000 * 0.1 + 8000000 * 0.15 + 14000000 * 0.2 + 20000000 * 0.25 + (
                thuNhapChiuThue - 52000000) * 0.3;
        } else {
            thue = 5000000 * 0.05 + 5000000 * 0.1 + 8000000 * 0.15 + 14000000 * 0.2 + 20000000 * 0.25 + 28000000 * 0.3 +
                (thuNhapChiuThue - 80000000) * 0.35;
        }

        return thue;
    }

    function tinhThue() {
        // Chuyển đổi giá trị đầu vào sang số
        const thuNhapChinhVal = parseFloat(thuNhapChinh.value) || 0;
        const thuongVal = parseFloat(thuong.value) || 0;
        const phuCapVal = parseFloat(phuCap.value) || 0;
        const giamTruBanThanVal = parseFloat(giamTruBanThan.value) || 0;
        const baoHiemVal = parseFloat(baoHiem.value) || 0;
        const nhomNhanVienVal = nhomNhanVien.value;

        // Kiểm tra dữ liệu đầu vào
        if (thuNhapChinhVal < 0 || thuongVal < 0 || phuCapVal < 0 || giamTruBanThanVal < 0 || baoHiemVal < 0) {
            alert('Vui lòng nhập các giá trị số không âm.');
            return;
        }

        // Tính thu nhập chịu thuế
        const thuNhapChiuThue = thuNhapChinhVal + thuongVal + phuCapVal - giamTruBanThanVal - baoHiemVal;
        let thuePhaiNop = 0;

 
        if (nhomNhanVienVal === "co_hop_dong") {
            thuePhaiNop = tinhThueLuyTien(thuNhapChiuThue);
        } else if (nhomNhanVienVal === "khong_hop_dong") {
            thuePhaiNop = thuNhapChiuThue * 0.1;
        } else if (nhomNhanVienVal === "khong_cu_tru") {
            thuePhaiNop = thuNhapChiuThue * 0.2;
        }
        tinhThueSpan.textContent = `Thuế phải nộp: ${thuePhaiNop.toLocaleString('vi-VN')} VNĐ`;
    }
    async function saveEmployee() {
        const employeeData = {
            MaThue: maSoThue.value,
            MaNV: maNhanVien.value,
            PhuCap: parseFloat(phuCap.value) || 0,
            Thuong: parseFloat(thuong.value) || 0,
            GiamTru: parseFloat(giamTruBanThan.value) || 0,
            BaoHiem: parseFloat(baoHiem.value) || 0,
            TenNV: hoTen.value,
            NgaySinh: ngaySinh.value,
            CCCD: soCCCD.value,
            DiaChi: diaChi.value,
            NhomNhanVien: nhomNhanVien.value,
            ThuNhapChinh: parseFloat(thuNhapChinh.value) || 0
        };
        const method = employeeData.MaNV ? "PUT" : "POST";
        if (!employeeData.TenNV) {
            alert('Vui lòng nhập họ tên nhân viên.');
            return;
        }

        try {
            const response = await fetch("post_employee_info.php", {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(employeeData)
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message || 'Lưu thông tin thành công!');
                resetForm();
                tinhThueSpan.textContent = '';
                document.getElementById('drawer').classList.remove('open');
                fetchData();
            } else {
                console.error('Lỗi lưu nhân viên:', response.status);
                alert('Không thể lưu thông tin. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    }

    const fetchNhanVien = async (maNV) => {
        try {
            const response = await fetch("get_employee_info.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    maNV: maNV
                })
            });
            if (response.ok) {
                const data = await response.json();
                renderDataForm(data.data);
                document.getElementById('drawer').classList.add('open');
                tinhThueSpan.textContent = '';
            } else {
                console.error('Lỗi fetch nhân viên:', response.status);
                alert('Không thể lấy thông tin nhân viên. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    };

    function renderDataForm(data) {
        resetForm();
        maSoThue.value = data.MaThue || '';
        maNhanVien.value = data.MaNV || '';
        phuCap.value = data.PhuCap || '';
        thuong.value = data.Thuong || '';
        giamTruBanThan.value = data.GiamTru || '';
        baoHiem.value = data.BaoHiem || '';
        hoTen.value = data.TenNV || '';
        ngaySinh.value = data.NgaySinh || '';
        soCCCD.value = data.CCCD || '';
        diaChi.value = data.DiaChi || '';
        nhomNhanVien.value = data.NhomNhanVien || '';
        thuNhapChinh.value = data.ThuNhapChinh || '';
    }

    function resetForm() {
        const form = document.querySelector('form');
        form.reset();
    }

    function renderTable(data) {
        tbody.innerHTML = '';
        data.forEach(emp => {
            const tr = document.createElement('tr');
            tr.classList.add('hover:bg-gray-50');
            tr.innerHTML = `
            <td class="px-6 py-4 text-sm text-gray-700">${emp.id}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${emp.name}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${emp.department}</td>
            <td class="px-6 py-4 text-sm">
                <button class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700" value="${emp.id}" onclick="fetchNhanVien('${emp.id}')">
                    Xem
                </button>
            </td>
        `;
            tbody.appendChild(tr);
        });
    }
    const fetchData = async () => {
        try {
            const response = await fetch("get_employees.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (response.ok) {
                const data = await response.json();
                ResultTable = data;
                tbody.innerHTML = '';
                if (data.length === 0) {
                    tbody.innerHTML =
                        '<tr><td colspan="4" class="text-center py-4 text-gray-500">Không có dữ liệu</td></tr>';
                } else {
                    renderTable(ResultTable);
                }
            } else {
                console.error('Fetch lỗi:', response.status);
            }
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };
    </script>
</body>

</html>