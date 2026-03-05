(function() {
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

    // Projects expand/collapse
    const toggleProjectsBtn = document.getElementById('toggle-projects');
    const projectsExpanded = document.getElementById('projects-expanded');

    if (toggleProjectsBtn && projectsExpanded) {
        toggleProjectsBtn.addEventListener('click', () => {
            const isExpanded = projectsExpanded.classList.contains('expanded');
            if (isExpanded) {
                projectsExpanded.style.maxHeight = '0';
                projectsExpanded.classList.remove('expanded');
                toggleProjectsBtn.textContent = 'see more \u2192';
            } else {
                projectsExpanded.style.maxHeight = projectsExpanded.scrollHeight + 'px';
                projectsExpanded.classList.add('expanded');
                toggleProjectsBtn.textContent = 'show less \u2192';
            }
        });
    }
})();
