/* iframe 설정 */
function openInNewTab(ep) {
    const videoUrl = `https://www.youtube.com/watch?v=${ep.videoId}`;
    window.open(videoUrl, '_blank', 'noopener');
}

document.addEventListener('DOMContentLoaded', function () {
    renderEpisodes(window.episodes1to10, 'grid-1to10', openInNewTab);
    renderEpisodes(window.theRestOfSeason1, 'grid-season1', openInNewTab);
    document.getElementById("defaultOpen").click();
});