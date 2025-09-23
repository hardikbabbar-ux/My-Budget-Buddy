// Expense Manager JavaScript
class ExpenseManager {
    constructor() {
        this.expenses = JSON.parse(localStorage.getItem('budgetBuddyExpenses')) || [];
        this.budget = JSON.parse(localStorage.getItem('budgetBuddyBudget')) || {};
        this.categories = {
            food: { name: '🍽️ Food & Dining', budget: 0, spent: 0, color: '#ff6b6b' },
            transport: { name: '🚗 Transportation', budget: 0, spent: 0, color: '#4ecdc4' },
            entertainment: { name: '🎬 Entertainment', budget: 0, spent: 0, color: '#45b7d1' },
            shopping: { name: '🛍️ Shopping', budget: 0, spent: 0, color: '#f9ca24' },
            bills: { name: '💡 Bills & Utilities', budget: 0, spent: 0, color: '#f0932b' },
            healthcare: { name: '🏥 Healthcare', budget: 0, spent: 0, color: '#eb4d4b' },
            education: { name: '📚 Education', budget: 0, spent: 0, color: '#6c5ce7' },
            other: { name: '📦 Other', budget: 0, spent: 0, color: '#a0a0a0' }
        };
        this.chart = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadData();
        this.updateUI();
        this.setDefaultDate();
    }

    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        // Budget setup
        const setupBudgetBtn = document.getElementById('setupBudget');
        if (setupBudgetBtn) {
            setupBudgetBtn.addEventListener('click', () => {
                console.log('🎯 Setup budget button clicked');
                this.setupBudget();
            });
            console.log('✅ Setup budget button listener attached');
        } else {
            console.log('❌ Setup budget button not found');
        }
        
        // Add expense
        const addExpenseBtn = document.getElementById('addExpense');
        if (addExpenseBtn) {
            addExpenseBtn.addEventListener('click', () => {
                console.log('🎯 Add expense button clicked');
                this.addExpense();
            });
            console.log('✅ Add expense button listener attached');
        } else {
            console.log('❌ Add expense button not found');
        }
        
        // Clear expenses
        const clearExpensesBtn = document.getElementById('clearExpenses');
        if (clearExpensesBtn) {
            clearExpensesBtn.addEventListener('click', () => {
                console.log('🎯 Clear expenses button clicked');
                this.clearExpenses();
            });
            console.log('✅ Clear expenses button listener attached');
        } else {
            console.log('❌ Clear expenses button not found');
        }
        
