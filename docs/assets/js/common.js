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

// 사이드 메뉴(시리즈) 전환 로직
window.initSeriesMenu = function () {
    const seriesBtns = document.querySelectorAll('.series-btn');
    const numberblocksSection = document.getElementById('numberblocks-section');
    const peppaSection = document.getElementById('peppa-section');
    let peppaRendered = false;

    function showSeries(series) {
        seriesBtns.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.series-btn[data-series="${series}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        if (series === 'numberblocks') {
            if (numberblocksSection) numberblocksSection.style.display = '';
            if (peppaSection) peppaSection.style.display = 'none';
            // NumberBlocks로 이동 시 1-10 Episodes 탭 자동 선택
            const defaultTabBtn = document.getElementById('defaultOpen');
            if (defaultTabBtn) defaultTabBtn.click();
        } else if (series === 'peppapig') {
            if (numberblocksSection) numberblocksSection.style.display = 'none';
            if (peppaSection) {
                peppaSection.style.display = '';
                if (!peppaRendered && window.peppaPigEpisodes) {
                    window.renderEpisodes(window.peppaPigEpisodes.season1, 'grid-peppa1', function(ep) {
                        window.openPeppaPigEpisode && window.openPeppaPigEpisode(ep);
                    });
                    peppaRendered = true;
                }
                // Peppa Pig로 이동 시 Season 1 탭 자동 선택
                const peppaDefaultTabBtn = document.getElementById('peppaDefaultOpen');
                if (peppaDefaultTabBtn) peppaDefaultTabBtn.click();
            }
        }
    }

    seriesBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            showSeries(this.dataset.series);
        });
    });

    // 첫 진입 시 NumberBlocks가 기본
    showSeries('numberblocks');
};

// DOMContentLoaded 시 초기화
window.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.series-btn')) {
        window.initSeriesMenu();
    }
});

// Peppa Pig 카드 클릭 시 iframe 재생 연결
window.openPeppaPigEpisode = window.openInIframe;