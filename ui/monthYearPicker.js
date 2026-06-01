import { getMonthName } from "../utils/dates.js";

export function renderMonthYearPicker(container, month, year, onChange) {

    container.innerHTML = "";

    const monthSelect = document.createElement("select");

    for(let i=0; i<12; i++){

        const option = document.createElement("option");

        option.value = i;

        option.textContent = getMonthName(i);

        if(i === month){

            option.selected = true;
        }
        
        monthSelect.appendChild(option);
    }

    const yearSelect = document.createElement("select");

    for(let i = year-5; i<=year+5; i++) {

        const option = document.createElement("option");

        option.value = i;

        option.textContent = i;

        if(i === year) {

            option.selected = true;
        }

        yearSelect.appendChild(option);
    }

    function emit() {

        onChange({

            month: Number(monthSelect.value),

            year: Number(yearSelect.value)
        });

    }

    monthSelect.addEventListener("change", emit);

    yearSelect.addEventListener( "change", emit);

    container.append(monthSelect,yearSelect);
}