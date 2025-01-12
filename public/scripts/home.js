document.getElementById('searchInput').addEventListener('input', function () {
    const searchQuery = this.value.toLowerCase();
    const blogPosts = document.querySelectorAll('.blog-post');

    blogPosts.forEach(function (post) {
        const title = post.querySelector('h1').textContent.toLowerCase();
        const description = post.querySelector('p').textContent.toLowerCase();
        const category = post.querySelector('span').textContent.toLowerCase();

        if (title.includes(searchQuery) || description.includes(searchQuery) || category.includes(searchQuery)) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
});