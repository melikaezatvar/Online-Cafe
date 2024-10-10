function countItems () {
    fetch('/api/orders/')
        .then(res => res.json())
        .then(data => {
            if (data.length && data.at(-1).status === 'pending') {
                document.querySelector('#count-order-items').innerHTML = `${data.at(-1).items.length}`
                document.querySelector('#count-order-items').classList.remove('hidden-element')
            }
        })
}
countItems()