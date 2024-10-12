document.addEventListener('DOMContentLoaded', () => {
    const menuEl = document.querySelector('#menu-products')
    fetch(`/api/category/`)
        .then(res => res.json())
        .then(data => {
            data.forEach(category => {
                if (category.get_childes.length === 0 && category.get_products.length !== 0) {
                    menuEl.innerHTML += `
                    <div class="product-title"><p id="title-${category.name}"></p></div>
                    <div id="p-category-${category.name}" style="grid-template-columns: repeat(3, minmax(0, 1fr)); display: grid; gap: 50px"></div>`
                    if (!category.parent.length) {
                        menuEl.querySelector('#title-'+category.name).innerHTML = category.name
                    } else {
                        menuEl.querySelector('#title-'+category.name).innerHTML = `${category.parent.at(-1)}-${category.name}`
                    }
                    category.get_products.forEach(product => {
                        menuEl.querySelector('#p-category-'+category.name).innerHTML += `
                        <a href="/api/product/${product.id}" class="row product" style="height: 25vh">
                            <div id="p-${product.id}" style="position: relative">
                                <h5 class="menu-price">$${product.price}</h5>
                            </div>
                            <h5>${product.name}</h5>
                        </a>`

                        if (product.images.length) {
                            menuEl.querySelector('#p-'+product.id).innerHTML += `
                            <img class="rounded-circle mb-3 mb-sm-0" src="${product.images[0].src}" alt="${product.images[0].alt}" style="height: 20vh; width: 20vh">`
                        } else {
                            menuEl.querySelector('#p-'+product.id).innerHTML += `
                            <img class="rounded-circle mb-3 mb-sm-0" src="/media/product/images/site_image.jpeg" alt="no-image-available" style="height: 20vh; width: 20vh">`
                        }
                    })
                }
            })
        })
    })
