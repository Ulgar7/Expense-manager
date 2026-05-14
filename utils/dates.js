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
        "Noviembre",
        "Diciembre"
    ];
    return months[month]
}