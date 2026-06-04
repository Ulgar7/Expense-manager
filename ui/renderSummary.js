import { getMonthName } from "../utils/dates.js";
import { renderMonthYearPicker} from "./monthYearPicker.js"

function formatDate(date) {

    return date.toLocaleDateString("es-AR", {
        day:"numeric",
        month:"short"
    }
    );
}

export function renderSummary(container, data) {
    const {
        monthlyTotal,
        categorySummary,
        topCategory,
        highestExpense,
        dailyAverage, 
        highestWeek
    } = data

    container.innerHTML = `
        <p>Total del mes: $${monthlyTotal}</p>
    `

    

    const  categoriesBtn = document.createElement("button");
    categoriesBtn.textContent = "▶ Categories";

    const categories = document.createElement("div");
    categories.style.display = "none";

    Object.entries(categorySummary).forEach(([category,total]) =>{

        const percentage = ((total/monthlyTotal) * 100).toFixed(1);

        const row = document.createElement("p");
        row.textContent= `
            ${category}
            :
            $${total}
            (${percentage}%)
        `;

        categories.appendChild(row);
    });

    categoriesBtn.addEventListener("click", ()=> {

        const open = categories.style.display === "block";

        categories.style.display = open ? "none" : "block";

        categoriesBtn.textContent = open ? "▶ Categories" : "▼ Categories";
    });

    container.append(categoriesBtn, categories)



    const dominant = document.createElement("p");

    dominant.textContent = `
        Categoria dominante:
        ${topCategory.category}
        ($${topCategory.amount})
    `;

    container.appendChild(dominant)

    if(highestExpense) {
        const highest = document.createElement("p");
        highest.textContent = `
            Gasto más alto:
            ${highestExpense.type}
            ($${highestExpense.amount})
        `;
        container.appendChild(highest)
    }


    const average = document.createElement("p");
    average.textContent = `
        Promedio diario:
        $${dailyAverage}
    `;

    container.appendChild(average)

    if(highestWeek){

        const week = document.createElement("p");
        week.textContent = `
            Semana más cara:

            Week
            ${highestWeek.week}

            (${highestWeek.total})
        `;

        container.appendChild(week);
    }

}

export function renderSummaryNavigation(container, currentView, onChange) {

    const views = [
        "weekly",
        "monthly",
        "yearly", 
        "comparison",
        "history"
    ]

    container.innerHTML = "";

    views.forEach( view => {

        const btn = document.createElement("button");

        btn.textContent = view;

        btn.addEventListener("click", () => {
            onChange(view)
        }
    )

    container.appendChild(btn)

    })
}

export function renderSummaryView(container, currentView, renderMonthly, renderWeekly, renderHistory, renderComparison, renderYearly) {
    container.innerHTML = ""

    if(currentView === "monthly") {

        container.innerHTML = `
            <h2>Resumen</h2>

            <div id="total"></div>
        `

        const totalEl = container.querySelector("#total")

        renderMonthly(totalEl)

        return;
        
    }

    if(currentView === "weekly") {
                container.innerHTML = `
                    <div id="weekly-summary">
    
                    </div>
                `;
    
                const weeklyEl = container.querySelector("#weekly-summary");
    
                renderWeekly(weeklyEl);
    
                return;
            }

    if(currentView === "history") {

        container.innerHTML = `
            <div id="history-summary">
            </div>
        `;

        const historyEl = container.querySelector("#history-summary");

        renderHistory(historyEl);

        return;
    }

    if(currentView === "comparison") {

        container.innerHTML = `
            <div id="comparison-summary">
            </div>
        `;

        const comparisonEl = container.querySelector("#comparison-summary");

        renderComparison(comparisonEl);

        return;
    }

    if(currentView === "yearly") {

        container.innerHTML = `
            <div id="yearly-summary">
            </div>
        `;

        const yearlyEl = container.querySelector("#yearly-summary");

        renderYearly(yearlyEl);

        return;
    }

    container.innerHTML = `
        <h2>
            ${currentView}
            summary
        </h2>
    `
}

export function renderWeeklySummary(container, weeklyData){

    container.innerHTML = `
        <h2>
            Weekly Summary
        </h2>
    `

    Object.entries(weeklyData).forEach(([week,data]) => {

        const section = document.createElement("div")

        const header = document.createElement("button");

        header.textContent = `
            ▶ Week ${week}
            (${data.expenses.length});
        `

        const total = document.createElement("p")

        total.textContent = `
            Total: $${data.total}
        `

        const range = document.createElement("p");

        range.textContent = `
            ${formatDate(data.start)}
            →
            ${formatDate(data.end)}
        `

        const details = document.createElement("div");
        details.style.display = "none";

        data.expenses.forEach(expense=>{
            const row = document.createElement("p")

            row.textContent= `
                ${expense.type} - $${expense.amount};
            `

            details.appendChild(row)

        })
        header.addEventListener("click", ()=> {
                const open = details.style.display === "block";

                details.style.display = open
                ? "none" : "block"

                header.textContent = open ?

                `
                    ▶ Week ${week}`

                    :

                `    ▼ Week ${week}
                `
            })

        section.append(range ,header,total, details);

        container.appendChild(section)
    });
};

