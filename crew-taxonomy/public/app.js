(function () {
  const deptSelect = document.getElementById('dept-select');
  const searchInput = document.getElementById('search');
  const tagFilter = document.getElementById('tag-filter');
  const roleList = document.getElementById('role-list');
  const roleDetail = document.getElementById('role-detail');

  function api(path) {
    return fetch(path).then((r) => (r.ok ? r.json() : Promise.reject(r)));
  }

  function loadDepartments() {
    return api('/api/departments').then((depts) => {
      deptSelect.innerHTML = '<option value="">All departments</option>';
      depts.forEach((d) => {
        const opt = document.createElement('option');
        opt.value = d.slug;
        opt.textContent = d.name;
        deptSelect.appendChild(opt);
      });
    });
  }

  function loadRoles() {
    const params = new URLSearchParams();
    const q = searchInput.value.trim();
    const dept = deptSelect.value;
    const tag = tagFilter.value.trim();
    if (q) params.set('query', q);
    if (dept) params.set('department', dept);
    if (tag) params.set('tag', tag);
    return api('/api/roles?' + params.toString()).then(renderRoleList);
  }

  function renderRoleList(roles) {
    roleList.innerHTML = '';
    roleDetail.classList.add('hidden');
    if (!roles.length) {
      roleList.innerHTML = '<p class="empty">No roles match.</p>';
      return;
    }
    roles.forEach((r) => {
      const card = document.createElement('div');
      card.className = 'role-card';
      card.innerHTML = `
        <strong class="role-name">${escapeHtml(r.canonical_name)}</strong>
        <span class="dept">${escapeHtml(r.department_name)}</span>
        ${r.aliases && r.aliases.length ? `<span class="aliases">${escapeHtml(r.aliases.join(', '))}</span>` : ''}
        ${r.tags && r.tags.length ? `<span class="tags">${r.tags.map((t) => `<em>${escapeHtml(t)}</em>`).join(' ')}</span>` : ''}
      `;
      card.addEventListener('click', () => showRoleDetail(r.id));
      roleList.appendChild(card);
    });
  }

  function showRoleDetail(id) {
    api('/api/roles/' + id).then((r) => {
      roleDetail.classList.remove('hidden');
      roleDetail.innerHTML = `
        <h2>${escapeHtml(r.canonical_name)}</h2>
        <p class="dept">${escapeHtml(r.department_name)}</p>
        ${r.aliases && r.aliases.length ? `<p><strong>Aliases:</strong> ${escapeHtml(r.aliases.map((a) => (typeof a === 'string' ? a : a.alias)).join(', '))}</p>` : ''}
        ${r.tags && r.tags.length ? `<p><strong>Tags:</strong> ${r.tags.map((t) => escapeHtml(t)).join(', ')}</p>` : ''}
        ${r.description ? `<p>${escapeHtml(r.description)}</p>` : ''}
        ${r.typical_context ? `<p><strong>Context:</strong> ${escapeHtml(r.typical_context)}</p>` : ''}
      `;
    });
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function debounce(fn, ms) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }

  loadDepartments().then(loadRoles);
  deptSelect.addEventListener('change', loadRoles);
  searchInput.addEventListener('input', debounce(loadRoles, 200));
  tagFilter.addEventListener('input', debounce(loadRoles, 200));
})();
