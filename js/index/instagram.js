$(document).ready(function() {
    const accessToken = 'YOUR_ACCESS_TOKEN';
    const userId = '6230017228'; // Replace with your user ID
    const count = 6; // Number of posts to fetch

    const apiUrl = `https://graph.instagram.com/${userId}/media?fields=id,media_type,media_url,permalink,timestamp&limit=${count}&access_token=${accessToken}`;

    $.ajax({
        url: apiUrl,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            const posts = response.data;
            const feedContainer = $('.instagram-feed');

            posts.forEach(post => {
                const postUrl = post.permalink;
                const imageUrl = post.media_url;

                const postElement = $('<div class="instagram-post"></div>');
                const linkElement = $('<a target="_blank"></a>').attr('href', postUrl);
                const imageElement = $('<img>').attr('src', imageUrl).attr('alt', 'Instagram Post');

                linkElement.append(imageElement);
                postElement.append(linkElement);
                feedContainer.append(postElement);
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching Instagram posts:', error);
        }
    });
});
