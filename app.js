(() => {
  'use strict';

  const INITIAL_ITEMS = [
    {
      id: 1,
      category: 'Layout',
      title: 'Responsive Grid System',
      description: 'Адаптивна модульна сітка на базі CSS Grid із підтримкою токенів відступів.'
    },
    {
      id: 2,
      category: 'Feedback',
      title: 'Skeleton Loader',
      description: 'Каркасний індикатор завантаження для запобігання ефекту зависання інтерфейсу.'
    },
    {
      id: 3,
      category: 'Navigation',
      title: 'State Switcher Bar',
      description: 'Панель швидкої верифікації життєвого циклу екрана без перезавантаження сторінки.'
    },
    {
      id: 4,
      category: 'Tokens',
      title: 'Semantic Theme Engine',
      description: 'Динамічне перемикання світлої та темної тем шляхом підміни семантичних токенів.'
    }
  ];

  let items = [...INITIAL_ITEMS];
  let loadingTimerId = null;

  // DOM Elements
  const stateBlocks = document.querySelectorAll('[data-state]');
  const stateButtons = document.querySelectorAll('[data-state-btn]');
  const cardsContainer = document.getElementById('cards-container');
  const searchInput = document.getElementById('search-input');
  const refreshBtn = document.getElementById('refresh-btn');
  const resetEmptyBtn = document.getElementById('reset-empty-btn');
  const retryErrorBtn = document.getElementById('retry-error-btn');

  // Navigation & Theme Elements
  const viewTabs = document.querySelectorAll('[data-view-tab]');
  const viewApp = document.getElementById('view-app');
  const viewUikit = document.getElementById('view-uikit');
  const themeToggleBtn = document.getElementById('theme-toggle');

  /**
   * Перемикання взаємовиключних станів екрана виключно через CSS-класи
   */
  function renderState(stateName) {
    stateBlocks.forEach((block) => {
      const isTarget = block.dataset.state === stateName;
      block.classList.toggle('is-hidden', !isTarget);
    });

    stateButtons.forEach((btn) => {
      const isActive = btn.dataset.stateBtn === stateName;
      btn.classList.toggle('is-active', isActive);
    });
  }

  /**
   * Рендер списку карток у стані content
   */
  function renderCards(data) {
    cardsContainer.innerHTML = '';

    data.forEach((item) => {
      const article = document.createElement('article');
      article.className = 'card';

      article.innerHTML = `
        <div>
          <span class="card-badge">${item.category}</span>
          <h3 class="card-title">${item.title}</h3>
          <p class="card-desc">${item.description}</p>
        </div>
        <div class="card-footer">
          <button type="button" class="btn btn-secondary" data-delete-id="${item.id}">
            Видалити
          </button>
        </div>
      `;

      cardsContainer.appendChild(article);
    });
  }

  /**
   * Імітація асинхронного завантаження (1.6 сек)
   */
  function simulateAsyncLoad() {
    if (loadingTimerId !== null) {
      window.clearTimeout(loadingTimerId);
    }

    renderState('loading');

    loadingTimerId = window.setTimeout(() => {
      loadingTimerId = null;
      applyFilterAndRender();
    }, 1600);
  }

  /**
   * Фільтрація даних та автоматичний перехід у стан empty за відсутності результатів
   */
  function applyFilterAndRender() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      renderState('empty');
    } else {
      renderCards(filtered);
      renderState('content');
    }
  }

  /**
   * Відновлення початкового списку даних
   */
  function restoreInitialData() {
    items = [...INITIAL_ITEMS];
    searchInput.value = '';
    renderCards(items);
    renderState('content');
  }

  // Обробники панелі швидкого тестування станів
  stateButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (loadingTimerId !== null) {
        window.clearTimeout(loadingTimerId);
        loadingTimerId = null;
      }

      const targetState = btn.dataset.stateBtn;
      if (targetState === 'content') {
        if (items.length === 0) {
          items = [...INITIAL_ITEMS];
        }
        renderCards(items);
      }
      renderState(targetState);
    });
  });

  // Видалення картки через делегування подій
  cardsContainer.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('[data-delete-id]');
    if (!deleteBtn) return;

    const idToRemove = Number(deleteBtn.dataset.deleteId);
    items = items.filter((item) => item.id !== idToRemove);
    applyFilterAndRender();
  });

  // Пошук у реальному часі
  searchInput.addEventListener('input', () => {
    applyFilterAndRender();
  });

  // Кнопки асинхронного оновлення та відновлення
  refreshBtn.addEventListener('click', simulateAsyncLoad);
  retryErrorBtn.addEventListener('click', simulateAsyncLoad);
  resetEmptyBtn.addEventListener('click', restoreInitialData);

  // Перемикання між розділами (Каталог / UI-Kit)
  viewTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetView = tab.dataset.viewTab;

      viewTabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      viewApp.classList.toggle('is-hidden', targetView !== 'app');
      viewUikit.classList.toggle('is-hidden', targetView !== 'uikit');
    });
  });

  // Перемикання світлої та темної теми через атрибут data-theme
  themeToggleBtn.addEventListener('click', () => {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';

    root.setAttribute('data-theme', nextTheme);
    themeToggleBtn.textContent = nextTheme === 'dark' ? 'Тема: Темна' : 'Тема: Світла';
  });

  // Початкова ініціалізація
  renderCards(items);
  renderState('content');
})();