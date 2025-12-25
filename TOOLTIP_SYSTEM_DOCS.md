# Tooltip System Documentation

## Overview

A lightweight, accessible tooltip system implemented with vanilla JavaScript and CSS. No external libraries required.

## Features

- **300ms delay** before showing tooltips (configurable per element)
- **Smooth fade-in animation** with subtle transform
- **Intelligent positioning** that prevents tooltips from going outside viewport
- **Keyboard accessible** (Escape key closes tooltips, works with focus/blur)
- **ARIA compliant** with proper `role="tooltip"` and `aria-describedby`
- **Mobile-friendly** with tap support
- **Dark mode support** with automatic theme switching
- **Multiple variants** (default, success, warning, error)

## Usage

### Basic Tooltip

Add the `data-tooltip` attribute to any element:

```html
<button data-tooltip="This is a helpful tooltip">
    Click me
</button>
```

### Custom Placement

Use `data-tooltip-placement` to control position (top, bottom, left, right):

```html
<button data-tooltip="Opens menu" data-tooltip-placement="bottom">
    Menu
</button>
```

The system will automatically adjust placement if there's not enough space in the viewport.

### Custom Delay

Override the default 300ms delay:

```html
<input
    type="text"
    data-tooltip="Start typing to search"
    data-tooltip-placement="bottom"
    data-tooltip-delay="500">
```

### Tooltip Variants

Add visual variants for different message types:

```html
<!-- Success tooltip (green) -->
<button data-tooltip="Saved successfully!" data-tooltip-variant="success">
    Save
</button>

<!-- Warning tooltip (orange) -->
<button data-tooltip="This action cannot be undone" data-tooltip-variant="warning">
    Delete
</button>

<!-- Error tooltip (red) -->
<button data-tooltip="Invalid input" data-tooltip-variant="error">
    Submit
</button>
```

### Multiline Tooltips

For longer descriptions:

```html
<button
    data-tooltip="This is a longer tooltip that will wrap to multiple lines"
    data-tooltip-multiline>
    Info
</button>
```

## Implementation Details

### Files

- **css/tooltips.css** - Complete tooltip styling system
- **js/ui/TooltipManager.js** - JavaScript logic for positioning and behavior
- **js/main.js** - Initialization of tooltip system

### Accessibility

The TooltipManager automatically:
- Sets `role="tooltip"` on tooltip elements
- Generates unique IDs for each tooltip
- Links tooltips to triggers with `aria-describedby`
- Supports keyboard navigation (focus/blur)
- Respects `prefers-reduced-motion` for animations

### Positioning Algorithm

1. Get preferred placement from `data-tooltip-placement` or default to `top`
2. Calculate available space in all four directions
3. Check if preferred placement fits in viewport
4. If not, choose placement with most available space
5. Position tooltip and constrain to viewport with 8px padding

### Event Handling

The system uses **event delegation** for optimal performance:
- Single set of listeners on `document`
- Works automatically with dynamically added elements
- No need to re-initialize after content changes

### Mobile Support

On touch devices:
- Tooltips show on tap
- Tap outside or tap the same element again to close
- Prevents default touch behavior to avoid conflicts

## Browser Support

- Modern browsers with ES6 support
- CSS custom properties (CSS variables)
- `requestAnimationFrame`
- Touch events

## Performance

- Event delegation reduces memory overhead
- No external dependencies
- Lightweight CSS (~6KB)
- JavaScript class (~350 lines)

## Customization

### Custom Colors

Override CSS custom properties in your theme:

```css
:root {
    --tooltip-bg: hsl(218, 30%, 18%);
    --tooltip-text: hsl(0, 0%, 100%);
}

[data-theme="dark"] {
    --tooltip-bg-dark: hsl(218, 15%, 25%);
    --tooltip-text-dark: hsl(0, 0%, 95%);
}
```

### Custom Delays

Initialize with different defaults:

```javascript
const tooltipManager = new TooltipManager({
    delay: 500,          // Default delay in ms
    offset: 12,          // Distance from trigger element
    preferredPlacement: 'bottom'  // Default placement
});
```

## Examples in App

### Sidebar Navigation

```html
<li class="nav-item"
    data-section="dashboard"
    data-tooltip="Vista general del ecosistema Apple"
    data-tooltip-placement="right">
    <i class="ri-dashboard-line"></i> Dashboard
</li>
```

### Theme Toggle

```html
<button id="themeToggle"
        class="theme-btn"
        data-tooltip="Cambiar tema claro/oscuro"
        data-tooltip-placement="top">
    <i class="ri-moon-line"></i>
</button>
```

### Chatbot FAB

```html
<div class="chatbot-fab"
     data-tooltip="Abrir asistente con IA"
     data-tooltip-placement="left">
    <i class="ri-robot-line"></i>
</div>
```

### Modal Close Buttons

```html
<button class="modal-close"
        data-tooltip="Cerrar (Esc)"
        data-tooltip-placement="left">
    ✕
</button>
```

## Debugging

The TooltipManager instance is exposed globally:

```javascript
// In development mode, access the manager
window.tooltipManager.refresh();  // Refresh tooltips
window.tooltipManager.hide();     // Force hide active tooltip
window.tooltipManager.destroy();  // Clean up
```

## Best Practices

1. **Keep tooltips concise** - 1-2 sentences maximum
2. **Use for clarification** - Not for critical information
3. **Consistent placement** - Group similar elements with same placement
4. **Don't overuse** - Only add where truly helpful
5. **Test on mobile** - Ensure tooltips work with touch
6. **Consider accessibility** - Tooltips should enhance, not replace, clear labels

## Future Enhancements

Potential improvements:
- [ ] HTML content support (with sanitization)
- [ ] Tooltip icons
- [ ] Animation variants
- [ ] Tooltip groups (show multiple related tooltips)
- [ ] Programmatic API for showing/hiding specific tooltips
