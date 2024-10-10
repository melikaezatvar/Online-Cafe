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
                                <button class="finalize-order-btn" data-id="${order.id}" style="position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer;">
                                    Finalize
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




// document.addEventListener('DOMContentLoaded', () => {
//     const ordersList = document.querySelector('#orders-list');
//
//     // تابعی برای بارگذاری سفارش‌ها
//     const fetchOrders = () => {
//         fetch('/api/orders/')
//             .then(response => response.json())
//             .then(data => {
//                 ordersList.innerHTML = '';  // لیست سفارش‌ها را خالی می‌کند
//                 if (data.length === 0) {
//                     ordersList.innerHTML = '<li>No orders found.</li>';
//                 } else {
//                     data.forEach(order => {
//                         const li = document.createElement('li');
//                         li.style.position = 'relative';
//                         li.classList.add('mb-3');
//
//                         li.innerHTML = `
//                             <a href="#" class="order-link" data-id="${order.id}" style="text-decoration: none; color: inherit;">
//                                 <div class="row order" style="display: flex; align-items: center; padding: 10px; border: 1px solid #ddd; border-radius: 10px;">
//                                     <div style="display: flex; flex-direction: column;">
//                                         <div style="font-size: 14px; font-weight: bold;">Order ID: ${order.id} * User: ${order.user}</div>
//                                         <div style="font-size: 14px;">Status: ${order.status}</div>
//                                         <div style="font-size: 16px;">Total Items: ${order.items.length}</div>
//                                     </div>
//                                 </div>
//                             </a>
//                         `;
//
//                         // اضافه کردن دکمه حذف برای سفارشات با وضعیت pending
//                         if (order.status === 'pending') {
//                             li.innerHTML += `
//                                 <button class="remove-order-btn" data-id="${order.id}" style="position: absolute; top: 10px; right: 90px; background: none; border: none; cursor: pointer;">
//                                     <i class="fa-solid fa-trash"></i>
//                                 </button>
//                                 <button class="finalize-order-btn" data-id="${order.id}" style="position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer;">
//                                     Finalize
//                                 </button>
//                             `;
//                         }
//
//                         ordersList.appendChild(li);
//                     });
//                 }
//             })
//             .catch(err => console.error('Error fetching orders:', err));
//     };
//
//     // استفاده از event delegation برای هندل کردن کلیک روی دکمه‌های حذف و نهایی‌سازی
//     ordersList.addEventListener('click', (event) => {
//         event.preventDefault();  // جلوگیری از رفتار پیش‌فرض
//
//         const orderId = event.target.getAttribute('data-id');
//         const csrfToken = document.querySelector(`input[name="csrfmiddlewaretoken"]`).value;
//
//         if (event.target.classList.contains('remove-order-btn')) {
//              console.log('Remove button clicked :/');
//             // درخواست حذف سفارش
//             fetch(`/order/remove/${orderId}/`, {
//                 method: 'DELETE',
//                 headers: {
//                     'X-CSRFToken': csrfToken
//                 }
//             })
//             .then(response => {
//                 if (response.ok) {
//                     console.log('Order removed successfully');
//                     fetchOrders();  // بارگذاری مجدد لیست سفارش‌ها
//                 } else {
//                     console.error('Error removing order');
//                 }
//             })
//             .catch(error => console.error('Error:', error));
//         } else if (event.target.classList.contains('finalize-order-btn')) {
//             // درخواست نهایی‌سازی سفارش
//             fetch(`/api/order/finalize/${orderId}/`, {
//                 method: 'POST',
//                 headers: {
//                     'X-CSRFToken': csrfToken
//                 }
//             })
//             .then(response => {
//                 if (response.ok) {
//                     console.log('Order finalized successfully');
//                     fetchOrders();  // بارگذاری مجدد لیست سفارش‌ها
//                 } else {
//                     console.error('Error finalizing order');
//                 }
//             })
//             .catch(error => console.error('Error:', error));
//         }
//     });
//
//     // بارگذاری اولیه سفارش‌ها
//     fetchOrders();
// });
//
//



//****************************-------------------------------+++++++++++++++++++++
// document.addEventListener('DOMContentLoaded', () => {
//     const orderList = document.querySelector('#order-list');
//
//     const fetchOrders = () => {
//         fetch('/api/orders/')
//             .then(response => response.json())
//             .then(data => {
//                 console.log(data);
//                 orderList.innerHTML = '';
//                 if (data.length === 0) {
//                     orderList.innerHTML = '<li>No orders found.</li>';
//                 } else {
//                     data.forEach(order => {
//                         const li = document.createElement('li');
//                         li.style.position = 'relative';
//
//                         li.innerHTML += `
//                             <div class="order-item" style="padding: 10px; border: 1px solid #ddd; border-radius: 10px; margin-bottom: 10px;">
//                                 <div>Order ID: ${order.id}</div>
//                                 <div>Status: ${order.status}</div>
//                                 <button class="mark-as-shipped-btn" data-id="${order.id}" ${order.status === 'Shipped' ? 'disabled' : ''} style="margin-top: 10px;">Mark as Shipped</button>
//                             </div>
//                         `;
//
//                         orderList.appendChild(li);
//                     });
//                 }
//             })
//             .catch(err => console.error('Error fetching orders:', err));
//     };
//
//     const handleMarkAsShipped = (event) => {
//         const orderId = event.target.getAttribute('data-id');
//
//         fetch(`/api/orders/mark-as-shipped/${orderId}/`, {
//             method: 'POST',
//             headers: {
//                 'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value,
//             },
//         }).then(res => {
//             if (res.ok) {
//                 fetchOrders();
//             } else {
//                 alert('Error marking order as shipped');
//             }
//         }).catch(err => console.error('Error marking order as shipped:', err));
//
//         event.preventDefault();
//     };
//
//     orderList.addEventListener('click', (event) => {
//         if (event.target.classList.contains('mark-as-shipped-btn')) {
//             handleMarkAsShipped(event);
//         }
//     });
//
//     fetchOrders();
// });
//
//


