// Sample movie data (in a real app, this would come from TheMovieDB API)
const sampleMovies = [
    {
        id: 1,
        title: "Dune: Part Two",
        genres: ["Sci-Fi", "Adventure"],
        interestedUsers: ["Sarah", "Mike", "Priya"],
        poster: "https://tse2.mm.bing.net/th/id/OIP.FpbWAqLC9M59KX5maNfK8wHaKE?pid=Api&P=0&h=220"
    },
    {
        id: 2,
        title: "Oppenheimer",
        genres: ["Drama", "History"],
        interestedUsers: ["Alex", "Ravi"],
        poster: "⚛️"
    },
    {
        id: 3,
        title: "Spider-Man: No Way Home",
        genres: ["Action", "Adventure"],
        interestedUsers: ["Emma", "John", "Aditi", "Karan"],
        poster: "🕷️"
    },
    {
        id: 4,
        title: "The Batman",
        genres: ["Action", "Crime"],
        interestedUsers: ["Lisa", "Tom"],
        poster: "🦇"
    },
    {
        id: 5,
        title: "Top Gun: Maverick",
        genres: ["Action", "Drama"],
        interestedUsers: ["Sam", "Nina", "Rohit"],
        poster: "✈️"
    },
    {
        id: 6,
        title: "Everything Everywhere All at Once",
        genres: ["Comedy", "Sci-Fi"],
        interestedUsers: ["Maya", "David"],
        poster: "🌀"
    }
];

const sampleMatches = [
    {
        name: "Sarah Mitchell",
        avatar: "S",
        movie: "Dune: Part Two",
        distance: "2.5 km away"
    },
    {
        name: "Ravi Sharma",
        avatar: "R",
        movie: "Oppenheimer",
        distance: "1.8 km away"
    },
    {
        name: "Emma Watson",
        avatar: "E",
        movie: "Spider-Man: No Way Home",
        distance: "3.2 km away"
    },
    {
        name: "Aditi Patel",
        avatar: "A",
        movie: "Spider-Man: No Way Home",
        distance: "0.9 km away"
    }
];

// Chat conversations data
const chatConversations = {
    "Sarah Mitchell": {
        movie: "Dune: Part Two",
        avatar: "S",
        messages: [
            { sender: "Sarah Mitchell", content: "Hey! I see you're interested in Dune too! Want to watch it together this weekend?", timestamp: "2 min ago" },
            { sender: "You", content: "Absolutely! I've been waiting to watch it. Saturday evening works for me!", timestamp: "1 min ago" },
            { sender: "Sarah Mitchell", content: "Perfect! There's a great theater in Koregaon Park. Should we meet there at 7 PM?", timestamp: "Just now" }
        ]
    },
    "Ravi Sharma": {
        movie: "Oppenheimer",
        avatar: "R",
        messages: [
            { sender: "Ravi Sharma", content: "Hi there! I noticed you liked Oppenheimer. I'm planning to watch it this Friday.", timestamp: "5 min ago" },
            { sender: "You", content: "That's awesome! I've heard amazing things about it. Which theater?", timestamp: "3 min ago" },
            { sender: "Ravi Sharma", content: "PVR Phoenix Mall has IMAX. The experience would be incredible! Are you free around 8 PM?", timestamp: "2 min ago" },
            { sender: "You", content: "IMAX sounds perfect! Count me in 🎬", timestamp: "30 sec ago" }
        ]
    },
    "Aditi Patel": {
        movie: "Spider-Man: No Way Home",
        avatar: "A",
        messages: [
            { sender: "Aditi Patel", content: "OMG! Another Spider-Man fan! 🕷️ Have you seen the latest one yet?", timestamp: "10 min ago" },
            { sender: "You", content: "Not yet! I've been dying to watch it though. The reviews are incredible!", timestamp: "8 min ago" },
            { sender: "Aditi Patel", content: "Same here! Want to go together? I know a great place in Camp area.", timestamp: "6 min ago" },
            { sender: "You", content: "That sounds perfect! When works for you?", timestamp: "4 min ago" },
            { sender: "Aditi Patel", content: "How about Sunday afternoon? We could grab some food before the movie too! 🍿", timestamp: "1 min ago" }
        ]
    }
};

let currentUser = {
    name: "Alex Kumar",
    email: "alex.kumar@example.com",
    city: "newyork",
    location: "New York",
    popcornPoints: 120,
    moviesWatched: 0,
    friends: 0,
    interestedMovies: new Set()
};

