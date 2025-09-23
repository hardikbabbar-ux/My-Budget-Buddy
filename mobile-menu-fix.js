// Mobile Menu Fix for Budget Buddy
console.log('📱 Mobile Menu Fix Script Loaded');

class MobileMenuFix {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.addMobileStyles();
        console.log('✅ Mobile Menu Fix initialized');
    }

    setupMobileMenu() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeMobileMenu());
        } else {
            this.initializeMobileMenu();
        }
    }

    initializeMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mobileNav = document.querySelector('.mobile-nav');

        if (!hamburger || !mobileNav) {
            console.log('❌ Mobile menu elements not found');
            return;
        }

        console.log('✅ Mobile menu elements found');

        // Remove any existing event listeners
        hamburger.replaceWith(hamburger.cloneNode(true));
        const newHamburger = document.querySelector('.hamburger');

        // Add click event listener
        newHamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🍔 Hamburger clicked');
            this.toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !mobileNav.contains(e.target) && !newHamburger.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu when clicking on menu items
        const menuItems = mobileNav.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        console.log('✅ Mobile menu event listeners added');
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mobileNav = document.querySelector('.mobile-nav');

        if (hamburger && mobileNav) {
            console.log('📂 Opening mobile menu');
            
            hamburger.classList.add('active');
            mobileNav.classList.add('show');
            mobileNav.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            this.isMenuOpen = true;
        }
    }

    closeMenu() {
        const hamburger = document.querySelector('.hamburger');
        const mobileNav = document.querySelector('.mobile-nav');

        if (hamburger && mobileNav) {
            console.log('📁 Closing mobile menu');
            
            hamburger.classList.remove('active');
            mobileNav.classList.remove('show');
            document.body.style.overflow = '';
            
            // Hide menu after animation
            setTimeout(() => {
                if (!this.isMenuOpen) {
                    mobileNav.style.display = 'none';
                }
            }, 300);
            
            this.isMenuOpen = false;
        }
    }

    addMobileStyles() {
        const style = document.createElement('style');
        style.id = 'mobile-menu-fix-styles';
        style.textContent = `
            /* Mobile Menu Fix Styles */
            @media (max-width: 768px) {
                .hamburger {
                    display: flex !important;
                    flex-direction: column;
                    cursor: pointer;
                    padding: 8px;
                    gap: 4px;
                    z-index: 1001;
                    position: relative;
                }

                .hamburger span {
                    width: 30px;
                    height: 4px;
                    background: #374151;
                    border-radius: 2px;
                    transition: all 0.3s ease;
                    display: block;
                }

                .hamburger.active span:nth-child(1) {
                    transform: rotate(45deg) translate(6px, 6px);
                }

                .hamburger.active span:nth-child(2) {
                    opacity: 0;
                }

                .hamburger.active span:nth-child(3) {
                    transform: rotate(-45deg) translate(6px, -6px);
                }

                .mobile-nav {
                    display: none;
                    position: fixed;
                    top: 90px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: white;
                    flex-direction: column;
                    padding: 20px;
                    z-index: 1000;
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    overflow-y: auto;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .mobile-nav.show {
                    display: flex !important;
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }

                .mobile-nav li {
                    list-style: none;
                    margin-bottom: 8px;
                }

                .mobile-nav a {
                    display: block;
                    padding: 16px 20px;
                    text-decoration: none;
                    color: #374151;
                    border-radius: 10px;
                    font-weight: 500;
                    font-size: 1.1rem;
                    transition: all 0.2s ease;
                }

                .mobile-nav a:hover {
                    background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
                    color: #0369a1;
                }

                .desktop-nav {
                    display: none !important;
                }

                .desktop-tools {
                    display: none !important;
                }
            }

            @media (min-width: 769px) {
                .mobile-nav {
                    display: none !important;
                }

                .hamburger {
                    display: none !important;
                }
            }
        `;

        // Remove existing style if present
        const existingStyle = document.getElementById('mobile-menu-fix-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        document.head.appendChild(style);
        console.log('✅ Mobile menu styles added');
    }

    // Public methods for debugging
    forceOpen() {
        this.openMenu();
    }

    forceClose() {
        this.closeMenu();
    }

    getStatus() {
        return {
            isOpen: this.isMenuOpen,
            hamburgerExists: !!document.querySelector('.hamburger'),
            mobileNavExists: !!document.querySelector('.mobile-nav')
        };
    }
}

// Initialize mobile menu fix
let mobileMenuFix;

document.addEventListener('DOMContentLoaded', function() {
    mobileMenuFix = new MobileMenuFix();
    window.mobileMenuFix = mobileMenuFix;
    console.log('✅ Mobile Menu Fix ready');
});

// Fallback initialization
window.addEventListener('load', function() {
    if (!mobileMenuFix) {
        mobileMenuFix = new MobileMenuFix();
        window.mobileMenuFix = mobileMenuFix;
    }
});

// Global debugging functions
window.debugMobileMenu = function() {
    if (mobileMenuFix) {
        console.log('📱 Mobile Menu Debug Info:');
        console.log(mobileMenuFix.getStatus());
    } else {
        console.log('❌ Mobile menu fix not initialized');
    }
};

window.testMobileMenu = function() {
    if (mobileMenuFix) {
        console.log('🧪 Testing mobile menu...');
        mobileMenuFix.forceOpen();
        setTimeout(() => {
            mobileMenuFix.forceClose();
        }, 2000);
    } else {
        console.log('❌ Mobile menu fix not initialized');
    }
};
