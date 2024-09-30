document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form-btn');

    registerForm.addEventListener('click',   (event) => {
        const data = new FormData(document.querySelector('#register-form'))

         fetch('/api/register/', {
            method: 'POST',
            body: data
        }).then(res => {
             if (res.ok) {
                 alert('Registration successful! Redirecting...')
                 window.location.assign('/api/home/')
             } else { alert('Error')}
         }).catch(() => alert('Unknown Error'))

    });
});
