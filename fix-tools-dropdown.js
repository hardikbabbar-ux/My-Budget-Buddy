// Quick fix for tools dropdown functionality
console.log('🔧 Tools Dropdown Fix Script Loaded');

// Simple tools dropdown functionality
function initializeToolsDropdown() {
    console.log('🔧 Initializing tools dropdown...');
    
    const toolsBtn = document.getElementById('desktopToolsBtn');
    const toolsMenu = document.getElementById('desktopToolsMenu');
    
    if (!toolsBtn || !toolsMenu) {
        console.log('❌ Tools elements not found');
        return;
    }
    
    console.log('✅ Tools elements found');
    
    let isOpen = false;
    
    // Toggle dropdown on button click
    toolsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🎯 Tools button clicked');
        
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!toolsBtn.contains(e.target) && !toolsMenu.contains(e.target)) {
            closeDropdown();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isOpen) {
            closeDropdown();
        }
    });
    
    function openDropdown() {
        console.log('📂 Opening tools dropdown');
        toolsMenu.classList.add('show');
        toolsBtn.classList.add('active');
        isOpen = true;
    }
    
    function closeDropdown() {
        console.log('📁 Closing tools dropdown');
        toolsMenu.classList.remove('show');
        toolsBtn.classList.remove('active');
        isOpen = false;
    }
    
    // Setup menu item handlers
    setupMenuItemHandlers();
    
    console.log('✅ Tools dropdown initialized successfully');
}

function setupMenuItemHandlers() {
    console.log('🔗 Setting up menu item handlers...');
    
    // Show All Menu Options
    const showAllMenuBtn = document.getElementById('showAllMenuBtn');
    if (showAllMenuBtn) {
        showAllMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('📋 Show All Menu Options clicked');
            closeToolsDropdown();
            
            if (window.menuSystem && typeof window.menuSystem.showMenuModal === 'function') {
                window.menuSystem.showMenuModal();
            } else {
                alert('Menu system not available yet. Please wait a moment and try again.');
            }
        });
    }
    
    
    // App Settings
    const appSettingsBtn = document.getElementById('appSettingsBtn');
    if (appSettingsBtn) {
        appSettingsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('⚙️ App Settings clicked');
            closeToolsDropdown();
            
            if (window.menuSystem && typeof window.menuSystem.showAppSettings === 'function') {
                window.menuSystem.showAppSettings();
            } else {
                // Fallback - show settings options
                const settings = [
                    '🎨 Icon Customizer: icon-customizer.html',
                    '🧪 Test Suite: test-expense-deletion.html',
                    '📊 Export Test: test-export-functionality.html',
                    '💻 Console: Press F12'
                ];
                alert('App Settings:\n\n' + settings.join('\n'));
            }
        });
    }
    
    console.log('✅ Menu item handlers setup complete');
}

function closeToolsDropdown() {
    const toolsMenu = document.getElementById('desktopToolsMenu');
    const toolsBtn = document.getElementById('desktopToolsBtn');
    
    if (toolsMenu && toolsBtn) {
        toolsMenu.classList.remove('show');
        toolsBtn.classList.remove('active');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeToolsDropdown);
} else {
    initializeToolsDropdown();
}

// Fallback initialization
setTimeout(() => {
    if (!document.getElementById('desktopToolsBtn')?.onclick) {
        console.log('🔄 Fallback initialization of tools dropdown');
        initializeToolsDropdown();
    }
}, 2000);

// Global function to manually initialize
window.fixToolsDropdown = function() {
    console.log('🔧 Manual tools dropdown fix requested');
    initializeToolsDropdown();
};

// Add required CSS if not present
function addDropdownCSS() {
    const existingStyle = document.getElementById('tools-dropdown-fix-css');
    if (existingStyle) return;
    
    const style = document.createElement('style');
    style.id = 'tools-dropdown-fix-css';
    style.textContent = `
        .tools-dropdown-menu {
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            min-width: 200px;
            z-index: 1000;
            margin-top: 8px;
        }
        
        .tools-dropdown-menu.show {
            display: block;
            animation: dropdownFadeIn 0.2s ease-out;
        }
        
        @keyframes dropdownFadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .tools-btn.active {
            background: #4f46e5;
        }
        
        .tools-btn.active .dropdown-arrow {
            transform: rotate(180deg);
        }
        
        .tool-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            text-decoration: none;
            color: #374151;
            border-bottom: 1px solid #f1f5f9;
            transition: background-color 0.2s;
        }
        
        .tool-item:hover {
            background: #f8fafc;
            color: #1f2937;
        }
        
        .tool-item:last-child {
            border-bottom: none;
            border-radius: 0 0 8px 8px;
        }
        
        .tool-separator {
            height: 1px;
            background: #e2e8f0;
            margin: 4px 0;
        }
    `;
    document.head.appendChild(style);
}

// Add CSS when script loads
addDropdownCSS();
