/* PORTAL BUBBLES */
window.addEventListener('DOMContentLoaded', () => {
  const portalContainer = document.getElementById('portal-container');
  const portalCount = 15;

  function spawnPortal() {
    const portal = document.createElement('div');
    portal.classList.add('portal-small');

    portal.style.left = Math.random() * window.innerWidth + 'px';
    portal.style.top = Math.random() * window.innerHeight + 'px';

    portal.style.animationDuration = (2 + Math.random() * 2) + 's';

    portalContainer.appendChild(portal);

    portal.addEventListener('animationend', () => {
      portal.remove();
      spawnPortal();
    });
  }

  for(let i = 0; i < portalCount; i++) {
    setTimeout(spawnPortal, i * 300);
  }
});
/*
---------------------------*/

/* BÖLÜMLER YÜKLENME ANİMASYONU */ 
window.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.fadeInUp');
    cards.forEach((card, i) => {
    card.style.animationDelay = `${i * 0.2}s`;
    card.style.animationPlayState = 'running';
    });
});
/*
---------------------------*/

/* LOADER ANİMASYONU */
window.addEventListener('DOMContentLoaded', () => {
  const fullPortal = document.getElementById('full-portal');

  fullPortal.addEventListener('animationend', () => {
    fullPortal.style.display = 'none';



  });
});
/*
---------------------------*/

/* MOBİL HAMBURGER MENÜ */
document.addEventListener("DOMContentLoaded", function () {
    const mobileNavbar = document.querySelector(".mobile-navbar")
    const toggleButton = document.getElementById("mobile-menu-toggle");
    const menuIcon = document.getElementById("menu-icon");
    const mobileMenu = document.getElementById("mobile-menu");

    let isOpen = false;

    toggleButton.addEventListener("click", function () {
        isOpen = !isOpen;

        mobileMenu.classList.toggle("open", isOpen);

        menuIcon.src = isOpen ? "images/morty_head.png" : "images/rick_head.png";

        menuIcon.classList.remove("bounce-in");
        void menuIcon.offsetWidth; // reflow zorlamak için
        menuIcon.classList.add("bounce-in");

        mobileNavbar.style.borderRadius = isOpen ? "15px 15px 0 0" : "15px";
    });
});
/*
---------------------------*/