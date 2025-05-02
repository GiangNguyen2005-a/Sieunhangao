
-- Quản lý đánh giá 
-- Bảng Kỳ Đánh Giá
CREATE TABLE KyDanhGia (
    MaKyDG VARCHAR(10) PRIMARY KEY,
    TenKyDG NVARCHAR(200) NOT NULL,
     ViTriDG NVARCHAR(10) NOT NULL,
   ThoiGianApDung DATE NOT NULL, -- Ngày bắt đầu áp dụng (VD: 01/01/2024 cho Quý 1 2024)
    HanTuDanhGia DATE NULL, -- Hạn nhân viên tự đánh giá
    HanQuanLyDanhGia DATE NOT NULL, -- Hạn quản lý đánh giá (Deadline chung)
    PhuongPhapDanhGia NVARCHAR(100) NULL, -- Có thể tách bảng nếu cần
    MaNV_NguoiTao VARCHAR(10) NULL, -- Nhân viên HR tạo kỳ
    NgayTao DATETIME DEFAULT CURDATE(),
    TrangThai NVARCHAR(50) DEFAULT N'Mới tạo', -- Ví dụ: Mới tạo, Đang diễn ra, Đã đóng
    FOREIGN KEY (MaNV_NguoiTao) REFERENCES NhanVien(MaNV)
);

-- Bảng Đối Tượng Tham Gia Kỳ Đánh Giá (Thay thế cho ViTriDG trong KyDanhGia)
CREATE TABLE DoiTuongKyDanhGia (
    MaKyDG VARCHAR(10) NOT NULL,
    MaNV VARCHAR(10) NOT NULL,
    -- Thêm các trạng thái chi tiết cho từng nhân viên trong kỳ DG
    TrangThaiTuDanhGia NVARCHAR(50) DEFAULT N'Chưa thực hiện', -- Chưa thực hiện, Đã thực hiện
    TrangThaiQLDanhGia NVARCHAR(50) DEFAULT N'Chờ đánh giá', -- Chờ đánh giá, Đã đánh giá, Đã phản hồi, Đã xác nhận
    PRIMARY KEY (MaKyDG, MaNV),
    FOREIGN KEY (MaKyDG) REFERENCES KyDanhGia(MaKyDG) ON DELETE CASCADE,
    FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV) ON DELETE CASCADE
);



-- Bảng Phiếu Tự Đánh Giá (Chỉ lưu thông tin chung của phiếu)
CREATE TABLE PhieuTuDanhGia (
    MaPTDG VARCHAR(10) PRIMARY KEY,
    MaKyDG VARCHAR(10) NOT NULL,
    AMSP INT CHECK (AMSP BETWEEN 1 AND 10),
    AHNV INT CHECK (AHNV BETWEEN 1 AND 10),
    QuanLy INT CHECK (QUANLY BETWEEN 1 AND 10),
    PhanTich INT CHECK (PHANTICH BETWEEN 1 AND 10),
    QLDUAN INT CHECK (QLDUAN BETWEEN 1 AND 10),
    GiaiQuyetVanDe INT CHECK (GIAIQUYETVANDE BETWEEN 1 AND 10),
    TinhThanTN INT CHECK (TINHTHANTN BETWEEN 1 AND 10),
    ThaiDo INT CHECK (THAIDO BETWEEN 1 AND 10),
    MaNV VARCHAR(10) NOT NULL,
    NhanXet NVARCHAR(500) NULL,
    NgayThucHien DATETIME DEFAULT CURDATE(),
    FOREIGN KEY (MaKyDG, MaNV) REFERENCES DoiTuongKyDanhGia(MaKyDG, MaNV), -- Tham chiếu tới bảng đối tượng
    CONSTRAINT UK_PTDG_NV_KY UNIQUE (MaNV, MaKyDG) -- Đảm bảo mỗi nhân viên chỉ có 1 phiếu TỰ đánh giá cho mỗi kì
);

