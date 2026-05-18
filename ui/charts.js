export function renderCharts(container, categorySummary, monthlyTotal){

    container.innerHTML = ""

    Object.entries(categorySummary).forEach(
        ([category, amount]) => {
            const percentage = (amount / monthlyTotal) * 100;

            const chartItem = document.createElement("div");

            chartItem.classList.add("chart-item")

            const label = document.createElement("p")

            label.textContent = `
                ${category} (${percentage.toFixed(1)}%)
            `
            const bar = document.createElement("div")

            const track = document.createElement("div")

            track.classList.add("chart-track")

            track.appendChild(bar)


            bar.classList.add("chart-bar")

            bar.style.width = `${percentage}%`

            chartItem.append(label, track);

            container.appendChild(chartItem);
        }
    )
}