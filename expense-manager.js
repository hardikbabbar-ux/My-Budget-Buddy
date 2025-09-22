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
        // Budget setup
        document.getElementById('setupBudget').addEventListener('click', () => this.setupBudget());
        
        // Add expense
        document.getElementById('addExpense').addEventListener('click', () => this.addExpense());
        
        // Clear expenses
        document.getElementById('clearExpenses').addEventListener('click', () => this.clearExpenses());
        
        // Export data
        document.getElementById('exportData').addEventListener('click', () => this.exportData());
        
        // Enter key support for forms
        document.getElementById('monthlyIncome').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.setupBudget();
        });
        
        document.getElementById('expenseAmount').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addExpense();
        });
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
        this.categories[category].spent += amount;

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
        const expense = this.expenses.find(exp => exp.id === expenseId);
        if (expense) {
            this.categories[expense.category].spent -= expense.amount;
            this.expenses = this.expenses.filter(exp => exp.id !== expenseId);
            this.saveData();
            this.updateUI();
            this.showNotification('Expense deleted', 'success');
        }
    }

    clearExpenses() {
        if (confirm('Are you sure you want to clear all expenses? This action cannot be undone.')) {
            this.expenses = [];
            Object.keys(this.categories).forEach(category => {
                this.categories[category].spent = 0;
            });
            this.saveData();
            this.updateUI();
            this.showNotification('All expenses cleared', 'success');
        }
    }

    calculateCategorySpent(category) {
        return this.expenses
            .filter(expense => expense.category === category)
            .reduce((total, expense) => total + expense.amount, 0);
    }

    updateUI() {
        this.updateOverviewCards();
        this.updateCategoryBudgets();
        this.updateExpensesList();
        this.updateChart();
        this.updateInsights();
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
            
            const categoryName = this.categories[expense.category].name;
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
                    <button class="btn-icon btn-delete" onclick="expenseManager.deleteExpense('${expense.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
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
        // Show loading notification
        this.showNotification('Generating PDF report...', 'info');
        
        try {
            // Check jsPDF availability and access it correctly
            console.log('window.jsPDF type:', typeof window.jsPDF);
            console.log('window.jsPDF content:', window.jsPDF);
            
            let jsPDFConstructor;
            
            // Try different ways to access jsPDF based on version
            if (window.jsPDF && typeof window.jsPDF.jsPDF === 'function') {
                jsPDFConstructor = window.jsPDF.jsPDF;
                console.log('Using window.jsPDF.jsPDF');
            } else if (window.jsPDF && typeof window.jsPDF === 'function') {
                jsPDFConstructor = window.jsPDF;
                console.log('Using window.jsPDF directly');
            } else if (typeof jsPDF === 'function') {
                jsPDFConstructor = jsPDF;
                console.log('Using global jsPDF');
            } else {
                throw new Error('jsPDF library not found or not loaded properly');
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

    exportAsText() {
        try {
            const totalBudget = this.budget.totalBudget || 0;
            const totalExpenses = this.expenses.reduce((total, expense) => total + expense.amount, 0);
            const remaining = totalBudget - totalExpenses;
            const savingsGoal = this.budget.savingsAmount || 0;
            
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
            Object.keys(this.categories).forEach(categoryKey => {
                const category = this.categories[categoryKey];
                const categoryRemaining = category.budget - category.spent;
                reportContent += `${category.name}\n`;
                reportContent += `  Budget: ₹${category.budget.toLocaleString()}\n`;
                reportContent += `  Spent: ₹${category.spent.toLocaleString()}\n`;
                reportContent += `  Remaining: ₹${categoryRemaining.toLocaleString()}\n\n`;
            });
            
            if (this.expenses.length > 0) {
                reportContent += `RECENT EXPENSES:\n`;
                reportContent += `${'='.repeat(50)}\n`;
                const recentExpenses = this.expenses.slice(0, 20);
                recentExpenses.forEach(expense => {
                    const date = new Date(expense.date).toLocaleDateString();
                    const categoryName = this.categories[expense.category].name;
                    reportContent += `${date} - ${expense.description} (${categoryName}) - ₹${expense.amount.toLocaleString()}\n`;
                });
            }
            
            const blob = new Blob([reportContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `budget-buddy-report-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Report exported as text file successfully!', 'success');
            
        } catch (error) {
            console.error('Text export error:', error);
            this.showNotification('Failed to export data. Please try again.', 'error');
        }
    }

    saveData() {
        localStorage.setItem('budgetBuddyExpenses', JSON.stringify(this.expenses));
        localStorage.setItem('budgetBuddyBudget', JSON.stringify(this.budget));
    }

    loadData() {
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
    loadData() {
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
function initializeExpenseManager() {
    console.log('Attempting to initialize Expense Manager...');
    
    const expenseManagerSection = document.getElementById('expense-manager');
    console.log('Expense manager section found:', expenseManagerSection);
    
    if (expenseManagerSection) {
        try {
            expenseManager = new ExpenseManager();
            window.expenseManager = expenseManager;
            console.log('✅ Expense Manager initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing Expense Manager:', error);
        }
    } else {
        console.log('⚠️ Expense manager section not found, retrying...');
        // Retry after a short delay
        setTimeout(initializeExpenseManager, 100);
    }
}

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
    
    if (!window.expenseManager) {
        console.error('❌ Expense Manager not found - initializing first...');
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
    
    // Test with sample data
    incomeElement.value = '10000';
    console.log('Set test income to 10000');
    
    // Try to setup budget
    console.log('Attempting to setup budget...');
    window.expenseManager.setupBudget();
    
    console.log('=== END TEST ===');
};
