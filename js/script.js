// ✨ 新增：初始化加载状态（优先从sessionStorage读取）
let isHomeLoaded = sessionStorage.getItem('homePageLoaded') === 'true';
const loadingScreen = document.getElementById('loadingScreen');

// ✨ 新增：如果已加载过，直接隐藏加载层
if (isHomeLoaded) {
  loadingScreen.style.display = 'none';
}

// ========== 代码雨Canvas动画 ==========
const canvas = document.getElementById('codeRain');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const codeChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;:,.<>?';
const columnCount = Math.floor(canvas.width / 20);
const columns = [];

for (let i = 0; i < columnCount; i++) {
  columns.push({
    x: i * 20,
    y: Math.random() * -canvas.height,
    speed: 5 + Math.random() * 3
  });
}

function drawCodeRain() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.font = '16px Courier New';
  
  columns.forEach(col => {
    const randomChar = codeChars[Math.floor(Math.random() * codeChars.length)];
    ctx.fillText(randomChar, col.x, col.y);
    col.y += col.speed;
    if (col.y > canvas.height) {
      col.y = Math.random() * -50;
    }
  });
}

// ========== 20个人物信息数据（按1-20顺序排列） ==========
const peopleList = [
  {
    photo: 'img/people1.jpg',
    ssn: 'XXX-XX-1234',
    job: 'Software Engineer',
    family: 'Spouse + 1 Child',
    case: 'Potential Cyber Threat',
    safety: 'MEDIUM'
  },
  {
    photo: 'img/people2.jpg',
    ssn: 'XXX-XX-2345',
    job: 'High School Teacher',
    family: 'Single',
    case: 'Witness to Assault',
    safety: 'HIGH'
  },
  {
    photo: 'img/people3.jpg',
    ssn: 'XXX-XX-3456',
    job: 'NYPD Officer',
    family: 'Spouse + 2 Children',
    case: 'HR Unit Affiliate',
    safety: 'LOW'
  },
  {
    photo: 'img/people4.jpg',
    ssn: 'XXX-XX-4567',
    job: 'Doctor',
    family: 'Spouse + 1 Child',
    case: 'Medical Fraud Suspect',
    safety: 'MEDIUM'
  },
  {
    photo: 'img/people5.jpg',
    ssn: 'XXX-XX-5678',
    job: 'Lawyer',
    family: 'Single',
    case: 'HR Legal Representative',
    safety: 'LOW'
  },
  {
    photo: 'img/people6.jpg',
    ssn: 'XXX-XX-6789',
    job: 'Bartender',
    family: 'Roommate',
    case: 'Drug Trafficking Witness',
    safety: 'HIGH'
  },
  {
    photo: 'img/people7.jpg',
    ssn: 'XXX-XX-7890',
    job: 'Construction Worker',
    family: 'Spouse + 3 Children',
    case: 'Accident Cover-Up',
    safety: 'MEDIUM'
  },
  {
    photo: 'img/people8.jpg',
    ssn: 'XXX-XX-8901',
    job: 'Journalist',
    family: 'Single',
    case: 'Exposing HR Corruption',
    safety: 'LOW'
  },
  {
    photo: 'img/people9.jpg',
    ssn: 'XXX-XX-9012',
    job: 'Bank Teller',
    family: 'Spouse',
    case: 'Embezzlement Suspect',
    safety: 'MEDIUM'
  },
  {
    photo: 'img/people10.jpg',
    ssn: 'XXX-XX-0123',
    job: 'Chef',
    family: 'Single',
    case: 'Gang Extortion Victim',
    safety: 'HIGH'
  },
  {
    photo: 'img/people11.jpg',
    ssn: 'XXX-XX-1122',
    job: 'Taxi Driver',
    family: 'Spouse + 1 Child',
    case: 'Witness to Robbery',
    safety: 'HIGH'
  },
  {
    photo: 'img/people12.jpg',
    ssn: 'XXX-XX-2233',
    job: 'Artist',
    family: 'Single',
    case: 'Copyright Infringement',
    safety: 'MEDIUM'
  },
  {
    photo: 'img/people13.jpg',
    ssn: 'XXX-XX-3344',
    job: 'Security Guard',
    family: 'Spouse + 2 Children',
    case: 'HR Bribe Recipient',
    safety: 'LOW'
  },
  {
    photo: 'img/people14.jpg',
    ssn: 'XXX-XX-4455',
    job: 'Pharmacist',
    family: 'Spouse',
    case: 'Prescription Fraud',
    safety: 'MEDIUM'
  },
  {
    photo: 'img/people15.jpg',
    ssn: 'XXX-XX-5566',
    job: 'Student',
    family: 'Parents',
    case: 'Cyberbullying Victim',
    safety: 'HIGH'
  },
  {
    photo: 'img/people16.jpg',
    ssn: 'XXX-XX-6677',
    job: 'Real Estate Agent',
    family: 'Single',
    case: 'Property Scam',
    safety: 'MEDIUM'
  },
];

