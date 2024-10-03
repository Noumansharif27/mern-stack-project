let alertCloseBtn = document.querySelector(".alert-close-btn");
let alert = document.querySelector(".alerts");

alertCloseBtn.addEventListener("click", () => {
  alert.style.display = "none";
});