        // Export data
        const exportDataBtn = document.getElementById('exportData');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                console.log('🎯 Export data button clicked');
                this.exportData();
            });
            console.log('✅ Export data button listener attached');
        } else {
            console.log('❌ Export data button not found');
        }
        
        // Enter key support for forms
        const monthlyIncomeInput = document.getElementById('monthlyIncome');
        if (monthlyIncomeInput) {
            monthlyIncomeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    console.log('⌨️ Enter key pressed in monthly income input');
                    this.setupBudget();
                }
            });
            console.log('✅ Monthly income Enter key listener attached');
        } else {
            console.log('❌ Monthly income input not found');
        }
        
        const expenseAmountInput = document.getElementById('expenseAmount');
        if (expenseAmountInput) {
            expenseAmountInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    console.log('⌨️ Enter key pressed in expense amount input');
                    this.addExpense();
                }
            });
            console.log('✅ Expense amount Enter key listener attached');
        } else {
            console.log('❌ Expense amount input not found');
        }
        
        console.log('✅ Event listeners setup completed');
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expenseDate').value = today;
    }

    setupBudget() {
        console.log('Setting up budget...');
        
        const incomeElement = document.getElementById('monthlyIncome');
        const savingsElement = document.getElementById('savingsPercentage');
        
        console.log('Income element:', incomeElement);
        console.log('Savings element:', savingsElement);
        
        const income = parseFloat(incomeElement?.value || 0);
        const savingsPercentage = parseFloat(savingsElement?.value || 20);
        
        console.log('Income value:', income);
        console.log('Savings percentage:', savingsPercentage);

        if (!income || income <= 0) {
            this.showNotification('Please enter a valid monthly income', 'error');
            return;
        }

        const savingsAmount = (income * savingsPercentage) / 100;
        const availableBudget = income - savingsAmount;

        // Auto-allocate budget to categories
        const allocations = {
            food: 0.35,      // 35%
            transport: 0.15, // 15%
            entertainment: 0.10, // 10%
            shopping: 0.15,  // 15%
            bills: 0.15,     // 15%
            healthcare: 0.05, // 5%
            education: 0.03, // 3%
            other: 0.02      // 2%
        };

        Object.keys(this.categories).forEach(category => {
            this.categories[category].budget = Math.round(availableBudget * allocations[category]);
            this.categories[category].spent = this.calculateCategorySpent(category);
        });

        this.budget = {
            income: income,
            savingsPercentage: savingsPercentage,
            savingsAmount: savingsAmount,
            totalBudget: availableBudget,
            setupDate: new Date().toISOString()
        };

        console.log('Budget object created:', this.budget);
        
        this.saveData();
        console.log('Data saved to localStorage');
        
        this.updateUI();
        console.log('UI updated');
        
        this.showNotification('Budget setup successful!', 'success');
        console.log('Budget setup completed successfully');
    }

    addExpense() {
        // Check if budget is set up first
        if (!this.budget || !this.budget.totalBudget || this.budget.totalBudget <= 0) {
            this.showNotification('❌ Please set up your budget first before adding expenses!', 'error');
            
            // Scroll to budget setup section
            const budgetSection = document.getElementById('expense-manager');
            if (budgetSection) {
                budgetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Highlight the budget setup form
                const incomeInput = document.getElementById('monthlyIncome');
                if (incomeInput) {
                    setTimeout(() => {
                        incomeInput.focus();
                        incomeInput.style.border = '2px solid #ef4444';
                        setTimeout(() => {
                            incomeInput.style.border = '';
                        }, 3000);
                    }, 500);
                }
            }
            return;
        }

        const description = document.getElementById('expenseDescription').value.trim();
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const category = document.getElementById('expenseCategory').value;
        const date = document.getElementById('expenseDate').value;

        if (!description) {
            this.showNotification('Please enter a description', 'error');
            return;
        }

        if (!amount || amount <= 0) {
            this.showNotification('Please enter a valid amount', 'error');
            return;
        }

        if (!date) {
            this.showNotification('Please select a date', 'error');
            return;
        }

        const expense = {
            id: Date.now().toString(),
            description: description,
            amount: amount,
            category: category,
            date: date,
            timestamp: new Date().toISOString()
        };

        this.expenses.unshift(expense); // Add to beginning of array
        
        // Recalculate category spending to ensure accuracy
        this.categories[category].spent = this.calculateCategorySpent(category);

        // Clear form
        document.getElementById('expenseDescription').value = '';
        document.getElementById('expenseAmount').value = '';
        
        this.saveData();
        this.updateUI();
        this.showNotification('Expense added successfully!', 'success');

        // Check for budget warnings
        this.checkBudgetWarnings(category, amount);
    }

    deleteExpense(expenseId) {
        console.log('🗑️ Attempting to delete expense with ID:', expenseId);
        console.log('Current expenses count:', this.expenses.length);
        
        const expense = this.expenses.find(exp => exp.id === expenseId);
        console.log('Found expense:', expense);
        
        if (expense) {
            console.log('Deleting expense:', expense.description, 'Amount:', expense.amount);
            console.log('Category before deletion:', expense.category, 'spent:', this.categories[expense.category].spent);
            
            // Remove from expenses array first
            const originalLength = this.expenses.length;
            this.expenses = this.expenses.filter(exp => exp.id !== expenseId);
            console.log('Expenses count after deletion:', this.expenses.length, '(was:', originalLength + ')');
            
            // Recalculate category spending from remaining expenses (more reliable)
            this.categories[expense.category].spent = this.calculateCategorySpent(expense.category);
            console.log('Category after recalculation:', expense.category, 'spent:', this.categories[expense.category].spent);
            
            // Save and update UI
            this.saveData();
            console.log('Data saved to localStorage');
            
            this.updateUI();
            console.log('UI updated');
            
            this.showNotification('Expense deleted successfully! 🗑️', 'success');
            console.log('✅ Expense deletion completed');
        } else {
            console.log('❌ Expense not found with ID:', expenseId);
            this.showNotification('Error: Expense not found', 'error');
        }
    }

    clearExpenses() {
        console.log('🧹 Clear expenses requested');
        console.log('Current expenses count:', this.expenses.length);
        
        if (confirm('Are you sure you want to clear all expenses? This action cannot be undone.')) {
            console.log('User confirmed clearing expenses');
            
            const originalCount = this.expenses.length;
            this.expenses = [];
            console.log('Expenses array cleared');
            
            // Recalculate all category spending (should be 0 since expenses array is empty)
            Object.keys(this.categories).forEach(category => {
                const originalSpent = this.categories[category].spent;
                this.categories[category].spent = this.calculateCategorySpent(category);
                console.log(`Reset ${category} spending from ${originalSpent} to ${this.categories[category].spent}`);
            });
            
            this.saveData();
            console.log('Data saved to localStorage');
            
            this.updateUI();
            console.log('UI updated');
            
            this.showNotification(`All ${originalCount} expenses cleared successfully! 🧹`, 'success');
            console.log('✅ Clear expenses completed');
        } else {
            console.log('User cancelled clearing expenses');
        }
    }

    calculateCategorySpent(category) {
        return this.expenses
            .filter(expense => expense.category === category && expense.amount && !isNaN(expense.amount))
            .reduce((total, expense) => total + parseFloat(expense.amount), 0);
    }

    updateUI() {
        this.updateOverviewCards();
        this.updateCategoryBudgets();
        this.updateExpensesList();
        this.updateChart();
        this.updateInsights();
        this.updateExpenseFormState();
    }

    updateExpenseFormState() {
        const hasBudget = this.budget && this.budget.totalBudget && this.budget.totalBudget > 0;
        
        // Get expense form elements
        const expenseDescription = document.getElementById('expenseDescription');
        const expenseAmount = document.getElementById('expenseAmount');
        const expenseCategory = document.getElementById('expenseCategory');
        const expenseDate = document.getElementById('expenseDate');
        const addExpenseBtn = document.getElementById('addExpense');
        
        // Get or create budget warning message
        let budgetWarning = document.getElementById('budgetWarningMessage');
        if (!budgetWarning) {
            budgetWarning = document.createElement('div');
            budgetWarning.id = 'budgetWarningMessage';
            budgetWarning.className = 'budget-warning-message';
            budgetWarning.style.cssText = `
                background: linear-gradient(135deg, #fef3c7, #fde68a);
                border: 1px solid #f59e0b;
                border-radius: 8px;
                padding: 12px 16px;
                margin-bottom: 16px;
                color: #92400e;
                font-weight: 500;
                display: none;
                align-items: center;
                gap: 8px;
            `;
            budgetWarning.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span>Please set up your monthly budget first to start tracking expenses.</span>
            `;
            
            // Insert before expense form
            const expenseForm = document.querySelector('.expense-form');
            if (expenseForm) {
                expenseForm.parentNode.insertBefore(budgetWarning, expenseForm);
            }
        }
        
        if (!hasBudget) {
            // Disable form elements
            if (expenseDescription) {
                expenseDescription.disabled = true;
                expenseDescription.placeholder = 'Set up budget first...';
                expenseDescription.style.backgroundColor = '#f9fafb';
                expenseDescription.style.color = '#6b7280';
            }
            if (expenseAmount) {
                expenseAmount.disabled = true;
                expenseAmount.placeholder = 'Set up budget first...';
                expenseAmount.style.backgroundColor = '#f9fafb';
                expenseAmount.style.color = '#6b7280';
            }
            if (expenseCategory) {
                expenseCategory.disabled = true;
                expenseCategory.style.backgroundColor = '#f9fafb';
                expenseCategory.style.color = '#6b7280';
            }
            if (expenseDate) {
                expenseDate.disabled = true;
                expenseDate.style.backgroundColor = '#f9fafb';
                expenseDate.style.color = '#6b7280';
            }
            if (addExpenseBtn) {
                addExpenseBtn.disabled = true;
                addExpenseBtn.textContent = 'Setup Budget First';
                addExpenseBtn.style.opacity = '0.6';
                addExpenseBtn.style.cursor = 'not-allowed';
                addExpenseBtn.style.backgroundColor = '#e5e7eb';
            }
            
            // Show warning message
            budgetWarning.style.display = 'flex';
        } else {
            // Enable form elements
            if (expenseDescription) {
                expenseDescription.disabled = false;
                expenseDescription.placeholder = 'What did you spend on?';
                expenseDescription.style.backgroundColor = '';
                expenseDescription.style.color = '';
            }
            if (expenseAmount) {
                expenseAmount.disabled = false;
                expenseAmount.placeholder = 'Enter amount';
                expenseAmount.style.backgroundColor = '';
                expenseAmount.style.color = '';
            }
            if (expenseCategory) {
                expenseCategory.disabled = false;
                expenseCategory.style.backgroundColor = '';
                expenseCategory.style.color = '';
            }
            if (expenseDate) {
                expenseDate.disabled = false;
                expenseDate.style.backgroundColor = '';
                expenseDate.style.color = '';
            }
            if (addExpenseBtn) {
                addExpenseBtn.disabled = false;
                addExpenseBtn.textContent = 'Add Expense';
                addExpenseBtn.style.opacity = '1';
                addExpenseBtn.style.cursor = 'pointer';
                addExpenseBtn.style.backgroundColor = '';
            }
            
            // Hide warning message
            budgetWarning.style.display = 'none';
        }
    }

    updateOverviewCards() {
        const totalBudget = this.budget.totalBudget || 0;
        const totalExpenses = this.expenses.reduce((total, expense) => total + expense.amount, 0);
        const remaining = totalBudget - totalExpenses;
        const savingsGoal = this.budget.savingsAmount || 0;

        document.getElementById('totalBudget').textContent = `₹${totalBudget.toLocaleString()}`;
        document.getElementById('totalExpenses').textContent = `₹${totalExpenses.toLocaleString()}`;
        document.getElementById('remainingBudget').textContent = `₹${remaining.toLocaleString()}`;
        document.getElementById('savingsGoal').textContent = `₹${savingsGoal.toLocaleString()}`;

        // Update colors based on remaining budget
        const remainingElement = document.getElementById('remainingBudget');
        if (remaining < 0) {
            remainingElement.style.color = '#ef4444';
        } else if (remaining < totalBudget * 0.2) {
            remainingElement.style.color = '#f59e0b';
        } else {
            remainingElement.style.color = '#22c55e';
        }
    }

    updateCategoryBudgets() {
        const container = document.getElementById('categoryBudgets');
        container.innerHTML = '';

        Object.keys(this.categories).forEach(categoryKey => {
            const category = this.categories[categoryKey];
            const percentage = category.budget > 0 ? (category.spent / category.budget) * 100 : 0;
            
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category-budget';
            
            categoryDiv.innerHTML = `
                <div class="category-header">
                    <div class="category-name">${category.name}</div>
                    <div class="category-amount">₹${category.budget.toLocaleString()}</div>
                </div>
                <div class="category-progress">
                    <div class="category-progress-fill" style="width: ${Math.min(percentage, 100)}%; background-color: ${category.color}"></div>
                </div>
                <div class="category-spent">
                    Spent: ₹${category.spent.toLocaleString()} (${percentage.toFixed(1)}%)
                    ${percentage > 100 ? '<span style="color: #ef4444; font-weight: bold;"> - OVER BUDGET!</span>' : ''}
                </div>
            `;
            
            container.appendChild(categoryDiv);
        });
    }

    updateExpensesList() {
        const container = document.getElementById('expensesList');
        
        if (this.expenses.length === 0) {
            container.innerHTML = `
                <div class="no-expenses">
                    <i class="fas fa-receipt"></i>
                    <p>No expenses recorded yet. Add your first expense above!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        
        this.expenses.forEach(expense => {
            const expenseDiv = document.createElement('div');
            expenseDiv.className = 'expense-item';
            
            // Safe category name lookup with fallback
            const categoryData = this.categories[expense.category];
            const categoryName = categoryData ? categoryData.name : (expense.category || 'Unknown Category');
            const formattedDate = new Date(expense.date).toLocaleDateString();
            
            expenseDiv.innerHTML = `
                <div class="expense-details">
                    <div class="expense-description">${expense.description}</div>
                    <div class="expense-meta">
                        <span class="expense-category">${categoryName}</span>
                        <span>${formattedDate}</span>
                    </div>
                </div>
                <div class="expense-amount">₹${expense.amount.toLocaleString()}</div>
                <div class="expense-actions">
                    <button class="btn-icon btn-delete" data-expense-id="${expense.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Add event listener to the delete button
            const deleteButton = expenseDiv.querySelector('.btn-delete');
            deleteButton.addEventListener('click', () => {
                console.log('Delete button clicked for expense:', expense.id);
                this.deleteExpense(expense.id);
            });
            
            container.appendChild(expenseDiv);
        });
    }

    updateChart() {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        const categoryData = Object.keys(this.categories).map(key => ({
            label: this.categories[key].name,
            value: this.categories[key].spent,
            color: this.categories[key].color
        })).filter(item => item.value > 0);

        if (categoryData.length === 0) {
            ctx.font = '16px Inter';
            ctx.fillStyle = '#6b7280';
            ctx.textAlign = 'center';
            ctx.fillText('No expenses to display', ctx.canvas.width / 2, ctx.canvas.height / 2);
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
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `₹${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    updateInsights() {
        const container = document.getElementById('reportInsights');
        const insights = this.generateInsights();
        
        container.innerHTML = '';
        
        insights.forEach(insight => {
            const insightDiv = document.createElement('div');
            insightDiv.className = 'insight-item';
            insightDiv.innerHTML = `
                <i class="fas ${insight.icon}"></i>
                <p>${insight.message}</p>
            `;
            container.appendChild(insightDiv);
        });
    }

    generateInsights() {
        const insights = [];
        const totalBudget = this.budget.totalBudget || 0;
        const totalExpenses = this.expenses.reduce((total, expense) => total + expense.amount, 0);
        const remaining = totalBudget - totalExpenses;

        if (totalBudget === 0) {
            insights.push({
                icon: 'fa-lightbulb',
                message: 'Set up your budget to see personalized insights!'
            });
            return insights;
        }

        // Budget status insight
        if (remaining < 0) {
            insights.push({
                icon: 'fa-exclamation-triangle',
                message: `You're over budget by ₹${Math.abs(remaining).toLocaleString()}. Consider reducing expenses in overspent categories.`
            });
        } else if (remaining < totalBudget * 0.2) {
            insights.push({
                icon: 'fa-exclamation-circle',
                message: `You have ₹${remaining.toLocaleString()} remaining (${((remaining/totalBudget)*100).toFixed(1)}%). Be careful with your spending!`
            });
        } else {
            insights.push({
                icon: 'fa-check-circle',
                message: `Great job! You have ₹${remaining.toLocaleString()} remaining in your budget.`
            });
        }

        // Category insights
        const overBudgetCategories = Object.keys(this.categories).filter(key => 
            this.categories[key].spent > this.categories[key].budget && this.categories[key].budget > 0
        );

        if (overBudgetCategories.length > 0) {
            const categoryNames = overBudgetCategories.map(key => this.categories[key].name).join(', ');
            insights.push({
                icon: 'fa-chart-line',
                message: `Over budget in: ${categoryNames}. Consider adjusting your spending in these areas.`
            });
        }

        // Spending pattern insight
        if (this.expenses.length >= 5) {
            const topCategory = Object.keys(this.categories).reduce((a, b) => 
                this.categories[a].spent > this.categories[b].spent ? a : b
            );
            const topCategoryName = this.categories[topCategory].name;
            const topCategoryAmount = this.categories[topCategory].spent;
            const percentage = ((topCategoryAmount / totalExpenses) * 100).toFixed(1);
            
            insights.push({
                icon: 'fa-pie-chart',
                message: `Your highest spending is in ${topCategoryName} (₹${topCategoryAmount.toLocaleString()}, ${percentage}% of total expenses).`
            });
        }

        // Savings insight
        if (remaining > 0 && this.budget.savingsAmount) {
            const additionalSavings = Math.min(remaining, this.budget.savingsAmount * 0.5);
            insights.push({
                icon: 'fa-piggy-bank',
                message: `You could save an additional ₹${additionalSavings.toLocaleString()} this month by maintaining your current spending pattern!`
            });
        }

        return insights;
    }

    checkBudgetWarnings(category, amount) {
        const categoryData = this.categories[category];
        const newSpent = categoryData.spent;
        const budget = categoryData.budget;

        if (budget > 0) {
            const percentage = (newSpent / budget) * 100;
            
            if (percentage >= 100) {
                this.showNotification(`⚠️ You've exceeded your ${categoryData.name} budget!`, 'error');
            } else if (percentage >= 80) {
                this.showNotification(`⚠️ You've used ${percentage.toFixed(1)}% of your ${categoryData.name} budget`, 'warning');
            }
        }

        // Check total budget
        const totalExpenses = this.expenses.reduce((total, expense) => total + expense.amount, 0);
        const totalBudget = this.budget.totalBudget || 0;
        
        if (totalBudget > 0 && totalExpenses > totalBudget * 0.9) {
            this.showNotification('⚠️ You\'re approaching your total monthly budget limit!', 'warning');
        }
    }

    exportData() {
        console.log('📊 Starting export data process...');
        
        // Show loading notification
        this.showNotification('Generating PDF report...', 'info');
        
        try {
            // Enhanced jsPDF detection and loading
            console.log('🔍 Checking jsPDF availability...');
            console.log('window.jsPDF type:', typeof window.jsPDF);
            console.log('window object keys containing jsPDF:', Object.keys(window).filter(key => key.toLowerCase().includes('jspdf')));
            
            let jsPDFConstructor;
            let retryCount = 0;
            const maxRetries = 3;
            
            // Try different ways to access jsPDF based on version and loading method
            if (window.jsPDF && window.jsPDF.jsPDF && typeof window.jsPDF.jsPDF === 'function') {
                jsPDFConstructor = window.jsPDF.jsPDF;
                console.log('✅ Using window.jsPDF.jsPDF (UMD build)');
            } else if (window.jsPDF && typeof window.jsPDF === 'function') {
                jsPDFConstructor = window.jsPDF;
                console.log('✅ Using window.jsPDF directly');
            } else if (typeof jsPDF !== 'undefined' && typeof jsPDF === 'function') {
                jsPDFConstructor = jsPDF;
                console.log('✅ Using global jsPDF');
            } else {
                console.log('❌ jsPDF not found, attempting to reload library...');
                
                // Try to reload jsPDF library
                this.loadJsPDFLibrary().then(() => {
                    console.log('🔄 jsPDF library reloaded, retrying export...');
                    setTimeout(() => this.exportData(), 500);
                }).catch(() => {
                    console.log('❌ Failed to load jsPDF, falling back to text export');
                    this.showNotification('PDF library unavailable. Exporting as text file instead.', 'warning');
                    this.exportAsText();
                });
                return;
            }
            
            // Validate constructor
            if (!jsPDFConstructor || typeof jsPDFConstructor !== 'function') {
                throw new Error('jsPDF constructor is not a function');
            }
            
            console.log('Creating PDF document...');
            const doc = new jsPDFConstructor();
            
            // Set up the document
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            let yPosition = 20;
            
            // Header
            doc.setFontSize(20);
            doc.setTextColor(34, 197, 94); // Green color
            doc.text('Budget Buddy - Financial Report', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 15;
            
            // Date
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 20;
            
            // Budget Overview
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text('Budget Overview', 20, yPosition);
            yPosition += 10;
            
            const totalBudget = this.budget.totalBudget || 0;
            const totalExpenses = this.expenses.reduce((total, expense) => total + expense.amount, 0);
            const remaining = totalBudget - totalExpenses;
            const savingsGoal = this.budget.savingsAmount || 0;
            
            doc.setFontSize(12);
            doc.text(`Monthly Income: ₹${(this.budget.income || 0).toLocaleString()}`, 20, yPosition);
            yPosition += 7;
            doc.text(`Total Budget: ₹${totalBudget.toLocaleString()}`, 20, yPosition);
            yPosition += 7;
            doc.text(`Total Expenses: ₹${totalExpenses.toLocaleString()}`, 20, yPosition);
            yPosition += 7;
            doc.text(`Remaining: ₹${remaining.toLocaleString()}`, 20, yPosition);
            yPosition += 7;
            doc.text(`Savings Goal: ₹${savingsGoal.toLocaleString()}`, 20, yPosition);
            yPosition += 20;
            
            // Category Breakdown
            doc.setFontSize(16);
            doc.text('Category Breakdown', 20, yPosition);
            yPosition += 10;
            
            // Table headers
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text('Category', 20, yPosition);
            doc.text('Budget', 80, yPosition);
            doc.text('Spent', 120, yPosition);
            doc.text('Remaining', 160, yPosition);
            yPosition += 5;
            
            // Draw line under headers
            doc.line(20, yPosition, 190, yPosition);
            yPosition += 5;
            
            // Category data
            doc.setTextColor(0, 0, 0);
            Object.keys(this.categories).forEach(categoryKey => {
                const category = this.categories[categoryKey];
                const categoryRemaining = category.budget - category.spent;
                
                doc.text(category.name, 20, yPosition);
                doc.text(`₹${category.budget.toLocaleString()}`, 80, yPosition);
                doc.text(`₹${category.spent.toLocaleString()}`, 120, yPosition);
                doc.text(`₹${categoryRemaining.toLocaleString()}`, 160, yPosition);
                yPosition += 7;
                
                if (yPosition > pageHeight - 30) {
                    doc.addPage();
                    yPosition = 20;
                }
            });
            
            yPosition += 15;
            
            // Recent Expenses
            if (this.expenses.length > 0) {
                if (yPosition > pageHeight - 60) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFontSize(16);
                doc.text('Recent Expenses', 20, yPosition);
                yPosition += 10;
                
                // Table headers
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text('Date', 20, yPosition);
                doc.text('Description', 50, yPosition);
                doc.text('Category', 120, yPosition);
                doc.text('Amount', 160, yPosition);
                yPosition += 5;
                
                // Draw line under headers
                doc.line(20, yPosition, 190, yPosition);
                yPosition += 5;
                
                // Show last 20 expenses
                const recentExpenses = this.expenses.slice(0, 20);
                doc.setTextColor(0, 0, 0);
                
                recentExpenses.forEach(expense => {
                    const date = new Date(expense.date).toLocaleDateString();
                    const description = expense.description.length > 25 ? 
                        expense.description.substring(0, 25) + '...' : expense.description;
                    const categoryName = this.categories[expense.category].name;
                    
                    doc.text(date, 20, yPosition);
                    doc.text(description, 50, yPosition);
                    doc.text(categoryName, 120, yPosition);
                    doc.text(`₹${expense.amount.toLocaleString()}`, 160, yPosition);
                    yPosition += 7;
                    
                    if (yPosition > pageHeight - 30) {
                        doc.addPage();
                        yPosition = 20;
                    }
                });
            }
            
            // Add insights on new page
            doc.addPage();
            yPosition = 20;
            
            doc.setFontSize(16);
            doc.text('Financial Insights', 20, yPosition);
            yPosition += 15;
            
            const insights = this.generateInsights();
            doc.setFontSize(12);
            
            insights.forEach(insight => {
                const lines = doc.splitTextToSize(insight.message, pageWidth - 40);
                lines.forEach(line => {
                    doc.text(line, 20, yPosition);
                    yPosition += 7;
                });
                yPosition += 5;
                
                if (yPosition > pageHeight - 30) {
                    doc.addPage();
                    yPosition = 20;
                }
            });
            
            // Footer on last page
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(`Budget Buddy Report - Page ${i} of ${totalPages}`, 
                    pageWidth / 2, pageHeight - 10, { align: 'center' });
            }
            
            // Save the PDF
            const fileName = `budget-buddy-report-${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            
            this.showNotification('PDF report generated successfully!', 'success');
            
        } catch (error) {
            console.error('PDF generation error:', error);
            this.showNotification('PDF generation failed. Exporting as text file instead.', 'warning');
            this.exportAsText();
        }
    }

    loadJsPDFLibrary() {
        return new Promise((resolve, reject) => {
            console.log('📦 Loading jsPDF library...');
            
            // Check if already loaded
            if (window.jsPDF || typeof jsPDF !== 'undefined') {
                console.log('✅ jsPDF already available');
                resolve();
                return;
            }
            
            // Create script element
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.async = true;
            
            script.onload = () => {
                console.log('✅ jsPDF library loaded successfully');
                // Wait a moment for the library to initialize
                setTimeout(() => {
                    if (window.jsPDF || typeof jsPDF !== 'undefined') {
                        resolve();
                    } else {
                        reject(new Error('jsPDF not available after loading'));
                    }
                }, 100);
            };
            
            script.onerror = () => {
                console.error('❌ Failed to load jsPDF library');
                reject(new Error('Failed to load jsPDF library'));
            };
            
            // Remove existing script if any
            const existingScript = document.querySelector('script[src*="jspdf"]');
            if (existingScript) {
                existingScript.remove();
            }
            
            document.head.appendChild(script);
        });
    }

    exportAsText() {
        console.log('📄 Starting text export process...');
        
        try {
            // Validate data before export
            if (!this.budget || typeof this.budget !== 'object') {
                console.log('⚠️ No budget data available, using defaults');
                this.budget = {};
            }
            
            if (!this.expenses || !Array.isArray(this.expenses)) {
                console.log('⚠️ No expenses data available, using empty array');
                this.expenses = [];
            }
            
            if (!this.categories || typeof this.categories !== 'object') {
                console.log('⚠️ No categories data available, using defaults');
                this.categories = {};
            }
            
            const totalBudget = this.budget.totalBudget || 0;
            const totalExpenses = this.expenses.reduce((total, expense) => total + (expense.amount || 0), 0);
            const remaining = totalBudget - totalExpenses;
            const savingsGoal = this.budget.savingsAmount || 0;
            
            console.log('📊 Export data calculated:', { totalBudget, totalExpenses, remaining, savingsGoal });
            
            let reportContent = `BUDGET BUDDY - FINANCIAL REPORT\n`;
            reportContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
            reportContent += `${'='.repeat(50)}\n\n`;
            
            reportContent += `BUDGET OVERVIEW:\n`;
            reportContent += `Monthly Income: ₹${(this.budget.income || 0).toLocaleString()}\n`;
            reportContent += `Total Budget: ₹${totalBudget.toLocaleString()}\n`;
            reportContent += `Total Expenses: ₹${totalExpenses.toLocaleString()}\n`;
            reportContent += `Remaining: ₹${remaining.toLocaleString()}\n`;
            reportContent += `Savings Goal: ₹${savingsGoal.toLocaleString()}\n\n`;
            
            reportContent += `CATEGORY BREAKDOWN:\n`;
            reportContent += `${'='.repeat(50)}\n`;
            
            const categoryKeys = Object.keys(this.categories);
            if (categoryKeys.length > 0) {
                categoryKeys.forEach(categoryKey => {
                    const category = this.categories[categoryKey];
                    if (category && typeof category === 'object') {
                        const categoryBudget = category.budget || 0;
                        const categorySpent = category.spent || 0;
                        const categoryRemaining = categoryBudget - categorySpent;
                        const categoryName = category.name || categoryKey;
                        
                        reportContent += `${categoryName}\n`;
                        reportContent += `  Budget: ₹${categoryBudget.toLocaleString()}\n`;
                        reportContent += `  Spent: ₹${categorySpent.toLocaleString()}\n`;
                        reportContent += `  Remaining: ₹${categoryRemaining.toLocaleString()}\n\n`;
                    }
                });
            } else {
                reportContent += `No categories configured yet.\n\n`;
            }
            
            if (this.expenses.length > 0) {
                reportContent += `RECENT EXPENSES:\n`;
                reportContent += `${'='.repeat(50)}\n`;
                const recentExpenses = this.expenses.slice(0, 20);
                recentExpenses.forEach(expense => {
                    if (expense && typeof expense === 'object') {
                        const date = expense.date ? new Date(expense.date).toLocaleDateString() : 'Unknown Date';
                        const description = expense.description || 'No Description';
                        const amount = expense.amount || 0;
                        const category = this.categories[expense.category];
                        const categoryName = category && category.name ? category.name : expense.category || 'Unknown Category';
                        
                        reportContent += `${date} - ${description} (${categoryName}) - ₹${amount.toLocaleString()}\n`;
                    }
                });
            } else {
                reportContent += `RECENT EXPENSES:\n`;
                reportContent += `${'='.repeat(50)}\n`;
                reportContent += `No expenses recorded yet.\n\n`;
            }
            
            console.log('📄 Creating text file...');
            console.log('Report content length:', reportContent.length);
            
            const blob = new Blob([reportContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `budget-buddy-report-${new Date().toISOString().split('T')[0]}.txt`;
            
            console.log('📄 Triggering download...');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('✅ Text export completed successfully');
            this.showNotification('Report exported as text file successfully! 📄', 'success');
            
        } catch (error) {
            console.error('❌ Text export error:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                budget: this.budget,
                expensesLength: this.expenses ? this.expenses.length : 'undefined',
                categoriesKeys: this.categories ? Object.keys(this.categories) : 'undefined'
            });
            this.showNotification('Failed to export data. Check console for details.', 'error');
        }
    }

    saveData() {
        localStorage.setItem('budgetBuddyExpenses', JSON.stringify(this.expenses));
        localStorage.setItem('budgetBuddyBudget', JSON.stringify(this.budget));
    }

    loadData() {
        // Clean up invalid expenses first
        const validExpenses = this.expenses.filter(expense => {
            return expense && 
                   expense.description && 
                   expense.amount && 
                   !isNaN(expense.amount) && 
                   expense.category && 
                   expense.date;
        });

        // If we filtered out any invalid expenses, update the array and save
        if (validExpenses.length !== this.expenses.length) {
            console.log(`Cleaned up ${this.expenses.length - validExpenses.length} invalid expenses`);
            this.expenses = validExpenses;
            localStorage.setItem('budgetBuddyExpenses', JSON.stringify(this.expenses));
        }

        // Recalculate category spending from expenses
        Object.keys(this.categories).forEach(category => {
            this.categories[category].spent = this.calculateCategorySpent(category);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: 'Inter', sans-serif;
        `;
        
        // Set background color based on type
        if (type === 'success') {
            notification.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        } else if (type === 'error') {
            notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        } else if (type === 'warning') {
            notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    // Method to get available balance for piggy bank integration
    getAvailableBalance() {
        const totalBudget = Object.values(this.budget).reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0);
        const totalExpenses = this.expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
        return Math.max(0, totalBudget - totalExpenses);
    }

    // Method to reload data (for piggy bank integration)
    reloadUI() {
        this.updateUI();
    }

    // Method to reset all data
    resetAllData() {
        console.log('Resetting all expense manager data...');
        
        // Clear all data
        this.expenses = [];
        this.budget = {};
        
        // Reset categories
        Object.keys(this.categories).forEach(category => {
            this.categories[category].budget = 0;
            this.categories[category].spent = 0;
        });
        
        // Clear localStorage
        localStorage.removeItem('budgetBuddyExpenses');
        localStorage.removeItem('budgetBuddyBudget');
        
        // Clear form inputs
        const monthlyIncomeInput = document.getElementById('monthlyIncome');
        const savingsPercentageInput = document.getElementById('savingsPercentage');
        
        if (monthlyIncomeInput) monthlyIncomeInput.value = '';
        if (savingsPercentageInput) savingsPercentageInput.value = '';
        
        // Update UI
        this.updateUI();
        
        console.log('✅ All expense manager data reset successfully');
        this.showNotification('All data reset successfully!', 'success');
    }

}

// Initialize the expense manager when the page loads
let expenseManager;

// Initialize expense manager with multiple fallbacks
let initializationAttempts = 0;
const maxInitializationAttempts = 10;

function initializeExpenseManager() {
    initializationAttempts++;
    console.log(`Attempting to initialize Expense Manager... (Attempt ${initializationAttempts}/${maxInitializationAttempts})`);
    
    if (initializationAttempts > maxInitializationAttempts) {
        console.error('❌ Max initialization attempts reached. Stopping retries.');
        return;
    }
    
    const expenseManagerSection = document.getElementById('expense-manager');
    console.log('Expense manager section found:', expenseManagerSection);
    
    if (expenseManagerSection) {
        try {
            // Check if already initialized
            if (window.expenseManager) {
                console.log('⚠️ Expense Manager already initialized');
                return;
            }
            
            expenseManager = new ExpenseManager();
            window.expenseManager = expenseManager;
            console.log('✅ Expense Manager initialized successfully');
            
            // Verify critical elements are available
            const criticalElements = [
                'setupBudget', 'monthlyIncome', 'savingsPercentage',
                'addExpense', 'expenseDescription', 'expenseAmount'
            ];
            
            const missingElements = criticalElements.filter(id => !document.getElementById(id));
            
            if (missingElements.length > 0) {
                console.log('⚠️ Some critical elements missing:', missingElements);
                if (initializationAttempts < maxInitializationAttempts) {
                    console.log('Retrying initialization in 500ms...');
                    setTimeout(() => {
                        window.expenseManager = null;
                        initializeExpenseManager();
                    }, 500);
                }
            } else {
                console.log('✅ All critical elements found');
                initializationAttempts = 0; // Reset counter on success
            }
            
        } catch (error) {
            console.error('❌ Error initializing Expense Manager:', error);
            if (initializationAttempts < maxInitializationAttempts) {
                console.log('Retrying initialization in 1000ms...');
                setTimeout(initializeExpenseManager, 1000);
            }
        }
    } else {
        console.log('⚠️ Expense manager section not found, retrying...');
        if (initializationAttempts < maxInitializationAttempts) {
            setTimeout(initializeExpenseManager, 100);
        }
    }
}

// Detect force refresh and handle data reset
window.addEventListener('beforeunload', function() {
    // Set a flag to detect force refresh
    sessionStorage.setItem('budgetBuddyForceRefresh', 'true');
});

// Check for force refresh on page load
window.addEventListener('load', function() {
    const wasForceRefreshed = sessionStorage.getItem('budgetBuddyForceRefresh');
    
    if (wasForceRefreshed === 'true') {
        console.log('🔄 Force refresh detected - checking for data reset...');
        
        // Check if user wants to reset data on force refresh
        const shouldResetOnRefresh = localStorage.getItem('budgetBuddyResetOnRefresh');
        
        if (shouldResetOnRefresh === 'true') {
            console.log('🗑️ Auto-resetting data due to force refresh...');
            
            // Clear all Budget Buddy data
            const keysToRemove = [
                'budgetBuddyExpenses',
                'budgetBuddyBudget', 
                'budgetBuddySavings',
                'budgetBuddyGoals',
                'budgetBuddySavingsHistory',
                'budgetBuddyWithdrawals'
            ];
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            // Show notification
            setTimeout(() => {
                if (typeof window.showNotification === 'function') {
                    window.showNotification('🔄 Data reset due to force refresh', 'info');
                }
            }, 2000);
        }
        
        // Clear the force refresh flag
        sessionStorage.removeItem('budgetBuddyForceRefresh');
    }
});

// Try multiple initialization methods
document.addEventListener('DOMContentLoaded', initializeExpenseManager);

// Fallback initialization
window.addEventListener('load', function() {
    if (!window.expenseManager) {
        console.log('Fallback: Initializing expense manager on window load');
        initializeExpenseManager();
    }
});

// Manual initialization function
window.forceInitializeExpenseManager = function() {
    console.log('Manual initialization requested');
    initializeExpenseManager();
};

// Global function to reset all expense manager data
window.resetExpenseManagerData = function() {
    console.log('=== RESETTING ALL EXPENSE MANAGER DATA ===');
    
    // Clear localStorage first
    localStorage.removeItem('budgetBuddyExpenses');
    localStorage.removeItem('budgetBuddyBudget');
    console.log('✅ Cleared localStorage data');
    
    if (!window.expenseManager) {
        console.error('❌ Expense Manager not found - initializing first...');
        // Reset initialization attempts counter
        initializationAttempts = 0;
        initializeExpenseManager();
        
        // Wait a moment for initialization
        setTimeout(() => {
            if (window.expenseManager) {
                window.expenseManager.resetAllData();
            } else {
                console.error('❌ Could not initialize expense manager');
            }
        }, 500);
    } else {
        window.expenseManager.resetAllData();
    }
    
    console.log('=== RESET COMPLETE ===');
};

// Global function to force clean initialization
window.forceCleanInitialization = function() {
    console.log('🔄 FORCING CLEAN INITIALIZATION...');
    
    // Clear all data
    localStorage.removeItem('budgetBuddyExpenses');
    localStorage.removeItem('budgetBuddyBudget');
    localStorage.removeItem('budgetBuddySavings');
    localStorage.removeItem('budgetBuddyGoals');
    localStorage.removeItem('budgetBuddySavingsHistory');
    localStorage.removeItem('budgetBuddyWithdrawals');
    
    // Reset global variables
    window.expenseManager = null;
    window.piggyBank = null;
    
    // Reset initialization counter
    initializationAttempts = 0;
    
    // Force re-initialization
    setTimeout(() => {
        initializeExpenseManager();
        if (window.piggyBank) {
            window.piggyBank.init();
        }
    }, 100);
    
    console.log('✅ Clean initialization completed');
};

// Global function to force restart website with data reset
window.forceRestartWebsite = function() {
    console.log('🔄 FORCE RESTARTING WEBSITE WITH DATA RESET...');
    
    // Show confirmation dialog
    const confirmRestart = confirm(
        '⚠️ FORCE RESTART WARNING\n\n' +
        'This will completely reset all your data including:\n' +
        '• All expense records\n' +
        '• Budget settings\n' +
        '• Piggy bank savings\n' +
        '• All savings goals\n' +
        '• Transaction history\n\n' +
        'This action cannot be undone!\n\n' +
        'Are you sure you want to continue?'
    );
    
    if (!confirmRestart) {
        console.log('❌ Force restart cancelled by user');
        return;
    }
    
    // Clear all Budget Buddy data from localStorage
    const keysToRemove = [
        'budgetBuddyExpenses',
        'budgetBuddyBudget', 
        'budgetBuddySavings',
        'budgetBuddyGoals',
        'budgetBuddySavingsHistory',
        'budgetBuddyWithdrawals',
        'budgetBuddySettings',
        'budgetBuddyUserPreferences'
    ];
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`✅ Cleared ${key}`);
    });
    
    // Clear any other Budget Buddy related data
    Object.keys(localStorage).forEach(key => {
        if (key.toLowerCase().includes('budgetbuddy') || key.toLowerCase().includes('budget_buddy')) {
            localStorage.removeItem(key);
            console.log(`✅ Cleared additional key: ${key}`);
        }
    });
    
    // Reset all global variables
    window.expenseManager = null;
    window.piggyBank = null;
    window.desktopNavigation = null;
    
    // Show restart notification
    if (typeof window.showNotification === 'function') {
        window.showNotification('🔄 Restarting website with fresh data...', 'info');
    }
    
    // Wait a moment then reload the page
    setTimeout(() => {
        console.log('🔄 Reloading page...');
        window.location.reload(true); // Force reload from server
    }, 1500);
    
    console.log('✅ Force restart initiated');
};

// Global function for complete data wipe (more aggressive)
window.completeDataWipe = function() {
    console.log('🗑️ COMPLETE DATA WIPE INITIATED...');
    
    const confirmWipe = confirm(
        '🚨 COMPLETE DATA WIPE\n\n' +
        'This is the most aggressive reset option.\n' +
        'It will:\n' +
        '• Clear ALL localStorage data (not just Budget Buddy)\n' +
        '• Reset the entire application state\n' +
        '• Force a complete page reload\n\n' +
        '⚠️ THIS WILL AFFECT ALL WEBSITES STORED DATA!\n\n' +
        'Only use this if you\'re experiencing serious issues.\n\n' +
        'Continue with complete wipe?'
    );
    
    if (!confirmWipe) {
        console.log('❌ Complete data wipe cancelled');
        return;
    }
    
    // Clear ALL localStorage
    localStorage.clear();
    console.log('🗑️ All localStorage cleared');
    
    // Clear sessionStorage as well
    sessionStorage.clear();
    console.log('🗑️ All sessionStorage cleared');
    
    // Reset all global variables
    window.expenseManager = null;
    window.piggyBank = null;
    window.desktopNavigation = null;
    
    // Force hard reload
    setTimeout(() => {
        window.location.href = window.location.href;
    }, 1000);
    
    console.log('✅ Complete data wipe completed');
};

// Function to enable auto-reset on force refresh
window.enableAutoResetOnRefresh = function() {
    localStorage.setItem('budgetBuddyResetOnRefresh', 'true');
    console.log('✅ Auto-reset on force refresh ENABLED');
    
    if (typeof window.showNotification === 'function') {
        window.showNotification('🔄 Auto-reset on force refresh enabled', 'success');
    }
    
    console.log('ℹ️ Now when you force refresh (Ctrl+F5 or Cmd+Shift+R), all data will be reset automatically');
};

// Function to disable auto-reset on force refresh
window.disableAutoResetOnRefresh = function() {
    localStorage.removeItem('budgetBuddyResetOnRefresh');
    console.log('✅ Auto-reset on force refresh DISABLED');
    
    if (typeof window.showNotification === 'function') {
        window.showNotification('🔄 Auto-reset on force refresh disabled', 'info');
    }
};

// Function to check auto-reset status
window.checkAutoResetStatus = function() {
    const isEnabled = localStorage.getItem('budgetBuddyResetOnRefresh') === 'true';
    console.log(`🔍 Auto-reset on force refresh: ${isEnabled ? 'ENABLED' : 'DISABLED'}`);
    
    if (typeof window.showNotification === 'function') {
        window.showNotification(
            `Auto-reset on force refresh: ${isEnabled ? 'ENABLED' : 'DISABLED'}`, 
            isEnabled ? 'success' : 'info'
        );
    }
    
    return isEnabled;
};

// Function to clear all savings goals
window.clearAllSavingsGoals = function() {
    console.log('🗑️ CLEARING ALL SAVINGS GOALS...');
    
    const confirmClear = confirm(
        '⚠️ CLEAR SAVINGS GOALS\n\n' +
        'This will permanently delete all your savings goals.\n' +
        'This action cannot be undone!\n\n' +
        'Are you sure you want to continue?'
    );
    
    if (!confirmClear) {
        console.log('❌ Clear savings goals cancelled by user');
        return;
    }
    
    // Clear goals from localStorage
    localStorage.removeItem('budgetBuddyGoals');
    console.log('✅ Cleared budgetBuddyGoals from localStorage');
    
    // Also clear any related savings goal data
    localStorage.removeItem('budgetBuddySavingsHistory');
    console.log('✅ Cleared budgetBuddySavingsHistory from localStorage');
    
    // Reset piggy bank if it exists
    if (window.piggyBank) {
        try {
            // Reinitialize piggy bank to reflect changes
            window.piggyBank.loadData();
            window.piggyBank.updateUI();
            console.log('✅ Piggy bank updated after clearing goals');
        } catch (error) {
            console.log('⚠️ Could not update piggy bank:', error.message);
        }
    }
    
    // Show success notification
    if (typeof window.showNotification === 'function') {
        window.showNotification('🗑️ All savings goals cleared successfully!', 'success');
    }
    
    console.log('✅ All savings goals cleared successfully');
};

// Function to clear specific savings goal by name
window.clearSpecificSavingsGoal = function(goalName) {
    console.log(`🗑️ CLEARING SPECIFIC SAVINGS GOAL: ${goalName}`);
    
    try {
        const goals = JSON.parse(localStorage.getItem('budgetBuddyGoals') || '[]');
        const updatedGoals = goals.filter(goal => goal.name !== goalName);
        
        if (goals.length === updatedGoals.length) {
            console.log(`⚠️ Goal "${goalName}" not found`);
            if (typeof window.showNotification === 'function') {
                window.showNotification(`Goal "${goalName}" not found`, 'warning');
            }
            return false;
        }
        
        localStorage.setItem('budgetBuddyGoals', JSON.stringify(updatedGoals));
        console.log(`✅ Removed goal "${goalName}"`);
        
        // Update piggy bank if it exists
        if (window.piggyBank) {
            window.piggyBank.loadData();
            window.piggyBank.updateUI();
        }
        
        if (typeof window.showNotification === 'function') {
            window.showNotification(`Goal "${goalName}" removed successfully!`, 'success');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error clearing specific goal:', error);
        return false;
    }
};

// Function to list all current savings goals
window.listSavingsGoals = function() {
    console.log('📋 LISTING ALL SAVINGS GOALS...');
    
    try {
        const goals = JSON.parse(localStorage.getItem('budgetBuddyGoals') || '[]');
        
        if (goals.length === 0) {
            console.log('ℹ️ No savings goals found');
            if (typeof window.showNotification === 'function') {
                window.showNotification('No savings goals found', 'info');
            }
            return [];
        }
        
        console.log(`📊 Found ${goals.length} savings goals:`);
        goals.forEach((goal, index) => {
            console.log(`${index + 1}. ${goal.name} - Target: ₹${goal.targetAmount} - Saved: ₹${goal.savedAmount || 0}`);
        });
        
        if (typeof window.showNotification === 'function') {
            window.showNotification(`Found ${goals.length} savings goals (check console for details)`, 'info');
        }
        
        return goals;
    } catch (error) {
        console.error('❌ Error listing goals:', error);
        return [];
    }
};

// Function to clear budget form inputs
window.clearBudgetForm = function() {
    console.log('🧹 CLEARING BUDGET FORM...');
    
    const incomeInput = document.getElementById('monthlyIncome');
    const savingsInput = document.getElementById('savingsPercentage');
    
    if (incomeInput) {
        incomeInput.value = '';
        console.log('✅ Cleared monthly income input');
    }
    
    if (savingsInput) {
        savingsInput.value = '';
        console.log('✅ Cleared savings percentage input');
    }
    
    if (typeof window.showNotification === 'function') {
        window.showNotification('💨 Budget form cleared', 'info');
    }
    
    console.log('✅ Budget form cleared successfully');
};

// Function to fix tools dropdown functionality
window.fixToolsDropdown = function() {
    console.log('🔧 FIXING TOOLS DROPDOWN...');
    
    const toolsBtn = document.getElementById('desktopToolsBtn');
    const toolsMenu = document.getElementById('desktopToolsMenu');
    
    if (!toolsBtn || !toolsMenu) {
        console.error('❌ Tools dropdown elements not found');
        console.log('Available elements with "tools" in ID:', 
            Array.from(document.querySelectorAll('[id*="tools"], [id*="Tools"]')).map(el => el.id));
        return false;
    }
    
    console.log('✅ Found tools dropdown elements');
    
    // Remove existing event listeners by cloning elements
    const newToolsBtn = toolsBtn.cloneNode(true);
    const newToolsMenu = toolsMenu.cloneNode(true);
    
    toolsBtn.parentNode.replaceChild(newToolsBtn, toolsBtn);
    toolsMenu.parentNode.replaceChild(newToolsMenu, toolsMenu);
    
    // Add required CSS if missing
    addToolsDropdownCSS();
    
    let isOpen = false;
    
    // Add click event listener
    newToolsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🖱️ Tools button clicked, current state:', isOpen);
        
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!newToolsBtn.contains(e.target) && !newToolsMenu.contains(e.target)) {
            closeDropdown();
        }
    });
    
    // Handle keyboard navigation
    newToolsBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (isOpen) {
                closeDropdown();
            } else {
                openDropdown();
            }
        }
        if (e.key === 'Escape') {
            closeDropdown();
        }
    });
    
    function openDropdown() {
        console.log('📂 Opening tools dropdown');
        newToolsMenu.classList.add('show');
        newToolsBtn.classList.add('active');
        isOpen = true;
        
        // Focus first menu item
        const firstMenuItem = newToolsMenu.querySelector('.tool-item');
        if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 100);
        }
    }
    
    function closeDropdown() {
        console.log('📁 Closing tools dropdown');
        newToolsMenu.classList.remove('show');
        newToolsBtn.classList.remove('active');
        isOpen = false;
    }
    
    // Setup menu item handlers
    const showAllMenuBtn = newToolsMenu.querySelector('#showAllMenuBtn');
    if (showAllMenuBtn) {
        showAllMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeDropdown();
            console.log('📋 All Menu Options clicked');
            
            if (window.menuSystem) {
                window.menuSystem.showMenuModal();
            } else if (window.desktopNavigation) {
                window.desktopNavigation.showFallbackMenu();
            } else {
                showSimpleFallbackMenu();
            }
        });
    }
    
    console.log('✅ Tools dropdown fixed successfully');
    
    if (typeof window.showNotification === 'function') {
        window.showNotification('🔧 Tools dropdown fixed!', 'success');
    }
    
    return true;
};

