import ajax from "../src/ajax.js";

// Handle form submit events
async function submitHandler(e) {
  // prevent default action
  e.preventDefault();

  const form = e.target;
  const url = "http://localhost:3000/upload";

  let message;
  let errMessage = "There was an error";

  // disable the form button to prevent multiple submits
  form.btn.disabled = true;

  // Form uploadOne
  // passes a File type
  // https://developer.mozilla.org/en-US/docs/Web/API/File
  if (form.name === "uploadOne") {
    const [code] = await ajax.uploadFile(url, "POST", form.input.files[0]);

    message = code === 200 ? "File uploaded successfully" : errMessage;
  }

  // Form uploadMultiple
  // passes a FileList type
  // https://developer.mozilla.org/en-US/docs/Web/API/FileList
  if (form.name === "uploadMultiple") {
    const [code] = await ajax.uploadFile(url, "POST", form.input.files);

    message = code === 200 ? "File uploaded successfully" : errMessage;
  }

  // Form uploadWithAddedContent
  // passes a FormData object
  if (form.name === "uploadWithAddedContent") {
    // Initiale the FormData object passing the form element to constructor
    const fd = new FormData(form);

    // File or FileList must be appended to FormData separately
    // FormData does not append automatically
    fd.append("file", form.input.files);

    // pass the FormData to ajax.uploadFile as the third argument
    const [code] = await ajax.uploadFile(url, "POST", fd);

    message = code === 200 ? "File uploaded successfully" : errMessage;
  }

  const el = form.btn.previousElementSibling;
  el.classList.add("success");
  el.textContent = message;

  form.btn.disabled = false;
}

// On DOMContentLoaded event
window.addEventListener("DOMContentLoaded", () => {
  // add submit event listener
  document.addEventListener("submit", submitHandler);
});
