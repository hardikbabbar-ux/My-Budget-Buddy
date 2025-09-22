// Piggy Bank JavaScript
class PiggyBank {
    constructor() {
        this.savings = JSON.parse(localStorage.getItem('budgetBuddySavings')) || [];
        this.goals = JSON.parse(localStorage.getItem('budgetBuddyGoals')) || [];
        this.savingsChart = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadData();
        this.updateSavingsOverview();
        this.setDefaultGoalDate();
    }

    setupEventListeners() {
        // Quick save buttons
        document.querySelectorAll('.quick-amount').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = parseInt(e.target.dataset.amount);
                this.saveMoney(amount, 'Quick Save');
            });
        });

        // Custom save
        document.getElementById('saveMoneyBtn').addEventListener('click', () => this.handleCustomSave());
        document.getElementById('customSaveAmount').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleCustomSave();
        });

        // Goal management
        document.getElementById('addGoalBtn').addEventListener('click', () => this.showGoalModal());
        document.getElementById('createGoal').addEventListener('click', () => this.createGoal());
        document.getElementById('cancelGoal').addEventListener('click', () => this.hideGoalModal());
        document.getElementById('closeGoalModal').addEventListener('click', () => this.hideGoalModal());

        // Withdraw functionality
        document.getElementById('withdrawBtn').addEventListener('click', () => this.showWithdrawModal());
        document.getElementById('confirmWithdraw').addEventListener('click', () => this.confirmWithdraw());
        document.getElementById('cancelWithdraw').addEventListener('click', () => this.hideWithdrawModal());
        document.getElementById('closeWithdrawModal').addEventListener('click', () => this.hideWithdrawModal());

        // Export savings
        document.getElementById('exportSavingsBtn').addEventListener('click', () => this.exportSavingsReport());

        // Modal click outside to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideGoalModal();
                this.hideWithdrawModal();
            }
        });
    }

    handleCustomSave() {
        const amount = parseFloat(document.getElementById('customSaveAmount').value);
        if (amount && amount > 0) {
            this.saveMoney(amount, 'Custom Save');
            document.getElementById('customSaveAmount').value = '';
        } else {
            this.showNotification('Please enter a valid amount', 'error');
        }
    }

    saveMoney(amount, type = 'Manual') {
        // Check if user has enough budget/balance to save
        const availableBalance = this.getAvailableBalance();
        console.log('Trying to save:', amount, 'Available balance:', availableBalance);
        
        if (amount > availableBalance) {
            this.showNotification(`Insufficient balance! Available: ₹${availableBalance.toLocaleString()}`, 'error');
            return false;
        }

        const saving = {
            id: Date.now(),
            amount: amount,
            type: type,
            date: new Date().toISOString(),
            description: `Saved ₹${amount} via ${type}`
        };

        this.savings.push(saving);
        
        // Deduct from expense manager budget
        this.deductFromBudget(amount, `Transferred to Savings - ${type}`);
        
        this.saveData();
        this.updateSavingsOverview();
        this.updateSavingsChart();
        this.showNotification(`₹${amount} saved successfully! 🐷 (Deducted from budget)`, 'success');
        
        // Check if any goals are achieved
        this.checkGoalAchievements();
        
        // Update expense manager UI if available
        if (window.expenseManager) {
            window.expenseManager.updateUI();
        }
        
        return true;
    }

    createGoal() {
        const name = document.getElementById('goalName').value.trim();
        const amount = parseFloat(document.getElementById('goalAmount').value);
        const deadline = document.getElementById('goalDeadline').value;
        const category = document.getElementById('goalCategory').value;
        const description = document.getElementById('goalDescription').value.trim();

        if (!name || !amount || amount <= 0) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const goal = {
            id: Date.now(),
            name: name,
            amount: amount,
            savedAmount: 0,
            deadline: deadline,
            category: category,
            description: description,
            createdDate: new Date().toISOString(),
            achieved: false,
            achievedDate: null
        };

        this.goals.push(goal);
        this.saveData();
        this.updateSavingsOverview();
        this.hideGoalModal();
        this.showNotification(`Goal "${name}" created successfully! 🎯`, 'success');
    }

    showGoalModal() {
        document.getElementById('goalModal').style.display = 'flex';
        document.getElementById('goalName').focus();
    }

    hideGoalModal() {
        document.getElementById('goalModal').style.display = 'none';
        this.clearGoalForm();
    }

    clearGoalForm() {
        document.getElementById('goalName').value = '';
        document.getElementById('goalAmount').value = '';
        document.getElementById('goalDeadline').value = '';
        document.getElementById('goalCategory').value = 'emergency';
        document.getElementById('goalDescription').value = '';
    }

    showWithdrawModal() {
        const totalSavings = this.getTotalSavings();
        document.getElementById('availableBalance').textContent = `₹${totalSavings.toLocaleString()}`;
        document.getElementById('withdrawModal').style.display = 'flex';
        document.getElementById('withdrawAmount').focus();
    }

    hideWithdrawModal() {
        document.getElementById('withdrawModal').style.display = 'none';
        this.clearWithdrawForm();
    }

    clearWithdrawForm() {
        document.getElementById('withdrawAmount').value = '';
        document.getElementById('withdrawReason').value = 'emergency';
        document.getElementById('withdrawNote').value = '';
    }

    confirmWithdraw() {
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        const reason = document.getElementById('withdrawReason').value;
        const note = document.getElementById('withdrawNote').value.trim();
        const totalSavings = this.getTotalSavings();

        if (!amount || amount <= 0) {
            this.showNotification('Please enter a valid amount', 'error');
            return;
        }

        if (amount > totalSavings) {
            this.showNotification('Insufficient savings balance', 'error');
            return;
        }

        const withdrawal = {
            id: Date.now(),
            amount: -amount, // Negative for withdrawal
            type: 'Withdrawal',
            reason: reason,
            note: note,
            date: new Date().toISOString(),
            description: `Withdrew ₹${amount} - ${reason}${note ? ': ' + note : ''}`
        };

        this.savings.push(withdrawal);
        
        // Add money back to expense manager budget
        this.addToBudget(amount, `Withdrawn from Savings - ${reason}`);
        
        this.saveData();
        this.updateSavingsOverview();
        this.updateSavingsChart();
        this.hideWithdrawModal();
        this.showNotification(`₹${amount} withdrawn and added back to budget! 💰`, 'success');
        
        // Update expense manager UI if available
        if (window.expenseManager) {
            window.expenseManager.updateUI();
        }
    }

    allocateToGoal(goalId, amount) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal || goal.achieved) return;

        const totalSavings = this.getTotalSavings();
        const allocatedAmount = Math.min(amount, totalSavings, goal.amount - goal.savedAmount);

        if (allocatedAmount > 0) {
            goal.savedAmount += allocatedAmount;
            
            // Check if goal is achieved
            if (goal.savedAmount >= goal.amount) {
                goal.achieved = true;
                goal.achievedDate = new Date().toISOString();
                this.showNotification(`🎉 Goal "${goal.name}" achieved! Congratulations!`, 'success');
            }

            // Record the allocation
            const allocation = {
                id: Date.now(),
                amount: -allocatedAmount,
                type: 'Goal Allocation',
                goalId: goalId,
                goalName: goal.name,
                date: new Date().toISOString(),
                description: `Allocated ₹${allocatedAmount} to goal: ${goal.name}`
            };

            this.savings.push(allocation);
            this.saveData();
            this.updateSavingsOverview();
            this.showNotification(`₹${allocatedAmount} allocated to "${goal.name}"`, 'success');
        }
    }

    deleteGoal(goalId) {
        const goalIndex = this.goals.findIndex(g => g.id === goalId);
        if (goalIndex > -1) {
            const goal = this.goals[goalIndex];
            
            // Return saved amount to general savings if goal had money
            if (goal.savedAmount > 0) {
                const returnSaving = {
                    id: Date.now(),
                    amount: goal.savedAmount,
                    type: 'Goal Deleted',
                    date: new Date().toISOString(),
                    description: `Returned ₹${goal.savedAmount} from deleted goal: ${goal.name}`
                };
                this.savings.push(returnSaving);
            }

            this.goals.splice(goalIndex, 1);
            this.saveData();
            this.updateSavingsOverview();
            this.showNotification(`Goal "${goal.name}" deleted`, 'info');
        }
    }

    getTotalSavings() {
        return this.savings.reduce((total, saving) => total + saving.amount, 0);
    }

    getMonthlyTarget() {
        // Calculate based on active goals
        const activeGoals = this.goals.filter(g => !g.achieved);
        if (activeGoals.length === 0) return 0;

        let totalTarget = 0;
        activeGoals.forEach(goal => {
            const remaining = goal.amount - goal.savedAmount;
            const deadline = new Date(goal.deadline);
            const now = new Date();
            const monthsLeft = Math.max(1, Math.ceil((deadline - now) / (1000 * 60 * 60 * 24 * 30)));
            totalTarget += remaining / monthsLeft;
        });

        return Math.round(totalTarget);
    }

    getGoalsAchieved() {
        return this.goals.filter(g => g.achieved).length;
    }

    checkGoalAchievements() {
        this.goals.forEach(goal => {
            if (!goal.achieved && goal.savedAmount >= goal.amount) {
                goal.achieved = true;
                goal.achievedDate = new Date().toISOString();
                this.showNotification(`🎉 Congratulations! Goal "${goal.name}" achieved!`, 'success');
            }
        });
    }

    updateUI() {
        this.updateSavingsOverview();
        this.updateGoalsList();
        this.updateSavingsHistory();
        this.updateSavingsInsights();
    }

    updateSavingsOverview() {
        const totalSavings = this.getTotalSavings();
        const monthlyTarget = this.getMonthlyTarget();
        const goalsAchieved = this.getGoalsAchieved();

        document.getElementById('totalSavings').textContent = `₹${totalSavings.toLocaleString()}`;
        document.getElementById('monthlyTarget').textContent = `₹${monthlyTarget.toLocaleString()}`;
        document.getElementById('goalsAchieved').textContent = goalsAchieved;
    }

    updateGoalsList() {
        const goalsList = document.getElementById('goalsList');
        
        if (this.goals.length === 0) {
            goalsList.innerHTML = `
                <div class="no-goals">
                    <i class="fas fa-bullseye"></i>
                    <p>No savings goals yet. Create your first goal to start saving!</p>
                </div>
            `;
            return;
        }

        goalsList.innerHTML = this.goals.map(goal => {
            const progress = (goal.savedAmount / goal.amount) * 100;
            const remaining = goal.amount - goal.savedAmount;
            const deadline = new Date(goal.deadline);
            const isOverdue = deadline < new Date() && !goal.achieved;
            const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));

            return `
                <div class="goal-card ${goal.achieved ? 'achieved' : ''} ${isOverdue ? 'overdue' : ''}">
                    <div class="goal-header">
                        <div class="goal-info">
                            <h4>${goal.name}</h4>
                            <span class="goal-category">${this.getCategoryIcon(goal.category)} ${this.getCategoryName(goal.category)}</span>
                        </div>
                        <div class="goal-actions">
                            ${!goal.achieved ? `<button class="btn-small btn-primary" onclick="piggyBank.showAllocateModal(${goal.id})">Add Money</button>` : ''}
                            <button class="btn-small btn-delete" onclick="piggyBank.deleteGoal(${goal.id})">Delete</button>
                        </div>
                    </div>
                    <div class="goal-progress">
                        <div class="progress-info">
                            <span>₹${goal.savedAmount.toLocaleString()} / ₹${goal.amount.toLocaleString()}</span>
                            <span>${Math.round(progress)}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                        </div>
                    </div>
                    <div class="goal-details">
                        ${goal.achieved ? 
                            `<span class="goal-status achieved">🎉 Achieved on ${new Date(goal.achievedDate).toLocaleDateString()}</span>` :
                            `<span class="goal-status ${isOverdue ? 'overdue' : ''}">${isOverdue ? '⚠️ Overdue' : `📅 ${daysLeft} days left`}</span>`
                        }
                        <span class="goal-remaining">₹${remaining.toLocaleString()} remaining</span>
                    </div>
                    ${goal.description ? `<p class="goal-description">${goal.description}</p>` : ''}
                </div>
            `;
        }).join('');
    }

    updateSavingsHistory() {
        const historyContainer = document.getElementById('savingsHistory');
        
        if (this.savings.length === 0) {
            historyContainer.innerHTML = `
                <div class="no-history">
                    <i class="fas fa-piggy-bank"></i>
                    <p>No savings history yet. Start saving to see your progress!</p>
                </div>
            `;
            return;
        }

        const recentSavings = this.savings.slice().reverse().slice(0, 10);
        
        historyContainer.innerHTML = recentSavings.map(saving => {
            const isPositive = saving.amount > 0;
            const date = new Date(saving.date).toLocaleDateString();
            
            return `
                <div class="savings-item ${isPositive ? 'positive' : 'negative'}">
                    <div class="savings-icon">
                        <i class="fas ${this.getSavingsIcon(saving.type)}"></i>
                    </div>
                    <div class="savings-details">
                        <div class="savings-description">${saving.description}</div>
                        <div class="savings-date">${date}</div>
                    </div>
                    <div class="savings-amount ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '+' : ''}₹${Math.abs(saving.amount).toLocaleString()}
                    </div>
                </div>
            `;
        }).join('');
    }

    updateSavingsInsights() {
        const insights = document.getElementById('savingsInsights');
        const totalSavings = this.getTotalSavings();
        const monthlyTarget = this.getMonthlyTarget();
        
        if (this.savings.length === 0) {
            insights.innerHTML = `
                <div class="insight-item">
                    <i class="fas fa-lightbulb"></i>
                    <p>Start saving to see personalized insights!</p>
                </div>
            `;
            return;
        }

        const insightsList = [];

        // Savings rate insight
        const thisMonth = new Date();
        const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);
        const monthSavings = this.savings
            .filter(s => new Date(s.date) >= monthStart && s.amount > 0)
            .reduce((total, s) => total + s.amount, 0);

        if (monthSavings > 0) {
            insightsList.push({
                icon: 'fa-chart-line',
                text: `You've saved ₹${monthSavings.toLocaleString()} this month! Keep it up!`
            });
        }

        // Goal progress insight
        const activeGoals = this.goals.filter(g => !g.achieved);
        if (activeGoals.length > 0) {
            const avgProgress = activeGoals.reduce((sum, g) => sum + (g.savedAmount / g.amount), 0) / activeGoals.length * 100;
            insightsList.push({
                icon: 'fa-target',
                text: `Your average goal progress is ${Math.round(avgProgress)}%. You're doing great!`
            });
        }

        // Monthly target insight
        if (monthlyTarget > 0) {
            const targetProgress = (monthSavings / monthlyTarget) * 100;
            if (targetProgress >= 100) {
                insightsList.push({
                    icon: 'fa-trophy',
                    text: `🎉 You've exceeded your monthly target by ${Math.round(targetProgress - 100)}%!`
                });
            } else {
                const remaining = monthlyTarget - monthSavings;
                insightsList.push({
                    icon: 'fa-bullseye',
                    text: `Save ₹${remaining.toLocaleString()} more to reach your monthly target.`
                });
            }
        }

        // Emergency fund insight
        const emergencyGoal = this.goals.find(g => g.category === 'emergency' && !g.achieved);
        if (!emergencyGoal && totalSavings < 10000) {
            insightsList.push({
                icon: 'fa-shield-alt',
                text: `Consider creating an emergency fund goal. Aim for ₹10,000 as a starter.`
            });
        }

        insights.innerHTML = insightsList.map(insight => `
            <div class="insight-item">
                <i class="fas ${insight.icon}"></i>
                <p>${insight.text}</p>
            </div>
        `).join('') || `
            <div class="insight-item">
                <i class="fas fa-lightbulb"></i>
                <p>Keep saving to unlock more insights!</p>
            </div>
        `;
    }

    updateSavingsChart() {
        const ctx = document.getElementById('savingsChart');
        if (!ctx) return;

        // Prepare data for the last 6 months
        const months = [];
        const savingsData = [];
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('en', { month: 'short' });
            months.push(monthName);

            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            const monthSavings = this.savings
                .filter(s => {
                    const savingDate = new Date(s.date);
                    return savingDate >= date && savingDate <= monthEnd && s.amount > 0;
                })
                .reduce((total, s) => total + s.amount, 0);
            
            savingsData.push(monthSavings);
        }

        if (this.savingsChart) {
            this.savingsChart.destroy();
        }

        this.savingsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Monthly Savings',
                    data: savingsData,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    showAllocateModal(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        const totalSavings = this.getTotalSavings();
        const maxAllocation = Math.min(totalSavings, goal.amount - goal.savedAmount);
        
        if (maxAllocation <= 0) {
            this.showNotification('No available savings to allocate', 'error');
            return;
        }

        const amount = prompt(`Allocate money to "${goal.name}"\nAvailable: ₹${totalSavings.toLocaleString()}\nNeeded: ₹${(goal.amount - goal.savedAmount).toLocaleString()}\n\nEnter amount:`);
        
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
            this.allocateToGoal(goalId, parseFloat(amount));
        }
    }

    exportSavingsReport() {
        try {
            const { jsPDF } = window.jsPDF;
            if (!jsPDF) {
                this.exportSavingsAsText();
                return;
            }

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;
            let yPosition = 20;

            // Header
            doc.setFontSize(20);
            doc.setTextColor(34, 197, 94);
            doc.text('Budget Buddy - Savings Report', pageWidth / 2, yPosition, { align: 'center' });
            
            yPosition += 15;
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
            
            yPosition += 20;

            // Savings Overview
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text('Savings Overview', 20, yPosition);
            yPosition += 10;

            const totalSavings = this.getTotalSavings();
            const monthlyTarget = this.getMonthlyTarget();
            const goalsAchieved = this.getGoalsAchieved();

            doc.setFontSize(12);
            doc.text(`Total Savings: ₹${totalSavings.toLocaleString()}`, 20, yPosition);
            yPosition += 8;
            doc.text(`Monthly Target: ₹${monthlyTarget.toLocaleString()}`, 20, yPosition);
            yPosition += 8;
            doc.text(`Goals Achieved: ${goalsAchieved}`, 20, yPosition);
            yPosition += 15;

            // Goals Section
            if (this.goals.length > 0) {
                doc.setFontSize(16);
                doc.text('Savings Goals', 20, yPosition);
                yPosition += 10;

                this.goals.forEach(goal => {
                    if (yPosition > 250) {
                        doc.addPage();
                        yPosition = 20;
                    }

                    doc.setFontSize(12);
                    doc.setFont(undefined, 'bold');
                    doc.text(`${goal.name}`, 20, yPosition);
                    yPosition += 6;

                    doc.setFont(undefined, 'normal');
                    doc.text(`Target: ₹${goal.amount.toLocaleString()} | Saved: ₹${goal.savedAmount.toLocaleString()} | Progress: ${Math.round((goal.savedAmount / goal.amount) * 100)}%`, 20, yPosition);
                    yPosition += 6;

                    if (goal.achieved) {
                        doc.text(`Status: Achieved on ${new Date(goal.achievedDate).toLocaleDateString()}`, 20, yPosition);
                    } else {
                        const deadline = new Date(goal.deadline);
                        const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
                        doc.text(`Deadline: ${deadline.toLocaleDateString()} (${daysLeft} days left)`, 20, yPosition);
                    }
                    yPosition += 10;
                });
            }

            // Save PDF
            const fileName = `savings-report-${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            this.showNotification('Savings report exported as PDF!', 'success');

        } catch (error) {
            console.error('PDF export error:', error);
            this.exportSavingsAsText();
        }
    }

    exportSavingsAsText() {
        const totalSavings = this.getTotalSavings();
        const monthlyTarget = this.getMonthlyTarget();
        const goalsAchieved = this.getGoalsAchieved();

        let content = `BUDGET BUDDY - SAVINGS REPORT\n`;
        content += `Generated on: ${new Date().toLocaleDateString()}\n`;
        content += `${'='.repeat(50)}\n\n`;

        content += `SAVINGS OVERVIEW:\n`;
        content += `Total Savings: ₹${totalSavings.toLocaleString()}\n`;
        content += `Monthly Target: ₹${monthlyTarget.toLocaleString()}\n`;
        content += `Goals Achieved: ${goalsAchieved}\n\n`;

        if (this.goals.length > 0) {
            content += `SAVINGS GOALS:\n`;
            content += `${'='.repeat(50)}\n`;
            this.goals.forEach(goal => {
                content += `${goal.name}\n`;
                content += `  Target: ₹${goal.amount.toLocaleString()}\n`;
                content += `  Saved: ₹${goal.savedAmount.toLocaleString()}\n`;
                content += `  Progress: ${Math.round((goal.savedAmount / goal.amount) * 100)}%\n`;
                content += `  Status: ${goal.achieved ? `Achieved on ${new Date(goal.achievedDate).toLocaleDateString()}` : `Due ${new Date(goal.deadline).toLocaleDateString()}`}\n\n`;
            });
        }

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `savings-report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Savings report exported as text file!', 'success');
    }

    getCategoryIcon(category) {
        const icons = {
            emergency: '🚨',
            travel: '✈️',
            gadgets: '📱',
            education: '📚',
            health: '🏥',
            home: '🏠',
            other: '📦'
        };
        return icons[category] || '📦';
    }

    getCategoryName(category) {
        const names = {
            emergency: 'Emergency Fund',
            travel: 'Travel & Vacation',
            gadgets: 'Gadgets & Electronics',
            education: 'Education',
            health: 'Health & Fitness',
            home: 'Home & Living',
            other: 'Other'
        };
        return names[category] || 'Other';
    }

    getSavingsIcon(type) {
        const icons = {
            'Quick Save': 'fa-coins',
            'Custom Save': 'fa-piggy-bank',
            'Withdrawal': 'fa-money-bill-wave',
            'Goal Allocation': 'fa-bullseye',
            'Goal Deleted': 'fa-undo'
        };
        return icons[type] || 'fa-piggy-bank';
    }

    setDefaultGoalDate() {
        const dateInput = document.getElementById('goalDeadline');
        if (dateInput) {
            const defaultDate = new Date();
            defaultDate.setMonth(defaultDate.getMonth() + 3); // 3 months from now
            dateInput.value = defaultDate.toISOString().split('T')[0];
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 5000);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        });
    }

    saveData() {
        localStorage.setItem('budgetBuddySavings', JSON.stringify(this.savings));
        localStorage.setItem('budgetBuddyGoals', JSON.stringify(this.goals));
    }

    loadData() {
        // Data is already loaded in constructor
        this.updateSavingsChart();
    }

    // Budget Integration Methods
    getAvailableBalance() {
        // Try to get balance from expense manager
        if (window.expenseManager) {
            return window.expenseManager.getAvailableBalance();
        }
        
        // Fallback: get from localStorage
        const budget = JSON.parse(localStorage.getItem('budgetBuddyBudget')) || {};
        const expenses = JSON.parse(localStorage.getItem('budgetBuddyExpenses')) || [];
        
        const totalBudget = Object.values(budget).reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0);
        const totalExpenses = expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
        
        return Math.max(0, totalBudget - totalExpenses);
    }

    deductFromBudget(amount, description) {
        console.log('Deducting from budget:', amount, description);
        
        // Add as an expense in the expense manager
        const expense = {
            id: Date.now(),
            category: 'Savings',
            amount: amount,
            description: description,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };

        // Add to expenses
        const expenses = JSON.parse(localStorage.getItem('budgetBuddyExpenses')) || [];
        expenses.push(expense);
        localStorage.setItem('budgetBuddyExpenses', JSON.stringify(expenses));
        
        console.log('Added expense to localStorage:', expense);
        console.log('Total expenses now:', expenses.length);

        // Update expense manager if available
        if (window.expenseManager) {
            console.log('Updating expense manager UI');
            window.expenseManager.loadData();
        } else {
            console.log('Expense manager not found on window object');
            // Try to trigger a manual update after a short delay
            setTimeout(() => {
                if (window.expenseManager) {
                    console.log('Found expense manager after delay, updating...');
                    window.expenseManager.loadData();
                }
            }, 500);
        }
    }

    addToBudget(amount, description) {
        // Add as a budget increase or remove a corresponding expense
        const expense = {
            id: Date.now(),
            category: 'Savings Return',
            amount: -amount, // Negative expense (income)
            description: description,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };

        // Add to expenses as negative (income)
        const expenses = JSON.parse(localStorage.getItem('budgetBuddyExpenses')) || [];
        expenses.push(expense);
        localStorage.setItem('budgetBuddyExpenses', JSON.stringify(expenses));

        // Update expense manager if available
        if (window.expenseManager) {
            window.expenseManager.loadData();
        }
    }

    // Enhanced UI update to show available balance
    updateSavingsOverview() {
        const totalSavings = this.getTotalSavings();
        const monthlyTarget = this.getMonthlyTarget();
        const goalsAchieved = this.getGoalsAchieved();
        const availableBalance = this.getAvailableBalance();

        document.getElementById('totalSavings').textContent = `₹${totalSavings.toLocaleString()}`;
        document.getElementById('monthlyTarget').textContent = `₹${monthlyTarget.toLocaleString()}`;
        document.getElementById('goalsAchieved').textContent = goalsAchieved;

        // Update available balance displays
        const availableToSaveElement = document.getElementById('availableToSave');
        if (availableToSaveElement) {
            availableToSaveElement.textContent = `₹${availableBalance.toLocaleString()}`;
        }

        const availableBalanceElement = document.getElementById('availableBalance');
        if (availableBalanceElement) {
            availableBalanceElement.textContent = `₹${availableBalance.toLocaleString()}`;
        }

        // Update quick save button states based on available balance
        document.querySelectorAll('.quick-amount').forEach(btn => {
            const amount = parseInt(btn.dataset.amount);
            if (amount > availableBalance) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.title = `Insufficient balance (Available: ₹${availableBalance.toLocaleString()})`;
            } else {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.title = '';
            }
        });
    }
}

