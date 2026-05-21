import { renderCalendar } from "./ui/calendar.js";
import { renderAddForm, renderExpenses } from "./ui/render.js";
import { getExpensesPerDate, addExpense, removeExpense, getTotalPerDate, getTotalPerMonth, getCategorySummary, getTopCategory, getHighestExpense, getDailyAverage } from "./logic/expensesService.js"
import { renderSummary, renderSummaryNavigation, renderSummaryView, renderWeeklySummary } from "./ui/renderSummary.js";
import { renderCharts } from "./ui/charts.js";
import { getWeeklySummary } from "./logic/expensesService.js";

let currentSection = "home";
let currentSummaryView = "weekly";

const homeSection = document.getElementById("home-section");
const statisticsSection = document.getElementById("statistics-section");
const summariesSection = document.getElementById("summaries-section");

const summariesNav = document.getElementById("summaries-navigation");
const summariesEl = document.getElementById("summary")


const btnHome = document.getElementById("btn-home");
const btnStatistics = document.getElementById("btn-statistics");
const btnSummaries = document.getElementById("btn-summaries");

const chartsEl = document.getElementById("charts");



function renderSections() {

    homeSection.style.display = 
        currentSection === "home"
        ? "block"
        : "none";

    statisticsSection.style.display = 
        currentSection === "statistics"
        ? "block"
        : "none";

    summariesSection.style.display =
        currentSection === "summaries"
        ? "block"
        : "none";
}

btnHome.addEventListener("click", () => {
    currentSection = "home"
    renderSections();
});

btnStatistics.addEventListener("click", () => {
    currentSection = "statistics";
    renderSections();
});

btnSummaries.addEventListener("click", () => {
    currentSection = "summaries"
    renderSections();
})



export let visibleMonth = new Date().getMonth();
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

    console.log(getWeeklySummary(
        visibleMonth,
        visibleYear
    ))



    renderSummaryNavigation(summariesNav, currentSummaryView, (newView) => {
        currentSummaryView = newView;

        refreshUI()
    })
    
    const weeklySummary = getWeeklySummary(visibleMonth, visibleYear);
    
    renderSummaryView(summariesEl, currentSummaryView, (container) => {
        renderSummary(container, {
            total,
            monthlyTotal,
            categorySummary,
            topCategory,
            highestExpense,
            dailyAverage
        });

    },
    
    (container) => {
        renderWeeklySummary(container,weeklySummary);
    }
    )

    renderCharts(chartsEl, categorySummary, monthlyTotal);
    
    renderSections();
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


