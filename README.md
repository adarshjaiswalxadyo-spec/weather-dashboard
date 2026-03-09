# WeatherFlow - Premium Weather Dashboard

A modern, real-time weather application with smooth animations, location-based forecasts, and a beautiful UI. Built with vanilla JavaScript, CSS3, and modern web APIs.

## Features

### 🌟 Core Features
- **Real-time Weather Data** - Fetches current weather from OpenWeatherMap API
- **7-Day Forecast** - Extended forecast with temperature trends
- **Location Detection** - Automatic geolocation or manual city search
- **Temperature Conversion** - Switch between Celsius and Fahrenheit
- **Dark/Light Themes** - Beautiful theme switching with smooth transitions

### 🎨 Design & Animations
- **Glassmorphism UI** - Modern frosted glass effect
- **Animated Backgrounds** - Dynamic backgrounds based on weather conditions
- **Smooth Animations** - GSAP-powered animations and transitions
- **Responsive Design** - Mobile-first approach that works on all devices
- **Interactive Charts** - Temperature trend visualization with Chart.js

### ⚙️ Settings & Customization
- **Temperature Units** - Celsius/Fahrenheit toggle
- **Theme Switching** - Light and dark mode
- **Animation Controls** - Enable/disable animations for performance
- **Background Effects** - Toggle particle effects and clouds
- **Saved Cities** - Store favorite locations
- **Notifications** - Weather alerts and daily summaries

## Getting Started

### Prerequisites
- Modern web browser with ES6+ support
- OpenWeatherMap API key (free)

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd weather
   ```

2. **Get your OpenWeatherMap API key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Get your API key from the dashboard

3. **Configure the API key**
   - Open `js/script.js`
   - Replace `YOUR_OPENWEATHERMAP_API_KEY` with your actual API key:
   ```javascript
   this.apiKey = 'your_actual_api_key_here';
   ```

4. **Run the application**
   - Open `index.html` in your web browser
   - Or serve with a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

## Project Structure

```
WeatherDashboard/
├── index.html              # Home page with current weather
├── forecast.html           # 7-day forecast page
├── settings.html           # Settings and preferences
├── css/
│   └── style.css           # Complete styling with animations
├── js/
│   └── script.js           # Main application logic
├── assets/
│   ├── icons/              # Weather icons (SVG)
│   └── images/             # Additional images
├── lib/                    # External libraries (if downloaded locally)
└── README.md               # This file
```

## API Integration

### OpenWeatherMap API
The app uses the following OpenWeatherMap endpoints:

1. **Current Weather**: `/data/2.5/weather`
2. **5-Day Forecast**: `/data/2.5/forecast`

### Required API Key
You must obtain a free API key from [OpenWeatherMap](https://openweathermap.org/api) and add it to `js/script.js`.

## Customization

### Adding New Weather Conditions
Edit the `getWeatherIcon()` method in `js/script.js` to add new weather conditions and their corresponding SVG icons.

### Modifying Themes
Update CSS variables in `css/style.css` to customize colors, gradients, and visual styles.

### Adding New Settings
1. Add HTML elements to `settings.html`
2. Add event listeners in `setupSettingsListeners()`
3. Update `saveSettings()` and `loadSettings()` methods

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Features

- **Lazy Loading** - Animations and effects can be disabled
- **LocalStorage** - Settings persistence
- **Responsive Images** - Optimized for different screen sizes
- **CSS Animations** - Hardware-accelerated animations

## Accessibility

- Semantic HTML5 structure
- ARIA labels where appropriate
- Keyboard navigation support
- High contrast support
- Reduced motion support

## Troubleshooting

### Common Issues

1. **API Key Error**
   - Ensure you've replaced the placeholder API key
   - Check that your API key is valid and active

2. **Location Not Found**
   - Try searching for major cities first
   - Check for spelling errors in city names

3. **Animations Not Working**
   - Check if animations are disabled in settings
   - Ensure browser supports CSS animations

4. **Chart Not Displaying**
   - Ensure Chart.js is loaded properly
   - Check browser console for errors

### Getting API Key Help

1. Visit [OpenWeatherMap](https://home.openweathermap.org/users/sign_up)
2. Create a free account
3. Navigate to API keys tab
4. Copy your default API key
5. Replace placeholder in `js/script.js`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Credits

- **Weather Data**: OpenWeatherMap API
- **Animations**: GSAP
- **Charts**: Chart.js
- **Icons**: Custom SVG icons
- **Fonts**: Google Fonts (Poppins)

## Support

For issues and questions:
1. Check the troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with detailed information

---

**WeatherFlow** - Your premium weather experience with stunning animations and real-time data.
