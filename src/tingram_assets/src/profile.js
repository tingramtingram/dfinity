let profileMediaBtns = document.querySelectorAll('.profile_tabs_photos .change');

profileMediaBtns.forEach((el) => {
    el.addEventListener('click', function() {
        profileMediaBtns.forEach((x) => {
            x.classList.remove('active');
        });
        this.classList.add('active');
    });
});