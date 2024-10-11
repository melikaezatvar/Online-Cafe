function countItems () {
    console.log('Checking Items ...')
    fetch('/api/orders/')
        .then(res => res.json())
        .then(data => {
            if (data.length) {
                if (data.at(0).status === 'pending') {
                    document.querySelector('#count-order-items').innerHTML = `${data.at(0).items.length}`
                    document.querySelector('#count-order-items').classList.remove('hidden-element')
                } else {
                    document.querySelector('#count-order-items').classList.add('hidden-element')
                }
            }
        })
}
countItems()