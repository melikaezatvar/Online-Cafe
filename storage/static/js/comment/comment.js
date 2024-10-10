document.addEventListener('DOMContentLoaded', () => {
    const productEl = document.querySelector('#product-id')
    const commentEl = document.querySelector('#comments')

    fetch(`/api/comment/${productEl.value}`)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                commentEl.innerHTML += `<h4>*There are no comments yet*</h4>`
            }
            data.forEach(comment => {
                if (!comment.reply_comment) {
                    commentEl.innerHTML += `
                    <div class="comment-container">
                        <div class="uc-container">
                            <i class="fa-solid fa-user user-comment-icon"></i>
                            <p class="text-[30px]">${comment.user}</p>
                        </div>
                        <hr style="margin-bottom: .5rem !important; margin-top: .5rem !important;">
                        <div style="display: flex; position: relative; padding-left: 0.5rem !important; padding-top: 0.5rem !important;">
                            <p style="font-size: 25px; max-width: 85%">${comment.comment}</p>
                            <div style="font-size: 15px; right: 0; position: absolute;">${comment.create_at}</div>
                        </div>
                        <div id="reply-${comment.id}"></div>
                        <div id="reactions-${comment.id}" class="reaction-container"></div>
                        <i onclick="relpyComment(this)" value="${comment.id}" class="fa-solid fa-reply reply-icon"></i>
                        <form id="reply-to-${comment.id}" method="POST" class="hidden-element" style="position: relative; margin: 1rem auto !important;">
                            <textarea required type="text" name="comment" maxlength="200" rows="4" placeholder="Your reply"
                                style="resize: none; border: #606060 solid 2px; width: 75vh; padding: 0.5rem"></textarea>
                            <input type="text" value="${comment.id}" name="reply_comment" class="hidden-element">
                            <button type="submit" class="reply-btn">Submit</button>
                        </form>
                    </div>`
                    const reactionEl = commentEl.querySelector('#reactions-'+comment.id)

                    if (comment.reaction && comment.reaction[0]) {
                        if (comment.reaction[0].react === 'L') {
                            reactionEl.innerHTML = `
                            <div class="react-container">
                                <i id="like-react-${comment.id}" data="${comment.reaction[0].react}" onclick="Like(this, ${comment.id})" class="fa-solid fa-thumbs-up" style="color: darkgreen; cursor: pointer; font-size: 30px"></i>
                                <p id="count-like-${comment.id}" style="color: darkgreen">${comment.count_like}</p>
                            </div>
                            <div class="react-container">
                                <i id="dislike-react-${comment.id}" data="${comment.reaction[0].react}" onclick="Dislike(this, ${comment.id})" class="fa-regular fa-thumbs-down" style="color: darkred; cursor: pointer; font-size: 30px"></i>
                                <p id="count-dislike-${comment.id}" style="color: darkred">${comment.count_dislike}</p>
                            </div>`
                        } else {
                            reactionEl.innerHTML = `
                            <div class="react-container">
                                <i id="like-react-${comment.id}" data="${comment.reaction[0].react}" onclick="Like(this, ${comment.id})" class="fa-regular fa-thumbs-up" style="color: darkgreen; cursor: pointer; font-size: 30px"></i>
                                <p id="count-like-${comment.id}" style="color: darkgreen">${comment.count_like}</p>
                            </div>
                            <div class="react-container">
                                <i id="dislike-react-${comment.id}" data="${comment.reaction[0].react}" onclick="Dislike(this, ${comment.id})" class="fa-solid fa-thumbs-down" style="color: darkred; cursor: pointer; font-size: 30px"></i>
                                <p id="count-dislike-${comment.id}" style="color: darkred">${comment.count_dislike}</p>
                            </div>`
                        }
                    } else {
                        reactionEl.innerHTML = `
                        <div class="react-container">
                            <i id="like-react-${comment.id}" onclick="Like(this, ${comment.id})" class="fa-regular fa-thumbs-up" style="color: darkgreen; cursor: pointer; font-size: 30px"></i>
                            <p id="count-like-${comment.id}" style="color: darkgreen">${comment.count_like}</p>
                        </div>
                        <div class="react-container">
                            <i id="dislike-react-${comment.id}" onclick="Dislike(this, ${comment.id})" class="fa-regular fa-thumbs-down" style="color: darkred; cursor: pointer; font-size: 30px"></i>
                            <p id="count-dislike-${comment.id}" style="color: darkred">${comment.count_dislike}</p>
                        </div>`
                    }
                } else {
                    commentEl.querySelector('#reply-'+comment.reply_comment.id).innerHTML += `
                    <div class="reply-comment-container">
                        <div class="uc-container">
                            <i class="fa-solid fa-user user-comment-icon" style="font-size: 15px !important;"></i>
                            <p class="text-[15px]">${comment.user}</p>
                        </div>
                        <hr style="margin-bottom: .5rem !important; margin-top: .5rem !important;">
                        <div style="display: flex; position: relative; padding-left: 0.5rem !important; padding-top: 0.5rem !important;">
                            <p style="max-width: 85%">${comment.comment}</p>
                            <div style="font-size: 15px; right: 0; position: absolute;">${comment.create_at}</div>
                        </div>
                        <div id="reactions-${comment.id}" class="reaction-container"></div>
                    </div>`
                    const reactionEl = commentEl.querySelector('#reactions-'+comment.id)

                    if (comment.reaction && comment.reaction[0]) {
                        if (comment.reaction[0].react === 'L') {
                            reactionEl.innerHTML = `
                            <div class="react-container">
                                <i id="like-react-${comment.id}" data="${comment.reaction[0].react}" onclick="Like(this, ${comment.id})" class="fa-solid fa-thumbs-up" style="color: darkgreen; cursor: pointer; font-size: 15px"></i>
                                <p id="count-like-${comment.id}" style="color: darkgreen">${comment.count_like}</p>
                            </div>
                            <div class="react-container">
                                <i id="dislike-react-${comment.id}" data="${comment.reaction[0].react}" onclick="Dislike(this, ${comment.id})" class="fa-regular fa-thumbs-down" style="color: darkred; cursor: pointer; font-size: 15px"></i>
                                <p id="count-dislike-${comment.id}" style="color: darkred">${comment.count_dislike}</p>
                            </div>`
                        } else {
                            reactionEl.innerHTML = `
                            <div class="react-container">
                                <i id="like-react-${comment.id}" data="${comment.reaction[0].react}" onclick="Like(this, ${comment.id})" class="fa-regular fa-thumbs-up" style="color: darkgreen; cursor: pointer; font-size: 15px"></i>
                                <p id="count-like-${comment.id}" style="color: darkgreen">${comment.count_like}</p>
                            </div>
                            <div class="react-container">
                                <i id="dislike-react-${comment.id}" data="${comment.reaction[0].react}" onclick="Dislike(this, ${comment.id})" class="fa-solid fa-thumbs-down" style="color: darkred; cursor: pointer; font-size: 15px"></i>
                                <p id="count-dislike-${comment.id}" style="color: darkred">${comment.count_dislike}</p>
                            </div>`
                        }
                    } else {
                        reactionEl.innerHTML = `
                        <div class="react-container">
                            <i id="like-react-${comment.id}" onclick="Like(this, ${comment.id})" class="fa-regular fa-thumbs-up" style="color: darkgreen; cursor: pointer; font-size: 15px"></i>
                            <p id="count-like-${comment.id}" style="color: darkgreen">${comment.count_like}</p>
                        </div>
                        <div class="react-container">
                            <i id="dislike-react-${comment.id}" onclick="Dislike(this, ${comment.id})" class="fa-regular fa-thumbs-down" style="color: darkred; cursor: pointer; font-size: 15px"></i>
                            <p id="count-dislike-${comment.id}" style="color: darkred">${comment.count_dislike}</p>
                        </div>`
                    }
                }

            })
        })
})