// Comprehensive Feature Testing and Fixing for Hackathon Presentation
console.log('🚀 Loading Comprehensive Feature Test & Fix System...');

class FeatureTester {
    constructor() {
        this.testResults = {};
        this.fixes = [];
        this.init();
    }

    init() {
        console.log('🔧 Initializing Feature Tester...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startTesting());
        } else {
            this.startTesting();
        }
    }

    startTesting() {
        setTimeout(() => {
            this.runAllTests();
        }, 3000); // Wait for all scripts to load
    }

    async runAllTests() {
        console.log('🧪 Starting comprehensive feature testing...');
        
        const features = [
            'budgetSetup',
            'expenseManager', 
            'monthlyReport',
            'piggyBank',
            'exportFunctionality',
            'navigation',
            'contactForm',
            'responsiveDesign'
        ];

        for (const feature of features) {
            try {
                console.log(`🔍 Testing ${feature}...`);
                const result = await this.testFeature(feature);
                this.testResults[feature] = result;
                
                if (!result.working) {
                    console.log(`🔧 Fixing ${feature}...`);
                    await this.fixFeature(feature, result.issues);
                }
            } catch (error) {
                console.error(`❌ Error testing ${feature}:`, error);
                this.testResults[feature] = { working: false, issues: [error.message] };
            }
        }

        this.generateReport();
    }

    async testFeature(feature) {
        switch (feature) {
            case 'budgetSetup':
                return this.testBudgetSetup();
            case 'expenseManager':
                return this.testExpenseManager();
            case 'monthlyReport':
                return this.testMonthlyReport();
            case 'piggyBank':
                return this.testPiggyBank();
            case 'exportFunctionality':
                return this.testExportFunctionality();
            case 'navigation':
                return this.testNavigation();
            case 'contactForm':
                return this.testContactForm();
            case 'responsiveDesign':
                return this.testResponsiveDesign();
            default:
                return { working: false, issues: ['Unknown feature'] };
        }
    }

    testBudgetSetup() {
        const issues = [];
        
        // Check if elements exist
        const incomeInput = document.getElementById('monthlyIncome');
        const savingsInput = document.getElementById('savingsPercentage');
        const setupBtn = document.getElementById('setupBudget');
        
        if (!incomeInput) issues.push('Monthly income input missing');
        if (!savingsInput) issues.push('Savings percentage input missing');
        if (!setupBtn) issues.push('Setup budget button missing');
        
        // Check if expense manager exists
        if (!window.expenseManager) issues.push('Expense manager not initialized');
        
        return {
            working: issues.length === 0,
            issues: issues
        };
    }

    testExpenseManager() {
        const issues = [];
        
        // Check if expense manager exists
        if (!window.expenseManager) {
            issues.push('Expense manager not initialized');
            return { working: false, issues };
        }
        
        // Check form elements
        const descInput = document.getElementById('expenseDescription');
        const amountInput = document.getElementById('expenseAmount');
        const categorySelect = document.getElementById('expenseCategory');
        const dateInput = document.getElementById('expenseDate');
        const addBtn = document.getElementById('addExpense');
        
        if (!descInput) issues.push('Expense description input missing');
        if (!amountInput) issues.push('Expense amount input missing');
        if (!categorySelect) issues.push('Category select missing');
        if (!dateInput) issues.push('Date input missing');
        if (!addBtn) issues.push('Add expense button missing');
        
        // Check if methods exist
        if (typeof window.expenseManager.addExpense !== 'function') {
            issues.push('Add expense method missing');
        }
        if (typeof window.expenseManager.deleteExpense !== 'function') {
            issues.push('Delete expense method missing');
        }
        
        return {
            working: issues.length === 0,
            issues: issues
        };
    }

    testMonthlyReport() {
        const issues = [];
        
        // Check canvas element
        const canvas = document.getElementById('expenseChart');
        if (!canvas) issues.push('Chart canvas missing');
        
        // Check insights container
        const insights = document.getElementById('reportInsights');
        if (!insights) issues.push('Insights container missing');
        
        // Check Chart.js
        if (typeof Chart === 'undefined') issues.push('Chart.js not loaded');
        
        // Check if expense manager has chart methods
        if (window.expenseManager && typeof window.expenseManager.updateChart !== 'function') {
            issues.push('Update chart method missing');
        }
        
        return {
            working: issues.length === 0,
            issues: issues
        };
    }

