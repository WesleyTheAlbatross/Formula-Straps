// ========================================
// CONFIGURATOR STATE
// ========================================
let basePrice              = 45;
let buckleExtra            = 0;
let qrExtra                = 0;
let keeperExtra            = 0;
let totalPrice             = 45;

let currentStrapColorLabel = "Maranello Red";
let currentStrapColor      = "#e10600";
let currentFinishLabel     = "Matte";
let currentGraphicType     = "car";
let currentHardwareLabel   = "Steel";
let currentHardwareColor   = "#C0C0C0";
let currentBuckleLabel     = "Tang Buckle";
let currentWatchModel      = "Classic Round";
let currentTexture         = "grained";
let currentLiningLabel     = "Beige Nappa";

let basket = JSON.parse(localStorage.getItem('formula_basket')) || [];

// ========================================
// CORE UTILITIES
// ========================================
function toast(msg) {
  const toastEl = document.getElementById('toast');
  if (!toastEl) return;
  toastEl.innerText = msg;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2800);
}

// ========================================
// UI UPDATERS
// ========================================
function updatePrice() {
  totalPrice = basePrice + buckleExtra + qrExtra + keeperExtra;
  const priceEl = document.getElementById('price-display');
  const breakdownEl = document.getElementById('price-breakdown');
  
  if (priceEl) priceEl.innerText = `£${totalPrice}`;
  
  if (breakdownEl) {
    let breakdown = "Bespoke construction included";
    const extras = [];
    if (buckleExtra > 0) extras.push(`${currentBuckleLabel} +£${buckleExtra}`);
    if (qrExtra > 0) extras.push(`QR Bars +£${qrExtra}`);
    if (keeperExtra > 0) extras.push(`Keeper +£${keeperExtra}`);
    if (extras.length > 0) breakdown = extras.join(' · ');
    breakdownEl.innerText = breakdown;
  }
}

function updateProgress() {
  const items = document.querySelectorAll('.accordion-item');
  let activeIndex = 0;
  items.forEach((item, index) => {
    if (item.classList.contains('active')) activeIndex = index + 1;
  });
  const progress = (activeIndex / items.length) * 100;
  const bar = document.getElementById('progress-fill');
  if (bar) bar.style.width = `${progress}%`;
}

// ========================================
// CONFIGURATION HANDLERS
// ========================================
function setTexture(type, label, el) {
  currentTexture = type;
  document.querySelectorAll('.strap').forEach(strap => {
    strap.classList.remove('grained', 'carbon', 'suede');
    strap.classList.add(type);
  });
  if (el) {
    el.parentElement.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
  }
  toast(`Material set to ${label}`);
}

function setLining(color, label, el) {
  currentLiningLabel = label;
  document.documentElement.style.setProperty('--lining-color', color);
  document.getElementById('lining-label').innerText = label;
  if (el) {
    el.parentElement.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
  }
}

function setColor(hex, name, el) {
  currentStrapColor = hex;
  currentStrapColorLabel = name;
  document.querySelectorAll('.strap').forEach(strap => strap.style.backgroundColor = hex);
  const label = document.getElementById('color-label');
  if (label) label.innerText = name;
  if (el) {
    el.parentElement.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
  }
}

function setStitch(color, label, el) {
  document.documentElement.style.setProperty('--stitch-color', color);
  if (el) {
    el.parentElement.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
  }
}

function setGraphicType(type) {
  currentGraphicType = type;
  const carBtn = document.getElementById('btn-car');
  const trackBtn = document.getElementById('btn-track');
  if (type === 'car') {
    if (carBtn) carBtn.classList.add('active');
    if (trackBtn) trackBtn.classList.remove('active');
    document.getElementById('car-svg-container').style.display = 'flex';
    document.getElementById('track-svg-container').style.display = 'none';
    document.getElementById('track-selector-wrapper').style.display = 'none';
  } else {
    if (carBtn) carBtn.classList.remove('active');
    if (trackBtn) trackBtn.classList.add('active');
    document.getElementById('car-svg-container').style.display = 'none';
    document.getElementById('track-svg-container').style.display = 'flex';
    document.getElementById('track-selector-wrapper').style.display = 'block';
    const trackSelect = document.getElementById('track-select');
    if (trackSelect) updateTrack(trackSelect.value);
  }
}

function updateTrack(srcFile) {
  const trackImage = document.getElementById('track-image');
  if (trackImage) trackImage.src = srcFile;
}

function updateInitials(val) {
  const initialsEl = document.getElementById('strap-initials');
  if (initialsEl) initialsEl.innerText = val.toUpperCase() || 'F1';
}

