const excelFileInput = document.getElementById('excel_file');
const excelDataOutput = document.getElementById('excel_data');

excelFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const allowedFormats = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

    if (!allowedFormats.includes(file.type)) {
        excelDataOutput.innerHTML = '<div class="alert alert-danger">Only .xlsx or .xls file formats are allowed</div>';
        excelFileInput.value = '';
        return false;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workBook = XLSX.read(data, { type: 'array' });
        const sheetName = workBook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName], { header: 1 });

        if (sheetData.length > 0) {
            const numColumns = sheetData[0].length;

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
                    tableOutput += '<td></td>';
                }

                tableOutput += '</tr>';
            }

            tableOutput += '</table>';

            excelDataOutput.innerHTML = tableOutput;
        }

        excelFileInput.value = '';
    };

    reader.readAsArrayBuffer(file);
});
