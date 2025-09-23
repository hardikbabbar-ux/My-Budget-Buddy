// Developer Mode System - Hide Debug Tools from Regular Users
console.log('🔒 Developer Mode System Loaded');

class DeveloperMode {
    constructor() {
        this.isDeveloperMode = false;
        this.secretSequence = ['d', 'e', 'v', 'm', 'o', 'd', 'e']; // "devmode"
        this.currentSequence = [];
        this.lastKeyTime = 0;
        this.sequenceTimeout = 2000; // 2 seconds timeout between keys
        
        this.init();
    }

    init() {
        this.checkDeveloperMode();
        this.setupKeySequenceListener();
        this.hideDebugElements();
        this.setupDeveloperConsoleCommands();
        console.log('🔒 Developer Mode System initialized');
    }

    checkDeveloperMode() {
        // Check if developer mode was previously enabled
        const devMode = localStorage.getItem('budgetBuddyDevMode');
        const devModeTimestamp = localStorage.getItem('budgetBuddyDevModeTime');
        
        // Developer mode expires after 24 hours for security
        const now = Date.now();
        const expiryTime = 24 * 60 * 60 * 1000; // 24 hours
        
        if (devMode === 'true' && devModeTimestamp && (now - parseInt(devModeTimestamp)) < expiryTime) {
            this.enableDeveloperMode(false); // Don't show notification on reload
        }
    }

    setupKeySequenceListener() {
        document.addEventListener('keydown', (e) => {
            const now = Date.now();
            
            // Reset sequence if too much time has passed
            if (now - this.lastKeyTime > this.sequenceTimeout) {
                this.currentSequence = [];
            }
            
            this.lastKeyTime = now;
            
            // Add key to sequence (only letters, case insensitive)
            if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
                this.currentSequence.push(e.key.toLowerCase());
                
                // Keep only the last N keys where N is the secret sequence length
                if (this.currentSequence.length > this.secretSequence.length) {
                    this.currentSequence.shift();
                }
                
                // Check if sequence matches
                if (this.arraysEqual(this.currentSequence, this.secretSequence)) {
                    this.toggleDeveloperMode();
                    this.currentSequence = []; // Reset sequence
                }
            }
        });

