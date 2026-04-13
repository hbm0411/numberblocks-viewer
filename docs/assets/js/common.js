window.openTab = function (evt, tabName) {
    var section = evt.currentTarget.closest('.series-section');
    if (!section) return;
    section.querySelectorAll('.tab-content').forEach(function (el) { el.style.display = 'none'; });
    section.querySelectorAll('.tab-links').forEach(function (el) { el.classList.remove('active'); });
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.classList.add('active');
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
        img.loading = 'lazy';
        card.appendChild(img);

        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.textContent = ep.title;
        card.appendChild(caption);

        card.addEventListener('click', () => onCardClick(ep));

        container.appendChild(card);
    });
};

window.renderApp = function (seriesData, onCardClick) {
    const seriesList = document.getElementById('series-list');
    const mainContent = document.getElementById('main-content');
    if (!seriesList || !mainContent) return;

    seriesList.innerHTML = '';
    mainContent.innerHTML = '';

    seriesData.forEach(function (series, index) {
        // 사이드 메뉴 버튼
        var li = document.createElement('li');
        var btn = document.createElement('button');
        btn.className = 'series-btn';
        btn.dataset.series = series.id;
        btn.setAttribute('aria-label', series.name + ' 시리즈 보기');
        var logo = document.createElement('img');
        logo.src = series.logo;
        logo.alt = series.name + ' 로고';
        logo.className = 'side-logo';
        btn.appendChild(logo);
        li.appendChild(btn);
        seriesList.appendChild(li);

        // 시리즈 섹션
        var section = document.createElement('div');
        section.id = series.id + '-section';
        section.className = 'series-section';
        if (index > 0) section.style.display = 'none';

        // 탭 버튼
        var tabBar = document.createElement('div');
        tabBar.className = 'tab';
        series.tabs.forEach(function (tab, tabIndex) {
            var tabBtn = document.createElement('button');
            tabBtn.className = 'tab-links';
            tabBtn.dataset.tab = tab.id;
            tabBtn.textContent = tab.label;
            tabBtn.addEventListener('click', function (evt) {
                openTab(evt, tab.id);
            });
            tabBar.appendChild(tabBtn);
        });
        section.appendChild(tabBar);

        // 탭 콘텐츠
        series.tabs.forEach(function (tab) {
            var tabContent = document.createElement('div');
            tabContent.id = tab.id;
            tabContent.className = 'tab-content';
            var grid = document.createElement('div');
            grid.className = 'grid-container';
            grid.id = 'grid-' + tab.id;
            tabContent.appendChild(grid);
            section.appendChild(tabContent);
        });

        // 푸터
        var footer = document.createElement('footer');
        footer.className = 'site-footer';
        var footerHTML = series.footer.text + ' ';
        series.footer.links.forEach(function (link, i) {
            if (i > 0) footerHTML += ' and ';
            footerHTML += '<a href="' + link.url + '" target="_blank" rel="noopener noreferrer">' + link.label + '</a>';
        });
        footer.innerHTML = footerHTML;
        section.appendChild(footer);

        mainContent.appendChild(section);

        // 에피소드 카드 렌더링
        series.tabs.forEach(function (tab) {
            renderEpisodes(tab.episodes, 'grid-' + tab.id, onCardClick);
        });
    });

    // 시리즈 메뉴 초기화
    initSeriesMenu();
};

window.initSeriesMenu = function () {
    var seriesBtns = document.querySelectorAll('.series-btn');
    var sections = document.querySelectorAll('.series-section');

    function showSeries(seriesId) {
        seriesBtns.forEach(function (btn) { btn.classList.remove('active'); });
        var activeBtn = document.querySelector('.series-btn[data-series="' + seriesId + '"]');
        if (activeBtn) activeBtn.classList.add('active');

        sections.forEach(function (sec) {
            if (sec.id === seriesId + '-section') {
                sec.style.display = '';
                // 첫 번째 탭 자동 선택
                var firstTab = sec.querySelector('.tab-links');
                if (firstTab) firstTab.click();
            } else {
                sec.style.display = 'none';
            }
        });
    }

    seriesBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            showSeries(this.dataset.series);
        });
    });

    // 첫 번째 시리즈가 기본
    if (window.seriesData && window.seriesData.length > 0) {
        showSeries(window.seriesData[0].id);
    }
};
