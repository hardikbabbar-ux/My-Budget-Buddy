// Test script for category spending functionality
console.log('🧪 Category Spending Test Script Loaded');

// Function to test category spending calculations
window.testCategorySpending = function() {
    console.log('=== CATEGORY SPENDING TEST ===');
    
    if (!window.expenseManager) {
        console.log('❌ ExpenseManager not found');
        return;
    }
    
    // Show current state
    console.log('\n📊 Current Category Spending:');
    Object.keys(window.expenseManager.categories).forEach(categoryKey => {
        const category = window.expenseManager.categories[categoryKey];
        const calculated = window.expenseManager.calculateCategorySpent(categoryKey);
        const stored = category.spent;
        
        console.log(`${category.name}:`);
        console.log(`  Stored: ₹${stored}`);
        console.log(`  Calculated: ₹${calculated}`);
        console.log(`  Match: ${stored === calculated ? '✅' : '❌'}`);
        
        if (stored !== calculated) {
            console.log(`  ⚠️ MISMATCH DETECTED!`);
        }
    });
    
    // Show expenses by category
    console.log('\n📝 Expenses by Category:');
    Object.keys(window.expenseManager.categories).forEach(categoryKey => {
        const categoryExpenses = window.expenseManager.expenses.filter(exp => exp.category === categoryKey);
        const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        
        if (categoryExpenses.length > 0) {
            console.log(`${window.expenseManager.categories[categoryKey].name} (${categoryExpenses.length} expenses, ₹${total}):`);
            categoryExpenses.forEach(exp => {
                console.log(`  - ${exp.description}: ₹${exp.amount} (ID: ${exp.id})`);
            });
        }
    });
    
    console.log('=== END TEST ===');
};

// Function to fix category spending mismatches
window.fixCategorySpending = function() {
    console.log('🔧 Fixing category spending...');
    
    if (!window.expenseManager) {
        console.log('❌ ExpenseManager not found');
        return;
    }
    
    let fixedCategories = 0;
    
    Object.keys(window.expenseManager.categories).forEach(categoryKey => {
        const category = window.expenseManager.categories[categoryKey];
        const calculated = window.expenseManager.calculateCategorySpent(categoryKey);
        const stored = category.spent;
        
        if (stored !== calculated) {
            console.log(`Fixing ${category.name}: ${stored} → ${calculated}`);
            category.spent = calculated;
            fixedCategories++;
        }
    });
    
    if (fixedCategories > 0) {
        window.expenseManager.saveData();
        window.expenseManager.updateUI();
        console.log(`✅ Fixed ${fixedCategories} categories`);
    } else {
        console.log('✅ All categories already correct');
    }
};

// Function to create test expenses for specific categories
window.createCategoryTestExpenses = function() {
    console.log('📝 Creating category test expenses...');
    
    if (!window.expenseManager) {
        console.log('❌ ExpenseManager not found');
        return;
    }
    
    const testExpenses = [
        { description: 'Test Food 1', amount: 100, category: 'food' },
        { description: 'Test Food 2', amount: 150, category: 'food' },
        { description: 'Test Transport 1', amount: 50, category: 'transport' },
        { description: 'Test Entertainment 1', amount: 200, category: 'entertainment' },
        { description: 'Test Shopping 1', amount: 300, category: 'shopping' }
    ];
    
    console.log('Adding test expenses...');
    testExpenses.forEach(expense => {
        const expenseObj = {
            id: Date.now() + Math.random(),
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };
        
        window.expenseManager.expenses.push(expenseObj);
        console.log(`Added: ${expense.description} - ₹${expense.amount} to ${expense.category}`);
    });
    
    // Recalculate all category spending
    Object.keys(window.expenseManager.categories).forEach(categoryKey => {
        window.expenseManager.categories[categoryKey].spent = window.expenseManager.calculateCategorySpent(categoryKey);
    });
    
    window.expenseManager.saveData();
    window.expenseManager.updateUI();
    
    console.log('✅ Test expenses created and categories updated');
};

// Function to test deletion and verify category updates
window.testDeletionCategoryUpdate = function() {
    console.log('🗑️ Testing deletion category update...');
    
    if (!window.expenseManager || window.expenseManager.expenses.length === 0) {
        console.log('❌ No expenses to test deletion');
        return;
    }
    
    // Find an expense to delete
    const expenseToDelete = window.expenseManager.expenses[0];
    const category = expenseToDelete.category;
    const amount = expenseToDelete.amount;
    
    console.log(`Testing deletion of: ${expenseToDelete.description}`);
    console.log(`Category: ${category}, Amount: ₹${amount}`);
    
    // Record before state
    const beforeSpent = window.expenseManager.categories[category].spent;
    const beforeCount = window.expenseManager.expenses.filter(exp => exp.category === category).length;
    
    console.log(`Before deletion - ${category} spent: ₹${beforeSpent}, count: ${beforeCount}`);
    
    // Delete the expense
    window.expenseManager.deleteExpense(expenseToDelete.id);
    
    // Check after state
    const afterSpent = window.expenseManager.categories[category].spent;
    const afterCount = window.expenseManager.expenses.filter(exp => exp.category === category).length;
    
    console.log(`After deletion - ${category} spent: ₹${afterSpent}, count: ${afterCount}`);
    
    // Verify the change
    const expectedSpent = beforeSpent - amount;
    const expectedCount = beforeCount - 1;
    
    if (afterSpent === expectedSpent && afterCount === expectedCount) {
        console.log('✅ Category spending updated correctly after deletion');
    } else {
        console.log('❌ Category spending NOT updated correctly');
        console.log(`Expected spent: ₹${expectedSpent}, actual: ₹${afterSpent}`);
        console.log(`Expected count: ${expectedCount}, actual: ${afterCount}`);
    }
};

// Auto-run test when script loads
setTimeout(() => {
    console.log('🚀 Auto-running category spending test...');
    window.testCategorySpending();
}, 2000);
