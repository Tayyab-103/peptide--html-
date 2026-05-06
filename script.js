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

const faqData = [
  {
    question: "How is PureOne tested and verified?",
    answer:
      "Every batch of PureOne undergoes rigorous testing including HPLC analysis, mass spectrometry, and sterility testing. A full lab certificate of analysis is included with every order, detailing purity, potency, and quality metrics.",
  },
  {
    question: "What is the shelf life?",
    answer:
      "PureOne has a shelf life of 2 years when stored properly in a cool, dark place. Our UV-protected vials maintain stability and potency throughout this entire period. We recommend storing at 2-8°C for optimal preservation.",
  },
  {
    question: "How quickly does it ship?",
    answer:
      "Orders ship within 48 hours of confirmation. We offer both standard and priority shipping options. All packages are discreetly labeled and packaged for privacy. Domestic delivery typically takes 2-4 business days.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship worldwide with customs-compliant packaging. International orders may take 7-14 business days depending on destination. We handle all customs documentation and ensure compliance with local regulations.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not satisfied with your order for any reason, contact our support team for a full refund. No questions asked. We stand behind the quality of our products.",
  },
  {
    question: "Is my order private and secure?",
    answer:
      "Absolutely. All orders are processed through encrypted secure checkout. Packages are labeled discreetly with no product names visible. We never share customer information with third parties and delete all data after 90 days.",
  },
];

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
  initializeFAQ();
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
// FAQ ACCORDION
// ============================================
// function initializeFAQ() {
//     const faqItems = document.querySelectorAll('.faq-item');

//     faqItems.forEach((item, index) => {
//         const question = item.querySelector('.faq-question');
//         const answer = item.querySelector('.faq-answer');

//         // Set answer content from data
//         if (faqData[index]) {
//             answer.innerHTML = `<p>${faqData[index].answer}</p>`;
//         }

//         question.addEventListener('click', function() {
//             const isOpen = answer.classList.contains('show');

//             // Close all other FAQs
//             document.querySelectorAll('.faq-answer').forEach(a => {
//                 a.classList.remove('show');
//             });
//             document.querySelectorAll('.faq-question').forEach(q => {
//                 q.classList.remove('active');
//             });

//             // Toggle current FAQ
//             if (!isOpen) {
//                 answer.classList.add('show');
//                 question.classList.add('active');
//             }
//         });
//     });
// }

function initializeFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", function () {
      const isOpen = answer.classList.contains("show");

      // Close all
      document.querySelectorAll(".faq-answer").forEach((a) => {
        a.classList.remove("show");
      });

      document.querySelectorAll(".faq-question").forEach((q) => {
        q.classList.remove("active");
      });

      // Open current
      if (!isOpen) {
        answer.classList.add("show");
        question.classList.add("active");
      }
    });
  });
}

// ============================================
// DISCOUNT PEEK & MODAL
// ============================================
function setupDiscountPeek() {
  // Show peek after 5 seconds
  setTimeout(() => {
    const peek = document.getElementById("discountPeek");
    if (peek) {
      peek.classList.add("show");
    }
  }, 5000);

  // Countdown timer
  startCountdown();
}

function closePeek() {
  const peek = document.getElementById("discountPeek");
  if (peek) {
    peek.classList.remove("show");
  }
}

function openDiscountModal() {
  const modal = document.getElementById("discountModal");
  if (modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
}

function closeDiscountModal() {
  const modal = document.getElementById("discountModal");
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "auto";
  }
}

function startCountdown() {
  let hours = 24;
  const countdownEl = document.getElementById("countdown");

  setInterval(() => {
    hours--;
    if (countdownEl) {
      countdownEl.textContent = hours > 0 ? hours : "0";
    }
  }, 3600000); // Update every hour
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