    testPiggyBank() {
        const issues = [];
        
        // Check if piggy bank exists
        if (!window.piggyBank) issues.push('Piggy bank not initialized');
        
        // Check savings overview elements
        const totalSavings = document.getElementById('totalSavings');
        const monthlyTarget = document.getElementById('monthlyTarget');
        const goalsAchieved = document.getElementById('goalsAchieved');
        
        if (!totalSavings) issues.push('Total savings display missing');
        if (!monthlyTarget) issues.push('Monthly target display missing');
        if (!goalsAchieved) issues.push('Goals achieved display missing');
        
        // Check quick save buttons
        const quickSaveBtns = document.querySelectorAll('.quick-amount');
        if (quickSaveBtns.length === 0) issues.push('Quick save buttons missing');
        
        // Check goal creation elements
        const addGoalBtn = document.getElementById('addGoalBtn');
        const goalModal = document.getElementById('goalModal');
        
        if (!addGoalBtn) issues.push('Add goal button missing');
        if (!goalModal) issues.push('Goal modal missing');
        
        return {
            working: issues.length === 0,
            issues: issues
        };
    }

    testExportFunctionality() {
        const issues = [];
        
        // Check export buttons
        const exportDataBtn = document.getElementById('exportData');
        const exportSavingsBtn = document.getElementById('exportSavingsBtn');
        
        if (!exportDataBtn) issues.push('Export data button missing');
        if (!exportSavingsBtn) issues.push('Export savings button missing');
        
        // Check jsPDF
        if (!window.jsPDF && typeof jsPDF === 'undefined') {
            issues.push('jsPDF library not loaded');
        }
        
        return {
            working: issues.length === 0,
            issues: issues
        };
    }

    testNavigation() {
        const issues = [];
        
        // Check navigation elements
        const navbar = document.querySelector('.navbar');
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!navbar) issues.push('Navbar missing');
        if (!hamburger) issues.push('Hamburger menu missing');
        if (!navMenu) issues.push('Navigation menu missing');
        
        // Check desktop tools
        const toolsBtn = document.getElementById('desktopToolsBtn');
        const toolsMenu = document.getElementById('desktopToolsMenu');
        
        if (!toolsBtn) issues.push('Desktop tools button missing');
        if (!toolsMenu) issues.push('Desktop tools menu missing');
        
