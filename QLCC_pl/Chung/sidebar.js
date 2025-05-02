document.addEventListener('DOMContentLoaded', function() {
    const currentLocation = window.location.pathname;    
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    navLinks.forEach(link => {
        // Lấy tên file từ href của link (bỏ ../ nếu có)
        const linkHref = link.getAttribute('href').split('/').pop();
        // Lấy tên file hiện tại
        const currentFile = currentLocation.split('/').pop();
        if (linkHref === currentFile) {
            link.classList.add('active');
        }
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
});