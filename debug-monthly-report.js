// Debug script for Monthly Storage & Report functionality
console.log('🔍 Starting Monthly Report Debug...');

// Function to test the monthly report functionality
function debugMonthlyReport() {
    console.log('=== MONTHLY REPORT DEBUG ===');
    
    // Check if Chart.js is loaded
    if (typeof Chart !== 'undefined') {
        console.log('✅ Chart.js is loaded');
        console.log('Chart.js version:', Chart.version);
    } else {
        console.error('❌ Chart.js is not loaded');
        return;
    }
    
    // Check if expense manager exists
    if (window.expenseManager) {
        console.log('✅ Expense Manager found');
        
        // Check if chart canvas exists
        const chartCanvas = document.getElementById('expenseChart');
        if (chartCanvas) {
            console.log('✅ Chart canvas found');
            console.log('Canvas dimensions:', chartCanvas.width, 'x', chartCanvas.height);
            
            // Check if canvas context can be obtained
            try {
                const ctx = chartCanvas.getContext('2d');
                console.log('✅ Canvas context obtained');
                
                // Test chart creation
                console.log('🔄 Testing chart creation...');
                
                // Get expense data
                const expenses = window.expenseManager.expenses || [];
                const categories = window.expenseManager.categories || {};
                
                console.log('Expenses count:', expenses.length);
                console.log('Categories:', Object.keys(categories));
                
                // Check if there's data to display
                const categoryData = Object.keys(categories).map(key => ({
                    label: categories[key].name,
                    value: categories[key].spent,
                    color: categories[key].color
                })).filter(item => item.value > 0);
                
                console.log('Category data for chart:', categoryData);
                
                if (categoryData.length === 0) {
                    console.log('⚠️ No expense data to display in chart');
                    console.log('💡 Try adding some expenses first');
                } else {
                    console.log('✅ Chart data is available');
                    
                    // Try to manually update the chart
                    try {
                        window.expenseManager.updateChart();
                        console.log('✅ Chart update successful');
                    } catch (error) {
                        console.error('❌ Chart update failed:', error);
                    }
                }
                
            } catch (error) {
                console.error('❌ Canvas context error:', error);
            }
            
        } else {
            console.error('❌ Chart canvas not found');
        }
        
        // Check insights
        const insightsContainer = document.getElementById('reportInsights');
        if (insightsContainer) {
            console.log('✅ Insights container found');
            console.log('Current insights HTML:', insightsContainer.innerHTML);
        } else {
            console.error('❌ Insights container not found');
        }
        
    } else {
        console.error('❌ Expense Manager not found');
    }
    
    console.log('=== DEBUG COMPLETE ===');
}

// Function to fix common issues
function fixMonthlyReport() {
    console.log('🔧 Attempting to fix Monthly Report issues...');
    
    if (!window.expenseManager) {
        console.log('❌ Cannot fix: Expense Manager not found');
        return;
    }
    
    // Force update the UI
    try {
        window.expenseManager.updateUI();
        console.log('✅ Forced UI update');
    } catch (error) {
        console.error('❌ UI update failed:', error);
    }
    
    // Check and fix chart canvas
    const chartCanvas = document.getElementById('expenseChart');
    if (chartCanvas) {
        // Reset canvas
        chartCanvas.width = 400;
        chartCanvas.height = 200;
        console.log('✅ Reset chart canvas dimensions');
        
        // Force chart update
        try {
            window.expenseManager.updateChart();
            console.log('✅ Forced chart update');
        } catch (error) {
            console.error('❌ Chart update failed:', error);
        }
    }
    
    console.log('🔧 Fix attempt completed');
}

// Auto-run debug when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        debugMonthlyReport();
    }, 2000); // Wait 2 seconds for everything to load
});

// Make functions globally available
window.debugMonthlyReport = debugMonthlyReport;
window.fixMonthlyReport = fixMonthlyReport;

console.log('🔍 Monthly Report Debug script loaded');
console.log('💡 Run debugMonthlyReport() or fixMonthlyReport() in console');
