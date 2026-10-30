/**
 * VETRI AUTO CAR GARAGE - Core Application Script
 * Interactive Showroom Logic, Filtering, Dynamic Car Rendering & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // State management for filters
  const state = {
    searchQuery: '',
    selectedBrand: 'all',
    selectedPriceRange: 'all',
    sortBy: 'default',
    cars: [...luxuryCarsData]
  };

  // Image fallback helper
  const FALLBACK_IMAGE = 'assets/images/car-fallback.svg';

  window.handleImgError = function(img) {
    img.onerror = null;
    img.src = FALLBACK_IMAGE;
  };

  /* ==========================================================================
     1. Navigation & Header Logic
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('navMenu');
  const navToggleBtn = document.getElementById('navToggleBtn');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Navbar shadow effect on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy for active nav link
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile menu toggle
  if (navToggleBtn && navMenu) {
    navToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = navToggleBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = navToggleBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  /* ==========================================================================
     2. WhatsApp & Phone Link Helpers
     ========================================================================== */
  function getWhatsAppUrl(message) {
    return `https://wa.me/${showroomConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  window.enquireWhatsApp = function(carId) {
    const car = luxuryCarsData.find(c => c.id === carId);
    if (!car) return;
    const msg = `Hello Vetri Auto Car Garage! I am interested in inquiring about the ${car.brand} ${car.model} (${car.year}) priced at ${car.priceDisplay}. Please provide availability and financing options.`;
    window.open(getWhatsAppUrl(msg), '_blank');
  };

  window.openBestPriceModal = function(carId) {
    const car = luxuryCarsData.find(c => c.id === carId);
    const modal = document.getElementById('bestPriceModal');
    if (!modal) return;

    const brandSelect = document.getElementById('quoteBrand');
    const modelInput = document.getElementById('quoteModel');
    const priceDisplay = document.getElementById('quoteCarPrice');
    const carTitle = document.getElementById('quoteCarTitle');

    if (car) {
      if (brandSelect) brandSelect.value = car.brand;
      if (modelInput) modelInput.value = car.model;
      if (priceDisplay) priceDisplay.textContent = car.priceDisplay;
      if (carTitle) carTitle.textContent = `${car.brand} ${car.model} (${car.year})`;
    } else {
      if (carTitle) carTitle.textContent = "Luxury Vehicle Best Price Request";
      if (priceDisplay) priceDisplay.textContent = "Personalized Offer";
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.openCarDetails = function(carId) {
    const car = luxuryCarsData.find(c => c.id === carId);
    if (!car) return;

    const modal = document.getElementById('carDetailsModal');
    const container = document.getElementById('carDetailsContent');
    if (!modal || !container) return;

    container.innerHTML = `
      <div class="modal-hero-img-wrap">
        <img src="${car.image}" alt="${car.brand} ${car.model}" onerror="handleImgError(this)" />
      </div>
      <div class="modal-content-body">
        <div class="modal-title-row">
          <div>
            <div class="card-brand-badge" style="position:static; display:inline-block; margin-bottom:0.4rem; background:#5B21B6;">${car.brand} &bull; ${car.year}</div>
            <h2 class="modal-car-title">${car.model}</h2>
            <div class="modal-car-variant">${car.variant}</div>
          </div>
          <div class="modal-price-box">
            <span class="price-label-small">Showroom Price</span>
            <div class="modal-price-amount">${car.priceDisplay}</div>
          </div>
        </div>

        <p class="about-paragraph" style="margin-bottom: 1.25rem;">${car.description}</p>

        <h4 style="font-family: var(--font-heading); color: var(--dark-purple); margin-bottom: 0.75rem; font-size: 1.15rem;">
          <i class="fa-solid fa-gauge-high" style="color:var(--primary-purple); margin-right: 0.4rem;"></i>
          Technical Specifications
        </h4>

        <table class="modal-specs-table">
          <tbody>
            <tr>
              <td class="modal-specs-label">Engine & Fuel</td>
              <td>${car.engine} (${car.fuelType})</td>
            </tr>
            <tr>
              <td class="modal-specs-label">Power & Torque</td>
              <td>${car.power} | ${car.torque}</td>
            </tr>
            <tr>
              <td class="modal-specs-label">Acceleration & Speed</td>
              <td>${car.acceleration} | Top Speed: ${car.topSpeed}</td>
            </tr>
            <tr>
              <td class="modal-specs-label">Transmission</td>
              <td>${car.transmission}</td>
            </tr>
            <tr>
              <td class="modal-specs-label">Drivetrain & Seating</td>
              <td>${car.drivetrain} | ${car.seating}</td>
            </tr>
            <tr>
              <td class="modal-specs-label">Certified Mileage</td>
              <td>${car.mileage}</td>
            </tr>
          </tbody>
        </table>

        <h4 style="font-family: var(--font-heading); color: var(--dark-purple); margin: 1.5rem 0 0.75rem 0; font-size: 1.15rem;">
          <i class="fa-solid fa-star" style="color:var(--gold-accent); margin-right: 0.4rem;"></i>
          Key Luxury Features
        </h4>

        <div class="modal-features-list">
          ${car.features.map(f => `
            <div class="modal-feature-item">
              <i class="fa-solid fa-circle-check"></i>
              <span>${f}</span>
            </div>
          `).join('')}
        </div>

        <div class="modal-actions-bar">
          <button class="btn btn-whatsapp btn-lg" onclick="enquireWhatsApp('${car.id}')">
            <i class="fa-brands fa-whatsapp"></i> Instant WhatsApp Enquiry
          </button>
          <button class="btn btn-primary btn-lg" onclick="closeAllModals(); openBestPriceModal('${car.id}')">
            <i class="fa-solid fa-tag"></i> Get Best Price Quote
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeAllModals = function() {
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  };

  // Close modals when clicking backdrop or close buttons
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  /* ==========================================================================
     3. Render Exclusive Luxury Collection (3 Large Featured Cards)
     ========================================================================== */
  function renderFeaturedCars() {
    const container = document.getElementById('featuredCarsGrid');
    if (!container) return;

    // Mercedes-Benz, BMW, Lamborghini as requested in Item 8
    const featuredBrands = ['Mercedes-Benz', 'BMW', 'Lamborghini'];
    const featuredCars = [];

    featuredBrands.forEach(brand => {
      const match = luxuryCarsData.find(c => c.brand === brand && c.featured);
      if (match) featuredCars.push(match);
      else {
        // fallback to any car of that brand
        const anyCar = luxuryCarsData.find(c => c.brand === brand);
        if (anyCar) featuredCars.push(anyCar);
      }
    });

    container.innerHTML = featuredCars.map(car => `
      <div class="featured-card">
        <div class="card-ribbon">EXCLUSIVE SPOTLIGHT</div>
        <div class="card-brand-badge">${car.brand}</div>
        <div class="featured-img-wrap">
          <img src="${car.image}" alt="${car.brand} ${car.model}" loading="lazy" onerror="handleImgError(this)" />
        </div>
        <div class="featured-card-body">
          <div class="card-title-row">
            <h3 class="card-title">${car.model}</h3>
            <span class="card-variant">${car.variant}</span>
          </div>
          <div class="card-specs-row">
            <div class="spec-item">
              <span class="spec-label">Year</span>
              <span class="spec-val">${car.year}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Fuel</span>
              <span class="spec-val">${car.fuelType.split(' ')[0]}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Speed</span>
              <span class="spec-val">${car.topSpeed}</span>
            </div>
          </div>
          <div class="card-price-row">
            <span class="price-label-small">Estimated Price</span>
            <span class="price-amount">${car.priceDisplay}</span>
          </div>
          <div class="card-actions-row">
            <button class="btn btn-outline-purple btn-sm" onclick="openCarDetails('${car.id}')">
              <i class="fa-solid fa-eye"></i> View Details
            </button>
            <button class="btn btn-whatsapp btn-sm" onclick="enquireWhatsApp('${car.id}')">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  /* ==========================================================================
     4. Render Luxury Car Collection Grid (Searchable & Filterable)
     ========================================================================== */
  function renderCarsGrid() {
    const container = document.getElementById('carsGrid');
    const resultCount = document.getElementById('resultCount');
    if (!container) return;

    let filtered = [...luxuryCarsData];

    // Filter by Search Query
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(car => 
        car.brand.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q) ||
        car.variant.toLowerCase().includes(q) ||
        car.fuelType.toLowerCase().includes(q) ||
        car.category.toLowerCase().includes(q)
      );
    }

    // Filter by Brand
    if (state.selectedBrand !== 'all') {
      filtered = filtered.filter(car => car.brand.toLowerCase() === state.selectedBrand.toLowerCase());
    }

    // Filter by Price Range
    if (state.selectedPriceRange !== 'all') {
      if (state.selectedPriceRange === 'under-1cr') {
        filtered = filtered.filter(car => car.priceRaw < 10000000);
      } else if (state.selectedPriceRange === '1cr-3cr') {
        filtered = filtered.filter(car => car.priceRaw >= 10000000 && car.priceRaw <= 30000000);
      } else if (state.selectedPriceRange === '3cr-5cr') {
        filtered = filtered.filter(car => car.priceRaw > 30000000 && car.priceRaw <= 50000000);
      } else if (state.selectedPriceRange === 'above-5cr') {
        filtered = filtered.filter(car => car.priceRaw > 50000000);
      }
    }

    // Sorting
    if (state.sortBy === 'price-low') {
      filtered.sort((a, b) => a.priceRaw - b.priceRaw);
    } else if (state.sortBy === 'price-high') {
      filtered.sort((a, b) => b.priceRaw - a.priceRaw);
    } else if (state.sortBy === 'brand-asc') {
      filtered.sort((a, b) => a.brand.localeCompare(b.brand));
    }

    if (resultCount) {
      resultCount.innerHTML = `<span>${filtered.length}</span> luxury cars available`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="no-cars-message">
          <i class="fa-solid fa-car-side"></i>
          <h3 style="font-family: var(--font-heading); color: var(--dark-purple); margin-bottom: 0.5rem;">No vehicles found matching your criteria</h3>
          <p style="color: var(--muted-text); margin-bottom: 1.25rem;">Try adjusting your search terms or clearing the active filters.</p>
          <button class="btn btn-primary" onclick="resetAllFilters()">
            <i class="fa-solid fa-rotate-left"></i> View All Luxury Cars
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(car => `
      <div class="car-card">
        <div class="car-card-img-wrap">
          <span class="car-badge">${car.category}</span>
          <span class="car-year-badge">${car.year}</span>
          <img src="${car.image}" alt="${car.brand} ${car.model}" loading="lazy" onerror="handleImgError(this)" />
        </div>
        <div class="car-card-body">
          <div class="car-card-brand">${car.brand}</div>
          <h3 class="car-card-title">${car.model}</h3>
          <div class="car-card-variant">${car.variant}</div>
          
          <div class="car-card-specs">
            <div class="card-spec-item" title="Fuel Type">
              <i class="fa-solid fa-gas-pump"></i>
              <span>${car.fuelType.split('/')[0].trim()}</span>
            </div>
            <div class="card-spec-item" title="Transmission">
              <i class="fa-solid fa-gears"></i>
              <span>${car.transmission.split(' ')[0]}</span>
            </div>
            <div class="card-spec-item" title="Acceleration">
              <i class="fa-solid fa-bolt"></i>
              <span>${car.acceleration.split('in')[1] || car.acceleration}</span>
            </div>
          </div>

          <div class="car-card-price-row">
            <span class="price-label-small">Showroom Price</span>
            <span class="car-price-tag">${car.priceDisplay}</span>
          </div>

          <div class="car-card-btns">
            <button class="btn btn-outline-purple btn-sm" onclick="openCarDetails('${car.id}')">
              <i class="fa-solid fa-eye"></i> View Details
            </button>
            <button class="btn btn-whatsapp btn-sm" onclick="enquireWhatsApp('${car.id}')">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  /* ==========================================================================
     5. Render Car Price List Table
     ========================================================================== */
  function renderPriceList() {
    const tableBody = document.getElementById('priceTableBody');
    if (!tableBody) return;

    // Sort by price ascending initially or preserve order
    tableBody.innerHTML = luxuryCarsData.map(car => `
      <tr>
        <td>
          <div class="table-car-cell">
            <img class="table-car-thumb" src="${car.image}" alt="${car.brand} ${car.model}" onerror="handleImgError(this)" />
            <div class="table-car-info">
              <span class="table-car-name">${car.model}</span>
              <span class="table-car-sub">${car.variant}</span>
            </div>
          </div>
        </td>
        <td>
          <span class="table-badge">${car.brand}</span>
        </td>
        <td>${car.fuelType}</td>
        <td>${car.transmission}</td>
        <td>
          <span class="table-price">${car.priceDisplay}</span>
        </td>
        <td style="text-align: right;">
          <div style="display: inline-flex; gap: 0.45rem;">
            <button class="btn btn-primary btn-sm" onclick="openBestPriceModal('${car.id}')">
              <i class="fa-solid fa-tag"></i> Get Best Price
            </button>
            <button class="btn btn-whatsapp btn-sm" onclick="enquireWhatsApp('${car.id}')" title="WhatsApp Enquiry">
              <i class="fa-brands fa-whatsapp"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  /* ==========================================================================
     6. Render Latest Arrivals
     ========================================================================== */
  function renderLatestArrivals() {
    const container = document.getElementById('latestArrivalsGrid');
    if (!container) return;

    const arrivals = luxuryCarsData.filter(c => c.latestArrival);

    container.innerHTML = arrivals.map(car => `
      <div class="car-card">
        <div class="car-card-img-wrap">
          <span class="car-badge" style="background:var(--primary-purple);">NEW ARRIVAL</span>
          <span class="car-year-badge">${car.year}</span>
          <img src="${car.image}" alt="${car.brand} ${car.model}" loading="lazy" onerror="handleImgError(this)" />
        </div>
        <div class="car-card-body">
          <div class="car-card-brand">${car.brand}</div>
          <h3 class="car-card-title">${car.model}</h3>
          <div class="car-card-variant">${car.variant}</div>
          
          <div class="car-card-specs">
            <div class="card-spec-item">
              <i class="fa-solid fa-gas-pump"></i>
              <span>${car.fuelType.split('/')[0].trim()}</span>
            </div>
            <div class="card-spec-item">
              <i class="fa-solid fa-gears"></i>
              <span>${car.transmission.split(' ')[0]}</span>
            </div>
            <div class="card-spec-item">
              <i class="fa-solid fa-bolt"></i>
              <span>${car.acceleration.split('in')[1] || car.acceleration}</span>
            </div>
          </div>

          <div class="car-card-price-row">
            <span class="price-label-small">Intro Price</span>
            <span class="car-price-tag">${car.priceDisplay}</span>
          </div>

          <div class="car-card-btns">
            <button class="btn btn-outline-purple btn-sm" onclick="openCarDetails('${car.id}')">
              <i class="fa-solid fa-eye"></i> Details
            </button>
            <button class="btn btn-whatsapp btn-sm" onclick="enquireWhatsApp('${car.id}')">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  /* ==========================================================================
     7. Render Gallery Section & Lightbox
     ========================================================================== */
  function renderGallery() {
    const container = document.getElementById('galleryGrid');
    if (!container) return;

    container.innerHTML = galleryShowcase.map(item => `
      <div class="gallery-item" onclick="openGalleryLightbox('${item.image}', '${item.title}', '${item.brand}')">
        <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="handleImgError(this)" />
        <div class="gallery-overlay">
          <span class="gallery-tag">${item.tag}</span>
          <div class="gallery-item-title">${item.title}</div>
        </div>
        <div class="gallery-zoom-icon">
          <i class="fa-solid fa-expand"></i>
        </div>
      </div>
    `).join('');
  }

  window.openGalleryLightbox = function(imgSrc, title, brand) {
    const modal = document.getElementById('galleryModal');
    const imgEl = document.getElementById('lightboxImg');
    const captionEl = document.getElementById('lightboxCaption');
    if (!modal || !imgEl) return;

    imgEl.src = imgSrc;
    if (captionEl) captionEl.textContent = `${title} (${brand})`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  /* ==========================================================================
     8. Render Testimonials
     ========================================================================== */
  function renderTestimonials() {
    const container = document.getElementById('testimonialsGrid');
    if (!container) return;

    container.innerHTML = customerTestimonials.map(t => `
      <div class="testimonial-card">
        <div>
          <div class="test-stars">
            ${Array(t.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
          </div>
          <p class="test-text">"${t.text}"</p>
        </div>
        <div class="test-author-row">
          <div class="test-avatar">${t.name.charAt(0)}</div>
          <div class="test-meta">
            <h5>${t.name}</h5>
            <p>${t.role}</p>
            <span class="test-car-pill"><i class="fa-solid fa-car"></i> ${t.car}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  /* ==========================================================================
     9. Filter & Search Event Handlers
     ========================================================================== */
  const searchInput = document.getElementById('carSearchInput');
  const brandFilter = document.getElementById('brandFilter');
  const priceRangeFilter = document.getElementById('priceRangeFilter');
  const sortPriceSelect = document.getElementById('sortPriceSelect');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const brandPills = document.querySelectorAll('.brand-pill');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderCarsGrid();
    });
  }

  if (brandFilter) {
    brandFilter.addEventListener('change', (e) => {
      state.selectedBrand = e.target.value;
      updateBrandPills(e.target.value);
      renderCarsGrid();
    });
  }

  if (priceRangeFilter) {
    priceRangeFilter.addEventListener('change', (e) => {
      state.selectedPriceRange = e.target.value;
      renderCarsGrid();
    });
  }

  if (sortPriceSelect) {
    sortPriceSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderCarsGrid();
    });
  }

  brandPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const brand = pill.getAttribute('data-brand');
      state.selectedBrand = brand;
      if (brandFilter) brandFilter.value = brand;
      updateBrandPills(brand);
      renderCarsGrid();
    });
  });

  function updateBrandPills(activeBrand) {
    brandPills.forEach(pill => {
      if (pill.getAttribute('data-brand') === activeBrand) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  window.resetAllFilters = function() {
    state.searchQuery = '';
    state.selectedBrand = 'all';
    state.selectedPriceRange = 'all';
    state.sortBy = 'default';

    if (searchInput) searchInput.value = '';
    if (brandFilter) brandFilter.value = 'all';
    if (priceRangeFilter) priceRangeFilter.value = 'all';
    if (sortPriceSelect) sortPriceSelect.value = 'default';

    updateBrandPills('all');
    renderCarsGrid();
  };

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetAllFilters);
  }

  /* ==========================================================================
     10. Contact Form & Best Price Form Submission Handlers
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const brand = document.getElementById('contactBrand').value;
      const model = document.getElementById('contactModel').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !phone) {
        if (contactStatus) {
          contactStatus.className = 'form-status error';
          contactStatus.textContent = 'Please enter your Full Name and Mobile Number.';
        }
        return;
      }

      // Format WhatsApp prefill message
      const formattedMessage = `*New Customer Enquiry - Vetri Auto Car Garage*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Email:* ${encodeURIComponent(email || 'Not provided')}%0A*Brand:* ${encodeURIComponent(brand || 'Any')}%0A*Model:* ${encodeURIComponent(model || 'Any')}%0A*Message:* ${encodeURIComponent(message || 'I would like to receive details on luxury cars.')}`;

      if (contactStatus) {
        contactStatus.className = 'form-status success';
        contactStatus.innerHTML = `
          <strong>Thank you, ${name}!</strong> Your enquiry has been registered.<br/>
          Click below to send your details directly to our WhatsApp support:
          <div style="margin-top: 0.5rem;">
            <a href="https://wa.me/${showroomConfig.whatsappNumber}?text=${formattedMessage}" target="_blank" class="btn btn-whatsapp btn-sm">
              <i class="fa-brands fa-whatsapp"></i> Send via WhatsApp (+91 81247 82474)
            </a>
          </div>
        `;
      }

      contactForm.reset();
    });
  }

  // Best Price Modal Form
  const bestPriceForm = document.getElementById('bestPriceForm');
  const quoteStatus = document.getElementById('quoteStatus');

  if (bestPriceForm) {
    bestPriceForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('quoteName').value.trim();
      const phone = document.getElementById('quotePhone').value.trim();
      const brand = document.getElementById('quoteBrand').value;
      const model = document.getElementById('quoteModel').value;
      const note = document.getElementById('quoteNotes').value.trim();

      if (!name || !phone) {
        if (quoteStatus) {
          quoteStatus.className = 'form-status error';
          quoteStatus.textContent = 'Please provide your name and phone number.';
        }
        return;
      }

      const waMsg = `*Best Price Quote Request*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Interested Vehicle:* ${encodeURIComponent(brand)} - ${encodeURIComponent(model)}%0A*Notes:* ${encodeURIComponent(note || 'Please share lowest on-road quote')}`;

      if (quoteStatus) {
        quoteStatus.className = 'form-status success';
        quoteStatus.innerHTML = `
          <strong>Request Received!</strong><br/>
          Our Coimbatore luxury concierge will call you shortly. You can also chat directly:
          <div style="margin-top: 0.6rem;">
            <a href="https://wa.me/${showroomConfig.whatsappNumber}?text=${waMsg}" target="_blank" class="btn btn-whatsapp btn-sm">
              <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp Now
            </a>
          </div>
        `;
      }

      setTimeout(() => {
        bestPriceForm.reset();
      }, 3000);
    });
  }

  // Populate brand dropdowns
  function populateBrandSelects() {
    const brands = [...new Set(luxuryCarsData.map(c => c.brand))].sort();
    const selects = [document.getElementById('contactBrand'), document.getElementById('quoteBrand')];

    selects.forEach(select => {
      if (!select) return;
      // Keep first option (All / Select)
      const firstOpt = select.firstElementChild;
      select.innerHTML = '';
      if (firstOpt) select.appendChild(firstOpt);

      brands.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b;
        opt.textContent = b;
        select.appendChild(opt);
      });
    });
  }

  /* ==========================================================================
     11. Initialize All Components
     ========================================================================== */
  populateBrandSelects();
  renderFeaturedCars();
  renderCarsGrid();
  renderPriceList();
  renderLatestArrivals();
  renderGallery();
  renderTestimonials();

  console.log("Vetri Auto Car Garage showroom initialized successfully.");
});

