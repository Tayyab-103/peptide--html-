/* ============================================
   PUREONE PEPTIDES - Vanilla JavaScript
   ============================================ */

// ============================================
// DATA MODELS
// ============================================
const tierData = {
  starter: {
    name: "Starter",
    basePrice: 99,
    subscriptionPrice: 89,
    period: "/one-time",
    vials: 1,
  },
  standard: {
    name: "Standard",
    basePrice: 259,
    subscriptionPrice: 233,
    period: "/month",
    vials: 3,
  },
  researcher: {
    name: "Researcher",
    basePrice: 449,
    subscriptionPrice: 404,
    period: "/month",
    vials: 6,
  },
};

// ============================================
// STATE MANAGEMENT
// ============================================
let appState = {
  selectedTier: "standard",
  selectedDosage: "10mg",
  isSubscription: false,
  selectedImage: "/product-hero.jpg",
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  initializeEventListeners();
  initializeViewer();
  setupDiscountPeek();
  updateLiveCounter();

  // Start live counter updates
  setInterval(updateLiveCounter, 3000);
});

// ============================================
//  ANNOUNCEMENT BAR
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  const countdownEl = document.getElementById("countdown");

  if (!countdownEl) return; // prevents errors if element not found

  // ⏳ Set your end time (example: 6 hours from now)
  const endTime = new Date().getTime() + 6 * 60 * 60 * 1000;

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance <= 0) {
      countdownEl.innerText = "00:00:00";
      clearInterval(timer);
      return;
    }

    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    countdownEl.innerText =
      `${hours.toString().padStart(2, "0")}:` +
      `${minutes.toString().padStart(2, "0")}:` +
      `${seconds.toString().padStart(2, "0")}`;
  }

  const timer = setInterval(updateCountdown, 1000);
  updateCountdown();
});

// ============================================
// EVENT LISTENERS
// ============================================
function initializeEventListeners() {
  // Supply tier selection
  document.querySelectorAll("[data-tier]").forEach((card) => {
    card.addEventListener("click", function () {
      selectTier(this.dataset.tier);
    });
  });

  // Dosage buttons
  document.querySelectorAll(".dosage-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      selectDosage(this.dataset.dosage);
    });
  });

  // Subscribe toggle
  const subscribeToggle = document.getElementById("subscribeToggle");
  if (subscribeToggle) {
    subscribeToggle.addEventListener("change", function () {
      appState.isSubscription = this.checked;
      updatePricing();
    });
  }

  // Scroll buttons
  document.getElementById("scrollToSupply").addEventListener("click", () => {
    scrollToElement("supply");
  });

  // Email form
  const emailForm = document.getElementById("emailForm");
  if (emailForm) {
    emailForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert(
        "Thank you for subscribing! Check your email for exclusive offers.",
      );
      this.reset();
    });
  }

  // Checkout button
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const tier = tierData[appState.selectedTier];
      const price = appState.isSubscription
        ? tier.subscriptionPrice
        : tier.basePrice;
      alert(`Proceeding to checkout: ${tier.name} - $${price}${tier.period}`);
    });
  }

  // Navigation links
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        scrollToElement(href.substring(1));
      }
    });
  });
}

// ============================================
// SUPPLY SECTION FUNCTIONS
// ============================================
function selectTier(tier) {
  appState.selectedTier = tier;

  // Update card highlights
  document.querySelectorAll(".supply-card").forEach((card) => {
    card.classList.remove("selected");
    if (card.dataset.tier === tier) {
      card.classList.add("selected");
    }
  });

  // Update button styles
  document.querySelectorAll(".btn-select").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  updatePricing();
}

function selectDosage(dosage) {
  appState.selectedDosage = dosage;

  document.querySelectorAll(".dosage-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");
}

function updatePricing() {
  const tier = tierData[appState.selectedTier];
  const price = appState.isSubscription
    ? tier.subscriptionPrice
    : tier.basePrice;
  const priceText = appState.isSubscription
    ? `$${price}${tier.period}`
    : `$${price}`;

  // Update tier card prices
  for (const [tierKey, tierInfo] of Object.entries(tierData)) {
    const priceElement = document.getElementById(`price-${tierKey}`);
    if (priceElement) {
      const tierPrice = appState.isSubscription
        ? tierInfo.subscriptionPrice
        : tierInfo.basePrice;
      priceElement.textContent = `$${tierPrice}`;
    }
  }

  // Update summary bar
  document.getElementById("selectedTierName").textContent = tier.name;
  document.getElementById("selectedTierPrice").textContent = priceText;
}

// ============================================
// IMAGE GALLERY
// ============================================
function switchImage(src) {
  const mainImage = document.getElementById("mainImage");
  if (mainImage) {
    mainImage.src = src;
    appState.selectedImage = src;
  }
}


