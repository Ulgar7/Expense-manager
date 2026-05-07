import { renderCalendar } from "./ui/calendar.js";
import { renderAddForm, renderExpenses } from "./ui/render.js";
import { getExpensesPerDate, addExpense, removeExpense, getTotalPerDate } from "./logic/expensesService.js"


export let activeDate = new Date().toISOString().split("T")[0];

const calendarEl = document.getElementById("calendar");
const listEl = document.getElementById("list-expenses");
const totalEl = document.getElementById("total")

function refreshUI() {
    renderCalendar(calendarEl, activeDate, (newDate) => {
        activeDate = newDate;
        refreshUI();
    });

    const dayExpenses = getExpensesPerDate(activeDate);
    renderExpenses(dayExpenses, listEl, (id) =>{
        removeExpense(id);
        refreshUI()
    });

    const  total = getTotalPerDate(activeDate);

    totalEl.textContent = `Total del día: $${total}`
    
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
