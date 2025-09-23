// Quick Icon Update Script for Budget Buddy
console.log('🎨 Quick Icon Update Script Loaded');

// Function to update app icon instantly
window.updateAppIcon = function(imageFile) {
    console.log('🔄 Starting icon update process...');
    
    if (!imageFile) {
        console.log('❌ No image file provided');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            console.log('✅ Image loaded successfully');
            
            // Update logo in navigation
            const logoImage = document.querySelector('.logo-image');
            if (logoImage) {
                logoImage.src = e.target.result;
                console.log('✅ Navigation logo updated');
            }
            
            // Update favicon
            updateFavicon(e.target.result);
            
            // Show success message
            if (window.expenseManager && typeof window.expenseManager.showNotification === 'function') {
                window.expenseManager.showNotification('🎨 App icon updated successfully!', 'success');
            } else {
                alert('🎨 App icon updated successfully!');
            }
            
            console.log('✅ Icon update completed');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
};

// Function to update favicon
function updateFavicon(dataUrl) {
    // Remove existing favicons
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());
    
    // Create new favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    favicon.href = dataUrl;
    document.head.appendChild(favicon);
    
    console.log('✅ Favicon updated');
}

// Function to create file input for icon upload
window.uploadNewIcon = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            updateAppIcon(file);
        }
    });
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
};

// Function to open icon replacer tool
window.openIconReplacer = function() {
    window.open('icon-replacer.html', '_blank');
};

// Quick access button function (disabled)
function addQuickIconButton() {
    // Button creation disabled - use console commands instead
    console.log('💡 Icon update button disabled. Use console commands:');
    console.log('- uploadNewIcon() for quick upload');
    console.log('- openIconReplacer() for full tool');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add quick access button after a delay
    setTimeout(addQuickIconButton, 2000);
    
    console.log('✅ Quick Icon Update System ready');
    console.log('💡 Available functions:');
    console.log('- uploadNewIcon() - Quick icon upload');
    console.log('- openIconReplacer() - Open full icon tool');
    console.log('- updateAppIcon(file) - Update with file object');
});

// Global functions for console access
window.iconUpdateHelp = function() {
    console.log('🎨 Budget Buddy Icon Update Help');
    console.log('================================');
    console.log('');
    console.log('Available Methods:');
    console.log('1. uploadNewIcon() - Opens file picker for quick upload');
    console.log('2. openIconReplacer() - Opens full icon replacement tool');
    console.log('3. updateAppIcon(fileObject) - Update with JavaScript File object');
    console.log('');
    console.log('For permanent changes, use the icon replacer tool to generate all sizes.');
    console.log('Access the tool at: icon-replacer.html');
};
