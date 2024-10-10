document.addEventListener('DOMContentLoaded', () => {
    const productEl = document.querySelector('#product-id')
    const commentEl = document.querySelector('#comments')

    fetch(`/api/comment/${productEl.value}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            data.forEach(comment => {
                if (!comment.reply_comment) {
                    commentEl.innerHTML += `
                    <div class="flex flex-col my-3 bg-[#F7E2B7] rounded-2xl p-2 border-[3px] border-[#8b5e3c] min-h-[200px] relative">
                        <div class="flex gap-2 items-center">
                            <i class="fa-solid fa-user bg-gray-200 border-2 p-2 rounded-circle" style="font-size: 30px"></i>
                            <p class="text-[30px]">${comment.user}</p>
                        </div>
                        <hr class="my-2">
                        <div class="flex pt-2 pl-2 relative">
                            <p style="font-size: 25px">${comment.comment}</p>
                            <div class="text-[15px] align-self-end absolute right-0">${comment.create_at}</div>
                        </div>
                        <div id="reply-${comment.id}"></div>
                        <div id="reactions-${comment.id}" class="flex items-center gap-3 align-self-end absolute"></div>
                    </div>`
                    const reactionEl = commentEl.querySelector('#reactions-'+comment.id)

                    if (comment.reaction[0]) {
                        if (comment.reaction[0].react === 'L') {
                            reactionEl.innerHTML = `
                            <div class="flex flex-col items-center">
                                <i id="like-react-${comment.id}" data="${comment.reaction[0].react}" onclick="Like(this, ${comment.id})" class="fa-solid fa-thumbs-up" style="color: darkgreen; cursor: pointer; font-size: 30px"></i>
                                <p id="count-like-${comment.id}" style="color: darkgreen">${comment.count_like}</p>
                            </div>
                            <div class="flex flex-col items-center">
                                <i id="dislike-react-${comment.id}" data="${comment.reaction[0].react}" onclick="Dislike(this, ${comment.id})" class="fa-regular fa-thumbs-down" style="color: darkred; cursor: pointer; font-size: 30px"></i>
                                <p id="count-dislike-${comment.id}" style="color: darkred">${comment.count_dislike}</p>
                            </div>`
                        } else {
                            reactionEl.innerHTML = `
                            <div class="flex flex-col items-center">
                                <i id="like-react-${comment.id}" data="${comment.reaction[0].react}" onclick="Like(this, ${comment.id})" class="fa-regular fa-thumbs-up" style="color: darkgreen; cursor: pointer; font-size: 30px"></i>
                                <p id="count-like-${comment.id}" style="color: darkgreen">${comment.count_like}</p>
                            </div>
                            <div class="flex flex-col items-center">
                                <i id="dislike-react-${comment.id}" data="${comment.reaction[0].react}" onclick="Dislike(this, ${comment.id})" class="fa-solid fa-thumbs-down" style="color: darkred; cursor: pointer; font-size: 30px"></i>
                                <p id="count-dislike-${comment.id}" style="color: darkred">${comment.count_dislike}</p>
                            </div>`
                        }
                    } else {
                        reactionEl.innerHTML = `
                        <div class="flex flex-col items-center">
                            <i id="like-react-${comment.id}" onclick="Like(this, ${comment.id})" class="fa-regular fa-thumbs-up" style="color: darkgreen; cursor: pointer; font-size: 30px"></i>
                            <p id="count-like-${comment.id}" style="color: darkgreen">${comment.count_like}</p>
                        </div>
                        <div class="flex flex-col items-center">
                            <i id="dislike-react-${comment.id}" onclick="Dislike(this, ${comment.id})" class="fa-regular fa-thumbs-down" style="color: darkred; cursor: pointer; font-size: 30px"></i>
                            <p id="count-dislike-${comment.id}" style="color: darkred">${comment.count_dislike}</p>
                        </div>`
                    }
                } else {
                    commentEl.querySelector('#reply-'+comment.reply_comment.id).innerHTML += `
                    <div class="flex flex-col mx-auto my-3 bg-[#edcba5] p-2 border-[1px] border-[#8b5e3c] min-h-[100px] relative w-75">
                        <div class="flex gap-2 items-center">
                            <i class="fa-solid fa-user bg-gray-200 border-2 p-2 rounded-circle" style="font-size: 15px"></i>
                            <p class="text-[15px]">${comment.user}</p>
                        </div>
                        <hr class="my-2">
                        <div class="flex pt-2 pl-2 relative">
                            <div>
                                <p>${comment.comment}</p>
                            </div>
                            <div class="text-[15px] align-self-end absolute right-0">${comment.create_at}</div>
                        </div>
                        <div id="reactions-${comment.id}" class="flex items-center gap-3 align-self-end absolute"></div>
                    </div>`
                    const reactionEl = commentEl.querySelector('#reactions-'+comment.id)

                    if (comment.reaction[0]) {
                        if (comment.reaction[0].react === 'L') {
                            reactionEl.innerHTML = `
                            <div class="flex flex-col items-center">
                                <i id="like-react-${comment.id}" data="${comment.reaction[0].react}" onclick="Like(this, ${comment.id})" class="fa-solid fa-thumbs-up" style="color: darkgreen; cursor: pointer; font-size: 15px"></i>
                                <p id="count-like-${comment.id}" style="color: darkgreen">${comment.count_like}</p>
                            </div>
                            <div class="flex flex-col items-center">
                                <i id="dislike-react-${comment.id}" data="${comment.reaction[0].react}" onclick="Dislike(this, ${comment.id})" class="fa-regular fa-thumbs-down" style="color: darkred; cursor: pointer; font-size: 15px"></i>
                                <p id="count-dislike-${comment.id}" style="color: darkred">${comment.count_dislike}</p>
                            </div>`
                        } else {
                            reactionEl.innerHTML = `
                            <div class="flex flex-col items-center">
                                <i id="like-react-${comment.id}" data="${comment.reaction[0].react}" onclick="Like(this, ${comment.id})" class="fa-regular fa-thumbs-up" style="color: darkgreen; cursor: pointer; font-size: 15px"></i>
                                <p id="count-like-${comment.id}" style="color: darkgreen">${comment.count_like}</p>
                            </div>
                            <div class="flex flex-col items-center">
                                <i id="dislike-react-${comment.id}" data="${comment.reaction[0].react}" onclick="Dislike(this, ${comment.id})" class="fa-solid fa-thumbs-down" style="color: darkred; cursor: pointer; font-size: 15px"></i>
                                <p id="count-dislike-${comment.id}" style="color: darkred">${comment.count_dislike}</p>
                            </div>`
                        }
                    } else {
                        reactionEl.innerHTML = `
                        <div class="flex flex-col items-center">
                            <i id="like-react-${comment.id}" onclick="Like(this, ${comment.id})" class="fa-regular fa-thumbs-up" style="color: darkgreen; cursor: pointer; font-size: 15px"></i>
                            <p id="count-like-${comment.id}" style="color: darkgreen">${comment.count_like}</p>
                        </div>
                        <div class="flex flex-col items-center">
                            <i id="dislike-react-${comment.id}" onclick="Dislike(this, ${comment.id})" class="fa-regular fa-thumbs-down" style="color: darkred; cursor: pointer; font-size: 15px"></i>
                            <p id="count-dislike-${comment.id}" style="color: darkred">${comment.count_dislike}</p>
                        </div>`
                    }
                }

            })
        })
})