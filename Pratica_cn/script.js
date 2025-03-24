import toggleTheme from "./componentes/toogle.js";

document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("theme-toggle");
    const themeHandler = toggleTheme();

    toggleButton.addEventListener("change", themeHandler);
});
