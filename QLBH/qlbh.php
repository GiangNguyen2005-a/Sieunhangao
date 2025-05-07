<!DOCTYPE html>
<?php
// Kết nối CSDL
include '../Chung/config.php';

// Kiểm tra kết nối
if (!$conn) {
    die("Kết nối thất bại: " . mysqli_connect_error());
}
// Đếm số lượng hồ sơ "Đang xử lý"
$sql_dang_xu_ly = "SELECT COUNT(*) as count FROM kbbh WHERE trangthai = 'Đang xử lý'";
$result_dang_xu_ly = mysqli_query($conn, $sql_dang_xu_ly);
$row_dang_xu_ly = mysqli_fetch_assoc($result_dang_xu_ly);
$dang_xu_ly = $row_dang_xu_ly['count'];

// Đếm số lượng hồ sơ "Đã gửi"
$sql_da_gui = "SELECT COUNT(*) as count FROM kbbh WHERE trangthai = 'Đã gửi'";
$result_da_gui = mysqli_query($conn, $sql_da_gui);
$row_da_gui = mysqli_fetch_assoc($result_da_gui);
$da_gui = $row_da_gui['count'];
// Lấy dữ liệu số lượng hồ sơ theo tháng
$sql_theo_thang = "SELECT MONTH(ngaygui) as thang, COUNT(*) as so_luong 
                   FROM kbbh 
                   GROUP BY MONTH(ngaygui)";
$result_theo_thang = mysqli_query($conn, $sql_theo_thang);
$data_theo_thang = [];
while ($row = mysqli_fetch_assoc($result_theo_thang)) {
    $data_theo_thang[$row['thang']] = $row['so_luong'];
}

// Chuẩn bị mảng dữ liệu cho 12 tháng
$months = range(1, 12);
$so_luong_theo_thang = array_fill(1, 12, 0);
foreach ($data_theo_thang as $thang => $so_luong) {
    $so_luong_theo_thang[$thang] = $so_luong;
}
?>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản lý Bảo hiểm Xã hội</title>
    <link rel="stylesheet" href="qlbh.css">
    <?php include '../Chung/relink.php'; ?>
