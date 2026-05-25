/* ===== ADMIN DASHBOARD - MAIN JS ===== */

document.addEventListener('DOMContentLoaded', () => {

  // ── Sidebar Toggle ──────────────────────────────────────
  const toggleBtn = document.getElementById('sidebarToggle');
  const overlay   = document.getElementById('sidebarOverlay');

  function toggleSidebar() {
    if (window.innerWidth <= 991) {
      document.body.classList.toggle('sidebar-open');
    } else {
      document.body.classList.toggle('sidebar-collapsed');
    }
  }

  toggleBtn?.addEventListener('click', toggleSidebar);
  overlay?.addEventListener('click', () => {
    document.body.classList.remove('sidebar-open');
  });

  // ── Sidebar Submenu ─────────────────────────────────────
  document.querySelectorAll('.sidebar-link[data-submenu]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const item = link.closest('.sidebar-item');
      const sub  = item.querySelector('.sidebar-submenu');
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.sidebar-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.sidebar-submenu')?.classList.remove('open');
      });

      if (!isOpen) {
        item.classList.add('open');
        sub?.classList.add('open');
      }
    });
  });

  // ── Active Link Highlight ───────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link[href]').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
      const sub = link.closest('.sidebar-submenu');
      if (sub) {
        sub.classList.add('open');
        sub.closest('.sidebar-item')?.classList.add('open');
      }
    }
  });

  // ── Notification Dropdown ───────────────────────────────
  const notifBtn  = document.getElementById('notifBtn');
  const notifDrop = document.getElementById('notifDropdown');

  notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDrop?.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!notifBtn?.contains(e.target)) {
      notifDrop?.classList.remove('show');
    }
  });

  // ── Counter Animation ───────────────────────────────────
  function animateCount(el) {
    const target = parseFloat(el.dataset.target.replace(/,/g, ''));
    const isFloat = el.dataset.target.includes('.');
    const prefix  = el.dataset.prefix || '';
    const suffix  = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current  = target * ease;

      el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;

      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => observer.observe(el));

  // ── Tooltip init (Bootstrap) ────────────────────────────
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    new bootstrap.Tooltip(el);
  });

});

/* ===== CHART UTILITIES ===== */
const ChartColors = {
  primary:  '#435ebe',
  success:  '#198754',
  warning:  '#ffc107',
  danger:   '#dc3545',
  info:     '#0dcaf0',
  purple:   '#6f42c1',
  grid:     '#f0f2f8',
  text:     '#8a8fa8',
};

function getGradient(ctx, color, alpha1 = 0.3, alpha2 = 0) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, color + Math.round(alpha1 * 255).toString(16).padStart(2,'0'));
  gradient.addColorStop(1, color + Math.round(alpha2 * 255).toString(16).padStart(2,'0'));
  return gradient;
}

const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        font: { family: 'Nunito', weight: '700', size: 12 },
        color: ChartColors.text,
        usePointStyle: true,
        pointStyleWidth: 10,
        padding: 20,
      }
    },
    tooltip: {
      backgroundColor: '#1a1d2e',
      titleFont: { family: 'Nunito', weight: '800', size: 13 },
      bodyFont:  { family: 'Nunito', size: 12 },
      padding: 12,
      cornerRadius: 10,
      displayColors: false,
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: ChartColors.text, font: { family: 'Nunito', weight: '600', size: 11 } },
      border: { display: false },
    },
    y: {
      grid: { color: ChartColors.grid, drawBorder: false },
      ticks: { color: ChartColors.text, font: { family: 'Nunito', weight: '600', size: 11 } },
      border: { display: false, dash: [4, 4] },
    }
  }
};

/* =========================================================
   PRODUCTS TABLE FUNCTIONALITIES
========================================================= */

