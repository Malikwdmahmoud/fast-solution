function setTileBg(el, url){
  const img = new Image();
  img.onload = () => {
    el.style.backgroundImage = `url("${url}")`;
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
  };
  img.onerror = () => {
    el.style.backgroundImage =
      "radial-gradient(900px 500px at 20% 20%, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 60%), linear-gradient(135deg,#0d6efd 0%,#0b4fc0 45%,#083a8f 100%)";
  };
  img.src = url;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".work-img").forEach(el => {
    const url = el.getAttribute("data-bg");
    if (url) setTileBg(el, url);
  });

  document.querySelectorAll(".logo-tile").forEach(el => {
    const url = el.getAttribute("data-logo");
    if (!url) return;
    const img = new Image();
    img.onload = () => {
      el.textContent = "";
      el.style.backgroundImage = `url("${url}")`;
      el.style.backgroundSize = "contain";
      el.style.backgroundRepeat = "no-repeat";
      el.style.backgroundPosition = "center";
    };
    img.src = url;
  });
});
