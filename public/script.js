// DOM Elements
const chatContainer = document.getElementById('chatContainer');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const fallbackNotice = document.getElementById('fallbackNotice');

// State
let isProcessing = false;

// Auto-resize textarea
messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 150) + 'px';
});

// Add message to chat
function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    const avatarSVG = isUser ? `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="12" cy="10" r="3" fill="currentColor"/>
            <path d="M 6 19 Q 6 15 12 15 Q 18 15 18 19" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    ` : `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 8 L12 12 L15 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
        </svg>
    `;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${avatarSVG}
        </div>
        <div class="message-content">
            <p>${escapeHtml(content)}</p>
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    
    // Smooth scroll to bottom
    setTimeout(() => {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    chatContainer.appendChild(errorDiv);
    
    setTimeout(() => {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Send message to API
async function sendMessage(message) {
    if (isProcessing || !message.trim()) return;
    
    isProcessing = true;
    sendButton.disabled = true;
    loadingIndicator.classList.add('active');
    
    // Add user message
    addMessage(message, true);
    
    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get response');
        }
        
        const data = await response.json();

        // Show/hide fallback notice
        if (data.usingFallback) {
            fallbackNotice.style.display = 'flex';
        } else {
            fallbackNotice.style.display = 'none';
        }

        // Add AI response
        if (data.response) {
            addMessage(data.response);
        } else {
            throw new Error('No response received from AI');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showError(`Error: ${error.message}`);
    } finally {
        isProcessing = false;
        sendButton.disabled = false;
        loadingIndicator.classList.remove('active');
        messageInput.focus();
    }
}

// Form submit handler
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        sendMessage(message);
    }
});

// Enter key to send (Shift+Enter for new line)
messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
});

// Theme Management
const themeDropdown = document.getElementById('themeDropdown');
const THEME_STORAGE_KEY = 'aura-therapy-theme';

// Load saved theme on page load
function loadSavedTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        themeDropdown.value = savedTheme;
    }
}

