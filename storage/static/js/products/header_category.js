document.addEventListener('DOMContentLoaded', () => {
    function navbarCategory () {
        const navCategoryEl = document.querySelector('#nav-category')

        fetch(`/api/category/`)
            .then(res =>res.json())
            .then(data => {
                data.forEach(category => {
                    console.log(category)
                    if (!category.parent) {
                        navCategoryEl.innerHTML += `<a href="#" class="dropdown-item">${category.name}</a>`
                    }
                })
            })
    }

    navbarCategory()
})