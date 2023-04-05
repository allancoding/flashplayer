const flashopen = document.getElementById('flashopen');
flashopen.addEventListener('click', () => {
    window.electronAPI.setTitle(document.getElementById('flahsurl').value)
});