// Change theme
function changeTheme(theme) {
    if (theme === 'default') {
        document.body.removeAttribute('data-theme');
    } else {
        document.body.setAttribute('data-theme', theme);
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

// Theme dropdown change handler
themeDropdown.addEventListener('change', (e) => {
    changeTheme(e.target.value);
});

// Load theme and focus input on page load
window.addEventListener('load', () => {
    loadSavedTheme();
    messageInput.focus();
    initializeThemeAnimations();
});

// Theme Animations
const themeAnimationsContainer = document.getElementById('themeAnimations');
let animationInterval = null;

// SVG definitions for each theme element
const svgElements = {
    // Forest theme
    forestTree: `<svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="70" width="10" height="50" fill="#6d4c3d"/>
        <polygon points="40,10 20,40 60,40" fill="#2e7d32"/>
        <polygon points="40,30 25,55 55,55" fill="#388e3c"/>
        <polygon points="40,45 30,70 50,70" fill="#43a047"/>
    </svg>`,

    forestSquirrel: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="20" cy="25" rx="8" ry="10" fill="#8d6e63"/>
        <circle cx="20" cy="18" r="7" fill="#8d6e63"/>
        <circle cx="17" cy="16" r="2" fill="#333"/>
        <circle cx="23" cy="16" r="2" fill="#333"/>
        <path d="M 15 8 Q 10 5 8 10" stroke="#8d6e63" stroke-width="3" fill="none"/>
    </svg>`,

    forestBird: `<svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15" cy="15" rx="8" ry="5" fill="#1b5e20"/>
        <path d="M 7 15 Q 2 12 2 15 Q 2 18 7 15" fill="#2e7d32"/>
        <path d="M 23 15 Q 28 12 28 15 Q 28 18 23 15" fill="#2e7d32"/>
        <circle cx="12" cy="14" r="1.5" fill="#fff"/>
    </svg>`,

    // Ocean theme
    oceanKelp: `<svg viewBox="0 0 60 150" xmlns="http://www.w3.org/2000/svg">
        <path d="M 30 150 Q 20 120 25 90 Q 30 60 25 30 Q 20 10 30 0" stroke="#1565c0" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M 30 150 Q 40 120 35 90 Q 30 60 35 30 Q 40 10 30 0" stroke="#1976d2" stroke-width="6" fill="none" stroke-linecap="round"/>
    </svg>`,

    oceanFish: `<svg viewBox="0 0 50 30" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30" cy="15" rx="18" ry="10" fill="#1e88e5"/>
        <polygon points="10,15 2,8 2,22" fill="#1e88e5"/>
        <circle cx="38" cy="12" r="2" fill="#fff"/>
        <circle cx="38" cy="12" r="1" fill="#333"/>
        <path d="M 35 20 L 40 25 L 38 20" fill="#1565c0"/>
    </svg>`,

    oceanBubble: `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="8" fill="none" stroke="#64b5f6" stroke-width="2" opacity="0.6"/>
        <circle cx="7" cy="7" r="2" fill="#fff" opacity="0.8"/>
    </svg>`,

    // Spaceship theme
    spaceShootingStar: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="95" cy="5" r="3" fill="#fff"/>
        <line x1="0" y1="100" x2="95" y2="5" stroke="#fff" stroke-width="2" opacity="0.6"/>
    </svg>`,

    spacePlanet: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="25" fill="#9d8df1"/>
        <ellipse cx="30" cy="30" rx="35" ry="8" fill="none" stroke="#6b5ce7" stroke-width="2"/>
        <circle cx="20" cy="20" r="5" fill="#8b7ff5" opacity="0.5"/>
    </svg>`,

    // Unicorn theme
    unicornSparkle: `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <polygon points="10,0 12,8 20,10 12,12 10,20 8,12 0,10 8,8" fill="#f177b5"/>
        <polygon points="10,3 11,8 16,10 11,12 10,17 9,12 4,10 9,8" fill="#ffc9ea"/>
    </svg>`,

    unicornButterfly: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15" cy="20" rx="10" ry="12" fill="#e74c9c" opacity="0.8"/>
        <ellipse cx="25" cy="20" rx="10" ry="12" fill="#f177b5" opacity="0.8"/>
        <rect x="18" y="10" width="4" height="20" rx="2" fill="#bc3e82"/>
        <circle cx="14" cy="16" r="2" fill="#fff"/>
        <circle cx="26" cy="16" r="2" fill="#fff"/>
    </svg>`,

    unicornRainbow: `<svg viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 90 Q 75 20 140 90" stroke="#e74c9c" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M 15 90 Q 75 30 135 90" stroke="#f177b5" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M 20 90 Q 75 40 130 90" stroke="#ffc9ea" stroke-width="8" fill="none" stroke-linecap="round"/>
    </svg>`
};

// Create background elements for each theme
function createBackgroundElements(theme) {
    themeAnimationsContainer.innerHTML = '';

    if (theme === 'forest') {
        // Add 4 trees
        for (let i = 0; i < 4; i++) {
            const tree = document.createElement('div');
            tree.className = 'theme-element forest-tree';
            tree.innerHTML = svgElements.forestTree;
            themeAnimationsContainer.appendChild(tree);
        }
    } else if (theme === 'ocean') {
        // Add 4 kelp strands
        for (let i = 0; i < 4; i++) {
            const kelp = document.createElement('div');
            kelp.className = 'theme-element ocean-kelp';
            kelp.innerHTML = svgElements.oceanKelp;
            themeAnimationsContainer.appendChild(kelp);
        }
    } else if (theme === 'spaceship') {
        // Add scattered stars
        for (let i = 0; i < 30; i++) {
            const star = document.createElement('div');
            star.className = 'theme-element space-star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            themeAnimationsContainer.appendChild(star);
        }
    }
}

// Spawn occasional elements
function spawnOccasionalElement(theme) {
    if (theme === 'forest') {
        // Randomly spawn squirrel or bird
        const random = Math.random();
        if (random < 0.5) {
            // Spawn squirrel
            const squirrel = document.createElement('div');
            squirrel.className = 'theme-element forest-squirrel';
            squirrel.innerHTML = svgElements.forestSquirrel;
            squirrel.style.left = (Math.random() * 80 + 10) + '%';
            squirrel.style.bottom = '10px';
            themeAnimationsContainer.appendChild(squirrel);
            setTimeout(() => squirrel.remove(), 1000);
        } else {
            // Spawn bird
            const bird = document.createElement('div');
            bird.className = 'theme-element forest-bird';
            bird.innerHTML = svgElements.forestBird;
            bird.style.top = (Math.random() * 40 + 10) + '%';
            bird.style.left = '-50px';
            themeAnimationsContainer.appendChild(bird);
            setTimeout(() => bird.remove(), 6000);
        }
    } else if (theme === 'ocean') {
        // Randomly spawn fish or bubble
        const random = Math.random();
        if (random < 0.6) {
            // Spawn fish
            const fish = document.createElement('div');
            fish.className = 'theme-element ocean-fish';
            fish.innerHTML = svgElements.oceanFish;
            fish.style.top = (Math.random() * 60 + 20) + '%';
            fish.style.left = '-60px';
            themeAnimationsContainer.appendChild(fish);
            setTimeout(() => fish.remove(), 8000);
        } else {
            // Spawn bubble
            const bubble = document.createElement('div');
            bubble.className = 'theme-element ocean-bubble';
            bubble.innerHTML = svgElements.oceanBubble;
            bubble.style.left = (Math.random() * 90 + 5) + '%';
            bubble.style.bottom = '-30px';
            themeAnimationsContainer.appendChild(bubble);
            setTimeout(() => bubble.remove(), 6000);
        }
    } else if (theme === 'spaceship') {
        // Randomly spawn shooting star or planet
        const random = Math.random();
        if (random < 0.7) {
            // Spawn shooting star
            const shootingStar = document.createElement('div');
            shootingStar.className = 'theme-element space-shooting-star';
            shootingStar.innerHTML = svgElements.spaceShootingStar;
            shootingStar.style.left = (Math.random() * 50) + '%';
            shootingStar.style.top = (Math.random() * 50) + '%';
            themeAnimationsContainer.appendChild(shootingStar);
            setTimeout(() => shootingStar.remove(), 2000);
        } else {
            // Spawn planet
            const planet = document.createElement('div');
            planet.className = 'theme-element space-planet';
            planet.innerHTML = svgElements.spacePlanet;
            planet.style.left = (Math.random() * 80 + 10) + '%';
            planet.style.top = (Math.random() * 80 + 10) + '%';
            themeAnimationsContainer.appendChild(planet);
            setTimeout(() => planet.remove(), 15000);
        }
    } else if (theme === 'unicorn') {
        // Randomly spawn sparkle, butterfly, or rainbow
        const random = Math.random();
        if (random < 0.5) {
            // Spawn sparkle
            const sparkle = document.createElement('div');
            sparkle.className = 'theme-element unicorn-sparkle';
            sparkle.innerHTML = svgElements.unicornSparkle;
            sparkle.style.left = (Math.random() * 90 + 5) + '%';
            sparkle.style.top = (Math.random() * 90 + 5) + '%';
            themeAnimationsContainer.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 2000);
        } else if (random < 0.8) {
            // Spawn butterfly
            const butterfly = document.createElement('div');
            butterfly.className = 'theme-element unicorn-butterfly';
            butterfly.innerHTML = svgElements.unicornButterfly;
            butterfly.style.left = (Math.random() * 80 + 10) + '%';
            butterfly.style.bottom = '-50px';
            themeAnimationsContainer.appendChild(butterfly);
            setTimeout(() => butterfly.remove(), 8000);
        } else {
            // Spawn rainbow
            const rainbow = document.createElement('div');
            rainbow.className = 'theme-element unicorn-rainbow';
            rainbow.innerHTML = svgElements.unicornRainbow;
            rainbow.style.left = (Math.random() * 40 + 30) + '%';
            rainbow.style.top = (Math.random() * 40 + 20) + '%';
            themeAnimationsContainer.appendChild(rainbow);
            setTimeout(() => rainbow.remove(), 3000);
        }
    }
}

// Initialize theme animations
function initializeThemeAnimations() {
    const currentTheme = document.body.getAttribute('data-theme') || 'default';

    // Create background elements
    createBackgroundElements(currentTheme);

    // Clear existing interval
    if (animationInterval) {
        clearInterval(animationInterval);
    }

    // Set up interval for occasional elements (5-8 seconds)
    if (currentTheme !== 'default') {
        animationInterval = setInterval(() => {
            const delay = Math.random() * 3000 + 5000; // 5-8 seconds
            setTimeout(() => spawnOccasionalElement(currentTheme), delay);
        }, 8000);

        // Spawn first element after a short delay
        setTimeout(() => spawnOccasionalElement(currentTheme), 2000);
    }
}

// Update theme change handler to reinitialize animations
const originalChangeTheme = changeTheme;
changeTheme = function(theme) {
    originalChangeTheme(theme);
    initializeThemeAnimations();
};
