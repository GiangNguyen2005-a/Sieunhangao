<?php 
// PHP code remains unchanged
?>
<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hệ thống tạo tờ khai thuế TNCN</title>
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
        <?php include_once('..\Chung\sidebar.php') ?>
        <div class="main-content p-6 flex-1">
            <h2 class="text-3xl font-bold text-gray-800 mb-8">Tạo tờ khai thuế TNCN</h2>
            <div class="bg-white rounded-xl shadow-lg p-8">
                <!-- Navigation -->
                <nav class="flex space-x-6 mb-8 border-b pb-4">
                <a href="../QLThue/input_thue.php" class="text-gray-600 hover:text-blue-600 flex items-center"><i
                            class="fas fa-file-alt mr-2"></i> Nhập thông tin thuế</a>
                    <a href="../QLThue/create_tokhai.php" data-page="declare" class="text-blue-600 hover:text-blue-600 flex items-center"><i
                            class="fas fa-calculator mr-2"></i> Tạo tờ khai</a>
                    <a href="../QLThue/veri_nopthue.php" data-page="xacnhan" class="text-gray-600 font-semibold flex items-center"><i
                            class="fas fa-check-circle mr-2"></i> Xác nhận đã nộp</a>
                    <a href="../QLThue/tracu_thue.php" data-page="tracuu" class="text-gray-600 hover:text-blue-600 flex items-center"><i
                            class="fas fa-search mr-2"></i> Tra cứu thuế</a>
                </nav>
                <div class="flex justify-between mb-4 gap-2 items-center">
                    <input type="text" id="searchInput" class="px-4 flex-1 py-2 border border-gray-300 rounded-lg"
                        placeholder="Tìm kiếm theo mã nhân viên hoặc tên...">
                    <button hidden id="openDrawer" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Tạo tờ
                        khai</button>
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
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Thuế phải nộp</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Hành động</th>
                                </tr>
                            </thead>
                            <tbody class="data"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Drawer -->
        <div id="drawer"
            class="drawer fixed top-0 right-0 h-full w-full sm:w-1/3 bg-white shadow-2xl p-6 overflow-y-auto z-50">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-gray-800">Tạo tờ khai thuế</h3>
                <button id="closeDrawer" class="text-gray-600 hover:text-gray-800">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>
            <form id="taxDeclarationForm" action="#" method="get" class="space-y-4">
                <div>
                    <label for="ma_so_thue" class="block text-sm font-medium text-gray-700">Mã số thuế</label>
                    <input type="text" id="ma_so_thue" name="ma_so_thue" placeholder="Nhập mã số thuế"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readonly>
                    <input hidden type="text" id="ma_nhan_vien" name="ma_nhan_vien" placeholder="Nhập mã số thuế"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readonly>
                </div>
                <div>
                    <label for="ho_ten" class="block text-sm font-medium text-gray-700">Họ và tên</label>
                    <input type="text" id="ho_ten" name="ho_ten" placeholder="Nhập họ và tên"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readonly>
                </div>
                <div>
                    <label for="thu_nhap_chiu_thue" class="block text-sm font-medium text-gray-700">Thu nhập chịu
                        thuế</label>
                    <input type="number" id="thu_nhap_chiu_thue" name="thu_nhap_chiu_thue"
                        placeholder="Nhập thu nhập chịu thuế"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readonly>
                </div>
                <div>
                    <label for="thue_phai_nop" class="block text-sm font-medium text-gray-700">Thuế phải nộp</label>
                    <input type="number" id="thue_phai_nop" name="thue_phai_nop" placeholder="Thuế phải nộp"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readonly>
                </div>
                <div>
                    <label for="ky_thue" class="block text-sm font-medium text-gray-700">Kỳ thuế</label>
                    <input type="month" id="ky_thue" name="ky_thue"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div>
                    <label for="ngay_lap_to_khai" class="block text-sm font-medium text-gray-700">Ngày lập tờ
                        khai</label>
                    <input type="date" id="ngay_lap_to_khai" name="ngay_lap_to_khai"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div class="flex justify-end space-x-4">
                    <button type="button" id="generateDeclaration"
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">Tạo
                        tờ khai</button>
                </div>
            </form>
        </div>
    </div>

    <script>
    const maSoThue = document.getElementById('ma_so_thue');
    const hoTen = document.getElementById('ho_ten');
    const thuNhapChiuThue = document.getElementById('thu_nhap_chiu_thue');
    const thuePhaiNop = document.getElementById('thue_phai_nop');
    const kyThue = document.getElementById('ky_thue');
    const ngayLapToKhai = document.getElementById('ngay_lap_to_khai');
    const generateDeclarationBtn = document.getElementById('generateDeclaration');
    const MaNV = document.getElementById('ma_nhan_vien')
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
            resetForm();
        });

        closeDrawerBtn.addEventListener('click', () => {
            drawer.classList.remove('open');
            resetForm();
        });

        searchInput.addEventListener("input", () => {
            const keyword = searchInput.value.trim().toLowerCase();
            const filteredData = ResultTable.filter((emp) => (
                emp.id.toLowerCase().includes(keyword) ||
                emp.name.toLowerCase().includes(keyword) ||
                emp.department.toLowerCase().includes(keyword)
            ));
            tbody.innerHTML = '';
            if (filteredData.length === 0) {
                tbody.innerHTML =
                    '<tr><td colspan="5" class="text-center py-4 text-gray-500">Không tìm thấy dữ liệu</td></tr>';
            } else {
                renderTable(filteredData);
            }
        });

        generateDeclarationBtn.addEventListener('click', generateDeclaration);
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

    async function generateDeclaration() {
        const declarationData = {
            MaNV: MaNV.value,
            ThuNhapChiuThue: parseFloat(thuNhapChiuThue.value) || 0,
            ThuePhaiNop: parseFloat(thuePhaiNop.value) || 0,
            KyThue: kyThue.value,
            NgayLapToKhai: ngayLapToKhai.value
        };

        if (!declarationData.KyThue || !declarationData
            .NgayLapToKhai) {
            alert('Vui lòng nhập đầy đủ thông tin: Mã số thuế, Họ và tên, Kỳ thuế, Ngày lập tờ khai.');
            return;
        }

        try {
            const response = await fetch("save_tax_declaration.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(declarationData)
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message || 'Tạo tờ khai thành công!');
                resetForm();
                document.getElementById('drawer').classList.remove('open');
                fetchData();
            } else {
                console.error('Lỗi tạo tờ khai:', response.status);
                alert('Không thể tạo tờ khai. Vui lòng thử lại.');
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
        MaNV.value = data.MaNV
        maSoThue.value = data.MaThue || '';
        hoTen.value = data.TenNV || '';
        const thuNhapChinhVal = parseFloat(data.ThuNhapChinh) || 0;
        const thuongVal = parseFloat(data.Thuong) || 0;
        const phuCapVal = parseFloat(data.PhuCap) || 0;
        const giamTruBanThanVal = parseFloat(data.GiamTru) || 0;
        const baoHiemVal = parseFloat(data.BaoHiem) || 0;
        const nhomNhanVienVal = data.NhomNhanVien || '';

        const thuNhapChiuThueVal = thuNhapChinhVal + thuongVal + phuCapVal - giamTruBanThanVal - baoHiemVal;
        thuNhapChiuThue.value = thuNhapChiuThueVal;

        let thuePhaiNopVal = 0;
        if (nhomNhanVienVal === "co_hop_dong") {
            thuePhaiNopVal = tinhThueLuyTien(thuNhapChiuThueVal);
        } else if (nhomNhanVienVal === "khong_hop_dong") {
            thuePhaiNopVal = thuNhapChiuThueVal * 0.1;
        } else if (nhomNhanVienVal === "khong_cu_tru") {
            thuePhaiNopVal = thuNhapChiuThueVal * 0.2;
        }
        thuePhaiNop.value = thuePhaiNopVal;
    }

    function resetForm() {
        const form = document.querySelector('form');
        form.reset();
    }

    function renderTable(data) {
        tbody.innerHTML = '';
        data.forEach(emp => {
            const thuNhapChiuThueVal = (parseFloat(emp.ThuNhapChinh) || 0) +
                (parseFloat(emp.Thuong) || 0) +
                (parseFloat(emp.PhuCap) || 0) -
                (parseFloat(emp.GiamTru) || 0) -
                (parseFloat(emp.BaoHiem) || 0);
            let thuePhaiNopVal = 0;
            if (emp.NhomNhanVien === "co_hop_dong") {
                thuePhaiNopVal = tinhThueLuyTien(thuNhapChiuThueVal);
            } else if (emp.NhomNhanVien === "khong_hop_dong") {
                thuePhaiNopVal = thuNhapChiuThueVal * 0.1;
            } else if (emp.NhomNhanVien === "khong_cu_tru") {
                thuePhaiNopVal = thuNhapChiuThueVal * 0.2;
            }

            const tr = document.createElement('tr');
            tr.classList.add('hover:bg-gray-50');
            tr.innerHTML = `
                <td class="px-6 py-4 text-sm text-gray-700">${emp.id}</td>
                <td class="px-6 py-4 text-sm text-gray-700">${emp.name}</td>
                <td class="px-6 py-4 text-sm text-gray-700">${emp.department}</td>
                <td class="px-6 py-4 text-sm text-gray-700">${thuePhaiNopVal.toLocaleString('vi-VN')} VNĐ</td>
                <td class="px-6 py-4 text-sm">
                    <button class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onclick="fetchNhanVien('${emp.id}')">
                        Tạo tờ khai
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
                        '<tr><td colspan="5" class="text-center py-4 text-gray-500">Không có dữ liệu</td></tr>';
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