// Initialize Piggy Bank when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('piggy-bank')) {
        window.piggyBank = new PiggyBank();
    }
});

// Fallback initialization for piggy bank
window.addEventListener('load', function() {
    if (!window.piggyBank && document.getElementById('piggy-bank')) {
        console.log('Fallback: Initializing piggy bank on window load');
        window.piggyBank = new PiggyBank();
    }
});

// Debug function to test integration
window.testPiggyBankIntegration = function() {
    console.log('=== PIGGY BANK INTEGRATION TEST ===');
    
    // Check if piggy bank exists
    if (!window.piggyBank) {
        console.error('❌ Piggy Bank not initialized');
        return;
    }
    console.log('✅ Piggy Bank found');
    
    // Check if expense manager exists
    if (!window.expenseManager) {
        console.error('❌ Expense Manager not found');
        return;
    }
    console.log('✅ Expense Manager found');
    
    // Check available balance
    const balance = window.piggyBank.getAvailableBalance();
    console.log('💰 Available Balance:', balance);
    
    // Check budget data
    const budget = JSON.parse(localStorage.getItem('budgetBuddyBudget')) || {};
    const expenses = JSON.parse(localStorage.getItem('budgetBuddyExpenses')) || [];
    console.log('📊 Budget Data:', budget);
    console.log('💸 Expenses Count:', expenses.length);
    
    if (balance > 0) {
        console.log('✅ Integration should work - you have available balance');
    } else {
        console.log('⚠️ No available balance - set up budget first');
    }
    
    console.log('=== END TEST ===');
};