</head>
<body>
    <div class="d-flex">
        <?php include '../Chung/sidebar.php'; ?>
        <div class="main-content p-4">
            <h2 class="mb-4">Quản lý Bảo hiểm Xã hội</h2>
            
            <div class="top-nav">
                <div class="nav-section">
                    <nav class="main-nav">
                        <a class="nav-link active" data-target="query">Tra cứu BHXH</a>
                        <a class="nav-link" data-target="update">Cập nhật</a>
                        <a class="nav-link" data-target="register">Khai báo bảo hiểm</a>
                    </nav>
                </div>
            </div>

            <div class="tab-content">
                <!-- Tab Tra cứu BHXH -->
                <div class="tab-pane fade show active" id="query">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="mb-4">Tra cứu BHXH</h4>

                            <!-- Form tra cứu hiện tại -->
                            <form id="queryForm" class="mb-4">
                                <div class="mb-3">
                                    <label class="form-label">Mã số BHXH</label>
                                    <input type="text" class="form-control" id="insuranceId" placeholder="Nhập mã số BHXH" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Tra cứu</button>
                            </form>
                            <div id="queryResult" class="mt-4"></div>

                            <!-- Dashboard -->
                            <h5 class="mt-5">Tổng quan trạng thái hồ sơ (Bảng kbbh)</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <canvas id="pieChart"></canvas>
                                </div>
                                <div class="col-md-6">
                                    <canvas id="barChart"></canvas>
                                </div>
                            </div>

                            <!-- Bảng thông tin từ ttbh -->
                            <div class="table-responsive mt-4">
                                <h5>Thông tin BHXH (Bảng ttbh)</h5>
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Mã nhân viên</th>
                                            <th>Mã BHXH</th>
                                            <th>Ngày bắt đầu</th>
                                            <th>Ngày kết thúc</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php
                                        $sql_ttbh = "SELECT * FROM ttbh";
                                        $result_ttbh = mysqli_query($conn, $sql_ttbh);
                                        if (mysqli_num_rows($result_ttbh) > 0) {
                                            while ($row = mysqli_fetch_assoc($result_ttbh)) {
                                                echo "<tr>";
                                                echo "<td>" . $row['manv'] . "</td>";
                                                echo "<td>" . $row['mabh'] . "</td>";
                                                echo "<td>" . $row['nbd'] . "</td>";
                                                echo "<td>" . $row['nkt'] . "</td>";
                                                echo "</tr>";
                                            }
                                        } else {
                                            echo "<tr><td colspan='4' class='text-center'>Không có dữ liệu</td></tr>";
                                        }
                                        ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab Cập nhật -->
                <div class="tab-pane fade" id="update">
                    <div class="card">
                        <div class="card-body">
                            <div class="sub-nav">
                                <button class="sub-nav-item active" data-subtab="nhansu">
                                    <i class="fas fa-users"></i> Nhân sự
                                </button>
                            </div>
                    
                            <!-- Nhân sự -->
                            <div class="sub-tab-content active-sub-tab" id="nhansu">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h5 class="mb-0">Danh sách nhân viên</h5>
                                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addEmployeeModal">
                                        <i class="fas fa-plus"></i> Thêm mới lao động
                                    </button>
                                </div>
                                
                                <!-- Thay thế bảng danh sách nhân viên với code truy vấn SQL -->
                                <div class="table-responsive mt-3">
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Mã nhân viên</th>
                                                <th>Họ tên</th>
                                                <th>Mã số BHXH</th>
                                                <th>Giới tính</th>
                                                <th>Chức vụ</th>
                                                <th>Phòng ban</th>
                                                <th>Trạng thái</th>
                                                <th>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                            // Truy vấn SQL để lấy thông tin nhân viên kết hợp với thông tin BHXH và các bảng liên quan
                                            $sql = "SELECT nv.manv, nv.tennv, nv.gioitinh, tt.mabh, vt.tenvt, pb.tenpb, ql.trangthai
                                                    FROM nhanvien nv
                                                    left JOIN ttbh tt ON nv.manv = tt.manv
                                                    right JOIN qlbh ql ON ql.manv = nv.manv
                                                    left join vitri vt on vt.mavt = nv.mavt
                                                    left join phongban pb on pb.mapb = nv.mapb";
                                            $result = mysqli_query($conn, $sql);
                                            
                                            if (mysqli_num_rows($result) > 0) {
                                                // Hiển thị dữ liệu mỗi hàng
                                                while($row1 = mysqli_fetch_assoc($result)) {
                                                    // Xác định trạng thái (có thể thay đổi logic này tùy theo yêu cầu)
                                                    
                                                    echo "<tr>";
                                                    echo "<td>" . $row1["manv"] . "</td>";
                                                    echo "<td>" . $row1["tennv"] . "</td>";
                                                    echo "<td>" . $row1["mabh"] . "</td>";
                                                    echo "<td>" . $row1["gioitinh"] . "</td>";
                                                    echo "<td>" . $row1["tenvt"] . "</td>";
                                                    echo "<td>" . $row1["tenpb"] . "</td>";
                                                    echo "<td>" . $row1["trangthai"] . "</td>";
                                                    echo "<td>
                                                        <button class='btn btn-sm btn-warning me-1' data-manv='" . $row1["manv"] . "' data-bs-toggle='modal' data-bs-target='#editEmployeeModal'>Sửa</button>
                                                        <button class='btn btn-sm btn-danger' data-manv='" . $row1["manv"] . "'>Xóa</button>
                                                    </td>";
                                                    echo "</tr>";
                                                }
                                            } else {
                                                echo "<tr><td colspan='8' class='text-center'>Không có dữ liệu</td></tr>";
                                            }
                                            ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tab Khai báo tăng lao động -->
                <div class="tab-pane fade" id="register">
                    <div class="card">
                        <div class="card-body">
                            <div class="sub-nav">
                                <button class="sub-nav-item active" data-subtab="nhapThongTin">
                                    <i class="fas fa-user-plus"></i> Nhập thông tin
                                </button>
                                <button class="sub-nav-item" data-subtab="gui">
                                    <i class="fas fa-paper-plane"></i> Hồ sơ lưu trữ
                                </button>
                                <button class="sub-nav-item" data-subtab="kiemTra">
                                    <i class="fas fa-tasks"></i> Kiểm tra tiến độ
                                </button>
                            </div>
                            
                            <!-- Nhập thông tin -->
                            <div class="sub-tab-content active-sub-tab" id="nhapThongTin">
                                <!-- In qlbh.php, find the div with id="nhapThongTin" and replace the form inside it with: -->
                                <form id="registerForm">
                                    <div class="card mb-3">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0">Thông tin cá nhân</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">Mã nhân viên</label>
                                                    <input type="text" class="form-control" id="manv" placeholder="Nhập mã nhân viên" required>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">Họ và tên</label>
                                                    <input type="text" class="form-control" id="tennv" placeholder="Nhập họ và tên" required>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">CCCD/CMND</label>
                                                    <input type="text" class="form-control" id="cccd" placeholder="Nhập số CCCD/CMND" required>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">Ngày sinh</label>
                                                    <input type="date" class="form-control" id="ngaysinh" required>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">Giới tính</label>
                                                    <input type="text" class="form-control" id="gioitinh" placeholder="Nhập địa chỉ">
                                                    </select>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">Số điện thoại</label>
                                                    <input type="tel" class="form-control" id="sdt" placeholder="Nhập số điện thoại">
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">Địa chỉ</label>
                                                    <input type="text" class="form-control" id="diachi" placeholder="Nhập địa chỉ">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="card mb-3">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0">Thông tin việc làm</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">Chức vụ</label>
                                                    <input type="text" class="form-control" id="chucvu" placeholder="Nhập chức vụ" required>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">Phòng ban</label>
                                                    <input type="text" class="form-control" id="phongban" placeholder="Nhập phòng ban" required>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="card mb-3">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0">Thông tin BHXH</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">Đã tham gia BHXH</label>
                                                    <select class="form-select" id="daCoMaBHXH" required>
                                                        <option value="">Chọn</option>
                                                        <option value="Có">Có</option>
                                                        <option value="Chưa">Chưa</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-6 mb-3" id = "kbbhField">
                                                    <label class="form-label">Mã số BHXH</label>
                                                    <input type="text" class="form-control" id="mabh" placeholder="Nhập mã số BHXH">
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">Phương án khai báo</label>
                                                    <select class="form-select" name="phuongankb" id="phuongankb" required>
                                                        <option value="">Chọn phương án</option>
                                                        <option value="Tăng mới">Tăng mới</option>
                                                        <option value="Đổi sổ BHXH">Đổi sổ BHXH</option>
                                                        <option value="Điều chỉnh thông tin">Điều chỉnh thông tin</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">Ngày bắt đầu tham gia</label>
                                                    <input type="date" class="form-control" id="nbd">
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">Ngày kết thúc (nếu có)</label>
                                                    <input type="date" class="form-control" id="nkt">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="card mb-3">
                                        <div class="card-header bg-light">
                                            <h6 class="mb-0">Mức đóng bảo hiểm</h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">Tỷ lệ người lao động đóng (%)</label>
                                                    <input type="number" class="form-control" value="10.5" readonly>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">Tỷ lệ doanh nghiệp đóng (%)</label>
                                                    <input type="number" class="form-control" value="21.5" readonly>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label class="form-label">Ghi chú</label>
                                                    <textarea class="form-control" rows="2" placeholder="Nhập ghi chú (nếu có)"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button type="submit" class="btn btn-primary">Lưu thông tin</button>
                                </form>
                            </div>
                            
                            <!-- Gửi lên cơ quan -->
                            <div class="sub-tab-content" id="gui">
                                <div class="saved-employees mt-3">
                                    <h5>Danh sách nhân viên đã lưu</h5>
                                    <!-- In qlbh.php, find the table in div with id="gui" and replace it with: -->
                                    <div class="table-responsive">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Họ và tên</th>
                                                    <th>CCCD/CMND</th>
                                                    <th>Ngày sinh</th>
                                                    <th>Ngày tham gia</th>
                                                    <th>Phương án khai báo</th>
                                                    <th>Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody id="savedEmployeesList">
                                            <?php
                                            // Truy vấn SQL để lấy thông tin nhân viên kết hợp với thông tin BHXH và các bảng liên quan
                                            $sql = "SELECT nv.ngaysinh, nv.tennv, nv.manv, nv.cccd, tt.nbd, kb.phuongankb
                                                    FROM kbbh kb
                                                    left join nhanvien nv on nv.manv = kb.manv
                                                    left join ttbh tt on tt.manv = kb.manv
                                                    WHERE kb.trangthai = 'Đang xử lý'";
                                            $result = mysqli_query($conn, $sql);
                                            
                                            if (mysqli_num_rows($result) > 0) {
                                                // Hiển thị dữ liệu mỗi hàng
                                                while($row1 = mysqli_fetch_assoc($result)) {
                                                    // Xác định trạng thái (có thể thay đổi logic này tùy theo yêu cầu)
                                                    
                                                    echo "<tr>";
                                                    echo "<td>" . $row1["tennv"] . "</td>";
                                                    echo "<td>" . $row1["cccd"] . "</td>";
                                                    echo "<td>" . $row1["ngaysinh"] . "</td>";
                                                    echo "<td>" . $row1["nbd"] . "</td>";
                                                    echo "<td>" . $row1["phuongankb"] . "</td>";
                                                    echo "<td>
                                                            <button class='btn btn-sm btn-info me-1' detail-btn data-bs-toggle='modal' data-bs-target='#employeeDetailModal' data-manv='" . $row1["manv"] . "'>Chi tiết</button>
                                                            <button class='btn btn-sm btn-primary send-btn' data-manv='" . $row1["manv"] . "'>Gửi</button>
                                                        </td>";
                                                    echo "</tr>";
                                                }
                                            } else {
                                                echo "<tr><td colspan='8' class='text-center'>Không có dữ liệu</td></tr>";
                                            }
                                            ?>
                                            </tbody>
                                        </table>
                                    </div>
                                    <button type="button" class="btn btn-success mt-3">Gửi tất cả</button>
                                </div>
                            </div>
                            
                            <!-- Kiểm tra tiến độ -->
                            <!-- In qlbh.php, find the table in div with id="kiemTra" and replace it with: -->
                            <div class="sub-tab-content" id="kiemTra">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h5 class="mb-0">Theo dõi tiến độ xử lý</h5>
                                </div>
                                <div class="table-responsive">
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Mã khai báo</th>
                                                <th>Họ và tên</th>
                                                <th>CCCD/CMND</th>
                                                <th>Ngày gửi</th>
                                                <th>Trạng thái</th>
                                                <th>Chi tiết</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        <?php
                                        // Truy vấn SQL để lấy thông tin nhân viên kết hợp với thông tin BHXH và các bảng liên quan
                                        $sql = "SELECT nv.tennv, nv.cccd, kb.ngaygui, kb.trangthai, kb.makb, tt.*
                                                from kbbh kb
                                                left join nhanvien nv on kb.manv = nv.manv
                                                left JOIN ttbh tt ON nv.manv = tt.manv
                                                WHERE kb.trangthai <> 'Đang xử lý'";
                                        $result = mysqli_query($conn, $sql);
                                        
                                        if (mysqli_num_rows($result) > 0) {
                                            // Hiển thị dữ liệu mỗi hàng
                                            while($row1 = mysqli_fetch_assoc($result)) {
                                                // Xác định trạng thái (có thể thay đổi logic này tùy theo yêu cầu)
                                                
                                                echo "<tr>";
                                                echo "<td>" . $row1["makb"] . "</td>";
                                                echo "<td>" . $row1["tennv"] . "</td>";
                                                echo "<td>" . $row1["cccd"] . "</td>";
                                                echo "<td>" . $row1["ngaygui"] . "</td>";
                                                echo "<td>" . $row1["trangthai"] . "</td>";
                                                echo "<td>
                                                    <button class='btn btn-sm btn-info' detail-btn-2 data-bs-toggle='modal' data-bs-target='#processDetailModal' data-makb='" . $row1["makb"] . "'>Xem</button>
                                                    </td>";
                                                echo "</tr>";
                                            }
                                        } else {
                                            echo "<tr><td colspan='8' class='text-center'>Không có dữ liệu</td></tr>";
                                        }
                                        ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Add this code at the end of the body, before the script tag in qlbh.php -->
    <!-- Modal Chi tiết nhân viên -->
    <div class="modal fade" id="employeeDetailModal">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Chi tiết thông tin nhân viên</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h6>Thông tin cá nhân</h6>
                            <p><strong>Mã nhân viên:</strong> <span id="detail_manv"></span></p>
                            <p><strong>Họ và tên:</strong> <span id="detail_tennv"></span></p>
                            <p><strong>CCCD/CMND:</strong> <span id="detail_cccd"></span></p>
                            <p><strong>Ngày sinh:</strong> <span id="detail_ngaysinh"></span></p>
                            <p><strong>Giới tính:</strong> <span id="detail_gioitinh"></span></p>
                            <p><strong>Số điện thoại:</strong> <span id="detail_sdt"></span></p>
                            <p><strong>Địa chỉ:</strong> <span id="detail_diachi"></span></p>
                        </div>
                        <div class="col-md-6">
                            <h6>Thông tin việc làm</h6>
                            <p><strong>Chức vụ:</strong> <span id="detail_tenvt"></span></p>
                            <p><strong>Phòng ban:</strong> <span id="detail_tenpb"></span></p>
                            
                            <h6 class="mt-3">Thông tin BHXH</h6>
                            <p><strong>Mã số BHXH:</strong> <span id="detail_mabh"></span></p>
                            <p><strong>Phương án khai báo:</strong> <span id="detail_phuongankb"></span></p>
                            <p><strong>Ngày bắt đầu:</strong> <span id="detail_nbd"></span></p>
                            <p><strong>Ngày kết thúc:</strong> <span id="detail_nkt"></span></p>
                            <p><strong>Mức đóng NLĐ:</strong> <span id="detail_mucdongnld"></span></p>
                            <p><strong>Mức đóng DN:</strong> <span id="detail_mucdongdn"></span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Add this code at the end of the body, before the script tag in qlbh.php -->
    <!-- Modal Chi tiết tiến độ xử lý -->
    <div class="modal fade" id="processDetailModal" tabindex="-1" aria-labelledby="processDetailModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Chi tiết tiến độ xử lý</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <p><strong>Họ và tên:</strong> <span id="kq_tennv"></span></p>
                            <p><strong>CCCD/CMND:</strong> <span id="kq_cccd"></span></p>
                            <p><strong>Phương án khai báo:</strong> <span id="kq_phuongankb"></span></p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Ngày gửi:</strong> <span id="kq_ngaygui"></span></p>
                            <p><strong>Trạng thái:</strong> <span id="kq_trangthai"></span></p>
                            <p><strong>Mã số BHXH được cấp:</strong> <span id="kq_mabh"></span></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button type="button" class="btn btn-primary">Gửi kết quả</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Thêm mới lao động -->
    <div class="modal fade" id="addEmployeeModal" tabindex="-1" aria-labelledby="addEmployeeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addEmployeeModalLabel">Thêm mới lao động</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="addEmployeeForm">
                        <!-- Khối thông tin cá nhân -->
                        <div class="card mb-3">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Thông tin cá nhân</h6>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Mã nhân viên</label>
                                        <input type="text" class="form-control" id="add_manv" placeholder="Nhập mã nhân viên" required>
                                    </div>
                                    <!-- Thông tin cá nhân -->
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Họ và tên</label>
                                        <input type="text" class="form-control" id="add_tennv" placeholder="Nhập họ và tên" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">CCCD/CMND</label>
                                        <input type="text" class="form-control" id="add_cccd" placeholder="Nhập số CCCD/CMND" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Ngày sinh</label>
                                        <input type="date" class="form-control" id="add_ngaysinh" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Giới tính</label>
                                        <select class="form-select" id="add_gioitinh" required>
                                            <option value="">Chọn giới tính</option>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Số điện thoại</label>
                                        <input type="tel" class="form-control" id="add_sdt" placeholder="Nhập số điện thoại">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Địa chỉ</label>
                                        <input type="text" class="form-control" id="add_diachi" placeholder="Nhập địa chỉ">
                                    </div>

                                    <!-- Thông tin việc làm -->
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Trạng thái</label>
                                        <select class="form-select" id="add_trangthai" required placeholder="Chọn trạng thái">
                                            <option value="Đang làm việc">Đang làm việc</option>
                                            <option value="Nghỉ phép">Nghỉ phép</option>
                                            <option value="Nghỉ hẳn">Nghỉ hẳn</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Chức vụ</label>
                                        <input type="text" class="form-control" id="add_chucvu" placeholder="Nhập chức vụ" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Phòng ban</label>
                                        <input type="text" class="form-control" id="add_phongban" placeholder="Nhập phòng ban" required>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Khối thông tin BHXH -->
                        <div class="card mb-3">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Thông tin BHXH</h6>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Đã tham gia BHXH</label>
                                        <select class="form-select" id="daThamGiaBHXH" required>
                                            <option value="">Chọn</option>
                                            <option value="Có">Có</option>
                                            <option value="Chưa">Chưa</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3" id="maBHXHField">
                                        <label class="form-label">Mã số BHXH</label>
                                        <input type="text" class="form-control" id="mabh1" placeholder="Nhập mã số BHXH">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Ngày bắt đầu tham gia</label>
                                        <input type="date" class="form-control" id="add_nbd">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Ngày kết thúc (nếu có)</label>
                                        <input type="date" class="form-control" id="add_nkt">
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Khối mức đóng bảo hiểm -->
                        <div class="card mb-3">
                            <div class="card-header bg-light">
                                <h6 class="mb-0">Mức đóng bảo hiểm</h6>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Tỷ lệ người lao động đóng (%)</label>
                                        <input type="number" class="form-control" id="tlnld" value="10.5" readonly>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Tỷ lệ doanh nghiệp đóng (%)</label>
                                        <input type="number" class="form-control" id="tldn" value="21.5" readonly>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Ghi chú</label>
                                        <textarea class="form-control" rows="2" placeholder="Nhập ghi chú (nếu có)"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                    <button type="button" class="btn btn-primary" id="saveNewEmployee">Lưu thông tin</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Chỉnh sửa lao động -->
    <div class="modal fade" id="editEmployeeModal" tabindex="-1" aria-labelledby="editEmployeeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editEmployeeModalLabel">Chỉnh sửa thông tin lao động</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <form id="editEmployeeForm">
                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">Thông tin cá nhân</h6>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Mã nhân viên</label>
                                    <input type="text" class="form-control" id="edit_manv" readonly>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Họ và tên</label>
                                    <input type="text" class="form-control" id="edit_tennv" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">CCCD/CMND</label>
                                    <input type="text" class="form-control" id="edit_cccd" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Ngày sinh</label>
                                    <input type="date" class="form-control" id="edit_ngaysinh" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Giới tính</label>
                                    <select class="form-select" id="edit_gioitinh" required>
                                        <option value="">Chọn giới tính</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Số điện thoại</label>
                                    <input type="tel" class="form-control" id="edit_sdt" placeholder="Nhập số điện thoại">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Địa chỉ</label>
                                    <input type="text" class="form-control" id="edit_diachi" placeholder="Nhập địa chỉ">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">Thông tin việc làm</h6>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Chức vụ</label>
                                    <input type="text" class="form-control" id="edit_chucvu" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Phòng ban</label>
                                    <input type="text" class="form-control" id="edit_phongban" required>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">Thông tin BHXH</h6>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Đã tham gia BHXH</label>
                                    <select class="form-select" id="edit_daCoMaBHXH" required>
                                        <option value="">Chọn</option>
                                        <option value="Có">Có</option>
                                        <option value="Chưa">Chưa</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Mã số BHXH</label>
                                    <input type="text" class="form-control" id="edit_mabh" placeholder="Nhập mã số BHXH">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Ngày bắt đầu tham gia</label>
                                    <input type="date" class="form-control" id="edit_nbd">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Ngày kết thúc (nếu có)</label>
                                    <input type="date" class="form-control" id="edit_nkt">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Trạng thái</label>
                                    <select class="form-select" id="edit_trangthai" required>
                                        <option value="">Chọn trạng thái</option>
                                        <option value="Đang làm việc">Đang làm việc</option>
                                        <option value="Nghỉ phép">Nghỉ phép</option>
                                        <option value="Nghỉ hẳn">Nghỉ hẳn</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <h6 class="mb-0">Mức đóng bảo hiểm</h6>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Tỷ lệ người lao động đóng (%)</label>
                                    <input type="number" class="form-control" id="edit_tlnld" value="10.5" readonly>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Tỷ lệ doanh nghiệp đóng (%)</label>
                                    <input type="number" class="form-control" id="edit_tldn" value="21.5" readonly>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                    <button type="button" class="btn btn-primary" id="saveEditEmployee">Lưu thay đổi</button>
                </div>
            </div>
        </div>
    </div>

    <script src="qlbh.js"></script>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Dữ liệu cho biểu đồ hình tròn
        const pieData = {
            labels: ['Đang xử lý', 'Đã gửi'],
            datasets: [{
                data: [<?php echo $dang_xu_ly; ?>, <?php echo $da_gui; ?>],
                backgroundColor: ['#FF6384', '#36A2EB']
            }]
        };

        // Vẽ biểu đồ hình tròn
        const pieCtx = document.getElementById('pieChart').getContext('2d');
        new Chart(pieCtx, {
            type: 'pie',
            data: pieData
        });

        // Dữ liệu cho biểu đồ cột
        const barData = {
            labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
            datasets: [{
                label: 'Số lượng hồ sơ',
                data: [<?php echo implode(',', $so_luong_theo_thang); ?>],
                backgroundColor: '#36A2EB'
            }]
        };

        // Vẽ biểu đồ cột
        const barCtx = document.getElementById('barChart').getContext('2d');
        new Chart(barCtx, {
            type: 'bar',
            data: barData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
    </script>
</body>
</html>
<?php
mysqli_close($conn);
?>