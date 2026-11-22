const navbarHTML = `
<nav class="navbar navbar-expand-lg bg-white border-bottom shadow-sm fixed-top py-3" style="z-index: 1030;">
    <div class="container px-3 px-xl-5">

        <!-- Brand -->
        <a class="navbar-brand d-flex align-items-center gap-2 me-lg-5" href="index.html">
            <span class="bg-success text-white rounded-4 p-2 d-flex align-items-center justify-content-center">
                <i class="bi bi-wallet2 fs-4"></i>
            </span>

            <span class="d-flex flex-column">
                <span class="fw-bold fs-5 text-dark lh-1">GastosTracker</span>
                <small class="text-secondary mt-1" style="font-size: 11px; letter-spacing: 1px;">TRACK • SAVE • GROW</small>
            </span>
        </a>

        <!-- Offline Status -->
        <span class="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2 d-lg-none">
            <i class="bi bi-circle-fill me-1" style="font-size: 7px;"></i>
            Offline Ready
        </span>

        <!-- Navigation -->
        <div class="collapse navbar-collapse" id="mainNavbar">

            <div class="navbar-nav mx-lg-auto align-items-lg-center gap-2 mt-3 mt-lg-0">

                <a class="nav-link active bg-success text-white rounded-pill px-4 py-2 fw-semibold"
                    href="index.html">
                    <i class="bi bi-grid-fill me-2"></i>Dashboard
                </a>

                <a class="nav-link text-secondary rounded-pill px-3 py-2 fw-medium"
                    href="transaction.html">
                    <i class="bi bi-plus-circle me-2"></i>New Transaction
                </a>

                <a class="nav-link text-secondary rounded-pill px-3 py-2 fw-medium"
                    href="history.html">
                    <i class="bi bi-clock-history me-2"></i>History
                </a>

                <a class="nav-link text-secondary rounded-pill px-3 py-2 fw-medium"
                    href="backup.html">
                    <i class="bi bi-database me-2"></i>Data Management
                </a>

            </div>

            <!-- Right Section -->
            <div class="d-flex align-items-center gap-2 mt-3 mt-lg-0 ms-lg-4">

                <span class="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2 d-none d-lg-inline-flex align-items-center">
                    <i class="bi bi-circle-fill me-1" style="font-size: 7px;"></i>
                    Offline Ready
                </span>

                <div class="rounded-circle bg-light border d-flex align-items-center justify-content-center"
                    style="width: 40px; height: 40px;">
                    <i class="bi bi-person-fill text-success fs-5"></i>
                </div>

            </div>

        </div>
    </div>
</nav>
`;




const bottomNavHTML = `
<nav class="gt-bottom-nav d-lg-none">
    <div class="gt-bottom-nav-inner">

        <a href="index.html" class="gt-bottom-link">
            <i class="bi bi-grid-fill"></i>
            <span>Home</span>
        </a>

        <a href="transaction.html" class="gt-bottom-link">
            <i class="bi bi-plus-circle"></i>
            <span>New</span>
        </a>

        <a href="history.html" class="gt-bottom-link">
            <i class="bi bi-clock-history"></i>
            <span>History</span>
        </a>

        <a href="backup.html" class="gt-bottom-link">
            <i class="bi bi-database"></i>
            <span>Backup</span>
        </a>

    </div>
</nav>
`;


document.getElementById("navbar").innerHTML = navbarHTML;
document.getElementById("bottom-nav").innerHTML = bottomNavHTML;



// Detect current page
const currentPage = window.location.pathname.split("/").pop() || "index.html";

// Highlight Bottom Navigation
document.querySelectorAll(".gt-bottom-link").forEach(link => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
    }
});

// Highlight Desktop Navbar
document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {
    const linkPage = link.getAttribute("href");

    link.classList.remove("active", "bg-success", "text-white", "fw-semibold");
    link.classList.add("text-secondary", "fw-medium");

    if (linkPage === currentPage) {
        link.classList.add("active", "bg-success", "text-white", "fw-semibold");
        link.classList.remove("text-secondary", "fw-medium");
        link.setAttribute("aria-current", "page");
    } else {
        link.removeAttribute("aria-current");
    }
});


// Register Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {

        navigator.serviceWorker.register("./service-worker.js")
            .then(registration => {
                console.log("GastosTracker Service Worker registered:", registration.scope);
            })
            .catch(error => {
                console.error("Service Worker registration failed:", error);
            });

    });
}