let currentChatUser = null;

// Authentication
function signIn(method) {
    showToast(`Signing in with ${method}...`, 'success');
    setTimeout(() => {
        document.getElementById('landingPage').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        loadMovies();
        loadMatches();
        loadChatList();
        loadDrawerChatList();
    }, 1500);
}

// Load movies
function loadMovies() {
    const movieGrid = document.getElementById('movieGrid');
    movieGrid.innerHTML = '<div class="loading"></div>';
    
    setTimeout(() => {
        movieGrid.innerHTML = '';
        sampleMovies.forEach(movie => {
            const movieCard = createMovieCard(movie);
            movieGrid.appendChild(movieCard);
        });
    }, 1000);
}

// Create movie card
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.onclick = () => showMovieDetail(movie);

    const isInterested = currentUser.interestedMovies.has(movie.id);
    
    card.innerHTML = `
        <div class="movie-poster">${movie.poster}</div>
        <div class="movie-info">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-genres">
                ${movie.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
            </div>
            <div class="movie-actions">
                <button class="interested-btn ${isInterested ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleInterest(${movie.id})">
                    ${isInterested ? '✓ Interested' : '+ Interested'}
                </button>
                <div class="interested-avatars">
                    ${movie.interestedUsers.slice(0, 3).map((user, index) => 
                        `<div class="mini-avatar" title="${user}">${user[0]}</div>`
                    ).join('')}
                    ${movie.interestedUsers.length > 3 ? 
                        `<div class="mini-avatar">+${movie.interestedUsers.length - 3}</div>` : ''
                    }
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Toggle interest in movie
function toggleInterest(movieId) {
    const movie = sampleMovies.find(m => m.id === movieId);
    if (!movie) return;

    if (currentUser.interestedMovies.has(movieId)) {
        currentUser.interestedMovies.delete(movieId);
        movie.interestedUsers = movie.interestedUsers.filter(user => user !== currentUser.name.split(' ')[0]);
        showToast('Removed from interested list', 'error');
    } else {
        currentUser.interestedMovies.add(movieId);
        movie.interestedUsers.push(currentUser.name.split(' ')[0]);
        currentUser.popcornPoints += 10;
        // Simulate watching a movie occasionally
        if (Math.random() > 0.7) {
            currentUser.moviesWatched += 1;
            showToast('Movie added to watchlist! +10 🍿', 'success');
        } else {
            showToast('Added to interested list! +10 🍿', 'success');
        }
        updatePopcornPoints();
    }
    
    loadMovies();
}

// Show movie detail modal
function showMovieDetail(movie) {
    // Create a temporary modal for movie details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">${movie.title}</h2>
                <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            
            <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                <div style="font-size: 4rem;">${movie.poster}</div>
                <div style="flex: 1;">
                    <div class="movie-genres" style="margin-bottom: 10px;">
                        ${movie.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                    </div>
                    <p style="color: #ccc; line-height: 1.5;">
                        This is a placeholder synopsis. In a real app, this would be fetched from TheMovieDB API with full movie details, cast, ratings, and reviews.
                    </p>
                </div>
            </div>

            <div>
                <h3 style="color: #FFD700; margin-bottom: 15px;">
                    👥 ${movie.interestedUsers.length} people interested
                </h3>
                <div style="display: grid; gap: 10px;">
                    ${movie.interestedUsers.map(user => `
                        <div class="match-item">
                            <div class="match-avatar">${user[0]}</div>
                            <div class="match-info">
                                <div class="match-name">${user}</div>
                                <div class="match-movie">Available this weekend</div>
                            </div>
                            <div class="match-actions">
                                <button class="action-btn" onclick="addFriend('${user}')" title="Add Friend">
                                    <i class="fas fa-user-plus"></i>
                                </button>
                                <button class="action-btn" onclick="openChat('${user}', '${movie.title}')" title="Message">
                                    <i class="fas fa-comment"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Load matches and chats
function loadMatches() {
    const matchesList = document.getElementById('matchesList');
    matchesList.innerHTML = '';
    
    sampleMatches.forEach(match => {
        const matchItem = document.createElement('div');
        matchItem.className = 'match-item';
        matchItem.innerHTML = `
            <div class="match-avatar">${match.avatar}</div>
            <div class="match-info">
                <div class="match-name">${match.name}</div>
                <div class="match-movie">${match.movie}</div>
            </div>
            <div class="match-actions">
                <button class="action-btn" onclick="addFriend('${match.name}')" title="Add Friend">
                    <i class="fas fa-user-plus"></i>
                </button>
                <button class="action-btn" onclick="openChat('${match.name}', '${match.movie}')" title="Message">
                    <i class="fas fa-comment"></i>
                </button>
            </div>
        `;
        matchesList.appendChild(matchItem);
    });
}

