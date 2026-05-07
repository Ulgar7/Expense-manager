export function renderExpenses(list, container, onDelete) {
    container.innerHTML = "";

    list.forEach(expense => {
        const li = document.createElement("li");
        li.textContent = `${expense.type} - $${expense.amount}`;
        const btnDelete = document.createElement("button")
        btnDelete.textContent = "X"

        btnDelete.addEventListener("click", () => {
            onDelete(expense.id)
        })
        

        li.appendChild(btnDelete)
        container.appendChild(li);
    });
}

export function renderAddForm(container, onSubmit, onCancel) {
    container.innerHTML = "";

    

    const inputType = document.createElement("input")
    inputType.placeholder = "Tipo"

    const inputAmount = document.createElement("input")
    inputAmount.type = "number"
    inputAmount.placeholder = "Monto"

    const btnCancel = document.createElement("button")
    btnCancel.textContent = "Cancelar"

    const btnConfirm = document.createElement("button")
    btnConfirm.textContent = "Confirmar"

    btnConfirm.addEventListener( "click", () => {
        const type = inputType.value;
        const amount = inputAmount.value;

        if(!type || !amount) return;

        const normalizedType = type.trim().toLowerCase();

        onSubmit({ type:normalizedType, amount});

        
    });

    btnCancel.addEventListener("click", () => {
        onCancel()
    })

    
    container.append(inputType, inputAmount, btnConfirm, btnCancel)
}