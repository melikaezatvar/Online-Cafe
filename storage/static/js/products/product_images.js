function changeImage(src, alt) {
    console.log(src)
    document.querySelector('#main-image').src = src
    document.querySelector('#main-image').alt = alt
}