// ============================================
// LIVE COUNTER
// ============================================
function updateLiveCounter() {
  const counterEl = document.getElementById("viewerCount");
  if (counterEl) {
    const currentCount = parseInt(counterEl.textContent);
    const change = Math.floor(Math.random() * 10) - 4; // -4 to +5
    const newCount = Math.max(38, Math.min(64, currentCount + change));
    counterEl.textContent = newCount;
  }
}

// ============================================
// 3D VIEWER WITH THREE.JS
// ============================================
function initializeViewer() {
  const canvas = document.getElementById("3dCanvas");
  if (!canvas) return;

  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0f1f);

  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000,
  );
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0x3b82f6, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const rimLight = new THREE.DirectionalLight(0x3b82f6, 0.5);
  rimLight.position.set(-5, 0, 5);
  scene.add(rimLight);

  // Create 3D Vial
  const vialGroup = new THREE.Group();

  // Glass vial body (cylinder)
  const vialGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 32);
  const vialMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe3f2fd,
    transparent: true,
    opacity: 0.7,
    metalness: 0.1,
    roughness: 0.2,
    ior: 1.5,
    thickness: 0.5,
  });
  const vial = new THREE.Mesh(vialGeometry, vialMaterial);
  vialGroup.add(vial);

  // Chrome cap
  const capGeometry = new THREE.CylinderGeometry(0.35, 0.3, 0.3, 32);
  const capMaterial = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    metalness: 0.9,
    roughness: 0.1,
  });
  const cap = new THREE.Mesh(capGeometry, capMaterial);
  cap.position.y = 0.95;
  vialGroup.add(cap);

  // Liquid inside
  const liquidGeometry = new THREE.CylinderGeometry(0.27, 0.27, 1.2, 32);
  const liquidMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0ea5e9,
    transparent: true,
    opacity: 0.6,
    metalness: 0,
    roughness: 0.3,
  });
  const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
  liquid.position.y = -0.1;
  vialGroup.add(liquid);

  // Label
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 256;
  labelCanvas.height = 256;
  const ctx = labelCanvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = "#1e3a8a";
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.fillText("PureOne", 128, 80);
  ctx.font = "16px Arial";
  ctx.fillText("PO-1", 128, 110);
  ctx.fillText("10mg", 128, 140);

  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  const labelGeometry = new THREE.PlaneGeometry(0.5, 0.7);
  const labelMaterial = new THREE.MeshBasicMaterial({ map: labelTexture });
  const label = new THREE.Mesh(labelGeometry, labelMaterial);
  label.position.z = 0.31;
  vialGroup.add(label);

  scene.add(vialGroup);

  // Mouse controls
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  canvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      vialGroup.rotation.y += deltaX * 0.01;
      vialGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  });

  canvas.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Zoom with scroll
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    camera.position.z += e.deltaY * 0.005;
    camera.position.z = Math.max(1.5, Math.min(8, camera.position.z));
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    if (canvas.parentElement) {
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Auto-rotate
    if (!isDragging) {
      vialGroup.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
  }

  animate();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function scrollToElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

// ============================================
// MODAL CLOSE ON BACKDROP CLICK
// ============================================
document.addEventListener("click", function (e) {
  const modal = document.getElementById("discountModal");
  if (e.target === modal) {
    closeDiscountModal();
  }
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeDiscountModal();
    closePeek();
  }
});

console.log("[v0] PureOne Peptides loaded successfully");

// Custom review or testimonials
const testimonials = [
  {
    text: "Outstanding quality and purity. The lab results speak for themselves. Highly recommend to any serious researcher.",
    name: "James Mitchell",
    role: "Research Scientist",
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
  },
  {
    text: "Fast shipping, excellent customer service, and the peptides arrived perfectly packaged. Best source I've found.",
    name: "Dr. Sarah Chen",
    role: "Biochemist",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
  },
  {
    text: "The transparency and attention to detail is remarkable. Every batch is tested and certified. Worth every penny.",
    name: "Dr. Robert Johnson",
    role: "Clinical Researcher",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
  },
  {
    text: "Consistent results across multiple orders. Documentation and quality assurance are top-tier.",
    name: "Emily Carter",
    role: "Lab Technician",
    image:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
  },
  {
    text: "Reliable supplier with verified testing. Makes our research workflow much smoother.",
    name: "Dr. Ahmed Khan",
    role: "Pharmacologist",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop",
  },
  {
    text: "High purity standards and professional handling. One of the most trustworthy sources available.",
    name: "Michael Lee",
    role: "Biomedical Researcher",
    image:
      "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/userImage/userImage1.png",
  },
];

const rows = [
  { start: 0, end: 3, className: "animate-scroll" },
  { start: 3, end: 6, className: "animate-scroll-reverse" },
];

