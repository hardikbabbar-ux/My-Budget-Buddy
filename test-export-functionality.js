// Test script for export functionality
console.log('📊 Export Test Script Loaded');

// Function to test export functionality
window.testExportFunctionality = function() {
    console.log('=== EXPORT FUNCTIONALITY TEST ===');
    
    // 1. Check if expense manager exists
    if (!window.expenseManager) {
        console.log('❌ ExpenseManager not found');
        return;
    }
    
    console.log('✅ ExpenseManager found');
    
    // 2. Check jsPDF availability
    console.log('\n📋 Checking jsPDF availability:');
    console.log('window.jsPDF:', typeof window.jsPDF);
    console.log('window.jsPDF.jsPDF:', window.jsPDF ? typeof window.jsPDF.jsPDF : 'N/A');
    console.log('global jsPDF:', typeof jsPDF);
    
    // 3. Check data availability
    console.log('\n📊 Checking data availability:');
    console.log('Budget:', window.expenseManager.budget);
    console.log('Expenses count:', window.expenseManager.expenses ? window.expenseManager.expenses.length : 'undefined');
    console.log('Categories:', Object.keys(window.expenseManager.categories || {}));
    
    // 4. Test export functions
    console.log('\n🧪 Testing export functions:');
    console.log('exportData function:', typeof window.expenseManager.exportData);
    console.log('exportAsText function:', typeof window.expenseManager.exportAsText);
    
    console.log('=== END TEST ===');
};

// Function to test PDF generation specifically
window.testPDFGeneration = function() {
    console.log('🔍 Testing PDF generation...');
    
    if (!window.expenseManager) {
        console.log('❌ ExpenseManager not available');
        return;
    }
    
    // Try to create a simple PDF to test jsPDF
    try {
        let jsPDFConstructor;
        
        if (window.jsPDF && window.jsPDF.jsPDF && typeof window.jsPDF.jsPDF === 'function') {
            jsPDFConstructor = window.jsPDF.jsPDF;
            console.log('✅ Using window.jsPDF.jsPDF');
        } else if (window.jsPDF && typeof window.jsPDF === 'function') {
            jsPDFConstructor = window.jsPDF;
            console.log('✅ Using window.jsPDF directly');
        } else if (typeof jsPDF !== 'undefined' && typeof jsPDF === 'function') {
            jsPDFConstructor = jsPDF;
            console.log('✅ Using global jsPDF');
        } else {
            throw new Error('jsPDF not available');
        }
        
        console.log('Creating test PDF...');
        const doc = new jsPDFConstructor();
        doc.text('Test PDF Generation', 20, 20);
        
        console.log('✅ PDF creation successful');
        console.log('PDF internal object:', doc.internal);
        
        // Test save functionality
        const fileName = `test-pdf-${Date.now()}.pdf`;
        doc.save(fileName);
        console.log('✅ PDF save successful');
        
    } catch (error) {
        console.error('❌ PDF generation test failed:', error);
    }
};

// Function to test text export specifically
window.testTextExport = function() {
    console.log('📄 Testing text export...');
    
    if (!window.expenseManager) {
        console.log('❌ ExpenseManager not available');
        return;
    }
    
    try {
        console.log('Calling exportAsText...');
        window.expenseManager.exportAsText();
        console.log('✅ Text export function called successfully');
    } catch (error) {
        console.error('❌ Text export test failed:', error);
    }
};

// Function to create sample data for testing exports
window.createSampleDataForExport = function() {
    console.log('📝 Creating sample data for export testing...');
    
    if (!window.expenseManager) {
        console.log('❌ ExpenseManager not available');
        return;
    }
    
    // Ensure budget is set up
    if (!window.expenseManager.budget || !window.expenseManager.budget.totalBudget) {
        console.log('Setting up sample budget...');
        window.expenseManager.budget = {
            income: 50000,
            savingsPercentage: 20,
            savingsAmount: 10000,
            totalBudget: 40000,
            setupDate: new Date().toISOString()
        };
        
        // Set category budgets
        Object.keys(window.expenseManager.categories).forEach(categoryKey => {
            const allocations = {
                food: 0.35, transport: 0.15, entertainment: 0.10, shopping: 0.15,
                bills: 0.15, healthcare: 0.05, education: 0.03, other: 0.02
            };
            window.expenseManager.categories[categoryKey].budget = 
                Math.round(40000 * (allocations[categoryKey] || 0.02));
        });
    }
    
    // Add sample expenses if none exist
    if (!window.expenseManager.expenses || window.expenseManager.expenses.length === 0) {
        console.log('Adding sample expenses...');
        const sampleExpenses = [
            { description: 'Grocery Shopping', amount: 2500, category: 'food' },
            { description: 'Bus Pass', amount: 800, category: 'transport' },
            { description: 'Movie Tickets', amount: 600, category: 'entertainment' },
            { description: 'Electricity Bill', amount: 1200, category: 'bills' },
            { description: 'New Shirt', amount: 1500, category: 'shopping' }
        ];
        
        sampleExpenses.forEach((expense, index) => {
            const expenseObj = {
                id: (Date.now() + index).toString(),
                description: expense.description,
                amount: expense.amount,
                category: expense.category,
                date: new Date().toISOString().split('T')[0],
                timestamp: new Date().toISOString()
            };
            
            window.expenseManager.expenses.push(expenseObj);
            window.expenseManager.categories[expense.category].spent += expense.amount;
        });
    }
    
    // Save data
    window.expenseManager.saveData();
    window.expenseManager.updateUI();
    
    console.log('✅ Sample data created successfully');
    console.log('Budget:', window.expenseManager.budget);
    console.log('Expenses:', window.expenseManager.expenses.length);
};

// Function to fix jsPDF loading issues
window.fixJsPDFLoading = function() {
    console.log('🔧 Attempting to fix jsPDF loading...');
    
    // Check current state
    console.log('Current jsPDF state:');
    console.log('window.jsPDF:', typeof window.jsPDF);
    console.log('global jsPDF:', typeof jsPDF);
    
    // Try to reload jsPDF if needed
    if (typeof window.jsPDF === 'undefined' && typeof jsPDF === 'undefined') {
        console.log('jsPDF not found, attempting to reload...');
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = function() {
            console.log('✅ jsPDF reloaded successfully');
            console.log('New jsPDF state:', typeof window.jsPDF);
        };
        script.onerror = function() {
            console.log('❌ Failed to reload jsPDF');
        };
        document.head.appendChild(script);
    } else {
        console.log('✅ jsPDF is available');
    }
};

// Function to run comprehensive export test
window.runExportTest = function() {
    console.log('🚀 Running comprehensive export test...');
    
    // Step 1: Check system
    testExportFunctionality();
    
    // Step 2: Create sample data
    createSampleDataForExport();
    
    // Step 3: Test PDF generation
    setTimeout(() => {
        testPDFGeneration();
    }, 1000);
    
    // Step 4: Test text export
    setTimeout(() => {
        testTextExport();
    }, 2000);
    
    console.log('✅ Export test sequence initiated');
};

// Auto-run basic test when script loads
setTimeout(() => {
    console.log('🚀 Auto-running export functionality test...');
    window.testExportFunctionality();
}, 2000);