// Load chat list (for sidebar)
function loadChatList() {
    const chatList = document.getElementById('chatList');
    if (!chatList) return;
    
    chatList.innerHTML = '';
    
    Object.keys(chatConversations).forEach(userName => {
        const chat = chatConversations[userName];
        const lastMessage = chat.messages[chat.messages.length - 1];
        const unreadCount = Math.floor(Math.random() * 3); // Simulate unread messages
        
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.onclick = () => selectChat(userName);
        
        chatItem.innerHTML = `
            <div class="chat-avatar">${chat.avatar}</div>
            <div class="chat-info">
                <div class="chat-name">${userName}</div>
                <div class="chat-preview">${lastMessage.content}</div>
            </div>
            <div class="chat-meta">
                <div class="chat-time">${lastMessage.timestamp}</div>
                ${unreadCount > 0 ? `<div class="unread-badge">${unreadCount}</div>` : ''}
            </div>
        `;
        
        chatList.appendChild(chatItem);
    });
}

// Select chat conversation
function selectChat(userName) {
    currentChatUser = userName;
    const chat = chatConversations[userName];
    
    // Update chat header and context
    document.getElementById('chatTitle').textContent = `Chat with ${userName}`;
    const movieContext = document.getElementById('movieContext');
    movieContext.textContent = `🎬 Discussing: "${chat.movie}"`;
    movieContext.style.display = 'block';
    
    // Load messages
    loadChatMessages(userName);
    
    // Enable input
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.querySelector('.send-btn');
    messageInput.disabled = false;
    sendBtn.disabled = false;
    messageInput.placeholder = `Message ${userName}...`;
}

// Load chat messages
function loadChatMessages(userName) {
    const messagesContainer = document.getElementById('chatMessages');
    const chat = chatConversations[userName];
    
    messagesContainer.innerHTML = '';
    
    chat.messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = message.sender === 'You' ? 'message own' : 'message';
        
        const avatar = message.sender === 'You' ? 'A' : chat.avatar;
        
        messageElement.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">${message.content}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
    });
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Add friend
function addFriend(friendName) {
    currentUser.popcornPoints += 25;
    currentUser.friends += 1;
    showToast(`Friend request sent to ${friendName}! +25 🍿`, 'success');
    updatePopcornPoints();
}

// Update popcorn points display
function updatePopcornPoints() {
    // Update sidebar display
    const sidebarPoints = document.getElementById('popcornPoints');
    if (sidebarPoints) {
        sidebarPoints.textContent = currentUser.popcornPoints;
    }
    
    // Update progress bars
    const nextMilestone = 500;
    const progress = (currentUser.popcornPoints / nextMilestone) * 100;
    
    if (progressText) progressText.textContent = `${currentUser.popcornPoints} / ${nextMilestone}`;
    if (profileFill) profileFill.style.width = Math.min(progress, 100) + '%';
}

