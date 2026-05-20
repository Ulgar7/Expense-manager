import { expenses } from "../data/expenses.js";
import { expenseTypes } from "../data/expensesType.js";
import { getWeekOfMonth } from "../utils/dates.js";

export function getExpensesPerDate(date) {
    return expenses.filter(e => e.date === date);
}


export function addExpense({type, amount, date}) {
    const expenseInfo = expenseTypes[type]
    const newExpense = {
        id: crypto.randomUUID(),
        type,
        category: expenseInfo?.category || "others",
        amount: Number(amount),
        date
    };
    expenses.push(newExpense)
    saveExpenses()
}

export function removeExpense(id) {
    const index = expenses.findIndex(e => e.id === id);

    if(index !== -1) {
        expenses.splice(index, 1)
        saveExpenses();
    }
}

export function getTotalPerDate(date) {
    const dayExpenses = getExpensesPerDate(date)

    return dayExpenses.reduce((total, expense) => {
        return total + expense.amount;
    }, 0);
}

function saveExpenses () { 
    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    )
}

export function getTotalByDate(date) {
    return expenses
        .filter( e => e.date === date)
        .reduce((total, e) => total + e.amount, 0);
}

export function getExpensesPerMonth(month, year) {
    return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);

        return (
            expenseDate.getMonth() === month &&
            expenseDate.getFullYear() === year
        )
    })
}

export function getTotalPerMonth(month, year) {
    const monthExpenses = 
        getExpensesPerMonth(month, year)

        return monthExpenses.reduce((total, expense) => {
            return total + expense.amount;
        }, 0)
}

export function getCategorySummary(month, year){
    const monthExpenses = 
        getExpensesPerMonth(month, year);

    const summary = {}
    
    monthExpenses.forEach(expense => {
        const category = expense.category;

        if(!summary[category]) {
            summary[category] = 0;
        }

        summary[category] += expense.amount
    });

    return summary;
}

export function getTopCategory(month, year) {
    const summary = getCategorySummary(month, year);

    let topCategory = null
    let topAmount = 0

    for ( const category in summary) {
        if (summary[category] > topAmount) {
            topAmount = summary[category]
            topCategory = category
        }
    }

    return { 
        category: topCategory,
        amount: topAmount
    };
}

export function getHighestExpense(month, year) {
    const monthExpenses = getExpensesPerMonth(month,year);

    if(monthExpenses.length === 0) {
        return null;
    }

    let highestExpense = monthExpenses[0];

    monthExpenses.forEach(expense => {
        if(expense.amount > highestExpense.amount) {
            highestExpense = expense;
        }
    });

    return highestExpense;
}

export function getDailyAverage(month,year) {
    const monthExpenses = 
        getExpensesPerMonth(month, year);

    if(monthExpenses.length === 0) {
        return 0;
    }
    
    const total = 
        getTotalPerMonth(month, year);

        const uniqueDays = new  Set(
            monthExpenses.map(expense => expense.date)
        );

        return Math.round(
            total / uniqueDays.size
        )
}

export function getWeeklySummary(month, year) {
    const monthExpenses = getExpensesPerMonth(month, year)

    const weeks = {};

    monthExpenses.forEach( expense => {
        const date = new Date(expense.date);

        const week = getWeekOfMonth(date);

        if(!weeks[week]) {
            weeks[week] = {
                total:0,
                expenses:[]
            };
        }
        weeks[week]
        .total
        +=
        expense.amount;

        weeks[week]
        .expenses
        .push(expense);
    })

    return weeks;

}