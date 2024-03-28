// Add JavaScript code here
// const moreBtn = document.getElementById("more-btn")
// const optionWindow = document.getElementById("more-options")
// function makeWindowNotVisible(){
//     optionWindow.classList.contains("notVisible") ? optionWindow.classList.remove("notVisible") : optionWindow.classList.add("notVisible");
// }
// moreBtn.addEventListener('click', makeWindowNotVisible)
// console.log("bha bha")


// Function to handle edit button click
function handleEdit(userDp, username, name, email, mobile, dob) {
    $('#editUsername').val(username);
    $('#editName').val(name);
    $('#editEmail').val(email);
    $('#editMobile').val(mobile);
    $('#editDob').val(dob);
    $('#editProfilePicture').attr('value', userDp);
    $('#userOldDp').attr('value', userDp);
    $('#previewProfilePicture').attr('src', `/uploads/userDp/${userDp || `default.png`}`);
    $('#editForm').attr('action', '/profile/edit');
    $('#editModal').modal('show');
}

// Attach event listener to edit button
$('#edit-button').click(function () {
    const userDp = $(this).data('userDp');
    const username = $(this).data('username');
    const name = $(this).data('name');
    const email = $(this).data('email');
    const mobile = $(this).data('mobile');
    const dob = $(this).data('dob');
    console.log("Usre dp", userDp)
    handleEdit(userDp, username, name, email, mobile, dob);
})

document.getElementById('editProfilePicture').addEventListener('change', handleFileChange);

function handleFileChange() {
    const fileInput = document.getElementById('editProfilePicture');
    const displayedDpPhoto = document.getElementById('previewProfilePicture');

    const file = fileInput.files[0];
    if (file) {
        displayedDpPhoto.src = URL.createObjectURL(file);
    }
}
