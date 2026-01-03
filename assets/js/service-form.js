function getUserSafe(){
  try { return JSON.parse(localStorage.getItem("fs_user") || "null"); }
  catch { return null; }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-fill-service]").forEach(btn => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-fill-service");
      const field = document.getElementById("serviceField");
      if (field) field.value = value;
      const form = document.querySelector("[data-service-form]");
      if (form) form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const u = getUserSafe();
  const form = document.querySelector("[data-service-form]");
  if (form && u && u.type === "user") {
    const name = form.querySelector("input[name='name']");
    const email = form.querySelector("input[name='email']");
    const phone = form.querySelector("input[name='phone']");
    if (name && u.name) name.value = u.name;
    if (email && u.email) email.value = u.email;
    if (phone && u.phone) phone.value = u.phone;
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());

      try {
        const response = await fetch('http://localhost:5000/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        alert(result.msg || 'تم الإرسال بنجاح');
      } catch (error) {
        alert('خطأ في الإرسال');
        // Fallback to localStorage
        const all = JSON.parse(localStorage.getItem("fs_requests") || "[]");
        all.push({ ...data, createdAt: new Date().toISOString() });
        localStorage.setItem("fs_requests", JSON.stringify(all));
      }

      form.reset();

      const serviceField = document.getElementById("serviceField");
      if (serviceField) serviceField.value = data.service || serviceField.value;
    });
  }
});
