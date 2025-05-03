/* iframe 설정 */
function renderEpisodes(containerId, episodeList) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    episodeList.forEach(ep => {
        const card = document.createElement('div');
        card.className = 'thumbnail-card';

        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'video-wrapper';

        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${ep.videoId}?rel=0&modestbranding=1`;
        iframe.title = ep.title;
        iframe.allow =
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        videoWrapper.appendChild(iframe);
        card.appendChild(videoWrapper);

        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.textContent = ep.title;
        card.appendChild(caption);
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

document.addEventListener('DOMContentLoaded', function () {
    renderEpisodes('grid-1to10', episodes1to10);
    renderEpisodes('grid-11to20', episodes11to20);
    document.getElementById("defaultOpen").click();
});