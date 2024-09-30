function changeFavoriteStatus () {
    const favoriteEl = document.querySelector('#p-favorite')
    favoriteEl.classList.toggle('fa-solid')
    favoriteEl.classList.toggle('fa-regular')
}