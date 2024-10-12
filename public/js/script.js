let bannerCancelingAnimation = () => {
  let closingBannerBtn = document.querySelector(".closing-banner-btn");
  let banner = document.querySelector(".closing-banner");

  if (closingBannerBtn) {
    closingBannerBtn.addEventListener("click", () => {
      banner.style.display = "none";
    });
  }

  let alert = document.querySelector(".alerts");
  let alertSuccess = document.querySelector(".alerts.alert-success");

  if (alert) {
    setTimeout(() => {
      alert.style.top = "-50%";
    }, 1200);
  }
};

const learningPgAnimation = () => {
  const sideContentBtn = document.querySelector(".learning-content-bar-cross");
  const leactureSideBar = document.querySelector(".leactures-info-bar");
  const mainLeactureContent = document.querySelector(".main-leacture-content");
  const maximizeScreenIcon = document.querySelector(".maximize-screen-icon");
  const minimizeScreenIcon = document.querySelector(".minimize-screen-icon");

  if (sideContentBtn) {
    sideContentBtn.addEventListener("click", () => {
      leactureSideBar.style.width = 0;
      mainLeactureContent.style.width = "100%";
    });
  }

  if (maximizeScreenIcon) {
    maximizeScreenIcon.addEventListener("click", () => {
      leactureSideBar.style.width = 0;
      mainLeactureContent.style.width = "100%";
    });
  }

  if (minimizeScreenIcon) {
    minimizeScreenIcon.addEventListener("click", () => {
      leactureSideBar.style.width = "30%";
      mainLeactureContent.style.width = "70%";
    });
  }
};

bannerCancelingAnimation();
learningPgAnimation();
