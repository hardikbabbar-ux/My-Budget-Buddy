// Fix for Monthly Storage & Report functionality
console.log('🔧 Loading Monthly Report Fix...');

// Enhanced Chart.js loading and initialization
function ensureChartJSLoaded() {
    return new Promise((resolve, reject) => {
        if (typeof Chart !== 'undefined') {
            console.log('✅ Chart.js already loaded');
            resolve();
            return;
        }
        
        console.log('⏳ Waiting for Chart.js to load...');
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds
        
        const checkInterval = setInterval(() => {
            attempts++;
            if (typeof Chart !== 'undefined') {
                console.log('✅ Chart.js loaded after', attempts * 100, 'ms');
                clearInterval(checkInterval);
                resolve();
            } else if (attempts >= maxAttempts) {
                console.error('❌ Chart.js failed to load after 5 seconds');
                clearInterval(checkInterval);
                reject(new Error('Chart.js not loaded'));
            }
        }, 100);
    });
}

// Enhanced expense manager initialization
function initializeExpenseManager() {
    console.log('🔄 Initializing Expense Manager...');
    
    // Wait for DOM and Chart.js
    Promise.all([
        new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        }),
        ensureChartJSLoaded()
    ]).then(() => {
        console.log('✅ Prerequisites loaded, initializing expense manager...');
        
        // Check if expense manager already exists
        if (window.expenseManager) {
            console.log('✅ Expense Manager already exists, updating UI...');
            try {
                window.expenseManager.updateUI();
                console.log('✅ UI updated successfully');
            } catch (error) {
                console.error('❌ UI update failed:', error);
                recreateExpenseManager();
            }
        } else {
            console.log('🔄 Creating new Expense Manager...');
            recreateExpenseManager();
        }
    }).catch(error => {
        console.error('❌ Initialization failed:', error);
        fallbackChartDisplay();
    });
}

// Recreate expense manager
function recreateExpenseManager() {
    try {
        if (typeof ExpenseManager !== 'undefined') {
            window.expenseManager = new ExpenseManager();
            console.log('✅ Expense Manager created successfully');
        } else {
            console.error('❌ ExpenseManager class not found');
            fallbackChartDisplay();
        }
    } catch (error) {
        console.error('❌ Failed to create Expense Manager:', error);
        fallbackChartDisplay();
    }
}

// Fallback chart display when Chart.js fails
function fallbackChartDisplay() {
    console.log('🔄 Using fallback chart display...');
    
    const chartCanvas = document.getElementById('expenseChart');
    if (!chartCanvas) {
        console.error('❌ Chart canvas not found');
        return;
    }
    
    const ctx = chartCanvas.getContext('2d');
    if (!ctx) {
        console.error('❌ Canvas context not available');
        return;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
    
    // Draw fallback message
    ctx.font = '16px Inter, Arial, sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const centerX = chartCanvas.width / 2;
    const centerY = chartCanvas.height / 2;
    
    ctx.fillText('Chart loading...', centerX, centerY - 10);
    ctx.font = '12px Inter, Arial, sans-serif';
    ctx.fillText('Add expenses to see your spending breakdown', centerX, centerY + 15);
    
    console.log('✅ Fallback chart displayed');
}

// Enhanced chart update with error handling
function updateChartSafely() {
    if (!window.expenseManager) {
        console.log('❌ Expense Manager not available for chart update');
        return;
    }
    
    try {
        const chartCanvas = document.getElementById('expenseChart');
        if (!chartCanvas) {
            console.error('❌ Chart canvas not found');
            return;
        }
        
        if (typeof Chart === 'undefined') {
            console.log('⚠️ Chart.js not available, using fallback');
            fallbackChartDisplay();
            return;
        }
        
        // Call the original updateChart method
        window.expenseManager.updateChart();
        console.log('✅ Chart updated successfully');
        
    } catch (error) {
        console.error('❌ Chart update failed:', error);
        fallbackChartDisplay();
    }
}

// Fix insights display
function fixInsightsDisplay() {
    const insightsContainer = document.getElementById('reportInsights');
    if (!insightsContainer) {
        console.error('❌ Insights container not found');
        return;
    }
    
    if (!window.expenseManager) {
        insightsContainer.innerHTML = `
            <div class="insight-item">
                <i class="fas fa-lightbulb"></i>
                <p>Set up your budget to see personalized insights!</p>
            </div>
        `;
        return;
    }
    
    try {
        window.expenseManager.updateInsights();
        console.log('✅ Insights updated successfully');
    } catch (error) {
        console.error('❌ Insights update failed:', error);
        insightsContainer.innerHTML = `
            <div class="insight-item">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Unable to load insights. Please refresh the page.</p>
            </div>
        `;
    }
}

// Main fix function
function fixMonthlyReportIssues() {
    console.log('🔧 Starting Monthly Report Fix...');
    
    // Fix chart
    updateChartSafely();
    
    // Fix insights
    fixInsightsDisplay();
    
    // Ensure canvas is properly sized
    const chartCanvas = document.getElementById('expenseChart');
    if (chartCanvas) {
        // Set explicit dimensions if not set
        if (!chartCanvas.style.width) {
            chartCanvas.style.width = '100%';
        }
        if (!chartCanvas.style.height) {
            chartCanvas.style.height = '200px';
        }
        console.log('✅ Chart canvas dimensions fixed');
    }
    
    console.log('✅ Monthly Report Fix completed');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeExpenseManager, 1000);
    });
} else {
    setTimeout(initializeExpenseManager, 1000);
}

// Make functions globally available for manual debugging
window.fixMonthlyReportIssues = fixMonthlyReportIssues;
window.updateChartSafely = updateChartSafely;
window.fallbackChartDisplay = fallbackChartDisplay;

console.log('🔧 Monthly Report Fix loaded');
console.log('💡 Run fixMonthlyReportIssues() to manually fix issues');
