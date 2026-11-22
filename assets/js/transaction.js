
// Set current date and time
const dateInput = document.getElementById("date");

if (dateInput) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    dateInput.value = now.toISOString().slice(0, 16);
}


// Save Transaction
const transactionForm = document.getElementById("transactionForm");

if (transactionForm) {
    transactionForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get form values
        const type = document.querySelector('input[name="type"]:checked').value;
        const description = document.getElementById("description").value.trim();
        const amount = parseFloat(document.getElementById("amount").value);
        const date = document.getElementById("date").value;
        const paymentMethod = document.getElementById("paymentMethod").value;

        // Validate amount
        if (!description || !Number.isFinite(amount) || amount <= 0 || !date || !paymentMethod) {
            alert("Please complete all transaction details correctly.");
            return;
        }

        // Create transaction object
        const transaction = {
            id: Date.now(),
            type: type,
            description: description,
            amount: amount,
            date: date,
            paymentMethod: paymentMethod
        };

        // Get existing transactions
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

        // Add new transaction
        transactions.push(transaction);

        // Save to LocalStorage
        localStorage.setItem("transactions", JSON.stringify(transactions));

        // Confirmation
        Swal.fire({
            icon: "success",
            title: "Transaction Saved!",
            text: "Your transaction has been recorded successfully.",
            confirmButtonText: "Continue",
            confirmButtonColor: "#198754",
            customClass: {
                popup: "rounded-4",
                confirmButton: "rounded-pill px-4 py-2"
            }
        });

        // Reset form
        transactionForm.reset();

        // Set current date and time again
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        dateInput.value = now.toISOString().slice(0, 16);
    });
}
