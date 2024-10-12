document.addEventListener('DOMContentLoaded', () => {
    const ordersList = document.querySelector('#orders-list');

    ordersList.addEventListener('click', (event) => {
        const target = event.target.closest('.order-link');
        if (target) {
            event.preventDefault();
            const orderId = target.getAttribute('data-id');
            fetchOrderDetails(orderId);
        }
    });


    const fetchOrderDetails = (orderId) => {
        fetch(`/api/order/${orderId}/`)
            .then(response => response.json())
            .then(data => {
                const orderDetailsSection = document.querySelector('#order-details-'+data.id);

                orderDetailsSection.innerHTML = `
                    <ul>
                        ${data.items.map(item => `
                            <li>
                                Product: ${item.product.name}, Quantity: ${item.quantity}, Total Price: $${item.get_total_price}
                            </li>
                        `).join('')}
                    </ul>`
            })
            .catch(err => console.error('Error fetching order details:', err))
    }

})




