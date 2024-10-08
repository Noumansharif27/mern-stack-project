let bannerCancelingAnimation = () => {
  let closingBannerBtn = document.querySelector(".closing-banner-btn");
  let banner = document.querySelector(".closing-banner");

  closingBannerBtn.addEventListener("click", () => {
    banner.style.display = "none";
  });

  let alert = document.querySelector(".alerts");
  let alertSuccess = document.querySelector(".alerts.alert-success");

  setTimeout(() => {
    alert.style.top = "-50%";
  }, 1200);
};

bannerCancelingAnimation();
