document.getElementById('add-to-cart-button').addEventListener('click', function() {
    const productId = document.getElementById('product-id').value;
    const quantity= document.querySelector('.quantity-input-simple').value;
    const orderItems = document.querySelector('#count-order-items')
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
        countItems()
        console.log('Product added to cart:', data);
        alert("Product added to cart!");
    })
    .catch(error => {
        console.error('Error:', error);
    }).finally(() => countItems())
})
