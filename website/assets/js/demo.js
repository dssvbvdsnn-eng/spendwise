(() => {
  'use strict';

  const root = document.getElementById('demo');
  if (!root) return;

  const TODAY = { year: 2026, month: 10, day: 19, daysInMonth: 30 };
  const TODAY_KEY = '2026-11-19';
  const MONTH_LABEL = 'نوفمبر';
  const UNDO_SECONDS = 10;
  const MAX_AMOUNT = 100000000;

  const CATEGORY_META = {
    'طعام': { icon: 'i-cart', tone: 'green' },
    'مواصلات': { icon: 'i-bus', tone: 'gold' },
    'فواتير': { icon: 'i-receipt', tone: 'terra' },
    'صحة': { icon: 'i-shield', tone: 'green' },
    'ترفيه': { icon: 'i-sparkle', tone: 'gold' },
    'تسوق': { icon: 'i-wallet', tone: 'terra' },
    'أخرى': { icon: 'i-sparkle', tone: 'gold' },
    'دخل': { icon: 'i-banknote', tone: 'green' },
    'هدية': { icon: 'i-banknote', tone: 'green' },
    'مشروع': { icon: 'i-banknote', tone: 'green' },
  };

  const EXPENSE_CATEGORIES = ['طعام', 'مواصلات', 'فواتير', 'صحة', 'ترفيه', 'تسوق', 'أخرى'];
  const INCOME_CATEGORIES = ['دخل', 'هدية', 'مشروع'];

  const CATEGORY_BUDGETS = {
    'طعام': 350000,
    'مواصلات': 150000,
    'فواتير': 150000,
    'صحة': 70000,
    'ترفيه': 80000,
    'تسوق': 100000,
    'أخرى': 100000,
  };

  const BASE_BUDGET = 1000000;

  const BASE_TRANSACTIONS = [
    { id: 't23', type: 'expense', category: 'طعام', note: 'قهوة الصبح', amount: 6000, date: '2026-11-19', time: '8:40 ص' },
    { id: 't22', type: 'expense', category: 'طعام', note: 'عشاء برا', amount: 34000, date: '2026-11-18', time: '9:10 م' },
    { id: 't21', type: 'expense', category: 'ترفيه', note: 'سينما', amount: 18000, date: '2026-11-18', time: '6:30 م' },
    { id: 't20', type: 'expense', category: 'أخرى', note: 'غسيل وكي', amount: 15400, date: '2026-11-18', time: '5:00 م' },
    { id: 't19', type: 'expense', category: 'طعام', note: 'سوبر ماركت', amount: 39000, date: '2026-11-17', time: '7:15 م' },
    { id: 't18', type: 'expense', category: 'مواصلات', note: 'مواصلات', amount: 12000, date: '2026-11-16', time: '8:05 ص' },
    { id: 't17', type: 'expense', category: 'طعام', note: 'طلبات مطعم', amount: 30000, date: '2026-11-15', time: '9:20 م' },
    { id: 't16', type: 'expense', category: 'طعام', note: 'سوبر ماركت', amount: 54000, date: '2026-11-14', time: '6:45 م' },
    { id: 't15', type: 'expense', category: 'فواتير', note: 'فاتورة موبايل', amount: 25000, date: '2026-11-13', time: '11:05 ص' },
    { id: 't14', type: 'income', category: 'مشروع', note: 'دفعة مشروع', amount: 300000, date: '2026-11-12', time: '4:20 م' },
    { id: 't13', type: 'expense', category: 'تسوق', note: 'ملابس', amount: 75000, date: '2026-11-11', time: '7:50 م' },
    { id: 't12', type: 'expense', category: 'مواصلات', note: 'صيانة عربية', amount: 85000, date: '2026-11-10', time: '1:30 م' },
    { id: 't11', type: 'expense', category: 'فواتير', note: 'إنترنت', amount: 30000, date: '2026-11-09', time: '10:00 ص' },
    { id: 't10', type: 'expense', category: 'طعام', note: 'سوبر ماركت', amount: 61000, date: '2026-11-08', time: '8:10 م' },
    { id: 't09', type: 'expense', category: 'صحة', note: 'صيدلية', amount: 14550, date: '2026-11-07', time: '5:40 م' },
    { id: 't08', type: 'expense', category: 'طعام', note: 'عشاء مع الأصحاب', amount: 26000, date: '2026-11-06', time: '10:15 م' },
    { id: 't07', type: 'expense', category: 'مواصلات', note: 'بنزين', amount: 35000, date: '2026-11-05', time: '9:30 ص' },
    { id: 't06', type: 'expense', category: 'فواتير', note: 'فاتورة كهرباء', amount: 48000, date: '2026-11-04', time: '12:40 م' },
    { id: 't05', type: 'expense', category: 'طعام', note: 'خضار وفاكهة', amount: 13000, date: '2026-11-03', time: '6:25 م' },
    { id: 't04', type: 'expense', category: 'طعام', note: 'قهوة', amount: 5500, date: '2026-11-02', time: '9:05 ص' },
    { id: 't03', type: 'income', category: 'دخل', note: 'راتب نوفمبر', amount: 550000, date: '2026-11-01', time: '9:00 ص' },
    { id: 't02', type: 'expense', category: 'طعام', note: 'سوبر ماركت', amount: 42000, date: '2026-11-01', time: '1:10 م' },
    { id: 't01', type: 'expense', category: 'مواصلات', note: 'مشاوير الشغل', amount: 7500, date: '2026-11-01', time: '8:20 ص' },
  ];

  const HISTORY = [
    { label: 'يونيو', expenses: 456000, income: 720000 },
    { label: 'يوليو', expenses: 512000, income: 720000 },
    { label: 'أغسطس', expenses: 424000, income: 720000 },
    { label: 'سبتمبر', expenses: 594050, income: 780000 },
    { label: 'أكتوبر', expenses: 486000, income: 780000 },
  ];

  const moneyFormat = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const fmt = (piastres) => moneyFormat.format(Math.abs(piastres) / 100);
  const all = (selector, scope = root) => Array.from(scope.querySelectorAll(selector));
  const one = (selector, scope = root) => scope.querySelector(selector);

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (character) => {
      const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      return map[character];
    });

  const arabicDigits = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
  };

  const normalizeNumber = (value) =>
    String(value)
      .replace(/[٠-٩۰-۹]/g, (digit) => arabicDigits[digit])
      .replace(/[,\s]/g, '')
      .replace(/[٫،]/g, '.');

  const parseMoney = (value) => {
    const normalized = normalizeNumber(value);
    if (normalized === '' || !/^\d*(\.\d{0,2})?$/.test(normalized) || normalized === '.') {
      return null;
    }
    const amount = Number(normalized);
    if (!Number.isFinite(amount)) return null;
    return Math.round(amount * 100);
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const suffix = hours >= 12 ? 'م' : 'ص';
    hours %= 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${suffix}`;
  };

  const cloneTransactions = () => BASE_TRANSACTIONS.map((transaction) => ({ ...transaction }));

  const initialSheet = () => ({
    type: 'expense',
    category: EXPENSE_CATEGORIES[0],
  });

  let state = {
    budget: BASE_BUDGET,
    transactions: cloneTransactions(),
    view: 'overview',
    filter: 'all',
    query: '',
    sheetOpen: false,
    sheet: initialSheet(),
    pendingDelete: null,
    lastTrigger: null,
  };

  const views = {
    overview: document.getElementById('demo-panel-overview'),
    transactions: document.getElementById('demo-panel-transactions'),
    reports: document.getElementById('demo-panel-reports'),
    budget: document.getElementById('demo-panel-budget'),
  };

  const tabs = {
    overview: document.getElementById('demo-tab-overview'),
    transactions: document.getElementById('demo-tab-transactions'),
    reports: document.getElementById('demo-tab-reports'),
    budget: document.getElementById('demo-tab-budget'),
  };

  const tabOrder = ['overview', 'transactions', 'reports', 'budget'];

  const viewsWrap = one('.demo-views');
  const nav = one('.demo-nav');
  const searchInput = document.getElementById('demo-search');
  const txList = document.getElementById('demo-tx-list');
  const emptyState = document.getElementById('demo-empty');
  const resultCount = document.getElementById('demo-result-count');
  const recentList = document.getElementById('demo-recent');
  const overviewCategories = document.getElementById('demo-overview-categories');
  const reportCategories = document.getElementById('demo-report-categories');
  const reportTotal = document.getElementById('demo-report-total');
  const reportDelta = document.getElementById('demo-report-delta');
  const reportChart = document.getElementById('demo-report-chart');
  const topDay = document.getElementById('demo-top-day');
  const avgDay = document.getElementById('demo-avg-day');
  const sparkLine = document.getElementById('demo-spark-line');
  const sparkArea = document.getElementById('demo-spark-area');
  const chartCaption = document.getElementById('demo-chart-caption');
  const budgetForm = document.getElementById('demo-budget-form');
  const budgetInput = document.getElementById('demo-budget-input');
  const budgetError = document.getElementById('demo-budget-error');
  const budgetHint = document.getElementById('demo-budget-hint');
  const presetButtons = all('[data-demo-preset]');
  const catBudgets = document.getElementById('demo-cat-budgets');
  const bellButton = one('.demo-bell');
  const resetButton = document.getElementById('demo-reset');
  const sheet = document.getElementById('demo-sheet');
  const sheetPanel = one('.demo-sheet-panel', sheet);
  const sheetTitle = document.getElementById('demo-sheet-title');
  const addForm = document.getElementById('demo-add-form');
  const amountInput = document.getElementById('demo-amount');
  const addError = document.getElementById('demo-add-error');
  const noteInput = document.getElementById('demo-note');
  const catChips = document.getElementById('demo-cat-chips');
  const typeButtons = all('[data-demo-type]');
  const snackbar = document.getElementById('demo-snackbar');
  const snackbarText = document.getElementById('demo-snackbar-text');
  const undoButton = document.getElementById('demo-undo');
  const undoCount = document.getElementById('demo-undo-count');

  let snackbarTimer = null;
  let countdownTimer = null;
  let sheetTimer = null;

  const sumBy = (predicate, field = 'amount') =>
    state.transactions.reduce((total, transaction) => (predicate(transaction) ? total + transaction[field] : total), 0);

  const getCategoryMeta = (category) => CATEGORY_META[category] || CATEGORY_META['أخرى'];

  const dayLabel = (dateKey) => {
    if (dateKey === TODAY_KEY) return 'النهارده';
    if (dateKey === '2026-11-18') return 'أمس';
    const day = Number(dateKey.slice(8, 10));
    return `${day} ${MONTH_LABEL}`;
  };

  const countLabel = (count) => {
    if (count === 0) return 'مفيش عمليات مطابقة';
    if (count === 1) return 'عملية واحدة';
    if (count === 2) return 'عمليتين';
    if (count <= 10) return `${count} عمليات`;
    return `${count} عملية`;
  };

  const compute = () => {
    const expenses = sumBy((transaction) => transaction.type === 'expense');
    const income = sumBy((transaction) => transaction.type === 'income');
    const remaining = state.budget - expenses;
    const usedPct = state.budget > 0 ? (expenses / state.budget) * 100 : 0;
    const daysLeft = TODAY.daysInMonth - TODAY.day + 1;
    const daily = remaining > 0 ? Math.round(remaining / daysLeft) : 0;
    const todaySpent = sumBy(
      (transaction) => transaction.type === 'expense' && transaction.date === TODAY_KEY
    );

    const categoryTotals = {};
    state.transactions.forEach((transaction) => {
      if (transaction.type !== 'expense') return;
      categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    });

    const categoryList = Object.keys(categoryTotals)
      .map((name) => ({
        name,
        total: categoryTotals[name],
        pct: expenses > 0 ? (categoryTotals[name] / expenses) * 100 : 0,
        meta: getCategoryMeta(name),
      }))
      .sort((a, b) => b.total - a.total);

    return {
      expenses,
      income,
      remaining,
      usedPct,
      daysLeft,
      daily,
      todaySpent,
      todayPct: daily > 0 ? (todaySpent / daily) * 100 : 0,
      categoryList,
    };
  };

  const setAllText = (selector, value) => {
    all(selector).forEach((element) => {
      element.textContent = value;
    });
  };

  const renderTotals = (stats) => {
    setAllText('[data-demo="remaining"]', fmt(stats.remaining));
    setAllText('[data-demo="spent"]', fmt(stats.expenses));
    setAllText('[data-demo="budget-total"]', fmt(state.budget));
    setAllText('[data-demo="expense-total"]', fmt(stats.expenses));
    setAllText('[data-demo="income-total"]', fmt(stats.income));
    setAllText('[data-demo="daily"]', fmt(stats.daily));
    setAllText('[data-demo="days-left"]', String(stats.daysLeft));
    setAllText('[data-demo="today-spent"]', fmt(stats.todaySpent));
    setAllText('[data-demo="badge"]', `${Math.round(stats.usedPct)}٪`);

    all('[data-demo="remaining-label"]').forEach((element) => {
      element.textContent = stats.remaining >= 0 ? 'متبقي من ميزانية نوفمبر' : 'تجاوزت الميزانية بـ';
    });

    all('[data-demo-budget-card]').forEach((card) => {
      card.classList.toggle('is-over', stats.remaining < 0);
    });

    all('[data-demo="progress"]').forEach((bar) => {
      bar.style.width = `${Math.min(100, stats.usedPct)}%`;
      bar.classList.toggle('is-over', stats.remaining < 0);
    });

    all('[data-demo="today-progress"]').forEach((bar) => {
      bar.style.width = `${Math.min(100, stats.todayPct)}%`;
      bar.classList.toggle('is-over', stats.daily > 0 && stats.todaySpent > stats.daily);
    });
  };

  const rowMarkup = (transaction) => {
    const meta = getCategoryMeta(transaction.category);
    const title = transaction.note || transaction.category;
    const sign = transaction.type === 'income' ? '+' : '−';
    return `
      <div class="m-row demo-tx-row">
        <span class="m-row-icon m-row-icon-${meta.tone}"><svg class="icon" aria-hidden="true"><use href="#${meta.icon}"></use></svg></span>
        <span class="m-row-texts">
          <span class="m-row-title">${escapeHtml(title)}</span>
          <span class="m-row-sub">${escapeHtml(transaction.category)} · ${escapeHtml(transaction.time)}</span>
        </span>
        <span class="m-row-amount${transaction.type === 'income' ? ' is-income' : ''}">${sign}<bdi>${fmt(transaction.amount)}</bdi></span>
        <button class="demo-delete" type="button" data-demo-delete="${transaction.id}" aria-label="حذف ${escapeHtml(title)}">
          <svg class="icon" aria-hidden="true"><use href="#i-trash"></use></svg>
        </button>
      </div>`;
  };

  const miniRowMarkup = (transaction) => {
    const meta = getCategoryMeta(transaction.category);
    const title = transaction.note || transaction.category;
    const sign = transaction.type === 'income' ? '+' : '−';
    return `
      <div class="m-row">
        <span class="m-row-icon m-row-icon-${meta.tone}"><svg class="icon" aria-hidden="true"><use href="#${meta.icon}"></use></svg></span>
        <span class="m-row-texts">
          <span class="m-row-title">${escapeHtml(title)}</span>
          <span class="m-row-sub">${escapeHtml(transaction.category)} · ${escapeHtml(transaction.time)}</span>
        </span>
        <span class="m-row-amount${transaction.type === 'income' ? ' is-income' : ''}">${sign}<bdi>${fmt(transaction.amount)}</bdi></span>
      </div>`;
  };

  const renderOverview = (stats) => {
    const top = stats.categoryList.slice(0, 3);
    overviewCategories.innerHTML = top.length
      ? top
          .map((category, index) => {
            const tones = ['green', 'gold', 'terra'];
            return `<div class="m-breakdown-row"><span class="m-legend m-legend-${tones[index]}"></span><span>${escapeHtml(category.name)}</span><b><bdi>${fmt(category.total)}</bdi> <small>ج.م</small></b></div>`;
          })
          .join('')
      : '<div class="m-breakdown-row"><span>مفيش مصاريف لسه.</span></div>';

    recentList.innerHTML = state.transactions.length
      ? state.transactions.slice(0, 3).map(miniRowMarkup).join('')
      : '<div class="m-row"><span class="m-row-texts"><span class="m-row-title">مفيش عمليات لسه</span><span class="m-row-sub">ابدأ من شاشة المعاملات.</span></span></div>';

    renderSpark();
  };

  const renderSpark = () => {
    const days = TODAY.day;
    const dailyTotals = Array.from({ length: days }, (_, index) => {
      const day = String(index + 1).padStart(2, '0');
      return sumBy(
        (transaction) => transaction.type === 'expense' && transaction.date === `2026-11-${day}`
      );
    });

    const max = Math.max(...dailyTotals, 1);
    const left = 2;
    const right = 238;
    const top = 6;
    const bottom = 50;
    const points = dailyTotals.map((value, index) => {
      const x = left + ((right - left) * index) / (days - 1);
      const y = bottom - (value / max) * (bottom - top);
      return { x, y };
    });

    let line = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const current = points[index];
      const midX = (previous.x + current.x) / 2;
      const midY = (previous.y + current.y) / 2;
      line += ` Q ${previous.x.toFixed(1)} ${previous.y.toFixed(1)} ${midX.toFixed(1)} ${midY.toFixed(1)}`;
    }
    const last = points[points.length - 1];
    line += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;

    sparkLine.setAttribute('d', line);
    sparkArea.setAttribute('d', `${line} L ${right} 52 L ${left} 52 Z`);
    chartCaption.textContent = `آخر ${days} يوم — بيتحدّث مع كل عملية.`;
  };

  const renderTransactions = (stats) => {
    const query = state.query.trim().toLowerCase();
    const filtered = state.transactions.filter((transaction) => {
      if (state.filter !== 'all' && transaction.type !== state.filter) return false;
      if (!query) return true;
      const haystack = `${transaction.category} ${transaction.note || ''}`.toLowerCase();
      return haystack.includes(query);
    });

    let html = '';
    let currentDate = null;
    filtered.forEach((transaction) => {
      if (transaction.date !== currentDate) {
        if (currentDate !== null) html += '</div>';
        html += `<div class="m-group-label">${dayLabel(transaction.date)}</div><div class="m-rows">`;
        currentDate = transaction.date;
      }
      html += rowMarkup(transaction);
    });
    if (currentDate !== null) html += '</div>';

    txList.innerHTML = html;
    emptyState.hidden = filtered.length !== 0;
    resultCount.textContent = countLabel(filtered.length);

    all('[data-demo-filter]').forEach((chip) => {
      const active = chip.dataset.demoFilter === state.filter;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });

    setAllText('[data-demo="expense-total"]', fmt(stats.expenses));
  };

  const renderReports = (stats) => {
    const months = HISTORY.concat([
      { label: MONTH_LABEL, expenses: stats.expenses, income: stats.income },
    ]);

    const total = months.reduce((sum, month) => sum + month.expenses, 0);
    reportTotal.textContent = fmt(total);

    const previous = HISTORY[HISTORY.length - 1];
    if (previous.expenses > 0) {
      const change = ((stats.expenses - previous.expenses) / previous.expenses) * 100;
      const direction = change >= 0 ? 'أعلى' : 'أقل';
      reportDelta.textContent = `${direction} من أكتوبر بـ ${Math.abs(Math.round(change))}٪`;
    } else {
      reportDelta.textContent = 'مقارنة أكتوبر مش متاحة';
    }

    const max = Math.max(...months.flatMap((month) => [month.expenses, month.income]), 1);
    reportChart.innerHTML = months
      .map((month, index) => {
        const exp = Math.max(3, (month.expenses / max) * 100);
        const inc = Math.max(3, (month.income / max) * 100);
        return `<div class="m-bar-group${index === months.length - 1 ? ' is-current' : ''}">
          <i class="bar bar-exp" style="--h:${exp.toFixed(1)}%"></i>
          <i class="bar bar-inc" style="--h:${inc.toFixed(1)}%"></i>
          <span>${month.label}</span>
        </div>`;
      })
      .join('');

    reportChart.setAttribute(
      'aria-label',
      `مصاريف ودخل آخر ستة شهور. نوفمبر: مصاريف ${fmt(stats.expenses)} جنيه ودخل ${fmt(stats.income)} جنيه.`
    );

    const dailyTotals = Array.from({ length: TODAY.day }, (_, index) => {
      const day = String(index + 1).padStart(2, '0');
      const amount = sumBy(
        (transaction) => transaction.type === 'expense' && transaction.date === `2026-11-${day}`
      );
      return { day: index + 1, amount };
    });
    const bestDay = dailyTotals.reduce((best, entry) => (entry.amount > best.amount ? entry : best), { day: 1, amount: 0 });

    topDay.textContent = bestDay.amount > 0
      ? `${bestDay.day} ${MONTH_LABEL} · ${fmt(bestDay.amount)}`
      : 'مفيش صرف لسه';

    avgDay.textContent = fmt(Math.round(stats.expenses / TODAY.day));

    const top = stats.categoryList.slice(0, 3);
    const tones = ['green', 'gold', 'terra'];
    reportCategories.innerHTML = top.length
      ? top
          .map(
            (category, index) =>
              `<div class="m-breakdown-row"><span class="m-legend m-legend-${tones[index]}"></span><span>${escapeHtml(category.name)}</span><b>${Math.round(category.pct)}٪</b></div>`
          )
          .join('')
      : '<div class="m-breakdown-row"><span>مفيش مصاريف لسه.</span></div>';
  };

  const renderBudget = (stats) => {
    budgetHint.textContent = stats.remaining >= 0
      ? `فاضل ${fmt(stats.remaining)} ج.م على ${stats.daysLeft} يوم — المسموح يوميًا ${fmt(stats.daily)} ج.م.`
      : `تجاوزت الميزانية بـ ${fmt(stats.remaining)} ج.م — عدّل المبلغ أو راجع المصاريف.`;

    const spentByCategory = {};
    state.transactions.forEach((transaction) => {
      if (transaction.type !== 'expense') return;
      spentByCategory[transaction.category] = (spentByCategory[transaction.category] || 0) + transaction.amount;
    });

    const tones = ['green', 'gold', 'terra', 'green', 'gold', 'terra', 'green'];
    catBudgets.innerHTML = EXPENSE_CATEGORIES.map((category, index) => {
      const spent = spentByCategory[category] || 0;
      const cap = CATEGORY_BUDGETS[category];
      const pct = (spent / cap) * 100;
      const over = pct >= 100;
      return `<div class="demo-cat-budget">
        <div class="demo-cat-top">
          <span><i class="m-legend m-legend-${tones[index]}"></i>${escapeHtml(category)}</span>
          <b class="${over ? 'is-over' : ''}">${fmt(spent)} / ${fmt(cap)}</b>
        </div>
        <div class="demo-cat-bar"><span class="${over ? 'is-over' : ''}" style="width:${Math.min(100, pct).toFixed(1)}%"></span></div>
      </div>`;
    }).join('');

    presetButtons.forEach((button) => {
      const active = Number(button.dataset.demoPreset) === state.budget;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  const render = () => {
    const stats = compute();
    renderTotals(stats);
    renderOverview(stats);
    renderTransactions(stats);
    renderReports(stats);
    renderBudget(stats);
    return stats;
  };

  const clearSnackbarTimers = () => {
    window.clearTimeout(snackbarTimer);
    window.clearInterval(countdownTimer);
    snackbarTimer = null;
    countdownTimer = null;
  };

  const hideSnackbar = () => {
    snackbar.classList.remove('is-visible');
    undoButton.hidden = true;
  };

  const showSnackbar = (message, { undo = false, duration = 4200 } = {}) => {
    clearSnackbarTimers();
    snackbarText.textContent = message;
    undoButton.hidden = !undo;
    undoCount.textContent = String(UNDO_SECONDS);
    snackbar.classList.add('is-visible');

    if (undo) {
      let remaining = UNDO_SECONDS;
      countdownTimer = window.setInterval(() => {
        remaining -= 1;
        undoCount.textContent = String(Math.max(0, remaining));
      }, 1000);
      snackbarTimer = window.setTimeout(() => {
        if (state.pendingDelete) state.pendingDelete = null;
        hideSnackbar();
      }, UNDO_SECONDS * 1000);
    } else {
      snackbarTimer = window.setTimeout(hideSnackbar, duration);
    }
  };

  const switchView = (view, { focusTab = false } = {}) => {
    if (!views[view]) return;
    state.view = view;
    tabOrder.forEach((name) => {
      const selected = name === view;
      tabs[name].classList.toggle('is-active', selected);
      tabs[name].setAttribute('aria-selected', String(selected));
      tabs[name].tabIndex = selected ? 0 : -1;
      views[name].hidden = !selected;
    });
    const panel = views[view];
    panel.scrollTop = 0;
    const scroller = one('.demo-view-scroll', panel);
    if (scroller) scroller.scrollTop = 0;
    if (focusTab) tabs[view].focus({ preventScroll: true });
  };

  const setInert = (inert) => {
    viewsWrap.inert = inert;
    nav.inert = inert;
    snackbar.inert = inert;
  };

  const setType = (type) => {
    state.sheet.type = type;
    state.sheet.category = type === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0];
    typeButtons.forEach((button) => {
      const active = button.dataset.demoType === type;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    sheetTitle.textContent = type === 'expense' ? 'مصروف جديد' : 'دخل جديد';
    renderCategoryChips();
    hideAddError();
  };

  const renderCategoryChips = () => {
    const categories = state.sheet.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    catChips.innerHTML = categories
      .map(
        (category) =>
          `<button class="demo-cat-chip${category === state.sheet.category ? ' is-active' : ''}" type="button" data-demo-cat="${escapeHtml(category)}" aria-pressed="${category === state.sheet.category}">${escapeHtml(category)}</button>`
      )
      .join('');
  };

  const hideAddError = () => {
    addError.hidden = true;
    addError.textContent = '';
    amountInput.removeAttribute('aria-invalid');
  };

  const showAddError = (message) => {
    addError.hidden = false;
    addError.textContent = message;
    amountInput.setAttribute('aria-invalid', 'true');
    amountInput.focus();
  };

  const openSheet = (trigger) => {
    window.clearTimeout(sheetTimer);
    state.lastTrigger = trigger || null;
    setType('expense');
    addForm.reset();
    noteInput.value = '';
    amountInput.value = '';
    hideAddError();
    state.sheetOpen = true;
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    amountInput.focus({ preventScroll: true });
    setInert(true);
  };

  const closeSheet = ({ restoreFocus = true } = {}) => {
    if (!state.sheetOpen) return;
    state.sheetOpen = false;
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    setInert(false);
    const trigger = state.lastTrigger;
    state.lastTrigger = null;
    if (restoreFocus && trigger && document.contains(trigger)) {
      trigger.focus({ preventScroll: true });
    }
  };

  const addTransaction = () => {
    const amount = parseMoney(amountInput.value);
    if (amount === null) {
      showAddError('اكتب مبلغ صحيح، مثال: 250.50');
      return;
    }
    if (amount <= 0) {
      showAddError('المبلغ لازم يكون أكبر من صفر.');
      return;
    }
    if (amount > MAX_AMOUNT) {
      showAddError('أقصى مبلغ في التجربة 1,000,000 ج.م.');
      return;
    }

    const now = new Date();
    const transaction = {
      id: `t${now.getTime()}`,
      type: state.sheet.type,
      category: state.sheet.category,
      note: noteInput.value.trim().slice(0, 40),
      amount,
      date: TODAY_KEY,
      time: formatTime(now),
    };

    state.transactions.unshift(transaction);
    state.filter = 'all';
    state.query = '';
    searchInput.value = '';
    closeSheet({ restoreFocus: false });
    const stats = render();
    showSnackbar(
      `اتسجلت العملية — فاضل ${fmt(stats.remaining)} ج.م من ميزانية الشهر.`
    );
    const fab = one('.demo-fab');
    if (fab) fab.focus({ preventScroll: true });
  };

  const deleteTransaction = (id) => {
    const index = state.transactions.findIndex((transaction) => transaction.id === id);
    if (index < 0) return;
    const transaction = state.transactions[index];
    state.transactions.splice(index, 1);
    state.pendingDelete = { transaction, index };
    render();
    showSnackbar(`اتمسحت «${transaction.note || transaction.category}». تقدر ترجّعها خلال 10 ثواني.`, {
      undo: true,
    });

    const nextButtons = all('[data-demo-delete]');
    if (nextButtons.length) {
      const target = nextButtons[Math.min(index, nextButtons.length - 1)];
      target.focus({ preventScroll: false });
    } else {
      searchInput.focus({ preventScroll: true });
    }
  };

  const undoDelete = () => {
    const pending = state.pendingDelete;
    clearSnackbarTimers();
    hideSnackbar();
    if (!pending) return;
    const index = Math.min(pending.index, state.transactions.length);
    state.transactions.splice(index, 0, pending.transaction);
    state.pendingDelete = null;
    render();
    showSnackbar('رجعت العملية تاني.', { duration: 3200 });
    const restored = one(`[data-demo-delete="${pending.transaction.id}"]`);
    if (restored) restored.focus({ preventScroll: false });
  };

  const showInsight = () => {
    const stats = compute();
    let message;
    if (stats.remaining < 0) {
      message = `تجاوزت ميزانية الشهر بـ ${fmt(stats.remaining)} ج.م — راجع أكبر الفئات.`;
    } else if (stats.daily > 0 && stats.todaySpent > stats.daily) {
      message = `صرفت النهارده ${fmt(stats.todaySpent)} ج.م — أكتر من المسموح (${fmt(stats.daily)}).`;
    } else {
      message = `فاضل ${fmt(stats.remaining)} ج.م على ${stats.daysLeft} يوم — المسموح يوميًا ${fmt(stats.daily)} ج.م.`;
    }
    showSnackbar(message, { duration: 5200 });
  };

  const saveBudget = () => {
    const amount = parseMoney(budgetInput.value);
    if (amount === null) {
      budgetError.hidden = false;
      budgetError.textContent = 'اكتب مبلغ صحيح، مثال: 10000.00';
      budgetInput.setAttribute('aria-invalid', 'true');
      budgetInput.focus();
      return;
    }
    if (amount <= 0) {
      budgetError.hidden = false;
      budgetError.textContent = 'الميزانية لازم تكون أكبر من صفر.';
      budgetInput.setAttribute('aria-invalid', 'true');
      budgetInput.focus();
      return;
    }
    if (amount > MAX_AMOUNT) {
      budgetError.hidden = false;
      budgetError.textContent = 'أقصى ميزانية في التجربة 1,000,000 ج.م.';
      budgetInput.setAttribute('aria-invalid', 'true');
      budgetInput.focus();
      return;
    }

    state.budget = amount;
    budgetError.hidden = true;
    budgetError.textContent = '';
    budgetInput.removeAttribute('aria-invalid');
    budgetInput.value = (amount / 100).toFixed(2);
    render();
    showSnackbar(`اتحدّثت ميزانية الشهر لـ ${fmt(state.budget)} ج.م.`);
  };

  const resetDemo = () => {
    clearSnackbarTimers();
    window.clearTimeout(sheetTimer);
    hideSnackbar();
    if (state.sheetOpen) closeSheet({ restoreFocus: false });
    state = {
      budget: BASE_BUDGET,
      transactions: cloneTransactions(),
      view: 'overview',
      filter: 'all',
      query: '',
      sheetOpen: false,
      sheet: initialSheet(),
      pendingDelete: null,
      lastTrigger: null,
    };
    searchInput.value = '';
    budgetInput.value = (BASE_BUDGET / 100).toFixed(2);
    budgetError.hidden = true;
    budgetError.textContent = '';
    budgetInput.removeAttribute('aria-invalid');
    hideAddError();
    addForm.reset();
    switchView('overview');
    render();
    showSnackbar('اتعاد ضبط التجربة — كل البيانات رجعت زي الأول.', { duration: 4200 });
    resetButton.focus({ preventScroll: true });
  };

  const handleTabKeydown = (event, view) => {
    const index = tabOrder.indexOf(view);
    let nextIndex = null;

    if (event.key === 'ArrowLeft') {
      nextIndex = index + 1;
    } else if (event.key === 'ArrowRight') {
      nextIndex = index - 1;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = tabOrder.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    const clamped = (nextIndex + tabOrder.length) % tabOrder.length;
    switchView(tabOrder[clamped], { focusTab: true });
  };

  tabOrder.forEach((view) => {
    const tab = tabs[view];
    tab.addEventListener('click', () => switchView(view));
    tab.addEventListener('keydown', (event) => handleTabKeydown(event, view));
  });

  root.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-demo-add]');
    if (addButton) {
      openSheet(addButton);
      return;
    }

    const deleteButton = event.target.closest('[data-demo-delete]');
    if (deleteButton) {
      deleteTransaction(deleteButton.dataset.demoDelete);
      return;
    }

    const filterChip = event.target.closest('[data-demo-filter]');
    if (filterChip) {
      state.filter = filterChip.dataset.demoFilter;
      render();
      return;
    }

    const typeButton = event.target.closest('[data-demo-type]');
    if (typeButton) {
      setType(typeButton.dataset.demoType);
      return;
    }

    const categoryChip = event.target.closest('[data-demo-cat]');
    if (categoryChip) {
      state.sheet.category = categoryChip.dataset.demoCat;
      renderCategoryChips();
      return;
    }

    if (event.target.closest('[data-demo-sheet-close]')) {
      closeSheet();
      return;
    }

    const gotoButton = event.target.closest('[data-demo-goto]');
    if (gotoButton) {
      switchView(gotoButton.dataset.demoGoto, { focusTab: true });
      return;
    }

    const preset = event.target.closest('[data-demo-preset]');
    if (preset) {
      state.budget = Number(preset.dataset.demoPreset);
      budgetInput.value = (state.budget / 100).toFixed(2);
      budgetError.hidden = true;
      budgetError.textContent = '';
      budgetInput.removeAttribute('aria-invalid');
      render();
      showSnackbar(`اتحدّثت ميزانية الشهر لـ ${fmt(state.budget)} ج.م.`);
    }
  });

  searchInput.addEventListener('input', () => {
    state.query = searchInput.value;
    render();
  });

  budgetForm.addEventListener('submit', (event) => {
    event.preventDefault();
    saveBudget();
  });

  budgetInput.addEventListener('input', () => {
    budgetError.hidden = true;
    budgetError.textContent = '';
    budgetInput.removeAttribute('aria-invalid');
  });

  addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addTransaction();
  });

  amountInput.addEventListener('input', hideAddError);

  bellButton.addEventListener('click', showInsight);
  undoButton.addEventListener('click', undoDelete);
  resetButton.addEventListener('click', resetDemo);

  sheet.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeSheet();
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = Array.from(
      sheetPanel.querySelectorAll('button:not([hidden]), input:not([disabled]), [href], select, textarea')
    ).filter((element) => element.offsetParent !== null);

    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !state.sheetOpen) return;
    closeSheet();
  });

  renderCategoryChips();
  switchView('overview');
  render();
})();