// document.addEventListener('DOMContentLoaded', () => {
//     const ordersList = document.querySelector('#orders-list');
//     const orderDetailsSection = document.querySelector('#order-details');  // بخشی برای نمایش جزئیات سفارش
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
//                             <a href="#" class="order-link" data-id="${order.id}" style="text-decoration: none; color: inherit;">
//                                 <div class="row order" style="display: flex; align-items: center; padding: 10px; border: 1px solid #ddd; border-radius: 10px;">
//                                     <div style="display: flex; flex-direction: column;">
//                                         <div style="font-size: 14px; font-weight: bold;">Order ID: ${order.id}    *      User: ${order.user} </div>
//                                         <div style="font-size: 14px;">Status: ${order.status}</div>
//                                         <div style="font-size: 16px;">Total Items: ${order.items.length}</div>
//                                     </div>
//                                 </div>
//                             </a>
//                         `;
//
//                         // دکمه‌های حذف و پرداخت فقط برای سفارش‌های pending
//                         if (order.status === 'pending') {
//                             li.innerHTML += `
//                                 <button class="remove-order-btn" data-id="${order.id}" style="position: absolute; top: 10px; right: 50px; background: none; border: none; cursor: pointer;">
//                                     <i class="fa-solid fa-trash"></i>
//                                 </button>
//                                 <button class="pay-order-btn" data-id="${order.id}" style="position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer;">
//                                     <i class="fa-solid fa-money-bill-wave"></i>
//                                 </button>
//                             `;
//                         }
//
//                         ordersList.appendChild(li);
//                     });
//
//                     // بعد از بارگذاری سفارش‌ها، event listener ها را برای دکمه‌های حذف و پرداخت اضافه کنید
//                     addOrderDetailsListeners();
//                     addRemoveOrderListeners();
//                     addPayOrderListeners();
//                 }
//             })
//             .catch(err => console.error('Error fetching orders:', err));
//     };
//
//     const addOrderDetailsListeners = () => {
//         document.querySelectorAll('.order-link').forEach(link => {
//             link.addEventListener('click', function(event) {
//                 event.preventDefault();
//                 const orderId = event.target.closest('.order-link').getAttribute('data-id');
//                 fetchOrderDetails(orderId);
//             });
//         });
//     };
//
//     const addRemoveOrderListeners = () => {
//         document.querySelectorAll('.remove-order-btn').forEach(button => {
//             button.addEventListener('click', function(event) {
//                 event.preventDefault();
//                 const orderId = event.target.closest('.remove-order-btn').getAttribute('data-id');
//                 const csrfToken = document.querySelector(`input[name="csrfmiddlewaretoken"]`).value;
//
//                 fetch(`/api/order/remove/${orderId}/`, {
//                     method: 'DELETE',
//                     headers: {
//                         'X-CSRFToken': csrfToken
//                     }
//                 })
//                 .then(response => {
//                     if (response.ok) {
//                         console.log('Order removed successfully');
//                         // می‌توانید سفارش را از لیست حذف کنید یا صفحه را رفرش کنید
//                         location.reload();  // صفحه را رفرش می‌کند
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
//     const addPayOrderListeners = () => {
//         document.querySelectorAll('.pay-order-btn').forEach(button => {
//             button.addEventListener('click', function(event) {
//                 event.preventDefault();
//                 const orderId = event.target.closest('.pay-order-btn').getAttribute('data-id');
//                 const csrfToken = document.querySelector(`input[name="csrfmiddlewaretoken"]`).value;
//
//                 fetch(`/api/order/mark-as-shipped/${orderId}/`, {
//                     method: 'POST',
//                     headers: {
//                         'X-CSRFToken': csrfToken
//                     }
//                 })
//                 .then(response => {
//                     if (response.ok) {
//                         console.log('Order marked as shipped successfully');
//                         location.reload();  // صفحه را رفرش می‌کند
//                     } else {
//                         console.error('Error marking order as shipped');
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error:', error);
//                 });
//             });
//         });
//     };
//
//     const fetchOrderDetails = (orderId) => {
//         fetch(`/api/order/${orderId}/`)
//             .then(response => response.json())
//             .then(data => {
//                 // نمایش جزئیات سفارش
//                 orderDetailsSection.innerHTML = `
//                     <h3>Order ID: ${data.id}</h3>
//                     <p>Status: ${data.status}</p>
//                     <ul>
//                         ${data.items.map(item => `
//                             <li>
//                                 Product: ${item.product.name}, Quantity: ${item.quantity}, Total Price: ${item.get_total_price}
//                             </li>
//                         `).join('')}
//                     </ul>
//                     <p>Total Price: ${data.get_total_price}</p>
//                 `;
//             })
//             .catch(err => console.error('Error fetching order details:', err));
//     };
//
//     fetchOrders();
// });
