document.addEventListener('DOMContentLoaded', () => {
    const ordersList = document.querySelector('#orders-list');

    // تابعی برای بارگذاری سفارش‌ها
    const fetchOrders = () => {
        fetch('/api/orders/')
            .then(response => response.json())
            .then(data => {
                ordersList.innerHTML = '';  // لیست سفارش‌ها را خالی می‌کند
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
                                        <div style="font-size: 14px; font-weight: bold;">Order ID: ${order.id} * User: ${order.user}</div>
                                        <div style="font-size: 14px;">Status: ${order.status}</div>
                                        <div style="font-size: 16px;">Total Items: ${order.items.length}</div>
                                    </div>
                                </div>
                            </a>
                        `;

                        // اضافه کردن دکمه حذف و نهایی‌سازی برای سفارشات با وضعیت pending
                        if (order.status === 'pending') {
                            li.innerHTML += `
                                <button class="remove-order-btn" data-id="${order.id}" style="position: absolute; top: 10px; right: 90px; background: none; border: none; cursor: pointer;">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                                <button class="finalize-order-btn" data-id="${order.id}" style="position: absolute; top: 10px; right: 10px; background: #4CAF50; color: white;  padding: 5px 3px; border: none; cursor: pointer; hover:background-color: #3e8e41;   box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19); ">
                                    Pay ✅
                                </button>
                            `;
                        }

                        ordersList.appendChild(li);
                    });
                }
            })
            .catch(err => console.error('Error fetching orders:', err));
    };

    // استفاده از event delegation برای هندل کردن کلیک روی دکمه‌های حذف و نهایی‌سازی
    ordersList.addEventListener('click', (event) => {
        event.preventDefault();  // جلوگیری از رفتار پیش‌فرض

        const removeBtn = event.target.closest('.remove-order-btn');
        const finalizeBtn = event.target.closest('.finalize-order-btn');
        const csrfToken = document.querySelector(`input[name="csrfmiddlewaretoken"]`).value;

        if (removeBtn) {
            const orderId = removeBtn.getAttribute('data-id');
            // درخواست حذف سفارش
            fetch(`/order/remove/${orderId}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': csrfToken
                }
            })
            .then(response => {
                if (response.ok) {
                    console.log('Order removed successfully');
                    fetchOrders();  // بارگذاری مجدد لیست سفارش‌ها
                } else {
                    console.error('Error removing order');
                }
            })
            .catch(error => console.error('Error:', error));
        } else if (finalizeBtn) {
            const orderId = finalizeBtn.getAttribute('data-id');
            // درخواست نهایی‌سازی سفارش
            fetch(`/api/order/finalize/${orderId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken
                }
            })
            .then(response => {
                if (response.ok) {
                    console.log('Order finalized successfully');
                    fetchOrders();  // بارگذاری مجدد لیست سفارش‌ها
                } else {
                    console.error('Error finalizing order');
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    // بارگذاری اولیه سفارش‌ها
    fetchOrders();
});


