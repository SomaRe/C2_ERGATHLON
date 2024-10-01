function convertPaceToSeconds(pace) {

    const timeParts = pace.split(':').map(Number);



    let totalSeconds = 0;



    if (timeParts.length === 3) {

        // If the pace includes hours, minutes, and seconds

        const [hours, minutes, seconds] = timeParts;

        totalSeconds = hours * 3600 + minutes * 60 + seconds;

    } else if (timeParts.length === 2) {

        // If the pace includes only minutes and seconds

        const [minutes, seconds] = timeParts;

        totalSeconds = minutes * 60 + seconds;

    } else {

        throw new Error("Invalid pace format. Expected 'HH:MM:SS' or 'MM:SS'.");

    }



    return totalSeconds;

}



function calculateTotalTime(pace, distance, unitDistance) {

    const paceInSeconds = convertPaceToSeconds(pace);

    return (distance / unitDistance) * paceInSeconds;

}



function formatTime(totalSeconds) {

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = Math.floor(totalSeconds % 60);

    const tenths = Math.floor((totalSeconds % 1) * 10);



    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths}`;

}



function calculateResults(inputData) {

    const results = [];

    let skiPace = convertPaceToSeconds(inputData.skiPace);

    let rowPace = convertPaceToSeconds(inputData.rowPace);

    let bikePace = convertPaceToSeconds(inputData.bikePace);



    for (let i = 0; i < 10; i++) {

        // Calculate total time for each activity

        const skiTime = calculateTotalTime(formatTime(skiPace), inputData.skiDistance, 500); // Ski distance in 500m increments

        const rowTime = calculateTotalTime(formatTime(rowPace), inputData.rowDistance, 500); // Row distance in 500m increments

        const bikeTime = calculateTotalTime(formatTime(bikePace), inputData.bikeDistance, 1000); // Bike distance in 1000m increments



        // Calculate total time for the round

        const totalTime = skiTime + rowTime + bikeTime;



        // Store the result for this round

        results.push({

            row: i + 1,

            skiPace: formatTime(skiPace),

            rowPace: formatTime(rowPace),

            bikePace: formatTime(bikePace),

            totalTime: formatTime(totalTime)

        });



        // Apply pace drops

        if (i < 5) {

            skiPace -= inputData.paceDrop1;

            rowPace -= inputData.paceDrop1;

            bikePace -= inputData.paceDrop1;

        } else {

            skiPace -= inputData.paceDrop2;

            rowPace -= inputData.paceDrop2;

            bikePace -= inputData.paceDrop2;

        }

    }



    return results;

}