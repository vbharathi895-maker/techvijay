const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const profileContainer = document.getElementById('profile');
const errorContainer = document.getElementById('error');

// Base GitHub API URL
const API_URL = 'https://api.github.com/users/';

// Fetch user data from GitHub API
async function getUserData(username) {
    try {
        // Change button text to show loading state
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading';
        searchBtn.disabled = true;

        const response = await fetch(API_URL + username);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User not found. Check the username.');
            } else if (response.status === 403) {
                throw new Error('API Rate limit exceeded. Try again later.');
            } else {
                throw new Error('Something went wrong.');
            }
        }

        const data = await response.json();
        displayProfile(data);
    } catch (error) {
        displayError(error.message);
    } finally {
        // Reset button state
        searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
        searchBtn.disabled = false;
    }
}

// Display the fetched profile data on the UI
function displayProfile(user) {
    // Hide any previous errors
    errorContainer.classList.add('hidden');
    
    // Check if user has a name, otherwise use their login handle
    const displayName = user.name || user.login;
    const bioText = user.bio ? user.bio : 'This user has no bio available.';

    // Construct the HTML template
    const profileHTML = `
        <img src="${user.avatar_url}" alt="${displayName}'s avatar" class="avatar">
        <h2 class="name">${displayName}</h2>
        <a href="${user.html_url}" target="_blank" class="username">@${user.login}</a>
        <p class="bio">${bioText}</p>
        
        <div class="stats">
            <div class="stat-item">
                <span class="stat-value">${user.public_repos}</span>
                <span class="stat-label">Repos</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${user.followers}</span>
                <span class="stat-label">Followers</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${user.following}</span>
                <span class="stat-label">Following</span>
            </div>
        </div>
    `;

    // Inject HTML into container
    profileContainer.innerHTML = profileHTML;
    
    // Make profile visible
    profileContainer.classList.remove('hidden');
}

// Display error messages
function displayError(message) {
    // Hide profile container if it's currently showing
    profileContainer.classList.add('hidden');
    
    // Set error HTML
    errorContainer.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    
    // Make error visible
    errorContainer.classList.remove('hidden');
}

// Event Listener for the Search Button Click
searchBtn.addEventListener('click', () => {
    const username = searchInput.value.trim();
    if (username) {
        getUserData(username);
    } else {
        displayError('Please enter a GitHub username.');
    }
});

// Event Listener for pressing 'Enter' inside the input field
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const username = searchInput.value.trim();
        if (username) {
            getUserData(username);
        } else {
            displayError('Please enter a GitHub username.');
        }
    }
});
