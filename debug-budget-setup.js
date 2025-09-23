// Debug script for budget setup issues
console.log('🔍 Debug Budget Setup Script Loaded');

// Function to debug budget setup functionality
window.debugBudgetSetup = function() {
    console.log('=== BUDGET SETUP DEBUG REPORT ===');
    
    // 1. Check if expense manager is initialized
    console.log('1. Expense Manager Status:');
    if (window.expenseManager) {
        console.log('✅ Expense Manager is initialized');
        console.log('   Budget object:', window.expenseManager.budget);
        console.log('   Categories:', Object.keys(window.expenseManager.categories).length);
    } else {
        console.log('❌ Expense Manager not initialized');
        
        // Try to initialize manually
        console.log('🔄 Attempting manual initialization...');
        if (document.getElementById('expense-manager')) {
            try {
                window.expenseManager = new ExpenseManager();
                console.log('✅ Manual initialization successful');
            } catch (error) {
                console.log('❌ Manual initialization failed:', error);
                return;
            }
        } else {
            console.log('❌ Expense manager section not found');
            return;
        }
    }
    
    // 2. Check DOM elements
    console.log('\n2. DOM Elements:');
    const monthlyIncomeInput = document.getElementById('monthlyIncome');
    const savingsPercentageInput = document.getElementById('savingsPercentage');
    const setupBudgetButton = document.getElementById('setupBudget');
    
    console.log('   Monthly income input:', monthlyIncomeInput);
    console.log('   Savings percentage input:', savingsPercentageInput);
    console.log('   Setup budget button:', setupBudgetButton);
    
    if (monthlyIncomeInput) {
        console.log('   Monthly income value:', monthlyIncomeInput.value);
        console.log('   Monthly income type:', monthlyIncomeInput.type);
    }
    
    if (savingsPercentageInput) {
        console.log('   Savings percentage value:', savingsPercentageInput.value);
        console.log('   Savings percentage type:', savingsPercentageInput.type);
    }
    
    if (setupBudgetButton) {
        console.log('   Setup button onclick:', setupBudgetButton.onclick);
        console.log('   Setup button event listeners:', setupBudgetButton.getEventListeners ? setupBudgetButton.getEventListeners() : 'Cannot check');
    }
    
    // 3. Check localStorage
    console.log('\n3. LocalStorage Data:');
    const savedBudget = localStorage.getItem('budgetBuddyBudget');
    console.log('   Raw localStorage budget:', savedBudget);
    
    if (savedBudget) {
        try {
            const parsedBudget = JSON.parse(savedBudget);
            console.log('   Parsed budget:', parsedBudget);
        } catch (e) {
            console.log('   ❌ Error parsing budget:', e);
        }
    } else {
        console.log('   No budget found in localStorage');
    }
    
    // 4. Test function availability
    console.log('\n4. Function Tests:');
    if (window.expenseManager) {
        console.log('   setupBudget function:', typeof window.expenseManager.setupBudget);
        console.log('   saveData function:', typeof window.expenseManager.saveData);
        console.log('   updateUI function:', typeof window.expenseManager.updateUI);
    }
    
    console.log('=== END DEBUG REPORT ===');
};

// Function to test budget setup with sample data
window.testBudgetSetup = function(income = 50000, savings = 20) {
    console.log('🧪 Testing budget setup...');
    console.log(`Using income: ₹${income}, savings: ${savings}%`);
    
    if (!window.expenseManager) {
        console.log('❌ ExpenseManager not available');
        return;
    }
    
    // Set form values
    const monthlyIncomeInput = document.getElementById('monthlyIncome');
    const savingsPercentageInput = document.getElementById('savingsPercentage');
    
    if (monthlyIncomeInput) {
        monthlyIncomeInput.value = income;
        console.log('✅ Set monthly income to:', income);
    } else {
        console.log('❌ Monthly income input not found');
        return;
    }
    
    if (savingsPercentageInput) {
        savingsPercentageInput.value = savings;
        console.log('✅ Set savings percentage to:', savings);
    } else {
        console.log('⚠️ Savings percentage input not found, using default');
    }
    
    // Test the setup function
    console.log('Calling setupBudget()...');
    
    try {
        window.expenseManager.setupBudget();
        
        // Check results
        console.log('Budget after setup:', window.expenseManager.budget);
        
        // Check categories
        console.log('Categories after setup:');
        Object.keys(window.expenseManager.categories).forEach(categoryKey => {
            const category = window.expenseManager.categories[categoryKey];
            console.log(`  ${category.name}: Budget ₹${category.budget}, Spent ₹${category.spent}`);
        });
        
        console.log('✅ Budget setup test completed');
        
    } catch (error) {
        console.log('❌ Budget setup failed:', error);
    }
};

// Function to fix budget setup issues
window.fixBudgetSetup = function() {
    console.log('🔧 Fixing budget setup issues...');
    
    if (!window.expenseManager) {
        console.log('❌ ExpenseManager not available');
        return;
    }
    
    // Check and fix event listeners
    const setupButton = document.getElementById('setupBudget');
    if (setupButton) {
        console.log('🔧 Re-attaching budget setup event listener...');
        
        // Remove old listeners by cloning the button
        const newButton = setupButton.cloneNode(true);
        
        // Add new event listener
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 Budget setup button clicked');
            
            if (window.expenseManager && typeof window.expenseManager.setupBudget === 'function') {
                window.expenseManager.setupBudget();
            } else {
                console.log('❌ ExpenseManager or setupBudget function not available');
            }
        });
        
        // Replace old button with new one
        setupButton.parentNode.replaceChild(newButton, setupButton);
        console.log('✅ Budget setup button fixed');
    } else {
        console.log('❌ Setup budget button not found');
    }
    
    // Check and fix Enter key listener for income input
    const incomeInput = document.getElementById('monthlyIncome');
    if (incomeInput) {
        console.log('🔧 Re-attaching income input Enter key listener...');
        
        const newIncomeInput = incomeInput.cloneNode(true);
        
        newIncomeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('⌨️ Enter key pressed in income input');
                
                if (window.expenseManager && typeof window.expenseManager.setupBudget === 'function') {
                    window.expenseManager.setupBudget();
                } else {
                    console.log('❌ ExpenseManager or setupBudget function not available');
                }
            }
        });
        
        incomeInput.parentNode.replaceChild(newIncomeInput, incomeInput);
        console.log('✅ Income input Enter key listener fixed');
    }
    
    console.log('✅ Budget setup fix completed');
};

// Function to clear budget data
window.clearBudgetData = function() {
    console.log('🗑️ Clearing budget data...');
    
    if (window.expenseManager) {
        window.expenseManager.budget = {};
        
        // Reset category budgets
        Object.keys(window.expenseManager.categories).forEach(categoryKey => {
            window.expenseManager.categories[categoryKey].budget = 0;
        });
        
        window.expenseManager.saveData();
        window.expenseManager.updateUI();
        
        console.log('✅ Budget data cleared');
    }
    
    // Clear form inputs
    const monthlyIncomeInput = document.getElementById('monthlyIncome');
    const savingsPercentageInput = document.getElementById('savingsPercentage');
    
    if (monthlyIncomeInput) monthlyIncomeInput.value = '';
    if (savingsPercentageInput) savingsPercentageInput.value = '';
    
    console.log('✅ Form inputs cleared');
};

// Auto-run debug when script loads
setTimeout(() => {
    console.log('🚀 Auto-running budget setup debug...');
    window.debugBudgetSetup();
}, 2000);
