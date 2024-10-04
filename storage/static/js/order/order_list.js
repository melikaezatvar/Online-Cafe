document.addEventListener('DOMContentLoaded', () => {
    const ordersList = document.querySelector('#orders-list');

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
                            <a href="/api/orders/${order.id}/" style="text-decoration: none; color: inherit;">
                                <div class="row order" style="display: flex; align-items: center; padding: 10px; border: 1px solid #ddd; border-radius: 10px;">
                                    <div style="display: flex; flex-direction: column;">
                                        <div style="font-size: 16px; font-weight: bold;">Order ID: ${order.id}    *      User: ${order.user} </div>
                                        <div style="font-size: 14px; font-weight: bold; ">Status: ${order.status}</div>
                                        <div style="font-size: 16px;">Total Items: ${order.items.length}</div>
                                    </div>
                                </div>
                            </a>
                        `;

                        // دکمه حذف فقط برای سفارش‌هایی که در وضعیت pending هستند
                        if (order.status === 'pending') {
                            li.innerHTML += `
                                <button class="remove-order-btn" data-id="${order.id}" style="position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer;">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            `;
                        }

                        ordersList.appendChild(li);
                    });
                }

                // بازنشانی event listener ها بعد از بارگذاری سفارش‌ها
                addRemoveOrderListeners();
            })
            .catch(err => console.error('Error fetching orders:', err));
    };

    const addRemoveOrderListeners = () => {
        document.querySelectorAll('.remove-order-btn').forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();  // جلوگیری از اجرای پیش‌فرض لینک

                const orderId = event.target.closest('.remove-order-btn').getAttribute('data-id');
                const csrfToken = document.querySelector(`input[name="csrfmiddlewaretoken"]`).value;

                fetch(`/order/remove/${orderId}/`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': csrfToken
                    }
                })
                .then(response => {
                    if (response.ok) {
                        console.log('Order removed successfully');
                        // سفارش را از لیست حذف کنید یا صفحه را رفرش کنید
                        fetchOrders();  // بارگذاری مجدد لیست سفارش‌ها
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

    fetchOrders();
});








// document.addEventListener('DOMContentLoaded', () => {
//     const ordersList = document.querySelector('#orders-list');
//
//     const fetchOrders = () => {
//         fetch('/api/orders/')
//             .then(response => response.json())
//             .then(data => {
//                 ordersList.innerHTML = '';
//                 if (data.length === 0) {
//                     ordersList.innerHTML = '<li>No orders found.</li>';
//                 } else {
//                     data.forEach(order => {
//                         const li = document.createElement('li');
//                         li.style.position = 'relative';
//                         li.classList.add('mb-3');
//
//                         li.innerHTML = `
//                             <a href="/orders/${order.id}/" style="text-decoration: none; color: inherit;">
//                                 <div class="row order" style="display: flex; align-items: center; padding: 10px; border: 1px solid #ddd; border-radius: 10px;">
//                                     <div style="display: flex; flex-direction: column;">
//                                         <div style="font-size: 14px; font-weight: bold;">Order ID: ${order.id}    *      User: ${order.user} </div>
//                                         <div style="font-size: 14px;">Status: ${order.status}</div>
//                                         <div style="font-size: 16px;">Total Items: ${order.items.length}</div>
//                                     </div>
//                                 </div>
//                             </a>
//
//                             <button class="remove-order-btn" data-id="${order.id}" style="position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer;">
//                                <i class="fa-solid fa-trash"></i>
//                             </button>
//                         `;
//
//
//
//
//
//
//
//                         ordersList.appendChild(li);
//                     });
//                 }
//
//                 // بازنشانی event listener ها بعد از بارگذاری سفارش‌ها
//                 addRemoveOrderListeners();
//             })
//             .catch(err => console.error('Error fetching orders:', err));
//     };
//
//     const addRemoveOrderListeners = () => {
//         document.querySelectorAll('.remove-order-btn').forEach(button => {
//             button.addEventListener('click', function(event) {
//                 event.preventDefault();  // جلوگیری از اجرای پیش‌فرض لینک
//
//                 const orderId = event.target.closest('.remove-order-btn').getAttribute('data-id');
//                 const csrfToken = document.querySelector(`input[name="csrfmiddlewaretoken"]`).value;
//
//                 fetch(`/order/remove/${orderId}/`, {
//                     method: 'DELETE',
//                     headers: {
//                         'X-CSRFToken': csrfToken
//                     }
//                 })
//                 .then(response => {
//                     if (response.ok) {
//                         console.log('Order removed successfully');
//                         // سفارش را از لیست حذف کنید یا صفحه را رفرش کنید
//                         fetchOrders();  // بارگذاری مجدد لیست سفارش‌ها
//                     } else {
//                         console.error('Error removing order');
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                 });
//             });
//         });
//     };
//
//     fetchOrders();
// });
//
//
