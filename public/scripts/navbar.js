document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('menu-button');
    const menuOpenIcon = document.getElementById('menu-open-icon');
    const menuCloseIcon = document.getElementById('menu-close-icon');
    const mobileMenu = document.getElementById('mobile-menu');

    menuButton.addEventListener('click', function() {
        const isOpen = mobileMenu.classList.contains('opacity-100');
        if (isOpen) {
            mobileMenu.classList.remove('opacity-100', 'translate-x-0');
            mobileMenu.classList.add('opacity-0', '-translate-x-full');
            menuOpenIcon.classList.remove('hidden');
            menuCloseIcon.classList.add('hidden');
        } else {
            mobileMenu.classList.remove('opacity-0', '-translate-x-full');
            mobileMenu.classList.add('opacity-100', 'translate-x-0');
            menuOpenIcon.classList.add('hidden');
            menuCloseIcon.classList.remove('hidden');
        }
    });
});