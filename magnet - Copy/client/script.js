const products = [
  {
    key: "custom-photo-magnets-2x2",
    title: "2\"x2\" Custom Photo Magnets",
    description: "Custom 2\"x2\" square magnets. Please consider using the highest resolution photos for the best results!",
    options: [
      { qty: 5, price: 2499, label: "5 Pack" },
      { qty: 9, price: 3899, label: "9 Pack" },
      { qty: 50, price: 14999, label: "50 Pack" }
    ]
  },
  {
    key: "dummy1",
    title: "Premium Photo Magnets",
    description: "High quality premium photo magnets with glossy finish.",
    options: [
      { qty: 3, price: 1999, label: "3 Pack" },
      { qty: 6, price: 3499, label: "6 Pack" },
      { qty: 25, price: 12999, label: "25 Pack" }
    ]
  },
  {
    key: "dummy2",
    title: "Mini Magnet Collection",
    description: "Adorable mini magnets perfect for small photos and memories.",
    options: [
      { qty: 10, price: 2299, label: "10 Pack" },
      { qty: 20, price: 4199, label: "20 Pack" },
      { qty: 100, price: 15999, label: "100 Pack" }
    ]
  },
  {
    key: "dummy3",
    title: "Jumbo Photo Magnets",
    description: "Extra large magnets for maximum impact and visibility.",
    options: [
      { qty: 2, price: 2799, label: "2 Pack" },
      { qty: 5, price: 5999, label: "5 Pack" },
      { qty: 20, price: 19999, label: "20 Pack" }
    ]
  }
];

// Generate product cards on homepage
function generateHome() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  products.forEach(p => {
    const minPrice = Math.min(...p.options.map(o => o.price));
    grid.insertAdjacentHTML("beforeend", `
      <div class="product-card">
        <div class="product-image">
          <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjlmOWY5IiBzdHJva2U9IiNlMGUwZTAiIHN0cm9rZS13aWR0aD0iMSIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DdXN0b20gUGhvdG88L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1hZ25ldDwvdGV4dD48L3N2Zz4=" alt="${p.title}">
        </div>
        <div class="product-info">
          <h3>${p.title}</h3>
          <p class="product-price">From $${(minPrice/100).toFixed(2)} USD</p>
          <button class="product-btn" onclick="location.href='product.html?key=${p.key}'">詳細を見る</button>
        </div>
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

  // Set title and description
  document.getElementById("prod-title").innerText = prod.title;
  
  const priceElem = document.getElementById("prod-price");
  const qtyDisplay = document.getElementById("selected-qty");
  const btnContainer = document.getElementById("qty-buttons");

  // Clear existing buttons
  btnContainer.innerHTML = "";

  // Create quantity buttons
  prod.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.innerText = option.label;
    btn.className = "qty-btn";
    btn.dataset.qty = option.qty;
    btn.dataset.price = option.price;
    
    btn.onclick = () => {
      // Update price and quantity display
      priceElem.innerText = `$${(option.price/100).toFixed(2)} USD`;
      qtyDisplay.innerText = option.qty;
      
      // Update button states
      btnContainer.querySelectorAll(".qty-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      
      console.log(`Selected: ${option.qty} for $${(option.price/100).toFixed(2)}`);
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
    const price = priceElem.innerText;
    const cartIcon = document.querySelector(".icon-cart");
    if (cartIcon) cartIcon.innerText = `🛒 (${qty})`;
    alert(`デモ購入：${prod.title} × ${qty}個 - ${price}`);
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
