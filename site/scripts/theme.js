// Theme switcher
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
let currentTheme = localStorage.getItem('theme');

// Если тема не установлена в localStorage, установить темную по умолчанию
if (!currentTheme) {
    currentTheme = 'dark';
    localStorage.setItem('theme', 'dark');
}

document.documentElement.setAttribute('data-theme', currentTheme);
if (currentTheme === 'dark') {
    toggleSwitch.checked = true;
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false); 