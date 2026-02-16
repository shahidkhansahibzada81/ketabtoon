async function loadBooks() {
  const res = await fetch("books.json");
  const data = await res.json();
  const container = document.getElementById("books");

  container.innerHTML = "";

  data.items.forEach(book => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${book.title}</h3>
      <p>${book.description}</p>
      <a href="${book.file_url}" target="_blank">
        <button>Read / Download</button>
      </a>
    `;
    container.appendChild(div);
  });
}

loadBooks();
