document.addEventListener('DOMContentLoaded', function() {
    const queryForm = document.getElementById('queryForm');
    const updateForm = document.getElementById('updateForm');
    const registerForm = document.getElementById('registerForm');
    const queryResult = document.getElementById('queryResult');
    
    // Fix for tab navigation
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and tabs
            navLinks.forEach(item => item.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(tab => {
                tab.classList.remove('show', 'active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show the corresponding tab
            const targetId = this.getAttribute('href').substring(1);
            const targetTab = document.getElementById(targetId);
            targetTab.classList.add('show', 'active');
        });
    });

    queryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const insuranceId = document.getElementById('insuranceId').value;
        
        // Giả lập gọi API
        setTimeout(() => {
            queryResult.innerHTML = `
                <h5>Thông tin BHXH</h5>
                <p><strong>Mã số BHXH:</strong> ${insuranceId}</p>
                <p><strong>Họ và tên:</strong> Nguyễn Văn A</p>
                <p><strong>Ngày tham gia:</strong> 01/01/2023</p>
                <p><strong>Tình trạng:</strong> <span class="badge bg-success">Đang tham gia</span></p>
                <p><strong>Thời gian đóng BHXH:</strong> 1 năm 3 tháng</p>
                <p><strong>Mức lương đóng BHXH:</strong> ${formatCurrency(10000000)}</p>
            `;
            queryResult.classList.add('show');
        }, 500);
    });

    updateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Đã cập nhật thông tin BHXH thành công!');
        this.reset();
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Đã đăng ký tăng lao động thành công!');
        this.reset();
    });

    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    function kiemTraMaBHXH(id) {
        return /^\d{10}$/.test(id);
    }
});