-- Bảng Phiếu Quản Lý Đánh Giá (Chỉ lưu thông tin chung)
CREATE TABLE PhieuQuanLyDanhGia (
    MAQLDG VARCHAR(10) PRIMARY KEY,
    AMSP INT CHECK (AMSP BETWEEN 1 AND 10),
    AHNV INT CHECK (AHNV BETWEEN 1 AND 10),
    QuanLy INT CHECK (QUANLY BETWEEN 1 AND 10),
    PhanTich INT CHECK (PHANTICH BETWEEN 1 AND 10),
    QLDUAN INT CHECK (QLDUAN BETWEEN 1 AND 10),
    GiaiQuyetVanDe INT CHECK (GIAIQUYETVANDE BETWEEN 1 AND 10),
    TinhThanTN INT CHECK (TINHTHANTN BETWEEN 1 AND 10),
    ThaiDo INT CHECK (THAIDO BETWEEN 1 AND 10),
    NhanXet NVARCHAR(500),
    TongDiem INT GENERATED ALWAYS AS (AMSP + AHNV + QUANLY + PHANTICH + QLDUAN + GIAIQUYETVANDE + TINHTHANTN + THAIDO) STORED,
    TinhTrang NVARCHAR(30) DEFAULT N'Chờ đánh giá',
    MaNV VARCHAR(10) NOT NULL, -- Nhân viên được đánh giá
    MaPTDG VARCHAR(10) NOT NULL,
    MaNV_QuanLy VARCHAR(10) NOT NULL, -- Quản lý đánh giá
    FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV),
    FOREIGN KEY (MaPTDG) REFERENCES PhieuTuDanhGia(MAPTDG),
    FOREIGN KEY (MaNV_QuanLy) REFERENCES NhanVien(MaNV)
);


-- Bảng Chi Tiết Phản Hồi (Lưu lịch sử trao đổi)
CREATE TABLE ChiTietPhanHoiDanhGia (
    MaPhanHoi VARCHAR(10) PRIMARY KEY,
    MaQLDG VARCHAR(10) NOT NULL, -- Liên kết với phiếu quản lý đánh giá
    MaNV_NguoiGui VARCHAR(10) NOT NULL, -- Người gửi phản hồi (NV hoặc QL)
    NoiDung LONGTEXT NOT NULL,  -- Đã sửa: Thay NVARCHAR(MAX) bằng LONGTEXT
    ThoiGianGui DATETIME DEFAULT CURRENT_TIMESTAMP(), -- Đã sửa: Thay CURDATE() bằng CURRENT_TIMESTAMP() (hoặc NOW())
    FOREIGN KEY (MaQLDG) REFERENCES PhieuQuanLyDanhGia(MaQLDG) ON DELETE CASCADE,
    FOREIGN KEY (MaNV_NguoiGui) REFERENCES NhanVien(MaNV)
);

-- Bảng Báo Cáo Đánh Giá (Có thể giữ nguyên hoặc tùy chỉnh thêm)
CREATE TABLE BaoCaoDanhGia (
    MaBC VARCHAR(10) PRIMARY KEY,
    TenBC NVARCHAR(100) NOT NULL,
    NgayLapBC DATE NOT NULL,
    MaKyDG VARCHAR(10) NULL, -- Có thể báo cáo theo kỳ hoặc không
    MaNV_NguoiLap VARCHAR(10) NOT NULL,
    LoaiBaoCao NVARCHAR(50) NULL, -- VD: Tong hop theo ky, Theo phong ban,...
    NoiDungLuuTru LONGTEXT NULL, -- Có thể lưu tham số báo cáo hoặc link file,...
    FOREIGN KEY (MaKyDG) REFERENCES KyDanhGia(MaKyDG),
    FOREIGN KEY (MaNV_NguoiLap) REFERENCES NhanVien(MaNV)
);

