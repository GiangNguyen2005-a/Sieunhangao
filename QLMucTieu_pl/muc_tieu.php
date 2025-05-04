<?php
// Nhúng file cấu hình kết nối database
require_once 'config.php';
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản lý mục tiêu</title>
    <?php include '../Chung/relink.php'; ?>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <?php include '../Chung/sidebar.php'; ?>

            <!-- Main Content -->
            <div class="col-md-10 main-content">
                <!-- Tiêu đề và nút thêm mới -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Quản lý mục tiêu</h2>
                    <a href="them_muc_tieu.php" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Thêm mục tiêu mới
                    </a>
                </div>

                <!-- Form tìm kiếm và lọc -->
                <form method="GET" action="">
                    <div class="row search-section">
                        <!-- Ô tìm kiếm -->
                        <div class="col-md-4">
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-search"></i></span>
                                <input type="text" class="form-control" name="search" placeholder="Tìm kiếm theo tên hoặc mã mục tiêu..." value="<?php echo isset($_GET['search']) ? htmlspecialchars($_GET['search']) : ''; ?>">
                            </div>
                        </div>
                        <!-- Lọc theo trạng thái -->
                        <div class="col-md-3">
                            <select class="form-select" name="trang_thai">
                                <option value="">Tất cả trạng thái</option>
                                <option value="Đang thực hiện" <?php echo (isset($_GET['trang_thai']) && $_GET['trang_thai'] == 'Đang thực hiện') ? 'selected' : ''; ?>>Đang thực hiện</option>
                                <option value="Hoàn thành" <?php echo (isset($_GET['trang_thai']) && $_GET['trang_thai'] == 'Hoàn thành') ? 'selected' : ''; ?>>Hoàn thành</option>
                                <option value="Chưa bắt đầu" <?php echo (isset($_GET['trang_thai']) && $_GET['trang_thai'] == 'Chưa bắt đầu') ? 'selected' : ''; ?>>Chưa bắt đầu</option>
                            </select>   
                        </div>
                        <!-- Lọc theo phân chuyền -->
                        <div class="col-md-3">
                            <select class="form-select" name="phan_chuyen">
                                <option value="">Tất cả phân chuyền</option>
                                <?php
                                // Lấy danh sách phân chuyền từ database
                                $sql = "SELECT pc.*, pb.ten_phong 
                                       FROM phan_chuyen pc 
                                       LEFT JOIN phong_ban pb ON pc.ma_phong = pb.ma_phong 
                                       ORDER BY pc.ma_chuyen";
                                $result = mysqli_query($conn, $sql);
                                
                                if (mysqli_num_rows($result) > 0) {
                                    while($row = mysqli_fetch_assoc($result)) {
                                        $selected = (isset($_GET['phan_chuyen']) && $_GET['phan_chuyen'] == $row['ma_chuyen']) ? 'selected' : '';
                                        echo "<option value='" . htmlspecialchars($row['ma_chuyen']) . "' $selected>" . 
                                             htmlspecialchars($row['ma_chuyen']) . " - " . 
                                             htmlspecialchars($row['ten_chuyen']) . " (" . 
                                             htmlspecialchars($row['ten_phong']) . ")</option>";
                                    }
                                }
                                ?>
                            </select>
                        </div>
                        <!-- Nút lọc -->
                        <div class="col-md-2">
                            <button type="submit" class="btn btn-outline-secondary w-100">
                                <i class="fas fa-filter"></i> Lọc
                            </button>
                        </div>
                    </div>
                </form>

                <!-- Bảng danh sách mục tiêu -->
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Mã mục tiêu</th>
                                <th>Tên mục tiêu</th>
                                <th>Mô tả</th>
                                <th>Chi tiết</th>
                                <th>Phân chuyền</th>
                                <th>Ngày bắt đầu</th>
                                <th>Hạn hoàn thành</th>
                                <th>Trạng thái</th>
                                <th>Tiến độ</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            // Xây dựng câu truy vấn SQL với điều kiện lọc
                            $sql = "SELECT mt.*, pc.ten_chuyen as ten_phan_chuyen 
                                   FROM muc_tieu mt 
                                   LEFT JOIN phan_chuyen pc ON mt.phan_chuyen = pc.ma_chuyen 
                                   WHERE 1=1";
                            $params = array();
                            $types = '';

                            // Thêm điều kiện tìm kiếm nếu có
                            if (isset($_GET['search']) && !empty($_GET['search'])) {
                                $search = mysqli_real_escape_string($conn, $_GET['search']);
                                $sql .= " AND (mt.ten_muc_tieu LIKE ? OR mt.ma_muc_tieu LIKE ?)";
                                $params[] = "%$search%";
                                $params[] = "%$search%";
                                $types .= 'ss';
                            }

                            // Thêm điều kiện lọc trạng thái nếu có
                            if (isset($_GET['trang_thai']) && !empty($_GET['trang_thai'])) {
                                $trang_thai = mysqli_real_escape_string($conn, $_GET['trang_thai']);
                                $sql .= " AND mt.trang_thai = ?";
                                $params[] = $trang_thai;
                                $types .= 's';
                            }

                            // Thêm điều kiện lọc phân chuyền nếu có
                            if (isset($_GET['phan_chuyen']) && !empty($_GET['phan_chuyen'])) {
                                $phan_chuyen = mysqli_real_escape_string($conn, $_GET['phan_chuyen']);
                                $sql .= " AND mt.phan_chuyen = ?";
                                $params[] = $phan_chuyen;
                                $types .= 's';
                            }

                            // Sắp xếp theo ngày bắt đầu giảm dần
                            $sql .= " ORDER BY mt.ngay_bat_dau DESC";

                            // Debug thông tin
                            echo "<!-- SQL Query: " . $sql . " -->";
                            echo "<!-- Parameters: " . print_r($params, true) . " -->";

                            // Chuẩn bị và thực thi câu truy vấn
                            $stmt = mysqli_prepare($conn, $sql);
                            if (!$stmt) {
                                echo "<!-- Error preparing statement: " . mysqli_error($conn) . " -->";
                            }

                            if (!empty($params)) {
                                if (!mysqli_stmt_bind_param($stmt, $types, ...$params)) {
                                    echo "<!-- Error binding parameters: " . mysqli_stmt_error($stmt) . " -->";
                                }
                            }

                            if (!mysqli_stmt_execute($stmt)) {
                                echo "<!-- Error executing statement: " . mysqli_stmt_error($stmt) . " -->";
                            }

                            $result = mysqli_stmt_get_result($stmt);
                            if (!$result) {
                                echo "<!-- Error getting result: " . mysqli_error($conn) . " -->";
                            }

                            // Debug: In kết quả truy vấn
                            // echo "<pre>";
                            // while($row = mysqli_fetch_assoc($result)) {
                            //     print_r($row);
                            // }
                            // echo "</pre>";
                            // die(); // Dừng để xem kết quả
                            
                            // Hiển thị dữ liệu nếu có kết quả
                            if (mysqli_num_rows($result) > 0) {
                                while($row = mysqli_fetch_assoc($result)) {
                                    echo "<tr>";
                                    echo "<td>" . htmlspecialchars($row['ma_muc_tieu']) . "</td>";
                                    echo "<td>" . htmlspecialchars($row['ten_muc_tieu']) . "</td>";
                                    echo "<td>" . htmlspecialchars($row['mo_ta']) . "</td>";
                                    echo "<td>" . htmlspecialchars($row['chi_tiet']) . "</td>";
                                    echo "<td>" . htmlspecialchars($row['phan_chuyen']) . " (" . htmlspecialchars($row['ten_phan_chuyen']) . ")</td>";
                                    echo "<td>" . htmlspecialchars($row['ngay_bat_dau']) . "</td>";
                                    echo "<td>" . htmlspecialchars($row['ngay_ket_thuc']) . "</td>";
                                    echo "<td>" . htmlspecialchars($row['trang_thai']) . "</td>";
                                    echo "<td>" . htmlspecialchars($row['so_luong_da_dat']) . "/" . htmlspecialchars($row['so_luong_de_ra']) . "</td>";
                                    echo "<td>
                                            <a href='sua_muc_tieu.php?id=" . $row['id'] . "' class='btn btn-sm btn-primary'><i class='fas fa-edit'></i></a>
                                            <a href='delete_muc_tieu.php?id=" . $row['id'] . "' class='btn btn-sm btn-danger' onclick='return confirm(\"Bạn có chắc chắn muốn xóa mục tiêu này?\")'><i class='fas fa-trash'></i></a>
                                          </td>";
                                    echo "</tr>";
                                }
                            } else {
                                // Hiển thị thông báo nếu không có dữ liệu
                                echo "<tr><td colspan='10' class='text-center'>Không có mục tiêu nào</td></tr>";
                            }
                            ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 