// Enhanced Menu System for Budget Buddy
console.log('📋 Menu System Loaded');

// Menu system class
class MenuSystem {
    constructor() {
        this.isMenuModalOpen = false;
        this.init();
    }

    init() {
        this.createMenuModal();
        this.setupEventListeners();
        console.log('✅ Menu System initialized');
    }

    createMenuModal() {
        // Create menu modal HTML
        const menuModalHTML = `
            <div id="menuModal" class="menu-modal" style="display: none;">
                <div class="menu-modal-overlay"></div>
                <div class="menu-modal-content">
                    <div class="menu-modal-header">
                        <h2>📋 All Menu Options & Tools</h2>
                        <button class="menu-modal-close" id="closeMenuModal">&times;</button>
                    </div>
                    <div class="menu-modal-body">
                        <div class="menu-section">
                            <h3>🧭 Navigation</h3>
                            <div class="menu-grid">
                                <button class="menu-item" onclick="menuSystem.navigateTo('#home')">
                                    <i class="fas fa-home"></i>
                                    <span>Home</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.navigateTo('#expense-manager')">
                                    <i class="fas fa-calculator"></i>
                                    <span>Expense Manager</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.navigateTo('#piggy-bank')">
                                    <i class="fas fa-piggy-bank"></i>
                                    <span>Piggy Bank</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.navigateTo('#features')">
                                    <i class="fas fa-star"></i>
                                    <span>Features</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.navigateTo('#how-it-works')">
                                    <i class="fas fa-cogs"></i>
                                    <span>How it Works</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.navigateTo('#benefits')">
                                    <i class="fas fa-trophy"></i>
                                    <span>Benefits</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.navigateTo('#team')">
                                    <i class="fas fa-users"></i>
                                    <span>Our Team</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.navigateTo('#contact')">
                                    <i class="fas fa-envelope"></i>
                                    <span>Contact</span>
                                </button>
                            </div>
                        </div>

                        <div class="menu-section">
                            <h3>💰 Budget Tools</h3>
                            <div class="menu-grid">
                                <button class="menu-item" onclick="menuSystem.setupBudget()">
                                    <i class="fas fa-chart-pie"></i>
                                    <span>Setup Budget</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.addExpense()">
                                    <i class="fas fa-plus-circle"></i>
                                    <span>Add Expense</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.clearExpenses()">
                                    <i class="fas fa-trash"></i>
                                    <span>Clear Expenses</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.exportData()">
                                    <i class="fas fa-download"></i>
                                    <span>Export Report</span>
                                </button>
                            </div>
                        </div>

                        <div class="menu-section">
                            <h3>🐷 Savings Tools</h3>
                            <div class="menu-grid">
                                <button class="menu-item" onclick="menuSystem.addGoal()">
                                    <i class="fas fa-bullseye"></i>
                                    <span>Add Goal</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.quickSave()">
                                    <i class="fas fa-coins"></i>
                                    <span>Quick Save</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.withdraw()">
                                    <i class="fas fa-money-bill-wave"></i>
                                    <span>Withdraw</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.exportSavings()">
                                    <i class="fas fa-file-export"></i>
                                    <span>Export Savings</span>
                                </button>
                            </div>
                        </div>

                        <div class="menu-section developer-only" style="display: none;">
                            <h3>🔧 Debug & Testing Tools</h3>
                            <div class="menu-grid">
                                <button class="menu-item" onclick="menuSystem.debugExpenses()">
                                    <i class="fas fa-bug"></i>
                                    <span>Debug Expenses</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.debugGoals()">
                                    <i class="fas fa-search"></i>
                                    <span>Debug Goals</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.debugBudget()">
                                    <i class="fas fa-chart-line"></i>
                                    <span>Debug Budget</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.testCategorySpending()">
                                    <i class="fas fa-vial"></i>
                                    <span>Test Categories</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.createTestData()">
                                    <i class="fas fa-database"></i>
                                    <span>Create Test Data</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.resetAllData()">
                                    <i class="fas fa-redo"></i>
                                    <span>Reset All Data</span>
                                </button>
                            </div>
                        </div>

                        <div class="menu-section">
                            <h3>📱 App Installation</h3>
                            <div class="menu-grid">
                                <button class="menu-item" onclick="menuSystem.installApp()">
                                    <i class="fas fa-download"></i>
                                    <span>Install App</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.checkPWAStatus()">
                                    <i class="fas fa-info-circle"></i>
                                    <span>Installation Status</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.openInstallGuide()">
                                    <i class="fas fa-question-circle"></i>
                                    <span>Installation Help</span>
                                </button>
                            </div>
                        </div>

                        <div class="menu-section">
                            <h3>⚙️ App Settings</h3>
                            <div class="menu-grid">
                                <button class="menu-item" onclick="menuSystem.openIconCustomizer()">
                                    <i class="fas fa-palette"></i>
                                    <span>Customize Icons</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.openTestSuite()">
                                    <i class="fas fa-flask"></i>
                                    <span>Test Suite</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.viewConsole()">
                                    <i class="fas fa-terminal"></i>
                                    <span>View Console</span>
                                </button>
                                <button class="menu-item" onclick="menuSystem.installApp()">
                                    <i class="fas fa-mobile-alt"></i>
                                    <span>Install App</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add to body
        document.body.insertAdjacentHTML('beforeend', menuModalHTML);

        // Add CSS styles
        this.addMenuStyles();
    }

    addMenuStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .menu-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .menu-modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
            }

            .menu-modal-content {
                position: relative;
                background: white;
                border-radius: 20px;
                max-width: 90vw;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                animation: menuModalSlideIn 0.3s ease-out;
            }

            @keyframes menuModalSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }

            .menu-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 25px 30px;
                border-bottom: 2px solid #f1f5f9;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 20px 20px 0 0;
            }

            .menu-modal-header h2 {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 600;
            }

            .menu-modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                padding: 0;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
            }

            .menu-modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .menu-modal-body {
                padding: 30px;
            }

            .menu-section {
                margin-bottom: 30px;
            }

            .menu-section:last-child {
                margin-bottom: 0;
            }

            .menu-section h3 {
                color: #374151;
                margin-bottom: 15px;
                font-size: 1.2rem;
                font-weight: 600;
                border-bottom: 2px solid #e2e8f0;
                padding-bottom: 8px;
            }

            .menu-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
            }

            .menu-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 20px;
                background: linear-gradient(135deg, #f8fafc, #e2e8f0);
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-decoration: none;
                color: #374151;
                font-weight: 500;
            }

            .menu-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                border-color: #22c55e;
                background: linear-gradient(135deg, #f0fdf4, #dcfce7);
            }

            .menu-item i {
                font-size: 2rem;
                margin-bottom: 10px;
                color: #22c55e;
            }

            .menu-item span {
                font-size: 0.9rem;
                text-align: center;
            }

            @media (max-width: 768px) {
                .menu-modal-content {
                    max-width: 95vw;
                    max-height: 95vh;
                }

                .menu-grid {
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                }

                .menu-item {
                    padding: 15px;
                }

                .menu-item i {
                    font-size: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Show all menu button
        const showAllMenuBtn = document.getElementById('showAllMenuBtn');
        if (showAllMenuBtn) {
            showAllMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showMenuModal();
            });
        }

        // Debug tools button
        const debugToolsBtn = document.getElementById('debugToolsBtn');
        if (debugToolsBtn) {
            debugToolsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDebugTools();
            });
        }

        // App settings button
        const appSettingsBtn = document.getElementById('appSettingsBtn');
        if (appSettingsBtn) {
            appSettingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAppSettings();
            });
        }

        // Close modal events
        document.addEventListener('click', (e) => {
            if (e.target.id === 'closeMenuModal' || e.target.classList.contains('menu-modal-overlay')) {
                this.hideMenuModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuModalOpen) {
                this.hideMenuModal();
            }
        });
    }

    showMenuModal() {
        const modal = document.getElementById('menuModal');
        if (modal) {
            modal.style.display = 'flex';
            this.isMenuModalOpen = true;
            document.body.style.overflow = 'hidden';
            
            // Show/hide developer sections based on developer mode
            this.updateDeveloperSections();
            
            console.log('📋 Menu modal opened');
        }
    }

    updateDeveloperSections() {
        const developerSections = document.querySelectorAll('.developer-only');
        const isDeveloperMode = window.developerMode && window.developerMode.isActive();
        
        developerSections.forEach(section => {
            if (isDeveloperMode) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }

    hideMenuModal() {
        const modal = document.getElementById('menuModal');
        if (modal) {
            modal.style.display = 'none';
            this.isMenuModalOpen = false;
            document.body.style.overflow = '';
            console.log('📋 Menu modal closed');
        }
    }

    // Navigation methods
    navigateTo(section) {
        console.log(`🧭 Navigating to: ${section}`);
        document.querySelector(section)?.scrollIntoView({ behavior: 'smooth' });
        this.hideMenuModal();
    }

    // Budget tool methods
    setupBudget() {
        console.log('💰 Setup Budget clicked');
        this.hideMenuModal();
        if (window.expenseManager) {
            document.getElementById('monthlyIncome')?.focus();
        } else {
            alert('Please wait for the expense manager to load');
        }
    }

    addExpense() {
        console.log('➕ Add Expense clicked');
        this.hideMenuModal();
        if (window.expenseManager) {
            document.getElementById('expenseDescription')?.focus();
        } else {
            alert('Please wait for the expense manager to load');
        }
    }

    clearExpenses() {
        console.log('🗑️ Clear Expenses clicked');
        this.hideMenuModal();
        if (window.expenseManager && typeof window.expenseManager.clearExpenses === 'function') {
            window.expenseManager.clearExpenses();
        } else {
            alert('Expense manager not available');
        }
    }

    exportData() {
        console.log('📊 Export Data clicked');
        this.hideMenuModal();
        if (window.expenseManager && typeof window.expenseManager.exportData === 'function') {
            window.expenseManager.exportData();
        } else {
            alert('Export function not available');
        }
    }

    // Savings tool methods
    addGoal() {
        console.log('🎯 Add Goal clicked');
        this.hideMenuModal();
        if (window.piggyBank) {
            document.getElementById('addGoalBtn')?.click();
        } else {
            alert('Please wait for the piggy bank to load');
        }
    }

    quickSave() {
        console.log('💰 Quick Save clicked');
        this.hideMenuModal();
        this.navigateTo('#piggy-bank');
    }

    withdraw() {
        console.log('💸 Withdraw clicked');
        this.hideMenuModal();
        if (window.piggyBank) {
            document.getElementById('withdrawBtn')?.click();
        } else {
            alert('Please wait for the piggy bank to load');
        }
    }

    exportSavings() {
        console.log('📊 Export Savings clicked');
        this.hideMenuModal();
        if (window.piggyBank) {
            document.getElementById('exportSavingsBtn')?.click();
        } else {
            alert('Piggy bank not available');
        }
    }

    // Debug methods
    debugExpenses() {
        console.log('🐛 Debug Expenses clicked');
        this.hideMenuModal();
        if (typeof window.debugExpenseDeletion === 'function') {
            window.debugExpenseDeletion();
        } else {
            console.log('Debug expenses function not available');
        }
    }

    debugGoals() {
        console.log('🔍 Debug Goals clicked');
        this.hideMenuModal();
        if (typeof window.debugGoals === 'function') {
            window.debugGoals();
        } else {
            console.log('Debug goals function not available');
        }
    }

    debugBudget() {
        console.log('📊 Debug Budget clicked');
        this.hideMenuModal();
        if (typeof window.debugBudgetSetup === 'function') {
            window.debugBudgetSetup();
        } else {
            console.log('Debug budget function not available');
        }
    }

    testCategorySpending() {
        console.log('🧪 Test Category Spending clicked');
        this.hideMenuModal();
        if (typeof window.testCategorySpending === 'function') {
            window.testCategorySpending();
        } else {
            console.log('Test category spending function not available');
        }
    }

    createTestData() {
        console.log('🗂️ Create Test Data clicked');
        this.hideMenuModal();
        if (typeof window.createTestExpenses === 'function') {
            window.createTestExpenses();
        }
        if (typeof window.createCategoryTestExpenses === 'function') {
            window.createCategoryTestExpenses();
        }
    }

    resetAllData() {
        console.log('🔄 Reset All Data clicked');
        this.hideMenuModal();
        if (confirm('Are you sure you want to reset ALL data? This cannot be undone!')) {
            if (typeof window.resetAllBudgetBuddyData === 'function') {
                window.resetAllBudgetBuddyData();
            } else {
                console.log('Reset function not available');
            }
        }
    }

    // App settings methods
    openIconCustomizer() {
        console.log('🎨 Icon Customizer clicked');
        this.hideMenuModal();
        window.open('icon-customizer.html', '_blank');
    }

    openTestSuite() {
        console.log('🧪 Test Suite clicked');
        this.hideMenuModal();
        window.open('test-expense-deletion.html', '_blank');
    }

    // PWA Installation Methods
    async installApp() {
        console.log('📱 Install app requested');
        
        if (window.pwaInstaller) {
            const success = await window.pwaInstaller.triggerInstall();
            if (success) {
                this.showNotification('🎉 App installation started!', 'success');
            } else {
                this.showInstallInstructions();
            }
        } else {
            this.showInstallInstructions();
        }
        
        this.hideMenuModal();
    }

    checkPWAStatus() {
        console.log('📱 Checking PWA status');
        
        let statusMessage = '📱 PWA Status:\n\n';
        
        if (window.pwaInstaller) {
            const isInstalled = window.pwaInstaller.isAppInstalled();
            const isInstallable = window.pwaInstaller.isAppInstallable();
            
            statusMessage += `✅ Installed: ${isInstalled ? 'Yes' : 'No'}\n`;
            statusMessage += `📥 Installable: ${isInstallable ? 'Yes' : 'No'}\n`;
            statusMessage += `🌐 Protocol: ${location.protocol}\n`;
            statusMessage += `🔧 Service Worker: ${'serviceWorker' in navigator ? 'Supported' : 'Not Supported'}\n`;
            
            if (isInstalled) {
                statusMessage += '\n🎉 Budget Buddy is installed and ready to use!';
            } else if (isInstallable) {
                statusMessage += '\n💡 Ready to install! Use "Install App" option.';
            } else {
                statusMessage += '\n⚠️ Installation not available. Check requirements.';
            }
        } else {
            statusMessage += '⚠️ PWA installer not ready.\n';
            statusMessage += 'Try refreshing the page or check console for errors.';
        }
        
        alert(statusMessage);
        this.hideMenuModal();
    }

    openInstallGuide() {
        console.log('📖 Opening installation guide');
        window.open('pwa-install-fix.html', '_blank');
        this.hideMenuModal();
    }

    showInstallInstructions() {
        const userAgent = navigator.userAgent.toLowerCase();
        let instructions = '📱 How to Install Budget Buddy:\n\n';
        
        if (userAgent.includes('chrome')) {
            instructions += '🔍 Look for the install icon (⊕) in the address bar\n';
            instructions += '📋 Or go to Chrome menu → "Install Budget Buddy"\n';
        } else if (userAgent.includes('edge')) {
            instructions += '📋 Click Apps menu → "Install this site as an app"\n';
        } else if (userAgent.includes('safari')) {
            instructions += '📤 Tap Share button → "Add to Home Screen"\n';
        } else if (userAgent.includes('firefox')) {
            instructions += '⚠️ Firefox has limited PWA support\n';
            instructions += '💡 Try Chrome or Edge for best experience\n';
        } else {
            instructions += '🔍 Look for install options in your browser menu\n';
        }
        
        instructions += '\n🛠️ Need help? Use "Installation Help" for detailed guide.';
        
        alert(instructions);
    }

    showNotification(message, type = 'info') {
        // Use existing notification system if available
        if (window.expenseManager && typeof window.expenseManager.showNotification === 'function') {
            window.expenseManager.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Initialize menu system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.menuSystem = new MenuSystem();
    console.log('✅ Menu System ready');
});

// Fallback initialization
window.addEventListener('load', function() {
    if (!window.menuSystem) {
        window.menuSystem = new MenuSystem();
    }
});
