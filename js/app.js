// ========== 数据存储和初始化 ==========
const STORAGE_KEY = 'familyRewardData';

// 默认数据结构
const defaultData = {
  userInfo: {
    name: '宝贝',
    avatar: '',
  },
  categories: [
    { id: '1', name: '生活习惯', icon: '🌟' },
    { id: '2', name: '学习', icon: '📚' },
    { id: '3', name: '脾气', icon: '💖' },
  ],
  tasks: [
    { id: '1', name: '在学校吃午饭', category: '1', stars: 5, repeat: 'daily' },
    { id: '2', name: '参加延迟课', category: '2', stars: 3, repeat: 'daily' },
    { id: '3', name: '自己整理书包', category: '1', stars: 2, repeat: 'daily' },
    { id: '4', name: '按时完成作业', category: '2', stars: 5, repeat: 'daily' },
    { id: '5', name: '控制情绪不发脾气', category: '3', stars: 3, repeat: 'daily' },
  ],
  wishes: [
    { id: '1', name: '看电影', stars: 1 },
    { id: '2', name: '买玩具', stars: 10 },
    { id: '3', name: '游乐园', stars: 20 },
  ],
  records: [], // { id, type, categoryId, categoryName, stars, timestamp, taskName?, wishName?, note? }
  taskCompletions: {}, // { 'taskId_date': true }
  settings: {
    theme: 'light',
    fontSize: 'medium',
  },
};

// 加载数据
function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultData, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('加载数据失败:', e);
  }
  return defaultData;
}

// 保存数据
function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('保存数据失败:', e);
  }
}

// 全局数据
let appData = loadData();

