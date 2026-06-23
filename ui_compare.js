// ════════════════════════════════════════════════════════════════════════════
// PHOTO UTILITY — resize/compress images for compact offline storage
// ════════════════════════════════════════════════════════════════════════════

function resizeImageFile(file, maxPx, cb) {
  if (file.size > 8 * 1024 * 1024) { alert('Photo must be under 8 MB.'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      cb(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function avatarHtml(person, size = 'md') {
  const initials = (person.name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  if (person.photo) {
    return `<div class="avatar avatar-${size}"><img src="${person.photo}" alt="${person.name}" loading="lazy" /></div>`;
  }
  const hue = [...(person.name || 'X')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return `<div class="avatar avatar-${size} avatar-initials" style="--av-hue:${hue}">${initials}</div>`;
}
