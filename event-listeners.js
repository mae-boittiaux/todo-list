import { updateTodoList } from "./index.js";

export function setEventListeners() {
    const themeButtons = document.querySelectorAll('.line-colour-button');

    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.selected-theme')?.classList.remove('selected-theme');
            button.classList.add('selected-theme');
            updateTodoList();
        })
    });

    document.getElementById('line-blue').onclick = () => {
        localStorage.selectedTheme = 'line-blue';
    };

    document.getElementById('line-purple').onclick = () => {
        localStorage.selectedTheme = 'line-purple';
    };

    document.getElementById('line-green').onclick = () => {
        localStorage.selectedTheme = 'line-green';
    };

    document.querySelector('.selected-theme')?.classList.remove('selected-theme');
    themeButtons.forEach(button => {
        if (localStorage.selectedTheme == button.id) {
            document.getElementById(button.id).classList.add('selected-theme');
        }
    });

    const bulletButtons = document.querySelectorAll('.bullet-point-button');

    bulletButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.selected-bullet')?.classList.remove('selected-bullet');
            button.classList.add('selected-bullet');
            updateTodoList();
        })
    });

    document.getElementById('bullet-none').onclick = () => {
        localStorage.selectedBullet = 'bullet-none';
    };

    document.getElementById('bullet-point').onclick = () => {
        localStorage.selectedBullet = 'bullet-point';
    };

    document.getElementById('bullet-dash').onclick = () => {
        localStorage.selectedBullet = 'bullet-dash';
    };

    document.getElementById('bullet-arrow').onclick = () => {
        localStorage.selectedBullet = 'bullet-arrow';
    };

    document.querySelector('.selected-bullet')?.classList.remove('selected-bullet');
    bulletButtons.forEach(button => {
        if (localStorage.selectedBullet == button.id) {
            document.getElementById(button.id).classList.add('selected-bullet');
        }
    });

    const highlighterColour = document.querySelectorAll('.highlighter-colour-button');

    highlighterColour.forEach(highlighter => {
        highlighter.addEventListener('click', () => {
            document.querySelector('.selected-highlighter')?.classList.remove('selected-highlighter');
            highlighter.classList.add('selected-highlighter');
            updateTodoList();
        })
    });

    document.getElementById('highlighter-yellow').onclick = () => {
        localStorage.selectedHighlighterColour = 'highlighter-yellow';
    };

    document.getElementById('highlighter-pink').onclick = () => {
        localStorage.selectedHighlighterColour = 'highlighter-pink';
    };

    document.getElementById('highlighter-orange').onclick = () => {
        localStorage.selectedHighlighterColour = 'highlighter-orange';
    };

    document.getElementById('highlighter-green').onclick = () => {
        localStorage.selectedHighlighterColour = 'highlighter-green';
    };

    document.getElementById('highlighter-blue').onclick = () => {
        localStorage.selectedHighlighterColour = 'highlighter-blue';
    };

    document.querySelector('.selected-highlighter')?.classList.remove('selected-highlighter');
    highlighterColour.forEach(highlighter => {
        if (localStorage.selectedHighlighterColour == highlighter.id) {
            document.getElementById(highlighter.id).classList.add('selected-highlighter');
        }
    });
}