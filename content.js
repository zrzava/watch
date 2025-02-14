document.addEventListener("DOMContentLoaded", function () {
    const titleContainer = document.getElementById("title");
    const tipsContainer = document.querySelector(".list-container");
    const id = getParameterByName("play"); // Parametr pro přehrávání titulu
    const tag = getParameterByName("tag"); // Parametr pro filtrování titulů

    // Funkce pro generování seznamu titulů
    function generateTitles() {
        // Načteme seznam titulů z titles.json
        fetch("titles.json")
            .then(response => response.json())
            .then(data => {
                let titles = data.titles;

                // Pokud je v URL parametr ?tag=, filtrujeme tituly podle tohoto tagu
                if (tag) {
                    titles = titles.filter(title =>
                        title.labels.includes(tag) || 
                        title.types.includes(tag) || 
                        title.languages.includes(tag)
                    );
                }

                // Pokud je parametr 'play' přítomen, zobrazíme detail daného titulu místo seznamu
                if (id) {
                    const title = titles.find(t => t.id === id);
                    if (title) {
                        tipsContainer.innerHTML = `
                            <div class="title-details">
                                <h1>${title.title}</h1>
                                <div class="image">
                                    <img src="img/title/cover/${title.id}.webp" onerror="this.src='img/title/cover/default.webp';" alt="${title.title}">
                                </div>
                                <div class="description">
                                    <p>${title.description}</p>
                                </div>
                            </div>
                        `;
                    } else {
                        tipsContainer.innerHTML = `<p>Titul nebyl nalezen.</p>`;
                    }
                    return; // Nevykreslíme seznam titulů, protože už se zobrazuje detail
                }

                let tipsHTML = ` 
                    <div class="list-header">
                        <h1>${tag ? `Watch ${tag} titles` : "Watch TG Titles"}</h1>
                    </div>
                    <div class="list-content">
                `;

                const windowWidth = window.innerWidth; // Zjištění šířky okna
                const isMobile = windowWidth <= 600;  // Mobilní zařízení (do 550px)
                const isTablet = windowWidth > 600 && windowWidth <= 980; // Tablet (551px-980px)
                const isDesktop = windowWidth > 980; // Desktop (nad 980px)

                // Generování HTML pro jednotlivé tituly
                titles.forEach((title, index) => {
                    if (isMobile) {
                        // Pokud je mobilní zařízení, vykreslíme každý titul na samostatném řádku
                        if (index % 1 === 0) {
                            tipsHTML += '<div class="list">'; // Začátek nového řádku pro mobilní zařízení
                        }
                    } else if (isTablet) {
                        // Pokud je tablet (550px-980px), vykreslíme 2 tituly na řádku
                        if (index % 2 === 0) {
                            tipsHTML += '<div class="list">'; // Začátek nového řádku pro tablet
                        }
                    } else if (isDesktop) {
                        // Pokud je desktop (nad 980px), vykreslíme 3 tituly na řádku
                        if (index % 3 === 0) {
                            tipsHTML += '<div class="list">'; // Začátek nového řádku pro desktop
                        }
                    }

                    tipsHTML += ` 
                        <div class="list-item">
                            <a href="?play=${title.id}" class="similar">
                                <div class="image">
                                    <img src="img/title/cover/${title.id}.webp" onerror="this.src='img/title/cover/default.webp';" alt="${title.title}">
                                </div>
                                <div class="info">
                                    <div class="title">${title.title}</div>
                                    <div class="description">${title.description}</div>
                                </div>
                            </a>
                        </div>
                    `;

                    // Uzavření divu pro řádek
                    if ((isMobile && (index + 1) % 1 === 0) || 
                        (isTablet && (index + 1) % 2 === 0) || 
                        (isDesktop && (index + 1) % 3 === 0) || 
                        index === titles.length - 1) {
                        tipsHTML += '</div>'; // Konec řádku
                    }

                    // Po každých X titulech přidáme reklamní blok
                    if ((index + 1) % 9 === 0) {
                        tipsHTML += ` 
                            <div class="ad-container" style="margin: 5px; padding: 10px;">
                                <!-- Kód pro reklamu eTarget -->
                                <script type="text/javascript">
                                    etargetAds("ad-position");
                                </script> 
                            </div>
                        `;
                    }
                });

                tipsHTML += "</div>"; // Konec hlavního kontejneru

                // Zobrazíme seznam titulů
                tipsContainer.innerHTML = tipsHTML;
                tipsContainer.style.display = "block";
            })
            .catch(error => {
                console.error("Chyba při načítání titulů:", error);
                tipsContainer.innerHTML = `<p>Chyba při načítání titulů: ${error.message}</p>`;
                tipsContainer.style.display = "block";
            });
    }

    // Načteme titulky při načtení stránky
    generateTitles();

    // Posluchač pro změnu velikosti okna
    window.addEventListener('resize', function() {
        generateTitles(); // Při změně velikosti okna znovu vykreslíme titulky
    });


    // Pokračujeme, pokud je parametr 'play' v URL
    fetch("titles.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Nepodařilo se načíst titles.json");
            }
            return response.json();
        })
        .then(data => {
            const titleData = data.titles.find(t => t.id === id);
            
            if (!titleData) {
                titleContainer.innerHTML = ``;
                return;
            }

            // Změníme title stránky na název titulu
            document.title = `${titleData.title} on Watch+`;
            
            let metaDescription = document.querySelector('meta[name="description"]');
if (metaDescription) {
    metaDescription.setAttribute("content", titleData.description);
}

let metaKeywords = document.querySelector('meta[name="keywords"]');
if (metaKeywords) {
    let keywords = [titleData.title, ...titleData.labels, ...titleData.types, ...titleData.languages];
    
    // Přidejte vlastní klíčová slova na konec
    let additionalKeywords = ["mojeSlovo1", "mojeSlovo2"];
    keywords.push(...additionalKeywords);

    // Nastavte nový obsah pro meta tag
    metaKeywords.setAttribute("content", keywords.join(", "));
}

let metaOgTitle = document.querySelector('meta[property="og:title"]');
if (metaOgTitle) {
    metaOgTitle.setAttribute("content", titleData.title);
}

let metaOgDescription = document.querySelector('meta[property="og:description"]');
if (metaOgDescription) {
    metaOgDescription.setAttribute("content", titleData.description);
}

let metaOgImage = document.querySelector('meta[property="og:image"]');
if (metaOgImage) {
    metaOgImage.setAttribute("content", `img/title/cover/${titleData.id}.webp`);
}

            let episodesHTML = "";
            if (titleData.items && titleData.items.length > 1) {
                episodesHTML = `<a href="#" onclick="showTab(event, 'episodes')">Episodes (${titleData.items.length})</a>`;
            }

            let labelsHTML = titleData.labels.map(label => `<a href="?tag=${label}" class="label">${label}</a>`).join(" ");
            let typesHTML = titleData.types.map(type => `<a href="?tag=${type}" class="label">${type}</a>`).join(" ");
            let languagesHTML = titleData.languages.map(lang => `<a href="?tag=${lang}" class="label">${lang}</a>`).join(" ");
            let relatedHTML = "";

let similarTitles = data.titles
    .filter(t => 
        t.id !== id && t.labels.filter(label => titleData.labels.includes(label)).length >= 3 // počet shodných labels pro related
    )
    .sort((a, b) => 
        b.labels.filter(label => titleData.labels.includes(label)).length - 
        a.labels.filter(label => titleData.labels.includes(label)).length
    );

            if (similarTitles.length > 0) {
                relatedHTML = `<a href="#" onclick="showTab(event, 'similar')">Related</a>`;
            }

            let generatedHtml = `
            <div class="section item">
                <div class="section-content item-text">
                    <h1>${titleData.title}</h1>
                    <div id="tabs">
                        <a href="#" class="active" onclick="showTab(event, 'summary')">Summary</a>
                        ${episodesHTML}
                        ${relatedHTML}
                    </div>
                    <div id="tab-content">
                        <div id="summary" class="tab">
                            <p style="text-align: justify;">${titleData.description}</p>
                            <p style="text-align: right; font-size: 0.8rem;"><span style="margin-right: 15px; white-space: nowrap;">&copy; ${titleData.creator}</span> <span style="margin-right: 15px; white-space: nowrap;">&#9658;${titleData.runtime}</span> <span style="white-space: nowrap;"><a href="https://imdb.com/title/${titleData.imdb}" target="_blank" class="imdb">${titleData.imdb ? 'IMDb' : ''}</a> <span id="imdb-rating"></span></span></p>
                            <div id="labels">
                                ${labelsHTML} ${typesHTML} ${languagesHTML}
                            </div>
                        </div>
                        <div id="episodes" class="tab" style="display: none; margin: 10px;">
                            <div class="spacer">Lorem ipsum dolor sit amet consectetuer turpis condimentum Vivamus vel congue.</div>
                            <div class="episodes-container">
                                <div class="column" id="col1-episodes"></div>
                                <div class="column" id="col2-episodes"></div>
                            </div>
                        </div>
                        <div id="similar" class="tab" style="display: none; margin: 10px;">
                            <div class="similars">
                                ${similarTitles.map(sim => `
                                <a href="?play=${sim.id}" class="similar">
                                    <div class="image">
                                        <img src="img/title/cover/${sim.id}.webp" onerror="this.src='img/title/cover/default.webp';" alt="Thumbnail">
                                    </div>
                                    <div class="info">
                                        <div class="title">${sim.title}</div>
                                        <div class="description">${sim.description}</div>
                                    </div>
                                </a>`).join(" ")}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item-video">
                    <div class="item-container">
                        <iframe id="video-player" src="${getInitialEpisodeLink(titleData)}" title="Video Player" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
            </div>`;

            titleContainer.innerHTML = generatedHtml;

            // Rozdělení epizod do dvou sloupců
            const col1 = document.getElementById("col1-episodes");
            const col2 = document.getElementById("col2-episodes");
            
            if (col1 && col2) {
                titleData.items.forEach((ep, index) => {
                    const episodeLink = document.createElement("a");
                    episodeLink.href = `?play=${id}&episode=${ep.title}`;
                    episodeLink.textContent = ep.title;
                    episodeLink.classList.add("episode-link");

                    // Adding click event to change iframe src dynamically
                    episodeLink.addEventListener("click", function(event) {
                        event.preventDefault(); // Prevent default link behavior
                        updateIframeSrc(ep.link); // Dynamically update the iframe src
                    });

                    if (index % 2 === 0) {
                        col1.appendChild(episodeLink);
                    } else {
                        col2.appendChild(episodeLink);
                    }
                });
            }
        })
        .catch(error => {
            console.error("Error loading title:", error);
            titleContainer.innerHTML = `<p>Chyba při načítání titulu: ${error.message}</p>`;
        });

});