$(document).ready(function () {

  // =========================================
  // PRODUCTS TABLE
  // =========================================

  const productTable = $('#productsTable').DataTable({
    pageLength: 5,
    responsive: true,
    lengthMenu: [5, 10, 25, 50]
  });

  // =========================================
  // ORDERS TABLE
  // =========================================

  $('#ordersTable').DataTable({
    pageLength: 5,
    responsive: true,
    lengthMenu: [5, 10, 25, 50]
  });

  // =========================================
  // SEARCH PRODUCTS
  // =========================================

  $('.form-control-sm').on('keyup', function () {
    productTable.search($(this).val()).draw();
  });

  // =========================================
  // ADD PRODUCT
  // =========================================

  $('.btn-primary').on('click', function () {

    const productName = prompt("Enter Product Name");
    if (!productName) return;

    const category = prompt("Enter Category");
    const price = prompt("Enter Price");
    const sales = prompt("Enter Sales");
    const revenue = prompt("Enter Revenue");
    const stock = prompt("Enter Stock");
    const status = prompt("Enter Status");

    const rowCount = productTable.rows().count() + 1;

    productTable.row.add([

      rowCount,

      `
      <div class="d-flex align-items-center gap-3">

        <div style="
          width:38px;
          height:38px;
          background:rgba(67,94,190,.12);
          border-radius:10px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:1.1rem;">
          📦
        </div>

        <div>
          <div style="font-weight:700;font-size:.875rem;">
            ${productName}
          </div>

          <div style="font-size:.72rem;color:#8a8fa8;">
            NEW PRODUCT
          </div>
        </div>

      </div>
      `,

      `<span class="badge-custom badge-primary-soft">${category}</span>`,

      `$${price}`,

      sales,

      `<span style="font-weight:800;color:#198754;">
        $${revenue}
      </span>`,

      `
      <div style="font-size:.8rem;font-weight:700;margin-bottom:4px;">
        ${stock}
      </div>

      <div class="progress-custom" style="width:90px;">
        <div class="progress-bar-custom"
        style="width:70%;background:#198754;">
        </div>
      </div>
      `,

      `<span class="badge-custom badge-success-soft">
        ${status}
      </span>`,

      `
      <div class="d-flex gap-1">

        <button class="editBtn btn btn-sm"
        style="
          width:30px;
          height:30px;
          padding:0;
          border-radius:8px;
          background:rgba(67,94,190,.1);
          color:#435ebe;
          border:none;">

          <i class="bi bi-pencil-fill"></i>

        </button>

        <button class="viewBtn btn btn-sm"
        style="
          width:30px;
          height:30px;
          padding:0;
          border-radius:8px;
          background:rgba(13,202,240,.1);
          color:#0ab8d8;
          border:none;">

          <i class="bi bi-eye-fill"></i>

        </button>

        <button class="deleteBtn btn btn-sm"
        style="
          width:30px;
          height:30px;
          padding:0;
          border-radius:8px;
          background:rgba(220,53,69,.1);
          color:#dc3545;
          border:none;">

          <i class="bi bi-trash-fill"></i>

        </button>

      </div>
      `

    ]).draw(false);

  });

  // =========================================
  // DELETE PRODUCT
  // =========================================

  $('#productsTable tbody').on('click', '.deleteBtn', function () {

    if (confirm("Delete this product?")) {

      productTable
        .row($(this).parents('tr'))
        .remove()
        .draw();

    }

  });

  // =========================================
  // EDIT PRODUCT
  // =========================================

  $('#productsTable tbody').on('click', '.editBtn', function () {

    const row = productTable.row($(this).parents('tr'));
    const data = row.data();

    const updatedName = prompt("Edit Product Name");

    if (updatedName) {

      data[1] = `
      <div class="d-flex align-items-center gap-3">

        <div style="
          width:38px;
          height:38px;
          background:rgba(67,94,190,.12);
          border-radius:10px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:1.1rem;">
          📦
        </div>

        <div>

          <div style="font-weight:700;font-size:.875rem;">
            ${updatedName}
          </div>

          <div style="font-size:.72rem;color:#8a8fa8;">
            UPDATED PRODUCT
          </div>

        </div>

      </div>
      `;

      row.data(data).draw();

    }

  });

  // =========================================
  // VIEW PRODUCT
  // =========================================

  $('#productsTable tbody').on('click', '.viewBtn', function () {

    const row = productTable.row($(this).parents('tr')).data();

    alert(
      "PRODUCT DETAILS\n\n" +
      "Product: " + $(row[1]).text().trim() + "\n" +
      "Category: " + $(row[2]).text().trim() + "\n" +
      "Price: " + row[3] + "\n" +
      "Sales: " + row[4]
    );

  });

});