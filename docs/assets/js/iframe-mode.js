/* iframe 설정 (YouTube IFrame API 사용) */
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

    // 플레이어를 넣을 div (고유 id)
    const playerDiv = document.createElement('div');
    const playerId = 'yt-player-' + ep.videoId + '-' + Date.now();
    playerDiv.id = playerId;
    fullscreenContainer.appendChild(closeButton);
    fullscreenContainer.appendChild(playerDiv);
    document.body.appendChild(fullscreenContainer);

    fullscreenContainer.requestFullscreen().catch(console.error);

    // API 준비 시 플레이어 생성
    function createPlayer() {
        new YT.Player(playerId, {
            videoId: ep.videoId,
            playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0
            },
            events: {
                'onStateChange': function (event) {
                    if (event.data === YT.PlayerState.ENDED) {
                        // 영상이 끝나면 닫기
                        if (document.fullscreenElement) {
                            document.exitFullscreen().catch(console.error);
                        }
                        fullscreenContainer.remove();
                    }
                }
            }
        });
    }

    // API 로드 여부 확인 후 실행
    if (window.YT && window.YT.Player) {
        createPlayer();
    } else {
        // 여러 번 호출에도 안전하게 대기
        window._ytReadyCbs = window._ytReadyCbs || [];
        window._ytReadyCbs.push(createPlayer);
        if (!window._ytApiHooked) {
            window._ytApiHooked = true;
            const prev = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = function () {
                if (typeof prev === 'function') prev();
                (window._ytReadyCbs || []).forEach(cb => cb());
                window._ytReadyCbs = [];
            };
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    renderEpisodes(window.episodes1to10, 'grid-1to10', openInIframe);
    renderEpisodes(window.episodes11to20, 'grid-11to20', openInIframe);
    renderEpisodes(window.theRestOfSeason1, 'grid-season1', openInIframe);
    document.getElementById("defaultOpen").click();
});