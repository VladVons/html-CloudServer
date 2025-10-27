/*
2025.10.26
VladVons@gmail.com
*/


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

    console.log("Send to ", "https://www.emailjs.com");
    const gateTemplate = e.submitter.dataset.template;
    const gateService = "service_hq7bv0n";
    emailjs.sendForm(gateService, gateTemplate, form)
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
