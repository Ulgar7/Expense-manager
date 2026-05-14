import { getTotalByDate } from "../logic/expensesService.js";
import { getDaysInMonth, formatDate, getMonthName} from "../utils/dates.js";

export function renderCalendar(container, activeDate,visibleMonth, visibleYear ,onSelect, onPrevMonth, onNextMonth){
    container.innerHTML = "";

    const header = document.createElement("div");
    header.classList.add("calendar-header")

    const prevBtn = document.createElement("button")
    prevBtn.textContent = "<"

    const title = document.createElement("h2")
    title.textContent = `
    ${getMonthName(visibleMonth)} ${visibleYear}`

    const nextBtn = document.createElement("button")
    nextBtn.textContent = ">"

    prevBtn.addEventListener("click", onPrevMonth)
    nextBtn.addEventListener("click", onNextMonth)

    header.append(prevBtn, title, nextBtn)
    
    container.appendChild(header);

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


