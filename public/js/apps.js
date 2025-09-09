// public/js/apps.js
(() => {
  let APPS = Array.isArray(INITIAL_APPS) ? INITIAL_APPS.slice() : [];
  const ongoingEl = document.getElementById('ongoing');
  const upcomingEl = document.getElementById('upcoming');
  const completedEl = document.getElementById('completed');

  const modal = document.getElementById('appModal');
  const modalClose = document.querySelector('.modal-close');
  const addBtn = document.getElementById('addBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const form = document.getElementById('appForm');

  function render() {
    ongoingEl.innerHTML = '';
    upcomingEl.innerHTML = '';
    completedEl.innerHTML = '';

    APPS.forEach(a => {
      const card = document.createElement('div');
      card.className = 'app-card';
      const deadline = a.deadline ? new Date(a.deadline).toLocaleDateString() : 'N/A';
      const topics = a.topics || '';
      card.innerHTML = `
        <div class="card-head">
          <strong>${escapeHtml(a.company)}</strong>
          <div class="card-actions">
            <button data-id="${a.id}" class="edit-btn">Edit</button>
            <button data-id="${a.id}" class="del-btn">Delete</button>
          </div>
        </div>
        <div class="card-body">
          <div>${escapeHtml(a.role || '')}</div>
          <div>Package: ${escapeHtml(a.packageOffered || 'N/A')}</div>
          <div>Drives: ${a.drives ?? 'N/A'}</div>
          <div>Deadline: ${deadline}</div>
          <div>Topics: ${escapeHtml(topics)}</div>
        </div>
      `;

      if (a.status === 'ongoing') ongoingEl.appendChild(card);
      else if (a.status === 'upcoming') upcomingEl.appendChild(card);
      else if (a.status === 'completed') completedEl.appendChild(card);
    });

    // bind buttons
    document.querySelectorAll('.edit-btn').forEach(b => b.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      openEdit(id);
    }));
    document.querySelectorAll('.del-btn').forEach(b => b.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      deleteApp(id);
    }));
  }

  function openAdd() {
    document.getElementById('modalTitle').textContent = 'Add Application';
    form.reset();
    document.getElementById('appId').value = '';
    showModal();
  }

  function openEdit(id) {
    const a = APPS.find(x => String(x.id) === String(id));
    if (!a) return;
    document.getElementById('modalTitle').textContent = 'Edit Application';
    document.getElementById('appId').value = a.id;
    document.getElementById('company').value = a.company || '';
    document.getElementById('role').value = a.role || '';
    document.getElementById('packageOffered').value = a.packageOffered || '';
    document.getElementById('drives').value = a.drives ?? '';
    document.getElementById('deadline').value = a.deadline ? a.deadline.split('T')[0] : '';
    document.getElementById('topics').value = a.topics || '';
    document.getElementById('status').value = a.status || 'upcoming';
    showModal();
  }

  function showModal() {
    modal.style.display = 'block';
  }
  function closeModal() {
    modal.style.display = 'none';
  }

  modalClose && modalClose.addEventListener('click', closeModal);
  cancelBtn && cancelBtn.addEventListener('click', closeModal);
  addBtn && addBtn.addEventListener('click', openAdd);

  // submit handler - create or update via fetch
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('appId').value;
    const payload = {
      company: document.getElementById('company').value.trim(),
      role: document.getElementById('role').value.trim(),
      packageOffered: document.getElementById('packageOffered').value.trim(),
      drives: document.getElementById('drives').value,
      deadline: document.getElementById('deadline').value,
      topics: document.getElementById('topics').value.trim(),
      status: document.getElementById('status').value
    };

    try {
      let res;
      if (id) {
        res = await fetch(`/apps/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/apps`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Request failed');
      // update client data (we'll re-fetch full list)
      await reloadApps();
      closeModal();
    } catch (err) {
      alert('Error: ' + err.message);
      console.error(err);
    }
  });

  async function deleteApp(id) {
    if (!confirm('Delete this application?')) return;
    try {
      const res = await fetch(`/apps/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Delete failed');
      await reloadApps();
    } catch (err) {
      alert('Error deleting: ' + err.message);
      console.error(err);
    }
  }

  async function reloadApps() {
    try {
      const res = await fetch('/apps/api');
      APPS = await res.json();
      render();
    } catch (err) {
      console.error('Failed to reload apps', err);
    }
  }

  // small helper
  function escapeHtml(unsafe) {
    if (!unsafe && unsafe !== 0) return '';
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // init
  render();
})();
router.get("/dashboard", async (req, res) => {
  const apps = await Application.findAll();
  res.render("apps/dashboard", { apps, user: req.session.user });
});
