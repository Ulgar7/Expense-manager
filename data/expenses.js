const savedExpenses = localStorage.getItem("expenses");

export let expenses = savedExpenses ? JSON.parse(savedExpenses) : []

