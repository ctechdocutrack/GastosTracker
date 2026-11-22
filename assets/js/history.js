
// Get HTML elements
const searchInput = document.getElementById("searchTransaction");
const filterType = document.getElementById("filterType");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const resetButton = document.getElementById("resetFilters");
const transactionCount = document.getElementById("transactionCount");
const transactionTable = document.querySelector(".history-table tbody");


// Format Philippine Peso
function formatPeso(amount) {
    return Number(amount).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP"
    });
}


// Format date and time
function formatDate(dateValue) {
    const date = new Date(dateValue);

    return date.toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}


// Display transactions
function displayTransactions() {

    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    const searchValue = searchInput.value.toLowerCase().trim();
    const typeValue = filterType.value;
    const fromValue = startDate.value;
    const toValue = endDate.value;

    const filteredTransactions = transactions
        .filter(transaction => {

            const matchesSearch = transaction.description
                .toLowerCase()
                .includes(searchValue);

            const matchesType = !typeValue || transaction.type === typeValue;

            const transactionDate = transaction.date.slice(0, 10);

            const matchesStartDate = !fromValue || transactionDate >= fromValue;
            const matchesEndDate = !toValue || transactionDate <= toValue;

            return matchesSearch && matchesType && matchesStartDate && matchesEndDate;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));


    // Update transaction count
    transactionCount.innerHTML = `
        <i class="bi bi-receipt me-1"></i>
        ${filteredTransactions.length} Transactions
    `;


    // Show empty state
    if (filteredTransactions.length === 0) {

        transactionTable.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="history-empty-state">
                        <div class="history-empty-icon">
                            <i class="bi bi-receipt"></i>
                        </div>
                        <h6 class="fw-bold mb-1">No transactions found</h6>
                        <p class="text-secondary small mb-3">
                            No records match your search or filters.
                        </p>
                        <a href="transaction.html" class="btn btn-success btn-sm rounded-pill px-3">
                            <i class="bi bi-plus-lg me-1"></i>Add Transaction
                        </a>
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    // Generate transaction rows
    transactionTable.innerHTML = filteredTransactions.map(transaction => {

        const isIncome = transaction.type === "income";

        return `
            <tr>
                <td class="fw-semibold">${escapeHTML(transaction.description)}</td>

                <td>
                    <span class="badge rounded-pill ${isIncome ? "bg-success bg-opacity-10 text-success" : "bg-danger bg-opacity-10 text-danger"}">
                        ${isIncome ? "Income" : "Expense"}
                    </span>
                </td>

                <td>${escapeHTML(transaction.paymentMethod)}</td>

                <td class="fw-semibold ${isIncome ? "text-success" : "text-danger"}">
                    ${isIncome ? "+" : "-"}${formatPeso(transaction.amount)}
                </td>

                <td class="text-secondary small">${formatDate(transaction.date)}</td>

                <td class="text-center">
                    <button type="button" class="btn btn-sm btn-outline-danger rounded-pill"
                        onclick="deleteTransaction(${Number(transaction.id)})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;

    }).join("");

}


// Prevent HTML injection in descriptions
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


// Delete transaction
function deleteTransaction(id) {

    Swal.fire({
        icon: "warning",
        title: "Delete Transaction?",
        text: "This transaction will be permanently deleted.",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        customClass: {
            popup: "rounded-4",
            confirmButton: "rounded-pill px-4",
            cancelButton: "rounded-pill px-4"
        }
    }).then(result => {

        if (result.isConfirmed) {

            const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

            const updatedTransactions = transactions.filter(transaction => transaction.id !== id);

            localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

            displayTransactions();

            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Transaction has been deleted.",
                confirmButtonColor: "#198754",
                customClass: {
                    popup: "rounded-4",
                    confirmButton: "rounded-pill px-4"
                }
            });

        }

    });

}


// Search and filter events
searchInput.addEventListener("input", displayTransactions);
filterType.addEventListener("change", displayTransactions);
startDate.addEventListener("change", displayTransactions);
endDate.addEventListener("change", displayTransactions);


// Reset filters
resetButton.addEventListener("click", function () {

    searchInput.value = "";
    filterType.value = "";
    startDate.value = "";
    endDate.value = "";

    displayTransactions();

});


// Initial display
displayTransactions();
