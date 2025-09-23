// PWA Installation Helper for Budget Buddy
console.log('📱 PWA Installer loaded');

class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isInstallable = false;
        this.init();
    }

    init() {
        this.checkInstallationStatus();
        this.setupEventListeners();
        this.addInstallPrompt();
        console.log('✅ PWA Installer initialized');
    }

    checkInstallationStatus() {
        // Check if app is already installed
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            console.log('✅ App is already installed');
            return;
        }

        // Check if running as PWA
        if (window.navigator.standalone === true) {
            this.isInstalled = true;
            console.log('✅ App is running as PWA (iOS)');
            return;
        }

        console.log('📱 App not installed - installation available');
    }

    setupEventListeners() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('💡 PWA installation prompt available');
            e.preventDefault();
            this.deferredPrompt = e;
            this.isInstallable = true;
            this.showInstallOption();
        });

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA installed successfully');
            this.isInstalled = true;
            this.deferredPrompt = null;
            this.hideInstallOption();
            this.showSuccessMessage();
        });

        // Check for installation periodically
        setInterval(() => {
            this.checkInstallationStatus();
        }, 5000);
    }

    addInstallPrompt() {
        // Add install prompt to existing menu system
        if (window.menuSystem) {
            // Integration with menu system will be handled by menu-system.js
            console.log('🔗 PWA installer integrated with menu system');
        }
    }

    showInstallOption() {
        if (this.isInstalled) return;

        // Add install option to menu system
        this.addInstallMenuItem();
        
        // Show notification about installation availability
        setTimeout(() => {
            this.showInstallNotification();
        }, 3000);
    }

    hideInstallOption() {
        // Remove install option from menu
        const installMenuItem = document.getElementById('pwa-install-menu-item');
        if (installMenuItem) {
            installMenuItem.remove();
        }
    }

    addInstallMenuItem() {
        // This will be integrated with the menu system
        console.log('📱 Install option available in menu');
    }

    async installApp() {
        if (!this.deferredPrompt) {
            this.showInstallInstructions();
            return false;
        }

        try {
            const result = await this.deferredPrompt.prompt();
            console.log('Install prompt result:', result);

            if (result.outcome === 'accepted') {
                console.log('✅ User accepted installation');
                return true;
            } else {
                console.log('❌ User dismissed installation');
                return false;
            }
        } catch (error) {
            console.error('❌ Installation failed:', error);
            return false;
        } finally {
            this.deferredPrompt = null;
        }
    }

    showInstallNotification() {
        if (this.isInstalled) return;

        const notification = {
            title: '📱 Install Budget Buddy',
            message: 'Install our app for a better experience!',
            type: 'info',
            actions: [
                {
                    text: 'Install Now',
                    action: () => this.installApp()
                },
                {
                    text: 'Later',
                    action: () => console.log('Installation postponed')
                }
            ]
        };

        // Use existing notification system if available
        if (window.expenseManager && typeof window.expenseManager.showNotification === 'function') {
            window.expenseManager.showNotification(notification.message, notification.type);
        } else {
            // Fallback notification
            this.showFallbackNotification(notification);
        }
    }

    showFallbackNotification(notification) {
        const notificationEl = document.createElement('div');
        notificationEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
            font-family: 'Inter', sans-serif;
        `;

        notificationEl.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 10px;">${notification.title}</div>
            <div style="margin-bottom: 15px; opacity: 0.9;">${notification.message}</div>
            <div style="display: flex; gap: 10px;">
                <button id="installNowBtn" style="
                    background: white;
                    color: #3b82f6;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    flex: 1;
                ">Install Now</button>
                <button id="laterBtn" style="
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.3);
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    flex: 1;
                ">Later</button>
            </div>
        `;

        document.body.appendChild(notificationEl);

        // Add event listeners
        notificationEl.querySelector('#installNowBtn').addEventListener('click', () => {
            this.installApp();
            notificationEl.remove();
        });

        notificationEl.querySelector('#laterBtn').addEventListener('click', () => {
            notificationEl.remove();
        });

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notificationEl.parentNode) {
                notificationEl.remove();
            }
        }, 10000);
    }

    showInstallInstructions() {
        const instructions = this.getInstallInstructions();
        
        if (window.expenseManager && typeof window.expenseManager.showNotification === 'function') {
            window.expenseManager.showNotification(instructions, 'info');
        } else {
            alert(instructions);
        }
    }

    getInstallInstructions() {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (userAgent.includes('chrome')) {
            return '📱 To install: Look for the install icon in the address bar or go to Chrome menu → "Install Budget Buddy"';
        } else if (userAgent.includes('firefox')) {
            return '📱 To install: Firefox has limited PWA support. Try Chrome or Edge for best experience.';
        } else if (userAgent.includes('safari')) {
            return '📱 To install: Tap the Share button and select "Add to Home Screen"';
        } else if (userAgent.includes('edge')) {
            return '📱 To install: Click the Apps menu → "Install this site as an app"';
        } else {
            return '📱 To install: Look for install options in your browser menu or try Chrome/Edge for best support.';
        }
    }

    showSuccessMessage() {
        const message = '🎉 Budget Buddy installed successfully! You can now access it from your home screen or app launcher.';
        
        if (window.expenseManager && typeof window.expenseManager.showNotification === 'function') {
            window.expenseManager.showNotification(message, 'success');
        } else {
            alert(message);
        }
    }

    // Public methods
    isAppInstalled() {
        return this.isInstalled;
    }

    isAppInstallable() {
        return this.isInstallable;
    }

    triggerInstall() {
        return this.installApp();
    }

    openDiagnostic() {
        window.open('pwa-install-fix.html', '_blank');
    }
}

// Initialize PWA installer
document.addEventListener('DOMContentLoaded', function() {
    window.pwaInstaller = new PWAInstaller();
    console.log('✅ PWA Installer ready');
});

// Global functions for easy access
window.installBudgetBuddy = function() {
    if (window.pwaInstaller) {
        return window.pwaInstaller.triggerInstall();
    } else {
        console.log('PWA installer not ready yet');
        return false;
    }
};

window.checkPWAStatus = function() {
    if (window.pwaInstaller) {
        console.log('📱 PWA Status:');
        console.log('- Installed:', window.pwaInstaller.isAppInstalled());
        console.log('- Installable:', window.pwaInstaller.isAppInstallable());
    } else {
        console.log('PWA installer not ready yet');
    }
};

window.openPWADiagnostic = function() {
    if (window.pwaInstaller) {
        window.pwaInstaller.openDiagnostic();
    } else {
        window.open('pwa-install-fix.html', '_blank');
    }
};
