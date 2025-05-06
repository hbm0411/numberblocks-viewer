/* iframe 설정 */
function renderEpisodes(containerId, episodeList) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    episodeList.forEach(ep => {
        const card = document.createElement('div');
        card.className = 'thumbnail-card';

        const img = document.createElement('img');
        img.src = `https://img.youtube.com/vi/${ep.videoId}/hqdefault.jpg`;
        img.alt = ep.title;
        card.appendChild(img);

        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.textContent = ep.title;
        card.appendChild(caption);

        card.addEventListener('click', function () {
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
        });

        container.appendChild(card);
    });
}

/* 탭 선택 */
function openTab(evt, tabName) {
    let i, tabContent, tabLinks;
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    tabLinks = document.getElementsByClassName("tab-links");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

/* 탭 추가 */
document.addEventListener('DOMContentLoaded', function () {
    renderEpisodes('grid-1to10', episodes1to10);
    renderEpisodes('grid-season1', theRestOfSeason1);
    renderEpisodes('grid-11to20', episodes11to20);
    document.getElementById("defaultOpen").click();
});