document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inputForm');
    const resultsBody = document.getElementById('resultsBody');
    const warningModal = document.getElementById('warningModal');
    const warningMessage = document.getElementById('warningMessage');
    const closeWarningModal = document.getElementById('closeWarningModal');
    const timeFormatToggle = document.getElementById('timeFormatToggle');
    const printButton = document.getElementById('printButton');

    let currentResults = [];
    let isVerboseTime = false;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const skiPace = document.getElementById('skiPace').value;
        const rowPace = document.getElementById('rowPace').value;
        const bikePace = document.getElementById('bikePace').value;

        if (!isValidPaceFormat(skiPace) || !isValidPaceFormat(rowPace) || !isValidPaceFormat(bikePace)) {
            showWarning("Invalid pace format. Please use MM:SS.s or MM:SS format.");
            return;
        }

        const inputData = {
            skiPace: skiPace,
            rowPace: rowPace,
            bikePace: bikePace,
            rowDistance: parseFloat(document.getElementById('rowDistance').value),
            skiDistance: parseFloat(document.getElementById('skiDistance').value),
            bikeDistance: parseFloat(document.getElementById('bikeDistance').value),
            paceDrop1: parseFloat(document.getElementById('paceDrop1').value),
            paceDrop2: parseFloat(document.getElementById('paceDrop2').value)
        };

        const results = calculateResults(inputData);
        currentResults = results;
        updateResultsTable(results);
    });

    timeFormatToggle.addEventListener('change', function() {

        isVerboseTime = this.checked;

        updateResultsTable(currentResults);

    });


    function updateResultsTable(results) {

        resultsBody.innerHTML = '';

        results.forEach(row => {

            const tr = document.createElement('tr');

            tr.innerHTML = `

                <td>${row.row}</td>

                <td>${formatTime(row.skiPace)}</td>

                <td>${formatTime(row.rowPace)}</td>

                <td>${formatTime(row.bikePace)}</td>

                <td>${formatTime(row.totalTime)}</td>

            `;

            resultsBody.appendChild(tr);

        });

    }

    function formatTime(timeString) {

        if (!isVerboseTime) {

            return timeString;

        }



        const [hours, minutes, seconds] = timeString.split(':');

        let formattedTime = [];



        if (parseInt(hours) > 0) {

            formattedTime.push(`<span class="time-value">${parseInt(hours)}</span> <span class="time-unit">hr</span>`);

        }

        if (parseInt(minutes) > 0) {

            formattedTime.push(`<span class="time-value">${parseInt(minutes)}</span> <span class="time-unit">min</span>`);

        }

        if (parseFloat(seconds) > 0) {

            const secValue = parseFloat(seconds).toFixed(2);

            const [whole, decimal] = secValue.split('.');

            formattedTime.push(`<span class="time-value">${whole}${decimal !== '00' ? '.' + decimal : ''}</span> <span class="time-unit">sec</span>`);

        }



        return formattedTime.join(' ');

    }

    function isValidPaceFormat(pace) {

        // Regular expression to match MM:SS.s or MM:SS format

        const paceRegex = /^(\d{1,2}):([0-5]\d)(\.\d+)?$/;

        return paceRegex.test(pace);

    }

    function showWarning(message) {

        warningMessage.textContent = message;

        warningModal.classList.add('modal-open');

    }

    closeWarningModal.addEventListener('click', function() {

        warningModal.classList.remove('modal-open');

    });

    printButton.addEventListener('click', function() {

        window.print();

    });



});