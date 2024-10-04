document.addEventListener('DOMContentLoaded', () => {
    const ordersList = document.querySelector('#orders-list');
    const orderDetailsSection = document.querySelector('#order-details');  // بخشی برای نمایش جزئیات سفارش

    // تابعی برای بارگذاری سفارش‌ها
    const fetchOrders = () => {
        fetch('/api/orders/')
            .then(response => response.json())
            .then(data => {
                ordersList.innerHTML = '';  // خالی کردن لیست قبلی
                if (data.length === 0) {
                    ordersList.innerHTML = '<li>No orders found.</li>';
                } else {
                    data.forEach(order => {
                        const li = document.createElement('li');
                        li.style.position = 'relative';
                        li.classList.add('mb-3');

                        // نمایش اطلاعات سفارش در هر ردیف
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

                        // دکمه حذف برای سفارشات با وضعیت pending
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
            })
            .catch(err => console.error('Error fetching orders:', err));
    };

    // مدیریت کلیک برای لینک سفارش‌ها به منظور نمایش جزئیات
    ordersList.addEventListener('click', (event) => {
        const target = event.target.closest('.order-link');
        if (target) {
            event.preventDefault();  // جلوگیری از بارگذاری پیش‌فرض
            const orderId = target.getAttribute('data-id');  // دریافت آی‌دی سفارش
            fetchOrderDetails(orderId);  // دریافت جزئیات سفارش
        }
    });

    // تابعی برای نمایش جزئیات سفارش
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

    // بارگذاری سفارش‌ها
    fetchOrders();
});




//
// // بخشی برای نمایش جزئیات سفارش
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
//                         if (order.status === 'pending') {
//                             li.innerHTML += `
//                                 <button class="remove-order-btn" data-id="${order.id}" style="position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer;">
//                                     <i class="fa-solid fa-trash"></i>
//                                 </button>
//                             `;
//                         }
//
//                         ordersList.appendChild(li);
//                     });
//
//                     // بعد از بارگذاری سفارش‌ها، event listener ها را برای نمایش جزئیات سفارش‌ها اضافه کنید
//                     addOrderDetailsListeners();
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
//
//
//     // نمایش جزئیات سفارش
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
//
