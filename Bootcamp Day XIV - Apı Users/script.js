/* eslint-disable */
(($) => {
    'use strict';

    const classes = {
        style: 'ins-user-style',
        wrapper: 'ins-user-wrapper',
        container: 'ins-user-container',
        card: 'ins-user-card',
        deleteButton: 'ins-user-delete-btn',
        header: 'ins-user-header',
        footer: 'ins-user-footer'
    };

    const selectors = {
        style: `.${classes.style}`,
        wrapper: `.${classes.wrapper}`,
        card: `.${classes.card}`,
        deleteButton: `.${classes.deleteButton}`,
        header: `.${classes.header}`,
        footer: `.${classes.footer}`,
        appendLocation: '.ins-api-users'
    };

    const self = {};
    const STORAGE_KEY = 'ins_users';
    const STORAGE_TIME_KEY = 'ins_users_time';
    const ONE_DAY = 24 * 60 * 60 * 1000;

    self.init = () => {
        self.reset();
        self.buildCSS();
        self.buildLayout();
        self.loadData().then(data => {
            self.buildCards(data);
            self.setEvents();
        }).catch(err => {
            self.showError(err);
        });
    };

    self.reset = () => {
        $(selectors.style).remove();
        $(selectors.wrapper).remove();
        $(selectors.header).remove();
        $(selectors.footer).remove();
        $(document).off('.userEvents');
    };

    self.buildCSS = () => {
        const css = `
      <style class="${classes.style}">
        body {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          background: #f5f7fa;
          color: #2c3e50;
        }

        ${selectors.header}, ${selectors.footer} {
          background-color: #1e293b;
          color: white;
          text-align: center;
          padding: 1rem 2rem;
        }

        ${selectors.header} h1 {
          margin: 0;
          font-size: 1.6rem;
        }

        ${selectors.footer} p {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.7;
        }

        ${selectors.wrapper} {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        ${selectors.card} {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
          transition: transform 0.2s;
          position: relative;
        }

        ${selectors.card}:hover {
          transform: translateY(-4px);
        }

        ${selectors.card} h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        ${selectors.card} p {
          font-size: 0.9rem;
          margin: 0.2rem 0;
          color: #555;
        }

        ${selectors.deleteButton} {
          margin-top: 1rem;
          background-color: #ef4444;
          color: #fff;
          border: none;
          padding: 0.5rem 0.9rem;
          font-size: 0.9rem;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        ${selectors.deleteButton}:hover {
          background-color: #dc2626;
        }

        .ins-error {
          background: #ffe0e0;
          color: #b91c1c;
          padding: 1rem;
          margin: 1rem auto;
          max-width: 600px;
          border-left: 5px solid #ef4444;
          border-radius: 8px;
          font-weight: 600;
        }
      </style>
    `;
        $('head').append(css);
    };

    self.buildLayout = () => {
        const header = `<header class="${classes.header}"><h1><i class="fas fa-users"></i> Kullanıcı Listesi</h1></header>`;
        const wrapper = `<div class="${classes.wrapper}"></div>`;
        const footer = `<footer class="${classes.footer}"><p><i class="fas fa-code"></i> Codecraft Bootcamp kapsamında oyldrr tarafından hazırlandı.</p></footer>`;
        $(selectors.appendLocation).append(header + wrapper + footer);
    };

    self.buildCards = (users) => {
        const $wrapper = $(selectors.wrapper);
        users.forEach(user => {
            const $card = $(`
        <div class="${classes.card}" data-id="${user.id}">
          <h3><i class="fas fa-user"></i> ${user.name}</h3>
          <p><i class="fas fa-envelope"></i> ${user.email}</p>
          <p><i class="fas fa-location-dot"></i> ${user.address.street}, ${user.address.city}</p>
          <button class="${classes.deleteButton}">
            <i class="fas fa-trash-alt"></i> Sil
          </button>
        </div>
      `);
            $wrapper.append($card);
        });
    };

    self.setEvents = () => {
        $(document).on('click.userEvents', selectors.deleteButton, function () {
            const $card = $(this).closest(selectors.card);
            const id = parseInt($card.data('id'));
            let users = self.getStorage();
            users = users.filter(user => user.id !== id);
            self.setStorage(users);
            $card.remove();
        });
    };

    self.loadData = () => {
        return new Promise((resolve, reject) => {
            const cached = self.getStorage();
            const time = localStorage.getItem(STORAGE_TIME_KEY);
            if (cached && time && (Date.now() - parseInt(time) < ONE_DAY)) {
                resolve(cached);
            } else {
                $.ajax({
                    url: 'https://jsonplaceholder.typicode.com/users',
                    method: 'GET',
                    dataType: 'json'
                }).done(data => {
                    self.setStorage(data);
                    resolve(data);
                }).fail(() => {
                    reject('Kullanıcı verisi alınamadı.');
                });
            }
        });
    };

    self.setStorage = (data) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        localStorage.setItem(STORAGE_TIME_KEY, Date.now().toString());
    };

    self.getStorage = () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    };

    self.showError = (message) => {
        const $error = $(`<div class="ins-error"><i class="fas fa-triangle-exclamation"></i> ${message}</div>`);
        $(selectors.appendLocation).append($error);
    };

    $(document).ready(self.init);
})(jQuery);