// Global function to reset all piggy bank data
window.resetPiggyBankData = function() {
    console.log('=== RESETTING ALL PIGGY BANK DATA ===');
    
    if (!window.piggyBank) {
        console.error('❌ Piggy Bank not found');
        return;
    }
    
    // Clear all savings and goals
    window.piggyBank.savings = [];
    window.piggyBank.goals = [];
    
    // Clear localStorage
    localStorage.removeItem('budgetBuddySavings');
    localStorage.removeItem('budgetBuddyGoals');
    
    // Update UI
    window.piggyBank.updateSavingsOverview();
    window.piggyBank.updateGoalsList();
    window.piggyBank.updateSavingsHistory();
    window.piggyBank.updateSavingsInsights();
    
    console.log('✅ All piggy bank data reset successfully');
    window.piggyBank.showNotification('All savings data reset successfully!', 'success');
    
    console.log('=== PIGGY BANK RESET COMPLETE ===');
};

// Global function to reset ALL Budget Buddy data
window.resetAllBudgetBuddyData = function() {
    console.log('🔄 RESETTING ALL BUDGET BUDDY DATA...');
    
    // Reset expense manager data
    if (typeof resetExpenseManagerData === 'function') {
        resetExpenseManagerData();
    }
    
    // Reset piggy bank data
    resetPiggyBankData();
    
    // Clear any other localStorage items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('budgetBuddy')) {
            keysToRemove.push(key);
        }
    }
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log('Removed:', key);
    });
    
    console.log('🎉 ALL BUDGET BUDDY DATA RESET COMPLETE!');
    alert('✅ All Budget Buddy data has been reset successfully!');
};