// Funkce pro získání parametru z URL
function getParameterByName(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Funkce pro zobrazení různých tabů (Summary, Episodes, Related)
function showTab(evt, tabName) {
    const tabs = document.querySelectorAll(".tab");
    const links = document.querySelectorAll("#tabs a");

    tabs.forEach(tab => {
        tab.style.display = "none"; // Skrýt všechny taby
    });

    links.forEach(link => {
        link.classList.remove("active"); // Odebrat aktivní třídu
    });

    document.getElementById(tabName).style.display = "block"; // Zobrazit vybraný tab
    evt.currentTarget.classList.add("active"); // Přidat aktivní třídu
}

// Funkce pro zobrazení videa epizody
function updateIframeSrc(url) {
    document.getElementById("video-player").src = url;
}

// Funkce pro získání prvního odkazu epizody (pro inicializaci videa)
function getInitialEpisodeLink(titleData) {
    // Zkontrolujeme, jestli existují epizody
    if (titleData.items && titleData.items.length > 0) {
        // Použijeme link přímo z JSON dat
        return titleData.items[0].link; 
    } else {
        console.error("No episodes found for title:", titleData.title);
        return ""; // Pokud není žádná epizoda, vrátíme prázdný řetězec nebo jiný fallback
    }
}









  
  
  
// Filtry v menu
fetch("titles.json")
    .then(response => response.json())
    .then(data => {
        let titlesArray = data.titles;
        if (!Array.isArray(titlesArray)) {
            throw new Error("Chybná struktura JSON! Očekáváno 'titles' jako pole.");
        }

        let labelsMap = new Map();
        let typesMap = new Map();
        let languagesMap = new Map();

        // Přidáme položky do mapy a počítáme počet
        titlesArray.forEach(title => {
            if (title.labels) {
                title.labels.forEach(label => {
                    if (!labelsMap.has(label)) {
                        labelsMap.set(label, 0);
                    }
                    labelsMap.set(label, labelsMap.get(label) + 1);
                });
            }
            if (title.types) {
                title.types.forEach(type => {
                    if (!typesMap.has(type)) {
                        typesMap.set(type, 0);
                    }
                    typesMap.set(type, typesMap.get(type) + 1);
                });
            }
            if (title.languages) {
                title.languages.forEach(lang => {
                    if (!languagesMap.has(lang)) {
                        languagesMap.set(lang, 0);
                    }
                    languagesMap.set(lang, languagesMap.get(lang) + 1);
                });
            }
        });

        // 📌 Vykreslení do HTML
        const filtersContainer = document.getElementById("filters");
        if (!filtersContainer) {
            console.error("❌ Element #filters nebyl nalezen!");
            return;
        }

        filtersContainer.innerHTML = ""; // Vyčistíme obsah, pokud tam něco je

        // Funkce pro vytvoření odkazu pro každou položku s počtem titulů
        function createLink(title, count) {
            return `<a href="?tag=${title.toLowerCase()}" class="label" style="font-size: 0.7rem; margin: -2px 2px -2px 0px;">${title} (${count})</a>`;
        }

        // Seřadíme položky podle abecedy a vykreslíme je
        const allItems = [
            ...Array.from(labelsMap).sort(([a], [b]) => a.localeCompare(b)),
            ...Array.from(typesMap).sort(([a], [b]) => a.localeCompare(b)),
            ...Array.from(languagesMap).sort(([a], [b]) => a.localeCompare(b))
        ];

        allItems.forEach(([item, count]) => {
            filtersContainer.innerHTML += createLink(item, count) + " "; // Přidáme odkaz do HTML
        });

    })
    .catch(error => console.error("❌ Chyba při načítání JSON:", error));







// All runtimes
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
    
    



// API pro IMDb hodnocení
  // Funkce pro načítání IMDb hodnocení
  async function fetchIMDBRating(imdbID) {
    if (!imdbID) {
      document.getElementById("imdb-rating").innerText = "IMDb ID chybí.";
      return;
    }

    const apiKey = "eb752732"; // Tvůj OMDb API klíč
    const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.imdbRating) {
        document.getElementById("imdb-rating").innerHTML = `${data.imdbRating}`;
      } else {
        document.getElementById("imdb-rating").innerHTML = "Hodnocení není dostupné.";
      }
    } catch (error) {
      console.error("Chyba při načítání IMDb hodnocení:", error);
      document.getElementById("imdb-rating").innerHTML = "Chyba při načítání.";
    }
  }

  // Funkce pro získání ID z URL (např. ?play=ID)
  function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Načítáme JSON s tituly a jejich IMDb ID
  async function loadTitles() {
    try {
      const response = await fetch('titles.json'); // Odkaz na tvůj JSON soubor
      const data = await response.json();

      // Získáme ID z URL
      const imdbIDFromUrl = getUrlParam('play');

      // Pokud máme ID v URL, najdeme odpovídající film v JSON
      let imdbID = null;
      if (imdbIDFromUrl) {
        // Hledání IMDb ID v JSON podle ID z URL
        const movie = data.titles.find(title => title.id === imdbIDFromUrl);
        if (movie) {
          imdbID = movie.imdb;
        }
      }

      // Pokud IMDb ID v URL není, vybereme první film z JSON (nebo použijeme jinou logiku)
      if (!imdbID && data.titles.length > 0) {
        imdbID = data.titles[0].imdb; // Příklad: první titul, pokud URL neobsahuje param play
      }

      // Načteme hodnocení pro správný film
      fetchIMDBRating(imdbID);
    } catch (error) {
      console.error("Chyba při načítání JSON souboru:", error);
      document.getElementById("imdb-rating").innerHTML = "Chyba při načítání titulů.";
    }
  }

  // Načteme JSON a spustíme funkci pro načítání hodnocení
  loadTitles();
  
  
  
  
  
  
  
  
  