function setFontStyle(style, label, el) {
  const initialsEl = document.getElementById('strap-initials');
  if (initialsEl) {
    initialsEl.style.fontStyle = style === 'italic' ? 'italic' : 'normal';
    initialsEl.style.fontFamily = style === 'serif' ? 'Georgia, serif' : "'Outfit', sans-serif";
    initialsEl.style.fontWeight = style === 'normal' ? '900' : '800';
  }
  if (el) {
    el.parentElement.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
  }
}

function setHardware(key, color, label, el) {
  currentHardwareColor = color;
  currentHardwareLabel = label;
  const labelEl = document.getElementById('hw-label-real');
  if (labelEl) labelEl.innerText = label;
  if (el) {
    el.parentElement.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
  }
  renderClasp();
}

function setBuckle(type, extra, el) {
  currentBuckleType = type;
  currentBuckleLabel = type + (extra > 0 ? " Clasp" : " Buckle");
  buckleExtra = extra;
  if (el) {
    el.parentElement.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
  }
  renderClasp();
  updatePrice();
}

function setWatchType(type, label, btn) {
  currentWatchModel = label;
  const head = document.querySelector('.watch-head');
  if (head) head.className = `watch-head ${type}`;
  if (btn) {
    btn.parentElement.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  toast(`Timepiece set to ${label}`);
}

function toggleQR(el) {
  const isOn = el.classList.toggle('on');
  document.getElementById('qr-indicators').style.display = isOn ? 'block' : 'none';
  qrExtra = isOn ? 10 : 0;
  updatePrice();
  toast(isOn ? 'Quick-Release integrated (+£10)' : 'Quick-Release removed');
}

function toggleKeeper(el) {
  const isOn = el.classList.toggle('on');
  document.getElementById('keeper-loop').style.display = isOn ? 'block' : 'none';
  keeperExtra = isOn ? 5 : 0;
  updatePrice();
  toast(isOn ? 'Additional keeper added (+£5)' : 'Keeper removed');
}

// ========================================
// CLASP RENDERING
// ========================================
let currentBuckleType = 'Tang';

function claspSVG(type, stroke) {
  const fill = `${stroke}33`;
  const fillDark = `${stroke}66`;
  const highlight = `rgba(255,255,255,0.4)`;
  if (type === 'Deployant') {
    return `<svg width="150" height="50" viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 10px 10px rgba(0,0,0,0.5));"><rect x="40" y="10" width="80" height="40" rx="8" fill="${fillDark}" stroke="${stroke}" stroke-width="2"/><circle cx="50" cy="30" r="4" fill="${stroke}"/><circle cx="110" cy="30" r="4" fill="${stroke}"/><path d="M10 30H40" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/><path d="M120 30H150" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/><rect x="35" y="22" width="5" height="16" rx="2" fill="${stroke}"/><rect x="120" y="22" width="5" height="16" rx="2" fill="${stroke}"/></svg>`;
  } else {
    return `<svg width="150" height="50" viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 10px 10px rgba(0,0,0,0.5));"><rect x="10" y="5" width="140" height="50" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="5"/><path d="M80 5V55" stroke="${stroke}" stroke-width="4" stroke-linecap="round"/><path d="M80 5C80 5 100 20 100 30C100 40 80 55 80 55" stroke="${stroke}" stroke-width="5" stroke-linecap="round" fill="none"/></svg>`;
  }
}

function renderClasp() {
  const container = document.getElementById('clasp-container');
  if (container) container.innerHTML = claspSVG(currentBuckleType, currentHardwareColor);
}

// ========================================
// PRESETS & SUMMARY
// ========================================
function applyPreset(team) {
  if (team === 'ferrari') {
    setColor('#e10600', 'Maranello Red');
    setHardware('silver', '#C0C0C0', 'Steel');
    setGraphicType('car');
    setTexture('grained', 'Full Grain');
  } else if (team === 'mercedes') {
    setColor('#000000', 'Stealth Black');
    setHardware('silver', '#C0C0C0', 'Steel');
    setGraphicType('track');
    setTexture('carbon', 'Carbon Fiber');
    updateTrack('RaceCircuitAutodromaDiMonza.svg');
  } else if (team === 'redbull') {
    setColor('#1a237e', 'Alpine Blue');
    setHardware('gold', '#D4AF37', 'Gold');
    setGraphicType('car');
  }
  updatePrice();
}

function openSummary() {
  const modal = document.getElementById('summary-modal');
  if (!modal) return;
  modal.classList.add('active');
  document.getElementById('sum-model').innerText = currentWatchModel;
  document.getElementById('sum-leather').innerText = currentStrapColorLabel;
  document.getElementById('sum-hw').innerText = currentHardwareLabel;
  const extrasDiv = document.getElementById('summary-extras');
  extrasDiv.innerHTML = '';
  if (buckleExtra > 0) extrasDiv.innerHTML += `<div class="summary-item"><span>${currentBuckleLabel}</span><span>+£${buckleExtra}.00</span></div>`;
  if (qrExtra > 0) extrasDiv.innerHTML += `<div class="summary-item"><span>Quick-Release</span><span>+£${qrExtra}.00</span></div>`;
  if (keeperExtra > 0) extrasDiv.innerHTML += `<div class="summary-item"><span>Leather Keeper</span><span>+£${keeperExtra}.00</span></div>`;
  document.getElementById('summary-total-price').innerText = `£${totalPrice}.00`;
}

function closeSummary() {
  const modal = document.getElementById('summary-modal');
  if (modal) modal.classList.remove('active');
}

// ========================================
// BASKET SYSTEM
// ========================================
function updateBasketBadge() {
  const count = basket.length;
  const badges = document.querySelectorAll('.basket-count');
  badges.forEach(b => {
    b.innerText = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}

function saveBasket() {
  localStorage.setItem('formula_basket', JSON.stringify(basket));
  updateBasketBadge();
}

function addToBasket() {
  const newItem = {
    id: Date.now(),
    model: currentWatchModel,
    color: currentStrapColorLabel,
    total: totalPrice
  };
  basket.push(newItem);
  saveBasket();
  closeSummary();
  renderBasket();
  toggleBasket(true);
  toast("Added to basket!");
}

function toggleBasket(show) {
  const drawer = document.getElementById('basket-drawer');
  if (!drawer) return;
  if (show === true) drawer.classList.add('active');
  else if (show === false) drawer.classList.remove('active');
  else drawer.classList.toggle('active');
}

function removeFromBasket(id) {
  basket = basket.filter(item => item.id !== id);
  saveBasket();
  renderBasket();
}

function renderBasket() {
  const container = document.getElementById('basket-items');
  if (!container) return;
  container.innerHTML = '';
  if (basket.length === 0) {
    container.innerHTML = '<p style="text-align:center; padding: 40px 0; color: var(--text-muted);">Your basket is empty.</p>';
    const footer = document.getElementById('basket-footer');
    if (footer) footer.style.display = 'none';
    return;
  }
  const footer = document.getElementById('basket-footer');
  if (footer) footer.style.display = 'block';
  let subtotal = 0;
  basket.forEach(item => {
    subtotal += item.total;
    const el = document.createElement('div');
    el.className = 'basket-item';
    el.innerHTML = `<div class="basket-item-info"><div class="basket-item-title">${item.model} — ${item.color}</div><div class="basket-item-price">£${item.total}.00</div></div><button class="basket-remove" onclick="removeFromBasket(${item.id})">&times;</button>`;
    container.appendChild(el);
  });
  const subtotalEl = document.getElementById('basket-subtotal');
  if (subtotalEl) subtotalEl.innerText = `£${subtotal}.00`;
}

// ========================================
// ACCORDION
// ========================================
function toggleAccordion(header) {
  const item = header.parentElement;
  const isActive = item.classList.contains('active');
  document.querySelectorAll('.accordion-item').forEach(el => el.classList.remove('active'));
  if (!isActive) {
    item.classList.add('active');
    updateProgress();
  }
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  updateBasketBadge();
  renderBasket();
  renderClasp();
  updateProgress();
  updatePrice();
  
  // Set initial strap styles
  setColor('#e10600', 'Maranello Red');
  setTexture('grained', 'Full Grain');

  const previewContainer = document.querySelector('.preview-container');
  const watchAssembly = document.getElementById('watch-assembly');
  const glow = document.querySelector('.studio-glow');

  if (previewContainer && watchAssembly) {
    watchAssembly.style.transition = `transform 0.1s ease`;
    previewContainer.addEventListener('mousemove', (e) => {
      const rect = previewContainer.getBoundingClientRect();
      const x = e.clientX - rect.left; 
      const y = e.clientY - rect.top;  
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -15; 
      const rotateY = ((x - centerX) / centerX) * 15;
      watchAssembly.style.transform = `scale(0.85) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // Subtly shift glow
      if (glow) {
        glow.style.left = `${x - 300}px`;
        glow.style.top = `${y - 300}px`;
      }
    });

    previewContainer.addEventListener('mouseleave', () => {
      watchAssembly.style.transform = `scale(0.85) rotateX(0deg) rotateY(0deg)`;
      watchAssembly.style.transition = `transform 0.8s cubic-bezier(0.2, 1, 0.3, 1)`; 
      setTimeout(() => watchAssembly.style.transition = `transform 0.1s ease`, 800);
    });
  }

  window.addEventListener('click', (e) => {
    const drawer = document.getElementById('basket-drawer');
    const trigger = document.querySelector('.basket-trigger');
    if (drawer && drawer.classList.contains('active') && !drawer.contains(e.target) && !trigger.contains(e.target)) {
      toggleBasket(false);
    }
  });
});
