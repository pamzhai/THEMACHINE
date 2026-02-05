// 全局通用功能：实时更新系统时间
function updateRealTime() {
    const now = new Date();
    const timeOptions = { 
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, timeZoneName: 'short'
    };
    const timeStr = now.toLocaleString('en-US', timeOptions).replace(/\//g, '-');
    const timeEl = document.querySelector('.time');
    if (timeEl) timeEl.textContent = timeStr;
}
updateRealTime();
setInterval(updateRealTime, 1000);

// 全局通用：左上角悬浮NYPD侧边栏（鼠标滑到左上角唤出）
const nypdSidebar = document.getElementById('nypdSidebar');
// 监听鼠标位置，左上角150×150px区域触发
document.addEventListener('mousemove', (e) => {
    if (e.clientX < 150 && e.clientY < 150) {
        nypdSidebar.classList.add('active');
    } else {
        nypdSidebar.classList.remove('active');
    }
});

// 首页专属逻辑：识别框跟踪+信息卡滚动
if (document.getElementById('monitorArea')) {
    const targetBoxes = [
        { el: document.getElementById('target01'), risk: 'low', lane: 'right' },
        { el: document.getElementById('target02'), risk: 'low', lane: 'middle' },
        { el: document.getElementById('target03'), risk: 'medium', lane: 'right' },
        { el: document.getElementById('target04'), risk: 'medium', lane: 'middle' }
    ];
    const MOVE_CONFIG = {
        top: { left: 35, middle: 45, right: 55 },
        leftStart: 75, leftEnd: 10,
        minStep: 2, maxStep: 5,
        minInterval: 800, maxInterval: 1500,
    };
    targetBoxes.forEach(item => {
        const box = item.el;
        box.style.top = `${MOVE_CONFIG.top[item.lane]}%`;
        box.style.left = `${MOVE_CONFIG.leftStart}%`;
        box.dataset.risk = item.risk;
    });
    function moveTargetBox(item) {
        const box = item.el;
        const randomInterval = Math.floor(Math.random() * (MOVE_CONFIG.maxInterval - MOVE_CONFIG.minInterval)) + MOVE_CONFIG.minInterval;
        const randomStep = Math.floor(Math.random() * (MOVE_CONFIG.maxStep - MOVE_CONFIG.minStep)) + MOVE_CONFIG.minStep;
        setInterval(() => {
            let currentLeft = parseFloat(box.style.left);
            currentLeft -= randomStep;
            if (currentLeft <= MOVE_CONFIG.leftEnd) {
                currentLeft = MOVE_CONFIG.leftStart;
                box.style.top = `${MOVE_CONFIG.top[item.lane] + Math.random() * 3 - 1.5}%`;
            }
            box.style.left = `${currentLeft}%`;
        }, randomInterval);
    }
    targetBoxes.forEach(item => moveTargetBox(item));

    // 右侧信息卡自动滚动
    const infoScroll = document.getElementById('infoScroll');
    const infoArea = document.getElementById('infoArea');
    const scrollSpeed = 3;
    let scrollTimer = null;
    let isMouseOver = false;
    function autoScrollInfo() {
        if (scrollTimer) clearInterval(scrollTimer);
        scrollTimer = setInterval(() => {
            if (!isMouseOver) {
                infoScroll.scrollTop += scrollSpeed;
                if (infoScroll.scrollTop >= infoScroll.scrollHeight - infoScroll.clientHeight - 10) {
                    infoScroll.scrollTop = 0;
                }
            }
        }, 20);
    }
    window.onload = autoScrollInfo;
    infoArea.addEventListener('mouseenter', () => isMouseOver = true);
    infoArea.addEventListener('mouseleave', () => isMouseOver = false);
    window.addEventListener('resize', autoScrollInfo);
}

// 个人页专属逻辑：地点变动+日志滚动
if (document.querySelector('.profile-card')) {
    const nyLocations = [
        { x: 20, y: 30, name: '5th Ave & 34th St' },
        { x: 45, y: 25, name: 'Public Library' },
        { x: 70, y: 40, name: 'Central Park' },
        { x: 30, y: 60, name: '12th Precinct' },
        { x: 60, y: 70, name: 'Brooklyn Bridge' },
        { x: 80, y: 20, name: 'Times Square' },
        { x: 15, y: 45, name: 'Wall Street' },
        { x: 50, y: 55, name: 'Harlem' },
        { x: 75, y: 65, name: 'JFK Airport' },
        { x: 40, y: 35, name: 'Madison Square Garden' }
    ];
    const marker = document.querySelector('.location-marker');
    const locationText = document.querySelector('.location-text');
    const currentLocationEl = document.querySelector('.current-location');
    function getRandomLocation() {
        const randomIdx = Math.floor(Math.random() * nyLocations.length);
        return nyLocations[randomIdx];
    }
    function updateLocation() {
        const loc = getRandomLocation();
        marker.style.left = `${loc.x}%`;
        marker.style.top = `${loc.y}%`;
        locationText.textContent = loc.name;
        currentLocationEl.textContent = loc.name;
    }
    updateLocation();
    setInterval(updateLocation, 60000);

    // 日志滚动
    const logContent = document.querySelector('.log-content');
    const logSpeed = 1;
    let logTimer = setInterval(() => {
        logContent.scrollTop += logSpeed;
        if (logContent.scrollTop >= logContent.scrollHeight - logContent.clientHeight) {
            logContent.scrollTop = 0;
        }
    }, 50);
    logContent.addEventListener('mouseenter', () => clearInterval(logTimer));
    logContent.addEventListener('mouseleave', () => {
        logTimer = setInterval(() => {
            logContent.scrollTop += logSpeed;
            if (logContent.scrollTop >= logContent.scrollHeight - logContent.clientHeight) {
                logContent.scrollTop = 0;
            }
        }, 50);
    });
}