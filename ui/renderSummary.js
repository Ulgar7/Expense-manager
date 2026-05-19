export function renderSummary(container, data) {
    const {
        total,
        monthlyTotal,
        categorySummary,
        topCategory,
        highestExpense,
        dailyAverage
    } = data

    container.innerHTML = `
        <p>Total del día: $${total}</p>
        <p>Total del mes: $${monthlyTotal}</p>
    `

    Object.entries(categorySummary).forEach(
        ([category, total]) => {

            const percentage = 
            ((total / monthlyTotal) * 100)
            .toFixed(1)

            container.innerHTML += `
                <p>
                    ${category}:
                    $${total}
                    (${percentage}%)
                </p>
            `
        }
    )

    container.innerHTML += `
        <p>
            Categoría dominante:
            ${topCategory.category}
            ($${topCategory.amount})
        </p>
    `

    if(highestExpense) {
        container.innerHTML += `
        <p>
            Gasto más alto:
            ${highestExpense.type}
            ($${highestExpense.amount})
        </p>    
        `
    }

    container.innerHTML += `
        <p>
            Promedio diario:
            $${dailyAverage}
        </p>
    `
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
            console.log(view)
        }
    )

    container.appendChild(btn)

    })
}

export function renderSummaryView(container, currentView, renderMonthly) {
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

    container.innerHTML = `
        <h2>
            ${currentView}
            summary
        </h2>
    `
}