document.addEventListener('DOMContentLoaded', () => {
const id = e.target.dataset.id;
const app = APPS.find(x => x._id === id);
if(!app) return;
document.getElementById('appId').value = app._id;
document.getElementById('company').value = app.company;
document.getElementById('role').value = app.role;
document.getElementById('package').value = app.package || '';
document.getElementById('drives').value = app.drives || 1;
document.getElementById('deadline').value = app.deadline ? new Date(app.deadline).toISOString().slice(0,10) : '';
document.getElementById('topics').value = (app.topics||[]).join(', ');
document.getElementById('status').value = app.status || 'upcoming';
const modal = new bootstrap.Modal(document.getElementById('addModal'));
modal.show();
}


if(e.target.matches('.del-btn')){
    const id = e.target.dataset.id;
    if(!confirm('Delete this application?')) return;
    fetch(`/apps/api/${id}`, { method: 'DELETE' }).then(r=>r.json()).then(data => {
    if(data.ok){ APPS.splice(APPS.findIndex(x=>x._id===id),1); render(); }
    });
}


document.getElementById('appForm').addEventListener('submit', async (e) => {
e.preventDefault();
const id = document.getElementById('appId').value;
const payload = {
company: document.getElementById('company').value,
role: document.getElementById('role').value,
package: document.getElementById('package').value,
drives: Number(document.getElementById('drives').value) || 1,
deadline: document.getElementById('deadline').value || null,
topics: document.getElementById('topics').value.split(',').map(s=>s.trim()).filter(Boolean),
status: document.getElementById('status').value
};
if(id){
const res = await fetch(`/apps/api/${id}`, { method: 'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
const json = await res.json();
if(json.ok){
const idx = APPS.findIndex(x=>x._id===id);
if(idx>-1) APPS[idx] = json.item;
}
} else {
const res = await fetch('/apps/api', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
const json = await res.json();
if(json.ok) APPS.unshift(json.item);
}
const modalEl = document.getElementById('addModal');
const modal = bootstrap.Modal.getInstance(modalEl);
if(modal) modal.hide();
document.getElementById('appForm').reset();
render();
});
