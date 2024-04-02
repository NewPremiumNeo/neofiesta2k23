lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true,
    'alwaysShowNavOnTouchDevices': true,
    'disableScrolling': true,
})

const socket = io();
socket.on('like', (data) => {
    const likeCount = document.getElementById(`totalLike-${data.photoId}`);
    if (likeCount) {
        if (data.totalLikes == 0) {
            likeCount.textContent = ''
        } else
            likeCount.textContent = `${data.totalLikes} like${data.totalLikes !== 1 ? 's' : ''}`;
    }

});

document.addEventListener("DOMContentLoaded", function () {
    var likeButtons = document.querySelectorAll(".btn-like");

    // Check if the user has already liked posts and update button appearance
    likeButtons.forEach((button) => {
        var photoId = button.getAttribute("data-photo-id");
        const likeCount = document.getElementById(`totalLike-${photoId}`);
        fetch(`/photo/${photoId}/isliked`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.liked) {
                    button.classList.remove("ri-heart-line");
                    button.classList.add("ri-heart-fill");
                }
                if (data.totalLikes == 0) {
                    likeCount.textContent = ''
                } else
                    likeCount.textContent = `${data.totalLikes} like${data.totalLikes !== 1 ? 's' : ''}`;
            })
            .catch(error => console.error('Error:', error));
    });

    var saveButtons = document.querySelectorAll(".btn-save");

    saveButtons.forEach((button) => {
        var photoId = button.getAttribute("data-photo-id");
        fetch(`/photo/${photoId}/issaved`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.saved) {
                    button.classList.remove("ri-bookmark-3-line");
                    button.classList.add("ri-bookmark-3-fill");
                }
            })
            .catch(error => console.error('Error:', error));
    });
});

// Function to handle like button click
async function liketoggle(photoId) {
    const button = document.getElementById(`like-${photoId}`);
    fetch(`/photo/like`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ photoId: photoId }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.liked) {
                button.classList.remove("ri-heart-line");
                button.classList.add("ri-heart-fill");
            } else {
                button.classList.remove("ri-heart-fill");
                button.classList.add("ri-heart-line");
            }

            // Emit 'like' event to notify server about the like
            socket.emit('like', photoId);
        })
        .catch(error => console.error('Error:', error));
}

// Function to handle save button click
async function savetoggle(photoId) {
    const button = document.getElementById(`save-${photoId}`);
    fetch(`/photo/save`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ photoId: photoId }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.saved) {
                button.classList.remove("ri-bookmark-3-line");
                button.classList.add("ri-bookmark-3-fill");
            } else {
                button.classList.remove("ri-bookmark-3-fill");
                button.classList.add("ri-bookmark-3-line");
            }
        })
        .catch(error => console.error('Error:', error));
}
<<<<<<< HEAD
=======

>>>>>>> 388ac3172c1363d05a143ba2964c25154b3dee6c
