document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault();

    const updatePassword = document.getElementById('update-password-btn');
    const updateProfile = document.getElementById('update-profile-btn');


    updatePassword.addEventListener('click', (event) => {
        event.preventDefault();
        const data = new FormData(document.querySelector('#password-form'));

        fetch('/api/profile/resetpass/', {
            method: 'POST',
            headers:{
            'X-CSRFToken': document.querySelector(`input[name="csrfmiddlewaretoken"]`).value,
            },
            body: data
        }).then(res => {
            if (res.ok) {
                alert('Updated successfully! Redirecting...');
                window.location.reload();
            } else { alert('Error')}
        }).catch(() => alert('Error updating password'));
    });

    updateProfile.addEventListener('click', (event) => {
        event.preventDefault();
        const data = new FormData(document.querySelector('#profile-form'));

        fetch('/api/profile/', {
            method: 'POST',
            headers:{
            'X-CSRFToken': document.querySelector(`input[name="csrfmiddlewaretoken"]`).value,
            },
            body: data
        }).then(res => {
            if (res.ok) {
                alert('Profile updated successfully!');
                window.location.reload();
            } else { alert('Error')}
        }).catch(() => alert('Error updating profile'));
    });
});
