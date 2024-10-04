document.addEventListener('DOMContentLoaded', () => {
    const favoriteEl = document.querySelector('#p-favorite')
    const productID = document.querySelector('#product-id').value

    fetch(`/api/favorites/${productID}/`)
        .then(res => {
            if (res.status === 202) {
                favoriteEl.classList.add('fa-heart', 'fa-solid')
            }
            else {
                favoriteEl.classList.add('fa-heart', 'fa-regular')
            }
        })

    favoriteEl.addEventListener('click', (event) => {
        event.preventDefault()

        fetch(`/api/favorites/${productID}/`, {
            method: 'POST',
            headers:{
                'X-CSRFToken': document.querySelector(`input[name="csrfmiddlewaretoken"]`).value,
            },
        }).then(res => {
            if (res.ok) {
                favoriteEl.classList.toggle('fa-solid')
                favoriteEl.classList.toggle('fa-regular')
            } else {alert('Unknown Error')}
        }).catch(() => alert('Unknown Error'))
    })
})