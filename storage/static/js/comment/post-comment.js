document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.querySelector('#comment-form')
    const productEl = document.querySelector('#product-id')

    commentForm.addEventListener('submit', (event) => {
        event.preventDefault()
        const data = new FormData(commentForm)

        fetch(`/api/comment/${productEl.value}/`, {
            method: 'POST',
            headers:{
                'X-CSRFToken': document.querySelector(`input[name="csrfmiddlewaretoken"]`).value,
            },
            body: data
        }).then(res => res.json())
            .then(comment => {
                alert('Your comment has been successfully registered. It will be reviewed and posted by the support team soon')
                commentForm.reset()
            }).catch(() => alert('Unknown Error !!!'))
    })
})

function relpyComment(element) {
    const replyEl = document.querySelector('#reply-to-'+element.getAttribute('value'))
    const productEl = document.querySelector('#product-id')
    replyEl.classList.toggle('hidden-element')

    replyEl.addEventListener('submit', (event) => {
        event.preventDefault()
        const data = new FormData(replyEl)

        fetch(`/api/comment/${productEl.value}/`, {
            method: 'POST',
            headers:{
                'X-CSRFToken': document.querySelector(`input[name="csrfmiddlewaretoken"]`).value,
            },
            body: data
        }).then(res => res.json())
            .then(comment => {
                alert('Your reply has been successfully registered. It will be reviewed and posted by the support team soon')
                replyEl.reset()
                replyEl.classList.toggle('hidden-element')
            }).catch(() => alert('Unknown Error !!!'))
    })
}