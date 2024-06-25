const sidebar = document.getElementById('sidebar');
const topbar = document.getElementById('top-bar');

function toggleMenu()
{
    if (sidebar.classList.contains("mobile-display-none"))
    {
        sidebar.classList.remove("mobile-display-none")
    }
    else
    {
        sidebar.classList.add("mobile-display-none")
    }
}