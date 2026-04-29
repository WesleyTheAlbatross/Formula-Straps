// Tracks are loaded directly via user-provided files

function setColor(hex, name, el) {
  const strap = document.getElementById('strap');
  if (strap) strap.style.backgroundColor = hex;
  
  const label = document.getElementById('color-label');
  if (label) label.innerText = name;
  
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  if (el) el.classList.add('active');
}

function setGraphicType(type) {
  // Toggle Buttons
  document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`btn-${type}`);
  if(activeBtn) activeBtn.classList.add('active');

  // Toggle Graphics in Preview
  if(type === 'car') {
    document.getElementById('car-svg-container').style.display = 'flex';
    document.getElementById('track-svg-container').style.display = 'none';
    document.getElementById('track-selector-wrapper').style.display = 'none';
  } else {
    document.getElementById('car-svg-container').style.display = 'none';
    document.getElementById('track-svg-container').style.display = 'flex';
    document.getElementById('track-selector-wrapper').style.display = 'block';
    
    // Ensure track is updated
    const trackSelect = document.getElementById('track-select');
    if(trackSelect) updateTrack(trackSelect.value);
  }
}

// Per-track widths, calculated proportionally from each SVG's actual width:height ratio
// to best fill the strap's usable ~160px wide area without overflowing.
const trackWidths = {
  'RaceCircuitAlbertPark.svg':       '150px', // 400×204 — wide, constrained
  'RaceCircuitAmericas.svg':         '155px', // 557×529 — nearly square
  'RaceCircuitAutodromaDiMonza.svg': '150px', // 517×264 — wide
  'RaceCircuitBahrain.svg':          '155px', // 432×282 — moderate
  'RaceCircuitGillesBaku.svg':       '130px', // 974×286 — very wide, most constrained
  'RaceCircuitMarinaBay.svg':        '155px', // 920×616 — wide but tall enough
  'RaceCircuitMonaco.svg':           '155px', // 412×344 — moderate
  'RaceCircuitRedBull.svg':          '155px', // 508×425 — moderate
  'RaceCircuitShanghai.svg':         '155px', // 501×326 — moderate
  'RaceCircuitSpa.svg':              '150px', // 502×320 — slightly wide
  'RaceCircuitSuzuka.svg':           '110px', // 473×735 — very tall, use narrow width
};

function updateTrack(srcFile) {
  const trackImage = document.getElementById('track-image');
  if (!trackImage) return;
  trackImage.src = srcFile;
  trackImage.style.width = trackWidths[srcFile] || '150px';
}

function updateInitials(val) {
  const initialsEl = document.getElementById('strap-initials');
  if(initialsEl) initialsEl.innerText = val.toUpperCase() || 'F1';
}

function setWidth(px, label, el) {
  document.documentElement.style.setProperty('--strap-width', px);
  document.getElementById('width-label').innerText = label;
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
}

function setStitch(color, label, el) {
  document.documentElement.style.setProperty('--stitch-color', color);
  document.getElementById('stitch-label').innerText = label;
  document.querySelectorAll('.stitch-swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
}

function setIntensity(val) {
  const engravingContainer = document.getElementById('car-svg-container').parentElement;
  engravingContainer.style.opacity = val / 100;
  document.getElementById('intensity-label').innerText = val + '%';
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

function shareDesign() {
  // Build a summary of current selections
  const color   = document.getElementById('color-label')?.innerText  || '';
  const width   = document.getElementById('width-label')?.innerText  || '';
  const stitch  = document.getElementById('stitch-label')?.innerText || '';
  const initials = document.getElementById('strap-initials')?.innerText || '';
  const track   = document.getElementById('track-select')?.options[document.getElementById('track-select')?.selectedIndex]?.text || '';
  const type    = document.getElementById('btn-car')?.classList.contains('active') ? 'Car' : track;

  const summary = `Formula Strap · ${color} · ${width} · ${stitch} thread · Engraving: ${type} · Initials: ${initials}`;

  navigator.clipboard.writeText(summary).then(() => {
    showToast('✓ Design copied to clipboard!');
  }).catch(() => {
    showToast('Design: ' + summary);
  });
}

// 3D Parallax Tilt Effect for the Configurator Preview
document.addEventListener('DOMContentLoaded', () => {
  const previewContainer = document.querySelector('.preview-container');
  const strap = document.getElementById('strap');

  if (previewContainer && strap) {
    previewContainer.addEventListener('mousemove', (e) => {
      const rect = previewContainer.getBoundingClientRect();
      const x = e.clientX - rect.left; 
      const y = e.clientY - rect.top;  
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation (max 25 degrees for a dramatic effect)
      const rotateX = ((y - centerY) / centerY) * -25; 
      const rotateY = ((x - centerX) / centerX) * 25;
      
      strap.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    previewContainer.addEventListener('mouseleave', () => {
      strap.style.transform = `rotateX(0deg) rotateY(0deg)`;
      strap.style.transition = `background-color 0.5s ease, transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)`; 
    });

    previewContainer.addEventListener('mouseenter', () => {
      strap.style.transition = `background-color 0.5s ease, transform 0.1s ease-out`; 
    });
  }
});
