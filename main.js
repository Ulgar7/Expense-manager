import { renderCalendar } from "./ui/calendar.js";
import { renderAddForm, renderExpenses } from "./ui/render.js";
import { getExpensesPerDate, addExpense, removeExpense, getTotalPerDate, getTotalPerMonth, getCategorySummary, getTopCategory, getHighestExpense, getDailyAverage } from "./logic/expensesService.js"


export let visibleMonth = new Date().getMonth()
export let visibleYear = new Date().getFullYear();

export let activeDate = new Date().toISOString().split("T")[0];

const calendarEl = document.getElementById("calendar");
const listEl = document.getElementById("list-expenses");
const totalEl = document.getElementById("total")

function refreshUI() {

    const categorySummary = 
        getCategorySummary(visibleMonth, visibleYear);
    
    const topCategory = 
        getTopCategory(visibleMonth, visibleYear);    

    const highestExpense = 
        getHighestExpense(visibleMonth, visibleYear);

    const dailyAverage =
        getDailyAverage(visibleMonth, visibleYear);    

    renderCalendar(calendarEl, activeDate, visibleMonth, visibleYear, (newDate) => {
        activeDate = newDate;
        refreshUI()
    },

    () => {
        visibleMonth--;

        if(visibleMonth < 0) {
            visibleMonth = 11;
            visibleYear--;
        }
        refreshUI()
    },

    () => {
        visibleMonth++;

        if(visibleMonth > 11) {
            visibleMonth = 0;
            visibleYear++
        }

        refreshUI();
    }

    );

    const dayExpenses = getExpensesPerDate(activeDate);
    renderExpenses(dayExpenses, listEl, (id) =>{
        removeExpense(id);
        refreshUI()
    });

    const  total = getTotalPerDate(activeDate);

    

    const monthlyTotal = getTotalPerMonth(visibleMonth, visibleYear)

    totalEl.innerHTML = `
        <p>Total del día: $${total}</p>
        <p>Total del mes: $${monthlyTotal}</p>
    `
    Object.entries(categorySummary).forEach(
        ([category, total]) => {

            const percentage = 
            ((total / monthlyTotal) * 100)
            .toFixed(1);

            totalEl.innerHTML += `
                <p>
                    ${category}:
                    $${total}
                    (${percentage}%)
                </p>
            `
        }
    )

    totalEl.innerHTML += `
        <p>
            Categoría dominante:
            ${topCategory.category}
            ($${topCategory.amount})
        </p>
    `

    if(highestExpense){
        totalEl.innerHTML += `
        <p>
            Gasto más alto:
            ${highestExpense.type}
            ($${highestExpense.amount})
        </p>
    `
    }

    totalEl.innerHTML += `
        <p>
            Promedio diario:
            $${dailyAverage}
        </p>
    `
    
    
}


refreshUI();






const actionsEl = document.getElementById( "actions")

function renderAddButton() {
    actionsEl.innerHTML = "";

    const btn = document.createElement("button")
    btn.textContent = "Agregar Gasto";
    btn.classList.add("btn-add")

    btn.addEventListener("click", () => {
        renderForm()
    });
    actionsEl.appendChild(btn)
}

function renderForm() {
    renderAddForm(
        actionsEl,

        ({type, amount}) => {
            addExpense({
                type,
                amount,
                date:activeDate
            });

            refreshUI()
            renderAddButton()
        },

        () => {
            renderAddButton()
        }
    )
}

renderAddButton()
