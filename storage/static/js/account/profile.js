document.addEventListener('DOMContentLoaded', function () {
    const updateForm = document.getElementById('update-form-btn');

    updateForm.addEventListener('click',   (event) => {
        const data = new FormData(document.querySelector('#profile-form'))

         fetch('/api/profile/', {
            method: 'POST',
            body: data
        }).then(res => {
             if (res.ok) {
                 alert('Updated successfully! Redirecting...')
                 window.location.reload()
             }
             else {
                 alert('Updating failed!')
             }
         }).catch(() => alert('Unknown Error'))

    });
});
