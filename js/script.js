// Weather App JavaScript
class WeatherApp {
    constructor() {
        this.apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
        this.currentCity = 'New York';
        this.currentUnit = 'fahrenheit';
        this.currentTheme = 'light';
        this.animationsEnabled = true;
        this.backgroundEffectsEnabled = true;
        this.autoLocationEnabled = true;
        this.weatherData = null;
        this.forecastData = null;
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.initializeAnimations();
        this.detectUserLocation();
        this.updateClock();
        this.createParticles();
        
        // Update clock every second
        setInterval(() => this.updateClock(), 1000);
    }

    // Load settings from localStorage
    loadSettings() {
        const settings = localStorage.getItem('weatherAppSettings');
        if (settings) {
            const parsedSettings = JSON.parse(settings);
            this.currentUnit = parsedSettings.unit || 'fahrenheit';
            this.currentTheme = parsedSettings.theme || 'light';
            this.animationsEnabled = parsedSettings.animations !== false;
            this.backgroundEffectsEnabled = parsedSettings.background !== false;
            this.autoLocationEnabled = parsedSettings.autoLocation !== false;
            
            // Apply theme
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            
            // Apply animations setting
            if (!this.animationsEnabled) {
                document.documentElement.setAttribute('data-animations', 'false');
            }
        }
    }

    // Save settings to localStorage
    saveSettings() {
        const settings = {
            unit: this.currentUnit,
            theme: this.currentTheme,
            animations: this.animationsEnabled,
            background: this.backgroundEffectsEnabled,
            autoLocation: this.autoLocationEnabled
        };
        localStorage.setItem('weatherAppSettings', JSON.stringify(settings));
    }