// ========== 加载进度+有序信息框逻辑 ==========
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const infoBoxContainer = document.getElementById('infoBoxContainer');

let loadProgress = 0;
const progressStep = 0.5;
let codeRainTimer = null;
let progressTimer = null;

// 顺序索引，控制按1-20弹出
let currentPersonIndex = 0; 
// 控制信息框弹出频率（每1.5秒弹出一个，可调整）
const infoBoxInterval = 500; 
let infoBoxTimer = null;

// 按顺序生成信息框（修改photo的HTML结构，添加虚线框）
function createOrderedInfoBox() {
  if (isHomeLoaded || currentPersonIndex >= peopleList.length) {
    clearInterval(infoBoxTimer); // 到20个后停止弹出
    return;
  }

  // 按索引取当前人物（确保顺序1-20）
  const currentPerson = peopleList[currentPersonIndex];
  currentPersonIndex++; // 索引+1，下次取下一个

  // 创建信息框DOM（✨ 修改：新增photo-wrapper和target-box）
  const infoBox = document.createElement('div');
  infoBox.className = 'info-box';

  // 随机定位（位置仍随机，仅人物顺序固定）
  const maxLeft = window.innerWidth - 300;
  const maxTop = window.innerHeight - 120;
  infoBox.style.left = `${Math.random() * maxLeft}px`;
  infoBox.style.top = `${Math.random() * maxTop}px`;

  // ✨ 核心修改：照片部分增加包裹容器+虚线目标框
  infoBox.innerHTML = `
    <div class="photo-wrapper">
      <img src="${currentPerson.photo}" alt="Person ${currentPersonIndex}" class="photo">
      <div class="target-box"></div> <!-- 剧中同款虚线黄框 -->
    </div>
    <div class="details">
      <p>SSN: ${currentPerson.ssn}</p>
      <p>JOB: ${currentPerson.job}</p>
      <p>FAMILY: ${currentPerson.family}</p>
      <p>CASE: ${currentPerson.case}</p>
      <p>SAFETY: ${currentPerson.safety}</p>
    </div>
  `;

  infoBoxContainer.appendChild(infoBox);

  // 5秒后淡隐移除（保持原有逻辑）
  setTimeout(() => {
    infoBox.style.opacity = '0';
    infoBox.style.transform = 'scale(0.8)';
    setTimeout(() => infoBox.remove(), 300);
  }, 800);
}

// 更新加载进度（仅修改信息框触发逻辑）
function updateLoadProgress() {
  if (isHomeLoaded) return;

  loadProgress += progressStep;
  if (loadProgress > 100) loadProgress = 100;

  progressBar.style.width = `${loadProgress}%`;
  progressText.textContent = `${Math.floor(loadProgress)}%`;

  // 加载完成逻辑
  if (loadProgress === 100) {
    clearInterval(progressTimer);
    clearInterval(codeRainTimer);
    clearInterval(infoBoxTimer); // 停止信息框弹出

    sessionStorage.setItem('homePageLoaded', 'true');
    isHomeLoaded = true;

    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.pointerEvents = 'none';
      setTimeout(() => loadingScreen.style.display = 'none', 500);
    }, 2000);
  }
}

