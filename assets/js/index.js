
function updateDashboard() {

    // Get saved transactions
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    let totalIncome = 0;
    let totalExpenses = 0;
    let bankBalance = 0;
    let cashBalance = 0;

    // Calculate balances
    transactions.forEach(transaction => {

        const amount = Number(transaction.amount);

        if (transaction.type === "income") {
            totalIncome += amount;

            if (transaction.paymentMethod === "Bank") {
                bankBalance += amount;
            } else if (transaction.paymentMethod === "Cash") {
                cashBalance += amount;
            }

        } else if (transaction.type === "expense") {
            totalExpenses += amount;

            if (transaction.paymentMethod === "Bank") {
                bankBalance -= amount;
            } else if (transaction.paymentMethod === "Cash") {
                cashBalance -= amount;
            }
        }

    });

    // Calculate remaining balance
    const totalBalance = totalIncome - totalExpenses;

    // Format Philippine Peso
    const formatPeso = amount => {
        return amount.toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP"
        });
    };

    // Update dashboard values
    document.getElementById("balance").textContent = formatPeso(totalBalance);
    document.getElementById("bankBalance").textContent = formatPeso(bankBalance);
    document.getElementById("cashBalance").textContent = formatPeso(cashBalance);
    document.getElementById("income").textContent = formatPeso(totalIncome);
    document.getElementById("expenses").textContent = formatPeso(totalExpenses);
}

// Run dashboard calculation
updateDashboard();
