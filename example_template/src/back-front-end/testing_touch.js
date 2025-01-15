document.addEventListener('pointerdown', (event) => {
    const coordinates = {
        x: event.clientX,
        y: event.clientY
    };
    // Send the coordinates to the Python backend
    window.pywebview.api.send_pointer_data(coordinates)
        .then(response => {
            console.log(response); // Log confirmation from Python
        })
        .catch(error => {
            console.error('Error sending pointer data:', error);
        });
});
