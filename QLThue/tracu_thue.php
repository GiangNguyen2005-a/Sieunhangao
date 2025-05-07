<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hệ thống tra cứu thuế TNCN</title>
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
            <h2 class="text-3xl font-bold text-gray-800 mb-8">Tra cứu thuế TNCN</h2>
            <div class="bg-white rounded-xl shadow-lg p-8">
                <!-- Navigation -->
                <nav class="flex space-x-6 mb-8 border-b pb-4">
                    <a href="../QLThue/input_thue.php" class="text-gray-600 hover:text-blue-600 flex items-center"><i
                            class="fas fa-file-alt mr-2"></i> Nhập thông tin thuế</a>
                    <a href="../QLThue/create_tokhai.php" data-page="declare" class="text-gray-600 hover:text-blue-600 flex items-center"><i
                            class="fas fa-calculator mr-2"></i> Tạo tờ khai</a>
                    <a href="../QLThue/veri_nopthue.php" data-page="xacnhan" class="text-gray-600 hover:text-blue-600 flex items-center"><i
                            class="fas fa-check-circle mr-2"></i> Xác nhận đã nộp</a>
                    <a href="../QLThue/tracu_thue.php" data-page="tracuu" class="text-blue-600 font-semibold flex items-center"><i
                            class="fas fa-search mr-2"></i> Tra cứu thuế</a>
                </nav>
                <div class="flex justify-between mb-4 gap-2 items-center">
                    <input type="text" id="searchInput" class="px-4 flex-1 py-2 border border-gray-300 rounded-lg"
                        placeholder="Nhập mã nhân viên, CCCD hoặc tên nhân viên...">
                </div>

                <div class="grid grid-cols-1">
                    <!-- Table with Scroll -->
                    <div class="overflow-y-auto max-h-96">
                        <table class="min-w-full border-collapse bg-white rounded-lg shadow">
                            <thead class="bg-gray-50 sticky top-0">
                                <tr>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Tên nhân viên</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Mã nhân viên</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">CCCD</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Tổng thu nhập</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Tổng thuế phải nộp</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Tổng thuế đã nộp</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Số tờ khai</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Thu nhập chính</th>
                                    <th class="px-6 py-3 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody class="data"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    const searchInput = document.getElementById('searchInput');
    const tbody = document.querySelector(".data");

    document.addEventListener('DOMContentLoaded', function() {
        searchInput.addEventListener("input", () => {
            const keyword = searchInput.value.trim();
            if (keyword) {
                fetchData(keyword);
            } else {
                tbody.innerHTML =
                    '<tr><td colspan="9" class="text-center py-4 text-gray-500">Vui lòng nhập thông tin để tra cứu</td></tr>';
            }
        });
    });

    async function fetchData(keyword) {
        try {
            const response = await fetch("search_tax_info.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    searchInput: keyword
                })
            });

            if (response.ok) {
                const result = await response.json();
                tbody.innerHTML = '';
                if (result.success && result.data) {
                    renderTable([result.data]);
                } else {
                    tbody.innerHTML =
                        '<tr><td colspan="9" class="text-center py-4 text-gray-500">Không tìm thấy dữ liệu</td></tr>';
                }
            } else {
                console.error('Fetch lỗi:', response.status);
                tbody.innerHTML =
                    '<tr><td colspan="9" class="text-center py-4 text-gray-500">Lỗi khi tra cứu dữ liệu</td></tr>';
            }
        } catch (error) {
            console.error('Lỗi:', error);
            tbody.innerHTML =
                '<tr><td colspan="9" class="text-center py-4 text-gray-500">Đã xảy ra lỗi. Vui lòng thử lại.</td></tr>';
        }
    }

    function renderTable(data) {
        tbody.innerHTML = '';
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.classList.add('hover:bg-gray-50');
            const status = item.TrangThai || 'Chưa có trạng thái';
            const statusClass = item.TrangThai === 'Đã nộp' ? 'text-green-600' : 'text-red-600';

            // Dữ liệu từ XacNhanToKhai, ToKhaiThue và ThongTinThue
            const xacNhan = item.XacNhanToKhai || {};
            const toKhai = item.ToKhaiThue || {};
            const thongTinThue = item.ThongTinThue || {};
            const tongSoBanGhiXacNhan = xacNhan.TongSoBanGhi || 0;
            const soLuongDaNop = xacNhan.SoLuongDaNop || 0;
            const soLuongChuaNop = xacNhan.SoLuongChuaNop || 0;
            const tongTienDaNop = parseFloat(xacNhan.TongTienDaNop || 0);
            const tongThuNhap = parseFloat(toKhai.TongThuNhap || 0);
            const tongThuePhaiNop = parseFloat(toKhai.TongThuePhaiNop || 0);
            const tongThuNhapChinh = parseFloat(thongTinThue.TongThuNhapChinh || 0);

            tr.innerHTML = `
                <td class="px-6 py-4 text-sm text-gray-700">${item.TenNV}</td>
                <td class="px-6 py-4 text-sm text-gray-700">${item.MaNV}</td>
                <td class="px-6 py-4 text-sm text-gray-700">${item.CCCD}</td>
                <td class="px-6 py-4 text-sm text-gray-700">${tongThuNhap.toLocaleString('vi-VN')} VNĐ</td>
                <td class="px-6 py-4 text-sm text-gray-700">${tongThuePhaiNop.toLocaleString('vi-VN')} VNĐ</td>
                <td class="px-6 py-4 text-sm text-gray-700">${tongTienDaNop.toLocaleString('vi-VN')} VNĐ</td>
                <td class="px-6 py-4 text-sm text-gray-700">
                    Tổng: ${tongSoBanGhiXacNhan} <br>
                    Đã nộp: ${soLuongDaNop} <br>
                    Chưa nộp: ${soLuongChuaNop}
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">${tongThuNhapChinh.toLocaleString('vi-VN')} VNĐ</td>
                <td class="px-6 py-4 text-sm ${statusClass}">${status}</td>
            `;
            tbody.appendChild(tr);
        });
    }
    </script>
</body>

</html>