function renderCard(testimonial, index) {
  const stars = Array(5)
    .fill(0)
    .map(
      (_, i) =>
        `<svg key="${i}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star text-transparent fill-yellow-400" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>`,
    )
    .join("");

  return `
            <div key="${index}" class="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 shrink-0 w-[350px]">
                <div class="flex mb-4">
                    ${stars}
                </div>
                <p class="text-neutral-700 text-sm mb-6">${testimonial.text}</p>
                <div class="flex items-center gap-3">
                    <img src="${testimonial.image}" alt="${testimonial.name}" class="w-11 h-11 rounded-full object-cover"/>
                    <div>
                        <p class="font-medium text-neutral-800 text-sm">${testimonial.name}</p>
                        <p class="text-neutral-600 text-sm">${testimonial.role}</p>
                    </div>
                </div>
            </div>
        `;
}

const rowsContainer = document.getElementById("rows-container");

rows.forEach((row, rowIndex) => {
  const rowDiv = document.createElement("div");
  rowDiv.className = "relative overflow-hidden";
  rowDiv.innerHTML = `
            <div class="absolute left-0 top-0 bottom-0 w-28 bg-linear-to-r from-[#FAFAFA] to-transparent z-10 pointer-events-none"></div>
            <div class="absolute right-0 top-0 bottom-0 w-28 bg-linear-to-l from-[#FAFAFA] to-transparent z-10 pointer-events-none"></div>
            <div class="flex gap-6 ${row.className}">
                ${[
                  ...testimonials.slice(row.start, row.end),
                  ...testimonials.slice(row.start, row.end),
                ]
                  .map((testimonial, index) => renderCard(testimonial, index))
                  .join("")}
            </div>
        `;
  rowsContainer.appendChild(rowDiv);
});


// Modal functions for COA
function openModal() {
    const modal = document.getElementById('coaModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    const modal = document.getElementById('coaModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Close when clicking outside
document.getElementById('coaModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Subscription Plan 
let selected = "starter";
let subscribe = true;
 
const prices = { starter: 89, standard: 219, researcher: 379 };
 
const names = {
  starter: "Starter Supply",
  standard: "Standard Supply",
  researcher: "Researcher Supply"
};
 
const subBtn = document.getElementById("subBtn");
const oneBtn = document.getElementById("oneBtn");
 
// ── Toggle ──────────────────────────────────────────────
subBtn.addEventListener("click", () => {
  subscribe = true;
  subBtn.className = "px-5 py-2 rounded-full bg-black text-white text-sm transition-all";
  oneBtn.className  = "px-5 py-2 rounded-full text-sm text-gray-500 transition-all";
  update();
});
 
oneBtn.addEventListener("click", () => {
  subscribe = false;
  oneBtn.className  = "px-5 py-2 rounded-full bg-black text-white text-sm transition-all";
  subBtn.className  = "px-5 py-2 rounded-full text-sm text-gray-500 transition-all";
  update();
});
 
// ── Card selection ───────────────────────────────────────
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    selected = card.dataset.tier;
 
    // Reset all cards
    document.querySelectorAll(".card").forEach(c => {
      c.classList.remove("active", "border-2");
      c.classList.add("border", "border-gray-200");
 
      const chk = c.querySelector(".check");
      if (chk) {
        chk.className = "check w-6 h-6 rounded-full border-2 border-gray-300 shrink-0";
        chk.innerHTML = "";
      }
 
      const btn = c.querySelector("button");
      if (btn) {
        btn.className = "mt-6 w-full py-3 rounded-xl bg-[#efe9df] text-gray-700 text-sm font-medium hover:bg-[#e5ddd0] transition-colors";
        btn.textContent = "Choose " + names[c.dataset.tier].split(" ")[0] + " ›";
      }
    });
 
    // Activate clicked card
    card.classList.add("active", "border-2");
    card.classList.remove("border", "border-gray-200");
 
    const chk = card.querySelector(".check");
    if (chk) {
      chk.className = "check w-6 h-6 rounded-full bg-[#0f4c3a] flex items-center justify-center shrink-0";
      chk.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 5-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
 
    const btn = card.querySelector("button");
    if (btn) {
      btn.className = "mt-6 w-full py-3 rounded-xl bg-[#0f4c3a] text-white text-sm font-medium hover:bg-[#0a3a2c] transition-colors";
      btn.textContent = "Selected ›";
    }
 
    update();
  });
});
 
// ── Update prices & summary ──────────────────────────────
function update() {
  Object.keys(prices).forEach(t => {
    const p = subscribe ? Math.round(prices[t] * 0.9) : prices[t];
    document.getElementById("price-" + t).innerText = "$" + p;
  });
 
  const current = subscribe ? Math.round(prices[selected] * 0.9) : prices[selected];
  document.getElementById("summaryText").innerText = names[selected] + " · $" + current;
}
 
