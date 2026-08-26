const state = { product: '', file: null, fileUrl: '' };
const maxFileSize = 10 * 1024 * 1024;
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const productLabel = document.querySelector('#selected-product');
const photoInput = document.querySelector('#pet-photo');
const dropzone = document.querySelector('#dropzone');
const uploadMessage = document.querySelector('#upload-message');
const preview = document.querySelector('#preview');
const previewImage = document.querySelector('#preview-image');
const fileName = document.querySelector('#file-name');
const formStatus = document.querySelector('#form-status');

function setMessage(element, message, type = '') {
  element.textContent = message;
  element.dataset.state = type;
}

function selectProduct(product) {
  state.product = product;
  productLabel.textContent = `Vybráno: ${product}`;
  document.querySelectorAll('.product-card').forEach((card) => {
    const selected = card.dataset.product === product;
    card.classList.toggle('selected', selected);
    card.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('#fotka').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearPhoto() {
  if (state.fileUrl) URL.revokeObjectURL(state.fileUrl);
  state.fileUrl = '';
  state.file = null;
  photoInput.value = '';
  previewImage.removeAttribute('src');
  preview.hidden = true;
  setMessage(uploadMessage, '');
}

function showPhoto(file) {
  if (state.fileUrl) URL.revokeObjectURL(state.fileUrl);
  state.fileUrl = '';
  state.file = null;
  preview.hidden = true;
  if (!allowedTypes.has(file.type)) {
    setMessage(uploadMessage, 'Vyber fotku ve formátu JPG, PNG nebo WebP.', 'error');
    return;
  }
  if (file.size > maxFileSize) {
    setMessage(uploadMessage, 'Tato fotka je větší než 10 MB. Zkus prosím menší soubor.', 'error');
    return;
  }
  state.file = file;
  state.fileUrl = URL.createObjectURL(file);
  previewImage.src = state.fileUrl;
  fileName.textContent = file.name;
  preview.hidden = false;
  setMessage(uploadMessage, 'Fotka je připravená pouze pro lokální náhled.', 'ready');
}

document.querySelectorAll('.product-card').forEach((card) => {
  card.setAttribute('aria-pressed', 'false');
  card.addEventListener('click', () => selectProduct(card.dataset.product));
});

photoInput.addEventListener('change', () => {
  if (photoInput.files?.[0]) showPhoto(photoInput.files[0]);
});

dropzone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
dropzone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropzone.classList.remove('dragover');
  const [file] = event.dataTransfer.files;
  if (file) showPhoto(file);
});

document.querySelector('#remove-photo').addEventListener('click', clearPhoto);

document.querySelector('#customizer-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if (!state.product) {
    setMessage(formStatus, 'Nejdříve vyber typ produktu.', 'error');
    return;
  }
  if (!state.file || !state.fileUrl) {
    setMessage(formStatus, 'Nejdříve vyber fotku mazlíčka.', 'error');
    return;
  }
  const style = document.querySelector('input[name="style"]:checked').value;
  setMessage(formStatus, `Podklady jsou připravené: ${state.product}, styl ${style}. Objednávka ani odeslání fotografie se v této verzi neprovádí.`, 'ready');
});
