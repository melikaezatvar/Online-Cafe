function changeImage(src, alt) {
    document.querySelector('#main-image').src = src
    document.querySelector('#main-image').alt = alt
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const imagesEl = document.querySelectorAll('img')
        imagesEl.forEach((element) => {
            fetch(`${element.src}`)
                .then(res => {
                    if (!res.ok) {
                        element.src = "/media/product/images/not-available.png"
                        element.alt = "Not available"
                    }
                })
        })
    }, 2000)
})