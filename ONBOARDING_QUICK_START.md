# Onboarding Tour - Quick Start Guide

## What's New

A custom-built onboarding tour that automatically guides first-time users through the Apple Edu Assistant interface.

## Files Created

1. **`js/ui/OnboardingTour.js`** (15KB)
   - Main tour logic
   - Step management
   - Keyboard navigation
   - LocalStorage persistence

2. **`css/onboarding.css`** (12KB)
   - Tour styling
   - Highlight effects
   - Responsive design
   - Dark mode support

3. **`ONBOARDING_TOUR_DOCS.md`**
   - Complete documentation
   - API reference
   - Customization guide

## Files Modified

1. **`index.html`**
   - Added: `<link rel="stylesheet" href="css/onboarding.css">`

2. **`js/main.js`**
   - Added: Import statement for OnboardingTour
   - Added: Tour initialization logic after app ready

## How to Test

### Test 1: First Visit (Tour Should Show)

Open browser DevTools Console and run:

```javascript
localStorage.removeItem('jamf-tour-completed');
location.reload();
```

**Expected**: Tour starts automatically after 1 second with Step 1/7

### Test 2: Navigation

During the tour:
- Click "Siguiente" → Should advance to next step
- Click "Anterior" → Should go back (disabled on step 1)
- Press `→` key → Should advance
- Press `←` key → Should go back
- Press `Esc` → Should show confirmation to skip

**Expected**: All navigation works smoothly

### Test 3: Complete Tour

Click through all 7 steps to completion.

```javascript
// After completion, check localStorage
localStorage.getItem('jamf-tour-completed');
```

**Expected**: Returns `"true"`

Then reload the page.

**Expected**: Tour does NOT appear again

### Test 4: Skip Tour

1. Reset tour: `localStorage.removeItem('jamf-tour-completed')`
2. Reload page
3. Click "Saltar tour"
4. Confirm dialog
5. Reload page

**Expected**: Tour does NOT appear again

### Test 5: Development Mode (localhost/127.0.0.1/file://)

Open DevTools Console:

```javascript
// Should see these logs
// [Main] Development mode - tour exposed as window.__tour__
// [Main] Use window.__tour__.reset() to reset the tour

// Test reset function
window.__tour__.reset();
location.reload();
```

**Expected**: Tour appears again after reload

### Test 6: Responsive Design

1. Start tour on desktop (1920px width)
2. Open DevTools and toggle device toolbar
3. Test on:
   - iPad (768px)
   - iPhone (375px)

**Expected**:
- Tooltip stays on screen
- Buttons stack vertically on mobile
- Highlight adjusts to element size

### Test 7: Dark Mode

1. Start tour
2. Click theme toggle button (will close tour)
3. Reset and restart tour
4. Verify colors work in dark mode

**Expected**: Tour is readable in both light and dark modes

## Quick Commands

### Reset Tour (Show Again)
```javascript
localStorage.removeItem('jamf-tour-completed');
location.reload();
```

### Check Tour Status
```javascript
localStorage.getItem('jamf-tour-completed');
// null = not completed
// "true" = completed
```

### Manually Start Tour (Development)
```javascript
window.__tour__.reset();
window.__tour__.start();
```

### Disable Tour Permanently
```javascript
localStorage.setItem('jamf-tour-completed', 'true');
```

## Tour Steps Overview

| Step | Target | Description |
|------|--------|-------------|
| 1 | Dashboard Hero | Welcome message |
| 2 | Sidebar | Navigation guide |
| 3 | Quick Access Grid | Main tools overview |
| 4 | Search Container | Search functionality |
| 5 | Chatbot FAB | AI assistant intro |
| 6 | Theme Toggle | Dark/Light mode |
| 7 | Dashboard Hero | Completion message |

## Keyboard Shortcuts

- `→` or `Enter` - Next step
- `←` - Previous step
- `Esc` - Skip tour (with confirmation)

## Common Issues & Solutions

### Issue: Tour doesn't appear

**Solution 1**: Check localStorage
```javascript
localStorage.getItem('jamf-tour-completed');
// If "true", remove it:
localStorage.removeItem('jamf-tour-completed');
location.reload();
```

**Solution 2**: Check console for errors
- Open DevTools Console (F12)
- Look for errors in red
- Common issue: Elements not found (tour will auto-skip)

### Issue: Elements not highlighted correctly

**Solution**: The tour waits 1 second after app initialization. If elements still don't exist:
- Increase delay in `js/main.js` (line 132):
  ```javascript
  }, 2000);  // Increase from 1000 to 2000
  ```

### Issue: Tour appears every time

**Solution**: Check if localStorage is enabled
```javascript
// Test localStorage
try {
    localStorage.setItem('test', '1');
    localStorage.removeItem('test');
    console.log('LocalStorage works');
} catch(e) {
    console.error('LocalStorage blocked:', e);
}
```

## Integration Details

### Where Tour Starts

`js/main.js` → `initializeApplication()` function:

```javascript
// After app and chatbot initialization
const onboardingTour = new OnboardingTour();

setTimeout(() => {
    if (onboardingTour.shouldShow()) {
        console.log('[Main] Starting onboarding tour');
        onboardingTour.start();
    }
}, 1000);
```

### LocalStorage Key

```javascript
'jamf-tour-completed'  // Stores 'true' when completed
```

### CSS Variables Used

The tour uses existing CSS variables from your theme:
- `--surface-primary` - Background color
- `--text-primary` - Primary text
- `--text-secondary` - Secondary text
- `--text-tertiary` - Tertiary text
- `--border-color` - Borders
- `--surface-secondary` - Hover states

## Performance

- **Load Impact**: Minimal (only loads class definition)
- **Runtime Impact**: Only runs once per user
- **File Size**: 27KB total (JS + CSS uncompressed)
- **Memory**: Cleans up completely after tour ends
- **No Dependencies**: Pure JavaScript/CSS

## Browser Support

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ Mobile Safari (iOS 14+)
❌ IE11 (uses ES6 private fields)

## Next Steps

1. **Test Thoroughly**: Run all 7 tests above
2. **Customize Content**: Edit step descriptions in `js/ui/OnboardingTour.js`
3. **Adjust Styling**: Modify colors in `css/onboarding.css`
4. **Add Analytics**: Track tour completion rates (future enhancement)

## Need Help?

See `ONBOARDING_TOUR_DOCS.md` for complete documentation including:
- Full API reference
- Customization guide
- Advanced features
- Troubleshooting
- Future enhancements

## Screenshots

The tour will highlight these elements in sequence:

1. **Dashboard Hero** - Large greeting section at top
2. **Sidebar** - Left navigation panel
3. **Quick Access Grid** - 4 cards (ASM, Jamf, Aula, Chatbot)
4. **Search Container** - Search bar in top header
5. **Chatbot FAB** - Floating action button (bottom right)
6. **Theme Toggle** - Moon/sun icon in sidebar footer
7. **Dashboard Hero** - Back to hero for completion

Each element gets an orange glowing border with a pulsing animation, and a white tooltip card with:
- Title
- Description
- Progress bar
- Navigation buttons
- Step counter (e.g., "Paso 3 de 7")

## Done!

The onboarding tour is now fully integrated and ready to use. Test it in your browser to see it in action!
