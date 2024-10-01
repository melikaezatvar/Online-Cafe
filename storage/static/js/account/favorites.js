document.addEventListener('DOMContentLoaded', () => {
    const favoriteList = document.querySelector('#favorite-items-list');

    const fetchFavorites = () => {
        fetch('/api/favorites/')
            .then(response => response.json())
            .then(data => {
                favoriteList.innerHTML = '';
                data.forEach(product => {
                    const li = document.createElement('li');
                    li.innerHTML = `${product.name} - Price: $${product.price} 
                                    <a href="#" class="remove-favorite-btn" data-id="${product.id}">Delete</a>`;
                    favoriteList.appendChild(li);
                });
            })
            .catch(err => console.error('Error fetching favorites:', err));
    };


    const handleRemoveFavorite = (event) => {
        const productId = event.target.getAttribute('data-id');

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
        if (event.target.classList.contains('remove-favorite-btn')) {
            handleRemoveFavorite(event);
        }
    });

    fetchFavorites();
});
