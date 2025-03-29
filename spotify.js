// Sample data
const featuredPlaylists = [
    {
        id: 1,
        title: "Today's Top Hits",
        description: "The biggest hits right now.",
        cover: "https://via.placeholder.com/200"
    },
    {
        id: 2,
        title: "Discover Weekly",
        description: "Your weekly mixtape of fresh music.",
        cover: "https://via.placeholder.com/200"
    },
    {
        id: 3,
        title: "Chill Hits",
        description: "Kick back to the best new and recent chill hits.",
        cover: "https://via.placeholder.com/200"
    }
];

const recentlyPlayed = [
    {
        id: 1,
        title: "Song Title 1",
        artist: "Artist 1",
        duration: "3:45",
        cover: "https://via.placeholder.com/56"
    },
    {
        id: 2,
        title: "Song Title 2",
        artist: "Artist 2",
        duration: "4:20",
        cover: "https://via.placeholder.com/56"
    },
    {
        id: 3,
        title: "Song Title 3",
        artist: "Artist 3",
        duration: "3:15",
        cover: "https://via.placeholder.com/56"
    }
];

// DOM Elements
const audio = new Audio();
const playBtn = document.querySelector('.play-btn');
const prevBtn = document.querySelector('.previous-btn');
const nextBtn = document.querySelector('.next-btn');
const shuffleBtn = document.querySelector('.shuffle-btn');
const repeatBtn = document.querySelector('.repeat-btn');
const progressBar = document.querySelector('.progress');
const progressContainer = document.querySelector('.progress-bar');
const currentTimeEl = document.querySelector('.current-time');
const durationEl = document.querySelector('.duration');
const volumeSlider = document.querySelector('.volume-slider');
const volumeProgress = document.querySelector('.volume-progress');
const likeBtn = document.querySelector('.like-btn');
const playlistGrid = document.querySelector('.playlist-grid');
const trackList = document.querySelector('.track-list');
const nowPlaying = document.querySelector('.now-playing');

// State
let currentTrackIndex = 0;
let isPlaying = false;
let isShuffled = false;
let repeatMode = 'none';
let currentPlaylist = [];

// Initialize
function init() {
    loadFeaturedPlaylists();
    loadRecentlyPlayed();
    setupEventListeners();
    setupAudioContext();
}

// Load Featured Playlists
function loadFeaturedPlaylists() {
    playlistGrid.innerHTML = featuredPlaylists.map(playlist => `
        <div class="playlist-card" data-id="${playlist.id}">
            <img src="${playlist.cover}" alt="${playlist.title}">
            <h3>${playlist.title}</h3>
            <p>${playlist.description}</p>
        </div>
    `).join('');
}

// Load Recently Played
function loadRecentlyPlayed() {
    trackList.innerHTML = recentlyPlayed.map(track => `
        <div class="track-item" data-id="${track.id}">
            <img src="${track.cover}" alt="${track.title}">
            <div class="track-info">
                <h4>${track.title}</h4>
                <p>${track.artist}</p>
            </div>
            <div class="track-duration">${track.duration}</div>
        </div>
    `).join('');
}

// Event Listeners
function setupEventListeners() {
    // Play/Pause
    playBtn.addEventListener('click', togglePlay);

    // Navigation
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);

    // Progress bar
    audio.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);

    // Volume
    volumeSlider.addEventListener('click', setVolume);

    // Like button
    likeBtn.addEventListener('click', toggleLike);

    // Playlist and track clicks
    playlistGrid.addEventListener('click', handlePlaylistClick);
    trackList.addEventListener('click', handleTrackClick);

    // Shuffle and Repeat
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);

    // Audio ended
    audio.addEventListener('ended', handleSongEnd);

    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', handleNavigation);
    });
}

// Play/Pause
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

// Navigation
function playPrevious() {
    if (currentPlaylist.length === 0) return;
    currentTrackIndex--;
    if (currentTrackIndex < 0) {
        currentTrackIndex = currentPlaylist.length - 1;
    }
    loadAndPlayTrack();
}

function playNext() {
    if (currentPlaylist.length === 0) return;
    currentTrackIndex++;
    if (currentTrackIndex >= currentPlaylist.length) {
        currentTrackIndex = 0;
    }
    loadAndPlayTrack();
}

function loadAndPlayTrack() {
    const track = currentPlaylist[currentTrackIndex];
    updateNowPlaying(track);
    if (isPlaying) {
        audio.play();
    }
}

// Progress bar
function updateProgress() {
    const { duration, currentTime } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Volume control
function setVolume(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const volume = clickX / width;
    audio.volume = volume;
    volumeProgress.style.width = `${volume * 100}%`;
}

// Like button
function toggleLike() {
    likeBtn.classList.toggle('active');
    likeBtn.innerHTML = likeBtn.classList.contains('active') 
        ? '<i class="fas fa-heart"></i>' 
        : '<i class="far fa-heart"></i>';
}

// Playlist and track handlers
function handlePlaylistClick(e) {
    const playlistCard = e.target.closest('.playlist-card');
    if (playlistCard) {
        const playlistId = playlistCard.dataset.id;
        const playlist = featuredPlaylists.find(p => p.id === parseInt(playlistId));
        if (playlist) {
            currentPlaylist = recentlyPlayed; // In a real app, this would load the actual playlist tracks
            currentTrackIndex = 0;
            loadAndPlayTrack();
        }
    }
}

function handleTrackClick(e) {
    const trackItem = e.target.closest('.track-item');
    if (trackItem) {
        const trackId = trackItem.dataset.id;
        const track = recentlyPlayed.find(t => t.id === parseInt(trackId));
        if (track) {
            currentPlaylist = recentlyPlayed;
            currentTrackIndex = recentlyPlayed.findIndex(t => t.id === parseInt(trackId));
            loadAndPlayTrack();
        }
    }
}

// Update Now Playing
function updateNowPlaying(track) {
    const img = nowPlaying.querySelector('img');
    const title = nowPlaying.querySelector('h4');
    const artist = nowPlaying.querySelector('p');

    img.src = track.cover;
    title.textContent = track.title;
    artist.textContent = track.artist;
}

// Shuffle and Repeat
function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active');
}

function toggleRepeat() {
    switch (repeatMode) {
        case 'none':
            repeatMode = 'one';
            repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
            break;
        case 'one':
            repeatMode = 'all';
            repeatBtn.innerHTML = '<i class="fas fa-redo-alt"></i>';
            break;
        case 'all':
            repeatMode = 'none';
            repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
            break;
    }
}

// Song end handler
function handleSongEnd() {
    switch (repeatMode) {
        case 'one':
            audio.currentTime = 0;
            audio.play();
            break;
        case 'all':
            playNext();
            break;
        default:
            if (currentTrackIndex < currentPlaylist.length - 1) {
                playNext();
            } else {
                isPlaying = false;
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
    }
}

// Navigation handler
function handleNavigation(e) {
    const btn = e.currentTarget;
    if (btn.querySelector('.fa-chevron-left')) {
        // Handle back navigation
        console.log('Navigate back');
    } else {
        // Handle forward navigation
        console.log('Navigate forward');
    }
}

// Audio Context setup
function setupAudioContext() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audio);
    source.connect(audioContext.destination);
}

// Utility functions
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Initialize the app
init(); 