// 仅在未加载时启动代码雨、进度更新、有序信息框弹出
if (!isHomeLoaded) {
  codeRainTimer = setInterval(drawCodeRain, 50);
  progressTimer = setInterval(updateLoadProgress, 50);
  // 启动有序信息框弹出（每1.5秒一个，可调整infoBoxInterval值）
  infoBoxTimer = setInterval(createOrderedInfoBox, infoBoxInterval);
  // 立即弹出第一个信息框（避免等待1.5秒）
  createOrderedInfoBox();
}

// 窗口resize调整（仅未加载时执行）
window.addEventListener('resize', () => {
  if (isHomeLoaded) return;
  document.querySelectorAll('.info-box').forEach(box => {
    const maxLeft = window.innerWidth - 300;
    const maxTop = window.innerHeight - 120;
    box.style.left = `${Math.random() * maxLeft}px`;
    box.style.top = `${Math.random() * maxTop}px`;
  });
});

// ✨ 修改：仅在未加载过时启动代码雨和进度更新
if (!isHomeLoaded) {
  codeRainTimer = setInterval(drawCodeRain, 50); // 启动代码雨
  progressTimer = setInterval(updateLoadProgress, 50); // 启动进度更新
}

// 窗口resize时重新调整信息框位置
window.addEventListener('resize', () => {
  if (isHomeLoaded) return; // ✨ 修改：已加载则无需调整
  document.querySelectorAll('.info-box').forEach(box => {
    const maxLeft = window.innerWidth - 300;
    const maxTop = window.innerHeight - 120;
    box.style.left = `${Math.random() * maxLeft}px`;
    box.style.top = `${Math.random() * maxTop}px`;
  });
});

// 全局通用功能：实时更新系统时间（保留原有代码）
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

// 全局通用：左上角悬浮NYPD侧边栏（保留原有代码）
const nypdSidebar = document.getElementById('nypdSidebar');
if (nypdSidebar) { // 避免无侧边栏页面报错
    document.addEventListener('mousemove', (e) => {
        if (e.clientX < 150 && e.clientY < 150) {
            nypdSidebar.classList.add('active');
        } else {
            nypdSidebar.classList.remove('active');
        }
    });
}
// 可选：刷新页面时清除加载状态（刷新重新加载）
window.addEventListener('beforeunload', () => {
  sessionStorage.removeItem('homePageLoaded');
});

