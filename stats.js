
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



// Check for new title IDs
const jsonUrl = "https://raw.githubusercontent.com/zrzava/watch/main/titles.json";

async function checkNewTitles() {
    try {
        // Fetch the latest titles.json
        const response = await fetch(jsonUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const latestData = await response.json();

        // Get previous data from localStorage
        const prevData = JSON.parse(localStorage.getItem("prevTitles")) || [];

        // Extract IDs from the current and previous data
        const latestIDs = latestData.titles.map(item => item.id); // Corrected to access 'titles'
        const prevIDs = prevData.map(item => item.id);

        // Find new IDs
        const newIDs = latestIDs.filter(id => !prevIDs.includes(id));

        // If there are no new titles, just keep the previous ones
        if (newIDs.length === 0) {
            localStorage.setItem("prevTitles", JSON.stringify(prevData)); // Keep the existing titles in storage
        } else {
            // Add new titles to the existing list
            const newTitles = latestData.titles.filter(item => newIDs.includes(item.id));
            const updatedTitles = [...prevData, ...newTitles];
            localStorage.setItem("prevTitles", JSON.stringify(updatedTitles)); // Save updated titles
        }

        // Display the new IDs
        const lastUpdateTitles = document.getElementById("last-update-titles");
        if (newIDs.length > 0) {
            const newLinks = newIDs.map(id => `+<a href="?play=${id}">${id}</a>`).join(" ");
            lastUpdateTitles.innerHTML = `<br>${newLinks}`;
        } else {
            lastUpdateTitles.innerHTML = "<br>No new titles.";
        }
    } catch (error) {
        console.error("Error checking new titles:", error);
        document.getElementById("last-update-titles").innerHTML = "<br>Error loading new titles.";
    }
}

checkNewTitles();
setInterval(checkNewTitles, 60000 * 5); // Check every 5 minutes




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
