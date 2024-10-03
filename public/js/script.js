let bannerCancelingAnimation = () => {
  let closingBannerBtn = document.querySelector(".closing-banner-btn");
  let banner = document.querySelector(".closing-banner");

  closingBannerBtn.addEventListener("click", () => {
    banner.style.display = "none";
  });
};

bannerCancelingAnimation();
