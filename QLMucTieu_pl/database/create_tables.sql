-- Tạo bảng phòng ban
CREATE TABLE phong_ban (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_phong VARCHAR(10) UNIQUE NOT NULL,
    ten_phong VARCHAR(100) NOT NULL
);

-- Tạo bảng phân chuyền
CREATE TABLE phan_chuyen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ma_chuyen VARCHAR(10) UNIQUE NOT NULL,
    ten_chuyen VARCHAR(100) NOT NULL,
    ma_phong VARCHAR(10) NOT NULL,
    FOREIGN KEY (ma_phong) REFERENCES phong_ban(ma_phong)
); 