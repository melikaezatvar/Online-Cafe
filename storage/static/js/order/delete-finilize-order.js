document.addEventListener('DOMContentLoaded', () => {
    const ordersList = document.querySelector('#orders-list');

    ordersList.addEventListener('click', (event) => {
        event.preventDefault()

        const removeBtn = event.target.closest('.remove-order-btn');
        const finalizeBtn = event.target.closest('.finalize-order-btn');
        const csrfToken = document.querySelector(`input[name="csrfmiddlewaretoken"]`).value;

        if (removeBtn) {
            const orderId = removeBtn.getAttribute('data-id');

            fetch(`/order/remove/${orderId}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': csrfToken
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('Order removed successfully');
                    fetchOrders();
                } else {
                    alert('Error removing order');
                }
            })
            .catch(error => alert('Error: '+ error))
        } else if (finalizeBtn) {
            const orderId = finalizeBtn.getAttribute('data-id');
            fetch(`/api/order/finalize/${orderId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('Order finalized successfully');
                    fetchOrders()
                } else {
                    alert('Error finalizing order');
                }
            })
            .catch(error => alert('Error: '+ error))
        }
    })

})


