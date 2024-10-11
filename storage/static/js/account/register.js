document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit',   (event) => {
        event.preventDefault()
        const data = new FormData(document.querySelector('#register-form'))

         fetch('/api/register/', {
            method: 'POST',
            body: data
        }).then(res => {
             if (res.ok) {
                 alert('Registration successful! Redirecting...')
                 window.location.assign('/api/home/')
             } else { alert('Registration failed!')}
         }).catch(() => alert('Unknown Error'))

    });
});