// ========== 首页专属逻辑：整合三大需求 ==========
if (document.getElementById('nypdMapContainer')) { // 仅在首页执行
    // 1. 需求1：纽约地图生成20个随机红点
    function generateRandomMarkers() {
        const mapContainer = document.getElementById('nypdMapContainer');
        // 清空旧红点，避免重复叠加
        const oldMarkers = mapContainer.querySelectorAll('.map-marker');
        oldMarkers.forEach(marker => marker.remove());
        
        // 生成20个新红点（top/left范围10%-90%，避免超出地图）
        for (let i = 0; i < 20; i++) {
            const marker = document.createElement('div');
            marker.className = 'map-marker';
            // 随机位置（百分比），确保红点在地图内
            const randomTop = Math.floor(Math.random() * 80) + 10; // 10%-90%
            const randomLeft = Math.floor(Math.random() * 80) + 10; // 10%-90%
            marker.style.top = `${randomTop}%`;
            marker.style.left = `${randomLeft}%`;
            mapContainer.appendChild(marker);
        }
    }

    // 2. 需求2：TARGET DATABASE 案件自动滚动（鼠标悬浮停止）
    function initAutoScrollCases() {
        const scrollContainer = document.getElementById('infoScroll');
        const scrollSpeed = 1; // 滚动速度（像素/帧）
        let scrollTimer;
        
        // 自动滚动函数
        function startScroll() {
            scrollTimer = setInterval(() => {
                scrollContainer.scrollTop += scrollSpeed;
                // 滚动到顶部后重置，形成循环
                if (scrollContainer.scrollTop >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
                    scrollContainer.scrollTop = 0;
                }
            }, 30); // 滚动频率（毫秒/帧）
        }

        // 鼠标悬浮停止，离开继续
        scrollContainer.addEventListener('mouseenter', () => clearInterval(scrollTimer));
        scrollContainer.addEventListener('mouseleave', startScroll);
        
        // 初始启动滚动
        startScroll();
    }

    // 3. 需求3：ACTIVE PRECINCTS 和 POLICE RESOURCE STATUS 数据随机更新
    function initRandomDataUpdate() {
        // 定义需要随机更新的元素ID及对应随机范围
        const randomElements = [
            // ACTIVE PRECINCTS 数据（警局人数：30-60，巡逻车：5-10）
            { id: 'pre12-off', min: 30, max: 60 },
            { id: 'pre12-car', min: 5, max: 10 },
            { id: 'pre5-off', min: 30, max: 60 },
            { id: 'pre5-car', min: 5, max: 10 },
            { id: 'pre17-off', min: 30, max: 60 },
            { id: 'pre17-car', min: 5, max: 10 },
            { id: 'pre21-off', min: 30, max: 60 },
            { id: 'pre21-car', min: 5, max: 10 },
            { id: 'pre9-off', min: 30, max: 60 },
            { id: 'pre9-car', min: 5, max: 10 },
            { id: 'pre18-off', min: 30, max: 60 },
            { id: 'pre18-car', min: 5, max: 10 },
            { id: 'pre7-off', min: 30, max: 60 },
            { id: 'pre7-car', min: 5, max: 10 },
            { id: 'pre10-off', min: 30, max: 60 },
            { id: 'pre10-car', min: 5, max: 10 },
            // POLICE RESOURCE STATUS 数据
            { id: 'patrol-car', min: 10, max: 20 }, // 巡逻车10-20
            { id: 'swat-time', min: 5, max: 12 },   // SWAT响应时间5-12分钟
            { id: 'detective', min: 8, max: 15 },   // 侦探8-15人
            { id: 'camera', min: 95, max: 100 },    // 摄像头在线率95%-100%
            // 实时案件统计（可选新增，增强动态感）
            { id: 'active-cases', min: 1200, max: 1300 },
            { id: 'high-case', min: 70, max: 90 },
            { id: 'med-case', min: 300, max: 350 },
            { id: 'low-case', min: 800, max: 880 },
            { id: 'resolved-case', min: 20, max: 30 },
            { id: 'new-case', min: 15, max: 25 }
        ];

        // 生成随机数函数
        function getRandomNum(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // 定时更新数据（每5秒一次，模拟实时监控）
        setInterval(() => {
            randomElements.forEach(item => {
                const el = document.getElementById(item.id);
                if (el) el.textContent = getRandomNum(item.min, item.max);
            });
        }, 5000);
    }

    // 页面加载完成后执行所有初始化函数
    window.addEventListener('load', () => {
        generateRandomMarkers();
        // 红点每15秒刷新一次位置（增强随机性）
        setInterval(generateRandomMarkers, 15000);
        initAutoScrollCases();
        initRandomDataUpdate();
    });
}

// ========== 保留原有个人页逻辑（无需修改） ==========
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
        if (currentLocationEl) currentLocationEl.textContent = loc.name;
    }
    updateLocation();
    setInterval(updateLocation, 60000);

    // 日志滚动（保留原有逻辑）
    const logContent = document.querySelector('.log-content');
    if (logContent) {
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
}