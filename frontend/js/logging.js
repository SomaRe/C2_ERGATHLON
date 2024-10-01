let chart;
let logEntries = [];

window.addEventListener('pywebviewready', function() {
  console.log('PyWebviewReady');
    initializePage();
});

function initializePage() {
  // Initialize form elements
  const logForm = document.getElementById('logForm');
  const logBikePaceInput = document.getElementById('logBikePace');
  const logRowPaceInput = document.getElementById('logRowPace');
  const logSkiPaceInput = document.getElementById('logSkiPace');
  const logBikeDistanceInput = document.getElementById('logBikeDistance');
  const logRowDistanceInput = document.getElementById('logRowDistance');
  const logSkiDistanceInput = document.getElementById('logSkiDistance');
  const logTotalTimeInput = document.getElementById('logTotalTime');

  // Add event listeners
  logForm.addEventListener('submit', handleFormSubmit);
  document.getElementById('chartToggle').addEventListener('change', toggleChart);
  document.getElementById('showBike').addEventListener('change', updateChart);
  document.getElementById('showRow').addEventListener('change', updateChart);
  document.getElementById('showSki').addEventListener('change', updateChart);
  document.getElementById('showTotal').addEventListener('change', updateChart);

  // Input event listeners for real-time total time calculation
  [logBikePaceInput, logRowPaceInput, logSkiPaceInput, 
   logBikeDistanceInput, logRowDistanceInput, logSkiDistanceInput].forEach(input => {
      input.addEventListener('input', calculateTotalTime);
  });

  function convertToSeconds(time) {
    if (!time) return 0;
    
    // Split the time string into parts
    const parts = time.split(':');
    
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    
    // Parse the parts based on how many we have
    if (parts.length === 3) {
      // HH:MM:SS or HH:MM:SS.s format
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1], 10);
      seconds = parseFloat(parts[2]);
    } else if (parts.length === 2) {
      // MM:SS or MM:SS.s format
      minutes = parseInt(parts[0], 10);
      seconds = parseFloat(parts[1]);
    } else if (parts.length === 1) {
      // SS or SS.s format
      seconds = parseFloat(parts[0]);
    }
  
    // Convert everything to seconds and return
    return (hours * 3600) + (minutes * 60) + seconds;
  }
  

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
        plugins: {
          zoom: {
            zoom: {
              mode: "x",
              wheel: {
                enabled: true,
                modifierKey: "alt",
              },
              pan: {
                enabled: true,
                mode: "xy",
                modifierKey: "ctrl",
              },
            },
          }
        },
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

  function toggleChart() {
    const chartContainer = document.getElementById('chartContainer');
    chartContainer.style.display = this.checked ? 'block' : 'none';
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

  function deleteEntry(id) {
    window.pywebview.api.delete_log_entry(id).then((updatedEntries) => {
        logEntries = updatedEntries;
        renderLogEntries();
        updateChart();
    });
}

function isValidPaceFormat(pace) {
  return /^\d{1,2}:\d{2}(.\d+)?$/.test(pace);
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function handleFormSubmit(event) {
  event.preventDefault();
  addLogEntry();
}

loadEntries();
initChart();
}