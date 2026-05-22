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
