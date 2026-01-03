function getUserSafe(){
  try { return JSON.parse(localStorage.getItem("fs_user") || "null"); }
  catch { return null; }
}

function setUser(u){
  localStorage.setItem("fs_user", JSON.stringify(u));
}

function getUsers(){
  try { return JSON.parse(localStorage.getItem("fs_users") || "[]"); }
  catch { return []; }
}

function setUsers(list){
  localStorage.setItem("fs_users", JSON.stringify(list));
}

function $(sel){ return document.querySelector(sel); }
function $all(sel){ return document.querySelectorAll(sel); }

function showWelcome(){
  const el = document.getElementById("welcomeText");
  if (!el) return;
  const u = getUserSafe();
  if (u?.type === "user") el.textContent = `مرحباً ${u.name} 👋`;
  else if (u?.type === "guest") el.textContent = `مرحباً ${u.name || "ضيف"} 👋`;
  else el.textContent = `مرحباً بك 👋`;
}

function attachLogout(){
  $all("[data-logout]").forEach(btn => {
    btn.addEventListener("click", () => {
      localStorage.removeItem("fs_user");
    });
  });
}

function initYear(){
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

function initLoginTabs(){
  const tabs = $all(".tab-btn");
  if (!tabs.length) return;

  function activate(tab){
    tabs.forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
    $all(".tab-panel").forEach(p => p.classList.remove("active"));
    const panel = document.getElementById(`tab-${tab}`);
    if (panel) panel.classList.add("active");
  }

  tabs.forEach(btn => btn.addEventListener("click", () => activate(btn.dataset.tab)));

  // Login form
  const loginForm = $("#loginForm");
  if (loginForm){
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(loginForm).entries());

      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.token) {
          localStorage.setItem('token', result.token);
          setUser({ type: "user", email: data.email });
          window.location.href = "home.html";
        } else {
          alert(result.msg || 'خطأ في تسجيل الدخول');
        }
      } catch (error) {
        alert('خطأ في الاتصال');
        // Fallback to localStorage
        const users = getUsers();
        const found = users.find(u => u.email === data.email && u.password === data.password);
        if (!found){
          alert("بيانات الدخول غير صحيحة.");
          return;
        }
        setUser({ type:"user", name: found.name, email: found.email, phone: found.phone, interests: found.interests || [] });
        window.location.href = "home.html";
      }
    });
  }

  // Register form
  const registerForm = $("#registerForm");
  if (registerForm){
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(registerForm);
      const name = fd.get("name");
      const phone = fd.get("phone");
      const email = fd.get("email");
      const password = fd.get("password");
      const confirmPassword = fd.get("confirmPassword");
      const interests = fd.getAll("interests");

      if (password !== confirmPassword){
        alert("كلمة المرور وتأكيدها غير متطابقين.");
        return;
      }

      const users = getUsers();
      if (users.some(u => u.email === email)){
        alert("هذا البريد مسجل مسبقاً. استخدم تسجيل الدخول.");
        return;
      }

      const newUser = { name, phone, email, password, interests };
      users.push(newUser);
      setUsers(users);

      setUser({ type:"user", name, email, phone, interests });
      window.location.href = "home.html";
    });
  }

  // Guest form
  const guestForm = $("#guestForm");
  if (guestForm){
    guestForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(guestForm).entries());
      setUser({ type:"guest", name: data.guestName || "ضيف" });
      window.location.href = "home.html";
    });
  }
}

function initWhatsApp() {
  const whatsappBtn = document.createElement('a');
  whatsappBtn.href = 'https://wa.me/1234567890?text=مرحباً، أحتاج دعم';
  whatsappBtn.target = '_blank';
  whatsappBtn.className = 'whatsapp-float';
  whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
  document.body.appendChild(whatsappBtn);
}

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  attachLogout();
  showWelcome();
  initLoginTabs();
  initWhatsApp();
});
