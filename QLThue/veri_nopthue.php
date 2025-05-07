<?php 
// PHP code remains unchanged
?>
<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hệ thống xác nhận nộp thuế TNCN</title>
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
        <?php include_once('../Chung/sidebar.php') ?>
        <div class="main-content p-6 flex-1">
            <h2 class="text-3xl font-bold text-gray-800 mb-8">Xác nhận nộp thuế TNCN</h2>
            <div class="bg-white rounded-xl shadow-lg p-8">
                <!-- Navigation -->
                <nav class="flex space-x-6 mb-8 border-b pb-4">
                <a href="../QLThue/input_thue.php" class="text-gray-600 hover:text-blue-600 flex items-center"><i
                            class="fas fa-file-alt mr-2"></i> Nhập thông tin thuế</a>
                    <a href="../QLThue/create_tokhai.php" data-page="declare" class="text-gray-600 hover:text-blue-600 flex items-center"><i
                            class="fas fa-calculator mr-2"></i> Tạo tờ khai</a>
                    <a href="../QLThue/veri_nopthue.php" data-page="xacnhan" class="text-blue-600 font-semibold flex items-center"><i
                            class="fas fa-check-circle mr-2"></i> Xác nhận đã nộp</a>
                    <a href="../QLThue/tracu_thue.php" data-page="tracuu" class="text-gray-600 hover:text-blue-600 flex items-center"><i
                            class="fas fa-search mr-2"></i> Tra cứu thuế</a>
                </nav>
                <div class="flex justify-between mb-4 gap-2 items-center">
                    <input type="text" id="searchInput" class="px-4 flex-1 py-2 border border-gray-300 rounded-lg"
                        placeholder="Tìm kiếm theo mã tờ khai, mã nhân viên hoặc tên...">
                    <button hidden id="openDrawer" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Xác nhận nộp</button>
                </div>

                <div class="grid grid-cols-1">
                    <!-- Table with Scroll -->
                    <div class="overflow-y-auto max-h-96">
                        <table class="min-w-full border-collapse bg-white rounded-lg shadow">
                            <thead class="bg-gray-50 sticky top-0">
                                <tr>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Mã Tờ khai</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Mã Nhân viên</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Tên nhân viên</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Thuế phải nộp</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Kỳ thuế</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Trạng thái</th>
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
                <h3 class="text-xl font-bold text-gray-800">Xác nhận nộp thuế</h3>
                <button id="closeDrawer" class="text-gray-600 hover:text-gray-800">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>
            <form id="taxConfirmationForm" action="#" method="get" class="space-y-4">
                <div>
                    <label for="ma_to_khai" class="block text-sm font-medium text-gray-700">Mã tờ khai</label>
                    <input type="text" id="ma_to_khai" name="ma_to_khai" placeholder="Mã tờ khai"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readonly>
                </div>
                <div>
                    <label for="ma_nhan_vien" class="block text-sm font-medium text-gray-700">Mã nhân viên</label>
                    <input type="text" id="ma_nhan_vien" name="ma_nhan_vien" placeholder="Mã nhân viên"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readonly>
                </div>
                <div>
                    <label for="ho_ten" class="block text-sm font-medium text-gray-700">Họ và tên</label>
                    <input type="text" id="ho_ten" name="ho_ten" placeholder="Họ và tên"
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
                    <input type="text" id="ky_thue" name="ky_thue" placeholder="Kỳ thuế"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readonly>
                </div>
                <div>
                    <label for="ngay_xac_nhan" class="block text-sm font-medium text-gray-700">Ngày xác nhận nộp</label>
                    <input type="date" id="ngay_xac_nhan" name="ngay_xac_nhan"
                        class="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                </div>
                <div class="flex justify-end space-x-4">
                    <button type="button" id="confirmSubmission"
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">Xác
                        nhận nộp</button>
                </div>
            </form>
        </div>
    </div>

    <script>
    const maToKhai = document.getElementById('ma_to_khai');
    const maNhanVien = document.getElementById('ma_nhan_vien');
    const hoTen = document.getElementById('ho_ten');
    const thuePhaiNop = document.getElementById('thue_phai_nop');
    const kyThue = document.getElementById('ky_thue');
    const ngayXacNhan = document.getElementById('ngay_xac_nhan');
    const confirmSubmissionBtn = document.getElementById('confirmSubmission');
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
            const filteredData = ResultTable.filter((tax) => (
                tax.MaTK.toLowerCase().includes(keyword) ||
                tax.MaNV.toLowerCase().includes(keyword) ||
                tax.TenNV.toLowerCase().includes(keyword)
            ));
            tbody.innerHTML = '';
            if (filteredData.length === 0) {
                tbody.innerHTML =
                    '<tr><td colspan="7" class="text-center py-4 text-gray-500">Không tìm thấy dữ liệu</td></tr>';
            } else {
                renderTable(filteredData);
            }
        });

        confirmSubmissionBtn.addEventListener('click', confirmSubmission);
    });

    async function confirmSubmission() {
        const confirmationData = {
            MaTK: maToKhai.value,
            MaNV: maNhanVien.value,
            SoTienNop:thuePhaiNop.value,
            NgayXacNhan: ngayXacNhan.value
        };

        if (!confirmationData.MaTK || !confirmationData.MaNV || !confirmationData.NgayXacNhan) {
            alert('Vui lòng nhập đầy đủ thông tin: Mã tờ khai, Mã nhân viên, Ngày xác nhận.');
            return;
        }

        try {
            const response = await fetch("confirm_tax_submission.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(confirmationData)
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message || 'Xác nhận nộp thuế thành công!');
                resetForm();
                document.getElementById('drawer').classList.remove('open');
                fetchData();
            } else {
                console.error('Lỗi xác nhận nộp thuế:', response.status);
                alert('Không thể xác nhận nộp thuế. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    }

    const fetchToKhai = async (maTK) => {
        try {
            const response = await fetch("get_tax_declaration.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    maTK: maTK
                })
            });
            if (response.ok) {
                const data = await response.json();
                renderDataForm(data);
                document.getElementById('drawer').classList.add('open');
            } else {
                console.error('Lỗi fetch tờ khai:', response.status);
                alert('Không thể lấy thông tin tờ khai. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            alert('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    };

    function renderDataForm(data) {
        resetForm();
        console.log(data)
        maToKhai.value = data.MaTK || '';
        maNhanVien.value = data.MaNV || '';
        hoTen.value = data.name || '';
        thuePhaiNop.value = data.TongThuePhaiNop || 0;
        kyThue.value = data.KyKeKhai || '';
    }

    function resetForm() {
        const form = document.querySelector('form');
        form.reset();
    }

    function renderTable(data) {
        tbody.innerHTML = '';
        data.forEach(tax => {
            const tr = document.createElement('tr');
            tr.classList.add('hover:bg-gray-50');
            const status = tax.TrangThai === '1' ? 'Đã nộp' : 'Chưa nộp';
            const statusClass = tax.TrangThai === '1' ? 'text-green-600' : 'text-red-600';
            tr.innerHTML = `
                <td class="px-6 py-4 text-sm text-gray-700">${tax.MaTK}</td>
                <td class="px-6 py-4 text-sm text-gray-700">${tax.MaNV}</td>
                <td class="px-6 py-4 text-sm text-gray-700">${tax.name}</td>
                <td class="px-6 py-4 text-sm text-gray-700">${parseFloat(tax.TongThuePhaiNop).toLocaleString('vi-VN')} VNĐ</td>
                <td class="px-6 py-4 text-sm text-gray-700">${tax.KyKeKhai}</td>
                <td class="px-6 py-4 text-sm ${statusClass}">${status}</td>
                <td class="px-6 py-4 text-sm">
                    ${tax.TrangThai === '1' ? '' : `
                    <button class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onclick="fetchToKhai('${tax.MaTK}')">
                        Xác nhận
                    </button>`}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    const fetchData = async () => {
        try {
            const response = await fetch("get_tax_declarations.php", {
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
                        '<tr><td colspan="7" class="text-center py-4 text-gray-500">Không có dữ liệu</td></tr>';
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