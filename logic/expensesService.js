import { expenses } from "../data/expenses.js";
import { expenseTypes } from "../data/expensesType.js";
import { getWeeksRanges } from "../utils/dates.js";

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

export function getWeeklySummary(month,year) {

    const ranges = getWeeksRanges(year,month);

    const weeklySummary = {};

    ranges.forEach((range,index)=> {
        const weekExpenses = expenses.filter(expense=>{
            const [year, month, day] =  expense.date
            .split("-")
            .map(Number);

            const date = new Date(year, month-1, day);

            return (date >= range.start && date <= range.end);
        });

        weeklySummary[index+1] = {
            total: weekExpenses.reduce((sum, expense)=> 
            sum + expense.amount, 0),
            
            expenses: weekExpenses, 
            start: range.start, 
            end: range.end
        };
    });
    return weeklySummary;
}

export function getHighestWeek(month, year) {

    const weekly = getWeeklySummary(month,year);

    let highest = null;

    Object.entries(weekly).forEach(([week,data])=>{
        if(!highest || data.total > highest.total) {
            highest = {
                week,
                total:
                data.total
            };
        }
    }
);
return highest;
}

export function getMonthlyHistory(month, year) {
    const monthExpenses = getExpensesPerMonth(month,year);

    const history  = {};

    monthExpenses.forEach(expense=>{
        if(!history[expense.date]){
            history[expense.date]={total:0, expenses:[]}
        };
        history[expense.date].total += expense.amount;
        history[expense.date].expenses.push(expense);
    });
    return history;
}

export function getComparisonData(monthA, yearA, monthB, yearB) {

    const categoriesA = getCategorySummary(monthA, yearA);

    const categoriesB = getCategorySummary(monthB, yearB);

    const allCategories = new Set([...Object.keys(categoriesA), 
        ...Object.keys(categoriesB)
    ]);

    const comparison = [];

    allCategories.forEach(category=>{
        
        const amountA  = categoriesA[category] || 0;

        const  amountB = categoriesB[category] || 0;

        comparison.push({
            category,
            amountA,
            amountB,
            difference:

            amountA
            -
            amountB
        });
    });

    const totalA = getTotalPerMonth(monthA, yearA);

    const totalB = getTotalPerMonth(monthB, yearB);

    return{
        categories: comparison,

        totalA,

        totalB, 

        totalDifference:

        totalA-totalB
    };
}

export function getYearlySummary(year) {
    
    const monthlyTotals = [];

    
    
    for(let month=0; month<12; month++) {
        
        const total = getTotalPerMonth(month,year);
        
        monthlyTotals.push({month, total});
    }
    
    const activeMonths = monthlyTotals.filter(month=> month.total>0);
    
    const yearlyTotal = monthlyTotals.reduce((sum,item)=>
        sum+
        item.total,
        0
        );

        const highestMonth = monthlyTotals.reduce((highest,current)=>{

            if(!highest || current.total>highest.total) {

                return current;
            }

            return highest;
        },
        null
        );

        const lowestMonth = activeMonths.reduce((lowest,current)=> {

            if(!lowest || current.total<lowest.total) {

                return current;
            }
            return lowest;
        },
        null
        );

        const yearlyCategories = {}

        for(let month=0; month<12; month++) {

            const summary = getCategorySummary(month,year);

            Object.entries(summary).forEach(([category,total])=>{

                if(!yearlyCategories[category]) {

                    yearlyCategories[category] = 0;
                }

                yearlyCategories[category] += total;
            }
        );
        }

        

        const monthlyAverage = activeMonths.length === 0
        ?
        0
        :
        Math.round(yearlyTotal / activeMonths.length);

        return{yearlyTotal, highestMonth, lowestMonth, monthlyTotals, yearlyCategories, monthlyAverage};
}