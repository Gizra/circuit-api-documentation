(function () {
  // Derive root URL from this script's own src so relative links work at any depth
  var scriptEl = document.currentScript ||
    (function () {
      var scripts = document.querySelectorAll('script[src*="sidebar.js"]');
      return scripts[scripts.length - 1];
    })();
  var root = scriptEl ? scriptEl.src.replace(/assets\/js\/sidebar\.js(\?.*)?$/, '') : '/';

  // ── Menu definition ────────────────────────────────────────────────────────
  var MENU = [
    { label: 'Home', href: 'index.html' },
    { label: 'Authentication', href: 'authentication.html' },
    {
      label: 'Clients', id: 'sb-clients', children: [
        { label: 'List Clients',     href: 'clients/list.html' },
        { label: 'Get Client',       href: 'clients/get.html' },
        { label: 'Create Client',    href: 'clients/create.html' },
        { label: 'Update Client',    href: 'clients/update.html' },
        { label: 'Connect Clients',  href: 'clients/connect.html' },
        { label: 'Merge Clients',    href: 'clients/merge.html' },
      ]
    },
    {
      label: 'Client Addresses', id: 'sb-addresses', children: [
        { label: 'List Addresses',   href: 'addresses/list.html' },
        { label: 'Get Address',      href: 'addresses/get.html' },
        { label: 'Create Address',   href: 'addresses/create.html' },
        { label: 'Update Address',   href: 'addresses/update.html' },
        { label: 'Delete Address',   href: 'addresses/delete.html' },
      ]
    },
    {
      label: 'Consignments', id: 'sb-consignments', children: [
        { label: 'List Consignments', href: 'consignments/list.html' },
        { label: 'Create Consignment',href: 'consignments/create.html' },
        { label: 'Update Consignment',href: 'consignments/update.html' },
      ]
    },
    {
      label: 'Orders', id: 'sb-orders', children: [
        { label: 'List Orders',       href: 'orders/list.html' },
        { label: 'Get Order',         href: 'orders/get.html' },
        { label: 'Create Order',      href: 'orders/create.html' },
        { label: 'Update Order',      href: 'orders/update.html' },
        { label: 'Split Order',       href: 'orders/split.html' },
        { label: 'Credit Note',       href: 'orders/credit-note.html' },
        { label: 'Cancel & Reissue',  href: 'orders/cancel-reissue.html' },
      ]
    },
    {
      label: 'Items', id: 'sb-items', children: [
        { label: 'List Items',        href: 'items/list.html' },
        { label: 'Get Item',          href: 'items/get.html' },
        { label: 'Create Item',       href: 'items/create.html' },
        { label: 'Update Item',       href: 'items/update.html' },
        { label: 'Bulk Operations',   href: 'items/bulk.html' },
        { label: 'Clone / Move',      href: 'items/clone-move.html' },
      ]
    },
    {
      label: 'Sales', id: 'sb-sales', children: [
        { label: 'List Sales',        href: 'sales/list.html' },
        { label: 'Get Sale',          href: 'sales/get.html' },
        { label: 'Create Sale',       href: 'sales/create.html' },
        { label: 'Update Sale',       href: 'sales/update.html' },
      ]
    },
    {
      label: 'Transactions', id: 'sb-transactions', children: [
        { label: 'List Transactions', href: 'transactions/list.html' },
        { label: 'Create Transaction',href: 'transactions/create.html' },
      ]
    },
    {
      label: 'Activities', id: 'sb-activities', children: [
        { label: 'List Activities',   href: 'activities/list.html' },
        { label: 'Messages',          href: 'activities/messages.html' },
        { label: 'Nodes',             href: 'activities/nodes.html' },
      ]
    },
    {
      label: 'Computed', id: 'sb-computed', children: [
        { label: 'Client Stat Summary', href: 'computed/client-stat-summary.html' },
        { label: 'Client Statistics',   href: 'computed/client-stat.html' },
      ]
    },
    {
      label: 'Viewings', id: 'sb-viewings', children: [
        { label: 'List Viewings',     href: 'viewings/list.html' },
      ]
    },
    {
      label: 'Taxonomy', id: 'sb-taxonomy', children: [
        { label: 'All Taxonomy',      href: 'taxonomy/index.html' },
        { label: 'Art Work Types',    href: 'taxonomy/art_work_types.html' },
        { label: 'Mediums',           href: 'taxonomy/mediums.html' },
      ]
    },
    {
      label: 'Shipping', id: 'sb-shipping', children: [
        { label: 'Shipments',         href: 'shipping/shipments.html' },
      ]
    },
    { label: 'Notes',                 href: 'notes/list.html' },
    { label: 'Payments',              href: 'payments.html' },
    { label: 'Migration',             href: 'migration.html' },
    { label: 'Messages',              href: 'messages.html' },
    { label: 'Public',                href: 'public.html' },
    { label: 'Users',                 href: 'users.html' },
    { label: 'Commands',              href: 'commands.html' },
    { label: 'Exports',               href: 'exports.html' },
    { label: 'Files',                 href: 'files.html' },
    { label: 'Additional Endpoints',  href: 'additional-endpoints.html' },
    {
      label: 'Other Endpoints', id: 'sb-other', children: [
        { label: 'Get File',          href: 'files/get.html' },
        { label: 'Queue Item',        href: 'queue/get-item.html' },
        { label: 'Bulk Dispatcher',   href: 'bulk/dispatcher.html' },
      ]
    },
    { label: 'Common Parameters',     href: 'common.html' },
    { label: 'Error Handling',        href: 'errors.html' },
    { label: 'Data Types',            href: 'data-types.html' },
    { label: 'API /me',               href: 'api-me.html' },
    { label: 'Pusher Events',         href: 'pusher-events.html' },
  ];

  // ── CSS ─────────────────────────────────────────────────────────────────────
  var css = [
    '.doc-sidebar{position:sticky;top:70px;height:calc(100vh - 70px);overflow-y:auto;',
    'padding:16px 0;background:#fff;border-right:1px solid #dee2e6;}',
    '.doc-sidebar .nav-link{color:#495057;padding:.3rem 1rem;border-radius:.25rem;',
    'margin:.1rem .4rem;font-size:.9rem;}',
    '.doc-sidebar .nav-link:hover,.doc-sidebar .nav-link.active{background:#e9ecef;color:#0d6efd;}',
    '.doc-sidebar .nav-link.section-toggle{font-weight:600;display:flex;justify-content:space-between;align-items:center;}',
    '.doc-sidebar .nav-link.section-toggle::after{content:"\\203A";font-size:1.1rem;',
    'transition:transform .2s;display:inline-block;}',
    '.doc-sidebar .nav-link.section-toggle.open::after{transform:rotate(90deg);}',
    '.doc-sidebar .sub-links{overflow:hidden;max-height:0;transition:max-height .25s ease;}',
    '.doc-sidebar .sub-links.open{max-height:600px;}',
    '@media(max-width:992px){.doc-sidebar{position:static;height:auto;border-right:none;',
    'border-bottom:1px solid #dee2e6;margin-bottom:1rem;}}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Build sidebar HTML ───────────────────────────────────────────────────────
  var currentPath = window.location.pathname;

  function isActive(href) {
    var full = root + href;
    // Compare by resolving to same-origin absolute path
    try {
      var a = document.createElement('a');
      a.href = full;
      return a.pathname === currentPath;
    } catch (e) {
      return currentPath.endsWith(href);
    }
  }

  function buildHTML() {
    var html = '<nav class="nav flex-column">';
    MENU.forEach(function (item) {
      if (!item.children) {
        var active = isActive(item.href) ? ' active' : '';
        html += '<a class="nav-link' + active + '" href="' + root + item.href + '">' + item.label + '</a>';
      } else {
        var anyActive = item.children.some(function (c) { return isActive(c.href); });
        var openClass = anyActive ? ' open' : '';
        html += '<a class="nav-link section-toggle' + openClass + '" data-sb-toggle="' + item.id + '">' + item.label + '</a>';
        html += '<div class="sub-links' + openClass + '" id="' + item.id + '">';
        item.children.forEach(function (child) {
          var active = isActive(child.href) ? ' active' : '';
          html += '<a class="nav-link ps-4' + active + '" href="' + root + child.href + '">' + child.label + '</a>';
        });
        html += '</div>';
      }
    });
    html += '</nav>';
    return html;
  }

  // ── Toggle click handler ─────────────────────────────────────────────────────
  function attachToggle(sidebar) {
    sidebar.addEventListener('click', function (e) {
      var toggle = e.target.closest('[data-sb-toggle]');
      if (!toggle) return;
      e.preventDefault();
      var targetId = toggle.getAttribute('data-sb-toggle');
      var panel = sidebar.querySelector('#' + targetId);
      if (!panel) return;
      var isOpen = panel.classList.contains('open');
      panel.classList.toggle('open', !isOpen);
      toggle.classList.toggle('open', !isOpen);
    });
  }

  // ── Restructure page layout ─────────────────────────────────────────────────
  function inject() {
    var mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'container-fluid';

    var row = document.createElement('div');
    row.className = 'row g-0';

    var sidebarCol = document.createElement('div');
    sidebarCol.className = 'col-lg-3 col-xl-2 doc-sidebar';
    sidebarCol.innerHTML = buildHTML();

    var contentCol = document.createElement('div');
    contentCol.className = 'col-lg-9 col-xl-10';

    mainContent.parentNode.insertBefore(wrapper, mainContent);
    wrapper.appendChild(row);
    row.appendChild(sidebarCol);
    row.appendChild(contentCol);
    contentCol.appendChild(mainContent);

    // Remove Bootstrap's container class so it doesn't conflict with container-fluid
    mainContent.classList.remove('container');

    attachToggle(sidebarCol);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();