// Get the modal and buttons
var modal = document.getElementById("contactModal");
var btn = document.getElementById("contactInfoBtn");
var span = document.getElementById("closeModal");

// When the user clicks the "Contact info" link, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks the close button (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
