// Quick fix script for expense deletion issues
// Run this in the browser console if deletion is still not working

console.log('🔧 Running Expense Deletion Fix Script...');

// Function to fix expense deletion issues
window.fixExpenseDeletion = function() {
    console.log('=== EXPENSE DELETION FIX ===');
    
    // 1. Check if expense manager exists
    if (!window.expenseManager) {
        console.log('❌ ExpenseManager not found, attempting to initialize...');
        
        if (typeof ExpenseManager !== 'undefined') {
            try {
                window.expenseManager = new ExpenseManager();
                console.log('✅ ExpenseManager initialized successfully');
            } catch (error) {
                console.log('❌ Failed to initialize ExpenseManager:', error);
                return false;
            }
        } else {
            console.log('❌ ExpenseManager class not available');
            return false;
        }
    }
    
    // 2. Fix delete button event listeners
    console.log('🔧 Fixing delete button event listeners...');
    
    const expensesList = document.getElementById('expensesList');
    if (!expensesList) {
        console.log('❌ Expenses list container not found');
        return false;
    }
    
    const deleteButtons = expensesList.querySelectorAll('.btn-delete');
    console.log(`Found ${deleteButtons.length} delete buttons`);
    
    let fixedButtons = 0;
    
    deleteButtons.forEach((button, index) => {
        // Get expense ID from data attribute or onclick
        let expenseId = button.getAttribute('data-expense-id');
        
        if (!expenseId) {
            // Try to extract from onclick attribute
            const onclickAttr = button.getAttribute('onclick');
            if (onclickAttr) {
                const match = onclickAttr.match(/deleteExpense\(['"]([^'"]+)['"]\)/);
                if (match) {
                    expenseId = match[1];
                }
            }
        }
        
        if (expenseId) {
            // Remove old event listeners and onclick
            button.removeAttribute('onclick');
            
            // Clone button to remove all event listeners
            const newButton = button.cloneNode(true);
            
            // Add new event listener
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🗑️ Delete button clicked for expense: ${expenseId}`);
                
                if (window.expenseManager && typeof window.expenseManager.deleteExpense === 'function') {
                    window.expenseManager.deleteExpense(expenseId);
                } else {
                    console.log('❌ ExpenseManager or deleteExpense function not available');
                }
            });
            
            // Replace old button with new one
            button.parentNode.replaceChild(newButton, button);
            fixedButtons++;
            
            console.log(`✅ Fixed delete button ${index + 1} for expense ${expenseId}`);
        } else {
            console.log(`⚠️ Could not find expense ID for button ${index + 1}`);
        }
    });
    
    console.log(`✅ Fixed ${fixedButtons} delete buttons`);
    
    // 3. Fix clear all button
    console.log('🔧 Fixing clear all button...');
    
    const clearButton = document.getElementById('clearExpenses');
    if (clearButton) {
        // Remove old event listeners
        const newClearButton = clearButton.cloneNode(true);
        
        newClearButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🧹 Clear all button clicked');
            
            if (window.expenseManager && typeof window.expenseManager.clearExpenses === 'function') {
                window.expenseManager.clearExpenses();
            } else {
                console.log('❌ ExpenseManager or clearExpenses function not available');
            }
        });
        
        clearButton.parentNode.replaceChild(newClearButton, clearButton);
        console.log('✅ Fixed clear all button');
    } else {
        console.log('⚠️ Clear all button not found');
    }
    
    console.log('=== FIX COMPLETE ===');
    return true;
};

// Function to test deletion functionality
window.testDeletion = function() {
    console.log('🧪 Testing deletion functionality...');
    
    if (!window.expenseManager) {
        console.log('❌ ExpenseManager not available');
        return;
    }
    
    const expenseCount = window.expenseManager.expenses.length;
    console.log(`Current expenses: ${expenseCount}`);
    
    if (expenseCount === 0) {
        console.log('Creating test expense for deletion test...');
        
        const testExpense = {
            id: Date.now().toString(),
            description: 'Test Deletion Expense',
            amount: 100,
            category: 'other',
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };
        
        window.expenseManager.expenses.push(testExpense);
        window.expenseManager.categories.other.spent += testExpense.amount;
        window.expenseManager.saveData();
        window.expenseManager.updateUI();
        
        console.log('✅ Test expense created');
    }
    
    // Test deleting first expense
    if (window.expenseManager.expenses.length > 0) {
        const firstExpense = window.expenseManager.expenses[0];
        console.log(`Testing deletion of: ${firstExpense.description} (ID: ${firstExpense.id})`);
        
        const beforeCount = window.expenseManager.expenses.length;
        window.expenseManager.deleteExpense(firstExpense.id);
        const afterCount = window.expenseManager.expenses.length;
        
        if (afterCount === beforeCount - 1) {
            console.log('✅ Deletion test PASSED');
        } else {
            console.log('❌ Deletion test FAILED');
        }
    }
};

// Auto-run the fix
console.log('🚀 Auto-running expense deletion fix...');
setTimeout(() => {
    if (window.fixExpenseDeletion()) {
        console.log('✅ Expense deletion fix applied successfully!');
        console.log('💡 You can now try deleting expenses. If issues persist, run testDeletion() in console.');
    } else {
        console.log('❌ Fix failed. Please check the console for errors.');
    }
}, 1000);

// Export functions to global scope
window.fixExpenseDeletion = fixExpenseDeletion;
window.testDeletion = testDeletion;
