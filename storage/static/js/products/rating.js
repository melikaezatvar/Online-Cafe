document.addEventListener('DOMContentLoaded', (qualifiedName, value) => {

    const productEl = document.querySelector('#product-id')

    fetch(`/api/product/rate/${productEl.value}/`)
        .then(res => res.json())
        .then(data => {
            document.querySelector('#star' + data[0].rate).setAttribute('checked', value)
        }).catch(() => {})

    document.querySelectorAll('.star-rating input').forEach((rate) => {
        rate.addEventListener('change',  () => {
            fetch(`/api/product/rate/${productEl.value}/${rate.value}/`, {
                method: 'POST',
                headers:{
                    'X-CSRFToken': document.querySelector(`input[name="csrfmiddlewaretoken"]`).value,
                },
            }).then(res => console.log(res))
        });
    });
})