// ========== 工具函数 ==========
function formatDate(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatTime(timestamp) {
  const d = new Date(timestamp);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatDateTime(timestamp) {
  const d = new Date(timestamp);
  return `${formatDate(d)} ${formatTime(timestamp)}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getStartOfMonth(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function getEndOfMonth(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ========== 统计计算 ==========
function getStats() {
  const now = new Date();
  const monthStart = getStartOfMonth(now);
  const monthEnd = getEndOfMonth(now);
  
  let totalStars = 0;
  let earnedStars = 0;
  let spentStars = 0;
  let rewardCount = 0;
  let exchangeCount = 0;
  let monthRewardCount = 0;
  let monthExchangeCount = 0;
  let monthEarnedStars = 0;
  let monthSpentStars = 0;
  
  // 分类统计
  const categoryStats = {};
  appData.categories.forEach(cat => {
    categoryStats[cat.id] = { count: 0, stars: 0 };
  });
  
  appData.records.forEach(record => {
    totalStars += record.stars;
    
    if (record.stars > 0) {
      earnedStars += record.stars;
      rewardCount++;
      
      if (categoryStats[record.categoryId]) {
        categoryStats[record.categoryId].count++;
        categoryStats[record.categoryId].stars += record.stars;
      }
      
      if (record.timestamp >= monthStart.getTime() && record.timestamp <= monthEnd.getTime()) {
        monthRewardCount++;
        monthEarnedStars += record.stars;
      }
    } else {
      spentStars += Math.abs(record.stars);
      exchangeCount++;
      
      if (record.timestamp >= monthStart.getTime() && record.timestamp <= monthEnd.getTime()) {
        monthExchangeCount++;
        monthSpentStars += Math.abs(record.stars);
      }
    }
  });
  
  const remainingStars = earnedStars - spentStars;
  
  return {
    remainingStars,
    monthRewardCount,
    monthExchangeCount,
    totalSpentStars: spentStars,
    totalEarnedStars: earnedStars,
    monthSpentStars,
    monthEarnedStars,
    categoryStats,
  };
}

function getCategoryStats(categoryId, date) {
  const monthStart = getStartOfMonth(date);
  const monthEnd = getEndOfMonth(date);
  
  let count = 0;
  let stars = 0;
  
  appData.records.forEach(record => {
    if (record.categoryId === categoryId && 
        record.stars > 0 &&
        record.timestamp >= monthStart.getTime() && 
        record.timestamp <= monthEnd.getTime()) {
      count++;
      stars += record.stars;
    }
  });
  
  return { count, stars };
}

// ========== 页面渲染 ==========
let currentPage = 'summary';
let currentDataDate = formatDate(new Date());

function renderHeader() {
  const header = document.getElementById('header');
  const { userInfo } = appData;
  
  if (currentPage === 'summary') {
    header.innerHTML = `
      <div class="user-info">
        ${userInfo.avatar ? `<img src="${userInfo.avatar}" class="avatar" alt="${userInfo.name}" />` : `<div class="avatar">${userInfo.name[0]}</div>`}
        <span class="user-name">${userInfo.name}</span>
      </div>
      <button class="btn btn-secondary" onclick="showAddRewardModal()">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:20px;height:20px;">
          <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    `;
  } else if (currentPage === 'task') {
    header.innerHTML = `
      <button class="btn btn-secondary" onclick="changeWeek(-1)">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:20px;height:20px;">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
      <span class="header-title">任务</span>
      <button class="btn btn-secondary" onclick="changeWeek(1)">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:20px;height:20px;">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>
    `;
  } else if (currentPage === 'data') {
    header.innerHTML = `
      <span class="header-title">数据统计</span>
    `;
  } else if (currentPage === 'settings') {
    header.innerHTML = `
      <span class="header-title">设置</span>
    `;
  }
}

function renderSummaryPage() {
  const page = document.getElementById('summaryPage');
  const stats = getStats();
  
  // 构建分类卡片HTML
  const categoryCards = appData.categories.map(cat => {
    const catStats = getCategoryStats(cat.id, new Date());
    return `
      <div class="category-card" onclick="showCategoryRecords('${cat.id}')">
        <div class="category-name">${cat.icon} ${cat.name}</div>
        <div class="category-count">本月 ${catStats.count} 次</div>
      </div>
    `;
  }).join('');
  
  page.innerHTML = `
    <div class="big-star-display">
      <div class="big-star-icon">⭐</div>
      <div class="big-star-count">${stats.remainingStars}</div>
      <div class="big-star-label">剩余星星</div>
    </div>
    
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-label">本月兑换</div>
        <div class="stat-value">${stats.monthExchangeCount}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">消耗星星</div>
        <div class="stat-value negative">${stats.monthSpentStars}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">本月奖励</div>
        <div class="stat-value">${stats.monthRewardCount}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">获得星星</div>
        <div class="stat-value positive">${stats.monthEarnedStars}</div>
      </div>
    </div>
    
    <div class="action-buttons">
      <button class="btn btn-primary btn-full" onclick="showAddRewardModal()">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:20px;height:20px;">
          <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2"/>
        </svg>
        添加奖励
      </button>
      <button class="btn btn-accent btn-full" onclick="showExchangeModal()">
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:20px;height:20px;">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        星星兑换
      </button>
    </div>
    
    <div class="card">
      <div class="card-title">分类统计</div>
      <div class="category-scroll">
        ${categoryCards}
      </div>
    </div>
    
    <div class="card">
      <div class="card-title">最近记录</div>
      <div class="tabs">
        <div class="tab active" data-tab="reward" onclick="switchRecordTab('reward')">奖励</div>
        <div class="tab" data-tab="exchange" onclick="switchRecordTab('exchange')">兑换</div>
        <div class="tab" data-tab="deduct" onclick="switchRecordTab('deduct')">扣减</div>
      </div>
      <div class="record-list" id="summaryRecordList"></div>
    </div>
  `;
  
  renderSummaryRecords('reward');
}

function renderSummaryRecords(tab) {
  const container = document.getElementById('summaryRecordList');
  if (!container) return;
  
  const now = new Date();
  const monthStart = getStartOfMonth(now);
  
  let records = appData.records.filter(record => {
    const recordDate = new Date(record.timestamp);
    
    if (tab === 'reward') return record.stars > 0 && recordDate >= monthStart;
    if (tab === 'exchange') return record.stars < 0 && recordDate >= monthStart && record.type === 'exchange';
    if (tab === 'deduct') return record.stars < 0 && recordDate >= monthStart && record.type === 'deduct';
    return false;
  });
  
  records.sort((a, b) => b.timestamp - a.timestamp);
  records = records.slice(0, 10);
  
  if (records.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-text">暂无记录</div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = records.map(record => {
    const iconClass = record.stars > 0 ? 'reward' : (record.type === 'exchange' ? 'exchange' : 'deduct');
    const icon = record.stars > 0 ? '⭐' : (record.type === 'exchange' ? '🎁' : '❌');
    const title = record.taskName || record.wishName || record.note || record.categoryName;
    
    return `
      <div class="record-item">
        <div class="record-icon ${iconClass}">${icon}</div>
        <div class="record-info">
          <div class="record-title">${title}</div>
          <div class="record-date">${formatDateTime(record.timestamp)}</div>
        </div>
        <div class="record-amount ${record.stars > 0 ? 'positive' : 'negative'}">
          ${record.stars > 0 ? '+' : ''}${record.stars}
        </div>
      </div>
    `;
  }).join('');
}

function renderTaskPage() {
  const page = document.getElementById('taskPage');
  const today = new Date();
  const weekStart = getWeekStart(today);
  const weekDays = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    weekDays.push(date);
  }
  
  // 构建日期选择器
  const dateSelectorHTML = weekDays.map(date => {
    const dateStr = formatDate(date);
    const isToday = formatDate(date) === formatDate(today);
    const isSelected = dateStr === currentDataDate;
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    
    const dayStats = getTaskStatsForDate(date);
    
    return `
      <div class="date-item ${isToday ? 'today' : ''} ${isSelected ? 'active' : ''}" 
           onclick="selectDate('${dateStr}')">
        <div class="date-day">周${dayNames[date.getDay()]}</div>
        <div class="date-date">${date.getDate()}</div>
        <div class="date-stars">${dayStats.available}⭐</div>
      </div>
    `;
  }).join('');
  
  // 获取当日任务
  const tasks = getTasksForDate(currentDataDate);
  const completedTasks = tasks.filter(task => isTaskCompleted(task.id, currentDataDate)).length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  
  // 构建任务列表
  const taskListHTML = tasks.map(task => {
    const isCompleted = isTaskCompleted(task.id, currentDataDate);
    const category = appData.categories.find(cat => cat.id === task.category);

    const starsDisplay = task.stars >= 0 ? `+${task.stars}` : `${task.stars}`;

    return `
      <div class="task-item ${isCompleted ? 'completed' : ''}">
        <div class="task-checkbox ${isCompleted ? 'checked' : ''}"
             onclick="toggleTask('${task.id}', '${currentDataDate}')"></div>
        <div class="task-info">
          <div class="task-name">${task.name}</div>
          <div class="task-meta">
            <span class="task-category">${category?.name || '未分类'}</span>
            <span class="task-stars" style="${task.stars < 0 ? 'color:var(--danger);' : ''}">${task.stars}⭐</span>
          </div>
        </div>
        ${isCompleted ? `<div class="task-earned" style="${task.stars < 0 ? 'color:var(--danger);' : ''}">${starsDisplay}⭐</div>` : ''}
      </div>
    `;
  }).join('');
  
  page.innerHTML = `
    <div class="date-selector">
      ${dateSelectorHTML}
    </div>
    
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span class="card-title" style="margin-bottom:0;">任务进度</span>
        <button class="btn btn-secondary" style="padding:4px 12px;font-size:12px;" onclick="showDateDetailModal('${currentDataDate}')">查看详情</button>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-size:14px;color:var(--text-muted);">${completedTasks}/${tasks.length}</span>
        <span style="font-size:14px;color:var(--primary);">可用 ${getTaskStatsForDate(new Date(currentDataDate)).available}⭐</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
    </div>
    
    <div class="task-list">
      ${taskListHTML.length > 0 ? taskListHTML : `
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <div class="empty-state-text">今日暂无任务</div>
        </div>
      `}
    </div>
    
    <button class="fab" onclick="showAddTaskModal()">+</button>
  `;
}

function renderDataPage() {
  const page = document.getElementById('dataPage');
  const now = new Date();
  
  page.innerHTML = `
    <div class="card">
      <div class="calendar-header">
        <button class="calendar-nav-btn" onclick="changeDataMonth(-1)">‹</button>
        <span class="calendar-title">${now.getFullYear()}年 ${now.getMonth() + 1}月</span>
        <button class="calendar-nav-btn" onclick="changeDataMonth(1)">›</button>
      </div>
      <div class="calendar-grid" id="calendarGrid"></div>
    </div>
    
    <div class="card">
      <div class="card-title">数据详情</div>
      <div class="tabs">
        <div class="tab active" data-tab="rewardData" onclick="switchDataTab('rewardData')">奖励记录</div>
        <div class="tab" data-tab="exchangeData" onclick="switchDataTab('exchangeData')">兑换记录</div>
      </div>
      <div id="dataStatsPanel"></div>
    </div>
  `;
  
  renderCalendar();
  renderDataStats('rewardData');
}

function renderCalendar() {
  const container = document.getElementById('calendarGrid');
  if (!container) return;
  
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
  
  let html = dayNames.map(name => `<div class="calendar-day-name">${name}</div>`).join('');
  
  // 空白格子
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="calendar-day"></div>';
  }
  
  // 日期格子
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = formatDate(date);
    const isToday = dateStr === formatDate(new Date());
    const dateStats = getDateStats(date);
    
    let dataClass = '';
    if (dateStats.rewardCount > 0) dataClass = 'has-data';
    if (dateStats.exchangeCount > 0) dataClass = 'has-data exchange';
    
    html += `
      <div class="calendar-day ${isToday ? 'today' : ''} ${dataClass}" 
           onclick="selectCalendarDate('${dateStr}')">
        ${day}
      </div>
    `;
  }
  
  container.innerHTML = html;
}

function renderDataStats(tab) {
  const container = document.getElementById('dataStatsPanel');
  if (!container) return;
  
  const now = new Date();
  const monthStart = getStartOfMonth(now);
  const monthEnd = getEndOfMonth(now);
  
  if (tab === 'rewardData') {
    const rewardRecords = appData.records.filter(record => 
      record.stars > 0 && 
      record.timestamp >= monthStart.getTime() && 
      record.timestamp <= monthEnd.getTime()
    );
    
    const totalStars = rewardRecords.reduce((sum, r) => sum + r.stars, 0);
    
    // 分类统计
    const categoryData = {};
    rewardRecords.forEach(record => {
      if (!categoryData[record.categoryId]) {
        categoryData[record.categoryId] = { count: 0, stars: 0 };
      }
      categoryData[record.categoryId].count++;
      categoryData[record.categoryId].stars += record.stars;
    });
    
    const preferenceHTML = Object.entries(categoryData).map(([catId, data]) => {
      const category = appData.categories.find(c => c.id === catId);
      const percent = totalStars > 0 ? Math.round((data.stars / totalStars) * 100) : 0;
      
      return `
        <div class="preference-item">
          <div class="preference-header">
            <span class="preference-name">${category?.icon || ''} ${category?.name || '未分类'}</span>
            <span class="preference-value">${data.stars}颗 (${percent}%)</span>
          </div>
          <div class="preference-bar">
            <div class="preference-fill" style="width: ${percent}%"></div>
          </div>
        </div>
      `;
    }).join('');
    
    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">奖励次数</div>
          <div class="stat-value positive">${rewardRecords.length}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">获得星星</div>
          <div class="stat-value positive">${totalStars}</div>
        </div>
      </div>
      <div class="card-title">奖励偏好</div>
      <div class="preference-list">
        ${preferenceHTML || '<div class="empty-state-text">暂无数据</div>'}
      </div>
    `;
  } else if (tab === 'exchangeData') {
    const exchangeRecords = appData.records.filter(record => 
      record.stars < 0 && 
      record.timestamp >= monthStart.getTime() && 
      record.timestamp <= monthEnd.getTime()
    );
    
    const totalStars = exchangeRecords.reduce((sum, r) => sum + Math.abs(r.stars), 0);
    
    // 心愿统计
    const wishData = {};
    exchangeRecords.forEach(record => {
      const key = record.wishName || '其他';
      if (!wishData[key]) {
        wishData[key] = { count: 0, stars: 0 };
      }
      wishData[key].count++;
      wishData[key].stars += Math.abs(record.stars);
    });
    
    const preferenceHTML = Object.entries(wishData).map(([name, data]) => {
      const percent = totalStars > 0 ? Math.round((data.stars / totalStars) * 100) : 0;
      
      return `
        <div class="preference-item">
          <div class="preference-header">
            <span class="preference-name">${name}</span>
            <span class="preference-value">${data.stars}颗 (${percent}%)</span>
          </div>
          <div class="preference-bar">
            <div class="preference-fill" style="width: ${percent}%"></div>
          </div>
        </div>
      `;
    }).join('');
    
    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">兑换次数</div>
          <div class="stat-value negative">${exchangeRecords.length}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">消耗星星</div>
          <div class="stat-value negative">${totalStars}</div>
        </div>
      </div>
      <div class="card-title">兑换偏好</div>
      <div class="preference-list">
        ${preferenceHTML || '<div class="empty-state-text">暂无数据</div>'}
      </div>
    `;
  }
}

function renderSettingsPage() {
  const page = document.getElementById('settingsPage');
  const { userInfo } = appData;
  
  page.innerHTML = `
    <div class="card">
      <div class="card-title">基本信息</div>
      <div class="form-group">
        <label class="form-label">昵称</label>
        <input type="text" class="form-input" id="userNameInput" value="${userInfo.name}" 
               placeholder="请输入昵称" onchange="updateUserName()">
      </div>
      <div class="form-group">
        <label class="form-label">头像</label>
        <input type="text" class="form-input" id="userAvatarInput" value="${userInfo.avatar || ''}" 
               placeholder="请输入头像URL" onchange="updateUserAvatar()">
        <div class="form-helper">支持图片URL地址</div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-title">奖励分类</div>
      <div class="settings-list">
        ${appData.categories.map(cat => `
          <div class="settings-item" onclick="editCategory('${cat.id}')">
            <span class="settings-label">${cat.icon} ${cat.name}</span>
            <span class="settings-value">点击编辑</span>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-secondary btn-full" style="margin-top:var(--space-md);" onclick="addCategory()">
        + 添加分类
      </button>
    </div>
    
    <div class="card">
      <div class="card-title">兑换心愿</div>
      <div class="settings-list">
        ${appData.wishes.map(wish => `
          <div class="settings-item" onclick="editWish('${wish.id}')">
            <span class="settings-label">${wish.name} (${wish.stars}⭐)</span>
            <span class="settings-arrow">›</span>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-secondary btn-full" style="margin-top:var(--space-md);" onclick="addWish()">
        + 添加心愿
      </button>
    </div>
    
    <div class="card">
      <div class="card-title">任务模板</div>
      <div class="settings-list">
        ${appData.tasks.map(task => {
          const category = appData.categories.find(c => c.id === task.category);
          return `
            <div class="settings-item" onclick="editTask('${task.id}')">
              <span class="settings-label">${task.name} (${task.stars}⭐)</span>
              <span class="settings-value">${category?.name || '未分类'}</span>
            </div>
          `;
        }).join('')}
      </div>
      <button class="btn btn-secondary btn-full" style="margin-top:var(--space-md);" onclick="addTask()">
        + 添加任务
      </button>
    </div>
    
    <div class="card">
      <div class="card-title">数据管理</div>
      <div class="settings-list">
        <div class="settings-item" onclick="exportData()">
          <span class="settings-label">导出数据</span>
          <span class="settings-arrow">›</span>
        </div>
        <div class="settings-item" onclick="importData()">
          <span class="settings-label">导入数据</span>
          <span class="settings-arrow">›</span>
        </div>
        <div class="settings-item" onclick="resetData()">
          <span class="settings-label" style="color:var(--danger);">重置数据</span>
          <span class="settings-arrow" style="color:var(--danger);">›</span>
        </div>
      </div>
    </div>
  `;
}

// ========== 任务相关函数 ==========
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function getTasksForDate(dateStr) {
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();
  
  return appData.tasks.filter(task => {
    if (task.repeat === 'daily') return true;
    // 可以扩展其他重复规则
    return false;
  });
}

function isTaskCompleted(taskId, dateStr) {
  const key = `${taskId}_${dateStr}`;
  return appData.taskCompletions[key] === true;
}

function toggleTask(taskId, dateStr) {
  const key = `${taskId}_${dateStr}`;
  const task = appData.tasks.find(t => t.id === taskId);

  if (!task) return;

  if (appData.taskCompletions[key]) {
    // 取消完成 - 需要删除对应的奖励记录
    delete appData.taskCompletions[key];

    // 查找并删除对应的奖励记录
    const dateStart = new Date(dateStr).getTime();
    const dateEnd = dateStart + 24 * 60 * 60 * 1000;

    const recordIndex = appData.records.findIndex(record => {
      return record.type === 'reward' &&
             record.taskName === task.name &&
             record.timestamp >= dateStart &&
             record.timestamp < dateEnd &&
             record.stars === task.stars;
    });

    // 删除找到的奖励记录
    if (recordIndex !== -1) {
      appData.records.splice(recordIndex, 1);
    }
  } else {
    // 完成任务
    appData.taskCompletions[key] = true;

    // 添加奖励记录
    const category = appData.categories.find(c => c.id === task.category);
    const record = {
      id: generateId(),
      type: 'reward',
      categoryId: task.category,
      categoryName: category?.name || '未分类',
      stars: task.stars,
      timestamp: new Date().getTime(),
      taskName: task.name,
    };
    appData.records.push(record);
  }

  saveData(appData);
  renderTaskPage();
}

function getTaskStatsForDate(date) {
  const dateStr = formatDate(date);
  const tasks = getTasksForDate(dateStr);
  let available = 0;
  
  tasks.forEach(task => {
    if (!isTaskCompleted(task.id, dateStr)) {
      available += task.stars;
    }
  });
  
  return { total: tasks.length, available };
}

function getDateStats(date) {
  const dateStr = formatDate(date);
  const start = new Date(dateStr).getTime();
  const end = start + 24 * 60 * 60 * 1000;
  
  let rewardCount = 0;
  let exchangeCount = 0;
  
  appData.records.forEach(record => {
    if (record.timestamp >= start && record.timestamp < end) {
      if (record.stars > 0) rewardCount++;
      else exchangeCount++;
    }
  });
  
  return { rewardCount, exchangeCount };
}

// ========== 交互函数 ==========
function switchPage(pageName) {
  currentPage = pageName;
  
  // 更新导航栏状态
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === pageName);
  });
  
  // 更新页面显示
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(`${pageName}Page`).classList.add('active');
  
  renderHeader();
  
  if (pageName === 'summary') renderSummaryPage();
  else if (pageName === 'task') renderTaskPage();
  else if (pageName === 'data') renderDataPage();
  else if (pageName === 'settings') renderSettingsPage();
}

function switchRecordTab(tab) {
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  renderSummaryRecords(tab);
}

function switchDataTab(tab) {
  document.querySelectorAll('#dataPage .tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  renderDataStats(tab);
}

function selectDate(dateStr) {
  currentDataDate = dateStr;
  renderTaskPage();
}

function changeWeek(direction) {
  const current = new Date(currentDataDate);
  current.setDate(current.getDate() + (direction * 7));
  currentDataDate = formatDate(current);
  renderTaskPage();
}

function changeDataMonth(direction) {
  // 这里简化处理，直接刷新当前月的数据
  // 实际应该记录当前选择的月份
  renderDataPage();
}

function selectCalendarDate(dateStr) {
  showDateDetailModal(dateStr);
}

function showDateDetailModal(dateStr) {
  const modal = document.getElementById('modal');
  const content = document.getElementById('modalContent');

  const date = new Date(dateStr);
  const dateStart = new Date(dateStr).getTime();
  const dateEnd = dateStart + 24 * 60 * 60 * 1000;

  // 获取当日所有记录
  const dayRecords = appData.records.filter(record => {
    return record.timestamp >= dateStart && record.timestamp < dateEnd;
  });

  // 获取当日任务
  const tasks = getTasksForDate(dateStr);
  const completedTasks = tasks.filter(task => isTaskCompleted(task.id, dateStr));

  // 计算当日星星数
  let totalStars = 0;
  let rewardStars = 0;
  let deductStars = 0;
  let exchangeStars = 0;

  dayRecords.forEach(record => {
    if (record.stars > 0) {
      rewardStars += record.stars;
    } else {
      if (record.type === 'exchange') {
        exchangeStars += Math.abs(record.stars);
      } else {
        deductStars += Math.abs(record.stars);
      }
    }
  });

  totalStars = rewardStars - deductStars - exchangeStars;

  // 构建记录列表
  let recordsHTML = '';
  if (dayRecords.length === 0) {
    recordsHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <div class="empty-state-text">暂无记录</div>
      </div>
    `;
  } else {
    recordsHTML = dayRecords.map(record => {
      const iconClass = record.stars > 0 ? 'reward' : (record.type === 'exchange' ? 'exchange' : 'deduct');
      const icon = record.stars > 0 ? '⭐' : (record.type === 'exchange' ? '🎁' : '❌');
      const title = record.taskName || record.wishName || record.note || record.categoryName;

      return `
        <div class="record-item">
          <div class="record-icon ${iconClass}">${icon}</div>
          <div class="record-info">
            <div class="record-title">${title}</div>
            <div class="record-date">${formatTime(record.timestamp)}</div>
          </div>
          <div class="record-amount ${record.stars > 0 ? 'positive' : 'negative'}">
            ${record.stars > 0 ? '+' : ''}${record.stars}
          </div>
        </div>
      `;
    }).join('');
  }

  // 构建任务列表
  let tasksHTML = '';
  if (tasks.length === 0) {
    tasksHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <div class="empty-state-text">暂无任务</div>
      </div>
    `;
  } else {
    tasksHTML = tasks.map(task => {
      const isCompleted = isTaskCompleted(task.id, dateStr);
      const category = appData.categories.find(cat => cat.id === task.category);
      const starsDisplay = task.stars >= 0 ? `+${task.stars}` : `${task.stars}`;

      return `
        <div class="task-item ${isCompleted ? 'completed' : ''}">
          <div class="task-info">
            <div class="task-name">${task.name}</div>
            <div class="task-meta">
              <span class="task-category">${category?.name || '未分类'}</span>
              <span class="task-stars" style="${task.stars < 0 ? 'color:var(--danger);' : ''}">${task.stars}⭐</span>
            </div>
          </div>
          <div style="font-size:14px;${isCompleted ? 'color:var(--primary);' : 'color:var(--text-muted);'}">
            ${isCompleted ? starsDisplay + '⭐' : '未完成'}
          </div>
        </div>
      `;
    }).join('');
  }

  content.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">${date.getMonth() + 1}月${date.getDate()}日 明细</h3>
      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body" style="max-height:60vh;overflow-y:auto;">
      <!-- 星星统计 -->
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">总计</div>
          <div class="stat-value" style="${totalStars >= 0 ? 'color:var(--primary);' : 'color:var(--danger);'}">${totalStars}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">奖励</div>
          <div class="stat-value positive">+${rewardStars}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">扣分</div>
          <div class="stat-value negative">-${deductStars}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">兑换</div>
          <div class="stat-value negative">-${exchangeStars}</div>
        </div>
      </div>

      <!-- 任务完成情况 -->
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div class="card-title" style="margin-bottom:0;">任务完成</div>
          <div style="font-size:14px;color:var(--text-muted);">${completedTasks.length}/${tasks.length}</div>
        </div>
        <div class="task-list">
          ${tasksHTML}
        </div>
      </div>

      <!-- 记录列表 -->
      <div class="card">
        <div class="card-title">记录明细</div>
        <div class="record-list">
          ${recordsHTML}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">关闭</button>
    </div>
  `;

  modal.classList.remove('hidden');
}

// ========== 弹窗函数 ==========
function showAddRewardModal() {
  const modal = document.getElementById('modal');
  const content = document.getElementById('modalContent');
  
  content.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">添加奖励</h3>
      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">选择分类</label>
        <select class="form-select" id="rewardCategory">
          ${appData.categories.map(cat => 
            `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`
          ).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">奖励星星数</label>
        <select class="form-select" id="rewardStars">
          <option value="1">1 ⭐</option>
          <option value="2">2 ⭐</option>
          <option value="3" selected>3 ⭐</option>
          <option value="5">5 ⭐</option>
          <option value="10">10 ⭐</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">备注</label>
        <input type="text" class="form-input" id="rewardNote" placeholder="可选，填写奖励原因">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn btn-primary" onclick="addReward()">确认</button>
    </div>
  `;
  
  modal.classList.remove('hidden');
}

function showExchangeModal() {
  const modal = document.getElementById('modal');
  const content = document.getElementById('modalContent');
  const stats = getStats();
  
  content.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">星星兑换</h3>
      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:14px;color:var(--text-muted);">当前可用星星</div>
        <div style="font-size:32px;font-weight:700;color:var(--primary);">${stats.remainingStars} ⭐</div>
      </div>
      <div class="form-group">
        <label class="form-label">选择心愿</label>
        <select class="form-select" id="exchangeWish">
          ${appData.wishes.map(wish => 
            `<option value="${wish.id}">${wish.name} (${wish.stars}⭐)</option>`
          ).join('')}
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn btn-accent" onclick="exchangeWish()">兑换</button>
    </div>
  `;
  
  modal.classList.remove('hidden');
}

function showAddTaskModal() {
  const modal = document.getElementById('modal');
  const content = document.getElementById('modalContent');
  
  content.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">添加任务</h3>
      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">任务名称</label>
        <input type="text" class="form-input" id="taskName" placeholder="请输入任务名称">
      </div>
      <div class="form-group">
        <label class="form-label">选择分类</label>
        <select class="form-select" id="taskCategory">
          ${appData.categories.map(cat => 
            `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`
          ).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">奖励星星数</label>
        <select class="form-select" id="taskStars">
          <option value="1">1 ⭐</option>
          <option value="2">2 ⭐</option>
          <option value="3" selected>3 ⭐</option>
          <option value="5">5 ⭐</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn btn-primary" onclick="addTaskConfirm()">添加</button>
    </div>
  `;
  
  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

// ========== 操作函数 ==========
function addReward() {
  const categoryId = document.getElementById('rewardCategory').value;
  const stars = parseInt(document.getElementById('rewardStars').value);
  const note = document.getElementById('rewardNote').value;
  
  const category = appData.categories.find(c => c.id === categoryId);
  
  const record = {
    id: generateId(),
    type: 'reward',
    categoryId,
    categoryName: category?.name || '未分类',
    stars,
    timestamp: new Date().getTime(),
    note,
  };
  
  appData.records.push(record);
  saveData(appData);
  closeModal();
  renderSummaryPage();
}

function exchangeWish() {
  const wishId = document.getElementById('exchangeWish').value;
  const wish = appData.wishes.find(w => w.id === wishId);
  const stats = getStats();
  
  if (!wish) {
    alert('请选择心愿');
    return;
  }
  
  if (stats.remainingStars < wish.stars) {
    alert('星星不足，无法兑换');
    return;
  }
  
  if (!confirm(`确认兑换「${wish.name}」吗？将消耗 ${wish.stars} 颗星星`)) {
    return;
  }
  
  const record = {
    id: generateId(),
    type: 'exchange',
    categoryId: '',
    categoryName: '兑换',
    stars: -wish.stars,
    timestamp: new Date().getTime(),
    wishName: wish.name,
  };
  
  appData.records.push(record);
  saveData(appData);
  closeModal();
  renderSummaryPage();
}

function addTaskConfirm() {
  const name = document.getElementById('taskName').value.trim();
  const category = document.getElementById('taskCategory').value;
  const stars = parseInt(document.getElementById('taskStars').value);
  
  if (!name) {
    alert('请输入任务名称');
    return;
  }
  
  const task = {
    id: generateId(),
    name,
    category,
    stars,
    repeat: 'daily',
  };
  
  appData.tasks.push(task);
  saveData(appData);
  closeModal();
  renderTaskPage();
}

function addTask() {
  showTaskModal();
}

function showTaskModal(taskId = null) {
  const modal = document.getElementById('modal');
  const content = document.getElementById('modalContent');

  const task = taskId ? appData.tasks.find(t => t.id === taskId) : null;
  const title = task ? '编辑任务' : '添加任务';

  content.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">${title}</h3>
      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">任务名称</label>
        <input type="text" class="form-input" id="taskName" value="${task?.name || ''}" placeholder="请输入任务名称">
      </div>
      <div class="form-group">
        <label class="form-label">选择分类</label>
        <select class="form-select" id="taskCategory">
          ${appData.categories.map(cat =>
            `<option value="${cat.id}" ${task?.category === cat.id ? 'selected' : ''}>${cat.icon} ${cat.name}</option>`
          ).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">奖励星星数（输入负数为扣分）</label>
        <input type="number" class="form-input" id="taskStars" value="${task?.stars || 3}" placeholder="请输入星星数，如：5 或 -3">
        <div class="form-helper">正数为奖励，负数为扣分，如：3（奖励3星）或 -2（扣2星）</div>
      </div>
    </div>
    <div class="modal-footer">
      ${task ? `
        <button class="btn btn-danger" onclick="deleteTask('${taskId}')">删除</button>
      ` : ''}
      <button class="btn btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn btn-primary" onclick="saveTask('${taskId || ''}')">保存</button>
    </div>
  `;

  modal.classList.remove('hidden');
}

function saveTask(taskId) {
  const name = document.getElementById('taskName').value.trim();
  const category = document.getElementById('taskCategory').value;
  const stars = parseInt(document.getElementById('taskStars').value);

  if (!name) {
    alert('请输入任务名称');
    return;
  }

  if (taskId) {
    const task = appData.tasks.find(t => t.id === taskId);
    if (task) {
      task.name = name;
      task.category = category;
      task.stars = stars;
    }
  } else {
    const task = {
      id: generateId(),
      name,
      category,
      stars,
      repeat: 'daily',
    };
    appData.tasks.push(task);
  }

  saveData(appData);
  closeModal();
  renderSettingsPage();
}

function deleteTask(taskId) {
  const task = appData.tasks.find(t => t.id === taskId);
  if (!task) return;

  if (!confirm(`确定要删除任务「${task.name}」吗？该操作不可恢复！`)) return;

  appData.tasks = appData.tasks.filter(t => t.id !== taskId);
  saveData(appData);
  closeModal();
  renderSettingsPage();
}

function addCategory() {
  showCategoryModal();
}

function showCategoryModal(categoryId = null) {
  const modal = document.getElementById('modal');
  const content = document.getElementById('modalContent');

  const category = categoryId ? appData.categories.find(c => c.id === categoryId) : null;
  const title = category ? '编辑分类' : '添加分类';

  const icons = ['⭐', '📚', '🌟', '💖', '🎯', '🎨', '🎵', '🏃', '🍎', '🌈', '🌸', '🌺', '🦋', '🌻', '🍭', '🎪', '🎠', '🎡', '🎢', '🎦'];

  content.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">${title}</h3>
      <button class="modal-close" onclick="closeModal()">×</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">分类名称</label>
        <input type="text" class="form-input" id="categoryName" value="${category?.name || ''}" placeholder="请输入分类名称">
      </div>
      <div class="form-group">
        <label class="form-label">选择图标</label>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:8px;">
          ${icons.map(icon => `
            <div class="icon-select ${category?.icon === icon ? 'selected' : ''}"
                 onclick="selectIcon('${icon}')"
                 data-icon="${icon}"
                 style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;border:2px solid ${category?.icon === icon ? 'var(--primary)' : 'var(--border-color)'};border-radius:8px;font-size:20px;cursor:pointer;">
              ${icon}
            </div>
          `).join('')}
        </div>
        <input type="hidden" id="categoryIcon" value="${category?.icon || icons[0]}">
      </div>
    </div>
    <div class="modal-footer">
      ${category ? `
        <button class="btn btn-danger" onclick="deleteCategory('${categoryId}')">删除</button>
      ` : ''}
      <button class="btn btn-secondary" onclick="closeModal()">取消</button>
      <button class="btn btn-primary" onclick="saveCategory('${categoryId || ''}')">保存</button>
    </div>
  `;

  modal.classList.remove('hidden');
}

function selectIcon(icon) {
  document.querySelectorAll('.icon-select').forEach(el => {
    el.style.borderColor = el.dataset.icon === icon ? 'var(--primary)' : 'var(--border-color)';
  });
  document.getElementById('categoryIcon').value = icon;
}

function saveCategory(categoryId) {
  const name = document.getElementById('categoryName').value.trim();
  const icon = document.getElementById('categoryIcon').value;

  if (!name) {
    alert('请输入分类名称');
    return;
  }

  if (categoryId) {
    const category = appData.categories.find(c => c.id === categoryId);
    if (category) {
      category.name = name;
      category.icon = icon;
    }
  } else {
    const category = {
      id: generateId(),
      name,
      icon,
    };
    appData.categories.push(category);
  }

  saveData(appData);
  closeModal();
  renderSettingsPage();
}

function deleteCategory(categoryId) {
  const category = appData.categories.find(c => c.id === categoryId);
  if (!category) return;

  if (!confirm(`确定要删除分类「${category.name}」吗？该操作不可恢复！`)) return;

  appData.categories = appData.categories.filter(c => c.id !== categoryId);
  saveData(appData);
  closeModal();
  renderSettingsPage();
}

function addWish() {
  const name = prompt('请输入心愿名称：');
  if (!name) return;
  
  const stars = parseInt(prompt('请输入所需星星数：', '10'));
  if (!stars || stars <= 0) {
    alert('请输入有效的星星数');
    return;
  }
  
  const wish = {
    id: generateId(),
    name,
    stars,
  };
  
  appData.wishes.push(wish);
  saveData(appData);
  renderSettingsPage();
}

function editCategory(id) {
  showCategoryModal(id);
}

function editWish(id) {
  const wish = appData.wishes.find(w => w.id === id);
  if (!wish) return;
  
  const name = prompt('修改心愿名称：', wish.name);
  if (!name) return;
  
  const stars = parseInt(prompt('修改所需星星数：', wish.stars.toString()));
  if (!stars || stars <= 0) {
    alert('请输入有效的星星数');
    return;
  }
  
  wish.name = name;
  wish.stars = stars;
  saveData(appData);
  renderSettingsPage();
}

function editTask(id) {
  showTaskModal(id);
}

function updateUserName() {
  const name = document.getElementById('userNameInput').value.trim();
  if (name) {
    appData.userInfo.name = name;
    saveData(appData);
  }
}

function updateUserAvatar() {
  const avatar = document.getElementById('userAvatarInput').value.trim();
  appData.userInfo.avatar = avatar;
  saveData(appData);
}

function exportData() {
  const dataStr = JSON.stringify(appData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `family-reward-backup-${formatDate(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        appData = { ...defaultData, ...data };
        saveData(appData);
        alert('数据导入成功');
        location.reload();
      } catch (err) {
        alert('数据导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function resetData() {
  if (!confirm('确定要重置所有数据吗？此操作不可恢复！')) return;
  if (!confirm('再次确认：这将删除所有记录、任务和设置！')) return;
  
  localStorage.removeItem(STORAGE_KEY);
  appData = loadData();
  alert('数据已重置');
  location.reload();
}

function showCategoryRecords(categoryId) {
  // 简化处理，过滤显示该分类的记录
  alert(`查看「${categoryId}」分类的详细记录`);
}

// ========== 初始化 ==========
function init() {
  // 绑定导航事件
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      switchPage(item.dataset.page);
    });
  });
  
  // 初始渲染
  renderHeader();
  renderSummaryPage();
}

// 启动应用
document.addEventListener('DOMContentLoaded', init);
