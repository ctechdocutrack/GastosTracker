
// Export JSON Backup
const exportButton = document.getElementById("exportBackup");

if (exportButton) {
    exportButton.addEventListener("click", function () {

        // Get saved transactions
        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

        if (transactions.length === 0) {
            Swal.fire({
                icon: "info",
                title: "No Data to Export",
                text: "There are no transactions available for backup."
            });
            return;
        }

        // Create backup data
        const backupData = {
            app: "GastosTracker",
            version: "1.0",
            backupDate: new Date().toISOString(),
            transactions: transactions
        };

        // Convert data to JSON
        const jsonData = JSON.stringify(backupData, null, 4);
        const blob = new Blob([jsonData], { type: "application/json" });

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `GastosTracker_Backup_${new Date().toISOString().slice(0, 10)}.json`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        localStorage.setItem("lastBackup", new Date().toISOString());
        updateStorageOverview();

        Swal.fire({
            icon: "success",
            title: "Backup Downloaded!",
            text: "Your financial records have been exported successfully.",
            confirmButtonColor: "#198754"
        });

    });
}


// Restore JSON Backup
const restoreButton = document.getElementById("restoreBackup");
const backupFile = document.getElementById("backupFile");

if (restoreButton && backupFile) {
    restoreButton.addEventListener("click", function () {

        const file = backupFile.files[0];

        if (!file) {
            Swal.fire({
                icon: "warning",
                title: "No Backup Selected",
                text: "Please select a JSON backup file first."
            });
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            try {
                const backupData = JSON.parse(event.target.result);

                // Validate backup file
                if (
                    backupData.app !== "GastosTracker" ||
                    !Array.isArray(backupData.transactions) ||
                    !backupData.transactions.every(transaction =>
                        transaction &&
                        Number.isFinite(Number(transaction.id)) &&
                        typeof transaction.description === "string" &&
                        Number.isFinite(Number(transaction.amount)) &&
                        Number(transaction.amount) > 0 &&
                        ["income", "expense"].includes(transaction.type) &&
                        typeof transaction.date === "string" &&
                        ["Cash", "Bank"].includes(transaction.paymentMethod)
                    )
                ) {
                    throw new Error("Invalid backup file.");
                }

                // Ask for confirmation
                Swal.fire({
                    icon: "warning",
                    title: "Restore Backup?",
                    text: "Your current transactions will be replaced by the backup data.",
                    showCancelButton: true,
                    confirmButtonText: "Yes, Restore",
                    cancelButtonText: "Cancel",
                    confirmButtonColor: "#198754",
                    cancelButtonColor: "#6c757d"
                }).then(result => {

                    if (result.isConfirmed) {

                        localStorage.setItem(
                            "transactions",
                            JSON.stringify(backupData.transactions)
                        );

                        updateStorageOverview();

                        backupFile.value = "";

                        Swal.fire({
                            icon: "success",
                            title: "Backup Restored!",
                            text: `${backupData.transactions.length} transactions have been restored.`,
                            confirmButtonColor: "#198754"
                        });

                    }

                });

            } catch (error) {

                Swal.fire({
                    icon: "error",
                    title: "Invalid Backup File",
                    text: "Please select a valid GastosTracker JSON backup."
                });

            }

        };

        reader.onerror = function () {
            Swal.fire({
                icon: "error",
                title: "File Read Error",
                text: "Unable to read the selected backup file."
            });
        };

        reader.readAsText(file);

    });
}


// Update Storage Overview
function updateStorageOverview() {

    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Update total transactions
    document.getElementById("totalTransactions").textContent = transactions.length;

    // Update last backup date
    const lastBackup = localStorage.getItem("lastBackup");
    const lastBackupElement = document.getElementById("lastBackup");

    if (lastBackup) {
        lastBackupElement.textContent = new Date(lastBackup).toLocaleString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    } else {
        lastBackupElement.textContent = "No backup yet";
    }
}

// Run Storage Overview
updateStorageOverview();


// Export Transactions to Excel (CSV)
const exportExcelButton = document.getElementById("exportExcel");

if (exportExcelButton) {
    exportExcelButton.addEventListener("click", function () {

        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

        if (transactions.length === 0) {
            Swal.fire({
                icon: "info",
                title: "No Data to Export",
                text: "There are no transactions available."
            });
            return;
        }

        // CSV headers
        const headers = [
            "ID",
            "Type",
            "Description",
            "Amount",
            "Payment Method",
            "Date and Time"
        ];

        // Escape CSV values
        const escapeCSV = value => `"${String(value ?? "").replace(/"/g, '""')}"`;

        // Convert transactions to CSV rows
        const rows = transactions.map(transaction => [
            transaction.id,
            transaction.type,
            transaction.description,
            Number(transaction.amount).toFixed(2),
            transaction.paymentMethod,
            transaction.date
        ].map(escapeCSV).join(","));

        // Add UTF-8 BOM for Excel compatibility
        const csvContent = "\uFEFF" + [
            headers.map(escapeCSV).join(","),
            ...rows
        ].join("\r\n");

        // Create CSV file
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `GastosTracker_Transactions_${new Date().toISOString().slice(0, 10)}.csv`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        Swal.fire({
            icon: "success",
            title: "Excel Exported!",
            text: "Your transactions have been exported successfully.",
            confirmButtonColor: "#198754"
        });

    });
}


// Clear All Transactions
const clearAllButton = document.getElementById("clearAllData");

if (clearAllButton) {
    clearAllButton.addEventListener("click", function () {

        const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

        if (transactions.length === 0) {
            Swal.fire({
                icon: "info",
                title: "No Data to Clear",
                text: "There are no saved transactions."
            });
            return;
        }

        Swal.fire({
            icon: "warning",
            title: "Clear All Data?",
            text: `You are about to permanently delete ${transactions.length} transactions. This action cannot be undone.`,
            showCancelButton: true,
            confirmButtonText: "Yes, Delete Everything",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            reverseButtons: true
        }).then(result => {

            if (result.isConfirmed) {

                localStorage.removeItem("transactions");

                // Update Storage Overview
                updateStorageOverview();

                Swal.fire({
                    icon: "success",
                    title: "All Data Cleared!",
                    text: "All transactions have been permanently deleted.",
                    confirmButtonColor: "#198754"
                });

            }

        });

    });
}

