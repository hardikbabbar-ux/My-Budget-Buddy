// Debug script for expense deletion issues
console.log('🔍 Debug Expenses Script Loaded');

// Function to check expense deletion functionality
window.debugExpenseDeletion = function() {
    console.log('=== EXPENSE DELETION DEBUG REPORT ===');
    
    // Check if expense manager is initialized
    console.log('1. Expense Manager Status:');
    if (window.expenseManager) {
        console.log('✅ Expense Manager is initialized');
        console.log('   Expenses array:', window.expenseManager.expenses);
        console.log('   Expenses count:', window.expenseManager.expenses.length);
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
            }
        } else {
            console.log('❌ Expense manager section not found');
        }
    }
    
    // Check DOM elements
    console.log('\n2. DOM Elements:');
    const clearButton = document.getElementById('clearExpenses');
    console.log('   Clear expenses button:', clearButton);
    
    const expensesList = document.getElementById('expensesList');
    console.log('   Expenses list container:', expensesList);
    
    if (expensesList) {
        const deleteButtons = expensesList.querySelectorAll('.btn-delete');
        console.log('   Delete buttons found:', deleteButtons.length);
        
        deleteButtons.forEach((btn, index) => {
            console.log(`   Delete button ${index + 1}:`, btn);
            console.log(`   Onclick attribute:`, btn.getAttribute('onclick'));
        });
    }
    
    // Check localStorage
    console.log('\n3. LocalStorage Data:');
    const savedExpenses = localStorage.getItem('budgetBuddyExpenses');
    console.log('   Raw localStorage expenses:', savedExpenses);
    
    if (savedExpenses) {
        try {
            const parsedExpenses = JSON.parse(savedExpenses);
            console.log('   Parsed expenses:', parsedExpenses);
            console.log('   Number of saved expenses:', parsedExpenses.length);
        } catch (e) {
            console.log('   ❌ Error parsing expenses:', e);
        }
    } else {
        console.log('   No expenses found in localStorage');
    }
    
    // Test functions
    console.log('\n4. Function Tests:');
    if (window.expenseManager) {
        console.log('   deleteExpense function:', typeof window.expenseManager.deleteExpense);
        console.log('   clearExpenses function:', typeof window.expenseManager.clearExpenses);
        
        // Test if functions are properly bound
        try {
            console.log('   Testing function binding...');
            const testFunc = window.expenseManager.deleteExpense;
            console.log('   Function extracted successfully:', typeof testFunc);
        } catch (error) {
            console.log('   ❌ Function binding error:', error);
        }
    }
    
    console.log('=== END DEBUG REPORT ===');
};

// Function to test clearing expenses
window.testClearExpenses = function() {
    console.log('🧪 Testing clear expenses functionality...');
    
    if (!window.expenseManager) {
        console.log('❌ Expense Manager not available');
        return;
    }
    
    console.log('Current expenses count:', window.expenseManager.expenses.length);
    
    // Simulate clicking clear expenses (without confirmation)
    console.log('Simulating clear expenses...');
    
    // Temporarily override confirm to return true
    const originalConfirm = window.confirm;
    window.confirm = () => true;
    
    try {
        window.expenseManager.clearExpenses();
        console.log('✅ Clear expenses executed');
        console.log('New expenses count:', window.expenseManager.expenses.length);
    } catch (error) {
        console.log('❌ Clear expenses failed:', error);
    } finally {
        // Restore original confirm
        window.confirm = originalConfirm;
    }
};

// Function to test deleting a specific expense
window.testDeleteExpense = function(expenseId) {
    console.log('🧪 Testing delete expense functionality...');
    
    if (!window.expenseManager) {
        console.log('❌ Expense Manager not available');
        return;
    }
    
    if (!expenseId && window.expenseManager.expenses.length > 0) {
        expenseId = window.expenseManager.expenses[0].id;
        console.log('Using first expense ID:', expenseId);
    }
    
    if (!expenseId) {
        console.log('❌ No expense ID provided and no expenses available');
        return;
    }
    
    console.log('Attempting to delete expense:', expenseId);
    console.log('Expenses before deletion:', window.expenseManager.expenses.length);
    
    try {
        window.expenseManager.deleteExpense(expenseId);
        console.log('✅ Delete expense executed');
        console.log('Expenses after deletion:', window.expenseManager.expenses.length);
    } catch (error) {
        console.log('❌ Delete expense failed:', error);
    }
};

// Function to create test expenses for testing deletion
window.createTestExpenses = function() {
    console.log('🧪 Creating test expenses...');
    
    if (!window.expenseManager) {
        console.log('❌ Expense Manager not available');
        return;
    }
    
    const testExpenses = [
        { description: 'Test Coffee', amount: 150, category: 'food' },
        { description: 'Test Bus Fare', amount: 50, category: 'transport' },
        { description: 'Test Movie', amount: 300, category: 'entertainment' }
    ];
    
    testExpenses.forEach((expense, index) => {
        const expenseObj = {
            id: Date.now() + index,
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };
        
        window.expenseManager.expenses.push(expenseObj);
        window.expenseManager.categories[expense.category].spent += expense.amount;
    });
    
    window.expenseManager.saveData();
    window.expenseManager.updateUI();
    
    console.log('✅ Test expenses created');
    console.log('Total expenses now:', window.expenseManager.expenses.length);
};

// Function to fix delete button event listeners
window.fixDeleteButtons = function() {
    console.log('🔧 Fixing delete button event listeners...');
    
    const deleteButtons = document.querySelectorAll('.btn-delete');
    console.log('Found delete buttons:', deleteButtons.length);
    
    deleteButtons.forEach((button, index) => {
        const onclickAttr = button.getAttribute('onclick');
        console.log(`Button ${index + 1} onclick:`, onclickAttr);
        
        if (onclickAttr && onclickAttr.includes('deleteExpense')) {
            // Extract expense ID from onclick attribute
            const match = onclickAttr.match(/deleteExpense\('([^']+)'\)/);
            if (match) {
                const expenseId = match[1];
                console.log(`Fixing button for expense ID: ${expenseId}`);
                
                // Remove old onclick and add new event listener
                button.removeAttribute('onclick');
                button.addEventListener('click', function() {
                    console.log('Delete button clicked for expense:', expenseId);
                    if (window.expenseManager) {
                        window.expenseManager.deleteExpense(expenseId);
                    } else {
                        console.log('❌ Expense manager not available');
                    }
                });
                
                console.log(`✅ Fixed button ${index + 1}`);
            }
        }
    });
    
    console.log('✅ Delete button fix completed');
};

// Auto-run debug when script loads
setTimeout(() => {
    console.log('🚀 Auto-running expense deletion debug...');
    window.debugExpenseDeletion();
}, 2000);
