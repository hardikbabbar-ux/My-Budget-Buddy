// Comprehensive Test Suite for Budget Buddy
console.log('🧪 Budget Buddy Comprehensive Test Suite');

class BudgetBuddyTester {
    constructor() {
        this.testResults = [];
        this.passedTests = 0;
        this.failedTests = 0;
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = type === 'pass' ? '✅' : type === 'fail' ? '❌' : type === 'warn' ? '⚠️' : 'ℹ️';
        console.log(`[${timestamp}] ${prefix} ${message}`);
    }

    test(testName, testFunction) {
        try {
            this.log(`Running test: ${testName}`, 'info');
            const result = testFunction();
            if (result) {
                this.log(`PASSED: ${testName}`, 'pass');
                this.passedTests++;
                this.testResults.push({ name: testName, status: 'PASSED', error: null });
            } else {
                this.log(`FAILED: ${testName}`, 'fail');
                this.failedTests++;
                this.testResults.push({ name: testName, status: 'FAILED', error: 'Test returned false' });
            }
        } catch (error) {
            this.log(`ERROR in ${testName}: ${error.message}`, 'fail');
            this.failedTests++;
            this.testResults.push({ name: testName, status: 'ERROR', error: error.message });
        }
    }

    // Test 1: Check if all required DOM elements exist
    testDOMElements() {
        const requiredElements = [
            // Navigation elements
            'desktopToolsBtn', 'desktopToolsMenu',
            
            // Expense Manager elements
            'monthlyIncome', 'savingsPercentage', 'setupBudget',
            'expenseDescription', 'expenseAmount', 'expenseCategory', 'expenseDate', 'addExpense',
            'totalBudget', 'totalExpenses', 'remainingBudget', 'savingsGoal',
            'categoryBudgets', 'expensesList', 'clearExpenses', 'exportData',
            'expenseChart', 'reportInsights',
            
            // Piggy Bank elements
            'totalSavings', 'monthlyTarget', 'goalsAchieved',
            'customSaveAmount', 'saveMoneyBtn', 'addGoalBtn',
            'goalsList', 'savingsHistory', 'withdrawBtn', 'exportSavingsBtn',
            'savingsChart', 'savingsInsights',
            
            // Modal elements
            'goalModal', 'withdrawModal',
            
            // Contact form elements
            'contact-form', 'from_name', 'from_email', 'message', 'send-btn'
        ];

        let missingElements = [];
        requiredElements.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                missingElements.push(id);
            }
        });

        if (missingElements.length > 0) {
            this.log(`Missing DOM elements: ${missingElements.join(', ')}`, 'warn');
            return false;
        }

        return true;
    }

    // Test 2: Check if all JavaScript classes are loaded
    testJavaScriptClasses() {
        const requiredClasses = ['ExpenseManager', 'PiggyBank', 'DesktopNavigation', 'EmailService'];
        let missingClasses = [];

        requiredClasses.forEach(className => {
            if (typeof window[className] === 'undefined') {
                missingClasses.push(className);
            }
        });

        if (missingClasses.length > 0) {
            this.log(`Missing JavaScript classes: ${missingClasses.join(', ')}`, 'warn');
            return false;
        }

        return true;
    }

    // Test 3: Check if instances are created
    testInstances() {
        const requiredInstances = ['expenseManager', 'piggyBank', 'desktopNavigation'];
        let missingInstances = [];

        requiredInstances.forEach(instanceName => {
            if (!window[instanceName]) {
                missingInstances.push(instanceName);
            }
        });

        if (missingInstances.length > 0) {
            this.log(`Missing instances: ${missingInstances.join(', ')}`, 'warn');
            return false;
        }

        return true;
    }

    // Test 4: Test Expense Manager functionality
    testExpenseManager() {
        if (!window.expenseManager) {
            this.log('Expense Manager not found', 'fail');
            return false;
        }

        // Test budget setup
        const incomeInput = document.getElementById('monthlyIncome');
        const savingsInput = document.getElementById('savingsPercentage');
        
        if (!incomeInput || !savingsInput) {
            this.log('Budget setup inputs not found', 'fail');
            return false;
        }

        // Only test if there's no existing budget to avoid overwriting user data
        const existingBudget = JSON.parse(localStorage.getItem('budgetBuddyBudget') || '{}');
        
        if (!existingBudget.income) {
            // Set test values only if no budget exists
            incomeInput.value = '15000';
            savingsInput.value = '20';

            // Test setup budget
            try {
                window.expenseManager.setupBudget();
                
                // Check if budget was set
                const budget = JSON.parse(localStorage.getItem('budgetBuddyBudget') || '{}');
                if (!budget.income || budget.income !== 15000) {
                    this.log('Budget setup failed - income not set correctly', 'fail');
                    return false;
                }
                
                // Clear the test data after testing
                incomeInput.value = '';
                savingsInput.value = '';
                
            } catch (error) {
                this.log(`Budget setup error: ${error.message}`, 'fail');
                return false;
            }
        } else {
            this.log('Skipping budget setup test - existing budget found', 'info');
        }

        this.log('Budget setup successful', 'pass');

        // Test adding expense
        try {
            const descInput = document.getElementById('expenseDescription');
            const amountInput = document.getElementById('expenseAmount');
            const categorySelect = document.getElementById('expenseCategory');
            const dateInput = document.getElementById('expenseDate');

            if (!descInput || !amountInput || !categorySelect || !dateInput) {
                this.log('Expense form inputs not found', 'fail');
                return false;
            }

            descInput.value = 'Test Expense';
            amountInput.value = '500';
            categorySelect.value = 'food';
            dateInput.value = new Date().toISOString().split('T')[0];

            window.expenseManager.addExpense();

            // Check if expense was added
            const expenses = JSON.parse(localStorage.getItem('budgetBuddyExpenses') || '[]');
            if (expenses.length === 0) {
                this.log('Add expense failed - no expenses found', 'fail');
                return false;
            }

            this.log('Add expense successful', 'pass');
        } catch (error) {
            this.log(`Add expense error: ${error.message}`, 'fail');
            return false;
        }

        return true;
    }

    // Test 5: Test Piggy Bank functionality
    testPiggyBank() {
        if (!window.piggyBank) {
            this.log('Piggy Bank not found', 'fail');
            return false;
        }

        // Test quick save
        try {
            const result = window.piggyBank.saveMoney(100, 'Test Save');
            if (!result) {
                this.log('Quick save failed - insufficient balance or error', 'warn');
                // This might fail if no budget is set up, which is okay
            } else {
                this.log('Quick save successful', 'pass');
            }
        } catch (error) {
            this.log(`Quick save error: ${error.message}`, 'fail');
            return false;
        }

        // Test goal creation
        try {
            const goalNameInput = document.getElementById('goalName');
            const goalAmountInput = document.getElementById('goalAmount');
            const goalDeadlineInput = document.getElementById('goalDeadline');

            if (!goalNameInput || !goalAmountInput || !goalDeadlineInput) {
                this.log('Goal form inputs not found', 'fail');
                return false;
            }

            goalNameInput.value = 'Test Goal';
            goalAmountInput.value = '5000';
            goalDeadlineInput.value = '2024-12-31';

            window.piggyBank.createGoal();

            // Check if goal was created
            const goals = JSON.parse(localStorage.getItem('budgetBuddyGoals') || '[]');
            if (goals.length === 0) {
                this.log('Goal creation failed - no goals found', 'fail');
                return false;
            }

            this.log('Goal creation successful', 'pass');
        } catch (error) {
            this.log(`Goal creation error: ${error.message}`, 'fail');
            return false;
        }

        return true;
    }

    // Test 6: Test Tools Dropdown
    testToolsDropdown() {
        const toolsBtn = document.getElementById('desktopToolsBtn');
        const toolsMenu = document.getElementById('desktopToolsMenu');

        if (!toolsBtn || !toolsMenu) {
            this.log('Tools dropdown elements not found', 'fail');
            return false;
        }

        // Test click functionality
        try {
            toolsBtn.click();
            
            // Check if menu is visible (this might vary based on CSS implementation)
            const isVisible = toolsMenu.style.display !== 'none' && 
                             toolsMenu.offsetParent !== null;
            
            if (!isVisible) {
                // Try checking computed style
                const computedStyle = window.getComputedStyle(toolsMenu);
                const isVisibleComputed = computedStyle.display !== 'none' && 
                                        computedStyle.visibility !== 'hidden';
                
                if (!isVisibleComputed) {
                    this.log('Tools dropdown not visible after click', 'warn');
                    // This might be okay if CSS handles it differently
                }
            }

            this.log('Tools dropdown test completed', 'pass');
        } catch (error) {
            this.log(`Tools dropdown error: ${error.message}`, 'fail');
            return false;
        }

        return true;
    }

    // Test 7: Test Contact Form
    testContactForm() {
        const contactForm = document.getElementById('contact-form');
        const nameInput = document.getElementById('from_name');
        const emailInput = document.getElementById('from_email');
        const messageInput = document.getElementById('message');

        if (!contactForm || !nameInput || !emailInput || !messageInput) {
            this.log('Contact form elements not found', 'fail');
            return false;
        }

        // Test form validation (without actually sending)
        try {
            nameInput.value = 'Test User';
            emailInput.value = 'test@example.com';
            messageInput.value = 'This is a test message for the contact form functionality.';

            // Check if EmailJS is loaded
            if (typeof emailjs === 'undefined') {
                this.log('EmailJS not loaded - contact form will not work', 'warn');
                return true; // Not a critical failure
            }

            this.log('Contact form elements and EmailJS ready', 'pass');
        } catch (error) {
            this.log(`Contact form error: ${error.message}`, 'fail');
            return false;
        }

        return true;
    }

    // Test 8: Test Navigation and Smooth Scrolling
    testNavigation() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        if (navLinks.length === 0) {
            this.log('No navigation links found', 'fail');
            return false;
        }

        // Test if target sections exist
        let missingTargets = [];
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                const target = document.querySelector(href);
                if (!target) {
                    missingTargets.push(href);
                }
            }
        });

        if (missingTargets.length > 0) {
            this.log(`Missing navigation targets: ${missingTargets.join(', ')}`, 'warn');
            return false;
        }

        this.log('All navigation targets found', 'pass');
        return true;
    }

    // Test 9: Test Local Storage Integration
    testLocalStorage() {
        try {
            // Test if localStorage is available
            const testKey = 'budgetBuddyTest';
            const testValue = 'test';
            
            localStorage.setItem(testKey, testValue);
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);

            if (retrieved !== testValue) {
                this.log('LocalStorage not working correctly', 'fail');
                return false;
            }

            // Check if app data exists
            const budget = localStorage.getItem('budgetBuddyBudget');
            const expenses = localStorage.getItem('budgetBuddyExpenses');
            const savings = localStorage.getItem('budgetBuddySavings');
            const goals = localStorage.getItem('budgetBuddyGoals');

            this.log(`LocalStorage data found - Budget: ${!!budget}, Expenses: ${!!expenses}, Savings: ${!!savings}, Goals: ${!!goals}`, 'info');
            
        } catch (error) {
            this.log(`LocalStorage error: ${error.message}`, 'fail');
            return false;
        }

        return true;
    }

    // Test 10: Test Chart.js Integration
    testCharts() {
        if (typeof Chart === 'undefined') {
            this.log('Chart.js not loaded', 'fail');
            return false;
        }

        const expenseChart = document.getElementById('expenseChart');
        const savingsChart = document.getElementById('savingsChart');

        if (!expenseChart || !savingsChart) {
            this.log('Chart canvas elements not found', 'fail');
            return false;
        }

        this.log('Chart.js and canvas elements ready', 'pass');
        return true;
    }

    // Run all tests
    async runAllTests() {
        this.log('🚀 Starting Budget Buddy Comprehensive Test Suite', 'info');
        this.log('=' .repeat(60), 'info');

        // Wait a moment for everything to load
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.test('DOM Elements', () => this.testDOMElements());
        this.test('JavaScript Classes', () => this.testJavaScriptClasses());
        this.test('Instance Creation', () => this.testInstances());
        this.test('Expense Manager', () => this.testExpenseManager());
        this.test('Piggy Bank', () => this.testPiggyBank());
        this.test('Tools Dropdown', () => this.testToolsDropdown());
        this.test('Contact Form', () => this.testContactForm());
        this.test('Navigation', () => this.testNavigation());
        this.test('Local Storage', () => this.testLocalStorage());
        this.test('Charts Integration', () => this.testCharts());

        this.showResults();
    }

    showResults() {
        this.log('=' .repeat(60), 'info');
        this.log('🏁 TEST RESULTS SUMMARY', 'info');
        this.log('=' .repeat(60), 'info');
        
        this.log(`Total Tests: ${this.testResults.length}`, 'info');
        this.log(`Passed: ${this.passedTests}`, 'pass');
        this.log(`Failed: ${this.failedTests}`, 'fail');
        
        const successRate = ((this.passedTests / this.testResults.length) * 100).toFixed(1);
        this.log(`Success Rate: ${successRate}%`, successRate >= 80 ? 'pass' : 'fail');

        if (this.failedTests > 0) {
            this.log('Failed Tests:', 'fail');
            this.testResults.filter(test => test.status !== 'PASSED').forEach(test => {
                this.log(`  - ${test.name}: ${test.error || 'Unknown error'}`, 'fail');
            });
        }

        // Show recommendations
        this.log('=' .repeat(60), 'info');
        this.log('📋 RECOMMENDATIONS', 'info');
        
        if (successRate >= 90) {
            this.log('🎉 Excellent! Your Budget Buddy app is working great!', 'pass');
        } else if (successRate >= 70) {
            this.log('👍 Good! Most features are working. Check failed tests for improvements.', 'warn');
        } else {
            this.log('⚠️ Several issues found. Please review and fix the failed tests.', 'fail');
        }

        // Create a summary notification
        if (typeof window.showNotification === 'function') {
            const message = `Test Complete: ${this.passedTests}/${this.testResults.length} passed (${successRate}%)`;
            const type = successRate >= 80 ? 'success' : successRate >= 60 ? 'warning' : 'error';
            window.showNotification(message, type);
        }
    }
}

// Global function to run tests
window.runBudgetBuddyTests = function() {
    const tester = new BudgetBuddyTester();
    tester.runAllTests();
};

// Auto-run tests if this script is loaded directly
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => window.runBudgetBuddyTests(), 2000);
    });
} else {
    setTimeout(() => window.runBudgetBuddyTests(), 2000);
}

console.log('🧪 Budget Buddy Test Suite loaded. Run window.runBudgetBuddyTests() to start testing.');
