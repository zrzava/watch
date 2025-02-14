// BACKGROUND
document.addEventListener("DOMContentLoaded", function () {

    const images = [
        { url: "img/bg/chatavlese.webp", dateRange: ["2024-12-01", "2025-03-02"], caption: "Zima" }, 
        { url: "img/bg/chatavlese.webp", dateRange: ["2025-03-03", "2025-06-25"], caption: "Jaro" }, 
        { url: "img/bg/chatavlese.webp", dateRange: ["2025-06-26", "2025-10-04"], caption: "Léto" }, 
        { url: "img/bg/chatavlese.webp", dateRange: ["2025-10-05", "2025-11-30"], caption: "Podzim" }, 
        { url: "img/bg/chatavlese.webp", dateRange: ["2025-12-01", "2026-02-25"], caption: "Zima" }
    ];

    // Specifická data s pevně přiřazeným obrázkem
    const dateSpecificImages = {
        "2025-02-14": { url: "img/bg/valentyn.webp", caption: "Valentýn" },
        "2025-04-01": { url: "img/bg/valentyn.webp", caption: "April" },
        "2025-08-31": { url: "img/bg/valentyn.webp", caption: "Back to school" },
        "2025-09-01": { url: "img/bg/valentyn.webp", caption: "Back to school" },
        "2025-09-02": { url: "img/bg/valentyn.webp", caption: "Back to school" },
        "2025-12-24": { url: "img/bg/vanoce.webp", caption: "Vánoční kouzlo" },
        "2025-12-25": { url: "img/bg/vanoce.webp", caption: "Vánoční kouzlo" },
        "2025-12-26": { url: "img/bg/vanoce.webp", caption: "Vánoční kouzlo" },
        "2025-12-31": { url: "img/bg/silvestr.webp", caption: "Silvestr - Nový rok" },
        "2026-01-01": { url: "img/bg/silvestr.webp", caption: "Silvestr - Nový rok" }
    };

// Vytvoření prvku pro text
const captionElement = document.createElement("div");
captionElement.style.position = "fixed";
captionElement.style.right = "10px";
captionElement.style.bottom = "10px"; // Výchozí spodní vzdálenost
captionElement.style.padding = "5px 10px";
captionElement.style.color = "white";
captionElement.style.fontSize = "0.6rem";
captionElement.style.borderRadius = "5px";
captionElement.style.zIndex = "1000";
captionElement.style.transition = "bottom 0.2s ease";
document.body.appendChild(captionElement);

// Funkce pro zobrazení popisku
function showCaption(caption) {
    captionElement.textContent = caption;
}

// Funkce pro sledování scrollování a úpravu pozice popisku
function updateCaptionPosition() {
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    const distanceFromBottom = document.documentElement.scrollHeight - windowHeight - scrollPosition;

    // Pokud je pozice scrollování blízko k dolnímu okraji (px), posuneme popisek
    if (distanceFromBottom <= 60) {
        captionElement.style.bottom = "115px";
    } else {
        captionElement.style.bottom = "10px";
    }
}

// Zavolání při načítání stránky s intervalem
window.addEventListener("load", function() {
    // Použití setTimeout pro zajištění správné počáteční pozice popisku
    setTimeout(updateCaptionPosition, 100); // Počkej 100 ms před vykonáním
});

// Přidání posluchače pro scrollování
window.addEventListener("scroll", updateCaptionPosition);



    // Získání ID titulu z URL (pokud existuje)
    const urlParams = new URLSearchParams(window.location.search);
    const titleId = urlParams.get('play');

    // Pokud je parametr 'play', nastaví se pozadí, ale žádný text se nezobrazí
if (titleId) {
    // Zjišťujeme šířku obrazovky
    const isMobile = window.innerWidth <= 768; // Pokud je šířka obrazovky menší nebo rovna 768px, považujeme zařízení za mobilní

    if (!isMobile) {
        // Na tabletu a desktopu se pokusíme načíst specifické pozadí podle titleId
        const titleImageUrl = `img/title/bg/${titleId}.webp`;
        fetch(titleImageUrl, { method: 'HEAD' })
            .then(response => {
                const exists = response.ok;
                document.body.style.backgroundImage = `url('${exists ? titleImageUrl : 'img/title/bg/default.webp'}')`;
                document.body.style.backgroundSize = "cover";
                document.body.style.backgroundPosition = "center";
                document.body.style.backgroundRepeat = "no-repeat";  // Zabranění opakování
                console.log(`Použito titulní pozadí: ${exists ? titleImageUrl : 'img/title/bg/default.webp'}`);
            })
            .catch(() => {
                document.body.style.backgroundImage = "url('img/title/bg/default.webp')";
                document.body.style.backgroundSize = "cover";
                document.body.style.backgroundPosition = "center";
                document.body.style.backgroundRepeat = "no-repeat";  // Zabranění opakování
                console.log("Titulní pozadí nenalezeno, použito defaultní.");
            });
    } else {
        // Na mobilu použijeme pouze defaultní obrázek
        document.body.style.backgroundImage = "url('img/title/bg/default.webp')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";  // Zabranění opakování
        console.log("Na mobilu použito pouze defaultní pozadí.");
    }

    return;
}


    // Získání dnešního data ve formátu YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    if (dateSpecificImages[today]) {
        document.body.style.backgroundImage = `url('${dateSpecificImages[today].url}')`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat"; // Zabranění opakování
        showCaption(dateSpecificImages[today].caption);
        console.log(`Dnešní datum ${today}, použito speciální pozadí`);
    } else {
        // Pokud dnes není specifické datum, vybere se pozadí z intervalu "od-do"
        const selectedImage = getImageForToday(images, today);
        if (selectedImage) {
            document.body.style.backgroundImage = `url('${selectedImage.url}')`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundRepeat = "no-repeat"; // Zabranění opakování
            showCaption(selectedImage.caption);
            console.log(`Použito pozadí z intervalu: ${selectedImage.url}`);
        }
    }

    // Posluchač pro scrollování
    window.addEventListener("scroll", updateCaptionPosition);

    // Inicializace pozice popisku při načtení
    updateCaptionPosition();
});

