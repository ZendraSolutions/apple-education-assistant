# Onboarding Tour Documentation

## Overview

The Onboarding Tour is a custom-built, interactive guide system that helps first-time users learn about the Apple Edu Assistant application. It's implemented without external libraries and integrates seamlessly with the existing application architecture.

## Features

- **7-Step Interactive Tour**: Guides users through key features
- **Element Highlighting**: Visual spotlight on current focus area
- **Dark Overlay**: Reduces distractions by dimming background
- **Smart Positioning**: Tooltip automatically adjusts position to stay on screen
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Keyboard Navigation**: Full keyboard support (Arrow keys, Enter, Escape)
- **LocalStorage Persistence**: Only shows once per user
- **Accessibility**: ARIA labels, focus management, reduced motion support
- **No External Dependencies**: Pure JavaScript/CSS implementation

## Tour Steps

### Step 1: Welcome to Dashboard
- **Target**: `.dashboard-hero`
- **Content**: Introduction to the control center
- **Position**: Bottom

### Step 2: Sidebar Navigation
- **Target**: `.sidebar`
- **Content**: How to navigate between sections
- **Position**: Right

### Step 3: Quick Access Cards
- **Target**: `.quick-access-grid`
- **Content**: Rapid access to main tools
- **Position**: Bottom

### Step 4: Search Engine
- **Target**: `.search-container`
- **Content**: How to search for solutions
- **Position**: Bottom

### Step 5: AI Chatbot
- **Target**: `.chatbot-fab`
- **Content**: Introduction to AI assistant and API Key setup
- **Position**: Left

### Step 6: Theme Selector
- **Target**: `#themeToggle`
- **Content**: Switch between light/dark mode
- **Position**: Right

### Step 7: Ready to Start
- **Target**: `.dashboard-hero`
- **Content**: Tour completion message
- **Position**: Bottom

## File Structure

```
js/ui/OnboardingTour.js     - Main tour logic and functionality
css/onboarding.css          - Tour styling and animations
js/main.js                  - Integration and initialization
index.html                  - CSS link inclusion
```

## How It Works

### Initialization Flow

1. **main.js** imports the `OnboardingTour` class
2. After app initialization completes, checks `localStorage` for `jamf-tour-completed` key
3. If not found, waits 1 second for DOM to fully render
4. Starts the tour automatically

### User Interaction

- **Next Button**: Advances to next step
- **Previous Button**: Goes back to previous step (disabled on first step)
- **Skip Button**: Exits tour with confirmation
- **Close Button**: Same as Skip
- **Keyboard**:
  - `→` or `Enter`: Next step
  - `←`: Previous step
  - `Esc`: Skip tour

### Visual Components

1. **Overlay**: Dark backdrop (rgba(0,0,0,0.7)) with blur
2. **Highlight**: Orange glowing border around target element with pulsing animation
3. **Tooltip**: Content card with:
   - Header (title + close button)
   - Body (description)
   - Progress bar
   - Navigation buttons
   - Step counter

## API Reference

### OnboardingTour Class

#### Constructor
```javascript
const tour = new OnboardingTour();
```

#### Methods

##### `shouldShow(): boolean`
Checks if tour should be displayed (first visit).

```javascript
if (tour.shouldShow()) {
    // Tour has not been completed yet
}
```

##### `start(): void`
Starts the onboarding tour.

```javascript
tour.start();
```

##### `reset(): void`
Resets the tour completion state (for testing).

```javascript
tour.reset();
// Reload page to see tour again
```

## Testing

### Manual Testing

1. **First Visit Test**
   ```javascript
   // Open DevTools Console
   localStorage.removeItem('jamf-tour-completed');
   location.reload();
   // Tour should start automatically after 1 second
   ```

2. **Skip Test**
   - Start tour
   - Click "Saltar tour"
   - Confirm dialog
   - Reload page
   - Tour should NOT appear

3. **Complete Test**
   - Start tour
   - Click through all 7 steps
   - Reload page
   - Tour should NOT appear

4. **Reset Test (Development Only)**
   ```javascript
   // In development mode, tour is exposed as window.__tour__
   window.__tour__.reset();
   location.reload();
   // Tour appears again
   ```

### Keyboard Navigation Test

1. Start tour
2. Press `→` to advance
3. Press `←` to go back
4. Press `Esc` to exit

### Responsive Test

1. Open tour on desktop (1920px)
2. Resize to tablet (768px)
3. Resize to mobile (375px)
4. Verify tooltip stays on screen and buttons stack properly

