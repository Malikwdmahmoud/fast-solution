const heroSlides = [
  {
    tag: "CCTV",
    title: "تركيب أنظمة كاميرات المراقبة",
    desc: "نوفر لك أفضل حلول CCTV من التوريد حتى التركيب والضمان، مع تصميم الشبكة والتسجيل حسب احتياجك.",
    img: "assets/img/slide-cctv.jpg"
  },
  {
    tag: "Access",
    title: "أجهزة الإنتركم والأكسس كنترول",
    desc: "تحكم دخول احترافي: بصمة/كرت/وجه مع صلاحيات وتقارير وربط بالأبواب حسب احتياج المؤسسة.",
    img: "assets/img/slide-access.jpg"
  },
  {
    tag: "Accounting",
    title: "الأنظمة المحاسبية والإدارية",
    desc: "بيع وتخصيص أنظمة محاسبة/مخازن/مبيعات مع تدريب ودعم فني لضمان أفضل تشغيل.",
    img: "assets/img/slide-acc.jpg"
  },
  {
    tag: "QR",
    title: "QR Code والمنيو الإلكتروني",
    desc: "منيو إلكتروني احترافي مع QR سريع وإمكانية تحديث المحتوى بسهولة وربط مع واتساب وروابط مباشرة.",
    img: "assets/img/slide-qr.jpg"
  }
];

function setBg(el, url){
  const img = new Image();
  img.onload = () => {
    el.style.backgroundImage = `url("${url}")`;
  };
  img.onerror = () => {
    el.style.backgroundImage =
      "radial-gradient(900px 500px at 20% 20%, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 60%), linear-gradient(135deg,#0d6efd 0%,#0b4fc0 45%,#083a8f 100%)";
  };
  img.src = url;
}

document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("heroTitle");
  const desc = document.getElementById("heroDesc");
  const tag = document.getElementById("heroTag");
  const bg = document.getElementById("heroBg");

  if (!title || !desc || !tag || !bg) return;

  let i = 0;
  function apply(){
    const s = heroSlides[i];
    tag.textContent = s.tag;
    title.textContent = s.title;
    desc.textContent = s.desc;
    setBg(bg, s.img);
    i = (i + 1) % heroSlides.length;
  }

  apply();
  setInterval(apply, 4500);

  // counters in home page
  document.querySelectorAll(".counter-num").forEach((el) => {
    const target = parseInt(el.getAttribute("data-counter"), 10) || 0;
    const duration = 900;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(target * p).toString();
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toString();
    }
    requestAnimationFrame(tick);
  });
});
