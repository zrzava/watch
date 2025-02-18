
// Last UPDATE
        const repo = "zrzava/watch"; // Název repozitáře
        const filePath = "titles.json"; // Cesta k souboru, který sleduješ
        const apiUrl = `https://api.github.com/repos/${repo}/commits?path=${filePath}`;

        async function getLastUpdate() {
            try {
                const response = await fetch(apiUrl, {
                    headers: { "User-Agent": "Mozilla/5.0" } // GitHub API vyžaduje User-Agent
                });
                const data = await response.json();

                if (data.length > 0) {
                    const lastUpdate = new Date(data[0].commit.author.date);

                    // Získání jednotlivých částí data v UTC
                    const year = lastUpdate.getUTCFullYear();
                    const month = String(lastUpdate.getUTCMonth() + 1).padStart(2, "0");
                    const day = String(lastUpdate.getUTCDate()).padStart(2, "0");
                    const hours = String(lastUpdate.getUTCHours()).padStart(2, "0");
                    const minutes = String(lastUpdate.getUTCMinutes()).padStart(2, "0");
                    const seconds = String(lastUpdate.getUTCSeconds()).padStart(2, "0");

                    // Výsledný formát YYYY/MM/DD HH:MM:SS UTC
                    const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds} UTC`;

                    document.getElementById("last-update").textContent = `Last update: ${formattedDate}`;
                } else {
                    document.getElementById("last-update").textContent = "No update data found.";
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                document.getElementById("last-update").textContent = "Error loading update info.";
            }
        }

        getLastUpdate();
        setInterval(getLastUpdate, 60000 * 5); // Každých 5 minut aktualizace



// URL k JSON souboru s cache busting parametrem
const jsonUrl = "https://raw.githubusercontent.com/zrzava/watch/main/titles.json";

async function checkNewTitles() {
    try {
        // Přidání náhodného parametru k URL, aby se vždy načetla aktuální verze JSONu
        const urlWithTimestamp = `${jsonUrl}?t=${Date.now()}`;
        
        // Načtení aktuálních dat z JSON
        const response = await fetch(urlWithTimestamp);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const latestData = await response.json();

        // Načtení posledních uložených ID z localStorage
        const lastFetchedIDs = JSON.parse(localStorage.getItem("lastFetchedIDs")) || [];

        // Extrakce aktuálních ID z načteného JSONu
        const latestIDs = latestData.titles.map(item => item.id);

        // Filtrace nových ID, která ještě nebyla v posledním JSONu
        const newIDs = latestIDs.filter(id => !lastFetchedIDs.includes(id));

        // Pokud jsou nová ID, zobrazí je na stránce
        if (newIDs.length > 0) {
            const newTitles = latestData.titles.filter(item => newIDs.includes(item.id));
            displayNewTitles(newTitles);

            // Uložení nových titulů do localStorage, aby byly dostupné po reloadu
            localStorage.setItem("lastFetchedTitles", JSON.stringify(newTitles));
        } else {
            // Pokud nejsou nové tituly, stále zobrazíme poslední zobrazené
            showPreviouslyDisplayedTitles();
        }

        // Uložení aktuálních ID jako posledně načtených pro porovnání v další iteraci
        localStorage.setItem("lastFetchedIDs", JSON.stringify(latestIDs));

    } catch (error) {
        console.error("Error checking new titles:", error);
        document.getElementById("last-update-titles").innerHTML = "<br>Error loading new titles.";
    }
}

// Funkce pro zobrazení nových titulů na stránce
function displayNewTitles(titles) {
    const lastUpdateTitles = document.getElementById("last-update-titles");
    const newLinks = titles.map(item =>
        `+ <a href="?play=${item.id}">${item.id}</a>`
    ).join(" ");
    lastUpdateTitles.innerHTML = `<br>${newLinks}`;
}

// Funkce pro zobrazení posledních zobrazených titulů po obnovení stránky
function showPreviouslyDisplayedTitles() {
    const lastFetchedTitles = JSON.parse(localStorage.getItem("lastFetchedTitles")) || [];
    const lastUpdateTitles = document.getElementById("last-update-titles");

    if (lastFetchedTitles.length > 0) {
        const newLinks = lastFetchedTitles.map(item =>
            `+ <a href="?play=${item.id}">${item.id}</a>`
        ).join(" ");
        lastUpdateTitles.innerHTML = `<br>${newLinks}`;
    } else {
        lastUpdateTitles.innerHTML = "<br>No titles available.";
    }
}

// Inicializace: Zkontroluje nové tituly
showPreviouslyDisplayedTitles();
checkNewTitles();
setInterval(checkNewTitles, 60000 * 5); // Kontrola každých 5 minut






// All RUNTIMES
fetch("titles.json")
    .then(response => response.json())
    .then(data => {
        let totalMinutes = 0;

        // Projít všechny tituly a přičíst runtime
        data.titles.forEach(title => {
            if (title.runtime) {
                let runtimeStr = title.runtime.trim();
                let hours = 0;
                let minutes = 0;

                // Hledání hodin a minut v textu
                if (runtimeStr.includes('h')) {
                    hours = parseInt(runtimeStr.split('h')[0].trim());
                    runtimeStr = runtimeStr.split('h')[1].trim();
                }
                if (runtimeStr.includes('min')) {
                    minutes = parseInt(runtimeStr.split('min')[0].trim());
                }

                // Sečíst celkový čas v minutách
                totalMinutes += (hours * 60) + minutes;
            }
        });

        // Převod minut na hodiny a minuty
        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;

        // Vložení výsledku do span elementu
        document.getElementById("runtimes").textContent = `${hours}h ${minutes}min`;
    })
    .catch(error => console.error("Chyba při načítání JSON:", error));



// Počet TITULŮ
fetch("titles.json")
    .then(response => response.json())
    .then(data => {
        // Spočítá počet titulů v JSONu
        let totalTitles = data.titles.length;

        // Vložení výsledku do span elementu
        document.getElementById("all-titles").textContent = totalTitles;
    })
    .catch(error => console.error("Chyba při načítání JSON:", error));






// NEWS projektu
// Nastavení jazyků a počtu novinek
const languages = ["cs", "en"];
const newsCount = 1; // Počet posledních novinek, které chceš zobrazit

// Funkce pro načtení a zobrazení posledních novinek
async function loadLatestNews() {
  try {
    // Načítání souboru news.json ve stejné složce jako skript
    const response = await fetch("news.json");

    if (!response.ok) {
      throw new Error(`HTTP chyba! Status: ${response.status}`);
    }

    const data = await response.json();

    // Filtrování podle jazyků
    const filteredNews = data.news
      .filter(item =>
        languages.includes(item.language) // Filtrace pouze podle jazyka
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Seřazení podle data
      .slice(0, newsCount); // Výběr posledních novinek

    // Zobrazení novinek v divu
    if (filteredNews.length > 0) {
      const newsHtml = filteredNews.map(news => `
        <div class="menu-news">
          <p>${news.author} ${news.date}</p>
          <p>${news.description}</p>
        </div>
      `).join("");

      document.getElementById("menu-news").innerHTML = newsHtml;
    } else {
      document.getElementById("menu-news").innerHTML = "<p>Žádné novinky pro tento jazyk.</p>";
    }
  } catch (error) {
    document.getElementById("menu-news").innerHTML = "<p>Chyba při načítání novinek.</p>";
  }
}

// Zavolání funkce po načtení stránky
loadLatestNews();