## Customization

### Adding/Modifying Steps

Edit the `#steps` array in `js/ui/OnboardingTour.js`:

```javascript
#steps = [
    {
        target: '.my-element',           // CSS selector
        title: 'Step Title',             // Header text
        content: 'Step description...',  // Body text
        position: 'bottom'               // top|bottom|left|right
    },
    // ... more steps
];
```

### Changing Colors

Edit `css/onboarding.css`:

```css
/* Highlight color */
.onboarding-highlight {
    box-shadow:
        0 0 0 4px rgba(255, 149, 0, 0.5),  /* Change RGB values */
        /* ... */
}

/* Next button gradient */
.onboarding-btn-next {
    background: linear-gradient(135deg, #ff9500 0%, #ff6b00 100%);
    /* Change to your brand colors */
}
```

### Adjusting Timing

In `js/main.js`:

```javascript
setTimeout(() => {
    if (onboardingTour.shouldShow()) {
        onboardingTour.start();
    }
}, 1000);  // Change delay in milliseconds
```

### Changing LocalStorage Key

In `js/ui/OnboardingTour.js`:

```javascript
#storageKey = 'jamf-tour-completed';  // Change to your key
```

## Browser Support

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile Safari**: Full support
- **IE11**: Not supported (uses ES6 features)

## Accessibility Features

- **ARIA Labels**: `role="dialog"`, `role="alertdialog"`, `aria-live="polite"`
- **Keyboard Navigation**: Full keyboard control
- **Focus Management**: Focus trapped in tooltip during tour
- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **High Contrast**: Enhanced borders in high contrast mode
- **Screen Reader**: Descriptive labels and live regions

## Performance

- **Lightweight**: ~15KB total (JS + CSS uncompressed)
- **No Dependencies**: Zero external libraries
- **Lazy Loaded**: Only runs on first visit
- **Smooth Animations**: CSS transitions with GPU acceleration
- **Memory Efficient**: Cleans up DOM elements after completion

## Common Issues

### Tour Doesn't Start

**Issue**: Tour doesn't appear on first visit

**Solutions**:
1. Check console for errors
2. Verify `localStorage` is available
3. Ensure all target elements exist in DOM
4. Check if tour was previously completed:
   ```javascript
   localStorage.getItem('jamf-tour-completed')
   ```

### Element Not Found

**Issue**: Console shows "Target not found" warning

**Solutions**:
1. Verify target selector is correct
2. Ensure element exists when tour starts
3. Increase initialization delay in `main.js`
4. Tour will automatically skip to next step

### Tooltip Off Screen

**Issue**: Tooltip appears outside viewport

**Solutions**:
1. Tooltip auto-adjusts position
2. If issue persists, check CSS media queries
3. Verify viewport meta tag in HTML

### Tour Reappears After Completion

**Issue**: Tour shows again on page reload

**Solutions**:
1. Check if localStorage is being cleared
2. Verify browser allows localStorage
3. Check for errors in `#complete()` method

## Development Tips

### Debugging

Enable development mode features:
```javascript
// In DevTools Console
window.__tour__           // Access tour instance
window.__tour__.reset()   // Reset completion state
window.__tour__.start()   // Manually start tour
```

### Live Development

When editing `OnboardingTour.js`:
1. Save changes
2. Run `window.__tour__.reset()` in console
3. Reload page
4. Tour starts with new changes

### Testing Different States

```javascript
// Test "skip" state
localStorage.setItem('jamf-tour-completed', 'true');
location.reload();

// Test "first visit" state
localStorage.removeItem('jamf-tour-completed');
location.reload();
```

## Future Enhancements

Potential improvements:

1. **Multi-language Support**: Translate tour content
2. **Analytics**: Track completion rates and drop-off points
3. **Custom Themes**: User-selectable color schemes
4. **Video Integration**: Embed demo videos in steps
5. **Conditional Steps**: Show different steps based on user role
6. **Progress Saving**: Resume tour from last step
7. **Interactive Elements**: Allow interaction with highlighted elements
8. **Branching Paths**: Different tours for different user types

## Support

For issues or questions:
1. Check console for errors
2. Review this documentation
3. Test in incognito/private mode
4. Clear localStorage and retry
5. Contact development team

## License

MIT License - Part of Apple Edu Assistant

## Credits

- **Developer**: Jamf Assistant Team
- **Version**: 1.0.0
- **Last Updated**: 2025-12-24
