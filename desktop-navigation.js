// Enhanced Desktop Navigation JavaScript
console.log('🖥️ Desktop Navigation Script Loaded');

class DesktopNavigation {
    constructor() {
        this.isToolsMenuOpen = false;
        this.isMobileMenuOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupActiveStates();
        this.setupSmoothScrolling();
        console.log('✅ Desktop Navigation initialized');
    }


    setupEventListeners() {
        console.log('🔧 Setting up desktop navigation event listeners...');
        
        // Desktop tools dropdown
        const desktopToolsBtn = document.getElementById('desktopToolsBtn');
        const desktopToolsMenu = document.getElementById('desktopToolsMenu');
        
        console.log('Desktop tools button:', desktopToolsBtn);
        console.log('Desktop tools menu:', desktopToolsMenu);
        
        if (desktopToolsBtn && desktopToolsMenu) {
            desktopToolsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Desktop tools button clicked');
                this.toggleToolsMenu();
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!desktopToolsBtn.contains(e.target) && !desktopToolsMenu.contains(e.target)) {
                    this.closeToolsMenu();
                }
            });

            // Handle keyboard navigation
            desktopToolsBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleToolsMenu();
                }
                if (e.key === 'Escape') {
                    this.closeToolsMenu();
                }
            });
            
            console.log('✅ Desktop tools dropdown listeners attached');
        } else {
            console.log('❌ Desktop tools elements not found');
        }

        // Mobile hamburger menu
        const hamburger = document.querySelector('.hamburger');
        const mobileNav = document.querySelector('.mobile-nav');
        
        console.log('Hamburger element:', hamburger);
        console.log('Mobile nav element:', mobileNav);
        
        if (hamburger && mobileNav) {
            hamburger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🍔 Hamburger clicked in desktop-navigation.js');
                this.toggleMobileMenu();
            });
            console.log('✅ Mobile hamburger listeners attached');
        } else {
            console.log('❌ Mobile navigation elements not found');
        }

        // Handle mobile menu item clicks
        const mobileMenuItems = document.querySelectorAll('.mobile-nav a');
        mobileMenuItems.forEach(item => {
            item.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
            if (window.innerWidth > 1024) {
                this.closeToolsMenu();
            }
            
            // Reposition dropdown if it's open
            if (this.isToolsMenuOpen) {
                const toolsBtn = document.getElementById('desktopToolsBtn');
                const toolsMenu = document.getElementById('desktopToolsMenu');
                if (toolsBtn && toolsMenu) {
                    this.adjustDropdownPosition(toolsMenu, toolsBtn);
                }
            }
        });

        // Setup menu system integration
        this.setupMenuSystemIntegration();
        
        // Setup zoom controls
        this.setupZoomControls();
        
        // Ensure menu system is loaded
        this.ensureMenuSystemLoaded();
        
    }

    setupMenuSystemIntegration() {
        // Connect desktop menu items to menu system
        const showAllMenuBtn = document.getElementById('showAllMenuBtn');
        const appSettingsBtn = document.getElementById('appSettingsBtn');

        // Mobile versions
        const showAllMenuBtnMobile = document.getElementById('showAllMenuBtnMobile');
        const appSettingsBtnMobile = document.getElementById('appSettingsBtnMobile');

        // Desktop handlers
        if (showAllMenuBtn) {
            showAllMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeToolsMenu();
                console.log('📋 All Menu Options clicked');
                console.log('Menu System available:', !!window.menuSystem);
                
                if (window.menuSystem) {
                    console.log('Calling showMenuModal...');
                    try {
                        window.menuSystem.showMenuModal();
                        console.log('✅ Menu modal opened successfully');
                    } catch (error) {
                        console.error('❌ Error opening menu modal:', error);
                        this.showNotification('Error opening menu. Please try again.', 'error');
                    }
                } else {
                    console.error('❌ Menu System not available');
                    // Try fallback menu
                    this.showFallbackMenu();
                }
            });
            console.log('✅ Desktop All Menu Options button listener attached');
        } else {
            console.warn('⚠️ Desktop All Menu Options button not found');
        }


        if (appSettingsBtn) {
            appSettingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeToolsMenu();
                if (window.menuSystem) {
                    window.menuSystem.showAppSettings();
                }
            });
        }

        // Mobile handlers
        if (showAllMenuBtnMobile) {
            showAllMenuBtnMobile.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMobileMenu();
                console.log('📱 Mobile All Menu Options clicked');
                
                if (window.menuSystem) {
                    try {
                        window.menuSystem.showMenuModal();
                        console.log('✅ Mobile menu modal opened successfully');
                    } catch (error) {
                        console.error('❌ Error opening mobile menu modal:', error);
                        this.showNotification('Error opening menu. Please try again.', 'error');
                    }
                } else {
                    console.error('❌ Menu System not available on mobile');
                    // Try fallback menu
                    this.showFallbackMenu();
                }
            });
            console.log('✅ Mobile All Menu Options button listener attached');
        } else {
            console.warn('⚠️ Mobile All Menu Options button not found');
        }


        if (appSettingsBtnMobile) {
            appSettingsBtnMobile.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeMobileMenu();
                if (window.menuSystem) {
                    window.menuSystem.showAppSettings();
                }
            });
        }
    }

    setupZoomControls() {
        // Keyboard shortcuts for zoom control
        document.addEventListener('keydown', (e) => {
            // Ctrl + Plus/Equals for zoom in
            if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
                e.preventDefault();
                const currentZoom = parseFloat(document.documentElement.style.zoom) || 0.85;
                const newZoom = Math.min(1.5, currentZoom + 0.1);
                this.setZoomLevel(Math.round(newZoom * 20) / 20); // Round to nearest 0.05
            }
            // Ctrl + Minus for zoom out
            if (e.ctrlKey && e.key === '-') {
                e.preventDefault();
                const currentZoom = parseFloat(document.documentElement.style.zoom) || 0.85;
                const newZoom = Math.max(0.5, currentZoom - 0.1);
                this.setZoomLevel(Math.round(newZoom * 20) / 20); // Round to nearest 0.05
            }
            // Ctrl + 0 for reset zoom
            if (e.ctrlKey && e.key === '0') {
                e.preventDefault();
                this.resetZoom();
            }
            // Ctrl + Shift + Z for toggle zoom
            if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
                e.preventDefault();
                this.toggleZoom();
            }
        });

        console.log('✅ Zoom controls initialized');
        console.log('🔍 Zoom shortcuts:');
        console.log('  - Ctrl + Plus: Zoom in');
        console.log('  - Ctrl + Minus: Zoom out');
        console.log('  - Ctrl + 0: Reset to 85%');
        console.log('  - Ctrl + Shift + Z: Toggle zoom levels');
    }

    ensureMenuSystemLoaded() {
        // Check if menu system is loaded, if not, try to load it
        let attempts = 0;
        const maxAttempts = 10;
        
        const checkMenuSystem = () => {
            attempts++;
            
            if (window.menuSystem) {
                console.log('✅ Menu System is available');
                return;
            }
            
            if (attempts < maxAttempts) {
                console.log(`⏳ Waiting for Menu System... (attempt ${attempts}/${maxAttempts})`);
                setTimeout(checkMenuSystem, 500);
            } else {
                console.error('❌ Menu System failed to load after maximum attempts');
                // Try to manually initialize menu system
                this.tryManualMenuSystemInit();
            }
        };
        
        checkMenuSystem();
    }
    
    tryManualMenuSystemInit() {
        try {
            // Check if MenuSystem class is available
            if (typeof MenuSystem !== 'undefined') {
                console.log('🔄 Manually initializing Menu System...');
                window.menuSystem = new MenuSystem();
                console.log('✅ Menu System manually initialized');
            } else {
                console.error('❌ MenuSystem class not found. Please check if menu-system.js is loaded.');
            }
        } catch (error) {
            console.error('❌ Failed to manually initialize Menu System:', error);
        }
    }
    
    showFallbackMenu() {
        console.log('🔄 Showing fallback menu');
        
        // Create a simple fallback menu
        const fallbackMenuHTML = `
            <div id="fallbackMenuModal" style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 12px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h2 style="margin: 0; color: #374151;">📋 All Menu Options</h2>
                        <button onclick="document.getElementById('fallbackMenuModal').remove()" style="
                            background: none;
                            border: none;
                            font-size: 24px;
                            cursor: pointer;
                            color: #6b7280;
                        ">&times;</button>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                        <button onclick="location.href='#home'; document.getElementById('fallbackMenuModal').remove();" style="
                            padding: 15px;
                            border: 1px solid #e5e7eb;
                            border-radius: 8px;
                            background: white;
                            cursor: pointer;
                            transition: all 0.2s;
                        ">🏠 Home</button>
                        <button onclick="location.href='#expense-manager'; document.getElementById('fallbackMenuModal').remove();" style="
                            padding: 15px;
                            border: 1px solid #e5e7eb;
                            border-radius: 8px;
                            background: white;
                            cursor: pointer;
                            transition: all 0.2s;
                        ">💰 Expense Manager</button>
                        <button onclick="location.href='#piggy-bank'; document.getElementById('fallbackMenuModal').remove();" style="
                            padding: 15px;
                            border: 1px solid #e5e7eb;
                            border-radius: 8px;
                            background: white;
                            cursor: pointer;
                            transition: all 0.2s;
                        ">🐷 Piggy Bank</button>
                        <button onclick="location.href='#features'; document.getElementById('fallbackMenuModal').remove();" style="
                            padding: 15px;
                            border: 1px solid #e5e7eb;
                            border-radius: 8px;
                            background: white;
                            cursor: pointer;
                            transition: all 0.2s;
                        ">✨ Features</button>
                        <button onclick="location.href='#how-it-works'; document.getElementById('fallbackMenuModal').remove();" style="
                            padding: 15px;
                            border: 1px solid #e5e7eb;
                            border-radius: 8px;
                            background: white;
                            cursor: pointer;
                            transition: all 0.2s;
                        ">🔧 How it Works</button>
                        <button onclick="location.href='#benefits'; document.getElementById('fallbackMenuModal').remove();" style="
                            padding: 15px;
                            border: 1px solid #e5e7eb;
                            border-radius: 8px;
                            background: white;
                            cursor: pointer;
                            transition: all 0.2s;
                        ">🎯 Benefits</button>
                        <button onclick="location.href='#team'; document.getElementById('fallbackMenuModal').remove();" style="
                            padding: 15px;
                            border: 1px solid #e5e7eb;
                            border-radius: 8px;
                            background: white;
                            cursor: pointer;
                            transition: all 0.2s;
                        ">👥 Our Team</button>
                        <button onclick="location.href='#contact'; document.getElementById('fallbackMenuModal').remove();" style="
                            padding: 15px;
                            border: 1px solid #e5e7eb;
                            border-radius: 8px;
                            background: white;
                            cursor: pointer;
                            transition: all 0.2s;
                        ">📞 Contact</button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove any existing fallback menu
        const existingFallback = document.getElementById('fallbackMenuModal');
        if (existingFallback) {
            existingFallback.remove();
        }
        
        // Add the fallback menu to the page
        document.body.insertAdjacentHTML('beforeend', fallbackMenuHTML);
        
        this.showNotification('Using fallback menu (main menu system unavailable)', 'info');
    }

    toggleToolsMenu() {
        console.log('🔄 Toggling tools menu, current state:', this.isToolsMenuOpen);
        const toolsBtn = document.getElementById('desktopToolsBtn');
        const toolsMenu = document.getElementById('desktopToolsMenu');
        
        if (this.isToolsMenuOpen) {
            this.closeToolsMenu();
        } else {
            this.openToolsMenu();
        }
    }

    openToolsMenu() {
        console.log('🖱️ Opening tools menu');
        const toolsBtn = document.getElementById('desktopToolsBtn');
        const toolsMenu = document.getElementById('desktopToolsMenu');
        
        if (toolsBtn && toolsMenu) {
            // Check if dropdown would be cut off and adjust position
            this.adjustDropdownPosition(toolsMenu, toolsBtn);
            
            toolsBtn.classList.add('active');
            toolsMenu.classList.add('show');
            this.isToolsMenuOpen = true;
            
            // Focus first menu item for keyboard navigation
            const firstMenuItem = toolsMenu.querySelector('.tool-item');
            if (firstMenuItem) {
                firstMenuItem.focus();
            }
            console.log('✅ Tools menu opened');
        } else {
            console.log('❌ Failed to open tools menu - elements not found');
        }
    }

    adjustDropdownPosition(dropdown, button) {
        // Reset position classes
        dropdown.classList.remove('position-left');
        
        // For screens larger than 1200px, use JavaScript positioning
        // For smaller screens, CSS media queries handle positioning
        if (window.innerWidth > 1200) {
            // Small delay to ensure elements are rendered
            setTimeout(() => {
                // Get button position and dropdown width
                const buttonRect = button.getBoundingClientRect();
                const dropdownWidth = 280; // max-width from CSS to be safe
                const viewportWidth = window.innerWidth;
                const buttonRight = buttonRect.right;
                const availableSpace = viewportWidth - buttonRight;
                
                console.log(`📏 Button right edge: ${buttonRight}, Viewport width: ${viewportWidth}, Available space: ${availableSpace}, Dropdown needs: ${dropdownWidth}`);
                
                // Check if dropdown would extend beyond viewport (with 30px margin for safety)
                if (availableSpace < dropdownWidth + 30) {
                    // Position dropdown to the left of the button
                    dropdown.classList.add('position-left');
                    console.log('📏 Dropdown positioned to left to prevent cutoff');
                } else {
                    console.log('📏 Dropdown positioned normally on right');
                }
            }, 10);
        } else {
            console.log('📏 Using CSS media query positioning for screen width:', window.innerWidth);
        }
    }

    closeToolsMenu() {
        console.log('🖱️ Closing tools menu');
        const toolsBtn = document.getElementById('desktopToolsBtn');
        const toolsMenu = document.getElementById('desktopToolsMenu');
        
        if (toolsBtn && toolsMenu) {
            toolsBtn.classList.remove('active');
            toolsMenu.classList.remove('show');
            this.isToolsMenuOpen = false;
            console.log('✅ Tools menu closed');
        } else {
            console.log('❌ Failed to close tools menu - elements not found');
        }
    }

    toggleMobileMenu() {
        console.log('🔄 Toggling mobile menu, current state:', this.isMobileMenuOpen);
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        console.log('📱 Opening mobile menu');
        const hamburger = document.querySelector('.hamburger');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (hamburger && mobileNav) {
            hamburger.classList.add('active');
            mobileNav.classList.add('show');
            this.isMobileMenuOpen = true;
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            console.log('✅ Mobile menu opened');
        } else {
            console.log('❌ Failed to open mobile menu - elements not found');
        }
    }

    closeMobileMenu() {
        console.log('📱 Closing mobile menu');
        const hamburger = document.querySelector('.hamburger');
        const mobileNav = document.querySelector('.mobile-nav');
        
        if (hamburger && mobileNav) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('show');
            this.isMobileMenuOpen = false;
            
            // Restore body scroll
            document.body.style.overflow = '';
            console.log('✅ Mobile menu closed');
        } else {
            console.log('❌ Failed to close mobile menu - elements not found');
        }
    }

    setupActiveStates() {
        // Set active state based on current section
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Function to update active states
        const updateActiveStates = () => {
            const currentHash = window.location.hash || '#home';
            
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentHash) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        };

        // Update on hash change
        window.addEventListener('hashchange', updateActiveStates);
        
        // Update on page load
        updateActiveStates();

        // Update on scroll (for sections in view)
        let ticking = false;
        const updateOnScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateActiveOnScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', updateOnScroll);
    }

    updateActiveOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        const scrollPosition = window.pageYOffset + 100; // Offset for navbar height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update active states
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setupSmoothScrolling() {
        // Enhanced smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('.nav-link[href^="#"], .mobile-nav a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                    
                    // Smooth scroll to target
                    const offsetTop = targetElement.offsetTop - 80; // Account for navbar height
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash
                    history.pushState(null, null, href);
                }
            });
        });
    }

    // Public methods for external use
    highlightSection(sectionId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
                link.classList.add('active');
                
                // Add temporary highlight effect
                link.style.animation = 'pulse 0.5s ease-in-out';
                setTimeout(() => {
                    link.style.animation = '';
                }, 500);
            } else {
                link.classList.remove('active');
            }
        });
    }

    showNotification(message, type = 'info') {
        // Integration with existing notification system
        if (window.expenseManager && typeof window.expenseManager.showNotification === 'function') {
            window.expenseManager.showNotification(message, type);
        } else {
            console.log(`Navigation: ${message}`);
        }
    }

    // Zoom control methods
    setZoomLevel(zoomLevel) {
        const validZooms = [0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5];
        if (!validZooms.includes(zoomLevel)) {
            console.warn(`Invalid zoom level: ${zoomLevel}. Valid levels:`, validZooms);
            return;
        }

        const html = document.documentElement;
        const body = document.body;
        
        // Apply zoom
        html.style.zoom = zoomLevel;
        html.style.transform = `scale(${zoomLevel})`;
        html.style.webkitTransform = `scale(${zoomLevel})`;
        html.style.mozTransform = `scale(${zoomLevel})`;
        
        // Adjust body width to compensate
        const compensatedWidth = (100 / zoomLevel).toFixed(2);
        body.style.width = `${compensatedWidth}%`;
        
        console.log(`🔍 Zoom level set to: ${(zoomLevel * 100).toFixed(0)}%`);
        this.showNotification(`Zoom: ${(zoomLevel * 100).toFixed(0)}%`, 'info');
        
        // Store zoom preference
        localStorage.setItem('budgetBuddyZoom', zoomLevel.toString());
    }

    resetZoom() {
        this.setZoomLevel(0.85); // Reset to default 85%
    }

    toggleZoom() {
        const currentZoom = parseFloat(document.documentElement.style.zoom) || 0.85;
        const zoomLevels = [0.85, 1.0, 0.7];
        const currentIndex = zoomLevels.findIndex(z => Math.abs(z - currentZoom) < 0.01);
        const nextIndex = (currentIndex + 1) % zoomLevels.length;
        this.setZoomLevel(zoomLevels[nextIndex]);
    }

    loadSavedZoom() {
        const savedZoom = localStorage.getItem('budgetBuddyZoom');
        if (savedZoom) {
            this.setZoomLevel(parseFloat(savedZoom));
        }
    }

}

// Initialize desktop navigation when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are rendered
    setTimeout(() => {
        window.desktopNavigation = new DesktopNavigation();
        console.log('✅ Desktop Navigation ready');
    }, 100);
});

// Fallback initialization
window.addEventListener('load', function() {
    if (!window.desktopNavigation) {
        setTimeout(() => {
            window.desktopNavigation = new DesktopNavigation();
            console.log('✅ Desktop Navigation fallback initialized');
        }, 100);
    }
});

// Add CSS animation for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
