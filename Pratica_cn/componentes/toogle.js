const toggleTheme = () => {
    const html = document.documentElement;
    const toggleButton = document.getElementById("theme-toggle");

    const DARK_THEME = "dark";
    const LIGHT_THEME = "light";

    const setTheme = (theme) => {
        html.dataset.theme = theme;
        localStorage.setItem("theme", theme);
    };

    return () => {
        const currentTheme = html.dataset.theme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
        setTheme(currentTheme);
        toggleButton.checked = currentTheme === DARK_THEME;
        alert(`Acabas de cambiar de tema`);
    };
};

export default toggleTheme;
