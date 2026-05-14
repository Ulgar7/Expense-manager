import { getTotalByDate } from "../logic/expensesService.js";
import { getDaysInMonth, formatDate } from "../utils/dates.js";

export function renderCalendar(container, activeDate,visibleMonth, visibleYear ,onSelect){
    container.innerHTML = "";

    const days = getDaysInMonth(visibleYear, visibleMonth)

    for( let i = 1; i <= days; i++){
        const day = document.createElement("div");
        
        const date = formatDate(visibleYear, visibleMonth, i)

        const total = getTotalByDate(date)

        day.textContent = i;

        day.innerHTML = `
        <span>${i}</span>
        <small>$${total}</small>
        `

        if (date === activeDate) {
            day.classList.add("active-day")
        }

        day.addEventListener("click", () => {
            onSelect(date)            
        });


        container.appendChild(day)
        
    }

}


