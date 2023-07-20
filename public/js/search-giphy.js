console.log('here');

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search  ')

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const searchTerm = searchInput.value.replace(" ", "+");

    window.location.href = `/homepage/${searchTerm}`;
})