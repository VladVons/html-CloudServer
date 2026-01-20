/*
created: 2025.10.26
author: VladVons@gmail.com
*/


// Підставляємо назву тарифу, ціни в модальне вікно
const tariffModal = document.getElementById('tariffModal');
tariffModal.addEventListener('shown.bs.modal', function (event) {
  const button = event.relatedTarget;
  const card = button.closest('.card-body');

  const tariff = card.querySelector('.card-title').textContent.trim();
  tariffModal.querySelector('input[name="plan"]').value = tariff;

  const priceOld = card.querySelector('.old-price').textContent.trim();
  document.getElementById('monthPeriodVal').textContent = priceOld;

  const price = card.querySelector('.price').textContent.trim();
  document.getElementById('yearPeriodVal').textContent = price;

  tariffModal.querySelector('input[name="name"]').focus();
});

document.querySelectorAll(".email-form").forEach(form => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://ipapi.co/json/", false);
    xhr.send();
    if (xhr.status == 200) {
      const data = JSON.parse(xhr.responseText);

      // add field "sender_ip"
      let ipInput = form.querySelector("input[name='sender_ip']");
      if (!ipInput) {
        ipInput = document.createElement("input");
        ipInput.type = "hidden";
        ipInput.name = "sender_ip";
        form.appendChild(ipInput);
      }
      ipInput.value = data.ip + " (" + data.country_name + ", " + data.city + ")";
    }else{
      console.error("cant get external IP info");
    }

    const gateTemplate = e.submitter.dataset.template;
    const gateService = "service_hq7bv0n";
    console.log("Send to: ", "https://www.emailjs.com", "template: ", gateService, "formId", form.id);

    emailjs.sendForm(gateService, gateTemplate, form)
      .then(() => {
        const modal = form.closest(".modal");
        const modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
        form.reset();
        modalInstance.hide();

        //alert("✅ Лист успішно надіслано!");
        const thanksModal = new bootstrap.Modal(document.getElementById("thanksModal"));
        setTimeout(() => thanksModal.show(), 400);

        if (!window.__leadSent) {
          window.__leadSent = true;
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "generate_lead",
            form_name: form.id
          });
          console.log("Google event: ", "generate_lead", "form_name: ", form.id);
        }
      })
      .catch(error => {
        console.error("❌ Помилка:", error);
        alert("❌ Сталася помилка: " + JSON.stringify(error));
      });
  });
});
