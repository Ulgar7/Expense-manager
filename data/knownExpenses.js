const savedKnownExpenses = localStorage.getItem("knownExpenses");

export let knownExpenses = savedKnownExpenses 
?
JSON.parse(savedKnownExpenses):
{};

export function saveKnownExpenses() {

    localeStorage.setItem("knownExpenses", JSON.stringify(knownExpenses));
}

export function addKnownExpense(name, category){

    knownExenses[name] = {
        category
    };

    saveKnownExpenses();
}