function loadUserComments() {
    fetch('/api/user-comments/', {
        method: 'GET',
        headers: {
            'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value,
        }
    })
    .then(response => response.json())
    .then(comments => {
        const commentsList = document.getElementById('user-comments-list');
        commentsList.innerHTML = '';
        if (comments.length === 0) {
            commentsList.innerHTML = '<li>No comments found.</li>';
        } else {
            comments.forEach(comment => {
                console.log(comment)
                const li = document.createElement('li');
                li.style.position = 'relative';
                li.innerHTML += `
                        <div class="comment-item" style="border: 1px solid #ddd; padding: 10px; border-radius: 10px; display: flex; margin-bottom: 10px; align-items: center; background-color: #fff;">
                            <div style="flex-grow: 1;">
                                <p style="font-size: 16px; font-weight: bold;">${comment.comment}</p>
                            </div>
                            <i onclick="deleteComment(${comment.id})" class="fa-solid fa-trash" style="position: absolute; top: 10px; right: 10px; color:#ce7c3d; cursor: pointer;"></i>
                        </div>
                    `;
                commentsList.appendChild(li);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching user comments:', error);
    });
}

function deleteComment(id) {
    fetch(`/api/comment/delete/${id}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value,
        }
    }).finally(()=>loadUserComments())

}
