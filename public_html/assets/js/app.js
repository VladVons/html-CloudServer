// Підставляємо назву тарифу в модальне вікно
const tariffModal = document.getElementById('tariffModal');
tariffModal.addEventListener('show.bs.modal', function (event) {
  const button = event.relatedTarget;
  const tariff = button.getAttribute('data-tariff');
  document.getElementById('plan').value = tariff;
});
          
document.querySelectorAll(".email-form").forEach(form => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const modal = form.closest(".modal");
    const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);

    console.log("📨 Надсилання листа з форми:", form.id);

    emailjs.sendForm("service_hq7bv0n", "template_vse74lg", form)
      .then(() => {
        alert("✅ Лист успішно надіслано!");
        form.reset();
        modalInstance.hide();
      })
      .catch(error => {
        console.error("❌ Помилка:", error);
        alert("❌ Сталася помилка: " + JSON.stringify(error));
      });
  });
});
