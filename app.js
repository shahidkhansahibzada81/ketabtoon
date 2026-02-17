let ALL_BOOKS = [];

function renderBooks(list) {
  const container = document.getElementById("books");
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = `<div class="card"><h3>No books found</h3><p>Try another search.</p></div>`;
    return;
  }

  list.forEach(book => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${book.title || "Untitled"}</h3>
      <p>${book.description || ""}</p>
      <a href="${book.file_url}" target="_blank" rel="noopener">
        <button>Read / Download</button>
      </a>
    `;
    container.appendChild(div);
  });
}

function filterBooks(q) {
  q = (q || "").trim().toLowerCase();
  if (!q) return ALL_BOOKS;

  return ALL_BOOKS.filter(b => {
    const title = (b.title || "").toLowerCase();
    const desc = (b.description || "").toLowerCase();
    const author = (b.author || "").toLowerCase();
    const category = (b.category || "").toLowerCase();
    return title.includes(q) || desc.includes(q) || author.includes(q) || category.includes(q);
  });
}

async function init() {
  const res = await fetch("books.json");
  const data = await res.json();
  ALL_BOOKS = data.items || [];
// Create category dropdown
const categorySelect = document.getElementById("category");

if (categorySelect) {
  const categories = [...new Set(ALL_BOOKS.map(b => b.category).filter(Boolean))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  categorySelect.addEventListener("change", () => {
    const selected = categorySelect.value;
    if (!selected) {
      renderBooks(ALL_BOOKS);
    } else {
      renderBooks(ALL_BOOKS.filter(b => b.category === selected));
    }
  });
}

  renderBooks(ALL_BOOKS);

  const search = document.getElementById("search");
  if (search) {
    search.addEventListener("input", (e) => {
      const filtered = filterBooks(e.target.value);
      renderBooks(filtered);
    });
  }
}

init();

