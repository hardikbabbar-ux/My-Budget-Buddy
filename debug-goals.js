// Debug script for goals issue
console.log('🔍 Debug Goals Script Loaded');

// Function to check the current state of goals
window.debugGoals = function() {
    console.log('=== GOALS DEBUG REPORT ===');
    
    // Check if piggy bank is initialized
    console.log('1. Piggy Bank Status:');
    if (window.piggyBank) {
        console.log('✅ Piggy Bank is initialized');
        console.log('   Goals array:', window.piggyBank.goals);
        console.log('   Goals count:', window.piggyBank.goals.length);
    } else {
        console.log('❌ Piggy Bank not initialized');
        
        // Try to initialize manually
        console.log('🔄 Attempting manual initialization...');
        if (document.getElementById('piggy-bank')) {
            window.piggyBank = new PiggyBank();
            console.log('✅ Manual initialization successful');
        } else {
            console.log('❌ Piggy bank section not found');
        }
    }
    
    // Check localStorage
    console.log('\n2. LocalStorage Data:');
    const savedGoals = localStorage.getItem('budgetBuddyGoals');
    console.log('   Raw localStorage goals:', savedGoals);
    
    if (savedGoals) {
        try {
            const parsedGoals = JSON.parse(savedGoals);
            console.log('   Parsed goals:', parsedGoals);
            console.log('   Number of saved goals:', parsedGoals.length);
        } catch (e) {
            console.log('   ❌ Error parsing goals:', e);
        }
    } else {
        console.log('   No goals found in localStorage');
    }
    
    // Check DOM elements
    console.log('\n3. DOM Elements:');
    const goalsList = document.getElementById('goalsList');
    console.log('   Goals list element:', goalsList);
    if (goalsList) {
        console.log('   Current innerHTML length:', goalsList.innerHTML.length);
        console.log('   Current content preview:', goalsList.innerHTML.substring(0, 200));
    }
    
    const addGoalBtn = document.getElementById('addGoalBtn');
    console.log('   Add goal button:', addGoalBtn);
    
    // Check if updateGoalsList function works
    console.log('\n4. Function Test:');
    if (window.piggyBank && typeof window.piggyBank.updateGoalsList === 'function') {
        console.log('   Calling updateGoalsList...');
        window.piggyBank.updateGoalsList();
        console.log('   ✅ updateGoalsList called');
    }
    
    console.log('=== END DEBUG REPORT ===');
};

// Function to create a test goal
window.createTestGoal = function() {
    console.log('🧪 Creating test goal...');
    
    if (!window.piggyBank) {
        console.log('❌ Piggy Bank not available');
        return;
    }
    
    // Create a test goal directly
    const testGoal = {
        id: Date.now(),
        name: 'Test Emergency Fund',
        amount: 10000,
        savedAmount: 0,
        deadline: '2024-12-31',
        category: 'emergency',
        description: 'Test goal for debugging',
        createdDate: new Date().toISOString(),
        achieved: false,
        achievedDate: null
    };
    
    console.log('Test goal object:', testGoal);
    
    // Add to goals array
    window.piggyBank.goals.push(testGoal);
    console.log('Added to goals array. New length:', window.piggyBank.goals.length);
    
    // Save to localStorage
    window.piggyBank.saveData();
    console.log('Saved to localStorage');
    
    // Update UI
    window.piggyBank.updateGoalsList();
    window.piggyBank.updateSavingsOverview();
    console.log('UI updated');
    
    console.log('✅ Test goal created successfully');
};

// Function to clear all goals
window.clearAllGoals = function() {
    console.log('🗑️ Clearing all goals...');
    
    if (window.piggyBank) {
        window.piggyBank.goals = [];
        window.piggyBank.saveData();
        window.piggyBank.updateGoalsList();
        window.piggyBank.updateSavingsOverview();
        console.log('✅ All goals cleared');
    } else {
        // Clear from localStorage directly
        localStorage.removeItem('budgetBuddyGoals');
        console.log('✅ Goals cleared from localStorage');
    }
};

// Auto-run debug when script loads
setTimeout(() => {
    console.log('🚀 Auto-running goals debug...');
    window.debugGoals();
}, 2000);
