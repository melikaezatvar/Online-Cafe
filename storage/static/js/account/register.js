document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const phoneNumber = document.getElementById('phone_number').value;

        const formData = {
            phone_number: phoneNumber
        };

        try {
            const response = await fetch('/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Registration successful! Redirecting...');
                window.location.href = '/login/';
            } else {
                alert('Error: ' + result.detail || 'Registration failed. Please try again.');
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
        }
    });

    function getCSRFToken() {
        let cookieValue = null;
        const name = 'csrftoken';
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + '=') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
        return cookieValue;
    }
});
