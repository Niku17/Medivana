document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const symptoms = urlParams.get('symptoms') || 'No symptoms provided';

    fetch('http://localhost:3000/analyze-symptoms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: symptoms })
    })
    .then(response => response.json())
    .then(data => {
        if (data.medicines) {
            const medicationsList = document.getElementById('medications-list');
            medicationsList.innerHTML = data.medicines.map(med => `<li>${med}</li>`).join('');
        } else {
            const medicationsList = document.getElementById('medications-list');
            medicationsList.innerHTML = '<li>No medications found.</li>';
        }
    })
    .catch(error => {
        console.error('Error fetching predictions:', error);
        const medicationsList = document.getElementById('medications-list');
        medicationsList.innerHTML = '<li>Error loading medications. Please try again.</li>';
    });
});
