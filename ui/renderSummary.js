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