import { expenses } from "../data/expenses.js";
import { expenseTypes } from "../data/expensesType.js";

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