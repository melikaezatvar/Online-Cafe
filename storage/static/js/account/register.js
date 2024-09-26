document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form-btn');

    registerForm.addEventListener('click', async function (event) {
        event.preventDefault()
        const phoneNumber = document.getElementById('phone_number').value;

        const data = new FormData(document.querySelector('#register-form'))
        const formData = {}
        data.forEach((e, v) => formData[v] = e)
        console.log(formData)

        try {
            const response = await fetch('/api/register/', {
                method: 'POST',
                body: data
            });
            debugger

            const result = await response.json();

            if (response.ok) {
                alert('Registration successful! Redirecting...');

            } else {
                alert('Error: ' + result.detail || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.log(error.message)
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