// Popcorn point celebration animation
function celebratePopcornEarned(points) {
    const celebration = document.createElement('div');
    celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        color: #FFD700;
        z-index: 1003;
        animation: popUp 1s ease-out forwards;
        pointer-events: none;
    `;
    celebration.textContent = `+${points} 🍿`;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popUp {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
            100% { opacity: 0; transform: translate(-50%, -80%) scale(1); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        document.body.removeChild(celebration);
        document.head.removeChild(style);
    }, 1000);
}

// Enhanced toggle interest with celebration
function toggleInterestEnhanced(movieId) {
    toggleInterest(movieId);
    if (currentUser.interestedMovies.has(movieId)) {
        celebratePopcornEarned(10);
    }
}

// Movie search functionality (placeholder)
function searchMovies(query) {
    // This would integrate with TheMovieDB API in a real app
    const filtered = sampleMovies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase()))
    );
    
    const movieGrid = document.getElementById('movieGrid');
    movieGrid.innerHTML = '';
    filtered.forEach(movie => {
        const movieCard = createMovieCard(movie);
        movieGrid.appendChild(movieCard);
    });
}

// Add search functionality to header (could be added later)
function addSearchBar() {
    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.placeholder = 'Search movies...';
    searchBar.style.cssText = `
        background: #333;
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        color: white;
        margin-right: 15px;
    `;
    
    searchBar.addEventListener('input', (e) => {
        searchMovies(e.target.value);
    });
    
    document.querySelector('.header-right').insertBefore(
        searchBar, 
        document.querySelector('.city-selector')
    );
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
            if (modal.parentNode) {
                modal.remove();
            }
        }
    });
});

// Handle responsive navigation
function updateLayout() {
    const isMobile = window.innerWidth <= 768;
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (isMobile) {
        // Mobile layout adjustments can be added here
    }
}

window.addEventListener('resize', updateLayout);

// Smooth scroll for mobile navigation
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add some movie interaction animations
function addMovieInteraction(movieId) {
    const card = document.querySelector(`[data-movie-id="${movieId}"]`);
    if (card) {
        card.style.transform = 'scale(1.05)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 200);
    }
}

// Simulate real-time updates
setInterval(() => {
    // Simulate new matches or messages
    if (Math.random() > 0.95) { // 5% chance every interval
        const notifications = [
            "New movie buddy found nearby! 🎬",
            "Someone liked the same movie as you! 💫",
            "Friend request received! 👥"
        ];
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        showToast(randomNotification, 'success');
    }
}, 5000);

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    updateUserInitials();
    updatePopcornPoints();
    
    // Handle Enter key in chat input
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // City selector
    const citySelector = document.getElementById('citySelector');
    if (citySelector) {
        citySelector.addEventListener('change', function(e) {
            const cityMap = {
                'newyork': 'New York',
                'pune': 'Pune',
                'mumbai': 'Mumbai',
                'delhi': 'Delhi',
                'bangalore': 'Bangalore',
                'losangeles': 'Los Angeles',
                'chicago': 'Chicago',
                'london': 'London'
            };
            
            currentUser.city = e.target.value;
            currentUser.location = cityMap[e.target.value];
            showToast(`Location changed to ${currentUser.location}`, 'success');
            loadMatches();
        });
    }
});
    const progress = (currentUser.popcornPoints / nextMilestone) * 100;
    
    // Update sidebar progress bar
    const sidebarFill = document.querySelector('.popcorn-fill');
    if (sidebarFill) {
        sidebarFill.style.width = Math.min(progress, 100) + '%';
    }
    
    // Update profile modal if it's open
    const profileModal = document.getElementById('profileModal');
    if (profileModal && profileModal.style.display === 'block') {
        updateProfileData();
    }


// Profile functions
function openProfile() {
    document.getElementById('profileModal').style.display = 'block';
    updateProfileData();
}

function closeProfile() {
    document.getElementById('profileModal').style.display = 'none';
}

// Chat functions
function openChat(friendName, movieTitle) {
    const chatDrawer = document.getElementById('chatDrawer');
    chatDrawer.classList.add('open');
    
    // If friendName exists in conversations, select it; otherwise create basic chat
    if (chatConversations[friendName]) {
        selectChat(friendName);
        // Find and highlight the chat item
        setTimeout(() => {
            const chatItems = document.querySelectorAll('.chat-item');
            chatItems.forEach(item => {
                if (item.textContent.includes(friendName)) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }, 100);
    } else {
        // Create a basic chat for new conversations
        currentChatUser = friendName;
        document.getElementById('chatTitle').textContent = `Chat with ${friendName}`;
        const movieContext = document.getElementById('movieContext');
        movieContext.textContent = `🎬 Discussing: "${movieTitle}"`;
        movieContext.style.display = 'block';
        
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.innerHTML = `
            <div style="text-align: center; color: #666; padding: 50px 20px;">
                <div style="font-size: 3rem; margin-bottom: 20px;">👋</div>
                <p>Start a conversation with ${friendName} about "${movieTitle}"!</p>
            </div>
        `;
        
        // Enable input
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.querySelector('.send-btn');
        messageInput.disabled = false;
        sendBtn.disabled = false;
        messageInput.placeholder = `Message ${friendName}...`;
    }
    
    currentUser.popcornPoints += 5;
    showToast('Chat opened! +5 🍿', 'success');
    updatePopcornPoints();
}

function closeChat() {
    document.getElementById('chatDrawer').classList.remove('open');
    currentChatUser = null;
    
    // Reset to chat list view
    showChatList();
    
    // Reset input state
    document.getElementById('messageInput').disabled = true;
    document.querySelector('.send-btn').disabled = true;
    document.getElementById('messageInput').placeholder = 'Type a message...';
    
    // Remove active state from chat items
    document.querySelectorAll('.chat-item, .drawer-chat-item').forEach(item => {
        item.classList.remove('active');
    });
}

function sendMessage() {
    if (!currentChatUser) return;
    
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const messagesContainer = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message own';
    messageElement.innerHTML = `
        <div class="message-avatar">A</div>
        <div class="message-content">${message}</div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    input.value = '';
    
    // Add to conversation history if it exists
    if (chatConversations[currentChatUser]) {
        chatConversations[currentChatUser].messages.push({
            sender: 'You',
            content: message,
            timestamp: 'Just now'
        });
    }
    
    currentUser.popcornPoints += 2;
    updatePopcornPoints();
    
    // Simulate response after 2 seconds
    setTimeout(() => {
        const responses = [
            "That sounds great! Looking forward to it 🎬",
            "Awesome! Can't wait to watch together!",
            "Perfect! See you there! 🍿",
            "Great idea! Let's make it happen!",
            "Sounds like a plan! 🎭"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseElement = document.createElement('div');
        responseElement.className = 'message';
        const avatar = chatConversations[currentChatUser] ? chatConversations[currentChatUser].avatar : currentChatUser[0];
        
        responseElement.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">${randomResponse}</div>
        `;
        messagesContainer.appendChild(responseElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add to conversation history
        if (chatConversations[currentChatUser]) {
            chatConversations[currentChatUser].messages.push({
                sender: currentChatUser,
                content: randomResponse,
                timestamp: 'Just now'
            });
        }
    }, 2000);
}

// Show matches (mobile)
function showMatches() {
    showToast('Showing your movie matches!', 'success');
    // In mobile view, this could scroll to matches or show them in a modal
}

// Open chat drawer (mobile)
function openChatDrawer() {
    const chatDrawer = document.getElementById('chatDrawer');
    chatDrawer.classList.add('open');
    
    // Load and show chat list
    loadDrawerChatList();
    showChatList();
}

// Load chat list for drawer
function loadDrawerChatList() {
    const drawerChatList = document.getElementById('drawerChatList');
    if (!drawerChatList) return;
    
    drawerChatList.innerHTML = '';
    
    Object.keys(chatConversations).forEach(userName => {
        const chat = chatConversations[userName];
        const lastMessage = chat.messages[chat.messages.length - 1];
        const unreadCount = Math.floor(Math.random() * 3); // Simulate unread messages
        
        const chatItem = document.createElement('div');
        chatItem.className = 'drawer-chat-item';
        chatItem.onclick = () => openChatConversation(userName);
        
        chatItem.innerHTML = `
            <div class="chat-avatar">${chat.avatar}</div>
            <div class="chat-info">
                <div class="chat-name">${userName}</div>
                <div class="chat-preview">${lastMessage.content}</div>
            </div>
            <div class="chat-meta">
                <div class="chat-time">${lastMessage.timestamp}</div>
                ${unreadCount > 0 ? `<div class="unread-badge">${unreadCount}</div>` : ''}
            </div>
        `;
        
        drawerChatList.appendChild(chatItem);
    });
}

// Show chat list view
function showChatList() {
    document.getElementById('chatListView').style.display = 'block';
    document.getElementById('chatConversationView').style.display = 'none';
    document.getElementById('chatTitle').textContent = '💬 Your Chats';
    currentChatUser = null;
}

// Open specific chat conversation
function openChatConversation(userName) {
    document.getElementById('chatListView').style.display = 'none';
    document.getElementById('chatConversationView').style.display = 'block';
    selectChat(userName);
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Initialize user initials
function updateUserInitials() {
    const initials = currentUser.name.split(' ').map(n => n[0]).join('');
    const userInitialsElement = document.getElementById('userInitials');
    if (userInitialsElement) {
        userInitialsElement.textContent = initials;
    }
}

// Update profile data
function updateProfileData() {
    // Update profile modal displays
    const profilePoints = document.getElementById('profilePopcornPoints');
    const profileMovies = document.getElementById('profileMoviesWatched');
    const profileFriends = document.getElementById('profileFriendsCount');
    const progressText = document.getElementById('progressText');
    const profileFill = document.getElementById('profilePopcornFill');
    
    if (profilePoints) profilePoints.textContent = currentUser.popcornPoints;
    if (profileMovies) profileMovies.textContent = currentUser.moviesWatched;
    if (profileFriends) profileFriends.textContent = currentUser.friends;
    
    // Update progress bars
    const nextMilestone = 500;
    window.signIn = signIn;
}
