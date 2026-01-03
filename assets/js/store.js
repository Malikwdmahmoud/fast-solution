const products = [
  { id:"p1", name:"كاميرا IP 4MP خارجية", category:"cctv", price:250, desc:"كاميرا خارجية مقاومة للعوامل، جودة 4MP مع رؤية ليلية.", img:"assets/img/prod-cctv-1.jpg", featured:1 },
  { id:"p2", name:"كاميرا Dome داخلية 2MP", category:"cctv", price:160, desc:"كاميرا داخلية Dome مناسبة للمكاتب والمحلات.", img:"assets/img/prod-cctv-2.jpg", featured:2 },
  { id:"p3", name:"NVR 8 قنوات", category:"nvr", price:420, desc:"مسجل شبكي 8 قنوات يدعم مشاهدة عن بعد وتسجيل مستقر.", img:"assets/img/prod-nvr-1.jpg", featured:3 },
  { id:"p4", name:"DVR 16 قناة", category:"nvr", price:520, desc:"مسجل DVR 16 قناة مناسب للأنظمة التناظرية.", img:"assets/img/prod-dvr-1.jpg", featured:4 },
  { id:"p5", name:"سويتش PoE 8 Port", category:"switch", price:310, desc:"سويتش PoE لتشغيل كاميرات IP وتسهيل التمديد.", img:"assets/img/prod-sw-1.jpg", featured:2 },
  { id:"p6", name:"سويتش 24 Port", category:"switch", price:360, desc:"سويتش 24 بورت مناسب للشبكات المتوسطة.", img:"assets/img/prod-sw-2.jpg", featured:5 },
  { id:"p7", name:"جهاز بصمة دخول", category:"access", price:290, desc:"جهاز بصمة لإدارة دخول الموظفين وربط بالصلاحيات.", img:"assets/img/prod-access-1.jpg", featured:1 },
  { id:"p8", name:"قفل مغناطيسي للأبواب", category:"acc", price:95, desc:"قفل مغناطيسي قوي للأبواب ضمن أنظمة Access Control.", img:"assets/img/prod-acc-1.jpg", featured:6 },
];

const catNames = { all:"الكل", cctv:"كاميرات", nvr:"NVR/DVR", switch:"سويتشات", access:"Access Control", acc:"ملحقات" };

function money(v){ return `${v} ر.س`; }

function setCardBg(el, url){
  const img = new Image();
  img.onload = () => el.style.backgroundImage = `url("${url}")`;
  img.onerror = () => {
    el.style.backgroundImage =
      "linear-gradient(135deg, rgba(255,255,255,.12) 0%, rgba(255,255,255,0) 60%), linear-gradient(135deg,#0d6efd 0%,#0b4fc0 45%,#083a8f 100%)";
  };
  img.src = url;
}

function render(list){
  const grid = document.getElementById("productsGrid");
  const empty = document.getElementById("emptyState");
  grid.innerHTML = "";

  if (!list.length){
    empty.classList.remove("d-none");
    return;
  }
  empty.classList.add("d-none");

  list.forEach(p => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-3";
    col.innerHTML = `
      <div class="product-card h-100" role="button" data-id="${p.id}">
        <div class="product-img" id="img-${p.id}"></div>
        <div class="p-3">
          <div class="d-flex justify-content-between align-items-start gap-2">
            <div class="product-title">${p.name}</div>
            <div class="product-price">${money(p.price)}</div>
          </div>
          <div class="product-cat mt-2">${catNames[p.category] || p.category}</div>
          <div class="product-desc mt-2">${p.desc}</div>
          <div class="product-action mt-3">تفاصيل المنتج →</div>
        </div>
      </div>
    `;
    grid.appendChild(col);

    const imgBox = col.querySelector(`#img-${p.id}`);
    setCardBg(imgBox, p.img);
  });

  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", () => openModal(card.getAttribute("data-id")));
  });
}

function applyFilters(){
  const q = (document.getElementById("searchInput").value || "").trim().toLowerCase();
  const cat = document.getElementById("catSelect").value;
  const sort = document.getElementById("sortSelect").value;

  let list = [...products];

  if (cat !== "all") list = list.filter(p => p.category === cat);
  if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));

  if (sort === "priceAsc") list.sort((a,b)=>a.price-b.price);
  else if (sort === "priceDesc") list.sort((a,b)=>b.price-a.price);
  else if (sort === "nameAsc") list.sort((a,b)=>a.name.localeCompare(b.name, "ar"));
  else list.sort((a,b)=>(a.featured||999)-(b.featured||999));

  render(list);
}

function openModal(id){
  const p = products.find(x => x.id === id);
  if (!p) return;

  document.getElementById("pmTitle").textContent = p.name;
  document.getElementById("pmPrice").textContent = money(p.price);
  document.getElementById("pmDesc").textContent = p.desc;
  document.getElementById("pmCat").textContent = catNames[p.category] || p.category;

  const img = document.getElementById("pmImg");
  setCardBg(img, p.img);

  // Add order button if not exists
  let orderBtn = document.getElementById("pmOrderBtn");
  if (!orderBtn) {
    orderBtn = document.createElement("button");
    orderBtn.id = "pmOrderBtn";
    orderBtn.className = "btn btn-primary mt-3";
    orderBtn.textContent = "اطلب الآن";
    document.getElementById("productModal").querySelector(".modal-body").appendChild(orderBtn);
  }
  orderBtn.onclick = () => placeOrder(p);

  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}

function placeOrder(product) {
  // Simple order placement
  const order = {
    items: [{ product: product.name, quantity: 1, price: product.price }],
    total: product.price
  };

  fetch('http://localhost:5000/api/store/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
  .then(response => response.json())
  .then(result => {
    alert(result.msg || 'تم الطلب بنجاح');
  })
  .catch(error => {
    alert('خطأ في الطلب');
    console.error(error);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  render(products);
  ["searchInput","catSelect","sortSelect"].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener("input", applyFilters);
    el.addEventListener("change", applyFilters);
  });
});
