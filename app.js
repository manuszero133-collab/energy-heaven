// 晶語水晶 - 前端邏輯 (localStorage)
const STORAGE_KEY = 'crystal_shop_products';

// 預設商品
const defaultProducts = [
  {
    id: 1,
    name: '紫水晶簇',
    description: '天然紫水晶簇，有助於平靜心靈、提升直覺與療癒情緒。',
    price: 680,
    image: 'images/amethyst.jpg',
    category: '療癒水晶'
  },
  {
    id: 2,
    name: '粉晶愛心',
    description: '溫柔的粉晶愛心，象徵愛情與自我關愛，帶來溫暖能量。',
    price: 320,
    image: 'images/rose-quartz.jpg',
    category: '愛情水晶'
  },
  {
    id: 3,
    name: '白水晶柱',
    description: '純淨白水晶柱，淨化能量、增強專注力與清晰思維。',
    price: 450,
    image: 'images/clear-quartz.jpg',
    category: '淨化水晶'
  },
  {
    id: 4,
    name: '黃水晶簇',
    description: '明亮黃水晶，吸引財富與正能量，提升自信與喜悅。',
    price: 580,
    image: 'images/citrine.jpg',
    category: '財富水晶'
  }
];

// 取得商品
function getProducts() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(stored);
}

// 儲存商品
function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// 渲染商品到首頁
function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const products = getProducts();
  if (products.length === 0) {
    grid.innerHTML = '<p class="empty-msg">目前沒有商品，請到管理後台新增。</p>';
    return;
  }

  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}" class="product-img" onerror="this.src='images/logo.jpg'">
      <div class="product-info">
        <span class="product-category">${p.category || '水晶'}</span>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-price">HK$ ${p.price}</div>
      </div>
    </div>
  `).join('');
}

// 管理後台功能
function renderAdminList() {
  const list = document.getElementById('admin-product-list');
  if (!list) return;

  const products = getProducts();
  if (products.length === 0) {
    list.innerHTML = '<p class="empty-msg">還沒有商品，請新增第一個水晶。</p>';
    return;
  }

  list.innerHTML = products.map(p => `
    <div class="product-item" data-id="${p.id}">
      <img src="${p.image}" alt="${p.name}" onerror="this.src='images/logo.jpg'">
      <div class="info">
        <strong>${p.name}</strong>
        <div>HK$ ${p.price} · ${p.category || ''}</div>
      </div>
      <div class="actions">
        <button class="btn-edit" onclick="editProduct(${p.id})">編輯</button>
        <button class="btn-delete" onclick="deleteProduct(${p.id})">刪除</button>
      </div>
    </div>
  `).join('');
}

function addOrUpdateProduct(e) {
  e.preventDefault();
  const form = e.target;
  const id = form.dataset.editId ? Number(form.dataset.editId) : Date.now();
  const product = {
    id,
    name: form.name.value.trim(),
    description: form.description.value.trim(),
    price: Number(form.price.value),
    image: form.image.value.trim() || 'logo.jpg',
    category: form.category.value.trim() || '水晶'
  };

  if (!product.name || !product.price) {
    alert('請填寫商品名稱與價格');
    return;
  }

  let products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index >= 0) {
    products[index] = product;
  } else {
    products.push(product);
  }
  saveProducts(products);
  form.reset();
  delete form.dataset.editId;
  form.querySelector('button[type="submit"]').textContent = '新增商品';
  renderAdminList();
  alert('已儲存！');
}

function editProduct(id) {
  const products = getProducts();
  const p = products.find(x => x.id === id);
  if (!p) return;

  const form = document.getElementById('product-form');
  form.name.value = p.name;
  form.description.value = p.description;
  form.price.value = p.price;
  form.image.value = p.image;
  form.category.value = p.category || '';
  form.dataset.editId = id;
  form.querySelector('button[type="submit"]').textContent = '更新商品';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deleteProduct(id) {
  if (!confirm('確定要刪除這個商品嗎？')) return;
  let products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
  renderAdminList();
}

// 密碼保護
const SITE_PASSWORD = 'energy2026'; // ← 在這裡修改你的密碼

function checkPassword() {
  const input = document.getElementById('site-password').value;
  if (input === SITE_PASSWORD) {
    sessionStorage.setItem('authenticated', 'true');
    document.getElementById('password-gate').style.display = 'none';
    document.getElementById('main-header').style.display = '';
    document.querySelector('.hero').style.display = '';
    document.querySelector('.products-section').style.display = '';
    document.querySelector('footer').style.display = '';
  } else {
    document.getElementById('pwd-error').style.display = 'block';
  }
}

// 頁面載入時檢查是否已登入
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('authenticated') === 'true') {
    document.getElementById('password-gate').style.display = 'none';
    document.getElementById('main-header').style.display = '';
    document.querySelector('.hero').style.display = '';
    document.querySelector('.products-section').style.display = '';
    document.querySelector('footer').style.display = '';
  } else {
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.products-section').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
  }

  // 原本的初始化
  renderProducts();
  renderAdminList();

  const form = document.getElementById('product-form');
  if (form) {
    form.addEventListener('submit', addOrUpdateProduct);
  }
});

// 按 Enter 也能提交密碼
document.addEventListener('DOMContentLoaded', () => {
  const pwdInput = document.getElementById('site-password');
  if (pwdInput) {
    pwdInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkPassword();
    });
  }
});