// Function to add required CSS for tools dropdown
function addToolsDropdownCSS() {
    const existingStyle = document.getElementById('tools-dropdown-fix-css');
    if (existingStyle) return;
    
    const style = document.createElement('style');
    style.id = 'tools-dropdown-fix-css';
    style.textContent = `
        .tools-dropdown {
            position: relative;
        }
        
        .tools-dropdown-menu {
            display: none;
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            min-width: 200px;
            z-index: 1000;
            padding: 8px 0;
            margin-top: 8px;
        }
        
        .tools-dropdown-menu.show {
            display: block;
            animation: dropdownFadeIn 0.2s ease-out;
        }
        
        @keyframes dropdownFadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .tool-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            color: #374151;
            text-decoration: none;
            transition: background-color 0.2s;
            border: none;
            background: none;
            width: 100%;
            text-align: left;
            cursor: pointer;
        }
        
        .tool-item:hover {
            background-color: #f3f4f6;
        }
        
        .tool-item:focus {
            background-color: #f3f4f6;
            outline: none;
        }
        
        .tool-icon {
            margin-right: 12px;
            font-size: 16px;
        }
        
        .tools-btn.active .dropdown-arrow {
            transform: rotate(180deg);
        }
        
        .dropdown-arrow {
            transition: transform 0.2s ease;
        }
        
        /* Responsive positioning */
        @media (max-width: 1200px) {
            .tools-dropdown-menu {
                right: 0;
                left: auto;
            }
        }
    `;
    document.head.appendChild(style);
    console.log('✅ Tools dropdown CSS added');
}