// Funkce pro načítání a zobrazení seznamu filmů
function loadMovies(file) {
    fetch(file)
        .then(response => response.json())
        .then(data => {
            const movies = data.items; // Načte položky z JSON
            const list = document.getElementById('movie-list'); // Předpokládáme, že máš <ul id="movie-list"></ul>

            list.innerHTML = ""; // Vyčistí předchozí seznam

            // Pro každý film přidá položku do seznamu
            movies.forEach(movie => {
                const li = document.createElement('li');
                li.innerHTML = `${movie.title} <a href="${movie.link}" target="_blank">IMDb</a>`;
                list.appendChild(li);
            });
        })
        .catch(error => console.error("Error loading movies:", error));
}

// Funkce pro získání URL parametru a načtení příslušného seznamu
function getMovieListFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const listKey = urlParams.get("list"); // Získá hodnotu parametru ?list=...

    // Na základě parametru se rozhodne, který soubor se má načíst
    if (listKey === "czech-classics") {
        loadMovies("csclassics.json");
    } else if (listKey === "trans-movies") {
        loadMovies("titles.json");
    } else {
        // Výchozí seznam (pokud parametr není přítomen nebo je neznámý)
        loadMovies("titles.json");
    }
}

// Zavolání funkce pro načtení seznamu podle URL parametru
getMovieListFromUrl();












