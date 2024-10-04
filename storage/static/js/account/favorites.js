document.addEventListener('DOMContentLoaded', () => {
    const favoriteList = document.querySelector('#favorite-items-list');

    const fetchFavorites = () => {
        fetch('/api/favorites/')
            .then(response => response.json())
            .then(data => {
                favoriteList.innerHTML = ''
                if (data.length === 0) {
                    favoriteList.innerHTML = '<li>No items in favorite list.</li>';
                } else {
                    data.forEach(product => {
                        const li = document.createElement('li');
                        li.style.position = 'relative';

                        const imageSrc = product.images.length ? product.images[0].src : '/media/product/images/site_image.jpeg';
                        li.innerHTML += `
                            <a href="/api/product/${product.id}/" style="text-decoration: none; color: inherit;">
                                <div class="row product" style="display: flex; align-items: center; padding: 10px; border: 1px solid #ddd; border-radius: 10px;">
                                    <img src="${imageSrc}" class="rounded-circle mb-3 mb-sm-0" style="width: 100px; height: 100px; object-fit: cover; margin-right: 10px;">
                                    <div style="display: flex; flex-direction: column;">
                                        <div style="font-size: 20px; font-weight: bold;">$${product.price}</div>
                                        <div style="font-size: 18px;">${product.name}</div>
                                    </div>
                                </div>
                            </a>
                            <a href="#" class="remove-favorite-btn" data-id="${product.id}" style="position: absolute; top: 10px; right: 10px; background: none; border: none; cursor: pointer;">
                                <i class="fa-solid fa-trash"></i>
                            </a>
                        `;

                        favoriteList.appendChild(li);
                    });
                }
            })
            .catch(err => console.error('Error fetching favorites:', err));
    };

    const handleRemoveFavorite = (event) => {
        const productId = event.target.closest('.remove-favorite-btn').getAttribute('data-id');

        fetch(`/api/favorites/${productId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value,
            },
        }).then(res => {
            if (res.ok) {
                fetchFavorites();
            } else {
                alert('Error removing favorite');
            }
        }).catch(err => console.error('Error removing favorite:', err));

        event.preventDefault();
    };

    favoriteList.addEventListener('click', (event) => {
        if (event.target.closest('.remove-favorite-btn')) {
            handleRemoveFavorite(event);
        }
    });

    fetchFavorites();
});
