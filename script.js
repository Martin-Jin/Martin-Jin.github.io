/**
 * Martin Jin - Portfolio Script 2026
 */

document.addEventListener('DOMContentLoaded', () => {
    // Select the modal - now using a more robust selector in case of duplicates
    const modal = document.querySelector('.modal-overlay');

    // --- 1. COLLAPSIBLE YEAR LOGIC ---
    window.toggleYear = (yearId) => {
        const container = document.getElementById(yearId);
        if (!container) return;
        const icon = container.querySelector('.toggle-icon');
        const isCollapsed = container.classList.toggle('collapsed');
        if (icon) icon.innerText = isCollapsed ? "+" : "−";
    };

    // --- 2. NAVIGATION & SMOOTH SCROLL ---
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor || anchor.classList.contains('timeline-nav-item')) return;

        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const navOffset = 90;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            history.pushState(null, null, targetId);
        }
    });

    // --- 3. SCROLL REVEAL & NAV HIGHLIGHTING ---
    const revealElements = document.querySelectorAll('.reveal');
    const yearSections = document.querySelectorAll('.year-group');
    const navLinks = document.querySelectorAll('.nav-link');
    const timelineItems = document.querySelectorAll('.timeline-nav-item');

    const handleScroll = () => {
        let currentSection = "";
        let currentYear = "";

        revealElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
                el.classList.add('active');
            }
        });

        document.querySelectorAll('section').forEach(s => {
            if (window.scrollY >= s.offsetTop - 200) {
                currentSection = s.getAttribute('id');
            }
        });

        yearSections.forEach(ys => {
            const rect = ys.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2 && rect.bottom > 100) {
                currentYear = ys.getAttribute('id');
            }
        });

        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${currentSection}`));
        timelineItems.forEach(item => item.classList.toggle('active', item.getAttribute('href') === `#${currentYear}`));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- 4. MODAL LOGIC & BULLET POINTS ---
    const createList = (id, data) => {
        // Search globally for the ID to ensure we find the correct list
        const container = document.getElementById(id);
        if (!container) return;
        container.innerHTML = "";

        if (data && data.trim() !== "") {
            const items = data.split('|');
            items.forEach(item => {
                if (item.trim()) {
                    const li = document.createElement('li');
                    li.innerText = item.trim();
                    container.appendChild(li);
                }
            });
        }
    };

    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            if (!card) return;

            // Update Title
            const modalTitle = document.getElementById('modal-title');
            if (modalTitle) modalTitle.innerText = card.dataset.title;

            // Update Image
            const projectImg = card.dataset.image || 'images/default-project.jpg';
            const imgPlaceholder = document.querySelector('.image-placeholder');
            if (imgPlaceholder) {
                imgPlaceholder.innerHTML = `<img src="${projectImg}" alt="${card.dataset.title}" 
                    style="width:100%; height:100%; object-fit:cover; border-radius:12px; display:block;">`;
            }
            // Inside the btn.addEventListener('click', (e) => { ... }) block:

            // Update Stats Bar
            const modalHours = document.getElementById('modal-hours');
            const modalDate = document.getElementById('modal-date-display');
            const dateText = card.querySelector('.timeline-date').innerText;

            if (modalHours) modalHours.innerText = card.dataset.hours || "TBD";
            if (modalDate) modalDate.innerText = dateText;

            // Populate Content Lists (What/How/Why)
            createList('modal-what', card.dataset.what);
            createList('modal-how', card.dataset.how);
            createList('modal-why', card.dataset.why);

            // Skills Pills
            const skillsContainer = document.getElementById('modal-skills');
            if (skillsContainer) {
                skillsContainer.innerHTML = "";
                if (card.dataset.skills) {
                    card.dataset.skills.split(',').forEach(s => {
                        const span = document.createElement('span');
                        span.className = 'pill';
                        span.innerText = s.trim();
                        skillsContainer.appendChild(span);
                    });
                }
            }

            // Resource Link
            const resourceAction = document.getElementById('modal-resource-action');
            if (resourceAction) {
                if (card.dataset.resource) {
                    resourceAction.innerHTML = `
                        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
                            <a href="${card.dataset.resource}" target="_blank" class="link-btn accent-btn" style="text-decoration:none; display:inline-block;">Project files</a>
                        </div>`;
                } else {
                    resourceAction.innerHTML = "";
                }
            }

            if (modal) {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
    });

// --- 5. SEARCH & FILTERING & SORTING ---
    const searchInput = document.getElementById('projectSearch');
    const filterBtns = document.querySelectorAll('.filter-pill');
    const projectCards = document.querySelectorAll('.project-card');

    // 1. Map months to numerical values for sorting (May = 5, Jan = 1)
    const monthMap = { 
        "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6, 
        "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12 
    };

    const getMonthValue = (dateText) => {
        const text = dateText.toLowerCase();
        if (text.includes('current')) return 99; // Keep current at top

        // If range (e.g., "Mar - May"), split and take the last part
        const parts = text.split(/[-–—]/);
        const latestPart = parts[parts.length - 1].trim();

        // Find the month name in the string
        for (const [name, value] of Object.entries(monthMap)) {
            if (latestPart.includes(name)) return value;
        }
        return 0;
    };

    // 2. Automatically sort projects within each year group on load
    document.querySelectorAll('.year-group').forEach(yearGroup => {
        const container = yearGroup.querySelector('.year-content');
        if (!container) return;

        const cards = Array.from(container.querySelectorAll('.project-card'));

        cards.sort((a, b) => {
            const dateA = a.querySelector('.timeline-date').innerText;
            const dateB = b.querySelector('.timeline-date').innerText;
            return getMonthValue(dateB) - getMonthValue(dateA); // Descending order
        });

        // Re-append sorted cards to the container
        cards.forEach(card => container.appendChild(card));
    });

    // 3. Automatically sync data-skills from the visible UI pills for filtering
    projectCards.forEach(card => {
        const pills = card.querySelectorAll('.skill-pills .pill');
        const skillList = Array.from(pills).map(pill => pill.innerText.trim());
        card.dataset.skills = skillList.join(', ');
    });

    const filterProjects = () => {
        const term = (searchInput?.value || "").toLowerCase();
        const activeBtn = document.querySelector('.filter-pill.active');
        const activeFilter = activeBtn ? activeBtn.dataset.filter.toLowerCase() : 'all';

        projectCards.forEach(card => {
            const title = (card.dataset.title || "").toLowerCase();
            const skills = (card.dataset.skills || "").toLowerCase();
            const matchesSearch = title.includes(term) || skills.includes(term);
            const matchesFilter = activeFilter === 'all' || skills.includes(activeFilter);
            card.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
        });

        document.querySelectorAll('.year-group').forEach(yearGroup => {
            const visibleCards = yearGroup.querySelectorAll('.project-card[style="display: block;"]');
            yearGroup.style.display = (visibleCards.length === 0) ? 'none' : 'block';
        });
    };

    if (searchInput) searchInput.addEventListener('input', filterProjects);
    filterBtns.forEach(btn => btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterProjects();
    }));

    // --- 6. MODAL CLOSING ---
    const closeModal = () => {
        if (modal) modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    };

    document.querySelectorAll('.close-btn').forEach(btn => btn.onclick = closeModal);
    window.onclick = (e) => { if (e.target === modal) closeModal(); };
});