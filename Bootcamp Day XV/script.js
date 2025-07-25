(async function () {
  const loadJquery = () => new Promise((resolve) => {
    if (window.jQuery) return resolve();
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js';
    script.onload = resolve;
    document.head.appendChild(script);
  });

  await loadJquery();
  const $ = jQuery;

  const selectors = {
    appendTo: '.ins-api-users',
    wrapper: 'ins-user-wrapper',
    card: 'ins-user-card',
    deleteBtn: 'ins-user-delete-btn'
  };

  const storageKey = 'ins-users';
  const cacheDuration = 24 * 60 * 60 * 1000;

  function buildCSS() {
    const style = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

    body {
      font-family: 'Poppins', sans-serif;
      margin: 0;
      padding: 0;
      background: #f8f8f8;
    }

    header, footer {
      text-align: center;
      padding: 1rem;
      background: #2c3e50;
      color: white;
      font-weight: 600;
    }

    .${selectors.wrapper} {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 20px;
      padding: 20px;
      max-width: 1200px;
      margin: auto;
    }

    .${selectors.card} {
      background: #fff;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      transition: transform 0.2s;
      height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }


    .${selectors.card}:hover {
      transform: translateY(-3px);
    }

    .${selectors.card} h3 {
      margin-top: 0;
      font-size: 1.2rem;
      color: #333;
    }

    .${selectors.card} p {
      margin: 5px 0;
      color: #555;
      font-size: 0.95rem;
    }

    .${selectors.deleteBtn} {
      margin-top: 10px;
      background: #e74c3c;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      width: 25%;
      gap: 6px;
    }

    .${selectors.deleteBtn}:hover {
      background: #c0392b;
    }

    #restore-users {
      background:#3498db;
      color:white;
      border:none;
      padding:10px 15px;
      border-radius:5px;
      cursor:pointer;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 1rem;
    }

    #restore-users:hover {
      background: #2980b9;
    }
  `;
    const styleTag = document.createElement('style');
    styleTag.innerHTML = style;
    document.head.appendChild(styleTag);
  }


  function buildHTML() {
    const layout = `
      <header><i class="fas fa-users"></i> Kullanıcı Listesi</header>
      <div class="${selectors.wrapper}"></div>
      <footer><i class="fas fa-code"></i> © 2025 - CodeCraft Bootcamp kapsamında oyldrr tarafından hazırlanmıştır.</footer>
    `;
    $(selectors.appendTo).html(layout);
  }

  function renderCards(users) {
    const $wrapper = $(`.${selectors.wrapper}`);
    $wrapper.empty();

    if (!users.length) {
      const emptyMsg = $(`
        <div style="text-align: center; grid-column: 1 / -1;">
          <p style="font-size: 1.1rem; color: #555;">Hiç kullanıcı kalmadı.</p>
          <button id="restore-users">
            <i class="fas fa-rotate-left"></i> Kullanıcıları Geri Yükle
          </button>
        </div>
      `);
      $wrapper.append(emptyMsg);
      return;
    }

    users.forEach(user => {
      const $card = $(`
        <div class="${selectors.card}" data-id="${user.id}">
          <h3><i class="fas fa-user"></i> ${user.name}</h3>
          <p><i class="fas fa-envelope"></i> ${user.email}</p>
          <p><i class="fas fa-location-dot"></i> ${user.address.street}, ${user.address.city}</p>
          <button class="${selectors.deleteBtn}">
            <i class="fas fa-trash-alt"></i> Sil
          </button>
        </div>
      `);
      $wrapper.append($card);
    });
  }

  function saveToStorage(data) {
    localStorage.setItem(storageKey, JSON.stringify({ data, timestamp: Date.now() }));
  }

  function loadFromStorage() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < cacheDuration) {
        return parsed.data;
      } else {
        localStorage.removeItem(storageKey);
        return null;
      }
    } catch {
      return null;
    }
  }

  async function fetchUsers() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('API yanıtı başarısız');
      const data = await response.json();
      saveToStorage(data);
      return data;
    } catch (err) {
      alert('Kullanıcı verileri alınamadı.');
      console.error(err);
      return [];
    }
  }

  function setupDelete() {
    $(document).on('click', `.${selectors.deleteBtn}`, function () {
      const $card = $(this).closest(`.${selectors.card}`);
      const id = +$card.data('id');
      $card.remove();
      const existing = loadFromStorage();
      if (!existing) return;
      const updated = existing.filter(user => user.id !== id);
      saveToStorage(updated);
    });
  }

  $(document).on('click', '#restore-users', async function () {
    localStorage.removeItem(storageKey);
    const users = await fetchUsers();
    renderCards(users);
  });

  async function init() {
    buildCSS();
    buildHTML();
    setupDelete();

    let users = loadFromStorage();
    if (!users) {
      users = await fetchUsers();
    }

    renderCards(users);
  }

  init();
})();
