let ALL_BOOKS = [];

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

function renderBooks(list) {
  const container = document.getElementById("books");
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = `<div class="card"><h3>No books found</h3><p>Try another search or category.</p></div>`;
    return;
  }

  list.forEach(book => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${escapeHtml(book.title || "Untitled")}</h3>
      ${book.category ? `<p><b>Category:</b> ${escapeHtml(book.category)}</p>` : ""}
      <p>${escapeHtml(book.description || "")}</p>
      <a href="${book.file_url}" target="_blank" rel="noopener">
        <button>Read / Download</button>
      </a>
    `;
    container.appendChild(div);
  });
}

function buildCategories() {
  const sel = document.getElementById("category");
  if (!sel) return;

  const counts = {};
  ALL_BOOKS.forEach(b => {
    const c = (b.category || "").trim();
    if (!c) return;
    counts[c] = (counts[c] || 0) + 1;
  });

  const cats = Object.keys(counts).sort((a, b) => a.localeCompare(b));
  sel.innerHTML =
    `<option value="">All categories</option>` +
    cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)} (${counts[c]})</option>`).join("");
}

function applyFilters() {
  const q = (document.getElementById("search")?.value || "").trim().toLowerCase();
  const cat = (document.getElementById("category")?.value || "").trim();

  let list = ALL_BOOKS.slice();

  if (cat) list = list.filter(b => (b.category || "").trim() === cat);

  if (q) {
    list = list.filter(b => {
      const title = (b.title || "").toLowerCase();
      const desc = (b.description || "").toLowerCase();
      const author = (b.author || "").toLowerCase();
      const category = (b.category || "").toLowerCase();
      return title.includes(q) || desc.includes(q) || author.includes(q) || category.includes(q);
    });
  }

  renderBooks(list);
}

async function init() {
  const res = await fetch("books.json");
  const data = await res.json();
  ALL_BOOKS = data.items || [];

  buildCategories();
  applyFilters();

  document.getElementById("search")?.addEventListener("input", applyFilters);
  document.getElementById("category")?.addEventListener("change", applyFilters);
}

init();
