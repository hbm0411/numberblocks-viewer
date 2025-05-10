/* iframe 설정 */
function openInIframe(ep) {
    const fullscreenContainer = document.createElement('div');
    fullscreenContainer.className = 'video-wrapper';

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.className = 'close-button';
    closeButton.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(console.error);
        }
        fullscreenContainer.remove();
    });

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${ep.videoId}?autoplay=1&modestbranding=1&rel=0`;
    iframe.allow = 'autoplay; fullscreen';
    iframe.allowFullscreen = true;
    iframe.setAttribute('frameborder', '0');
    iframe.style.width = '100%';
    iframe.style.height = '100%';

    fullscreenContainer.appendChild(closeButton);
    fullscreenContainer.appendChild(iframe);
    document.body.appendChild(fullscreenContainer);

    fullscreenContainer.requestFullscreen().catch(console.error);
}

document.addEventListener('DOMContentLoaded', function () {
    renderEpisodes(window.episodes1to10, 'grid-1to10', openInIframe);
    renderEpisodes(window.theRestOfSeason1, 'grid-season1', openInIframe);
    document.getElementById("defaultOpen").click();
});