// Funkce pro výběr pozadí na základě dnešního data a intervalu "od-do"
function getImageForToday(images, today) {
    return images.find(image => {
        const [startDate, endDate] = image.dateRange;
        return today >= startDate && today <= endDate;
    });
}

// CURRENT YEAR COPYRIGHT
document.addEventListener("DOMContentLoaded", function () {
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll(".current-year"); // Vybere všechny s class
    yearElements.forEach(function(yearElement) {
        yearElement.textContent = currentYear;
    });
});

// OVERLAY aka burgermenu 
const overlay = document.getElementById('burgermenu');
const closeOverlay = document.getElementById('close-burgermenu');
const overlayLinks = document.querySelectorAll('#burgermenu-menu a');
const burgerMenuTrigger = document.querySelector('.burgermenu-trigger');

// Funkce pro zobrazení/skrytí overlay menu
function toggleOverlay() {
    if (overlay.style.display === 'flex') {
        overlay.style.display = 'none';
    } else {
        overlay.style.display = 'flex';
    }
}

// Otevření menu kliknutím na burger ikonu
burgerMenuTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    toggleOverlay();  // Toggle pro zobrazení/skrytí menu
});

// Zavření menu po kliknutí na odkaz
overlayLinks.forEach(link => {
    link.addEventListener('click', () => {
        overlay.style.display = 'none';
    });
});

// Zavření menu stiskem klávesy Escape
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        overlay.style.display = 'none';
    }
});

// TABS
function showTab(event, tabId) {
    event.preventDefault();

    // Skryje všechny sekce s obsahem
    document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');

    // Zobrazí vybranou sekci
    document.getElementById(tabId).style.display = 'block';

    // Odebere 'active' třídu ze všech záložek
    document.querySelectorAll('#tabs a').forEach(link => link.classList.remove('active'));

    // Přidá 'active' třídu pouze aktuální záložce
    event.target.classList.add('active');
}
