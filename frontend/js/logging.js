function calculateActivityTime(pace, distance, unitDistance) {

    const paceSeconds = convertPaceToSeconds(pace);

    return (distance / unitDistance) * paceSeconds;

  }

  function convertPaceToSeconds(pace) {
    const [minutes, seconds] = pace.split(":").map(Number);
    return minutes * 60 + (seconds || 0);
  }

  function initChart() {
    const ctx = document.getElementById("logChart").getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Bike Pace (1000m)",
            data: [],
            borderColor: "rgb(255, 99, 132)",
            tension: 0.1,
          },
          {
            label: "Row Pace (500m)",
            data: [],
            borderColor: "rgb(54, 162, 235)",
            tension: 0.1,
          },
          {
            label: "Ski Pace (500m)",
            data: [],
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
          {
            label: "Total Time",
            data: [],
            borderColor: "rgb(153, 102, 255)",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Time (seconds)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Date",
            },
          },
        },
      },
    });

    updateChart();
  }

  function updateChart() {
    const showBike = document.getElementById("showBike").checked;
    const showRow = document.getElementById("showRow").checked;
    const showSki = document.getElementById("showSki").checked;
    const showTotal = document.getElementById("showTotal").checked;

    chart.data.labels = logEntries.map((entry) => entry.date);
    chart.data.datasets[0].data = showBike
      ? logEntries.map((entry) => convertToSeconds(entry.bikePace))
      : [];
    chart.data.datasets[1].data = showRow
      ? logEntries.map((entry) => convertToSeconds(entry.rowPace))
      : [];
    chart.data.datasets[2].data = showSki
      ? logEntries.map((entry) => convertToSeconds(entry.skiPace))
      : [];
    chart.data.datasets[3].data = showTotal
      ? logEntries.map((entry) => convertToSeconds(entry.totalTime))
      : [];

    chart.update();
  }

  function renderLogEntries() {
    logEntriesBody.innerHTML = "";
    logEntries.forEach((entry) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.bikePace} (${entry.bikeDistance}m)</td>
                <td>${entry.rowPace} (${entry.rowDistance}m)</td>
                <td>${entry.skiPace} (${entry.skiDistance}m)</td>
                <td>${entry.totalTime}</td>
                <td>${entry.comments}</td>
                <td>
                    <button class="btn btn-xs btn-error" onclick="deleteEntry(${entry.id})">Delete</button>
                </td>
            `;
      logEntriesBody.appendChild(tr);
    });
  }


  function calculateTotalTime() {
    const bikePace = logBikePaceInput.value;
    const rowPace = logRowPaceInput.value;
    const skiPace = logSkiPaceInput.value;
    const bikeDistance = parseFloat(logBikeDistanceInput.value);
    const rowDistance = parseFloat(logRowDistanceInput.value);
    const skiDistance = parseFloat(logSkiDistanceInput.value);

    let totalSeconds = 0;

    if (isValidPaceFormat(bikePace) && !isNaN(bikeDistance)) {
      totalSeconds += calculateActivityTime(bikePace, bikeDistance, 1000);
    }
    if (isValidPaceFormat(rowPace) && !isNaN(rowDistance)) {
      totalSeconds += calculateActivityTime(rowPace, rowDistance, 500);
    }
    if (isValidPaceFormat(skiPace) && !isNaN(skiDistance)) {
      totalSeconds += calculateActivityTime(skiPace, skiDistance, 500);
    }

    logTotalTimeInput.value = totalSeconds > 0 ? formatTime(totalSeconds) : "";
  }

  function addLogEntry() {
    const entry = {
      date: document.getElementById("logDate").value,
      bikePace: logBikePaceInput.value,
      bikeDistance: parseInt(logBikeDistanceInput.value),
      rowPace: logRowPaceInput.value,
      rowDistance: parseInt(logRowDistanceInput.value),
      skiPace: logSkiPaceInput.value,
      skiDistance: parseInt(logSkiDistanceInput.value),
      totalTime: logTotalTimeInput.value,
      comments: document.getElementById("logComments").value,
    };

    window.pywebview.api.add_log_entry(entry).then((updatedEntries) => {
      logEntries = updatedEntries;
      renderLogEntries();
      updateChart();
      logForm.reset();
    });
  }

  function loadEntries() {
    window.pywebview.api.get_log_entries().then((entries) => {
      logEntries = entries;
      renderLogEntries();
      updateChart();
    });
  }