// ===== CONFIG =====
const ORGS = [
  { key: 'IEEE', cardListId: 'cardList-ieee', countId: 'countLabel-ieee' },
  { key: 'ACM',  cardListId: 'cardList-acm',  countId: 'countLabel-acm'  },
  { key: 'Others', cardListId: 'cardList-others', countId: 'countLabel-others' },
];

// ===== BUILD MOBILE CARDS FOR ONE SECTION =====
function buildCards(org) {
  const tbody = document.querySelector(`.tableBody[data-org="${org.key}"]`);
  const cardList = document.getElementById(org.cardListId);
  if (!tbody || !cardList) return;

  cardList.innerHTML = '';
  const rows = tbody.querySelectorAll('tr');

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 6) return;

    const nameCell    = cells[0];
    const tagEl       = nameCell.querySelector('.conf-field-tag');
    const fieldTag    = tagEl ? tagEl.innerText.trim() : '';
    const cleanName   = nameCell.innerText.replace(fieldTag, '').trim();
    const deadline    = cells[1].childNodes[0] ? cells[1].childNodes[0].textContent.trim() : '';
    const confDate    = cells[2].innerText.trim();
    const venue       = cells[3].innerText.trim();
    const location    = cells[4].innerText.trim();
    const linkEl      = cells[5].querySelector('a');
    const linkHref    = linkEl ? linkEl.href : '#';
    const linkText    = linkEl ? linkEl.innerText.trim() : '';

    const card = document.createElement('div');
    card.className = 'conf-card';
    card.setAttribute('data-org', org.key);

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
      </div>`;

    cardList.appendChild(card);
  });
}

// ===== UPDATE COUNT LABELS =====
function updateCounts() {
  ORGS.forEach(org => {
    const label = document.getElementById(org.countId);
    if (!label) return;
    const section = document.querySelector(`.org-section[data-org="${org.key}"]`);
    if (!section || section.classList.contains('hidden-section')) {
      label.textContent = '';
      return;
    }
    const visibleRows = section.querySelectorAll('tr[data-org]:not(.hidden)');
    const n = visibleRows.length;
    label.textContent = n + ' conference' + (n !== 1 ? 's' : '');
  });
}

// ===== SEARCH =====
function filterTable() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const activeChip = document.querySelector('.chip.active');
  const activeOrg = activeChip ? activeChip.getAttribute('data-filter') : 'all';
  applyFilters(query, activeOrg);
}

// ===== ORG FILTER =====
function filterByField(org, btn) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  applyFilters(query, org);
}

// ===== APPLY ALL FILTERS =====
function applyFilters(query, orgFilter) {
  let totalVisible = 0;

  ORGS.forEach(org => {
    const section = document.querySelector(`.org-section[data-org="${org.key}"]`);
    if (!section) return;

    // Should this whole section be visible?
    const showSection = (orgFilter === 'all' || orgFilter === org.key);
    section.classList.toggle('hidden-section', !showSection);

    if (!showSection) return;

    // Filter rows within this section
    const rows = section.querySelectorAll('tr[data-org]');
    rows.forEach(row => {
      const matchSearch = !query || row.innerText.toLowerCase().includes(query);
      row.classList.toggle('hidden', !matchSearch);
      if (matchSearch) totalVisible++;
    });

    // Sync mobile cards
    const cards = section.querySelectorAll('.conf-card');
    cards.forEach(card => {
      const matchSearch = !query || card.innerText.toLowerCase().includes(query);
      card.classList.toggle('hidden', !matchSearch);
    });
  });

  const noResults = document.getElementById('noResults');
  if (noResults) noResults.style.display = (totalVisible === 0) ? 'block' : 'none';

  updateCounts();
}

// ===== NAV TOGGLE =====
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  if (!toggle || !mobile) return;
  toggle.addEventListener('click', () => {
    const open = mobile.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

// ===== STORE FILTER KEY ON CHIPS =====
function initChips() {
  document.querySelectorAll('.chip').forEach(chip => {
    const onclick = chip.getAttribute('onclick') || '';
    const match = onclick.match(/'([^']+)'/);
    if (match) chip.setAttribute('data-filter', match[1]);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initChips();
  ORGS.forEach(buildCards);
  updateCounts();
  initNavToggle();
});
