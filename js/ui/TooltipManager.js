/**
 * TooltipManager - Lightweight tooltip system with intelligent positioning
 *
 * Features:
 * - Automatic viewport-aware positioning
 * - 300ms delay before showing
 * - Smooth fade-in animation
 * - Keyboard accessible (ESC to close)
 * - Proper ARIA attributes for screen readers
 * - No external dependencies
 *
 * @class TooltipManager
 */
class TooltipManager {
    constructor(options = {}) {
        this.options = {
            delay: options.delay || 300,
            offset: options.offset || 8,
            className: options.className || '',
            preferredPlacement: options.preferredPlacement || 'top',
            ...options
        };

        this.activeTooltip = null;
        this.showTimeout = null;
        this.currentTrigger = null;

        this.init();
    }

    /**
     * Initialize tooltip system
     */
    init() {
        // Add event listeners to all elements with data-tooltip
        this.bindEvents();

        // Listen for ESC key to close tooltips
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeTooltip) {
                this.hide();
            }
        });

        // Hide tooltip on scroll
        document.addEventListener('scroll', () => {
            if (this.activeTooltip) {
                this.hide();
            }
        }, true);

        // Hide tooltip on window resize
        window.addEventListener('resize', () => {
            if (this.activeTooltip) {
                this.hide();
            }
        });
    }

    /**
     * Bind events to all tooltip triggers
     */
    bindEvents() {
        // Use event delegation for better performance
        document.addEventListener('mouseenter', (e) => {
            const trigger = e.target.closest('[data-tooltip]');
            if (trigger) {
                this.handleMouseEnter(trigger);
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            const trigger = e.target.closest('[data-tooltip]');
            if (trigger) {
                this.handleMouseLeave(trigger);
            }
        }, true);

        document.addEventListener('focus', (e) => {
            const trigger = e.target.closest('[data-tooltip]');
            if (trigger) {
                this.handleFocus(trigger);
            }
        }, true);

        document.addEventListener('blur', (e) => {
            const trigger = e.target.closest('[data-tooltip]');
            if (trigger) {
                this.handleBlur(trigger);
            }
        }, true);

        // Mobile: Show on tap, hide on tap outside
        document.addEventListener('touchstart', (e) => {
            const trigger = e.target.closest('[data-tooltip]');

            if (trigger) {
                e.preventDefault();
                if (this.currentTrigger === trigger && this.activeTooltip) {
                    this.hide();
                } else {
                    this.handleMouseEnter(trigger);
                }
            } else if (this.activeTooltip) {
                this.hide();
            }
        }, { passive: false });
    }

    /**
     * Handle mouse enter on tooltip trigger
     */
    handleMouseEnter(trigger) {
        // Don't show tooltip if disabled
        if (trigger.disabled || trigger.hasAttribute('disabled')) {
            return;
        }

        this.currentTrigger = trigger;

        // Clear any existing timeout
        clearTimeout(this.showTimeout);

        // Get delay from data attribute or use default
        const delay = parseInt(trigger.dataset.tooltipDelay) || this.options.delay;

        // Show tooltip after delay
        this.showTimeout = setTimeout(() => {
            this.show(trigger);
        }, delay);
    }

    /**
     * Handle mouse leave on tooltip trigger
     */
    handleMouseLeave(trigger) {
        clearTimeout(this.showTimeout);

        if (this.currentTrigger === trigger) {
            this.hide();
        }
    }

    /**
     * Handle focus on tooltip trigger
     */
    handleFocus(trigger) {
        this.handleMouseEnter(trigger);
    }

    /**
     * Handle blur on tooltip trigger
     */
    handleBlur(trigger) {
        this.handleMouseLeave(trigger);
    }

    /**
     * Show tooltip for given trigger element
     */
    show(trigger) {
        // Hide any existing tooltip
        this.hide();

        const text = trigger.dataset.tooltip;
        if (!text) return;

        // Create tooltip element
        const tooltip = this.createTooltip(text, trigger);

        // Add to DOM
        document.body.appendChild(tooltip);

        // Position tooltip
        this.position(tooltip, trigger);

        // Store reference
        this.activeTooltip = tooltip;
        this.currentTrigger = trigger;

        // Set ARIA attributes
        const tooltipId = `tooltip-${Date.now()}`;
        tooltip.id = tooltipId;
        trigger.setAttribute('aria-describedby', tooltipId);

        // Show with animation
        requestAnimationFrame(() => {
            tooltip.classList.add('show');
        });
    }

    /**
     * Hide active tooltip
     */
    hide() {
        clearTimeout(this.showTimeout);

        if (this.activeTooltip) {
            this.activeTooltip.classList.remove('show');

            // Remove ARIA attributes
            if (this.currentTrigger) {
                this.currentTrigger.removeAttribute('aria-describedby');
            }

            // Remove from DOM after animation
            setTimeout(() => {
                if (this.activeTooltip && this.activeTooltip.parentNode) {
                    this.activeTooltip.parentNode.removeChild(this.activeTooltip);
                }
                this.activeTooltip = null;
                this.currentTrigger = null;
            }, 200);
        }
    }

    /**
     * Create tooltip DOM element
     */
    createTooltip(text, trigger) {
        const tooltip = document.createElement('div');
        tooltip.className = `tooltip ${this.options.className}`;
        tooltip.setAttribute('role', 'tooltip');

        // Check for tooltip variant (success, warning, error)
        const variant = trigger.dataset.tooltipVariant;
        if (variant) {
            tooltip.classList.add(`tooltip-${variant}`);
        }

        // Create content wrapper
        const content = document.createElement('div');
        content.className = 'tooltip-content';

        // Check if multiline
        if (trigger.dataset.tooltipMultiline !== undefined) {
            content.classList.add('multiline');
        }

        content.textContent = text;

        // Create arrow
        const arrow = document.createElement('div');
        arrow.className = 'tooltip-arrow';

        tooltip.appendChild(content);
        tooltip.appendChild(arrow);

        return tooltip;
    }

    /**
     * Position tooltip relative to trigger with viewport awareness
     */
    position(tooltip, trigger) {
        const triggerRect = trigger.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const offset = this.options.offset;

        // Get preferred placement from data attribute or options
        let placement = trigger.dataset.tooltipPlacement || this.options.preferredPlacement;

        // Calculate available space in each direction
        const space = {
            top: triggerRect.top,
            bottom: window.innerHeight - triggerRect.bottom,
            left: triggerRect.left,
            right: window.innerWidth - triggerRect.right
        };

        // Intelligent placement: choose based on available space
        placement = this.getOptimalPlacement(placement, space, tooltipRect);

        // Set placement data attribute for CSS
        tooltip.setAttribute('data-placement', placement);

        // Calculate position
        let top, left;

        switch (placement) {
            case 'top':
                top = triggerRect.top - tooltipRect.height - offset;
                left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
                break;

            case 'bottom':
                top = triggerRect.bottom + offset;
                left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
                break;

            case 'left':
                top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
                left = triggerRect.left - tooltipRect.width - offset;
                break;

            case 'right':
                top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
                left = triggerRect.right + offset;
                break;
        }

        // Ensure tooltip stays within viewport bounds
        const finalPosition = this.constrainToViewport(top, left, tooltipRect);

        // Apply position
        tooltip.style.top = `${finalPosition.top}px`;
        tooltip.style.left = `${finalPosition.left}px`;
    }

    /**
     * Get optimal placement based on available space
     */
    getOptimalPlacement(preferredPlacement, space, tooltipRect) {
        const requiredSpace = {
            top: tooltipRect.height + this.options.offset + 10,
            bottom: tooltipRect.height + this.options.offset + 10,
            left: tooltipRect.width + this.options.offset + 10,
            right: tooltipRect.width + this.options.offset + 10
        };

        // Check if preferred placement has enough space
        if (space[preferredPlacement] >= requiredSpace[preferredPlacement]) {
            return preferredPlacement;
        }

        // Find placement with most space
        const placements = ['top', 'bottom', 'left', 'right'];
        let bestPlacement = preferredPlacement;
        let maxSpace = 0;

        placements.forEach(placement => {
            if (space[placement] > maxSpace && space[placement] >= requiredSpace[placement]) {
                maxSpace = space[placement];
                bestPlacement = placement;
            }
        });

        // If no placement has enough space, use the one with most space
        if (maxSpace === 0) {
            bestPlacement = placements.reduce((best, current) =>
                space[current] > space[best] ? current : best
            );
        }

        return bestPlacement;
    }

    /**
     * Constrain tooltip position to viewport
     */
    constrainToViewport(top, left, tooltipRect) {
        const padding = 8;
        const maxTop = window.innerHeight - tooltipRect.height - padding;
        const maxLeft = window.innerWidth - tooltipRect.width - padding;

        return {
            top: Math.max(padding, Math.min(top, maxTop)),
            left: Math.max(padding, Math.min(left, maxLeft))
        };
    }

    /**
     * Refresh tooltips (useful after dynamic content changes)
     */
    refresh() {
        this.hide();
        // Event delegation handles new elements automatically
    }

    /**
     * Destroy tooltip manager
     */
    destroy() {
        this.hide();
        // Event delegation uses document listeners, so no need to remove individual listeners
        // Could add cleanup for document listeners if needed
    }
}

// Export for module systems
export { TooltipManager };

// Also make available globally for non-module scripts
if (typeof window !== 'undefined') {
    window.TooltipManager = TooltipManager;
}
