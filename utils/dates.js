export function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate()
}

export function formatDate(year, month, day){
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    
}

export function getMonthName(month) {
    const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ];
    return months[month]
}

export function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay()
}

export function getWeeksRanges(year, month) {
    const weeks = [];

    const lastDay = new Date(year, month + 1, 0);

    let start = new Date(year,month, 1);

    while(start <= lastDay) {
        let end = new Date(start);

        if(weeks.length === 0) {
            while(end.getDay() !== 0 && end < lastDay){
                end.setDate(end.getDate()+1);
            }
        }

        else{
            end.setDate(start.getDate()+6);

            if(end > lastDay) {
                end = new Date(lastDay);
            }
        }
        weeks.push({
            start: new Date(start),
            
            end: new Date(end)
        });

        start = new Date(end);

        start.setDate(start.getDate()+1);
    }
    return weeks

}