        // Alternative activation methods
        this.setupAlternativeActivation();
    }

    setupAlternativeActivation() {
        // Ctrl+Shift+D+E+V activation
        let ctrlShiftPressed = false;
        let devSequence = [];
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey) {
                ctrlShiftPressed = true;
                
                if (['d', 'e', 'v'].includes(e.key.toLowerCase())) {
                    devSequence.push(e.key.toLowerCase());
                    
                    if (devSequence.join('') === 'dev') {
                        this.toggleDeveloperMode();
                        devSequence = [];
                    }
                }
            } else {
                ctrlShiftPressed = false;
                devSequence = [];
            }
        });

        document.addEventListener('keyup', (e) => {
            if (!e.ctrlKey || !e.shiftKey) {
                ctrlShiftPressed = false;
                devSequence = [];
            }
        });
    }

    arraysEqual(a, b) {
        return a.length === b.length && a.every((val, i) => val === b[i]);
    }

    toggleDeveloperMode() {
        if (this.isDeveloperMode) {
            this.disableDeveloperMode();
        } else {
            this.enableDeveloperMode(true);
        }
    }

    enableDeveloperMode(showNotification = true) {
        this.isDeveloperMode = true;
        localStorage.setItem('budgetBuddyDevMode', 'true');
        localStorage.setItem('budgetBuddyDevModeTime', Date.now().toString());
        
        this.showDebugElements();
        
        if (showNotification) {
            this.showDeveloperNotification('🔓 Developer Mode Enabled', 'success');
            console.log('🔓 Developer Mode ENABLED');
            console.log('Available Debug Commands:');
            console.log('- debugBudgetSetup()');
            console.log('- debugExpenseDeletion()');
            console.log('- testCategorySpending()');
            console.log('- testExportFunctionality()');
            console.log('- runExportTest()');
            console.log('- fixToolsDropdown()');
            console.log('- Type "devmode" again to disable');
        }
        
        // Add developer indicator
        this.addDeveloperIndicator();
    }

    disableDeveloperMode() {
        this.isDeveloperMode = false;
        localStorage.removeItem('budgetBuddyDevMode');
        localStorage.removeItem('budgetBuddyDevModeTime');
        
        this.hideDebugElements();
        this.removeDeveloperIndicator();
        
        this.showDeveloperNotification('🔒 Developer Mode Disabled', 'info');
        console.log('🔒 Developer Mode DISABLED');
    }

    hideDebugElements() {
        // Hide debug tools from navigation
        const debugElements = [
            '.debug-tool-item',
            '.developer-only'
        ];

        debugElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.display = 'none';
                element.classList.add('hidden-debug-tool');
            });
        });

        // Hide debug menu items from tools dropdown
        this.hideDebugMenuItems();
    }

    showDebugElements() {
        // Show debug tools in navigation
        const debugElements = document.querySelectorAll('.hidden-debug-tool');
        debugElements.forEach(element => {
            element.style.display = '';
            element.classList.remove('hidden-debug-tool');
        });

        // Show debug menu items in tools dropdown
        this.showDebugMenuItems();
    }

    hideDebugMenuItems() {
        // Hide debug-related items from the tools dropdown
        const toolsMenu = document.getElementById('desktopToolsMenu');
        if (toolsMenu) {
            const debugItems = toolsMenu.querySelectorAll('.debug-tool-item');
            debugItems.forEach(item => {
                item.style.display = 'none';
                item.classList.add('hidden-debug-tool');
            });
        }

        // Update tools dropdown to show user-friendly items only
        this.updateToolsDropdownForUsers();
    }

    showDebugMenuItems() {
        // Show debug-related items in the tools dropdown
        const toolsMenu = document.getElementById('desktopToolsMenu');
        if (toolsMenu) {
            const debugItems = toolsMenu.querySelectorAll('.hidden-debug-tool');
            debugItems.forEach(item => {
                item.style.display = '';
                item.classList.remove('hidden-debug-tool');
            });
        }

        // Restore full tools dropdown
        this.updateToolsDropdownForDevelopers();
    }

    updateToolsDropdownForUsers() {
        const toolsMenu = document.getElementById('desktopToolsMenu');
        if (!toolsMenu) return;

        // Keep only user-friendly tools visible
        const userFriendlyItems = [
            '#showAllMenuBtn',
            '#appSettingsBtn'
        ];

        // Hide debug-related items
        const allItems = toolsMenu.querySelectorAll('.tool-item');
        allItems.forEach(item => {
            const isUserFriendly = userFriendlyItems.some(selector => 
                item.matches(selector) || item.id === selector.substring(1)
            );
            
            if (!isUserFriendly) {
                item.style.display = 'none';
                item.classList.add('hidden-debug-tool');
            }
        });
    }

    updateToolsDropdownForDevelopers() {
        const toolsMenu = document.getElementById('desktopToolsMenu');
        if (!toolsMenu) return;

        // Show all items for developers
        const allItems = toolsMenu.querySelectorAll('.tool-item');
        allItems.forEach(item => {
            item.style.display = '';
            item.classList.remove('hidden-debug-tool');
        });
    }

    addDeveloperIndicator() {
        // Add a small developer mode indicator
        const indicator = document.createElement('div');
        indicator.id = 'developer-mode-indicator';
        indicator.innerHTML = '🔓 DEV';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #ef4444;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            z-index: 10001;
            font-family: monospace;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s;
        `;
        
        indicator.addEventListener('click', () => {
            this.disableDeveloperMode();
        });
        
        indicator.addEventListener('mouseenter', () => {
            indicator.style.opacity = '1';
        });
        
        indicator.addEventListener('mouseleave', () => {
            indicator.style.opacity = '0.7';
        });
        
        document.body.appendChild(indicator);
    }

    removeDeveloperIndicator() {
        const indicator = document.getElementById('developer-mode-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    showDeveloperNotification(message, type) {
        // Use existing notification system if available
        if (window.expenseManager && typeof window.expenseManager.showNotification === 'function') {
            window.expenseManager.showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: ${type === 'success' ? '#22c55e' : '#3b82f6'};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 10000;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideInRight 0.3s ease-out;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    }

    setupDeveloperConsoleCommands() {
        // Global developer commands
        window.enableDevMode = () => this.enableDeveloperMode(true);
        window.disableDevMode = () => this.disableDeveloperMode();
        window.toggleDevMode = () => this.toggleDeveloperMode();
        
        // Developer info command
        window.devInfo = () => {
            console.log('🔒 Budget Buddy Developer Mode');
            console.log('Status:', this.isDeveloperMode ? 'ENABLED' : 'DISABLED');
            console.log('Activation: Type "devmode" or press Ctrl+Shift+D+E+V');
            console.log('Commands: enableDevMode(), disableDevMode(), toggleDevMode()');
        };
    }

    // Public method to check if developer mode is active
    isActive() {
        return this.isDeveloperMode;
    }
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .hidden-debug-tool {
        display: none !important;
    }
`;
document.head.appendChild(style);

// Initialize developer mode system
document.addEventListener('DOMContentLoaded', function() {
    window.developerMode = new DeveloperMode();
    console.log('🔒 Developer Mode System ready');
    console.log('💡 Tip: Type "devmode" to enable developer tools');
});

// Fallback initialization
window.addEventListener('load', function() {
    if (!window.developerMode) {
        window.developerMode = new DeveloperMode();
    }
});
