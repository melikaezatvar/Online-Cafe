function Logout() {
    fetch('/api/logout/',{
        method : 'GET'
        }
        )
             .then(res => {
             if (res.ok) {
                 alert('logout successful! Redirecting...')
                 window.location.reload()
             }
         }).catch(() => alert('Unknown Error'))

}