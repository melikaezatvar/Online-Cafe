function showSection(section, func) {
        const sections = ['personal-info', 'favorite-list', 'orders', 'user-comments'];
        sections.forEach(s => {
            document.getElementById(s).classList.add('d-none');
        });
        document.getElementById(section).classList.remove('d-none');

        const tabs = ['personal-info-tab', 'favorite-list-tab', 'orders-tab','user-comments-tab'];
        tabs.forEach(tab => {
            document.getElementById(tab).classList.remove('active');
        });
        document.getElementById(section + '-tab').classList.add('active');
        if (func) {
            func()
        }
    }

document.addEventListener('DOMContentLoaded', function () {
    const updatePassword = document.getElementById('update-password-btn');
    const updateProfile = document.getElementById('update-profile-btn');

    updatePassword.addEventListener('click', (event) => {
        event.preventDefault();
        const data = new FormData(document.querySelector('#password-form'));

        fetch('/api/profile/resetpass/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value,
            },
            body: data
        }).then(res => {
            if (res.ok) {
                alert('Updated successfully! Redirecting...');
                window.location.reload();
            } else {
                alert('Error updating password');
            }
        }).catch(() => alert('Error updating password'));
    });

    updateProfile.addEventListener('click', (event) => {
        event.preventDefault();
        const data = new FormData(document.querySelector('#profile-form'));

        fetch('/api/profile/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value,
            },
            body: data
        }).then(res => {
            if (res.ok) {
                alert('Profile updated successfully!');
                window.location.reload();
            } else {
                alert('Error updating profile');
            }
        }).catch(() => alert('Error updating profile'));
    });
});
