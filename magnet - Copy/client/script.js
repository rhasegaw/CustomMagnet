const products = [
  {
    key: "5pack",
    title: "5 pack",
    options: [
      { qty: 5, price: 2400 },
      { qty: 9, price: 3800 },
      { qty: 50, price: 14900 }
    ]
  },
  {
    key: "9pack",
    title: "9 pack",
    options: [
      { qty: 5, price: 2400 },
      { qty: 9, price: 3800 },
      { qty: 50, price: 14900 }
    ]
  },
  {
    key: "50pack",
    title: "50 pack",
    options: [
      { qty: 5, price: 2400 },
      { qty: 9, price: 3800 },
      { qty: 50, price: 14900 }
    ]
  }
];

// Generate product cards on homepage
function generateHome() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  products.forEach(p => {
    grid.insertAdjacentHTML("beforeend", `
      <div class="product-card">
        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1IiBzdHJva2U9IiNkZGQiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7oorflk4E8L3RleHQ+PC9zdmc+" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>From ¥${p.options[0].price.toLocaleString()}</p>
        <button onclick="location.href='product.html?key=${p.key}'">詳細を見る</button>
      </div>
    `);
  });
}

// Global cropper variable
let cropper = null;
let imageUploaded = false;

// Set up product page
function setupProduct() {
  const key = new URLSearchParams(location.search).get("key");
  const prod = products.find(p => p.key === key);
  if (!prod) return;

  console.log("Setting up product:", prod.title);

  // Set title
  document.getElementById("prod-title").innerText = prod.title;
  
  const priceElem = document.getElementById("prod-price");
  const qtyDisplay = document.getElementById("selected-qty");
  const btnContainer = document.getElementById("qty-buttons");

  // Clear existing buttons
  btnContainer.innerHTML = "";

  // Create quantity buttons
  prod.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.innerText = `${option.qty}個`;
    btn.className = "qty-btn";
    btn.dataset.qty = option.qty;
    btn.dataset.price = option.price;
    
    btn.onclick = () => {
      // Update price and quantity display
      priceElem.innerText = `¥${option.price.toLocaleString()}`;
      qtyDisplay.innerText = option.qty;
      
      // Update button states
      btnContainer.querySelectorAll(".qty-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      
      console.log(`Selected: ${option.qty} for ¥${option.price}`);
    };
    
    btnContainer.appendChild(btn);
    
    // Select first button by default
    if (index === 0) {
      setTimeout(() => btn.click(), 100);
    }
  });

  // Setup image upload and cropping
  setupImageCropper();

  // Checkout button
  document.getElementById("checkout-button").onclick = () => {
    const qty = qtyDisplay.innerText;
    const cartIcon = document.querySelector(".icon-cart");
    if (cartIcon) cartIcon.innerText = `🛒 (${qty})`;
    alert(`デモ購入：${prod.title} × ${qty}個`);
  };
}

// Setup image cropper functionality
function setupImageCropper() {
  const img = document.getElementById("crop-image");
  const uploadInput = document.getElementById("upload-product-image");
  const cropButton = document.getElementById("crop-button");

  // File upload handler
  uploadInput.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("画像ファイルを選択してください。");
      return;
    }

    console.log("File selected:", file.name);

    // Destroy existing cropper
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }

    // Create FileReader to load image
    const reader = new FileReader();
    reader.onload = function(e) {
      img.src = e.target.result;
      console.log("Image loaded via FileReader");
      
      // Initialize cropper after image loads
      img.onload = function() {
        console.log("Image element loaded, initializing cropper");
        
        try {
          cropper = new Cropper(img, {
            aspectRatio: 1,
            viewMode: 1,
            responsive: true,
            autoCropArea: 0.8,
            ready: function() {
              console.log("Cropper ready");
              imageUploaded = true;
            }
          });
        } catch (error) {
          console.error("Cropper initialization failed:", error);
          alert("画像処理の初期化に失敗しました。");
        }
      };
    };
    
    reader.readAsDataURL(file);
  };

  // Crop button handler
  cropButton.onclick = function() {
    console.log("Crop button clicked");
    
    if (!cropper || !imageUploaded) {
      alert("まず画像をアップロードしてください。");
      return;
    }

    try {
      const canvas = cropper.getCroppedCanvas({
        width: 400,
        height: 400
      });

      if (canvas) {
        // Replace image with cropped version
        img.src = canvas.toDataURL('image/jpeg', 0.9);
        
        // Destroy cropper
        cropper.destroy();
        cropper = null;
        imageUploaded = false;
        
        console.log("Image cropped successfully");
        alert("画像がトリミングされました！");
      }
    } catch (error) {
      console.error("Cropping failed:", error);
      alert("トリミングに失敗しました。");
    }
  };
}

// Newsletter subscription alert
function setupNewsletter() {
  const form = document.getElementById("newsletter");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    alert("Thanks for subscribing!");
  });
}

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing...");
  generateHome();
  setupProduct();
  setupNewsletter();
});