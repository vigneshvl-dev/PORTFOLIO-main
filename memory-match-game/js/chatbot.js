document.addEventListener('DOMContentLoaded', () => {
    const chatbotWidget = document.getElementById('chatbot-widget');
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const typingIndicator = document.getElementById('typing-indicator');
    const clearBtn = document.getElementById('chatbot-clear-btn');

    // Create session storage key
    const STORAGE_KEY = 'viky_chat_history';

    // Clear Chat Logic
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Clear chat history?')) {
                sessionStorage.removeItem(STORAGE_KEY);
                location.reload();
            }
        });
    }

    // Auto-open logic
    const hasBeenOpened = sessionStorage.getItem('viky_chat_opened');
    if (!hasBeenOpened) {
        setTimeout(() => {
            if (!chatbotWidget.classList.contains('active')) {
                chatbotWidget.classList.add('active');
                sessionStorage.setItem('viky_chat_opened', 'true');
            }
        }, 8000); // Open after 8 seconds on first visit
    }

    // Toggle Chat Window
    chatbotButton.addEventListener('click', () => {
        chatbotWidget.classList.toggle('active');
        if (chatbotWidget.classList.contains('active')) {
            chatbotInput.focus();
            sessionStorage.setItem('viky_chat_opened', 'true');
        }
    });

    // Load Chat History
    const loadHistory = () => {
        const history = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
        if (history.length > 0) {
            chatbotMessages.innerHTML = ''; // Clear default greeting
            history.forEach(msg => addMessage(msg.text, msg.sender, false));
        }
        showQuickReplies();
    };

    // Handle Sending Messages
    const sendMessage = (textOverride = null) => {
        const text = textOverride || chatbotInput.value.trim();
        if (!text) return;

        // Add user message
        addMessage(text, 'user');
        if (!textOverride) chatbotInput.value = '';

        // Bot thinking
        showTyping(true);

        setTimeout(() => {
            const response = getBotResponse(text);
            showTyping(false);
            addMessage(response, 'bot');
            showQuickReplies();
        }, 1000 + Math.random() * 800);
    };

    chatbotSend.addEventListener('click', () => sendMessage());
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    const addMessage = (text, sender, save = true) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerHTML = text;

        // Remove old quick replies before adding new message
        const oldReplies = chatbotMessages.querySelector('.quick-replies');
        if (oldReplies) oldReplies.remove();

        chatbotMessages.appendChild(msgDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        if (save) {
            const history = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
            history.push({ text, sender });
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        }
    };

    const showTyping = (show) => {
        typingIndicator.style.display = show ? 'flex' : 'none';
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    const showQuickReplies = () => {
        const replies = [
            { text: "🚀 Show Projects", val: "projects" },
            { text: "👨‍💻 About Vignesh", val: "about" },
            { text: "📧 Contact Meta", val: "contact" }
        ];

        const container = document.createElement('div');
        container.className = 'quick-replies';

        replies.forEach(reply => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply-btn';
            btn.innerText = reply.text;
            btn.onclick = () => sendMessage(reply.val);
            container.appendChild(btn);
        });

        chatbotMessages.appendChild(container);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    };

    const getBotResponse = (input) => {
        const query = input.toLowerCase();

        if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
            return "Hello! I'm <b>Viky AI</b>. How can I help you explore Vignesh's work today? 👋";
        }
        if (query.includes('who is vignesh') || query.includes('about the developer')) {
            return "Vignesh is a passionate Computer Science student at Stella Mary's College of Engineering. He loves building modern web apps and interactive games! 👨‍💻";
        }
        if (query.includes('who are you') || query.includes('what are you')) {
            return "I am <b>Viky AI</b>, a smart portfolio assistant. I was designed to help you explore Vignesh's projects and skills! 🤖";
        }
        if (query.includes('python')) {
            return "<b>Python</b> is a versatile, high-level programming language that Vignesh uses for AI, Automation, and Web Development. It's one of his core strengths! 🐍";
        }
        if (query.includes('game') || query.includes('projects')) {
            return `Here are some of Vignesh's top projects:
                <div class="chat-project-list">
                    <div class="chat-project-item">
                        <b>🎮 Brick Breaker</b> - Classic arcade fun.
                        <a href="brick-breaker.html" class="chat-link">Play Now</a>
                    </div>
                    <div class="chat-project-item">
                        <b>🧩 Memory Match</b> - Test your brain!
                        <a href="match.html" class="chat-link">Play Now</a>
                    </div>
                    <div class="chat-project-item">
                        <b>☁️ Server Monitor</b> - DevOps style dashboard.
                        <a href="https://github.com/vigneshvl-dev/PORTFOLIO" class="chat-link">View Code</a>
                    </div>
                </div>`;
        }
        if (query.includes('devops') || query.includes('server') || query.includes('monitoring')) {
            return "Vignesh has a cool <b>Server Monitoring Dashboard</b> project! It uses Python and Flask to monitor CPU and RAM in real-time. It's perfect for DevOps learning! ☁️";
        }
        if (query.includes('contact') || query.includes('email') || query.includes('reach')) {
            return "You can reach Vignesh at <a href='mailto:vigneshvelappan73051@gmail.com' class='chat-link'>vigneshvelappan73051@gmail.com</a>. He's always open to new opportunities!";
        }
        if (query.includes('skill') || query.includes('tech')) {
            return "He's skilled in <b>HTML5, CSS3, JavaScript,</b> and <b>Python</b>. He also has a great eye for <b>UI/UX Design</b>!";
        }
        if (query.includes('twitter') || query.includes('x')) {
            return "Follow him on X: <a href='https://x.com/vikyvelappan' target='_blank' class='chat-link'>@vikyvelappan</a>";
        }
        if (query.includes('clear') || query.includes('reset')) {
            sessionStorage.removeItem(STORAGE_KEY);
            location.reload();
            return "Clearing chat...";
        }

        return "I'm not quite sure about that yet. Try asking about his <b>projects</b>, <b>skills</b>, or <b>contact info</b>!";
    };

    loadHistory();
});