    // Setup event listeners
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const locationBtn = document.getElementById('locationBtn');

        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearch();
            });
        }

        if (locationBtn) {
            locationBtn.addEventListener('click', () => this.detectUserLocation());
        }

        // Settings page listeners
        this.setupSettingsListeners();
    }

    // Setup settings page listeners
    setupSettingsListeners() {
        // Temperature unit toggles
        const celsiusBtn = document.getElementById('celsiusBtn');
        const fahrenheitBtn = document.getElementById('fahrenheitBtn');
        
        if (celsiusBtn && fahrenheitBtn) {
            celsiusBtn.addEventListener('click', () => this.setTemperatureUnit('celsius'));
            fahrenheitBtn.addEventListener('click', () => this.setTemperatureUnit('fahrenheit'));
        }

        // Theme toggles
        const lightBtn = document.getElementById('lightBtn');
        const darkBtn = document.getElementById('darkBtn');
        
        if (lightBtn && darkBtn) {
            lightBtn.addEventListener('click', () => this.setTheme('light'));
            darkBtn.addEventListener('click', () => this.setTheme('dark'));
        }

        // Animation toggles
        const animationsToggle = document.getElementById('animationsToggle');
        const backgroundToggle = document.getElementById('backgroundToggle');
        const soundToggle = document.getElementById('soundToggle');
        const autoLocationToggle = document.getElementById('autoLocationToggle');
        
        if (animationsToggle) {
            animationsToggle.addEventListener('change', (e) => {
                this.animationsEnabled = e.target.checked;
                document.documentElement.setAttribute('data-animations', this.animationsEnabled);
            });
        }

        if (backgroundToggle) {
            backgroundToggle.addEventListener('change', (e) => {
                this.backgroundEffectsEnabled = e.target.checked;
                const particles = document.getElementById('particles');
                const clouds = document.getElementById('clouds');
                if (particles) particles.style.display = this.backgroundEffectsEnabled ? 'block' : 'none';
                if (clouds) clouds.style.display = this.backgroundEffectsEnabled ? 'block' : 'none';
            });
        }

        if (autoLocationToggle) {
            autoLocationToggle.addEventListener('change', (e) => {
                this.autoLocationEnabled = e.target.checked;
            });
        }

        // Save and reset buttons
        const saveBtn = document.getElementById('saveSettings');
        const resetBtn = document.getElementById('resetSettings');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSettings());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSettings());
        }
    }

    // Set temperature unit
    setTemperatureUnit(unit) {
        this.currentUnit = unit;
        
        // Update button states
        const celsiusBtn = document.getElementById('celsiusBtn');
        const fahrenheitBtn = document.getElementById('fahrenheitBtn');
        
        if (celsiusBtn && fahrenheitBtn) {
            celsiusBtn.classList.toggle('active', unit === 'celsius');
            fahrenheitBtn.classList.toggle('active', unit === 'fahrenheit');
        }
        
        // Update display
        this.updateWeatherDisplay();
    }

    // Set theme
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update button states
        const lightBtn = document.getElementById('lightBtn');
        const darkBtn = document.getElementById('darkBtn');
        
        if (lightBtn && darkBtn) {
            lightBtn.classList.toggle('active', theme === 'light');
            darkBtn.classList.toggle('active', theme === 'dark');
        }
    }

    // Reset settings to default
    resetSettings() {
        this.currentUnit = 'fahrenheit';
        this.currentTheme = 'light';
        this.animationsEnabled = true;
        this.backgroundEffectsEnabled = true;
        this.autoLocationEnabled = true;
        
        // Apply defaults
        this.setTemperatureUnit('fahrenheit');
        this.setTheme('light');
        document.documentElement.setAttribute('data-animations', 'true');
        
        // Update toggles
        const animationsToggle = document.getElementById('animationsToggle');
        const backgroundToggle = document.getElementById('backgroundToggle');
        const autoLocationToggle = document.getElementById('autoLocationToggle');
        
        if (animationsToggle) animationsToggle.checked = true;
        if (backgroundToggle) backgroundToggle.checked = true;
        if (autoLocationToggle) autoLocationToggle.checked = true;
        
        this.saveSettings();
        this.showMessage('Settings reset to default', 'success');
    }

    // Handle search
    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim()) {
            this.currentCity = searchInput.value.trim();
            this.fetchWeatherData();
        }
    }

    // Detect user location
    detectUserLocation() {
        if (!this.autoLocationEnabled) return;
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.fetchWeatherByCoordinates(latitude, longitude);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    this.showMessage('Unable to detect location. Using default city.', 'error');
                    this.fetchWeatherData();
                }
            );
        } else {
            this.showMessage('Geolocation is not supported by your browser.', 'error');
            this.fetchWeatherData();
        }
    }

    // Fetch weather data by city name
    async fetchWeatherData() {
        try {
            this.showLoading(true);
            
            // Current weather
            const currentResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${this.currentCity}&appid=${this.apiKey}&units=metric`
            );
            
            if (!currentResponse.ok) {
                throw new Error('City not found');
            }
            
            this.weatherData = await currentResponse.json();
            
            // Forecast data
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${this.currentCity}&appid=${this.apiKey}&units=metric`
            );
            
            this.forecastData = await forecastResponse.json();
            
            this.updateWeatherDisplay();
            this.updateForecastDisplay();
            this.updateBackground();
            
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showMessage('Unable to fetch weather data. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Fetch weather data by coordinates
    async fetchWeatherByCoordinates(lat, lon) {
        try {
            this.showLoading(true);
            
            // Current weather
            const currentResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
            );
            
            this.weatherData = await currentResponse.json();
            this.currentCity = this.weatherData.name;
            
            // Update search input
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = this.currentCity;
            }
            
            // Forecast data
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
            );
            
            this.forecastData = await forecastResponse.json();
            
            this.updateWeatherDisplay();
            this.updateForecastDisplay();
            this.updateBackground();
            
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showMessage('Unable to fetch weather data. Please try again.', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Update weather display
    updateWeatherDisplay() {
        if (!this.weatherData) return;
        
        const cityName = document.getElementById('cityName');
        const tempValue = document.getElementById('tempValue');
        const weatherDescription = document.getElementById('weatherDescription');
        const feelsLike = document.getElementById('feelsLike');
        const humidity = document.getElementById('humidity');
        const windSpeed = document.getElementById('windSpeed');
        const pressure = document.getElementById('pressure');
        
        if (cityName) cityName.textContent = this.weatherData.name;
        
        if (tempValue) {
            const temp = this.convertTemperature(this.weatherData.main.temp);
            tempValue.textContent = Math.round(temp);
            this.animateNumber(tempValue);
        }
        
        if (weatherDescription) {
            weatherDescription.textContent = this.weatherData.weather[0].description;
        }
        
        if (feelsLike) {
            const feelsLikeTemp = this.convertTemperature(this.weatherData.main.feels_like);
            feelsLike.textContent = `${Math.round(feelsLikeTemp)}°${this.currentUnit === 'celsius' ? 'C' : 'F'}`;
        }
        
        if (humidity) humidity.textContent = `${this.weatherData.main.humidity}%`;
        
        if (windSpeed) {
            const windSpeedValue = this.currentUnit === 'celsius' 
                ? Math.round(this.weatherData.wind.speed * 3.6) // km/h
                : Math.round(this.weatherData.wind.speed * 2.237); // mph
            windSpeed.textContent = `${windSpeedValue} ${this.currentUnit === 'celsius' ? 'km/h' : 'mph'}`;
        }
        
        if (pressure) pressure.textContent = `${this.weatherData.main.pressure} mb`;
        
        // Update weather icon
        this.updateWeatherIcon(this.weatherData.weather[0].main);
    }

    // Update forecast display
    updateForecastDisplay() {
        if (!this.forecastData) return;
        
        const forecastContainer = document.getElementById('forecastContainer');
        if (!forecastContainer) return;
        
        // Clear existing forecast
        forecastContainer.innerHTML = '';
        
        // Get daily forecasts (one per day)
        const dailyForecasts = this.getDailyForecasts(this.forecastData);
        
        dailyForecasts.forEach((forecast, index) => {
            const card = this.createForecastCard(forecast, index);
            forecastContainer.appendChild(card);
        });
        
        // Update chart
        this.updateTemperatureChart(dailyForecasts);
        
        // Update location on forecast page
        const forecastLocation = document.getElementById('forecastLocation');
        if (forecastLocation) {
            forecastLocation.textContent = `${this.weatherData.name}, ${this.weatherData.sys.country}`;
        }
    }

    // Get daily forecasts from 3-hour data
    getDailyForecasts(forecastData) {
        const dailyData = {};
        
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!dailyData[date]) {
                dailyData[date] = {
                    date: date,
                    temps: [],
                    weather: item.weather[0].main,
                    description: item.weather[0].description,
                    humidity: item.main.humidity,
                    wind: item.wind.speed
                };
            }
            dailyData[date].temps.push(item.main.temp);
        });
        
        return Object.values(dailyData).slice(0, 7);
    }

    // Create forecast card
    createForecastCard(forecast, index) {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const highTemp = Math.max(...forecast.temps);
        const lowTemp = Math.min(...forecast.temps);
        const highDisplay = this.convertTemperature(highTemp);
        const lowDisplay = this.convertTemperature(lowTemp);
        
        const dayName = new Date(forecast.date).toLocaleDateString('en-US', { weekday: 'short' });
        
        card.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-icon">${this.getWeatherIcon(forecast.weather)}</div>
            <div class="forecast-temp">
                <span class="forecast-high">${Math.round(highDisplay)}°</span>
                <span class="forecast-low">${Math.round(lowDisplay)}°</span>
            </div>
            <div class="forecast-desc">${forecast.description}</div>
        `;
        
        return card;
    }

    // Update temperature chart
    updateTemperatureChart(dailyForecasts) {
        const canvas = document.getElementById('tempChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        const labels = dailyForecasts.map(f => 
            new Date(f.date).toLocaleDateString('en-US', { weekday: 'short' })
        );
        const highs = dailyForecasts.map(f => 
            Math.round(this.convertTemperature(Math.max(...f.temps)))
        );
        const lows = dailyForecasts.map(f => 
            Math.round(this.convertTemperature(Math.min(...f.temps)))
        );
        
        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'High',
                    data: highs,
                    borderColor: '#FF6B6B',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Low',
                    data: lows,
                    borderColor: '#4A90E2',
                    backgroundColor: 'rgba(74, 144, 226, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#FFFFFF'
                        }
                    }
                },
                scales: {
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#FFFFFF'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#FFFFFF'
                        }
                    }
                }
            }
        });
    }

    // Convert temperature based on unit
    convertTemperature(celsius) {
        if (this.currentUnit === 'fahrenheit') {
            return (celsius * 9/5) + 32;
        }
        return celsius;
    }

    // Update weather icon
    updateWeatherIcon(weatherMain) {
        const weatherIcon = document.getElementById('weatherIcon');
        if (!weatherIcon) return;
        
        weatherIcon.innerHTML = this.getWeatherIcon(weatherMain);
    }

    // Get weather icon SVG
    getWeatherIcon(weatherMain) {
        const icons = {
            'Clear': '<svg width="60" height="60" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="12" fill="#FFD700"/><path d="M30 18v-6M30 48v-6M18 30h-6M48 30h-6M20.34 20.34l-4.24-4.24M44.24 44.24l-4.24-4.24M20.34 39.66l-4.24 4.24M44.24 15.76l-4.24 4.24" stroke="#FFD700" stroke-width="2" stroke-linecap="round"/></svg>',
            'Clouds': '<svg width="60" height="60" viewBox="0 0 60 60" fill="none"><path d="M40 25c0-8.284-6.716-15-15-15s-15 6.716-15 15c-5.523 0-10 4.477-10 10s4.477 10 10 10h30c5.523 0 10-4.477 10-10s-4.477-10-10-10z" fill="#B0BEC5"/></svg>',
            'Rain': '<svg width="60" height="60" viewBox="0 0 60 60" fill="none"><path d="M40 20c0-6.627-5.373-12-12-12s-12 5.373-12 12c-4.418 0-8 3.582-8 8s3.582 8 8 8h24c4.418 0 8-3.582 8-8s-3.582-8-8-8z" fill="#90A4AE"/><path d="M20 40l-2 8M30 40l-2 8M40 40l-2 8" stroke="#4A90E2" stroke-width="2" stroke-linecap="round"/></svg>',
            'Snow': '<svg width="60" height="60" viewBox="0 0 60 60" fill="none"><path d="M40 20c0-6.627-5.373-12-12-12s-12 5.373-12 12c-4.418 0-8 3.582-8 8s3.582 8 8 8h24c4.418 0 8-3.582 8-8s-3.582-8-8-8z" fill="#E0E0E0"/><path d="M20 40l2 2M30 40l2 2M40 40l2 2M25 45l2 2M35 45l2 2" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/></svg>',
            'Thunderstorm': '<svg width="60" height="60" viewBox="0 0 60 60" fill="none"><path d="M40 20c0-6.627-5.373-12-12-12s-12 5.373-12 12c-4.418 0-8 3.582-8 8s3.582 8 8 8h24c4.418 0 8-3.582 8-8s-3.582-8-8-8z" fill="#607D8B"/><path d="M25 35l5-8h-3l3-5-5 8h3z" fill="#FFD700"/></svg>',
            'Drizzle': '<svg width="60" height="60" viewBox="0 0 60 60" fill="none"><path d="M40 25c0-6.627-5.373-12-12-12s-12 5.373-12 12c-4.418 0-8 3.582-8 8s3.582 8 8 8h24c4.418 0 8-3.582 8-8s-3.582-8-8-8z" fill="#B0BEC5"/><path d="M20 42l1 4M30 42l1 4M40 42l1 4" stroke="#4A90E2" stroke-width="1.5" stroke-linecap="round"/></svg>',
            'Mist': '<svg width="60" height="60" viewBox="0 0 60 60" fill="none"><path d="M15 25h30M10 35h40M15 45h30" stroke="#B0BEC5" stroke-width="3" stroke-linecap="round"/></svg>',
            'Fog': '<svg width="60" height="60" viewBox="0 0 60 60" fill="none"><path d="M10 20h40M5 30h50M10 40h40M5 50h50" stroke="#90A4AE" stroke-width="3" stroke-linecap="round"/></svg>'
        };
        
        return icons[weatherMain] || icons['Clear'];
    }

    // Update background based on weather and time
    updateBackground() {
        if (!this.weatherData) return;
        
        const weatherBg = document.getElementById('weatherBg');
        if (!weatherBg) return;
        
        const weatherMain = this.weatherData.weather[0].main;
        const currentTime = new Date().getHours();
        const isNight = currentTime < 6 || currentTime > 20;
        
        // Remove all weather classes
        weatherBg.classList.remove('sunny', 'cloudy', 'rainy', 'night');
        
        // Add appropriate class based on weather and time
        if (isNight) {
            weatherBg.classList.add('night');
        } else if (weatherMain === 'Clear') {
            weatherBg.classList.add('sunny');
        } else if (weatherMain === 'Clouds') {
            weatherBg.classList.add('cloudy');
        } else if (weatherMain === 'Rain' || weatherMain === 'Drizzle' || weatherMain === 'Thunderstorm') {
            weatherBg.classList.add('rainy');
        } else {
            weatherBg.classList.add('cloudy');
        }
    }

    // Update clock
    updateClock() {
        const currentTimeElement = document.getElementById('currentTime');
        if (currentTimeElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            currentTimeElement.textContent = timeString;
        }
    }

    // Create particles for background effect
    createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer || !this.backgroundEffectsEnabled) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = Math.random() * 4 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    // Initialize animations
    initializeAnimations() {
        if (!this.animationsEnabled) return;
        
        // Animate elements on page load
        gsap.from('.hero-title', {
            duration: 1,
            y: -50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-subtitle', {
            duration: 1,
            y: -30,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.2
        });
        
        gsap.from('.search-box', {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.4
        });
        
        gsap.from('.weather-card', {
            duration: 1,
            scale: 0.8,
            opacity: 0,
            ease: 'back.out(1.7)',
            delay: 0.6
        });
        
        gsap.from('.detail-item', {
            duration: 0.8,
            x: -30,
            opacity: 0,
            ease: 'power3.out',
            stagger: 0.1,
            delay: 0.8
        });
    }

    // Animate number counting
    animateNumber(element) {
        if (!this.animationsEnabled) return;
        
        const finalValue = parseInt(element.textContent);
        let currentValue = 0;
        const increment = finalValue / 50;
        const duration = 2000; // 2 seconds
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            element.textContent = Math.round(currentValue);
        }, stepTime);
    }

    // Show loading state
    showLoading(show) {
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            if (show) {
                searchBtn.innerHTML = '<div class="loading"></div>';
                searchBtn.disabled = true;
            } else {
                searchBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
                searchBtn.disabled = false;
            }
        }
    }

    // Show message
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.error-message, .success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;
        
        // Insert after search box or at top of main
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.insertAdjacentElement('afterend', messageDiv);
        } else {
            const main = document.querySelector('.main');
            if (main) {
                main.insertBefore(messageDiv, main.firstChild);
            }
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
        
        // Animate in
        if (this.animationsEnabled && window.gsap) {
            gsap.from(messageDiv, {
                duration: 0.5,
                y: -20,
                opacity: 0,
                ease: 'power3.out'
            });
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.weatherApp = new WeatherApp();
});

// Handle page transitions
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth page transitions
    const links = document.querySelectorAll('a[href$=".html"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            if (window.gsap) {
                gsap.to('body', {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        window.location.href = href;
                    }
                });
            } else {
                window.location.href = href;
            }
        });
    });
});

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