update(); 



// Discount Peek

// Show after 6s
setTimeout(() => {
    document.getElementById("discountPeek").classList.remove("hidden");
}, 3000);

// Open Modal
function openDiscountModal() {
    document.getElementById("discountModal").classList.remove("hidden");
    document.getElementById("discountModal").classList.add("flex");
}

// Close Modal
function closeDiscountModal() {
    document.getElementById("discountModal").classList.add("hidden");
    document.getElementById("discountModal").classList.remove("flex");
}

// Close Peek
function closePeek() {
    document.getElementById("discountPeek").style.display = "none";
}

// Copy Code
function copyCode() {
    navigator.clipboard.writeText("PUREONE25");
    alert("Code Copied!");
}


// ============================================
// FAQ ACCORDION
// ============================================

const faqs = [
    {
        question: "How is the purity of Aurelia Peptides verified?",
        answer: "Every batch undergoes rigorous HPLC (High-Performance Liquid Chromatography) and Mass Spectrometry analysis. We guarantee a minimum purity of 99% and include a batch-specific COA with every research order."
    },
    {
        question: "How should research peptides be stored?",
        answer: "For short-term storage, peptides are stable at room temperature in lyophilized form. For long-term stability, we recommend refrigeration (2-8°C) or freezing (-20°C). Once reconstituted, they must be kept refrigerated and used within 30 days."
    },
    {
        question: "What is the difference between research-grade and medical-grade?",
        answer: "Our products are synthesized to pharmaceutical-grade purity but are designated 'For Research Use Only.' They are intended for laboratory in-vitro and preclinical trials, not for human or animal consumption."
    },
    {
        question: "Do you provide batch-specific lab reports?",
        answer: "Yes. Transparency is our priority. You can access the HPLC/MS reports for your specific batch by scanning the QR code on the vial or entering the batch number in our Research Hub."
    },
    {
        question: "Are the vials shipped with cold packs?",
        answer: "Our peptides are shipped in a lyophilized (freeze-dried) state, which is highly stable during transit. Studies show that purity remains unaffected by standard shipping temperatures; however, we recommend immediate refrigeration upon receipt."
    },
    {
        question: "How is the shipping handled for privacy?",
        answer: "All orders are shipped in plain, discreet packaging. There is no mention of 'peptides' or 'research chemicals' on the exterior label to ensure the security and privacy of your laboratory logistics."
    },
    {
        question: "What does 'Lyophilized' mean?",
        answer: "Lyophilization is a freeze-drying process that removes water while preserving the chemical structure. This results in a stable powder that has a much longer shelf life than liquid-form peptides."
    },
    {
        question: "What payment methods do you accept for research orders?",
        answer: "We accept all major credit cards (Visa, MasterCard, Amex) through secure, encrypted research-tier gateways, as well as bank transfers for institutional wholesale orders."
    }
];

    let open = null;

    document.getElementById('faqs').innerHTML = faqs.map((faq, i) => `
        <div class="bg-slate-50 p-3.5 rounded-lg cursor-pointer transition-all duration-300 border border-slate-200 hover:bg-slate-100 faq-item" data-index="${i}">
            <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-neutral-800">${faq.question}</span>
                <div class="text-slate-400 p-1 rounded transition-colors icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </div>
            </div>
            <div class="grid grid-rows-[0fr] opacity-0 transition-all duration-300 answer">
                <div class="overflow-hidden">
                    <p class="text-sm text-neutral-600 leading-relaxed mt-4">${faq.answer}</p>
                </div>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.faq-item').forEach(item => {
        item.onclick = () => {
            const i = item.dataset.index;
            const answer = item.querySelector('.answer');
            const icon = item.querySelector('.icon');
            
            if (open === i) {
                answer.classList.remove('grid-rows-[1fr]', 'opacity-100');
                answer.classList.add('grid-rows-[0fr]', 'opacity-0');
                icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
                icon.classList.remove('bg-slate-200', 'text-slate-500');
                item.classList.remove('row-span-2');
                open = null;
            } else {
                if (open !== null) {
                    const prev = document.querySelector(`[data-index="${open}"]`);
                    prev.querySelector('.answer').classList.remove('grid-rows-[1fr]', 'opacity-100');
                    prev.querySelector('.answer').classList.add('grid-rows-[0fr]', 'opacity-0');
                    prev.querySelector('.icon').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
                    prev.querySelector('.icon').classList.remove('bg-slate-200', 'text-slate-500');
                    prev.classList.remove('row-span-2');
                }
                answer.classList.add('grid-rows-[1fr]', 'opacity-100');
                answer.classList.remove('grid-rows-[0fr]', 'opacity-0');
                icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>';
                icon.classList.add('bg-slate-200', 'text-slate-500');
                item.classList.add('row-span-2');
                open = i;
            }
        };
    });