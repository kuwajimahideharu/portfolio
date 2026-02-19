document.addEventListener('DOMContentLoaded', () => {

    // --- Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav a');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // --- Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay if data-delay attribute exists
                const delay = entry.target.getAttribute('data-delay');
                if (delay) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                } else {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));


    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const originalBtnText = submitBtn ? submitBtn.textContent : '';

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = '送信中...';

            const formData = new FormData(contactForm);

            fetch('https://script.google.com/macros/s/AKfycbz_i05jyXzeHqKwUh_JM5C1Rssxw1CyLK_Dyorryg-iLPpzZAnAJAXmDDK-iHtIRwFZLg/exec', {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.result === 'success') {
                        // alertの代わりに、フォームを消してメッセージを表示する
                        contactForm.innerHTML = `
        <div class="success-message" style="text-align:center; padding: 40px 0;">
            <i class="fa-regular fa-circle-check" style="font-size: 4rem; color: #c5a059; margin-bottom: 20px; display:block;"></i>
            <h3 style="color: #1a365d;">お問い合わせありがとうございます！</h3>
            <p>内容を確認し、24時間以内にご連絡いたします。</p>
        </div>
    `;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('送信エラーが発生しました。');
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                });
        });
    }

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
});
