// DOM Elements
const chatContainer = document.getElementById('chatContainer');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const loadingIndicator = document.getElementById('loadingIndicator');

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

// Focus input on load
window.addEventListener('load', () => {
    messageInput.focus();
});