export function renderHistorySummary(container, historyData) {
    container.innerHTML = `
        <h2>
        History
        </h2>
    `;

    Object.entries(historyData) .reverse()
    .forEach(([date, data])=>{

        const section = document.createElement("div");

        const header = document.createElement("button");

        header.textContent = `
            ▶ ${formatDate(new Date(date))}
            (${data.expenses.length})
        `;
        
        const total = document.createElement("p");

        total.textContent = `
            Total: $${data.total}
        `;

        const details = document.createElement("div");

        details.style.display = "none";

        data.expenses.forEach(expense=>{
            const row = document.createElement("p");

            row.textContent = `
                ${expense.type}
                - $${expense.amount}
            `;

            details.appendChild(row);
        });

        header.addEventListener("click", ()=>{
            const open = details.style.display === "block";

            details.style.display = open
            ?
            "none"
            : 
            "block";

            header.textContent = open
            ?

            `
                ▶ ${date}
                (${data.expenses.length})
            `
            :

            `
                ▼ ${date}
                (${data.expenses.length})
            `;
        }
    );

    section.append(header,total,details);

    container.appendChild(section)
    });
}

export function renderComparisonSummary(container, comparisonA, comparisonB, comparisonData, onChangeA, onChangeB) {

    container.innerHTML = `
        <h2>
        Comparison
        </h2>

        <div id="comparison-controls">

        <div id="month-a">
        
        </div>

        <p>
        VS
        </p>

        <div id="month-b">

        </div>

        </div>

        <section id="comparison-results">
        
        <p>
        Select months to compare
        </p>
        
        </section>
    `;

    const monthAEL = container.querySelector("#month-a");

    const monthBEL = container.querySelector("#month-b");

    renderMonthYearPicker(monthAEL, comparisonA.month, comparisonA.year, onChangeA);

    renderMonthYearPicker(monthBEL, comparisonB.month, comparisonB.year, onChangeB)
    
    const results = container.querySelector("#comparison-results");

    results.innerHTML = "";

    
        const table = document.createElement("table");

        table.innerHTML = `
            <tr>
            
            <th>
            Category
            </th>

            <th>
            ${getMonthName(comparisonA.month)}
            </th>

            <th>
            ${getMonthName(comparisonB.month)}
            </th>

            <th>
            Difference
            </th>

            </tr>
        `

        comparisonData.categories.forEach(item=>{
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                ${item.category}
                </td>

                <td>
                $${item.amountA}
                </td>

                <td>
                $${item.amountB}
                </td>

                <td>
                $${item.difference}
                </td>
            `;

            table.appendChild(row)
        })
        

        results.appendChild(table);



    const totalsTable = document.createElement("table");

    totalsTable.innerHTML = `
        <tr>
        
        <th>
        ${getMonthName(comparisonA.month)}
        ${comparisonA.year}
        </th>

        <th>
        ${getMonthName(comparisonB.month)}
        ${comparisonB.year}
        </th>

        <th>
        Difference:
        </th>

        </tr>
    `;

    const totalRow = document.createElement("tr");

    totalRow.innerHTML = `
        <td>
        $${comparisonData.totalA}
        </td>

        <td>
        $${comparisonData.totalB}
        </td>

        <td>
        $${comparisonData.totalDifference}
        </td>
    `;

    totalsTable.appendChild(totalRow);

    results.appendChild(totalsTable);

}

export function renderYearlySummary(container,year, yearlyData, onChangeYear) {

    container.innerHTML = `
        <h2>
        Yearly summary
        </h2>

        <div id="year-picker">

        </div>

        <section id="yearly-results">
        
        <p>
        Select year
        </p>

        </section>
    `;

    const picker = container.querySelector("#year-picker");

    renderMonthYearPicker(picker, 0, year, onChangeYear, false)

    const results = container.querySelector("#yearly-results");

    results.innerHTML = `
        <p>
        Yearly total:

        $${yearlyData.yearlyTotal}
        </p>

        <p>
        Highest Month:

        ${getMonthName(yearlyData.highestMonth.month)}

        ($${yearlyData.highestMonth.total})
        </p>

        <p>
        Lowest Month:

        ${getMonthName(yearlyData.lowestMonth.month)}

        ($${yearlyData.lowestMonth.total})
        </p>

        <p>
        Monthly Average: 

        $${yearlyData.monthlyAverage}
        </p>
    `;

    const categoriesBtn = document.createElement("button");

    categoriesBtn.textContent = "▶ Categories";

    const categories = document.createElement("div");

    categories.style.display = "none";

    Object.entries(yearlyData.yearlyCategories)
    .forEach(([category,total])=>{

        const row = document.createElement("p");

        const percentage = (total / yearlyData.yearlyTotal * 100).toFixed(1);

        row.textContent = `
            ${category}

            :

            $${total}

            (${percentage}%)
        `;

        categories.appendChild(row);
    }
);

categoriesBtn.addEventListener("click", ()=>{

    const open = categories.style.display === "block";

    categories.style.display = open
    ?
    "none"
    :
    "block";

    categoriesBtn.textContent = open
    ?
    "▶ Categories"
    : 
    "▼ Categories"
}
);

results.append(categoriesBtn, categories);

const monthlyTable = document.createElement("table");

monthlyTable.innerHTML = `
    <tr>
    
    <th>
    Month
    </th>

    <th>
    Total
    </th>

    </tr>
`;

yearlyData.monthlyTotals.forEach(item=>{

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>
        
        ${getMonthName(item.month)}
        
        </td>

        <td>
        
        $${item.total}

        </td>
    `;

    monthlyTable.appendChild(row);
});

results.appendChild(monthlyTable)
}