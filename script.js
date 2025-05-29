        // Theme Toggle Functionality
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        const body = document.body;

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });

        function updateThemeIcon(theme) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        // Mobile Menu Functionality
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('show');
        });

        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('show');
        });

        // Sidebar Navigation
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        const contentSections = document.querySelectorAll('.content-section');

        sidebarLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                // Remove active class from all links
                sidebarLinks.forEach(l => l.classList.remove('active'));

                // Add active class to clicked link
                this.classList.add('active');

                // Hide all content sections
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });

                // Show the corresponding content section
                const targetSection = this.getAttribute('data-section');
                const targetContent = document.getElementById(targetSection);
                if (targetContent) {
                    targetContent.classList.add('active');
                }

                // Close mobile menu if open
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('show');

                // Scroll to top of content area
                document.querySelector('.main-content').scrollTop = 0;
            });
        });

        // Contact Form Handler
        function handleSubmit(event) {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Here you would typically send the data to your backend
            alert(`Terima kasih ${name}! Pesan Anda telah diterima. Saya akan segera menghubungi Anda kembali.`);

            // Reset form
            document.querySelector('.contact-form').reset();
        }

        // CV Download Function
        function downloadCV(format) {
            // In a real application, this would trigger actual file download
            alert(`Downloading CV in ${format.toUpperCase()} format...`);

            // You can implement actual download functionality here
            // For example, using a download link or fetch request
        }

        // Smooth scrolling and animations
        document.addEventListener('DOMContentLoaded', function () {
            // Add smooth scroll behavior
            document.documentElement.style.scrollBehavior = 'smooth';

            // Add loading animation to cards
            const cards = document.querySelectorAll('.skill-card, .portfolio-card, .contact-item');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });

        // Handle window resize for responsive behavior
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('show');
            }
        });