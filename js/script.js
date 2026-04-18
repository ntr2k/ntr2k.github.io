// ===== MOBILE CARD BUILDER =====
// Reads table rows and builds mobile card equivalents

function buildCards() {
  const tbody = document.getElementById('tableBody');
  if (!tbody) return;
  const cardList = document.getElementById('cardList');
  cardList.innerHTML = '';

  const rows = tbody.querySelectorAll('tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 6) return;

    const name      = cells[0].querySelector('.conf-name') ? cells[0].innerText.trim() : cells[0].innerText.trim();
    const fieldTag  = cells[0].querySelector('.conf-field-tag') ? cells[0].querySelector('.conf-field-tag').innerText.trim() : '';
    const deadline  = cells[1].childNodes[0] ? cells[1].childNodes[0].textContent.trim() : '';
    const confDate  = cells[2].innerText.trim();
    const venue     = cells[3].innerText.trim();
    const location  = cells[4].innerText.trim();
    const linkEl    = cells[5].querySelector('a');
    const linkHref  = linkEl ? linkEl.href : '#';
    const linkText  = linkEl ? linkEl.innerText.trim() : '';
    const field     = row.getAttribute('data-field') || '';

    const card = document.createElement('div');
    card.className = 'conf-card';
    card.setAttribute('data-field', field);

    // Clean name (remove tag text if embedded)
    const cleanName = name.replace(fieldTag, '').trim();

    card.innerHTML = `
      <div class="card-top">
        <span class="card-name">${cleanName}</span>
        <span class="card-tag">${fieldTag}</span>
      </div>
      <div class="card-rows">
        <div class="card-row">
          <span class="card-label">Deadline</span>
          <span class="card-val">${deadline}<span class="card-deadline-note">(check site for updates)</span></span>
        </div>
        <div class="card-row">
          <span class="card-label">Conf. Date</span>
          <span class="card-val">${confDate}</span>
        </div>
        <div class="card-row">
          <span class="card-label">Venue</span>
          <span class="card-val">${venue}</span>
        </div>
        <div class="card-row">
          <span class="card-label">Location</span>
          <span class="card-val">${location}</span>
        </div>
      </div>
      <div class="card-link-row">
        <a href="${linkHref}" target="_blank" class="conf-link">${linkText}</a>
      </div>
    `;
    cardList.appendChild(card);
  });
}

// ===== COUNT LABEL =====
function updateCount() {
  const rows  = document.querySelectorAll('#tableBody tr:not(.hidden)');
  const cards = document.querySelectorAll('.conf-card:not(.hidden)');
  const total = rows.length || cards.length;
  const label = document.getElementById('countLabel');
  if (label) label.textContent = total + ' conference' + (total !== 1 ? 's' : '');
}

// ===== SEARCH FILTER =====
function filterTable() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const activeChip = document.querySelector('.chip.active');
  const activeField = activeChip ? activeChip.getAttribute('data-filter') : 'all';

  applyFilters(query, activeField);
}

// ===== FIELD FILTER =====
function filterByField(field, btn) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  // Store field on button for reference
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  applyFilters(query, field);
}

function applyFilters(query, field) {
  let visibleCount = 0;

  // Desktop table rows
  const rows = document.querySelectorAll('#tableBody tr');
  rows.forEach(row => {
    const rowText  = row.innerText.toLowerCase();
    const rowField = row.getAttribute('data-field') || '';

    const matchSearch = !query || rowText.includes(query);
    const matchField  = !field || field === 'all' || rowField === field;

    if (matchSearch && matchField) {
      row.classList.remove('hidden');
      visibleCount++;
    } else {
      row.classList.add('hidden');
    }
  });

  // Mobile cards
  const cards = document.querySelectorAll('.conf-card');
  cards.forEach(card => {
    const cardText  = card.innerText.toLowerCase();
    const cardField = card.getAttribute('data-field') || '';

    const matchSearch = !query || cardText.includes(query);
    const matchField  = !field || field === 'all' || cardField === field;

    if (matchSearch && matchField) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });

  // No results message
  const noResults = document.getElementById('noResults');
  if (noResults) noResults.style.display = (visibleCount === 0) ? 'block' : 'none';

  updateCount();
}

// ===== NAV TOGGLE (mobile) =====
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  if (!toggle || !mobile) return;

  toggle.addEventListener('click', () => {
    const open = mobile.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

// ===== STORE FILTER STATE ON CHIPS =====
function initChips() {
  document.querySelectorAll('.chip').forEach(chip => {
    const onclick = chip.getAttribute('onclick');
    if (onclick) {
      const match = onclick.match(/'([^']+)'/);
      if (match) chip.setAttribute('data-filter', match[1]);
    }
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initChips();
  buildCards();
  updateCount();
  initNavToggle();
});
