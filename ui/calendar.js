

export function renderCalendar(container, activeDate, onSelect){
    container.innerHTML = "";

    for( let i = 1; i <= 30; i++){
        const day = document.createElement("div");
        
        const date = `2026-05-${String(i).padStart(2, "0")}`;

        day.textContent = i;

        if (date === activeDate) {
            day.classList.add("active-day")
        }

        day.addEventListener("click", () => {
            onSelect(date)            
        });


        container.appendChild(day)
        
    }

}