        return {
            working: issues.length === 0,
            issues: issues
        };
    }

    testContactForm() {
        const issues = [];
        
        // Check contact form elements
        const contactForm = document.getElementById('contact-form');
        const nameInput = document.getElementById('from_name');
        const emailInput = document.getElementById('from_email');
        const messageInput = document.getElementById('message');
        const sendBtn = document.getElementById('send-btn');
        
        if (!contactForm) issues.push('Contact form missing');
        if (!nameInput) issues.push('Name input missing');
        if (!emailInput) issues.push('Email input missing');
        if (!messageInput) issues.push('Message input missing');
        if (!sendBtn) issues.push('Send button missing');
        
        // Check EmailJS
        if (typeof emailjs === 'undefined') issues.push('EmailJS not loaded');
        
        return {
            working: issues.length === 0,
            issues: issues
        };
    }

    testResponsiveDesign() {
        const issues = [];
        
        // Check viewport meta tag
        const viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) issues.push('Viewport meta tag missing');
        
        // Check CSS files
        const mainCSS = document.querySelector('link[href="styles.css"]');
        const navCSS = document.querySelector('link[href="desktop-navigation.css"]');
        
        if (!mainCSS) issues.push('Main CSS file missing');
        if (!navCSS) issues.push('Navigation CSS file missing');
        
        return {
            working: issues.length === 0,
            issues: issues
        };
    }

    async fixFeature(feature, issues) {
        console.log(`🔧 Applying fixes for ${feature}:`, issues);
        
        switch (feature) {
            case 'budgetSetup':
                this.fixBudgetSetup(issues);
                break;
            case 'expenseManager':
                this.fixExpenseManager(issues);
                break;
            case 'monthlyReport':
                this.fixMonthlyReport(issues);
                break;
            case 'piggyBank':
                this.fixPiggyBank(issues);
                break;
            case 'exportFunctionality':
                this.fixExportFunctionality(issues);
                break;
            case 'navigation':
                this.fixNavigation(issues);
                break;
            case 'contactForm':
                this.fixContactForm(issues);
                break;
            case 'responsiveDesign':
                this.fixResponsiveDesign(issues);
                break;
        }
    }

    fixBudgetSetup(issues) {
        // Reinitialize expense manager if missing
        if (issues.includes('Expense manager not initialized')) {
            if (typeof ExpenseManager !== 'undefined') {
                try {
                    window.expenseManager = new ExpenseManager();
                    console.log('✅ Expense manager reinitialized');
                } catch (error) {
                    console.error('❌ Failed to reinitialize expense manager:', error);
                }
            }
        }
    }

    fixExpenseManager(issues) {
        // Same as budget setup fix
        this.fixBudgetSetup(issues);
        
        // Set default date if missing
        const dateInput = document.getElementById('expenseDate');
        if (dateInput && !dateInput.value) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }

    fixMonthlyReport(issues) {
        // Create canvas if missing
        if (issues.includes('Chart canvas missing')) {
            const chartContainer = document.querySelector('.report-chart');
            if (chartContainer) {
                const canvas = document.createElement('canvas');
                canvas.id = 'expenseChart';
                canvas.width = 400;
                canvas.height = 200;
                chartContainer.appendChild(canvas);
                console.log('✅ Chart canvas created');
            }
        }
        
        // Create insights container if missing
        if (issues.includes('Insights container missing')) {
            const reportSection = document.querySelector('.monthly-report');
            if (reportSection) {
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
    }

    fixPiggyBank(issues) {
        // Reinitialize piggy bank if missing
        if (issues.includes('Piggy bank not initialized')) {
            if (typeof PiggyBank !== 'undefined') {
                try {
                    window.piggyBank = new PiggyBank();
                    console.log('✅ Piggy bank reinitialized');
                } catch (error) {
                    console.error('❌ Failed to reinitialize piggy bank:', error);
                }
            }
        }
    }

    fixExportFunctionality(issues) {
        // Try to reload jsPDF if missing
        if (issues.includes('jsPDF library not loaded')) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => console.log('✅ jsPDF reloaded');
            document.head.appendChild(script);
        }
    }

    fixNavigation(issues) {
        // Add event listeners for navigation if missing
        setTimeout(() => {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            if (hamburger && navMenu) {
                hamburger.addEventListener('click', () => {
                    navMenu.classList.toggle('active');
                });
            }
            
            // Fix tools dropdown
            const toolsBtn = document.getElementById('desktopToolsBtn');
            const toolsMenu = document.getElementById('desktopToolsMenu');
            
            if (toolsBtn && toolsMenu) {
                toolsBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toolsMenu.classList.toggle('show');
                });
                
                document.addEventListener('click', () => {
                    toolsMenu.classList.remove('show');
                });
            }
        }, 1000);
    }

    fixContactForm(issues) {
        // Try to reload EmailJS if missing
        if (issues.includes('EmailJS not loaded')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
            script.onload = () => console.log('✅ EmailJS reloaded');
            document.head.appendChild(script);
        }
    }

    fixResponsiveDesign(issues) {
        // Add viewport meta tag if missing
        if (issues.includes('Viewport meta tag missing')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0';
            document.head.appendChild(viewport);
            console.log('✅ Viewport meta tag added');
        }
    }

    generateReport() {
        console.log('📊 COMPREHENSIVE FEATURE TEST REPORT');
        console.log('=====================================');
        
        let totalFeatures = Object.keys(this.testResults).length;
        let workingFeatures = 0;
        
        Object.entries(this.testResults).forEach(([feature, result]) => {
            const status = result.working ? '✅' : '❌';
            console.log(`${status} ${feature}: ${result.working ? 'WORKING' : 'ISSUES FOUND'}`);
            
            if (!result.working && result.issues.length > 0) {
                result.issues.forEach(issue => {
                    console.log(`   - ${issue}`);
                });
            }
            
            if (result.working) workingFeatures++;
        });
        
        console.log('=====================================');
        console.log(`📈 SUMMARY: ${workingFeatures}/${totalFeatures} features working`);
        
        if (workingFeatures === totalFeatures) {
            console.log('🎉 ALL FEATURES ARE WORKING! Ready for hackathon presentation!');
        } else {
            console.log('⚠️ Some features need attention. Check the issues above.');
        }
        
        // Store results globally for manual inspection
        window.featureTestResults = this.testResults;
    }

    // Manual test function
    manualTest() {
        console.log('🔄 Running manual feature test...');
        this.runAllTests();
    }
}

// Initialize the tester
const featureTester = new FeatureTester();

// Make manual test available globally
window.testAllFeatures = () => featureTester.manualTest();

console.log('✅ Comprehensive Feature Tester loaded');
console.log('💡 Run testAllFeatures() to manually test all features');