// Simple fallback menu function
function showSimpleFallbackMenu() {
    console.log('📋 Showing simple fallback menu');
    
    const menuHTML = `
        <div id="simpleFallbackMenu" style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 12px;
                max-width: 400px;
                width: 90%;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #374151;">📋 Quick Menu</h2>
                    <button onclick="document.getElementById('simpleFallbackMenu').remove()" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #6b7280;
                    ">&times;</button>
                </div>
                <div style="display: grid; gap: 10px;">
                    <button onclick="location.href='#expense-manager'; document.getElementById('simpleFallbackMenu').remove();" style="
                        padding: 12px;
                        border: 1px solid #e5e7eb;
                        border-radius: 6px;
                        background: white;
                        cursor: pointer;
                        text-align: left;
                    ">💰 Expense Manager</button>
                    <button onclick="location.href='#piggy-bank'; document.getElementById('simpleFallbackMenu').remove();" style="
                        padding: 12px;
                        border: 1px solid #e5e7eb;
                        border-radius: 6px;
                        background: white;
                        cursor: pointer;
                        text-align: left;
                    ">🐷 Piggy Bank</button>
                    <button onclick="location.href='#features'; document.getElementById('simpleFallbackMenu').remove();" style="
                        padding: 12px;
                        border: 1px solid #e5e7eb;
                        border-radius: 6px;
                        background: white;
                        cursor: pointer;
                        text-align: left;
                    ">✨ Features</button>
                    <button onclick="location.href='#contact'; document.getElementById('simpleFallbackMenu').remove();" style="
                        padding: 12px;
                        border: 1px solid #e5e7eb;
                        border-radius: 6px;
                        background: white;
                        cursor: pointer;
                        text-align: left;
                    ">📞 Contact</button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing menu
    const existing = document.getElementById('simpleFallbackMenu');
    if (existing) existing.remove();
    
    document.body.insertAdjacentHTML('beforeend', menuHTML);
};

// Comprehensive fix for both PDF export and tools dropdown
window.fixPDFAndToolsDropdown = function() {
    console.log('🔧 COMPREHENSIVE FIX: PDF Export & Tools Dropdown');
    
    const results = {
        pdf: false,
        dropdown: false
    };
    
    // Fix 1: PDF Export
    console.log('\n📄 Step 1: Fixing PDF Export...');
    try {
        // Check jsPDF availability
        if (window.jsPDF || typeof jsPDF !== 'undefined') {
            console.log('✅ jsPDF is available');
            results.pdf = true;
        } else {
            console.log('⚠️ jsPDF not found, attempting to reload...');
            // Try to reload jsPDF
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                console.log('✅ jsPDF reloaded successfully');
                results.pdf = true;
            };
            document.head.appendChild(script);
        }
    } catch (error) {
        console.error('❌ PDF fix error:', error);
    }
    
    // Fix 2: Tools Dropdown
    console.log('\n🔧 Step 2: Fixing Tools Dropdown...');
    try {
        results.dropdown = fixToolsDropdown();
    } catch (error) {
        console.error('❌ Tools dropdown fix error:', error);
    }
    
    // Summary
    console.log('\n📊 FIX SUMMARY:');
    console.log(`PDF Export: ${results.pdf ? '✅ Fixed' : '❌ Failed'}`);
    console.log(`Tools Dropdown: ${results.dropdown ? '✅ Fixed' : '❌ Failed'}`);
    
    if (typeof window.showNotification === 'function') {
        const successCount = Object.values(results).filter(Boolean).length;
        const message = `Fixed ${successCount}/2 issues: ${results.pdf ? 'PDF ✅' : 'PDF ❌'} ${results.dropdown ? 'Dropdown ✅' : 'Dropdown ❌'}`;
        window.showNotification(message, successCount === 2 ? 'success' : 'warning');
    }
    
    return results;
};

// Auto-fix on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('🔄 Auto-fixing PDF and Tools Dropdown...');
        fixPDFAndToolsDropdown();
    }, 2000);
});

// Function to completely clean the website - remove all data and inputs
window.cleanWebsiteCompletely = function() {
    console.log('🧹 COMPLETE WEBSITE CLEANUP INITIATED...');
    
    const confirmClean = confirm(
        '🧹 COMPLETE WEBSITE CLEANUP\n\n' +
        'This will completely clean your website:\n' +
        '• Clear all form inputs\n' +
        '• Remove all stored data\n' +
        '• Reset all components\n' +
        '• Start completely fresh\n\n' +
        'Continue with complete cleanup?'
    );
    
    if (!confirmClean) {
        console.log('❌ Complete cleanup cancelled');
        return;
    }
    
    console.log('🗑️ Step 1: Clearing all localStorage data...');
    
    // Clear all Budget Buddy related localStorage
    const keysToRemove = [
        'budgetBuddyExpenses',
        'budgetBuddyBudget', 
        'budgetBuddySavings',
        'budgetBuddyGoals',
        'budgetBuddySavingsHistory',
        'budgetBuddyWithdrawals',
        'budgetBuddySettings',
        'budgetBuddyUserPreferences',
        'budgetBuddyResetOnRefresh'
    ];
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`✅ Cleared ${key}`);
    });
    
    // Clear any other Budget Buddy related data
    Object.keys(localStorage).forEach(key => {
        if (key.toLowerCase().includes('budgetbuddy') || key.toLowerCase().includes('budget_buddy')) {
            localStorage.removeItem(key);
            console.log(`✅ Cleared additional key: ${key}`);
        }
    });
    
    console.log('🧹 Step 2: Clearing all form inputs...');
    
    // Clear budget setup form
    const incomeInput = document.getElementById('monthlyIncome');
    const savingsInput = document.getElementById('savingsPercentage');
    
    if (incomeInput) {
        incomeInput.value = '';
        incomeInput.placeholder = 'Enter your monthly income';
    }
    if (savingsInput) {
        savingsInput.value = '';
        savingsInput.placeholder = '20';
    }
    
    // Clear expense form
    const expenseDescription = document.getElementById('expenseDescription');
    const expenseAmount = document.getElementById('expenseAmount');
    const expenseCategory = document.getElementById('expenseCategory');
    const expenseDate = document.getElementById('expenseDate');
    
    if (expenseDescription) {
        expenseDescription.value = '';
        expenseDescription.placeholder = 'What did you spend on?';
    }
    if (expenseAmount) {
        expenseAmount.value = '';
        expenseAmount.placeholder = 'Enter amount';
    }
    if (expenseCategory) expenseCategory.selectedIndex = 0;
    if (expenseDate) expenseDate.value = '';
    
    // Clear piggy bank forms
    const customSaveAmount = document.getElementById('customSaveAmount');
    const goalName = document.getElementById('goalName');
    const goalAmount = document.getElementById('goalAmount');
    const goalDeadline = document.getElementById('goalDeadline');
    const withdrawAmount = document.getElementById('withdrawAmount');
    const withdrawReason = document.getElementById('withdrawReason');
    
    if (customSaveAmount) customSaveAmount.value = '';
    if (goalName) goalName.value = '';
    if (goalAmount) goalAmount.value = '';
    if (goalDeadline) goalDeadline.value = '';
    if (withdrawAmount) withdrawAmount.value = '';
    if (withdrawReason) withdrawReason.value = '';
    
    // Clear contact form
    const contactName = document.getElementById('from_name');
    const contactEmail = document.getElementById('from_email');
    const contactMessage = document.getElementById('message');
    
    if (contactName) contactName.value = '';
    if (contactEmail) contactEmail.value = '';
    if (contactMessage) contactMessage.value = '';
    
    console.log('🔄 Step 3: Resetting application components...');
    
    // Reset global variables
    window.expenseManager = null;
    window.piggyBank = null;
    window.desktopNavigation = null;
    
    // Reset initialization counter
    if (typeof initializationAttempts !== 'undefined') {
        initializationAttempts = 0;
    }
    
    console.log('🎨 Step 4: Clearing dynamic content...');
    
    // Clear dynamic content areas
    const expensesList = document.getElementById('expensesList');
    const goalsList = document.getElementById('goalsList');
    const savingsHistory = document.getElementById('savingsHistory');
    const categoryBudgets = document.getElementById('categoryBudgets');
    const reportInsights = document.getElementById('reportInsights');
    const savingsInsights = document.getElementById('savingsInsights');
    
    if (expensesList) expensesList.innerHTML = '<p>No expenses recorded yet.</p>';
    if (goalsList) goalsList.innerHTML = '<p>No savings goals set yet.</p>';
    if (savingsHistory) savingsHistory.innerHTML = '<p>No savings history available.</p>';
    if (categoryBudgets) categoryBudgets.innerHTML = '';
    if (reportInsights) reportInsights.innerHTML = '<p>Set up your budget to see insights.</p>';
    if (savingsInsights) savingsInsights.innerHTML = '<p>Start saving to see insights.</p>';
    
    // Reset overview cards
    const totalBudget = document.getElementById('totalBudget');
    const totalExpenses = document.getElementById('totalExpenses');
    const remainingBudget = document.getElementById('remainingBudget');
    const savingsGoal = document.getElementById('savingsGoal');
    const totalSavings = document.getElementById('totalSavings');
    const monthlyTarget = document.getElementById('monthlyTarget');
    const goalsAchieved = document.getElementById('goalsAchieved');
    
    if (totalBudget) totalBudget.textContent = '₹0';
    if (totalExpenses) totalExpenses.textContent = '₹0';
    if (remainingBudget) remainingBudget.textContent = '₹0';
    if (savingsGoal) savingsGoal.textContent = '₹0';
    if (totalSavings) totalSavings.textContent = '₹0';
    if (monthlyTarget) monthlyTarget.textContent = '₹0';
    if (goalsAchieved) goalsAchieved.textContent = '0';
    
    // Clear any warning messages
    const budgetWarning = document.getElementById('budgetWarningMessage');
    if (budgetWarning) {
        budgetWarning.remove();
    }
    
    console.log('🚀 Step 5: Re-initializing clean application...');
    
    // Re-initialize everything cleanly
    setTimeout(() => {
        try {
            if (typeof initializeExpenseManager === 'function') {
                initializeExpenseManager();
            }
            
            // Initialize other components if they exist
            if (window.PiggyBank && typeof window.PiggyBank === 'function') {
                window.piggyBank = new window.PiggyBank();
            }
            
            if (window.DesktopNavigation && typeof window.DesktopNavigation === 'function') {
                window.desktopNavigation = new window.DesktopNavigation();
            }
            
            console.log('✅ Clean initialization completed');
            
        } catch (error) {
            console.log('⚠️ Some components may need manual refresh:', error.message);
        }
    }, 500);
    
    // Show success notification
    if (typeof window.showNotification === 'function') {
        window.showNotification('🎉 Website completely cleaned! Starting fresh...', 'success');
    }
    
    console.log('✅ COMPLETE WEBSITE CLEANUP FINISHED');
    console.log('🎉 Your website is now completely clean and ready for fresh use!');
};

// Debug function to test budget setup
window.testBudgetSetup = function() {
    console.log('=== BUDGET SETUP TEST ===');
    
    // Check if expense manager exists
    if (!window.expenseManager) {
        console.error('❌ Expense Manager not found');
        return;
    }
    console.log('✅ Expense Manager found');
    
    // Check if required elements exist
    const incomeElement = document.getElementById('monthlyIncome');
    const setupButton = document.getElementById('setupBudget');
    
    console.log('Income input element:', incomeElement);
    console.log('Setup button element:', setupButton);
    
    if (!incomeElement) {
        console.error('❌ Monthly income input not found');
        return;
    }
    
    if (!setupButton) {
        console.error('❌ Setup budget button not found');
        return;
    }
    
    // Check current budget data
    const budget = JSON.parse(localStorage.getItem('budgetBuddyBudget')) || {};
    console.log('Current budget data:', budget);
    
    // Check if there's already a value
    console.log('Current income value:', incomeElement.value);
    
    // Only set test data if user confirms
    const shouldSetTestData = confirm('Do you want to set test data (₹10,000) for budget setup testing?');
    
    if (shouldSetTestData) {
        incomeElement.value = '10000';
        console.log('Set test income to 10000');
        
        // Try to setup budget
        console.log('Attempting to setup budget...');
        window.expenseManager.setupBudget();
    } else {
        console.log('Test cancelled - no test data set');
    }
    
    console.log('=== END TEST ===');
};
