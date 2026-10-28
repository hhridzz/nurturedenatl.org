/* Nurture Dental: scripts shared by every page */

// ── STATS COUNTER ──
function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const isDecimal = target % 1 !== 0;
    const duration = 1800;
    const start = performance.now();
    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString() + (target >= 1000 ? '+' : target === 20 ? '+' : '');
    }
    requestAnimationFrame(update);
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.AOS) {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
        });
    }

    const customCursor = document.querySelector('.custom-cursor');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.remove('touch-device');
        document.addEventListener('mousemove', function(e) {
            if (customCursor) {
                customCursor.style.left = e.clientX + 'px';
                customCursor.style.top = e.clientY + 'px';
            }
        });
        document.querySelectorAll('a, button, input, textarea, .review-item-summary, #review-modal-close').forEach(el => {
            el.addEventListener('mouseenter', () => customCursor.classList.add('pointer'));
            el.addEventListener('mouseleave', () => customCursor.classList.remove('pointer'));
        });
    }

    // ── REVIEWS (home shows the first few via data-limit, the reviews page shows all) ──
    const reviewsData = [
        { name: "Gunjan M.", stars: 5, jist: "An amazing experience with Dr. Ami. She gives the best and most genuine advice... thoroughly professional.", fullText: "It has been an amazing experience with Dr Ami in my treatment of cavities and the braces procedure. My mom too had visiting her and we are fully satisfied with the experience we’ve had. She gives the best and genuine advice on the procedures and is a through professional." },
        { name: "Bansari S.", stars: 5, jist: "Dr. Ami is a fabulous dentist and a natural with children, making them feel completely comfortable.", fullText: "Dr Ami is a fab dentist. She’s a natural with children making them feel comfortable of the whole process by talking to them. She has always the best in mind for her patients providing latest innovations. I am very happy with services provided at the clinic and the consultants attached to the clinic." },
        { name: "Niketha N.", stars: 5, jist: "Thank you, Dr. Ami, for taking such good care. The entire staff was friendly and caring. My smile is even brighter!", fullText: "Thank you, Dr. Ami for taking such good care of my dental procedures. The entire staff was friendly and caring. Reasonably priced and amazing work! Now my SMILE is even more brighter😁." },
        { name: "Rohan M.", stars: 5, jist: "Changed my perspective on dental visits. The clinic is so calming, and Dr. Ami's expertise is top-notch.", fullText: "I was always hesitant about dental visits, but Dr. Ami and her team completely changed my perspective. The clinic is so modern and calming, and Dr. Ami's expertise in cosmetic dentistry gave me the smile I only dreamed of. Highly recommend!" },
        { name: "Priya S.", stars: 5, jist: "Nurture Dental is the best! Dr. Ami is incredibly skilled and explains everything so clearly. My kids love it.", fullText: "Nurture Dental is the best! Dr. Ami is incredibly skilled and explains everything so clearly. My kids actually look forward to their appointments. The whole team is fantastic and makes you feel like family." },
        { name: "Sameer J.", stars: 5, jist: "From routine check-ups to complex procedures, Dr. Ami’s attention to detail is exceptional. A master of her craft.", fullText: "From routine check-ups to complex procedures, Dr. Ami’s attention to detail is exceptional. The clinic environment is very reassuring, and her team ensures you're comfortable throughout. Truly a master of her craft and I couldn't be happier with my results." }
    ];

    const reviewsGrid = document.getElementById('reviewsGrid');
    const modalOverlay = document.getElementById('review-modal-overlay');
    const modalCloseBtn = document.getElementById('review-modal-close');
    const modalReviewerName = document.getElementById('modal-reviewer-name');
    const modalReviewStars = document.getElementById('modal-review-stars');
    const modalReviewText = document.getElementById('modal-review-text');

    function renderStars(count) {
        let starHtml = '';
        for (let i = 0; i < count; i++) {
            starHtml += `<i class="fas fa-star"></i> `;
        }
        return starHtml;
    }

    if (reviewsGrid && modalOverlay) {
        const limit = parseInt(reviewsGrid.getAttribute('data-limit'), 10);
        const visibleReviews = limit > 0 ? reviewsData.slice(0, limit) : reviewsData;
        visibleReviews.forEach(review => {
            const itemSummary = document.createElement('div');
            itemSummary.classList.add('review-item-summary');
            itemSummary.setAttribute('data-aos', 'fade-up');
            itemSummary.innerHTML = `
                <div class="review-quote-icon"><i class="fas fa-quote-right"></i></div>
                <div class="review-header">
                    <span class="reviewer-name">${review.name}</span>
                    <div class="review-stars">${renderStars(review.stars)}</div>
                </div>
                <p class="review-jist">"${review.jist}"</p>
                <button class="read-full-story-btn">Read Full Story <i class="fas fa-arrow-right"></i></button>`;

            reviewsGrid.appendChild(itemSummary);

            itemSummary.querySelector('.read-full-story-btn').addEventListener('click', () => {
                modalReviewerName.textContent = review.name;
                modalReviewStars.innerHTML = renderStars(review.stars);
                modalReviewText.innerHTML = `<p>${review.fullText}</p>`;
                document.body.classList.add('modal-open');
                modalOverlay.classList.add('visible');
            });
        });
    }

    function closeModal() {
        document.body.classList.remove('modal-open');
        if (modalOverlay) modalOverlay.classList.remove('visible');
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeModal();
            }
        });
    }
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('visible')) {
            closeModal();
        }
    });

    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ── STATS (home page) ──
    const statItems = document.querySelectorAll('.stat-item');
    if (statItems.length) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    const num = entry.target.querySelector('.stat-number');
                    if (num && !num.dataset.counted) {
                        num.dataset.counted = 'true';
                        animateCounter(num);
                    }
                }
            });
        }, { threshold: 0.3 });

        statItems.forEach((el, i) => {
            el.style.transitionDelay = (i * 0.1) + 's';
            statObserver.observe(el);
        });
    }

    // ── FAQ ACCORDION (services page) ──
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ── SCROLL PROGRESS BAR ──
    const bar = document.getElementById('scroll-progress-bar');
    if (bar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width = pct + '%';
        }, { passive: true });
    }
});
