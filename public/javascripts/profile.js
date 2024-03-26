// javascripts/profile.js

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.button');
    const pages = document.querySelectorAll('.page');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.dataset.target;
            pages.forEach(page => {
                if (page.id === target) {
                    page.style.display = 'block';
                } else {
                    page.style.display = 'none';
                }
            });
        });
    });

    const closeButtons = document.querySelectorAll('.page__close');
    closeButtons.forEach(closeButton => {
        closeButton.addEventListener('click', function() {
            const page = this.closest('.page');
            page.style.display = 'none';
        });
    });
});
