document.getElementById('add-to-cart-button').addEventListener('click', function() {

    const productId = document.getElementById('product-id').value;

    const quantity= document.querySelector('.quantity-input-simple').value;

    fetch('/api/order/add-to-cart/', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector(`input[name="csrfmiddlewaretoken"]`).value,
        },
        body: JSON.stringify({
            product_id: productId,
            quantity: quantity
        })
    })
    .then(response => response.json())
    .then(data => {
        alert("Product added to cart!");
    })
    .catch(error => {
        alert('Error: '+ error)
    }).finally(() => countItems())
})
