function Logout() {
    fetch('/api/logout/',{
        method : 'POST',
        headers:{
            'X-CSRFToken': document.querySelector(`input[name="csrfmiddlewaretoken"]`).value,}
        }
        )
             .then(res => {
             if (res.ok) {
                 alert('logout successful! Redirecting...')
                 window.location.reload()
             } else { alert('Error')}
         }).catch(() => alert('Unknown Error'))

}