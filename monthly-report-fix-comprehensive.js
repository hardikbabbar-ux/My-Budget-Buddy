// Comprehensive fix for Monthly Storage & Report issues
console.log('🔧 Loading Comprehensive Monthly Report Fix...');

class MonthlyReportFixer {
    constructor() {
        this.chartInstance = null;
        this.isFixing = false;
        this.init();
    }

    init() {
        console.log('🚀 Initializing Monthly Report Fixer...');
        
        // Wait for everything to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startFix());
        } else {
            this.startFix();
        }
    }

    startFix() {
        // Wait a bit more for all scripts to load
        setTimeout(() => {
            this.diagnoseAndFix();
        }, 2000);
    }

    diagnoseAndFix() {
        if (this.isFixing) return;
        this.isFixing = true;

        console.log('🔍 Diagnosing Monthly Report issues...');

        const issues = this.diagnoseIssues();
        console.log('📊 Issues found:', issues);

        this.applyFixes(issues);
        this.isFixing = false;
    }

    diagnoseIssues() {
        const issues = [];

        // Check Chart.js
        if (typeof Chart === 'undefined') {
            issues.push('chartjs_missing');
        }

        // Check canvas element
        const canvas = document.getElementById('expenseChart');
        if (!canvas) {
            issues.push('canvas_missing');
        } else {
            try {
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    issues.push('canvas_context_failed');
                }
            } catch (error) {
                issues.push('canvas_error');
            }
        }

        // Check expense manager
        if (!window.expenseManager) {
            issues.push('expense_manager_missing');
        } else {
            if (typeof window.expenseManager.updateChart !== 'function') {
                issues.push('update_chart_missing');
            }
        }

        // Check insights container
        const insights = document.getElementById('reportInsights');
        if (!insights) {
            issues.push('insights_container_missing');
        }

        return issues;
    }

    applyFixes(issues) {
        console.log('🔧 Applying fixes for issues:', issues);

        // Fix Chart.js loading
        if (issues.includes('chartjs_missing')) {
            this.fixChartJSLoading();
        }

        // Fix canvas issues
        if (issues.includes('canvas_missing') || issues.includes('canvas_context_failed') || issues.includes('canvas_error')) {
            this.fixCanvasIssues();
        }

        // Fix expense manager
        if (issues.includes('expense_manager_missing') || issues.includes('update_chart_missing')) {
            this.fixExpenseManager();
        }

        // Fix insights
        if (issues.includes('insights_container_missing')) {
            this.fixInsightsContainer();
        }

        // Apply general fixes
        this.applyGeneralFixes();
    }

    fixChartJSLoading() {
        console.log('🔄 Attempting to fix Chart.js loading...');
        
        // Try to reload Chart.js
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => {
            console.log('✅ Chart.js reloaded');
            setTimeout(() => this.fixExpenseManager(), 1000);
        };
        script.onerror = () => {
            console.error('❌ Failed to reload Chart.js');
            this.showChartError();
        };
        document.head.appendChild(script);
    }

    fixCanvasIssues() {
        console.log('🔄 Fixing canvas issues...');
        
        let canvas = document.getElementById('expenseChart');
        
        if (!canvas) {
            // Create canvas if missing
            const chartContainer = document.querySelector('.report-chart');
            if (chartContainer) {
                canvas = document.createElement('canvas');
                canvas.id = 'expenseChart';
                canvas.width = 400;
                canvas.height = 200;
                chartContainer.appendChild(canvas);
                console.log('✅ Canvas created');
            }
        } else {
            // Reset canvas
            canvas.width = 400;
            canvas.height = 200;
            console.log('✅ Canvas reset');
        }

        // Test canvas context
        if (canvas) {
            try {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    console.log('✅ Canvas context working');
                } else {
                    console.error('❌ Canvas context still not working');
                }
            } catch (error) {
                console.error('❌ Canvas context error:', error);
            }
        }
    }

    fixExpenseManager() {
        console.log('🔄 Fixing expense manager...');
        
        if (!window.expenseManager && typeof ExpenseManager !== 'undefined') {
            try {
                window.expenseManager = new ExpenseManager();
                console.log('✅ Expense Manager recreated');
            } catch (error) {
                console.error('❌ Failed to recreate Expense Manager:', error);
            }
        }

        // Patch updateChart method if needed
        if (window.expenseManager && typeof window.expenseManager.updateChart !== 'function') {
            window.expenseManager.updateChart = this.createFallbackUpdateChart();
            console.log('✅ UpdateChart method patched');
        }
    }

    fixInsightsContainer() {
        console.log('🔄 Fixing insights container...');
        
        const reportSection = document.querySelector('.monthly-report');
        if (reportSection && !document.getElementById('reportInsights')) {
            const insightsDiv = document.createElement('div');
            insightsDiv.className = 'report-insights';
            insightsDiv.id = 'reportInsights';
            insightsDiv.innerHTML = `
                <div class="insight-item">
                    <i class="fas fa-lightbulb"></i>
                    <p>Set up your budget to see personalized insights!</p>
                </div>
            `;
            reportSection.appendChild(insightsDiv);
            console.log('✅ Insights container created');
        }
    }

    applyGeneralFixes() {
        console.log('🔄 Applying general fixes...');
        
        // Ensure proper CSS for chart container
        const chartContainer = document.querySelector('.report-chart');
        if (chartContainer) {
            chartContainer.style.position = 'relative';
            chartContainer.style.height = '200px';
            chartContainer.style.width = '100%';
        }

        // Force update if expense manager exists
        if (window.expenseManager) {
            try {
                setTimeout(() => {
                    window.expenseManager.updateUI();
                    console.log('✅ Forced UI update');
                }, 500);
            } catch (error) {
                console.error('❌ UI update failed:', error);
            }
        }

        console.log('✅ General fixes applied');
    }

    createFallbackUpdateChart() {
        return function() {
            console.log('🔄 Using fallback chart update...');
            
            const canvas = document.getElementById('expenseChart');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Check if we have Chart.js
            if (typeof Chart === 'undefined') {
                this.drawFallbackMessage(ctx, canvas, 'Chart.js not loaded');
                return;
            }

            // Check if we have data
            const hasData = this.expenses && this.expenses.length > 0;
            if (!hasData) {
                this.drawFallbackMessage(ctx, canvas, 'No expenses to display');
                return;
            }

            // Try to create chart
            try {
                if (this.chart) {
                    this.chart.destroy();
                }

                const categoryData = Object.keys(this.categories).map(key => ({
                    label: this.categories[key].name,
                    value: this.categories[key].spent,
                    color: this.categories[key].color
                })).filter(item => item.value > 0);

                if (categoryData.length === 0) {
                    this.drawFallbackMessage(ctx, canvas, 'No expenses to display');
                    return;
                }

                this.chart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: categoryData.map(item => item.label),
                        datasets: [{
                            data: categoryData.map(item => item.value),
                            backgroundColor: categoryData.map(item => item.color),
                            borderWidth: 2,
                            borderColor: '#ffffff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    padding: 20,
                                    usePointStyle: true,
                                    font: {
                                        family: 'Inter',
                                        size: 12
                                    }
                                }
                            }
                        }
                    }
                });

                console.log('✅ Fallback chart created successfully');

            } catch (error) {
                console.error('❌ Fallback chart creation failed:', error);
                this.drawFallbackMessage(ctx, canvas, 'Chart creation failed');
            }
        }.bind(this);
    }

    drawFallbackMessage(ctx, canvas, message) {
        ctx.font = '16px Inter, Arial, sans-serif';
        ctx.fillStyle = '#6b7280';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    }

    showChartError() {
        const canvas = document.getElementById('expenseChart');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                this.drawFallbackMessage(ctx, canvas, 'Chart library failed to load');
            }
        }
    }

    // Manual fix function
    manualFix() {
        console.log('🔧 Running manual fix...');
        this.diagnoseAndFix();
    }
}

// Initialize the fixer
const monthlyReportFixer = new MonthlyReportFixer();

// Make manual fix available globally
window.fixMonthlyReport = () => monthlyReportFixer.manualFix();

console.log('✅ Comprehensive Monthly Report Fix loaded');
console.log('💡 Run fixMonthlyReport() to manually fix issues');
