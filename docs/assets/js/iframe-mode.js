/* iframe 설정 (YouTube IFrame API 사용) */
function openInIframe(ep) {
    const fullscreenContainer = document.createElement('div');
    fullscreenContainer.className = 'video-wrapper';

    // endTime 체크를 위한 interval ID 저장 (전역 스코프)
    let endTimeCheckInterval = null;
    
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.className = 'close-button';
    closeButton.addEventListener('click', () => {
        if (endTimeCheckInterval) {
            clearInterval(endTimeCheckInterval);
            endTimeCheckInterval = null;
        }
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
        // origin 설정을 안전하게 처리
        const currentOrigin = window.location.origin || window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        
        // playerVars 객체 생성
        const playerVars = {
            autoplay: 0,  // 자동재생 비활성화 (권한 정책 준수)
            modestbranding: 0,  // 브랜딩 표시 (안정성 향상)
            rel: 0,  // 관련 동영상 비표시
            controls: 1,  // 컨트롤 표시
            showinfo: 0,  // 동영상 정보 숨김
            iv_load_policy: 3,  // 주석 비표시
            cc_load_policy: 0,  // 자막 비표시
            fs: 1,  // 전체화면 버튼 표시
            enablejsapi: 1  // JavaScript API 활성화
        };
        
        // startTime이 있으면 시작 시간 설정
        if (ep.startTime !== undefined && ep.startTime !== null) {
            playerVars.start = ep.startTime;
        }
        
        // endTime이 있으면 종료 시간 설정
        if (ep.endTime !== undefined && ep.endTime !== null) {
            playerVars.end = ep.endTime;
        }
        
        // 로컬 파일 시스템이 아닌 경우에만 origin 설정
        if (currentOrigin !== 'null' && currentOrigin !== 'file://') {
            playerVars.origin = currentOrigin;
        }
        
        new YT.Player(playerId, {
            videoId: ep.videoId,
            playerVars: playerVars,
            events: {
                'onReady': function (event) {
                    const player = event.target;
                    
                    // endTime이 있으면 주기적으로 체크
                    if (ep.endTime !== undefined && ep.endTime !== null) {
                        endTimeCheckInterval = setInterval(() => {
                            try {
                                const currentTime = player.getCurrentTime();
                                if (currentTime >= ep.endTime) {
                                    // endTime에 도달하면 정지하고 닫기
                                    player.stopVideo();
                                    clearInterval(endTimeCheckInterval);
                                    endTimeCheckInterval = null;
                                    if (document.fullscreenElement) {
                                        document.exitFullscreen().catch(console.error);
                                    }
                                    fullscreenContainer.remove();
                                }
                            } catch (error) {
                                // 플레이어가 준비되지 않았거나 오류가 발생한 경우 interval 정리
                                console.log('재생 시간 확인 중 오류:', error);
                                clearInterval(endTimeCheckInterval);
                                endTimeCheckInterval = null;
                            }
                        }, 500); // 0.5초마다 체크
                    }
                    
                    // 사용자 상호작용 후 재생 시작 (권한 정책 준수)
                    setTimeout(() => {
                        try {
                            event.target.playVideo();
                        } catch (error) {
                            console.log('자동재생이 차단되었습니다. 사용자가 재생 버튼을 클릭해주세요.');
                            // 자동재생이 차단된 경우 사용자에게 안내
                            const playButton = document.createElement('button');
                            playButton.textContent = '▶ 재생하기';
                            playButton.style.cssText = `
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                transform: translate(-50%, -50%);
                                background: #ff0000;
                                color: white;
                                border: none;
                                padding: 15px 30px;
                                border-radius: 25px;
                                font-size: 18px;
                                cursor: pointer;
                                z-index: 1001;
                            `;
                            playButton.addEventListener('click', () => {
                                event.target.playVideo();
                                playButton.remove();
                            });
                            fullscreenContainer.appendChild(playButton);
                        }
                    }, 100);
                },
                'onStateChange': function (event) {
                    if (event.data === YT.PlayerState.ENDED) {
                        // 영상이 끝나면 닫기
                        if (endTimeCheckInterval) {
                            clearInterval(endTimeCheckInterval);
                            endTimeCheckInterval = null;
                        }
                        if (document.fullscreenElement) {
                            document.exitFullscreen().catch(console.error);
                        }
                        fullscreenContainer.remove();
                    }
                },
                'onError': function (event) {
                    console.error('YouTube 플레이어 에러:', event.data);
                    // 에러 발생 시 interval 정리
                    if (endTimeCheckInterval) {
                        clearInterval(endTimeCheckInterval);
                        endTimeCheckInterval = null;
                    }
                    // 에러 발생 시 사용자에게 알림
                    const errorDiv = document.createElement('div');
                    errorDiv.style.cssText = `
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: rgba(0,0,0,0.8);
                        color: white;
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                        z-index: 1000;
                    `;
                    errorDiv.innerHTML = `
                        <h3>동영상을 재생할 수 없습니다</h3>
                        <p>이 동영상은 현재 재생할 수 없습니다.</p>
                        <button onclick="this.parentElement.remove()" style="
                            background: #ff0000;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 5px;
                            cursor: pointer;
                        ">닫기</button>
                    `;
                    fullscreenContainer.appendChild(errorDiv);
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

// openInIframe 함수를 window 객체에 추가
window.openInIframe = openInIframe;

document.addEventListener('DOMContentLoaded', function () {
    renderEpisodes(window.episodes1to10, 'grid-1to10', openInIframe);
    renderEpisodes(window.theRestOfLevel1, 'grid-level1', openInIframe);
    renderEpisodes(window.theRestOfLevel2, 'grid-level2', openInIframe);
    renderEpisodes(window.theRestOfLevel3, 'grid-level3', openInIframe);
    renderEpisodes(window.episodes11to100, 'grid-11to100', openInIframe);
    renderEpisodes(window.peppaPigEpisodes.season1, 'grid-peppa1', openInIframe);
    renderEpisodes(window.specialAdventures, 'grid-special-adventures', openInIframe);
    document.getElementById("defaultOpen").click();
});