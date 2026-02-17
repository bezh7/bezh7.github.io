(function() {
    // Elements
    const deskItems = document.querySelectorAll('.desk-item');
    const overlay = document.querySelector('.overlay');
    const modals = document.querySelectorAll('.modal');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const deskPhoto = document.querySelector('.desk-photo');
    const deskScene = document.querySelector('.desk-scene');
    const landing = document.getElementById('landing');
    const enterBtn = document.getElementById('enter-btn');
    const dustContainer = document.getElementById('dust-container');

    // ==================== LANDING SCREEN ====================
    function enterWorkspace() {
        if (landing.classList.contains('hidden')) return;

        landing.classList.add('hidden');

        // Activate desk scene animations after landing fades
        setTimeout(() => {
            deskScene.classList.add('active');
            createDustParticles();

            // On mobile, scroll to center of the image after layout settles
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    const scrollWidth = document.body.scrollWidth - window.innerWidth;
                    if (scrollWidth > 0) {
                        window.scrollTo({
                            left: scrollWidth / 2,
                            top: 0,
                            behavior: 'instant'
                        });
                    }
                }, 100);
            }

            // Enable interactions after entrance animations complete
            setTimeout(() => {
                deskScene.classList.add('interactive');
            }, 1000); // Wait for all items to settle (0.4s delay + 0.8s animation)
        }, 400);
    }

    // Enter on button click
    if (enterBtn) {
        enterBtn.addEventListener('click', enterWorkspace);
    }

    // Enter on Enter key or Space
    document.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !landing.classList.contains('hidden')) {
            e.preventDefault();
            enterWorkspace();
        }
    });

    // ==================== DUST PARTICLES ====================
    function createDustParticles() {
        const particleCount = 15;

        for (let i = 0; i < particleCount; i++) {
            createDust(i * 800); // Stagger creation
        }
    }

    function createDust(delay) {
        setTimeout(() => {
            const dust = document.createElement('div');
            dust.className = 'dust';

            // Position in the lamp light area (right side of screen)
            const startX = 60 + Math.random() * 30; // 60-90% from left
            const startY = 100 + Math.random() * 20; // Start below viewport

            dust.style.left = startX + '%';
            dust.style.top = startY + '%';
            dust.style.width = (2 + Math.random() * 2) + 'px';
            dust.style.height = dust.style.width;
            dust.style.animationDuration = (15 + Math.random() * 10) + 's';
            dust.style.opacity = 0.2 + Math.random() * 0.4;

            dustContainer.appendChild(dust);

            // Remove and recreate after animation
            const duration = parseFloat(dust.style.animationDuration) * 1000;
            setTimeout(() => {
                dust.remove();
                createDust(0);
            }, duration);
        }, delay);
    }

    // ==================== GENTLE FLOATING ANIMATION ====================
    // Each item floats gently on its own rhythm
    const floatAmplitudes = {
        laptop: { x: 3, y: 5 },
        headphones: { x: 4, y: 6 },
        notebook: { x: 3, y: 4 },
        jar: { x: 4, y: 5 }
    };
    const floatSpeeds = {
        laptop: { x: 0.0012, y: 0.001 },
        headphones: { x: 0.0011, y: 0.0013 },
        notebook: { x: 0.0009, y: 0.0011 },
        jar: { x: 0.0013, y: 0.0012 }
    };

    let floatEnabled = false;

    function animateFloat(timestamp) {
        if (floatEnabled) {
            deskItems.forEach(item => {
                const type = item.classList[1];
                const amp = floatAmplitudes[type] || { x: 2, y: 3 };
                const speed = floatSpeeds[type] || { x: 0.0007, y: 0.0008 };

                // Use sine waves with different phases for organic movement
                const floatX = Math.sin(timestamp * speed.x) * amp.x;
                const floatY = Math.sin(timestamp * speed.y + 1000) * amp.y;

                item.style.setProperty('--float-x', floatX + 'px');
                item.style.setProperty('--float-y', floatY + 'px');
            });
        }
        requestAnimationFrame(animateFloat);
    }
    requestAnimationFrame(animateFloat);

    // Enable floating after entrance animation
    const enableFloatAfterEntrance = () => {
        if (deskScene.classList.contains('interactive')) {
            floatEnabled = true;
        } else {
            setTimeout(enableFloatAfterEntrance, 100);
        }
    };
    enableFloatAfterEntrance();

    // ==================== PROXIMITY REACTION ====================
    // Items subtly move away from cursor when it gets close
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateProximity() {
            if (floatEnabled) {
                deskItems.forEach(item => {
                    const rect = item.getBoundingClientRect();
                    const itemCenterX = rect.left + rect.width / 2;
                    const itemCenterY = rect.top + rect.height / 2;

                    // Calculate distance from cursor to item center
                    const dx = mouseX - itemCenterX;
                    const dy = mouseY - itemCenterY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Only react within a certain range (250px)
                    const maxDistance = 250;
                    if (distance < maxDistance) {
                        // Push away from cursor (inverse relationship)
                        const force = (1 - distance / maxDistance) * 15; // max 15px push
                        const pushX = -(dx / distance) * force;
                        const pushY = -(dy / distance) * force;

                        item.style.setProperty('--push-x', pushX + 'px');
                        item.style.setProperty('--push-y', pushY + 'px');
                    } else {
                        item.style.setProperty('--push-x', '0px');
                        item.style.setProperty('--push-y', '0px');
                    }
                });
            }
            requestAnimationFrame(animateProximity);
        }
        requestAnimationFrame(animateProximity);
    }

    // Item positions (as percentages of the image)
    const itemPositions = {
        laptop: { top: 38.5, left: 30.5, width: 38, height: 47 },
        headphones: { top: 17, left: 12, width: 10, height: 21 },
        notebook: { top: 72, left: 75.5, width: 23, height: 12 },
        jar: { top: 55, left: 12.5, width: 6, height: 19 }
    };


    // Calculate visible image bounds with object-fit: cover
    function getImageBounds() {
        const containerWidth = deskScene.offsetWidth;
        const containerHeight = deskScene.offsetHeight;
        const imgRatio = 1536 / 1024; // 3:2 ratio
        const containerRatio = containerWidth / containerHeight;

        let visibleWidth, visibleHeight, offsetX, offsetY;

        if (containerRatio > imgRatio) {
            // Container is wider - image is cropped top/bottom
            visibleWidth = containerWidth;
            visibleHeight = containerWidth / imgRatio;
            offsetX = 0;
            offsetY = (containerHeight - visibleHeight) / 2;
        } else {
            // Container is taller - image is cropped left/right
            visibleHeight = containerHeight;
            visibleWidth = containerHeight * imgRatio;
            offsetX = (containerWidth - visibleWidth) / 2;
            offsetY = 0;
        }

        return { visibleWidth, visibleHeight, offsetX, offsetY };
    }

    // Update desk item positions based on image bounds
    function updateItemPositions() {
        const bounds = getImageBounds();

        deskItems.forEach(item => {
            const type = item.classList[1]; // laptop, headphones, notebook, jar
            const pos = itemPositions[type];
            if (!pos) return;

            const left = bounds.offsetX + (pos.left / 100) * bounds.visibleWidth;
            const top = bounds.offsetY + (pos.top / 100) * bounds.visibleHeight;
            const width = (pos.width / 100) * bounds.visibleWidth;
            const height = (pos.height / 100) * bounds.visibleHeight;

            item.style.left = left + 'px';
            item.style.top = top + 'px';
            item.style.width = width + 'px';
            item.style.height = height + 'px';
        });

    }

    // Update positions on load and resize
    updateItemPositions();
    window.addEventListener('resize', updateItemPositions);

    // Live clock (info panel)
    const panelClockEl = document.getElementById('panel-clock');
    if (panelClockEl) {
        function updatePanelClock() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            panelClockEl.textContent = `${hours}:${minutes}:${seconds}`;
        }
        updatePanelClock();
        setInterval(updatePanelClock, 1000);
    }

    // Rotating status messages
    const statusEl = document.getElementById('info-status');
    const statusMessages = [
        'probably coding...',
        'drinking monster...',
        'debugging something...',
        'pushing to main...',
        'skipping class...',
        'in a meeting...',
        'touching grass...'
    ];
    let statusIndex = 0;

    if (statusEl) {
        setInterval(() => {
            statusEl.style.opacity = '0';
            setTimeout(() => {
                statusIndex = (statusIndex + 1) % statusMessages.length;
                statusEl.textContent = statusMessages[statusIndex];
                statusEl.style.opacity = '1';
            }, 300);
        }, 6000);
    }

    // Discovery counter / Easter egg tracking
    const discoveryCounter = document.getElementById('discovery-counter');
    const discoveryCountEl = document.getElementById('discovery-count');
    const discoveredItems = new Set();

    function updateDiscovery(itemType) {
        if (discoveredItems.has(itemType)) return;

        discoveredItems.add(itemType);
        const count = discoveredItems.size;

        // Update count
        discoveryCountEl.textContent = count;

        // Celebrate completion
        if (count === 4) {
            discoveryCounter.classList.add('complete');
        }
    }

    // Age tracker
    const ageEl = document.getElementById('age');
    if (ageEl) {
        const birthday = new Date(2007, 9, 22); // October 22, 2007

        function updateAge() {
            const now = new Date();
            const diff = now - birthday;
            const years = diff / (1000 * 60 * 60 * 24 * 365.25);
            ageEl.textContent = years.toFixed(8);
        }

        updateAge();
        setInterval(updateAge, 50);
    }

    // Fun facts for the jar
    const funFacts = [
        "My most productive hours are between midnight and 4am",
        "Bang Bang Niners Gang!",
        "I once landed on my neck trying a backflip in front of my gym class",
        "I carry three pairs of earbuds at all times",
        "At age 8, I spent all my savings to buy 1 share of Tesla"
    ];
    let currentFactIndex = 0;

    // Hover interactions - show overlay on hover
    deskItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Show overlay
            overlay.classList.add('active');
        });

        item.addEventListener('mouseleave', () => {
            // Hide overlay
            overlay.classList.remove('active');
        });

        // Click to open modal
        item.addEventListener('click', () => {
            const modalId = item.dataset.modal;
            if (modalId) {
                overlay.classList.remove('active');
                openModal(modalId);

                // Track discovery for easter egg
                const itemType = item.classList[1]; // laptop, headphones, notebook, jar
                updateDiscovery(itemType);
            }
        });
    });

    // Modal functions
    function openModal(modalId) {
        const modal = document.getElementById('modal-' + modalId);
        if (modal) {
            // Hide overlay
            overlay.classList.remove('active');

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function closeAllModals() {
        modals.forEach(modal => closeModal(modal));
    }

    // Close modal on X button click
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal on overlay/outside click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Fun facts cycling
    const funFactEl = document.getElementById('fun-fact');
    const nextFactBtn = document.getElementById('next-fact');

    if (nextFactBtn && funFactEl) {
        // Show first fact when modal opens
        const jarModal = document.getElementById('modal-jar');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.classList.contains('active')) {
                    funFactEl.textContent = funFacts[currentFactIndex];
                }
            });
        });
        observer.observe(jarModal, { attributes: true, attributeFilter: ['class'] });

        // Cycle to next fact
        nextFactBtn.addEventListener('click', () => {
            currentFactIndex = (currentFactIndex + 1) % funFacts.length;
            funFactEl.style.opacity = '0';
            setTimeout(() => {
                funFactEl.textContent = funFacts[currentFactIndex];
                funFactEl.style.opacity = '1';
            }, 150);
        });

        // Add transition to fun fact
        funFactEl.style.transition = 'opacity 0.15s ease';
    }

    // Now Playing - fetch from Spotify API
    const nowPlayingEl = document.getElementById('now-playing');
    const shuffleBtn = document.getElementById('shuffle-track');

    if (nowPlayingEl) {
        let topTracks = [];
        let currentTrackIndex = 0;

        function displayTrack(track) {
            nowPlayingEl.innerHTML = `
                <a href="${track.songUrl}" target="_blank" style="display: contents; text-decoration: none; color: inherit;">
                    <img src="${track.albumArt}" alt="${track.album}" class="now-playing-art">
                    <div class="now-playing-info">
                        <div class="now-playing-title">${track.title}</div>
                        <div class="now-playing-artist">${track.artist}</div>
                        <div class="now-playing-status">On repeat lately</div>
                    </div>
                </a>
            `;
        }

        async function fetchTopTracks() {
            try {
                const response = await fetch('https://spotify-api-blue.vercel.app/api/now-playing');
                const data = await response.json();

                if (data.tracks && data.tracks.length > 0) {
                    topTracks = data.tracks;
                    currentTrackIndex = 0;
                    displayTrack(topTracks[0]);
                } else {
                    nowPlayingEl.innerHTML = '<div class="now-playing-none">No tracks found</div>';
                }
            } catch (error) {
                console.error('Failed to fetch top tracks:', error);
                nowPlayingEl.innerHTML = '<div class="now-playing-none">Could not load music</div>';
            }
        }

        function nextTrack() {
            if (topTracks.length === 0) return;

            // Fade out
            nowPlayingEl.style.opacity = '0.5';

            setTimeout(() => {
                currentTrackIndex = (currentTrackIndex + 1) % topTracks.length;
                displayTrack(topTracks[currentTrackIndex]);
                nowPlayingEl.style.opacity = '1';
            }, 150);
        }

        // Add transition for smooth fade
        nowPlayingEl.style.transition = 'opacity 0.15s ease';

        // Fetch on page load
        fetchTopTracks();

        // Next button click
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', nextTrack);
        }
    }

    // Projects expand/collapse
    const toggleProjectsBtn = document.getElementById('toggle-projects');
    const projectsExpanded = document.getElementById('projects-expanded');

    if (toggleProjectsBtn && projectsExpanded) {
        toggleProjectsBtn.addEventListener('click', () => {
            const isExpanded = projectsExpanded.classList.contains('expanded');
            if (isExpanded) {
                projectsExpanded.style.maxHeight = '0';
                projectsExpanded.classList.remove('expanded');
                toggleProjectsBtn.textContent = 'see more →';
            } else {
                projectsExpanded.style.maxHeight = projectsExpanded.scrollHeight + 'px';
                projectsExpanded.classList.add('expanded');
                toggleProjectsBtn.textContent = 'show less →';
            }
        });
    }

    // Blob cursor
    const blob = document.querySelector('.blob-cursor');

    if (blob && !isTouchDevice) {
        let mouseX = 0;
        let mouseY = 0;
        let blobX = 0;
        let blobY = 0;

        document.body.classList.add('blob-active');

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            blob.classList.add('active');
        });

        document.addEventListener('mouseleave', () => {
            blob.classList.remove('active');
        });

        document.addEventListener('mouseenter', () => {
            blob.classList.add('active');
        });

        // Smooth follow animation
        function animateBlob() {
            blobX += (mouseX - blobX) * 0.3;
            blobY += (mouseY - blobY) * 0.3;
            blob.style.left = blobX + 'px';
            blob.style.top = blobY + 'px';
            requestAnimationFrame(animateBlob);
        }
        animateBlob();

        // Grow on hover over clickable elements
        const clickables = document.querySelectorAll('.desk-item, .modal-close, .fact-button, .cta-button, .project-list a, .modal-links a, .landing-enter, .see-more, .shuffle-button, .spotify-profile-link, .now-playing a, #toggle-projects');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => blob.classList.add('hover'));
            el.addEventListener('mouseleave', () => blob.classList.remove('hover'));
        });

        // Squish on click
        document.addEventListener('mousedown', () => {
            blob.classList.add('click');
        });
        document.addEventListener('mouseup', () => {
            blob.classList.remove('click');
        });

    }

    // Touch device detection - convert hover to tap
    if (isTouchDevice) {
        deskItems.forEach(item => {
            item.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const modalId = item.dataset.modal;
                if (modalId) {
                    openModal(modalId);
                }
            });
        });
    }
})();
