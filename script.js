// Cette fonction génère un tableau HTML à partir des données 
// sheetData et l'insère dans l'élément ayant l'ID excel_data. 
// Chaque ligne du tableau représente une ligne de sheetData. 
// Les en-têtes de colonne sont extraits de la première ligne de 
// sheetData, et chaque cellule est affichée en tant que cellule de 
// tableau (<td>). La dernière colonne est réservée aux mentions 
// et a un ID unique pour chaque cellule.

function createTable(sheetData, excelDataOutput) {
    let tableOutput = '<table class="table table-striped table-bordered">';
    
    for (let row = 0; row < sheetData.length; row++) {
      tableOutput += '<tr>';

      for (let cell = 0; cell < sheetData[row].length; cell++) {
        if (row === 0) {
          tableOutput += '<th>' + sheetData[row][cell] + '</th>';
        } else {
          tableOutput += '<td>' + sheetData[row][cell] + '</td>';
        }
      }

      if (row === 0) {
        tableOutput += '<th>Mention</th>';
      } else {
        tableOutput += '<td id="mention_' + row + '"></td>'; // Ajout d'un ID unique pour chaque cellule de mention
      }

      tableOutput += '</tr>';
    }

    tableOutput += '</table>';
    excelDataOutput.innerHTML = tableOutput;
  }

  // Cette fonction compare les titres (titles) et les paragraphes 
  // (paragraphs) extraits avec les données topQueriesData 
  // provenant de sheetData. Elle compte le nombre d'occurrences 
  // de chaque requête (query) dans les titres et les paragraphes, 
  // et stocke les résultats dans l'objet occurrences. Ensuite, 
  // elle met à jour les cellules de mention dans le tableau HTML avec les résultats.

  function compareTopQueries(titles, paragraphs, sheetData) {
    const topQueriesData = sheetData.slice(1).map(row => row[0]);
    const occurrences = {};

  // Vérification que les données sont disponibles
  
    if (titles && paragraphs && topQueriesData) {
      titles.forEach(title => {
        topQueriesData.forEach(query => {
          if (title.toLowerCase().includes(query.toLowerCase())) {
            occurrences[query] = (occurrences[query] || 0) + 1;
          }
        });
      });
  
      paragraphs.forEach(paragraph => {
        topQueriesData.forEach(query => {
          if (paragraph.toLowerCase().includes(query.toLowerCase())) {
            occurrences[query] = (occurrences[query] || 0) + 1;
          }
        });
      });
    }
  
    const table = document.getElementById('excel_data');
    const rows = table.getElementsByTagName('tr');

    // Mise à jour des cellules de mention dans le tableau
  
    for (let row = 1; row < rows.length; row++) {
      const query = sheetData[row][0];
      const mentionCell = rows[row].lastElementChild;
  
      if (occurrences.hasOwnProperty(query)) {
        mentionCell.innerHTML = occurrences[query];
      } else {
        mentionCell.innerHTML = '0';
      }
    }
  }

  // Cette fonction est déclenchée lors du clic sur le bouton "Obtenir les résultats". 
  // Elle récupère les valeurs des éléments HTML 
  // (lien du site web et fichier Excel), vérifie le format du fichier et effectue 
  // une requête fetch vers l'API à l'URL spécifiée. Elle utilise les résultats pour 
  // générer le tableau HTML à l'aide de la fonction createTable et comparer 
  // les requêtes les plus courantes avec les titres et les paragraphes à 
  // l'aide de la fonction compareTopQueries.
  

  function getResult() {
    let websiteLink = document.getElementById("websiteLink").value;
    let excelFileInput = document.getElementById('excelFile');
    let excelDataOutput = document.getElementById('excel_data');

    const file = excelFileInput.files[0];
    const allowedFormats = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

    // Vérification du format de fichier autorisé

    if (!allowedFormats.includes(file.type)) {
      excelDataOutput.innerHTML = '<div class="alert alert-danger">Seuls les formats de fichier .xlsx ou .xls sont autorisés</div>';
      excelFileInput.value = '';
      return false;
    }

    fetch(`http://localhost:8000/api/scrape?url=${encodeURIComponent(websiteLink)}`)
      .then(response => response.json())
      .then(data => {
        const titles = data.titles;
        const paragraphs = data.paragraphs;

        const reader = new FileReader();
        reader.onload = function (event) {
          const data = new Uint8Array(event.target.result);
          const workBook = XLSX.read(data, { type: 'array' });
          const sheetName = workBook.SheetNames[0];
          const sheetData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName], { header: 1 });

          createTable(sheetData, excelDataOutput);
          compareTopQueries(titles, paragraphs, sheetData);
        };
        reader.readAsArrayBuffer(file);
      })
      .catch(error => {
        console.error('Erreur lors de la requête vers le backend:', error);
      });
//     fetch(`http://localhost:8000/api/scrape?url=${encodeURIComponent(websiteLink)}`)
//   .then(response => response.json())
//   .then(data => {
//     console.log('Données extraites:', data);

//     const titles = data.titles;
//     const paragraphs = data.paragraphs;

//     // ...

//   })
//   .catch(error => {
//     console.error('Erreur lors de la requête vers le backend:', error);
//   });

  }