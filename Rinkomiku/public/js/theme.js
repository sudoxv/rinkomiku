document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/theme', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const html = document.documentElement;
                    
                    if (data.theme === 'dark') {
                        html.classList.remove('light');
                        html.classList.add('dark');
                    } else {
                        html.classList.remove('dark');
                        html.classList.add('light');
                    }
                    
                    // Update theme toggle icons
                    updateThemeIcons(data.theme);
                }
            } catch (error) {
                console.error('Theme toggle error:', error);
            }
        });
    }
    
    function updateThemeIcons(theme) {
        const sunIcon = document.querySelector('.fa-sun');
        const moonIcon = document.querySelector('.fa-moon');
        
        if (sunIcon && moonIcon) {
            if (theme === 'dark') {
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            } else {
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            }
        }
    }
    
    // Set initial theme based on cookie
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        updateThemeIcons('dark');
    } else {
        updateThemeIcons('light');
    }
});