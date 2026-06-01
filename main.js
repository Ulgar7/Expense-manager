import { renderCalendar } from "./ui/calendar.js";
import { renderAddForm, renderExpenses } from "./ui/render.js";
import { getExpensesPerDate, addExpense, removeExpense, getTotalPerDate, getTotalPerMonth, getCategorySummary, getWeeklySummary, getTopCategory, getHighestExpense, getDailyAverage, getHighestWeek, getMonthlyHistory, getComparisonData } from "./logic/expensesService.js"
import { renderSummary, renderSummaryNavigation, renderSummaryView, renderWeeklySummary, renderHistorySummary, renderComparisonSummary } from "./ui/renderSummary.js";
import { renderCharts } from "./ui/charts.js";
import { renderMonthYearPicker } from "./ui/monthYearPicker.js";


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

let comparisonA = { 

    month: visibleMonth,

    year: visibleYear
};

let comparisonB = {

    month: visibleMonth===0
    ?
    11
    :
    visibleMonth-1,

    year:
    visibleMonth===0
    ?
    visibleYear-1
    :
    visibleYear
}

function refreshUI() {

    const categorySummary = 
        getCategorySummary(visibleMonth, visibleYear);
    
    const topCategory = 
        getTopCategory(visibleMonth, visibleYear);    

    const highestExpense = 
        getHighestExpense(visibleMonth, visibleYear);

    const dailyAverage =
        getDailyAverage(visibleMonth, visibleYear);    

    const highestWeek = getHighestWeek(visibleMonth, visibleYear);

    const history = getMonthlyHistory(visibleMonth, visibleYear);

    const comparisonData = getComparisonData(

        comparisonA.month,
        comparisonA.year,

        comparisonB.month,
        comparisonB.year
    );
    

    console.log(history)

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
            dailyAverage,
            highestWeek
        });

    },
    
    (container) => {
        renderWeeklySummary(container,weeklySummary);
    },

    (container) => {
        renderHistorySummary(container, history);
    },
    (container) => {
        renderComparisonSummary(container, comparisonA, comparisonB, comparisonData, (newValue)=>{
            comparisonA = newValue;

            refreshUI();
        },

        (newValue)=>{
            comparisonB = newValue;

            refreshUI()
        }
    );
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


