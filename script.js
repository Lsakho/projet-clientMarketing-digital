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

  function compareTopQueries(titles, paragraphs, sheetData) {
    const topQueriesData = sheetData.slice(1).map(row => row[0]);
    const occurrences = {};
  
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
  

  function getResult() {
    var websiteLink = document.getElementById("websiteLink").value;
    var excelFileInput = document.getElementById('excelFile');
    var excelDataOutput = document.getElementById('excel_data');

    const file = excelFileInput.files[0];
    const allowedFormats = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

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