<?php
// Nhúng file cấu hình kết nối database
require_once 'config.php';
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản lý phân chuyền</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        /* CSS cho sidebar */
        .sidebar {
            background-color: #2196F3;
            color: white;
            min-height: 100vh;
            padding: 20px 0;
        }
        .sidebar .nav-link {
            color: white;
            padding: 10px 20px;
        }
        .sidebar .nav-link:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        .sidebar .nav-link.active {
            background-color: rgba(255, 255, 255, 0.2);
        }
        /* CSS cho phần profile */
        .profile-section {
            text-align: center;
            padding: 20px;
            margin-bottom: 20px;
        }
        .profile-image {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            margin-bottom: 10px;
        }
        /* CSS cho phần nội dung chính */
        .main-content {
            padding: 20px;
        }
        /* CSS cho bảng */
        .table th {
            background-color: #f8f9fa;
        }
        /* CSS cho phần tìm kiếm */
        .search-section {
            margin-bottom: 20px;
        }
        /* CSS cho phân trang */
        .pagination {
            justify-content: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <?php include 'sidebar.php'; ?>

            <!-- Main Content -->
            <div class="col-md-10 main-content">
                <!-- Tiêu đề và nút thêm mới -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Quản lý phân chuyền</h2>
                    <a href="them_phan_chuyen.php" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Thêm phân chuyền mới
                    </a>
                </div>

                <!-- Form tìm kiếm và lọc -->
                <form method="GET" action="">
                    <div class="row search-section">
                        <!-- Ô tìm kiếm -->
                        <div class="col-md-4">
                            <div class="input-group">
                                <span class="input-group-text"><i class="fas fa-search"></i></span>
                                <input type="text" class="form-control" name="search" placeholder="Tìm kiếm theo tên phân chuyền..." value="<?php echo isset($_GET['search']) ? htmlspecialchars($_GET['search']) : ''; ?>">
                            </div>
                        </div>
                        <!-- Lọc theo phòng ban -->
                        <div class="col-md-3">
                            <select class="form-select" name="phong_ban">
                                <option value="">Tất cả phòng ban</option>
                                <?php
                                // Lấy danh sách phòng ban từ database
                                $sql_phong_ban = "SELECT * FROM phong_ban ORDER BY ten_phong";
                                $result_phong_ban = mysqli_query($conn, $sql_phong_ban);
                                
                                if (mysqli_num_rows($result_phong_ban) > 0) {
                                    while($row = mysqli_fetch_assoc($result_phong_ban)) {
                                        $selected = (isset($_GET['phong_ban']) && $_GET['phong_ban'] == $row['ma_phong']) ? 'selected' : '';
                                        echo "<option value='" . htmlspecialchars($row['ma_phong']) . "' " . $selected . ">" . htmlspecialchars($row['ten_phong']) . "</option>";
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

                <!-- Bảng danh sách phân chuyền -->
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Mã chuyền</th>
                                <th>Tên chuyền</th>
                                <th>Phòng ban</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            // Xây dựng câu truy vấn SQL với điều kiện lọc
                            $sql = "SELECT pc.*, pb.ten_phong 
                                   FROM phan_chuyen pc 
                                   LEFT JOIN phong_ban pb ON pc.ma_phong = pb.ma_phong 
                                   WHERE 1=1";
                            $params = array();

                            // Thêm điều kiện tìm kiếm nếu có
                            if (isset($_GET['search']) && !empty($_GET['search'])) {
                                $search = mysqli_real_escape_string($conn, $_GET['search']);
                                $sql .= " AND pc.ten_chuyen LIKE ?";
                                $params[] = "%$search%";
                            }

                            // Thêm điều kiện lọc phòng ban nếu có
                            if (isset($_GET['phong_ban']) && !empty($_GET['phong_ban'])) {
                                $phong_ban = mysqli_real_escape_string($conn, $_GET['phong_ban']);
                                $sql .= " AND pc.ma_phong = ?";
                                $params[] = $phong_ban;
                            }

                            // Sắp xếp theo mã chuyền
                            $sql .= " ORDER BY pc.ma_chuyen ASC";

                            // Chuẩn bị và thực thi câu truy vấn
                            $stmt = mysqli_prepare($conn, $sql);
                            if (!empty($params)) {
                                $types = str_repeat('s', count($params));
                                mysqli_stmt_bind_param($stmt, $types, ...$params);
                            }
                            mysqli_stmt_execute($stmt);
                            $result = mysqli_stmt_get_result($stmt);

                            // Hiển thị dữ liệu nếu có kết quả
                            if (mysqli_num_rows($result) > 0) {
                                while($row = mysqli_fetch_assoc($result)) {
                                    echo "<tr>";
                                    echo "<td>" . htmlspecialchars($row['ma_chuyen']) . "</td>";
                                    echo "<td>" . htmlspecialchars($row['ten_chuyen']) . "</td>";
                                    echo "<td>" . htmlspecialchars($row['ten_phong']) . "</td>";
                                    echo "<td>
                                            <a href='sua_phan_chuyen.php?id=" . $row['id'] . "' class='btn btn-sm btn-primary'><i class='fas fa-edit'></i></a>
                                            <a href='delete_phan_chuyen.php?id=" . $row['id'] . "' class='btn btn-sm btn-danger' onclick='return confirm(\"Bạn có chắc chắn muốn xóa phân chuyền này?\")'><i class='fas fa-trash'></i></a>
                                          </td>";
                                    echo "</tr>";
                                }
                            } else {
                                // Hiển thị thông báo nếu không có dữ liệu
                                echo "<tr><td colspan='4' class='text-center'>Không có phân chuyền nào</td></tr>";
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