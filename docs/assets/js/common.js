window.openTab = function (evt, tabName) {
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
};

window.renderEpisodes = function (episodes, containerId, onCardClick) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    episodes.forEach(ep => {
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

        card.addEventListener('click', () => onCardClick(ep));

        container.appendChild(card);
    });
};