document.getElementById('add-to-cart-button').addEventListener('click', function() {
    // console.log(1)
    const productId = document.getElementById('product-id').value;
    // const quantity = document.getElementById('quantity').value;
    const quantity= document.querySelector('.quantity-input-simple').value;  // Get the value (it will be a string initially)
    // console.log(2)

    fetch('/api/order/add-to-cart/', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector(`input[name="csrfmiddlewaretoken"]`).value,
            // 'X-CSRFToken': csrftoken,  // توکن CSRF باید برای امنیت اضافه شود
        },
        body: JSON.stringify({
            product_id: productId,
            quantity: quantity
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Product added to cart:', data);
         alert("Product added to cart!");
    })
    .catch(error => {
        console.error('Error:', error);
    });
});






// // تابعی که زمانی که کاربر روی آیکون سبد خرید کلیک می‌کند فراخوانی می‌شود
// function addToCart(productId) {
//     // آدرس API که در views.py ساخته شده
//     const apiUrl = "/api/orders/";
//
//     // داده‌هایی که باید به سرور ارسال شوند (شناسه محصول)
//     const data = {
//         product_id: productId
//     };
//
//     // ارسال درخواست POST به سرور با استفاده از fetch
//     fetch(apiUrl, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "X-CSRFToken": getCookie("csrftoken")  // برای امنیت در Django، نیاز به ارسال CSRF Token داریم
//         },
//         body: JSON.stringify(data)  // تبدیل داده‌ها به JSON
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error("Network response was not ok");
//         }
//         return response.json();
//     })
//     .then(data => {
//         // اینجا می‌توانید پاسخ را مدیریت کنید، مثلاً نمایش یک پیغام موفقیت
//         alert("Product added to cart successfully!");
//         console.log("Order data:", data);
//     })
//     .catch(error => {
//         // مدیریت خطاها
//         console.error("There was a problem with the fetch operation:", error);
//     });
// }
//
// // تابع برای دریافت CSRF Token از کوکی‌ها (لازم برای درخواست‌های POST در Django)
// function getCookie(name) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== "") {
//         const cookies = document.cookie.split(";");
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             if (cookie.substring(0, name.length + 1) === (name + "=")) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }
