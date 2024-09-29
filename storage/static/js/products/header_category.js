document.addEventListener('DOMContentLoaded', () => {
    function navbarCategory () {
        const navCategoryEl = document.querySelector('#nav-category')

        fetch(`/api/category/`)
            .then(res => res.json())
            .then(data => {
                data.forEach(category => {
                    if (category.parent.length === 0) {
                        if (category.get_childes.lenth === 0) {
                            navCategoryEl.innerHTML += `<a class="dropdown-item">${category.name}</a>`
                        }
                        else {
                            navCategoryEl.innerHTML += `
                            <div class="dropdown-submenu">
                                <a href="/api/category/${category.name}">${category.name}     ></a>
                                <div id="category-${category.name}" class="dropdown-content-sub"></div>
                            </div>`

                            category.get_childes.forEach((e) => {
                                 navCategoryEl.querySelector('#category-'+category.name).innerHTML += `
                                 <a id="category-${e}" href="/api/category/${e}">${e}</a>`
                            })
                        }
                    }
                    else if (category.parent.length !== 0 && category.get_childes.length !== 0) {
                        navCategoryEl.querySelector('#category-'+category.name).outerHTML = `
                            <div class="dropdown-submenu${category.name}">  
                                <a href="/api/category/${category.name}">${category.name}     ></a>
                                <div id="category-${category.name}" class="dropdown-content-sub${category.name}"></div>
                            </div>
                                 `
                        category.get_childes.forEach((e) => {
                            navCategoryEl.querySelector('#category-'+category.name).innerHTML += `
                                 <a id="category-${e}" href="/api/category/${e}">${e}</a>`
                        })
                        document.head.innerHTML += `
                            <style>
                            .dropdown-submenu${category.name} {
                                position: relative
                            }
                            .dropdown-submenu${category.name}:hover .dropdown-content-sub${category.name} {
                                color: #DA9F5B;
                                display: block;
                            }
                            
                            .dropdown-content-sub${category.name} {
                                right: 100%;
                                display: none;
                                position: absolute;
                                left: 100%;
                                top: 0;
                                background-color: #f9f9f9;
                                min-width: 160px;
                                box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                                direction: rtl;
                                text-align: right;
                            }
                            </style>`
                    }
                })
            })
    }
    navbarCategory()
})

