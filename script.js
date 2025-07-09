let cropper;
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const cropBtn = document.getElementById('cropBtn');
const croppedImageData = document.getElementById('croppedImageData');

fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  imagePreview.src = url;

  // Destroy old cropper if exists
  if (cropper) cropper.destroy();

  // Wait for image to load then init cropper
  imagePreview.onload = () => {
    cropper = new Cropper(imagePreview, {
      aspectRatio: 1,      // square magnets
      viewMode: 1,
    });
    cropBtn.disabled = false;
  };
});

cropBtn.addEventListener('click', () => {
  const canvas = cropper.getCroppedCanvas({
    width: 500,
    height: 500,
  });
  // show user preview (optional)
  imagePreview.src = canvas.toDataURL('image/png');

  // set hidden form field for upload
  croppedImageData.value = canvas.toDataURL('image/png');
});
