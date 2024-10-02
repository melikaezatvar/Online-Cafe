document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.star-rating input').forEach((rate) => {
        rate.addEventListener('change',  () => {
            fetch(`/api/rating/${this.value}`, {
                method: 'POST',
                headers:{
                    'X-CSRFToken': document.querySelector(`input[name="csrfmiddlewaretoken"]`).value,
                },
            })
        });
    });
})

