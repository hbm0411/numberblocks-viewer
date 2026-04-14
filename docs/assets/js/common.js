window.renderEpisodes = function (episodes, container, onCardClick) {
    if (!container) return;

    episodes.forEach(function (ep) {
        var card = document.createElement('div');
        card.className = 'thumbnail-card';

        var img = document.createElement('img');
        img.src = 'https://img.youtube.com/vi/' + ep.videoId + '/hqdefault.jpg';
        img.alt = ep.title;
        img.loading = 'lazy';
        card.appendChild(img);

        var caption = document.createElement('div');
        caption.className = 'caption';
        caption.textContent = ep.title;
        card.appendChild(caption);

        card.addEventListener('click', function () { onCardClick(ep); });

        container.appendChild(card);
    });
};

window.renderApp = function (seriesData, onCardClick) {
    var seriesList = document.getElementById('series-list');
    var mainContent = document.getElementById('main-content');
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

        // 카테고리별 가로 스크롤 행
        series.tabs.forEach(function (tab) {
            var row = document.createElement('div');
            row.className = 'category-row';

            var title = document.createElement('div');
            title.className = 'category-title';
            title.textContent = tab.label;
            row.appendChild(title);

            var scroll = document.createElement('div');
            scroll.className = 'category-scroll';
            renderEpisodes(tab.episodes, scroll, onCardClick);
            row.appendChild(scroll);

            section.appendChild(row);
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
            sec.style.display = (sec.id === seriesId + '-section') ? '' : 'none';
        });
    }

    seriesBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            showSeries(this.dataset.series);
        });
    });

    if (window.seriesData && window.seriesData.length > 0) {
        showSeries(window.seriesData[0].id);
    }
};
