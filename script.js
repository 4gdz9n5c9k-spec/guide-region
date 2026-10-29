/ Mobile navigation
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? '✕' : '☰';
});

nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = '☰';
    });
});

// Light and dark themes
const themeButton = document.querySelector('#theme-toggle');

function setTheme(isDark) {
    document.body.classList.toggle('dark', isDark);
    themeButton.textContent = isDark
        ? '☀ SWITCH TO LIGHT MODE'
        : '☾ SWITCH TO DARK MODE';
    localStorage.setItem('guide-theme', isDark ? 'dark' : 'light');
}

setTheme(localStorage.getItem('guide-theme') === 'dark');

themeButton.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark'));
});

// Choose a route and jump to the trip planner
const routeButtons = document.querySelectorAll('.route-select');
routeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        document.querySelector('#route').value = button.dataset.route;
        document.querySelector('#plan').scrollIntoView({ behavior: 'smooth' });
    });
});

// Generate a trip checklist PDF from the form
const tripForm = document.querySelector('#trip-form');
tripForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    const route = document.querySelector('#route').value;
    const days = document.querySelector('#days').value;
    const group = document.querySelector('#group').value;
    const email = document.querySelector('#email').value;
    const phone = document.querySelector('#phone').value;
    const status = document.querySelector('#form-status');

    if (!window.jspdf) {
        status.textContent = 'PDF library unavailable. Please check your internet connection and retry.';
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.text('GUIDE REGION', 20, 25);
    pdf.setFontSize(16);
    pdf.text('Almaty Trip Checklist', 20, 40);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);

    const tripDetails = [
        `Route: ${route}`,
        `Duration: ${days} day(s)`,
        `Group size: ${group}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`
    ];
    tripDetails.forEach((line, index) => pdf.text(line, 20, 55 + index * 9));

    pdf.setFont('helvetica', 'bold');
    pdf.text('Before you go', 20, 115);
    pdf.setFont('helvetica', 'normal');

    const checklist = [
        '[ ] Check weather and route accessibility',
        '[ ] Pack water, snacks, and warm layers',
        '[ ] Charge your phone and power bank',
        '[ ] Share your itinerary with someone',
        '[ ] Check transport and opening hours',
        '[ ] Save emergency number: 112'
    ];
    checklist.forEach((line, index) => pdf.text(line, 20, 127 + index * 10));

    pdf.setFontSize(9);
    pdf.text('Guide Region | Educational tourism project', 20, 205);
    pdf.save('guide-region-almaty-trip.pdf');
    status.textContent = 'Your PDF checklist has been generated.';
});
