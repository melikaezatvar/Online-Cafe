document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form-btn');

    loginForm.addEventListener('click', (event) => {
        const data = new FormData(document.querySelector('#login-form'));
        fetch('/api/login/', {
            method: 'POST',
            body: data,
        }).then(res => {
             if (res.ok) {
                 alert('Login successful! Redirecting...');
                 window.location.assign('/api/home/');
             } else { alert('Username or Password is invalid')}
        }).catch(() => alert('Unknown error occurred.'));
    });
});
