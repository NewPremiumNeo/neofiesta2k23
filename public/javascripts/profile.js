// javascripts/profile.js
console.log("hello")
document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.button');
    const pages = document.querySelectorAll('.page');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            console.log(button)
            const target = this.dataset.target;
            console.log(target)
            pages.forEach(page => {
                console.log(page.id)
                if (`#${page.id}` === target) {
                    console.log("2 2 hello")
                    page.style.display = 'block';
                } else {
                    page.style.display = 'none';
                }
            });
        });
    });

    const closeButtons = document.querySelectorAll('.page__close');
    closeButtons.forEach(closeButton => {
        closeButton.addEventListener('click', function () {
            const page = this.closest('.page');
            page.style.display = 'none';
        });
    });
});
