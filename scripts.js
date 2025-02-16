document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');

    analyzeBtn?.addEventListener('click', () => {
        const symptomsInput = document.getElementById('symptoms');
        const symptoms = symptomsInput.value.trim();

        if (symptoms === '') {
            alert('Please enter symptoms before analyzing!');
            return;
        }

        // Send symptoms to the Node.js server at port 3000
        fetch('http://localhost:3000/analyze-symptoms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ symptoms: symptoms })
        })
        .then(response => response.json())
        .then(data => {
            // If the response is valid, redirect to the results page with symptoms as query parameter
            if (data.medicines) {
                window.location.href = `results.html?symptoms=${encodeURIComponent(symptoms)}`;
            } else {
                alert('No predictions found.');
            }
        })
        .catch(error => {
            console.error('Error communicating with the server:', error);
            alert('There was an error analyzing the symptoms. Please try again.');
        });
    });
});



