document.addEventListener('DOMContentLoaded', () => {
    const ordersList = document.querySelector('#orders-list');
    const orderDetailsSection = document.querySelector('#order-details');  // بخشی برای نمایش جزئیات سفارش

    const fetchOrders = () => {
        fetch('/api/orders/')
            .then(response => response.json())
            .then(data => {
                ordersList.innerHTML = '';
                if (data.length === 0) {
                    ordersList.innerHTML = '<li>No orders found.</li>';
                } else {
                    data.forEach(order => {
                        const li = document.createElement('li');
                        li.style.position = 'relative';
                        li.classList.add('mb-3');

                        li.innerHTML = `
                            <a href="#" class="order-link" data-id="${order.id}" style="text-decoration: none; color: inherit;">
                                <div class="row order" style="display: flex; align-items: center; padding: 10px; border: 1px solid #ddd; border-radius: 10px;">
                                    <div style="display: flex; flex-direction: column;">
                                        <div style="font-size: 14px; font-weight: bold;">Order ID: ${order.id}    *      User: ${order.user} </div>
                                        <div style="font-size: 14px;">Status: ${order.status}</div>
                                        <div style="font-size: 16px;">Total Items: ${order.items.length}</div>
                                    </div>
                                </div>
                            </a>
                        `;

                        // دکمه‌های حذف و پرداخت فقط برای سفارش‌های pending
                        if (order.status === 'pending') {
                            li.innerHTML += `
                                <button class="remove-order-btn" data-id="${order.id}" style="position: absolute; top: 10px; right: 50px; background: none; border: none; cursor: pointer;">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                                <button class="pay-order-btn" data-id="${order.id}" style="position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer;">
                                    <i class="fa-solid fa-money-bill-wave"></i>
                                </button>
                            `;
                        }

                        ordersList.appendChild(li);
                    });

                    // بعد از بارگذاری سفارش‌ها، event listener ها را برای دکمه‌های حذف و پرداخت اضافه کنید
                    addOrderDetailsListeners();
                    addRemoveOrderListeners();
                    addPayOrderListeners();
                }
            })
            .catch(err => console.error('Error fetching orders:', err));
    };

    const addOrderDetailsListeners = () => {
        document.querySelectorAll('.order-link').forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const orderId = event.target.closest('.order-link').getAttribute('data-id');
                fetchOrderDetails(orderId);
            });
        });
    };

    const addRemoveOrderListeners = () => {
        document.querySelectorAll('.remove-order-btn').forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                const orderId = event.target.closest('.remove-order-btn').getAttribute('data-id');
                const csrfToken = document.querySelector(`input[name="csrfmiddlewaretoken"]`).value;

                fetch(`/api/order/remove/${orderId}/`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': csrfToken
                    }
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Order removed successfully');
                        // می‌توانید سفارش را از لیست حذف کنید یا صفحه را رفرش کنید
                        location.reload();  // صفحه را رفرش می‌کند
                    } else {
                        console.error('Error removing order');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            });
        });
    };

    const addPayOrderListeners = () => {
        document.querySelectorAll('.pay-order-btn').forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                const orderId = event.target.closest('.pay-order-btn').getAttribute('data-id');
                const csrfToken = document.querySelector(`input[name="csrfmiddlewaretoken"]`).value;

                fetch(`/api/order/mark-as-shipped/${orderId}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrfToken
                    }
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Order marked as shipped successfully');
                        location.reload();  // صفحه را رفرش می‌کند
                    } else {
                        console.error('Error marking order as shipped');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            });
        });
    };

    const fetchOrderDetails = (orderId) => {
        fetch(`/api/order/${orderId}/`)
            .then(response => response.json())
            .then(data => {
                // نمایش جزئیات سفارش
                orderDetailsSection.innerHTML = `
                    <h3>Order ID: ${data.id}</h3>
                    <p>Status: ${data.status}</p>
                    <ul>
                        ${data.items.map(item => `
                            <li>
                                Product: ${item.product.name}, Quantity: ${item.quantity}, Total Price: ${item.get_total_price}
                            </li>
                        `).join('')}
                    </ul>
                    <p>Total Price: ${data.get_total_price}</p>
                `;
            })
            .catch(err => console.error('Error fetching order details:', err));
    };

    fetchOrders();
});
