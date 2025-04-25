-- Tạo bảng mục tiêu
CREATE TABLE muc_tieu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_muc_tieu VARCHAR(20) NOT NULL,
    ten_muc_tieu VARCHAR(255) NOT NULL,
    phan_chuyen VARCHAR(10) NOT NULL,
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    mo_ta TEXT,
    chi_tiet TEXT,
    so_luong_de_ra INT NOT NULL,
    so_luong_da_dat INT NOT NULL,
    trang_thai VARCHAR(20) NOT NULL,
    FOREIGN KEY (phan_chuyen) REFERENCES phan_chuyen(ma_chuyen)
); 