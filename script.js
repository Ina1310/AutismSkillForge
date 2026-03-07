document.addEventListener("DOMContentLoaded", () => {
    // Mobile Menu Logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuWrapper = document.querySelector('.mobile-menu-wrapper');
    const navLinks = document.querySelectorAll('.nav a');

    if (mobileMenuBtn && mobileMenuWrapper) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuWrapper.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuWrapper.classList.remove('active');
            });
        });
    }

    // YouTube Player Logic (click thumbnail → inject iframe)
    const videoWrappers = document.querySelectorAll('.youtube-player-wrapper');
    videoWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const videoId = wrapper.getAttribute('data-id');
            if (videoId) {
                const iframe = document.createElement('iframe');
                iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
                iframe.setAttribute('title', 'YouTube video player');
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
                iframe.setAttribute('allowfullscreen', 'true');
                iframe.style.position = 'absolute';
                iframe.style.top = '0';
                iframe.style.left = '0';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                wrapper.innerHTML = '';
                wrapper.appendChild(iframe);
            }
        });
    });

    // Popup Logic
    const popups = document.querySelectorAll('.popup-overlay');
    const popupTriggers = document.querySelectorAll('.popup-trigger');
    const closeButtons = document.querySelectorAll('.popup-close');
    
    // Open Popup
    popupTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = trigger.getAttribute('data-target');
            const targetPopup = document.getElementById(targetId);
            if (targetPopup) {
                targetPopup.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                
                const form = targetPopup.querySelector('#lead-form');
                const messages = targetPopup.querySelector('#form-messages');
                if (form) {
                    form.style.display = 'block';
                    if (messages) messages.innerHTML = '';
                    form.reset();
                }
            }
        });
    });

    // Close Popup functions
    const closePopup = () => {
        popups.forEach(popup => {
            popup.classList.remove('active');
        });
        document.body.style.overflow = '';
    };

    closeButtons.forEach(btn => {
        btn.addEventListener('click', closePopup);
    });

    popups.forEach(popup => {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                closePopup();
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopup();
        }
    });

    // Form Submission Logic
    const form = document.getElementById('lead-form');
    const formMessages = document.getElementById('form-messages');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Bot protection
            if (document.getElementById('botcheck').value !== '') {
                return; // Silently fail if honeypot is filled
            }
            
            // Basic UI indication
            const submitBtn = form.querySelector('.btn-submit');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'ОТПРАВКА...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            
            /* =======================================================
               ИНТЕГРАЦИЯ С GOOGLE ТАБЛИЦАМИ
               Сюда нужно вставить URL вашего развернутого веб-приложения (Google Apps Script).
               Инструкция: 
               1. Создайте форму в Google Таблицах -> Расширения -> Apps Script
               2. Напишите функцию doPost(e)
               3. Нажмите "Развернуть" -> "Новое развертывание" -> Веб-приложение (доступно всем)
               4. Скопируйте URL и вставьте ниже:
            ======================================================= */
            const webhookUrl = 'https://script.google.com/macros/s/AKfycbyql1MZzACYBHduGdz_1cOeD9CGRuJN8dj3z6HvOKw5flfWPe4UrDE5Jc4G7xpKpOMuXQ/exec';
            
            try {
                // Если URL скрипта еще не задан, просто симулируем успешную отправку
                if (webhookUrl.includes('ЗАМЕНИТЕ')) {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    throw new Error('DEV_SIMULATION');
                }

                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors' // Must use no-cors for simple Google Script submission
                });
                
                showSuccessMessage();
            } catch (error) {
                if (error.message === 'DEV_SIMULATION') {
                    // Симуляция успешной отправки для демонстрации
                    showSuccessMessage();
                } else {
                    formMessages.innerHTML = '<span style="color: red;">Произошла ошибка при отправке. Пожалуйста, попробуйте позже.</span>';
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    console.error('Error:', error);
                }
            }

            function showSuccessMessage() {
                form.style.display = 'none';
                formMessages.innerHTML = `
                    <div style="text-align: center; padding: 30px 0;">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 20px; display: inline-block;">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <h3 style="font-size: 1.5rem; margin-bottom: 15px;">Вы записаны!</h3>
                        <p style="font-size: 1.1rem; color: #666;">Мы свяжемся с вами в ближайшее время.</p>
                    </div>`;
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                form.reset();
            }
        });
    }

    // Scroll Animations (Intersection Observer)
    const observeElements = document.querySelectorAll('.animate-on-scroll');
    if (observeElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        observeElements.forEach(el => observer.observe(el));
    }
});
