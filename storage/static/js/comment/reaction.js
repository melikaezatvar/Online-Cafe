function Like(element, id) {
    const data = element.getAttribute('data')
    const dislikeEl = document.querySelector('#dislike-react-'+id)
    const likeNum = document.querySelector('#count-like-'+id)
    const dislikeNum = document.querySelector('#count-dislike-'+id)

    if (data === 'L') {
        fetch(`/api/reaction/${id}/`, {
            method: 'DELETE',
            headers:{
                'X-CSRFToken': document.querySelector(`input[name="csrfmiddlewaretoken"]`).value,
            },
        }).then(() => {
            element.setAttribute('data', '')
            dislikeEl.setAttribute('data', '')
            likeNum.innerHTML = parseInt(likeNum.innerHTML, 10) - 1

        })
    } else  {
        fetch(`/api/reaction/${id}/L/`, {
            method: 'POST',
            headers:{
                'X-CSRFToken': document.querySelector(`input[name="csrfmiddlewaretoken"]`).value,
            },
        }).then(() => {
            if (data === 'D') {
                dislikeNum.innerHTML = parseInt(dislikeNum.innerHTML, 10) - 1
                dislikeEl.classList.remove('fa-solid')
                dislikeEl.classList.add('fa-regular')
            }
            likeNum.innerHTML = parseInt(likeNum.innerHTML, 10) + 1
            element.setAttribute('data', 'L')
            dislikeEl.setAttribute('data', 'L')
        })
    }
    element.classList.toggle('fa-solid')
    element.classList.toggle('fa-regular')
}
function Dislike(element, id) {
    const data = element.getAttribute('data')
    const likeEl = document.querySelector('#like-react-'+id)
    const likeNum = document.querySelector('#count-like-'+id)
    const dislikeNum = document.querySelector('#count-dislike-'+id)

    if (data === 'D') {
        fetch(`/api/reaction/${id}/`, {
            method: 'DELETE',
            headers:{
                'X-CSRFToken': document.querySelector(`input[name="csrfmiddlewaretoken"]`).value,
            },
        }).then(() => {
            element.setAttribute('data', '')
            likeEl.setAttribute('data', '')
            dislikeNum.innerHTML = parseInt(dislikeNum.innerHTML, 10) - 1

        })
    } else  {
        fetch(`/api/reaction/${id}/D/`, {
            method: 'POST',
            headers:{
                'X-CSRFToken': document.querySelector(`input[name="csrfmiddlewaretoken"]`).value,
            },
        }).then(() => {
            if (data === 'L') {
                likeNum.innerHTML = parseInt(likeNum.innerHTML, 10) - 1
                likeEl.classList.remove('fa-solid')
                likeEl.classList.add('fa-regular')
            }
            dislikeNum.innerHTML = parseInt(dislikeNum.innerHTML, 10) + 1
            element.setAttribute('data', 'D')
            likeEl.setAttribute('data', 'D')
        })
    }
    element.classList.toggle('fa-solid')
    element.classList.toggle('fa-regular')
}