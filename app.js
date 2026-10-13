/**
 * DRIVEVAULT - Core Application Logic & Reactive State Engine
 * Production-quality vanilla JavaScript with zero external build requirements.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. STATE STORE & LOCAL STORAGE INITIALIZATION
  // =========================================================================
  const STATE = {
    fleet: [],
    locations: LOCATIONS || [],
    offers: SPECIAL_OFFERS || [],
    reviews: REVIEWS || [],
    faq: FAQ_ITEMS || [],
    bookings: [],
    favorites: new Set(),
    compareList: [],
    activeCategory: 'All',
    filters: {
      search: '',
      maxPrice: 1500,
      transmission: 'All',
      seats: 'All',
      sort: 'featured'
    },
    bookingWizard: {
      step: 1,
      vehicle: null,
      pickupLocation: 'Beverly Hills',
      dropoffLocation: 'Beverly Hills',
      pickupDate: '',
      pickupTime: '10:00 AM',
      dropoffDate: '',
      dropoffTime: '04:00 PM',
      days: 3,
      selectedExtras: ['extra-driver'],
      insuranceTier: 'premium',
      promoCode: '',
      discountAmount: 0,
      customerName: 'Alex Morgan',
      customerEmail: 'alex.morgan@drivevault.com',
      customerPhone: '+1 (310) 902-8811',
      customerAddress: '9601 Wilshire Blvd, Beverly Hills, CA',
      customerLicense: 'DL-CA-92841029',
      currentBookingId: ''
    },
    theme: 'dark',
    reviewIndex: 0
  };

  // Load Persisted Data from localStorage
  function initStorage() {
    // Fleet
    const storedFleet = localStorage.getItem('dv_fleet');
    if (storedFleet) {
      try {
        STATE.fleet = JSON.parse(storedFleet);
      } catch (e) {
        STATE.fleet = [...INITIAL_FLEET];
      }
    } else {
      STATE.fleet = [...INITIAL_FLEET];
      localStorage.setItem('dv_fleet', JSON.stringify(STATE.fleet));
    }

    // Bookings
    const storedBookings = localStorage.getItem('dv_bookings');
    if (storedBookings) {
      try {
        STATE.bookings = JSON.parse(storedBookings);
      } catch (e) {
        STATE.bookings = [...SAMPLE_BOOKINGS];
      }
    } else {
      STATE.bookings = [...SAMPLE_BOOKINGS];
      localStorage.setItem('dv_bookings', JSON.stringify(STATE.bookings));
    }

    // Favorites
    const storedFavs = localStorage.getItem('dv_favorites');
    if (storedFavs) {
      try {
        STATE.favorites = new Set(JSON.parse(storedFavs));
      } catch (e) {
        STATE.favorites = new Set(['dv-01', 'dv-02', 'dv-04']);
      }
    } else {
      STATE.favorites = new Set(['dv-01', 'dv-02', 'dv-04']);
      localStorage.setItem('dv_favorites', JSON.stringify([...STATE.favorites]));
    }

    // Theme
    const storedTheme = localStorage.getItem('dv_theme') || 'dark';
    STATE.theme = storedTheme;
    applyTheme(storedTheme);

    // Initial Dates for Booking
    const today = new Date();
    const nextThreeDays = new Date();
    nextThreeDays.setDate(today.getDate() + 3);

    const pad = (n) => String(n).padStart(2, '0');
    STATE.bookingWizard.pickupDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    STATE.bookingWizard.dropoffDate = `${nextThreeDays.getFullYear()}-${pad(nextThreeDays.getMonth() + 1)}-${pad(nextThreeDays.getDate())}`;

    // Set Default Vehicle for Wizard
    STATE.bookingWizard.vehicle = STATE.fleet[0];
  }

  // =========================================================================
  // 2. THEME ENGINE (DARK / LIGHT)
  // =========================================================================
  function applyTheme(theme) {
    const sunIcon = document.getElementById('icon-sun');
    const moonIcon = document.getElementById('icon-moon');

    if (theme === 'light') {
      document.body.classList.add('theme-light');
      document.documentElement.classList.remove('dark');
      if (sunIcon && moonIcon) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      }
    } else {
      document.body.classList.remove('theme-light');
      document.documentElement.classList.add('dark');
      if (sunIcon && moonIcon) {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      }
    }
    STATE.theme = theme;
    localStorage.setItem('dv_theme', theme);
  }

  function toggleTheme() {
    const nextTheme = STATE.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    showToast('Theme Updated', `Switched to ${nextTheme === 'dark' ? 'Midnight Luxury' : 'Daylight Executive'} mode.`);
  }

  // =========================================================================
  // 3. TOAST NOTIFICATION SYSTEM
  // =========================================================================
  function showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item glass-panel';

    let iconHtml = '<i data-lucide="info" class="w-5 h-5 text-cyan-400"></i>';
    if (type === 'success') {
      iconHtml = '<i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-400"></i>';
    } else if (type === 'warning') {
      iconHtml = '<i data-lucide="alert-triangle" class="w-5 h-5 text-amber-400"></i>';
    } else if (type === 'error') {
      iconHtml = '<i data-lucide="alert-circle" class="w-5 h-5 text-rose-400"></i>';
    }

    toast.innerHTML = `
      <div class="flex-shrink-0">${iconHtml}</div>
      <div class="flex-1">
        <p class="text-xs font-bold text-white">${title}</p>
        <p class="text-[11px] text-slate-300 leading-snug">${message}</p>
      </div>
      <button class="text-slate-400 hover:text-white ml-2 p-1" onclick="this.parentElement.remove()">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // =========================================================================
  // 4. FLEET RENDERING & FILTERING
  // =========================================================================
  function getFilteredFleet() {
    return STATE.fleet.filter(car => {
      // Category filter
      if (STATE.activeCategory !== 'All' && car.category !== STATE.activeCategory) {
        return false;
      }
      // Max Price filter
      if (car.dailyPrice > STATE.filters.maxPrice) {
        return false;
      }
      // Transmission filter
      if (STATE.filters.transmission !== 'All' && car.specs.transmission !== STATE.filters.transmission) {
        return false;
      }
      // Seats filter
      if (STATE.filters.seats !== 'All' && String(car.specs.seats) !== STATE.filters.seats) {
        return false;
      }
      // Search query
      if (STATE.filters.search.trim() !== '') {
        const q = STATE.filters.search.toLowerCase();
        const matchesBrand = car.brand.toLowerCase().includes(q);
        const matchesModel = car.model.toLowerCase().includes(q);
        const matchesTag = car.tagline.toLowerCase().includes(q);
        const matchesLocation = car.location.toLowerCase().includes(q);
        if (!matchesBrand && !matchesModel && !matchesTag && !matchesLocation) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (STATE.filters.sort === 'price-asc') return a.dailyPrice - b.dailyPrice;
      if (STATE.filters.sort === 'price-desc') return b.dailyPrice - a.dailyPrice;
      if (STATE.filters.sort === 'rating') return b.rating - a.rating;
      if (STATE.filters.sort === 'reviews') return b.reviewsCount - a.reviewsCount;
      // Default: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }

  function renderFleetGrid() {
    const container = document.getElementById('fleet-grid-container');
    const emptyState = document.getElementById('fleet-empty-state');
    const countNum = document.getElementById('fleet-count-num');
    if (!container) return;

    const filtered = getFilteredFleet();

    if (countNum) countNum.textContent = filtered.length;

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    container.innerHTML = filtered.map(car => {
      const isFav = STATE.favorites.has(car.id);
      const isCompared = STATE.compareList.includes(car.id);

      return `
        <div class="vehicle-card flex flex-col justify-between group" data-car-id="${car.id}">
          
          <!-- Image & Top Badges -->
          <div class="car-image-container relative h-56 bg-slate-900 overflow-hidden">
            <img src="${car.image}" alt="${car.brand} ${car.model}" class="car-image w-full h-full object-cover object-center" loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-[#07111F] via-transparent to-black/40"></div>
            
            <!-- Category & Availability Pill -->
            <div class="absolute top-4 left-4 flex items-center gap-2">
              <span class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-600/80 backdrop-blur-md text-white border border-blue-400/30">
                ${car.category}
              </span>
              ${car.available 
                ? '<span class="status-pill available"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Available</span>' 
                : '<span class="status-pill reserved"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Reserved</span>'}
            </div>

            <!-- Favorite & Compare Action Buttons -->
            <div class="absolute top-4 right-4 flex items-center gap-2">
              <!-- Compare Toggle -->
              <button class="btn-toggle-compare p-2 rounded-xl backdrop-blur-md transition ${isCompared ? 'bg-cyan-500 text-black' : 'bg-black/40 text-slate-300 hover:text-white hover:bg-black/70'}" data-id="${car.id}" title="${isCompared ? 'Remove from comparison' : 'Add to comparison'}">
                <i data-lucide="git-compare" class="w-4 h-4"></i>
              </button>
              
              <!-- Favorite Toggle -->
              <button class="btn-toggle-favorite p-2 rounded-xl backdrop-blur-md transition ${isFav ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40' : 'bg-black/40 text-slate-300 hover:text-rose-400 hover:bg-black/70'}" data-id="${car.id}" title="${isFav ? 'Remove from favorites' : 'Save to favorites'}">
                <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-rose-500' : ''}"></i>
              </button>
            </div>

            <!-- Location Pill -->
            <div class="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-slate-300 backdrop-blur-md bg-black/40 px-2.5 py-1 rounded-lg">
              <i data-lucide="map-pin" class="w-3 h-3 text-cyan-400"></i>
              <span>${car.location}</span>
            </div>

            <!-- Rating -->
            <div class="absolute bottom-3 right-4 flex items-center gap-1 text-xs font-bold text-white backdrop-blur-md bg-black/40 px-2.5 py-1 rounded-lg">
              <i data-lucide="star" class="w-3 h-3 text-amber-400 fill-amber-400"></i>
              <span>${car.rating.toFixed(2)}</span>
              <span class="text-[10px] text-slate-400 font-normal">(${car.reviewsCount})</span>
            </div>
          </div>

          <!-- Content Body -->
          <div class="p-6 space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-baseline justify-between mb-1">
                <span class="text-xs font-semibold text-slate-400">${car.brand} &bull; ${car.year}</span>
              </div>
              <h3 class="font-display text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                ${car.model}
              </h3>
              <p class="text-xs text-slate-400 line-clamp-1 mt-1">${car.tagline}</p>

              <!-- Specs Pills Grid -->
              <div class="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5 text-xs text-slate-300">
                <div class="flex items-center gap-2">
                  <i data-lucide="zap" class="w-3.5 h-3.5 text-cyan-400"></i>
                  <span>${car.specs.horsepower}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i data-lucide="gauge" class="w-3.5 h-3.5 text-blue-400"></i>
                  <span>${car.specs.acceleration}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i data-lucide="cog" class="w-3.5 h-3.5 text-slate-400"></i>
                  <span class="truncate">${car.specs.transmission}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i data-lucide="users" class="w-3.5 h-3.5 text-slate-400"></i>
                  <span>${car.specs.seats} Seats</span>
                </div>
              </div>
            </div>

            <!-- Price & Action Buttons -->
            <div class="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <div>
                <span class="text-[11px] text-slate-400 block font-medium">Daily Rate</span>
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-black text-cyan-400 font-display">$${car.dailyPrice}</span>
                  <span class="text-xs text-slate-400">/day</span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button class="btn-view-details secondary-button px-3 py-2 text-xs" data-id="${car.id}">
                  Details
                </button>
                <button class="btn-book-now brand-button px-4 py-2 text-xs gap-1" data-id="${car.id}">
                  <span>Book</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </div>

          </div>

        </div>
      `;
    }).join('');

    lucide.createIcons();
    attachFleetCardEvents();
  }

  function attachFleetCardEvents() {
    // Favorite Toggle
    document.querySelectorAll('.btn-toggle-favorite').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const carId = btn.dataset.id;
        const car = STATE.fleet.find(c => c.id === carId);
        if (!car) return;

        if (STATE.favorites.has(carId)) {
          STATE.favorites.delete(carId);
          showToast('Removed from Favorites', `${car.brand} ${car.model} removed.`);
        } else {
          STATE.favorites.add(carId);
          showToast('Added to Favorites', `${car.brand} ${car.model} saved to your garage.`, 'success');
        }
        localStorage.setItem('dv_favorites', JSON.stringify([...STATE.favorites]));
        renderFleetGrid();
        updateDashboardCounts();
      });
    });

    // Compare Toggle
    document.querySelectorAll('.btn-toggle-compare').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const carId = btn.dataset.id;
        const car = STATE.fleet.find(c => c.id === carId);
        if (!car) return;

        const idx = STATE.compareList.indexOf(carId);
        if (idx !== -1) {
          STATE.compareList.splice(idx, 1);
          showToast('Comparison Updated', `${car.brand} ${car.model} removed from comparison.`);
        } else {
          if (STATE.compareList.length >= 3) {
            showToast('Comparison Limit Reached', 'You can compare up to 3 vehicles simultaneously.', 'warning');
            return;
          }
          STATE.compareList.push(carId);
          showToast('Vehicle Added to Compare', `${car.brand} ${car.model} added to comparison.`, 'success');
        }
        updateCompareDrawer();
        renderFleetGrid();
      });
    });

    // View Details Modal
    document.querySelectorAll('.btn-view-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const carId = btn.dataset.id;
        openVehicleDetailsModal(carId);
      });
    });

    // Book Now (Direct to wizard)
    document.querySelectorAll('.btn-book-now').forEach(btn => {
      btn.addEventListener('click', () => {
        const carId = btn.dataset.id;
        const car = STATE.fleet.find(c => c.id === carId);
        if (car) {
          STATE.bookingWizard.vehicle = car;
          STATE.bookingWizard.step = 1;
          openBookingWizard();
        }
      });
    });
  }

  // =========================================================================
  // 5. VEHICLE DETAILS MODAL
  // =========================================================================
  function openVehicleDetailsModal(carId) {
    const car = STATE.fleet.find(c => c.id === carId);
    if (!car) return;

    const modal = document.getElementById('modal-vehicle-details');
    const content = document.getElementById('vehicle-details-content');
    if (!modal || !content) return;

    const weeklyRate = Math.round(car.dailyPrice * 7 * (1 - car.weeklyDiscount));
    const monthlyRate = Math.round(car.dailyPrice * 30 * (1 - car.monthlyDiscount));

    content.innerHTML = `
      <div class="space-y-8">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-bold uppercase tracking-wider text-cyan-400">${car.brand} &bull; ${car.year}</span>
              <span class="status-pill ${car.available ? 'available' : 'reserved'}">${car.available ? 'Available' : 'Reserved'}</span>
            </div>
            <h2 class="font-display text-2xl sm:text-3xl font-extrabold text-white">${car.model}</h2>
            <p class="text-xs text-slate-400 mt-1">${car.tagline}</p>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400 block">Daily Privilege Rate</span>
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-extrabold text-cyan-400 font-display">$${car.dailyPrice}</span>
              <span class="text-xs text-slate-400">/day</span>
            </div>
          </div>
        </div>

        <!-- High-Res Gallery & Interactive Thumbnails -->
        <div class="space-y-3">
          <div class="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
            <img id="modal-main-gallery-img" src="${car.image}" alt="${car.brand} ${car.model}" class="w-full h-full object-cover">
          </div>
          <div class="flex items-center gap-3 overflow-x-auto pb-1">
            ${car.gallery.map((imgUrl, i) => `
              <button class="gallery-thumbnail-btn relative w-24 h-16 rounded-xl overflow-hidden border-2 ${i === 0 ? 'border-cyan-400' : 'border-white/10'} hover:border-cyan-400 flex-shrink-0 transition" data-src="${imgUrl}">
                <img src="${imgUrl}" class="w-full h-full object-cover">
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Pricing Tiers: Daily / Weekly / Monthly -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="glass-panel p-4 rounded-xl border-cyan-500/30">
            <span class="text-[11px] text-slate-400 uppercase font-bold">Standard Daily</span>
            <div class="text-xl font-bold text-white mt-1">$${car.dailyPrice} <span class="text-xs font-normal text-slate-400">/ day</span></div>
            <p class="text-[11px] text-slate-400 mt-1">150 complimentary miles/day included</p>
          </div>
          <div class="glass-panel p-4 rounded-xl border-blue-500/30">
            <span class="text-[11px] text-cyan-400 uppercase font-bold">Weekly (-15% Off)</span>
            <div class="text-xl font-bold text-white mt-1">$${weeklyRate} <span class="text-xs font-normal text-slate-400">/ 7 days</span></div>
            <p class="text-[11px] text-slate-400 mt-1">Save approx. $${Math.round(car.dailyPrice * 7 * car.weeklyDiscount)}</p>
          </div>
          <div class="glass-panel p-4 rounded-xl border-indigo-500/30">
            <span class="text-[11px] text-indigo-400 uppercase font-bold">Monthly (-30% Off)</span>
            <div class="text-xl font-bold text-white mt-1">$${monthlyRate} <span class="text-xs font-normal text-slate-400">/ month</span></div>
            <p class="text-[11px] text-slate-400 mt-1">Dedicated VIP vehicle concierge</p>
          </div>
        </div>

        <!-- Technical Telemetry & Specifications -->
        <div class="space-y-3">
          <h4 class="font-display font-bold text-base text-white">Technical Specifications</h4>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-white/5 space-y-1">
              <span class="text-slate-400 block text-[10px] uppercase font-semibold">Engine / Motor</span>
              <span class="text-white font-bold">${car.specs.engine}</span>
            </div>
            <div class="p-3 rounded-xl bg-white/5 space-y-1">
              <span class="text-slate-400 block text-[10px] uppercase font-semibold">Horsepower</span>
              <span class="text-white font-bold">${car.specs.horsepower}</span>
            </div>
            <div class="p-3 rounded-xl bg-white/5 space-y-1">
              <span class="text-slate-400 block text-[10px] uppercase font-semibold">0-60 mph</span>
              <span class="text-white font-bold text-cyan-400">${car.specs.acceleration}</span>
            </div>
            <div class="p-3 rounded-xl bg-white/5 space-y-1">
              <span class="text-slate-400 block text-[10px] uppercase font-semibold">Top Speed</span>
              <span class="text-white font-bold">${car.specs.topSpeed}</span>
            </div>
            <div class="p-3 rounded-xl bg-white/5 space-y-1">
              <span class="text-slate-400 block text-[10px] uppercase font-semibold">Transmission</span>
              <span class="text-white font-bold">${car.specs.transmission}</span>
            </div>
            <div class="p-3 rounded-xl bg-white/5 space-y-1">
              <span class="text-slate-400 block text-[10px] uppercase font-semibold">Drivetrain</span>
              <span class="text-white font-bold">${car.specs.driveType}</span>
            </div>
            <div class="p-3 rounded-xl bg-white/5 space-y-1">
              <span class="text-slate-400 block text-[10px] uppercase font-semibold">Seating Capacity</span>
              <span class="text-white font-bold">${car.specs.seats} Persons</span>
            </div>
            <div class="p-3 rounded-xl bg-white/5 space-y-1">
              <span class="text-slate-400 block text-[10px] uppercase font-semibold">Luggage Volume</span>
              <span class="text-white font-bold">${car.specs.luggageCapacity}</span>
            </div>
          </div>
        </div>

        <!-- Features Checklist -->
        <div class="space-y-3">
          <h4 class="font-display font-bold text-base text-white">Included Luxury Features</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            ${car.features.map(f => `
              <div class="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                <i data-lucide="check" class="w-4 h-4 text-cyan-400 flex-shrink-0"></i>
                <span>${f}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Action Footer -->
        <div class="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 text-xs text-slate-400">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
            <span>Complimentary 24/7 concierge pickup & delivery</span>
          </div>
          <button id="btn-modal-reserve-now" class="brand-button w-full sm:w-auto px-8 py-3.5 text-sm font-semibold gap-2">
            <span>Reserve This Vehicle</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>

      </div>
    `;

    lucide.createIcons();
    modal.classList.remove('hidden');

    // Thumbnail switching
    content.querySelectorAll('.gallery-thumbnail-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        content.querySelectorAll('.gallery-thumbnail-btn').forEach(b => b.classList.replace('border-cyan-400', 'border-white/10'));
        btn.classList.replace('border-white/10', 'border-cyan-400');
        const mainImg = document.getElementById('modal-main-gallery-img');
        if (mainImg) mainImg.src = btn.dataset.src;
      });
    });

    // Reserve CTA
    document.getElementById('btn-modal-reserve-now')?.addEventListener('click', () => {
      modal.classList.add('hidden');
      STATE.bookingWizard.vehicle = car;
      STATE.bookingWizard.step = 1;
      openBookingWizard();
    });
  }

  // =========================================================================
  // 6. MULTI-STEP BOOKING WIZARD CONTROLLER (6 STEPS)
  // =========================================================================
  function openBookingWizard() {
    const modal = document.getElementById('modal-booking-wizard');
    if (!modal) return;
    renderWizardStep();
    modal.classList.remove('hidden');
  }

  function renderWizardStep() {
    const title = document.getElementById('wizard-step-title');
    const container = document.getElementById('booking-wizard-step-body');
    if (!container) return;

    // Update Step Indicators
    for (let i = 1; i <= 6; i++) {
      const el = document.querySelector(`#step-indicator-${i} .step-circle`);
      if (el) {
        el.className = 'step-circle';
        if (i === STATE.bookingWizard.step) {
          el.classList.add('active');
        } else if (i < STATE.bookingWizard.step) {
          el.classList.add('completed');
          el.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
        } else {
          el.textContent = i;
        }
      }
    }

    const currentCar = STATE.bookingWizard.vehicle || STATE.fleet[0];

    // Calculate Real-Time Dynamic Pricing
    const days = Math.max(1, calculateRentalDays(STATE.bookingWizard.pickupDate, STATE.bookingWizard.dropoffDate));
    STATE.bookingWizard.days = days;

    const baseTotal = currentCar.dailyPrice * days;

    let extrasTotal = 0;
    STATE.bookingWizard.selectedExtras.forEach(extId => {
      const ext = INITIAL_EXTRAS.find(e => e.id === extId);
      if (ext) extrasTotal += ext.pricePerDay * days;
    });

    let insuranceRate = 0;
    const insTier = currentCar.insuranceTiers.find(t => t.id === STATE.bookingWizard.insuranceTier);
    if (insTier) insuranceRate = insTier.pricePerDay * days;

    const serviceFee = Math.round(baseTotal * 0.06); // 6% concierge fee
    const subtotal = baseTotal + extrasTotal + insuranceRate + serviceFee;
    const grandTotal = Math.max(0, subtotal - STATE.bookingWizard.discountAmount);

    // Render Steps
    switch (STATE.bookingWizard.step) {
      // -------------------------------------------------------------
      // Step 1: Vehicle Confirmation
      // -------------------------------------------------------------
      case 1:
        if (title) title.textContent = 'Step 1 — Vehicle Confirmation';
        container.innerHTML = `
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 glass-panel border-cyan-500/30">
              <div class="h-56 rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                <img src="${currentCar.image}" alt="${currentCar.model}" class="w-full h-full object-cover">
              </div>
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold uppercase text-cyan-400">${currentCar.brand} &bull; ${currentCar.year}</span>
                  <span class="status-pill available">Active Selection</span>
                </div>
                <h3 class="font-display text-2xl font-bold text-white">${currentCar.model}</h3>
                <p class="text-xs text-slate-400">${currentCar.tagline}</p>
                <div class="flex items-center gap-4 text-xs text-slate-300 py-2 border-y border-white/5">
                  <span>${currentCar.specs.horsepower}</span> &bull;
                  <span>${currentCar.specs.transmission}</span> &bull;
                  <span>${currentCar.specs.seats} Seats</span>
                </div>
                <div class="flex items-baseline gap-1">
                  <span class="text-3xl font-extrabold text-cyan-400 font-display">$${currentCar.dailyPrice}</span>
                  <span class="text-xs text-slate-400">/day</span>
                </div>
              </div>
            </div>

            <!-- Switch Vehicle Dropdown -->
            <div class="space-y-2">
              <label for="wizard-switch-car" class="block text-xs font-semibold text-slate-400">Change Selected Vehicle:</label>
              <select id="wizard-switch-car" class="w-full bg-[#07111F] text-white text-sm rounded-xl p-3 border border-white/10 focus:border-cyan-400 focus:outline-none">
                ${STATE.fleet.map(c => `
                  <option value="${c.id}" ${c.id === currentCar.id ? 'selected' : ''}>
                    ${c.brand} ${c.model} ($${c.dailyPrice}/day) - ${c.category}
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Next Navigation -->
            <div class="flex justify-end pt-4 border-t border-white/10">
              <button id="wizard-btn-to-step-2" class="brand-button px-8 py-3 text-sm font-semibold gap-2">
                <span>Continue to Itinerary</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        `;

        document.getElementById('wizard-switch-car')?.addEventListener('change', (e) => {
          const newCar = STATE.fleet.find(c => c.id === e.target.value);
          if (newCar) {
            STATE.bookingWizard.vehicle = newCar;
            renderWizardStep();
          }
        });

        document.getElementById('wizard-btn-to-step-2')?.addEventListener('click', () => {
          STATE.bookingWizard.step = 2;
          renderWizardStep();
        });
        break;

      // -------------------------------------------------------------
      // Step 2: Itinerary & Locations
      // -------------------------------------------------------------
      case 2:
        if (title) title.textContent = 'Step 2 — Rental Itinerary & Dates';
        container.innerHTML = `
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Pickup -->
              <div class="glass-panel p-5 space-y-4">
                <h4 class="font-display font-bold text-sm text-cyan-400 flex items-center gap-2">
                  <i data-lucide="map-pin" class="w-4 h-4"></i>
                  Pick-up Information
                </h4>
                <div class="space-y-1">
                  <label for="step2-pickup-location" class="block text-xs text-slate-400">Pick-up Hub / Location</label>
                  <select id="step2-pickup-location" class="w-full bg-[#07111F] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-cyan-400 focus:outline-none">
                    ${STATE.locations.map(l => `<option value="${l.city}" ${l.city === STATE.bookingWizard.pickupLocation ? 'selected' : ''}>${l.city} (${l.tag})</option>`).join('')}
                  </select>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label for="step2-pickup-date" class="block text-xs text-slate-400 mb-1">Pick-up Date</label>
                    <input type="date" id="step2-pickup-date" value="${STATE.bookingWizard.pickupDate}" class="w-full bg-[#07111F] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-cyan-400 focus:outline-none">
                  </div>
                  <div>
                    <label for="step2-pickup-time" class="block text-xs text-slate-400 mb-1">Pick-up Time</label>
                    <select id="step2-pickup-time" class="w-full bg-[#07111F] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-cyan-400 focus:outline-none">
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM" selected>10:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="07:00 PM">07:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Drop-off -->
              <div class="glass-panel p-5 space-y-4">
                <h4 class="font-display font-bold text-sm text-blue-400 flex items-center gap-2">
                  <i data-lucide="map-pin" class="w-4 h-4"></i>
                  Drop-off Information
                </h4>
                <div class="space-y-1">
                  <label for="step2-dropoff-location" class="block text-xs text-slate-400">Drop-off Hub / Location</label>
                  <select id="step2-dropoff-location" class="w-full bg-[#07111F] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-cyan-400 focus:outline-none">
                    ${STATE.locations.map(l => `<option value="${l.city}" ${l.city === STATE.bookingWizard.dropoffLocation ? 'selected' : ''}>${l.city} (${l.tag})</option>`).join('')}
                  </select>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label for="step2-dropoff-date" class="block text-xs text-slate-400 mb-1">Drop-off Date</label>
                    <input type="date" id="step2-dropoff-date" value="${STATE.bookingWizard.dropoffDate}" class="w-full bg-[#07111F] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-cyan-400 focus:outline-none">
                  </div>
                  <div>
                    <label for="step2-dropoff-time" class="block text-xs text-slate-400 mb-1">Drop-off Time</label>
                    <select id="step2-dropoff-time" class="w-full bg-[#07111F] text-white text-xs rounded-xl p-3 border border-white/10 focus:border-cyan-400 focus:outline-none">
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="04:00 PM" selected>04:00 PM</option>
                      <option value="08:00 PM">08:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            <!-- Duration Banner -->
            <div class="glass-panel p-4 flex items-center justify-between border-cyan-500/20 text-xs">
              <span class="text-slate-300">Total Calculated Trip Duration:</span>
              <span class="font-bold text-cyan-400 text-sm font-display">${days} Days Rental</span>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex items-center justify-between pt-4 border-t border-white/10">
              <button id="wizard-btn-back-1" class="secondary-button px-6 py-2.5 text-xs font-semibold">Back</button>
              <button id="wizard-btn-to-step-3" class="brand-button px-8 py-3 text-sm font-semibold gap-2">
                <span>Select Extras & Protection</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
            </div>
          </div>
        `;

        document.getElementById('wizard-btn-back-1')?.addEventListener('click', () => {
          STATE.bookingWizard.step = 1;
          renderWizardStep();
        });

        document.getElementById('wizard-btn-to-step-3')?.addEventListener('click', () => {
          const pLoc = document.getElementById('step2-pickup-location').value;
          const dLoc = document.getElementById('step2-dropoff-location').value;
          const pDate = document.getElementById('step2-pickup-date').value;
          const dDate = document.getElementById('step2-dropoff-date').value;
          const pTime = document.getElementById('step2-pickup-time').value;
          const dTime = document.getElementById('step2-dropoff-time').value;

          if (!pDate || !dDate) {
            showToast('Date Missing', 'Please select valid pick-up and drop-off dates.', 'warning');
            return;
          }

          if (new Date(dDate) < new Date(pDate)) {
            showToast('Invalid Date Range', 'Drop-off date cannot precede your pick-up date.', 'error');
            return;
          }

          STATE.bookingWizard.pickupLocation = pLoc;
          STATE.bookingWizard.dropoffLocation = dLoc;
          STATE.bookingWizard.pickupDate = pDate;
          STATE.bookingWizard.dropoffDate = dDate;
          STATE.bookingWizard.pickupTime = pTime;
          STATE.bookingWizard.dropoffTime = dTime;

          STATE.bookingWizard.step = 3;
          renderWizardStep();
        });
        break;

      // -------------------------------------------------------------
      // Step 3: Extras & Protection Tiers
      // -------------------------------------------------------------
      case 3:
        if (title) title.textContent = 'Step 3 — Luxury Add-ons & Protection';
        container.innerHTML = `
          <div class="space-y-8">
            
            <!-- Insurance Tiers -->
            <div class="space-y-3">
              <h4 class="font-display font-bold text-sm text-white">Protection Package</h4>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                ${currentCar.insuranceTiers.map(tier => `
                  <label class="glass-panel p-4 rounded-xl cursor-pointer block border-2 transition ${STATE.bookingWizard.insuranceTier === tier.id ? 'border-cyan-400 bg-cyan-950/20' : 'border-white/5 hover:border-white/20'}">
                    <div class="flex items-center justify-between mb-2">
                      <input type="radio" name="wizard-insurance" value="${tier.id}" ${STATE.bookingWizard.insuranceTier === tier.id ? 'checked' : ''} class="text-cyan-400 focus:ring-0">
                      <span class="text-xs font-mono text-cyan-400 font-bold">${tier.pricePerDay === 0 ? 'FREE' : '+$' + tier.pricePerDay + '/day'}</span>
                    </div>
                    <p class="font-bold text-xs text-white">${tier.name}</p>
                    <p class="text-[11px] text-slate-400 mt-1">${tier.desc}</p>
                    <div class="mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-400 flex justify-between">
                      <span>Deductible: $${tier.deductible}</span>
                      <span>Deposit: $${tier.deposit}</span>
                    </div>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- Optional Extras -->
            <div class="space-y-3">
              <h4 class="font-display font-bold text-sm text-white">Curated Travel Extras</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${INITIAL_EXTRAS.map(extra => {
                  const isChecked = STATE.bookingWizard.selectedExtras.includes(extra.id);
                  return `
                    <label class="glass-panel p-3.5 rounded-xl cursor-pointer flex items-center justify-between border ${isChecked ? 'border-cyan-400/60 bg-cyan-950/10' : 'border-white/5 hover:border-white/20'}">
                      <div class="flex items-center gap-3">
                        <input type="checkbox" class="wizard-extra-check text-cyan-400 rounded focus:ring-0" value="${extra.id}" ${isChecked ? 'checked' : ''}>
                        <div>
                          <p class="text-xs font-bold text-white">${extra.name}</p>
                          <p class="text-[10px] text-slate-400">${extra.desc}</p>
                        </div>
                      </div>
                      <span class="text-xs font-mono text-cyan-400 font-bold ml-2">+$${extra.pricePerDay}/d</span>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex items-center justify-between pt-4 border-t border-white/10">
              <button id="wizard-btn-back-2" class="secondary-button px-6 py-2.5 text-xs font-semibold">Back</button>
              <button id="wizard-btn-to-step-4" class="brand-button px-8 py-3 text-sm font-semibold gap-2">
                <span>Enter Driver Details</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
            </div>

          </div>
        `;

        // Insurance change
        container.querySelectorAll('input[name="wizard-insurance"]').forEach(radio => {
          radio.addEventListener('change', (e) => {
            STATE.bookingWizard.insuranceTier = e.target.value;
            renderWizardStep();
          });
        });

        // Extras change
        container.querySelectorAll('.wizard-extra-check').forEach(chk => {
          chk.addEventListener('change', () => {
            const selected = [];
            container.querySelectorAll('.wizard-extra-check:checked').forEach(c => selected.push(c.value));
            STATE.bookingWizard.selectedExtras = selected;
          });
        });

        document.getElementById('wizard-btn-back-2')?.addEventListener('click', () => {
          STATE.bookingWizard.step = 2;
          renderWizardStep();
        });

        document.getElementById('wizard-btn-to-step-4')?.addEventListener('click', () => {
          STATE.bookingWizard.step = 4;
          renderWizardStep();
        });
        break;

      // -------------------------------------------------------------
      // Step 4: Driver Information
      // -------------------------------------------------------------
      case 4:
        if (title) title.textContent = 'Step 4 — Registered Driver Information';
        container.innerHTML = `
          <form id="step4-driver-form" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div class="space-y-1">
                <label for="step4-name" class="block text-slate-400 font-medium">Primary Driver Full Name *</label>
                <input type="text" id="step4-name" required value="${STATE.bookingWizard.customerName}" class="w-full bg-[#07111F] text-white rounded-xl p-3 border border-white/10 focus:border-cyan-400 focus:outline-none">
              </div>

              <div class="space-y-1">
                <label for="step4-email" class="block text-slate-400 font-medium">Email Address (For Confirmation) *</label>
                <input type="email" id="step4-email" required value="${STATE.bookingWizard.customerEmail}" class="w-full bg-[#07111F] text-white rounded-xl p-3 border border-white/10 focus:border-cyan-400 focus:outline-none">
              </div>

              <div class="space-y-1">
                <label for="step4-phone" class="block text-slate-400 font-medium">Mobile Number (24/7 WhatsApp Coordination) *</label>
                <input type="tel" id="step4-phone" required value="${STATE.bookingWizard.customerPhone}" class="w-full bg-[#07111F] text-white rounded-xl p-3 border border-white/10 focus:border-cyan-400 focus:outline-none">
              </div>

              <div class="space-y-1">
                <label for="step4-license" class="block text-slate-400 font-medium">Driver License / ID Number *</label>
                <input type="text" id="step4-license" required value="${STATE.bookingWizard.customerLicense}" class="w-full bg-[#07111F] text-white rounded-xl p-3 border border-white/10 focus:border-cyan-400 focus:outline-none">
              </div>

              <div class="sm:col-span-2 space-y-1">
                <label for="step4-address" class="block text-slate-400 font-medium">Billing / Residential Address</label>
                <input type="text" id="step4-address" value="${STATE.bookingWizard.customerAddress}" class="w-full bg-[#07111F] text-white rounded-xl p-3 border border-white/10 focus:border-cyan-400 focus:outline-none">
              </div>

            </div>

            <div class="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2">
              <i data-lucide="lock" class="w-4 h-4 flex-shrink-0"></i>
              <span>All personal and license records are end-to-end encrypted under Swiss financial security standards.</span>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex items-center justify-between pt-4 border-t border-white/10">
              <button type="button" id="wizard-btn-back-3" class="secondary-button px-6 py-2.5 text-xs font-semibold">Back</button>
              <button type="submit" class="brand-button px-8 py-3 text-sm font-semibold gap-2">
                <span>Review & Price Calculation</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
            </div>
          </form>
        `;

        document.getElementById('wizard-btn-back-3')?.addEventListener('click', () => {
          STATE.bookingWizard.step = 3;
          renderWizardStep();
        });

        document.getElementById('step4-driver-form')?.addEventListener('submit', (e) => {
          e.preventDefault();
          STATE.bookingWizard.customerName = document.getElementById('step4-name').value;
          STATE.bookingWizard.customerEmail = document.getElementById('step4-email').value;
          STATE.bookingWizard.customerPhone = document.getElementById('step4-phone').value;
          STATE.bookingWizard.customerLicense = document.getElementById('step4-license').value;
          STATE.bookingWizard.customerAddress = document.getElementById('step4-address').value;

          STATE.bookingWizard.step = 5;
          renderWizardStep();
        });
        break;

      // -------------------------------------------------------------
      // Step 5: Review & Real-Time Dynamic Price Calculator
      // -------------------------------------------------------------
      case 5:
        if (title) title.textContent = 'Step 5 — Itinerary Summary & Dynamic Calculation';
        container.innerHTML = `
          <div class="space-y-6">
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <!-- Left 2 Cols: Summary -->
              <div class="lg:col-span-2 space-y-4">
                
                <!-- Vehicle Overview Card -->
                <div class="glass-panel p-4 flex items-center gap-4">
                  <img src="${currentCar.image}" alt="${currentCar.model}" class="w-24 h-20 rounded-xl object-cover">
                  <div>
                    <span class="text-xs text-cyan-400 font-semibold uppercase">${currentCar.brand}</span>
                    <h4 class="font-display font-bold text-white text-lg">${currentCar.model}</h4>
                    <p class="text-xs text-slate-400">${STATE.bookingWizard.pickupLocation} &bull; ${days} Days Rental</p>
                  </div>
                </div>

                <!-- Itinerary Details -->
                <div class="glass-panel p-5 space-y-3 text-xs">
                  <h4 class="font-display font-bold text-white text-sm pb-2 border-b border-white/5">Trip Parameters</h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <span class="text-slate-400 block text-[10px] uppercase font-semibold">Pick-up</span>
                      <p class="text-white font-bold">${STATE.bookingWizard.pickupLocation}</p>
                      <p class="text-slate-400">${STATE.bookingWizard.pickupDate} at ${STATE.bookingWizard.pickupTime}</p>
                    </div>
                    <div>
                      <span class="text-slate-400 block text-[10px] uppercase font-semibold">Drop-off</span>
                      <p class="text-white font-bold">${STATE.bookingWizard.dropoffLocation}</p>
                      <p class="text-slate-400">${STATE.bookingWizard.dropoffDate} at ${STATE.bookingWizard.dropoffTime}</p>
                    </div>
                  </div>
                  <div class="pt-2 border-t border-white/5 flex justify-between">
                    <span class="text-slate-400">Driver Name:</span>
                    <span class="text-white font-semibold">${STATE.bookingWizard.customerName}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Contact Email:</span>
                    <span class="text-white font-semibold">${STATE.bookingWizard.customerEmail}</span>
                  </div>
                </div>

                <!-- Promo Code Box -->
                <div class="glass-panel p-4 space-y-2">
                  <label for="wizard-promo-input" class="block text-xs font-bold text-white">Have a Promotional Code?</label>
                  <div class="flex gap-2">
                    <input type="text" id="wizard-promo-input" placeholder="e.g. WEEKEND20, LUXURY150" value="${STATE.bookingWizard.promoCode}" class="w-full bg-[#07111F] text-xs text-white uppercase font-mono rounded-xl px-3 py-2.5 border border-white/10 focus:border-cyan-400 focus:outline-none">
                    <button id="btn-apply-promo" class="secondary-button px-4 py-2 text-xs font-bold">Apply</button>
                  </div>
                  ${STATE.bookingWizard.discountAmount > 0 
                    ? `<p class="text-emerald-400 text-xs font-semibold flex items-center gap-1"><i data-lucide="check" class="w-3.5 h-3.5"></i> Promo code applied: -$${STATE.bookingWizard.discountAmount} savings</p>` 
                    : '<p class="text-slate-500 text-[11px]">Codes: <span class="text-cyan-400 cursor-pointer font-mono" onclick="document.getElementById(\'wizard-promo-input\').value=\'WEEKEND20\'">WEEKEND20</span> (20% off), <span class="text-cyan-400 cursor-pointer font-mono" onclick="document.getElementById(\'wizard-promo-input\').value=\'LUXURY150\'">LUXURY150</span> ($150 off)</p>'}
                </div>

              </div>

              <!-- Right 1 Col: Dynamic Live Pricing Breakdown -->
              <div class="glass-panel p-5 space-y-4 border-cyan-500/30 flex flex-col justify-between">
                <div>
                  <h4 class="font-display font-bold text-white text-base pb-3 border-b border-white/10">
                    Price Calculation
                  </h4>
                  
                  <div class="space-y-2 text-xs pt-3 text-slate-300">
                    <div class="flex justify-between">
                      <span>Base Vehicle (${days}d &times; $${currentCar.dailyPrice})</span>
                      <span class="font-mono text-white">$${baseTotal.toLocaleString()}</span>
                    </div>

                    <div class="flex justify-between">
                      <span>Selected Add-ons & Extras</span>
                      <span class="font-mono text-white">+$${extrasTotal.toLocaleString()}</span>
                    </div>

                    <div class="flex justify-between">
                      <span>Protection Tier (${insTier ? insTier.name : 'Standard'})</span>
                      <span class="font-mono text-white">+$${insuranceRate.toLocaleString()}</span>
                    </div>

                    <div class="flex justify-between">
                      <span>Concierge & Terminal Handling (6%)</span>
                      <span class="font-mono text-white">+$${serviceFee.toLocaleString()}</span>
                    </div>

                    ${STATE.bookingWizard.discountAmount > 0 ? `
                      <div class="flex justify-between text-emerald-400 font-semibold pt-2 border-t border-white/5">
                        <span>Promotional Discount</span>
                        <span class="font-mono">-$${STATE.bookingWizard.discountAmount.toLocaleString()}</span>
                      </div>
                    ` : ''}

                    <div class="pt-4 border-t border-white/10 flex items-baseline justify-between">
                      <span class="text-sm font-bold text-white">Total Amount</span>
                      <span class="text-2xl font-black text-cyan-400 font-display">$${grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div class="pt-4 text-[11px] text-slate-400 space-y-2">
                  <div class="flex items-center gap-1.5 text-emerald-400">
                    <i data-lucide="shield-check" class="w-4 h-4"></i>
                    <span>No deposit charged today</span>
                  </div>
                  <p>Payment settled at white-glove vehicle handoff or corporate invoicing.</p>
                </div>

              </div>

            </div>

            <!-- Navigation Buttons -->
            <div class="flex items-center justify-between pt-4 border-t border-white/10">
              <button id="wizard-btn-back-4" class="secondary-button px-6 py-2.5 text-xs font-semibold">Back</button>
              <button id="wizard-btn-confirm-booking" class="brand-button px-10 py-3.5 text-sm font-bold gap-2">
                <i data-lucide="check-circle" class="w-4 h-4"></i>
                <span>Confirm & Reserve Ride</span>
              </button>
            </div>

          </div>
        `;

        // Promo apply handler
        document.getElementById('btn-apply-promo')?.addEventListener('click', () => {
          const code = document.getElementById('wizard-promo-input').value.trim().toUpperCase();
          applyPromoCode(code, baseTotal, days);
          renderWizardStep();
        });

        document.getElementById('wizard-btn-back-4')?.addEventListener('click', () => {
          STATE.bookingWizard.step = 4;
          renderWizardStep();
        });

        document.getElementById('wizard-btn-confirm-booking')?.addEventListener('click', () => {
          completeBooking(currentCar, days, baseTotal, extrasTotal, insuranceRate, serviceFee, grandTotal);
        });
        break;

      // -------------------------------------------------------------
      // Step 6: Booking Confirmation & Printable Receipt
      // -------------------------------------------------------------
      case 6:
        if (title) title.textContent = 'Step 6 — Reservation Confirmed';
        const currentBooking = STATE.bookings[0] || {};
        container.innerHTML = `
          <div class="space-y-6 text-center">
            
            <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <i data-lucide="check" class="w-8 h-8"></i>
            </div>

            <div class="max-w-md mx-auto space-y-1">
              <h3 class="font-display text-2xl sm:text-3xl font-extrabold text-white">Your Ride Is Reserved!</h3>
              <p class="text-xs text-slate-300">Confirmation has been dispatched to <span class="text-cyan-400 font-semibold">${STATE.bookingWizard.customerEmail}</span>.</p>
            </div>

            <!-- Printable Luxury Receipt Card -->
            <div id="printable-receipt-card" class="glass-panel p-6 max-w-xl mx-auto text-left space-y-4 border-cyan-500/30">
              <div class="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span class="text-[10px] text-slate-400 uppercase font-bold">Booking Reference</span>
                  <p class="font-mono text-sm font-black text-cyan-400">${currentBooking.id || 'DV-BOK-2026'}</p>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-slate-400 uppercase font-bold">Status</span>
                  <span class="status-pill available block">Confirmed</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span class="text-slate-400 block text-[10px]">Vehicle</span>
                  <p class="font-bold text-white">${currentCar.brand} ${currentCar.model}</p>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px]">Primary Driver</span>
                  <p class="font-bold text-white">${STATE.bookingWizard.customerName}</p>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px]">Pick-up</span>
                  <p class="font-bold text-white">${STATE.bookingWizard.pickupLocation}</p>
                  <p class="text-[10px] text-slate-400">${STATE.bookingWizard.pickupDate} (${STATE.bookingWizard.pickupTime})</p>
                </div>
                <div>
                  <span class="text-slate-400 block text-[10px]">Drop-off</span>
                  <p class="font-bold text-white">${STATE.bookingWizard.dropoffLocation}</p>
                  <p class="text-[10px] text-slate-400">${STATE.bookingWizard.dropoffDate} (${STATE.bookingWizard.dropoffTime})</p>
                </div>
              </div>

              <div class="pt-3 border-t border-white/10 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-300">Total Confirmed Rate:</span>
                <span class="font-display text-xl font-black text-cyan-400">$${(currentBooking.grandTotal || grandTotal).toLocaleString()}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button id="btn-print-receipt" class="secondary-button px-5 py-2.5 text-xs font-semibold flex items-center gap-2">
                <i data-lucide="printer" class="w-4 h-4 text-cyan-400"></i>
                <span>Download / Print Receipt</span>
              </button>

              <button id="btn-view-in-dashboard" class="brand-button px-6 py-2.5 text-xs font-semibold flex items-center gap-2">
                <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
                <span>View in Customer Dashboard</span>
              </button>

              <button id="btn-finish-wizard" class="text-xs text-slate-400 hover:text-white px-4 py-2">
                Close
              </button>
            </div>

          </div>
        `;

        document.getElementById('btn-print-receipt')?.addEventListener('click', () => {
          window.print();
        });

        document.getElementById('btn-view-in-dashboard')?.addEventListener('click', () => {
          document.getElementById('modal-booking-wizard')?.classList.add('hidden');
          openUserDashboard();
        });

        document.getElementById('btn-finish-wizard')?.addEventListener('click', () => {
          document.getElementById('modal-booking-wizard')?.classList.add('hidden');
        });
        break;
    }

    lucide.createIcons();
  }

  function calculateRentalDays(pickup, dropoff) {
    if (!pickup || !dropoff) return 1;
    const p = new Date(pickup);
    const d = new Date(dropoff);
    const diffTime = d - p;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  }

  function applyPromoCode(code, baseTotal, days) {
    if (!code) {
      STATE.bookingWizard.promoCode = '';
      STATE.bookingWizard.discountAmount = 0;
      return;
    }

    if (code === 'WEEKEND20') {
      STATE.bookingWizard.promoCode = 'WEEKEND20';
      STATE.bookingWizard.discountAmount = Math.round(baseTotal * 0.20);
      showToast('Promo Code Applied', '20% Weekend discount deducted!', 'success');
    } else if (code === 'LUXURY150') {
      STATE.bookingWizard.promoCode = 'LUXURY150';
      STATE.bookingWizard.discountAmount = 150;
      showToast('Promo Code Applied', '$150 VIP credit deducted!', 'success');
    } else if (code === 'LONGDRIVE30') {
      if (days < 7) {
        showToast('Requirement Not Met', 'LONGDRIVE30 requires a minimum rental of 7 days.', 'warning');
        return;
      }
      STATE.bookingWizard.promoCode = 'LONGDRIVE30';
      STATE.bookingWizard.discountAmount = Math.round(baseTotal * 0.30);
      showToast('Promo Code Applied', '30% Grand Tour discount applied!', 'success');
    } else {
      showToast('Invalid Coupon', 'The promo code entered is invalid or expired.', 'error');
    }
  }

  function completeBooking(car, days, baseTotal, extrasTotal, insuranceRate, serviceFee, grandTotal) {
    const bookingId = 'DV-BOK-' + Math.floor(10000 + Math.random() * 90000);
    const newBooking = {
      id: bookingId,
      vehicleId: car.id,
      carName: `${car.brand} ${car.model}`,
      carImage: car.image,
      pickupLocation: STATE.bookingWizard.pickupLocation,
      dropoffLocation: STATE.bookingWizard.dropoffLocation,
      pickupDate: STATE.bookingWizard.pickupDate,
      pickupTime: STATE.bookingWizard.pickupTime,
      dropoffDate: STATE.bookingWizard.dropoffDate,
      dropoffTime: STATE.bookingWizard.dropoffTime,
      days: days,
      dailyPrice: car.dailyPrice,
      baseTotal: baseTotal,
      extrasTotal: extrasTotal,
      insuranceTotal: insuranceRate,
      serviceFee: serviceFee,
      discount: STATE.bookingWizard.discountAmount,
      grandTotal: grandTotal,
      status: 'Upcoming',
      customerName: STATE.bookingWizard.customerName,
      customerEmail: STATE.bookingWizard.customerEmail,
      customerPhone: STATE.bookingWizard.customerPhone,
      createdAt: new Date().toISOString()
    };

    STATE.bookings.unshift(newBooking);
    localStorage.setItem('dv_bookings', JSON.stringify(STATE.bookings));

    STATE.bookingWizard.currentBookingId = bookingId;
    STATE.bookingWizard.step = 6;
    renderWizardStep();
    updateDashboardCounts();
    showToast('Reservation Confirmed', `Booking ${bookingId} has been successfully secured!`, 'success');
  }

  // =========================================================================
  // 7. COMPARISON DRAWER & MODAL MATRIX
  // =========================================================================
  function updateCompareDrawer() {
    const drawer = document.getElementById('compare-floating-drawer');
    const countEl = document.getElementById('drawer-compare-count');
    const namesEl = document.getElementById('drawer-compare-names');
    const navCount = document.getElementById('compare-nav-count');

    if (!drawer) return;

    const count = STATE.compareList.length;

    if (navCount) {
      if (count > 0) {
        navCount.textContent = count;
        navCount.classList.remove('hidden');
      } else {
        navCount.classList.add('hidden');
      }
    }

    if (count > 0) {
      drawer.classList.add('active');
      if (countEl) countEl.textContent = count;
      if (namesEl) {
        const names = STATE.compareList.map(id => {
          const c = STATE.fleet.find(item => item.id === id);
          return c ? c.model : '';
        }).filter(Boolean).join(', ');
        namesEl.textContent = names;
      }
    } else {
      drawer.classList.remove('active');
    }
  }

  function openComparisonModal() {
    if (STATE.compareList.length === 0) {
      showToast('No Vehicles Selected', 'Select at least 1 vehicle to compare specifications.', 'warning');
      return;
    }

    const modal = document.getElementById('modal-compare');
    const container = document.getElementById('compare-modal-content');
    if (!modal || !container) return;

    const cars = STATE.compareList.map(id => STATE.fleet.find(c => c.id === id)).filter(Boolean);

    container.innerHTML = `
      <table class="w-full text-xs text-left border-collapse">
        <thead>
          <tr class="border-b border-white/10">
            <th class="p-3 text-slate-400 font-semibold w-40">Telemetry / Spec</th>
            ${cars.map(c => `
              <th class="p-3">
                <div class="space-y-2">
                  <img src="${c.image}" class="w-full h-28 object-cover rounded-xl border border-white/10">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-[10px] text-cyan-400 uppercase font-bold">${c.brand}</p>
                      <p class="font-display font-bold text-white text-sm">${c.model}</p>
                    </div>
                    <button class="btn-remove-from-compare text-slate-400 hover:text-rose-400 p-1" data-id="${c.id}" title="Remove">
                      <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                  </div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-xl font-bold text-cyan-400 font-display">$${c.dailyPrice}</span>
                    <span class="text-slate-400 text-[10px]">/day</span>
                  </div>
                  <button class="brand-button w-full py-1.5 text-[11px] btn-compare-book" data-id="${c.id}">Reserve</button>
                </div>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr>
            <td class="p-3 text-slate-400 font-semibold">Category</td>
            ${cars.map(c => `<td class="p-3 text-white font-medium">${c.category}</td>`).join('')}
          </tr>
          <tr>
            <td class="p-3 text-slate-400 font-semibold">Horsepower</td>
            ${cars.map(c => `<td class="p-3 text-cyan-400 font-bold">${c.specs.horsepower}</td>`).join('')}
          </tr>
          <tr>
            <td class="p-3 text-slate-400 font-semibold">0-60 mph Time</td>
            ${cars.map(c => `<td class="p-3 text-white font-bold">${c.specs.acceleration}</td>`).join('')}
          </tr>
          <tr>
            <td class="p-3 text-slate-400 font-semibold">Top Speed</td>
            ${cars.map(c => `<td class="p-3 text-white">${c.specs.topSpeed}</td>`).join('')}
          </tr>
          <tr>
            <td class="p-3 text-slate-400 font-semibold">Transmission</td>
            ${cars.map(c => `<td class="p-3 text-white">${c.specs.transmission}</td>`).join('')}
          </tr>
          <tr>
            <td class="p-3 text-slate-400 font-semibold">Drive Type</td>
            ${cars.map(c => `<td class="p-3 text-white">${c.specs.driveType}</td>`).join('')}
          </tr>
          <tr>
            <td class="p-3 text-slate-400 font-semibold">Seats</td>
            ${cars.map(c => `<td class="p-3 text-white">${c.specs.seats} Persons</td>`).join('')}
          </tr>
          <tr>
            <td class="p-3 text-slate-400 font-semibold">Fuel / Powertrain</td>
            ${cars.map(c => `<td class="p-3 text-white">${c.specs.fuelType}</td>`).join('')}
          </tr>
          <tr>
            <td class="p-3 text-slate-400 font-semibold">Luggage Space</td>
            ${cars.map(c => `<td class="p-3 text-white">${c.specs.luggageCapacity}</td>`).join('')}
          </tr>
          <tr>
            <td class="p-3 text-slate-400 font-semibold">User Rating</td>
            ${cars.map(c => `<td class="p-3 text-amber-400 font-bold">&#9733; ${c.rating.toFixed(2)} (${c.reviewsCount})</td>`).join('')}
          </tr>
        </tbody>
      </table>
    `;

    lucide.createIcons();
    modal.classList.remove('hidden');

    // Remove event
    container.querySelectorAll('.btn-remove-from-compare').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        STATE.compareList = STATE.compareList.filter(cId => cId !== id);
        updateCompareDrawer();
        renderFleetGrid();
        if (STATE.compareList.length === 0) {
          modal.classList.add('hidden');
        } else {
          openComparisonModal();
        }
      });
    });

    // Book from compare
    container.querySelectorAll('.btn-compare-book').forEach(btn => {
      btn.addEventListener('click', () => {
        const car = STATE.fleet.find(c => c.id === btn.dataset.id);
        if (car) {
          modal.classList.add('hidden');
          STATE.bookingWizard.vehicle = car;
          STATE.bookingWizard.step = 1;
          openBookingWizard();
        }
      });
    });
  }

  // =========================================================================
  // 8. CUSTOMER USER DASHBOARD
  // =========================================================================
  function updateDashboardCounts() {
    const upcomingCount = STATE.bookings.filter(b => b.status === 'Upcoming' || b.status === 'Active').length;
    const totalSpent = STATE.bookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);

    const elUp = document.getElementById('dash-upcoming-count');
    const elTot = document.getElementById('dash-total-trips');
    const elFav = document.getElementById('dash-favorites-count');
    const elSpent = document.getElementById('dash-total-spent');

    if (elUp) elUp.textContent = upcomingCount;
    if (elTot) elTot.textContent = STATE.bookings.length;
    if (elFav) elFav.textContent = STATE.favorites.size;
    if (elSpent) elSpent.textContent = `$${totalSpent.toLocaleString()}`;
  }

  function openUserDashboard(initialTab = 'bookings') {
    const modal = document.getElementById('modal-user-dashboard');
    if (!modal) return;
    updateDashboardCounts();
    renderUserDashboardTab(initialTab);
    modal.classList.remove('hidden');
  }

  function renderUserDashboardTab(tab) {
    const content = document.getElementById('user-dashboard-tab-content');
    if (!content) return;

    // Tab buttons styling
    const btnBookings = document.getElementById('tab-btn-user-bookings');
    const btnFavs = document.getElementById('tab-btn-user-favorites');
    const btnProfile = document.getElementById('tab-btn-user-profile');

    [btnBookings, btnFavs, btnProfile].forEach(b => {
      if (b) {
        b.className = 'px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10';
      }
    });

    if (tab === 'bookings') {
      if (btnBookings) btnBookings.className = 'px-4 py-2 rounded-xl text-xs font-semibold tab-active';
      renderUserBookingsList(content);
    } else if (tab === 'favorites') {
      if (btnFavs) btnFavs.className = 'px-4 py-2 rounded-xl text-xs font-semibold tab-active';
      renderUserFavoritesList(content);
    } else if (tab === 'profile') {
      if (btnProfile) btnProfile.className = 'px-4 py-2 rounded-xl text-xs font-semibold tab-active';
      renderUserProfileForm(content);
    }

    lucide.createIcons();
  }

  function renderUserBookingsList(container) {
    if (STATE.bookings.length === 0) {
      container.innerHTML = `
        <div class="glass-panel p-10 text-center space-y-3">
          <i data-lucide="calendar-x" class="w-10 h-10 text-slate-400 mx-auto"></i>
          <p class="text-white font-bold text-base">No Reservations Found</p>
          <p class="text-xs text-slate-400">You haven't booked any vehicles yet. Explore our fleet to plan your next journey.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-4">
        ${STATE.bookings.map(b => `
          <div class="glass-panel p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-white/10">
            <div class="flex items-center gap-4">
              <img src="${b.carImage || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=300&q=80'}" class="w-20 h-16 rounded-xl object-cover">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-[11px] font-bold text-cyan-400">${b.id}</span>
                  <span class="status-pill ${b.status === 'Upcoming' ? 'available' : (b.status === 'Completed' ? 'available' : 'reserved')}">
                    ${b.status}
                  </span>
                </div>
                <h4 class="font-display font-bold text-white text-base">${b.carName}</h4>
                <p class="text-xs text-slate-400">${b.pickupLocation} &bull; ${b.pickupDate} &rarr; ${b.dropoffDate} (${b.days} days)</p>
              </div>
            </div>

            <div class="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2">
              <div class="text-right">
                <span class="text-[10px] text-slate-400 block">Total Rate</span>
                <span class="font-display font-extrabold text-cyan-400 text-lg">$${(b.grandTotal || 0).toLocaleString()}</span>
              </div>
              <div class="flex items-center gap-2">
                ${b.status === 'Upcoming' ? `
                  <button class="btn-cancel-booking text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-500/30" data-id="${b.id}">
                    Cancel
                  </button>
                ` : ''}
                <button class="btn-print-single-booking secondary-button text-xs px-3 py-1.5" data-id="${b.id}">
                  Receipt
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Cancel booking handler
    container.querySelectorAll('.btn-cancel-booking').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (confirm(`Are you sure you want to cancel reservation ${id}? Refund will be processed automatically.`)) {
          const booking = STATE.bookings.find(b => b.id === id);
          if (booking) {
            booking.status = 'Cancelled';
            localStorage.setItem('dv_bookings', JSON.stringify(STATE.bookings));
            updateDashboardCounts();
            renderUserBookingsList(container);
            showToast('Booking Cancelled', `Reservation ${id} has been cancelled with 100% refund.`, 'info');
          }
        }
      });
    });

    // Print receipt
    container.querySelectorAll('.btn-print-single-booking').forEach(btn => {
      btn.addEventListener('click', () => {
        window.print();
      });
    });
  }

  function renderUserFavoritesList(container) {
    const favCars = STATE.fleet.filter(c => STATE.favorites.has(c.id));

    if (favCars.length === 0) {
      container.innerHTML = `
        <div class="glass-panel p-10 text-center space-y-3">
          <i data-lucide="heart" class="w-10 h-10 text-slate-400 mx-auto"></i>
          <p class="text-white font-bold text-base">No Favorite Vehicles Saved</p>
          <p class="text-xs text-slate-400">Click the heart icon on any vehicle card to save it to your private garage.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${favCars.map(car => `
          <div class="glass-panel p-4 space-y-3">
            <div class="h-36 rounded-xl overflow-hidden bg-slate-900 relative">
              <img src="${car.image}" class="w-full h-full object-cover">
              <button class="btn-remove-fav-dash absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-rose-400" data-id="${car.id}">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
            <div>
              <p class="text-[10px] text-cyan-400 font-bold uppercase">${car.brand}</p>
              <h4 class="font-display font-bold text-white text-base">${car.model}</h4>
              <p class="text-cyan-400 font-bold text-sm mt-1">$${car.dailyPrice}/day</p>
            </div>
            <button class="brand-button w-full py-2 text-xs font-semibold btn-book-fav" data-id="${car.id}">
              Book Now
            </button>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.btn-remove-fav-dash').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.favorites.delete(btn.dataset.id);
        localStorage.setItem('dv_favorites', JSON.stringify([...STATE.favorites]));
        updateDashboardCounts();
        renderFleetGrid();
        renderUserFavoritesList(container);
      });
    });

    container.querySelectorAll('.btn-book-fav').forEach(btn => {
      btn.addEventListener('click', () => {
        const car = STATE.fleet.find(c => c.id === btn.dataset.id);
        if (car) {
          document.getElementById('modal-user-dashboard')?.classList.add('hidden');
          STATE.bookingWizard.vehicle = car;
          STATE.bookingWizard.step = 1;
          openBookingWizard();
        }
      });
    });
  }

  function renderUserProfileForm(container) {
    container.innerHTML = `
      <div class="glass-panel p-6 max-w-xl mx-auto space-y-4 text-xs">
        <h4 class="font-display font-bold text-base text-white pb-2 border-b border-white/10">Member Profile Details</h4>
        <form id="form-user-profile-update" class="space-y-4">
          <div>
            <label for="profile-name" class="block text-slate-400 mb-1">Full Legal Name</label>
            <input type="text" id="profile-name" value="${STATE.bookingWizard.customerName}" class="w-full bg-[#07111F] text-white rounded-xl p-3 border border-white/10 focus:border-cyan-400 focus:outline-none">
          </div>
          <div>
            <label for="profile-email" class="block text-slate-400 mb-1">Email Address</label>
            <input type="email" id="profile-email" value="${STATE.bookingWizard.customerEmail}" class="w-full bg-[#07111F] text-white rounded-xl p-3 border border-white/10 focus:border-cyan-400 focus:outline-none">
          </div>
          <div>
            <label for="profile-phone" class="block text-slate-400 mb-1">Phone Number</label>
            <input type="tel" id="profile-phone" value="${STATE.bookingWizard.customerPhone}" class="w-full bg-[#07111F] text-white rounded-xl p-3 border border-white/10 focus:border-cyan-400 focus:outline-none">
          </div>
          <div>
            <label for="profile-license" class="block text-slate-400 mb-1">Driver License ID</label>
            <input type="text" id="profile-license" value="${STATE.bookingWizard.customerLicense}" class="w-full bg-[#07111F] text-white rounded-xl p-3 border border-white/10 focus:border-cyan-400 focus:outline-none">
          </div>
          <button type="submit" class="brand-button w-full py-3 text-xs font-semibold">
            Save Changes
          </button>
        </form>
      </div>
    `;

    document.getElementById('form-user-profile-update')?.addEventListener('submit', (e) => {
      e.preventDefault();
      STATE.bookingWizard.customerName = document.getElementById('profile-name').value;
      STATE.bookingWizard.customerEmail = document.getElementById('profile-email').value;
      STATE.bookingWizard.customerPhone = document.getElementById('profile-phone').value;
      STATE.bookingWizard.customerLicense = document.getElementById('profile-license').value;
      showToast('Profile Saved', 'Your member details have been updated.', 'success');
    });
  }

  // =========================================================================
  // 9. ADMIN PORTAL (CRUD, FLEET, RESERVATIONS, ANALYTICS)
  // =========================================================================
  function openAdminPortal(tab = 'fleet') {
    const modal = document.getElementById('modal-admin-portal');
    if (!modal) return;
    renderAdminTab(tab);
    modal.classList.remove('hidden');
  }

  function renderAdminTab(tab) {
    const content = document.getElementById('admin-tab-content');
    if (!content) return;

    const tabFleet = document.getElementById('tab-btn-admin-fleet');
    const tabBookings = document.getElementById('tab-btn-admin-bookings');
    const tabAnalytics = document.getElementById('tab-btn-admin-analytics');

    [tabFleet, tabBookings, tabAnalytics].forEach(b => {
      if (b) b.className = 'px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 text-slate-300 hover:bg-white/10';
    });

    // Update Top Counts
    const revEl = document.getElementById('admin-total-revenue');
    const bokEl = document.getElementById('admin-total-bookings');
    const fltEl = document.getElementById('admin-active-fleet');

    const totalRev = STATE.bookings.reduce((acc, curr) => acc + (curr.grandTotal || 0), 125000);
    if (revEl) revEl.textContent = `$${totalRev.toLocaleString()}`;
    if (bokEl) bokEl.textContent = STATE.bookings.length + 58;
    if (fltEl) fltEl.textContent = STATE.fleet.length;

    if (tab === 'fleet') {
      if (tabFleet) tabFleet.className = 'px-4 py-2 rounded-xl text-xs font-semibold tab-active';
      renderAdminFleetTable(content);
    } else if (tab === 'bookings') {
      if (tabBookings) tabBookings.className = 'px-4 py-2 rounded-xl text-xs font-semibold tab-active';
      renderAdminBookingsTable(content);
    } else if (tab === 'analytics') {
      if (tabAnalytics) tabAnalytics.className = 'px-4 py-2 rounded-xl text-xs font-semibold tab-active';
      renderAdminAnalytics(content);
    }

    lucide.createIcons();
  }

  function renderAdminFleetTable(container) {
    container.innerHTML = `
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left border-collapse">
          <thead>
            <tr class="border-b border-white/10 text-slate-400">
              <th class="p-3">Vehicle</th>
              <th class="p-3">Category</th>
              <th class="p-3">Daily Rate</th>
              <th class="p-3">Assigned Hub</th>
              <th class="p-3">Rating</th>
              <th class="p-3">Status</th>
              <th class="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            ${STATE.fleet.map(car => `
              <tr class="hover:bg-white/5 transition">
                <td class="p-3 flex items-center gap-3">
                  <img src="${car.image}" class="w-12 h-10 rounded-lg object-cover">
                  <div>
                    <p class="font-bold text-white">${car.brand} ${car.model}</p>
                    <p class="text-[10px] text-slate-400">${car.year} &bull; ${car.specs.engine}</p>
                  </div>
                </td>
                <td class="p-3 text-slate-300 font-medium">${car.category}</td>
                <td class="p-3 font-mono text-cyan-400 font-bold">$${car.dailyPrice}</td>
                <td class="p-3 text-slate-300">${car.location}</td>
                <td class="p-3 text-amber-400 font-bold">&#9733; ${car.rating.toFixed(2)}</td>
                <td class="p-3">
                  <span class="status-pill ${car.available ? 'available' : 'reserved'}">
                    ${car.available ? 'Available' : 'Reserved'}
                  </span>
                </td>
                <td class="p-3 text-right space-x-2">
                  <button class="btn-admin-toggle-avail text-[11px] text-cyan-400 hover:underline" data-id="${car.id}">
                    ${car.available ? 'Set Reserved' : 'Set Available'}
                  </button>
                  <button class="btn-admin-delete-car text-slate-400 hover:text-rose-400" data-id="${car.id}" title="Delete Vehicle">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5 inline"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Availability toggle
    container.querySelectorAll('.btn-admin-toggle-avail').forEach(btn => {
      btn.addEventListener('click', () => {
        const car = STATE.fleet.find(c => c.id === btn.dataset.id);
        if (car) {
          car.available = !car.available;
          localStorage.setItem('dv_fleet', JSON.stringify(STATE.fleet));
          renderAdminFleetTable(container);
          renderFleetGrid();
          showToast('Fleet Updated', `${car.brand} ${car.model} availability set to ${car.available ? 'Available' : 'Reserved'}.`);
        }
      });
    });

    // Delete vehicle
    container.querySelectorAll('.btn-admin-delete-car').forEach(btn => {
      btn.addEventListener('click', () => {
        const car = STATE.fleet.find(c => c.id === btn.dataset.id);
        if (!car) return;
        if (confirm(`Are you sure you want to remove ${car.brand} ${car.model} from the fleet catalog?`)) {
          STATE.fleet = STATE.fleet.filter(c => c.id !== car.id);
          localStorage.setItem('dv_fleet', JSON.stringify(STATE.fleet));
          renderAdminFleetTable(container);
          renderFleetGrid();
          showToast('Vehicle Removed', `${car.brand} ${car.model} deleted from fleet.`, 'warning');
        }
      });
    });
  }

  function renderAdminBookingsTable(container) {
    container.innerHTML = `
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left border-collapse">
          <thead>
            <tr class="border-b border-white/10 text-slate-400">
              <th class="p-3">Booking ID</th>
              <th class="p-3">Customer</th>
              <th class="p-3">Vehicle</th>
              <th class="p-3">Dates & Hub</th>
              <th class="p-3">Total</th>
              <th class="p-3">Status</th>
              <th class="p-3 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            ${STATE.bookings.map(b => `
              <tr class="hover:bg-white/5 transition">
                <td class="p-3 font-mono text-cyan-400 font-bold">${b.id}</td>
                <td class="p-3">
                  <p class="font-bold text-white">${b.customerName}</p>
                  <p class="text-[10px] text-slate-400">${b.customerEmail}</p>
                </td>
                <td class="p-3 text-white font-medium">${b.carName}</td>
                <td class="p-3 text-slate-300">
                  <p>${b.pickupDate} &rarr; ${b.dropoffDate}</p>
                  <p class="text-[10px] text-slate-400">${b.pickupLocation}</p>
                </td>
                <td class="p-3 font-mono text-emerald-400 font-bold">$${(b.grandTotal || 0).toLocaleString()}</td>
                <td class="p-3">
                  <span class="status-pill ${b.status === 'Completed' ? 'available' : (b.status === 'Cancelled' ? 'reserved' : 'available')}">
                    ${b.status}
                  </span>
                </td>
                <td class="p-3 text-right">
                  <select class="admin-booking-status-select bg-[#07111F] text-[11px] text-slate-200 rounded p-1 border border-white/10" data-id="${b.id}">
                    <option value="Upcoming" ${b.status === 'Upcoming' ? 'selected' : ''}>Upcoming</option>
                    <option value="Active" ${b.status === 'Active' ? 'selected' : ''}>Active</option>
                    <option value="Completed" ${b.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                  </select>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    container.querySelectorAll('.admin-booking-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = sel.dataset.id;
        const b = STATE.bookings.find(item => item.id === id);
        if (b) {
          b.status = e.target.value;
          localStorage.setItem('dv_bookings', JSON.stringify(STATE.bookings));
          showToast('Status Updated', `Booking ${id} status set to ${b.status}.`, 'success');
        }
      });
    });
  }

  function renderAdminAnalytics(container) {
    container.innerHTML = `
      <div class="space-y-6">
        
        <!-- Revenue Bar Chart (SVG/CSS) -->
        <div class="glass-panel p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="font-display font-bold text-white text-base">Monthly Revenue Trend (2026)</h4>
            <span class="text-xs text-cyan-400 font-mono font-bold">+28.4% YoY</span>
          </div>

          <div class="h-48 flex items-end justify-between gap-3 pt-6 px-4 border-b border-white/10">
            <div class="flex-1 flex flex-col items-center gap-2">
              <span class="text-[10px] text-slate-400 font-mono">$68K</span>
              <div class="w-full bg-blue-600/40 rounded-t-lg hover:bg-cyan-500 transition-all" style="height: 55%;"></div>
              <span class="text-[10px] text-slate-400">Apr</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-2">
              <span class="text-[10px] text-slate-400 font-mono">$84K</span>
              <div class="w-full bg-blue-600/50 rounded-t-lg hover:bg-cyan-500 transition-all" style="height: 68%;"></div>
              <span class="text-[10px] text-slate-400">May</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-2">
              <span class="text-[10px] text-slate-400 font-mono">$112K</span>
              <div class="w-full bg-blue-600/70 rounded-t-lg hover:bg-cyan-500 transition-all" style="height: 82%;"></div>
              <span class="text-[10px] text-slate-400">Jun</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-2">
              <span class="text-[10px] text-slate-400 font-mono">$128K</span>
              <div class="w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-lg transition-all" style="height: 94%;"></div>
              <span class="text-[10px] text-slate-400 font-bold text-white">Jul</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-2">
              <span class="text-[10px] text-slate-400 font-mono">$148K</span>
              <div class="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg transition-all" style="height: 100%;"></div>
              <span class="text-[10px] text-slate-400 font-bold text-white">Aug</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-2">
              <span class="text-[10px] text-slate-400 font-mono">$96K</span>
              <div class="w-full bg-blue-600/60 rounded-t-lg hover:bg-cyan-500 transition-all" style="height: 75%;"></div>
              <span class="text-[10px] text-slate-400">Sep</span>
            </div>
          </div>
        </div>

        <!-- Revenue by Category -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="glass-panel p-4 space-y-2">
            <span class="text-xs text-slate-400 uppercase font-semibold">Exotic Supercars</span>
            <p class="text-2xl font-bold text-white font-display">44%</p>
            <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div class="bg-cyan-400 h-full w-[44%]"></div>
            </div>
          </div>
          <div class="glass-panel p-4 space-y-2">
            <span class="text-xs text-slate-400 uppercase font-semibold">Luxury SUVs</span>
            <p class="text-2xl font-bold text-white font-display">36%</p>
            <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div class="bg-blue-500 h-full w-[36%]"></div>
            </div>
          </div>
          <div class="glass-panel p-4 space-y-2">
            <span class="text-xs text-slate-400 uppercase font-semibold">Executive & EVs</span>
            <p class="text-2xl font-bold text-white font-display">20%</p>
            <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div class="bg-indigo-500 h-full w-[20%]"></div>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  // =========================================================================
  // 10. SPECIAL OFFERS SECTION
  // =========================================================================
  function renderSpecialOffers() {
    const container = document.getElementById('offers-container');
    if (!container) return;

    container.innerHTML = STATE.offers.map(offer => `
      <div class="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between space-y-6 border-white/10">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              ${offer.badge}
            </span>
            <span class="text-xs text-slate-400">${offer.expiryDate}</span>
          </div>

          <h3 class="font-display text-2xl font-extrabold text-white">${offer.title}</h3>
          <div class="text-3xl font-black text-cyan-400 font-display">${offer.discount}</div>
          <p class="text-xs text-slate-400 leading-relaxed">${offer.description}</p>
        </div>

        <div class="pt-4 border-t border-white/5 space-y-2">
          <div class="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/10">
            <span class="font-mono text-sm font-bold text-white tracking-widest pl-2">${offer.code}</span>
            <button class="btn-copy-code text-xs px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-black font-semibold transition" data-code="${offer.code}">
              Copy Code
            </button>
          </div>
          <button class="btn-apply-offer-direct secondary-button w-full py-2 text-xs font-semibold" data-code="${offer.code}">
            Apply to Reservation
          </button>
        </div>
      </div>
    `).join('');

    // Copy Code
    container.querySelectorAll('.btn-copy-code').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        navigator.clipboard.writeText(code).then(() => {
          showToast('Code Copied', `Promo code ${code} copied to clipboard!`, 'success');
        });
      });
    });

    // Apply Direct
    container.querySelectorAll('.btn-apply-offer-direct').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.code;
        STATE.bookingWizard.promoCode = code;
        openBookingWizard();
        showToast('Offer Activated', `Code ${code} pre-applied to your reservation wizard.`, 'success');
      });
    });
  }

  // =========================================================================
  // 11. LOCATIONS SECTION & INTERACTIVE MAP PINPOINTS
  // =========================================================================
  function renderLocations() {
    const grid = document.getElementById('locations-grid');
    const pinsContainer = document.getElementById('interactive-map-pins');
    if (!grid) return;

    // Grid Cards
    grid.innerHTML = STATE.locations.map(loc => `
      <div class="glass-panel glass-panel-hover p-4 rounded-2xl space-y-3 border-white/10 group cursor-pointer loc-card" data-city="${loc.city}">
        <div class="h-32 rounded-xl overflow-hidden bg-slate-900 relative">
          <img src="${loc.image}" alt="${loc.city}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          <span class="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-cyan-400 backdrop-blur-md">
            ${loc.tag}
          </span>
        </div>
        <div class="space-y-1">
          <h4 class="font-display font-bold text-white text-base">${loc.city}</h4>
          <p class="text-xs text-slate-400 line-clamp-1">${loc.address}</p>
          <p class="text-[11px] text-slate-400">${loc.phone}</p>
        </div>
        <div class="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
          <span class="text-emerald-400 font-medium flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            ${loc.availableVehicles} Cars Available
          </span>
          <button class="text-cyan-400 hover:underline font-semibold btn-explore-loc" data-city="${loc.city}">
            Explore &rarr;
          </button>
        </div>
      </div>
    `).join('');

    // Interactive Map Pins (Percentage based)
    if (pinsContainer) {
      const pinCoords = [
        { city: "Beverly Hills", top: "35%", left: "18%" },
        { city: "Manhattan NYC", top: "32%", left: "26%" },
        { city: "Miami Beach", top: "42%", left: "24%" },
        { city: "London Mayfair", top: "26%", left: "48%" },
        { city: "Paris Champs-Élysées", top: "29%", left: "49%" },
        { city: "Zurich Airport", top: "30%", left: "51%" },
        { city: "Munich Center", top: "29%", left: "53%" },
        { city: "Dubai Marina", top: "40%", left: "62%" }
      ];

      pinsContainer.innerHTML = pinCoords.map(p => `
        <div class="map-pin" style="top: ${p.top}; left: ${p.left};" data-city="${p.city}" title="${p.city} VIP Terminal">
          <div class="map-pin-pulse"></div>
          <div class="w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-lg shadow-cyan-400/50"></div>
        </div>
      `).join('');

      pinsContainer.querySelectorAll('.map-pin').forEach(pin => {
        pin.addEventListener('click', () => {
          const city = pin.dataset.city;
          showToast('Location Selected', `Filtered fleet to ${city} delivery hub.`);
          STATE.filters.search = city;
          const searchInput = document.getElementById('filter-search-input');
          if (searchInput) searchInput.value = city;
          renderFleetGrid();
          document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }

    grid.querySelectorAll('.btn-explore-loc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const city = btn.dataset.city;
        STATE.filters.search = city;
        const searchInput = document.getElementById('filter-search-input');
        if (searchInput) searchInput.value = city;
        renderFleetGrid();
        document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // =========================================================================
  // 12. CUSTOMER TESTIMONIALS CAROUSEL
  // =========================================================================
  function renderReviewsCarousel() {
    const track = document.getElementById('reviews-carousel-track');
    const dots = document.getElementById('reviews-dots-container');
    if (!track) return;

    track.innerHTML = STATE.reviews.map(rev => `
      <div class="w-full flex-shrink-0 px-2 sm:px-4">
        <div class="glass-panel p-8 rounded-3xl max-w-2xl mx-auto space-y-6 border-white/10">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1 text-amber-400">
              ${Array(rev.rating).fill(0).map(() => '<i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>').join('')}
            </div>
            <span class="text-xs text-slate-400">${rev.date}</span>
          </div>

          <p class="text-base sm:text-lg text-slate-200 font-normal leading-relaxed italic">
            &ldquo;${rev.comment}&rdquo;
          </p>

          <div class="flex items-center justify-between pt-4 border-t border-white/5">
            <div class="flex items-center gap-3">
              <img src="${rev.avatar}" class="w-12 h-12 rounded-full object-cover border border-cyan-400/40">
              <div>
                <p class="font-display font-bold text-white text-sm">${rev.name}</p>
                <p class="text-xs text-slate-400">${rev.role} &bull; ${rev.location}</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-[10px] text-slate-400 uppercase font-semibold">Vehicle Rented</span>
              <p class="text-xs font-bold text-cyan-400">${rev.car}</p>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    if (dots) {
      dots.innerHTML = STATE.reviews.map((_, i) => `
        <button class="review-dot-btn w-2.5 h-2.5 rounded-full transition ${i === STATE.reviewIndex ? 'bg-cyan-400 w-6' : 'bg-white/20'}" data-index="${i}"></button>
      `).join('');

      dots.querySelectorAll('.review-dot-btn').forEach(d => {
        d.addEventListener('click', () => {
          STATE.reviewIndex = parseInt(d.dataset.index, 10);
          updateReviewsCarousel();
        });
      });
    }

    lucide.createIcons();
    updateReviewsCarousel();
  }

  function updateReviewsCarousel() {
    const track = document.getElementById('reviews-carousel-track');
    const dots = document.querySelectorAll('.review-dot-btn');
    if (!track) return;

    track.style.transform = `translateX(-${STATE.reviewIndex * 100}%)`;

    dots.forEach((d, idx) => {
      if (idx === STATE.reviewIndex) {
        d.className = 'review-dot-btn h-2.5 rounded-full transition bg-cyan-400 w-6';
      } else {
        d.className = 'review-dot-btn w-2.5 h-2.5 rounded-full transition bg-white/20';
      }
    });
  }

  // =========================================================================
  // 13. FAQ ACCORDION
  // =========================================================================
  function renderFAQ() {
    const container = document.getElementById('faq-accordion-container');
    if (!container) return;

    container.innerHTML = STATE.faq.map((item, idx) => `
      <div class="glass-panel rounded-2xl overflow-hidden border-white/10">
        <button class="faq-question-btn w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none" data-index="${idx}">
          <span class="font-display font-semibold text-white text-sm sm:text-base">${item.question}</span>
          <i data-lucide="chevron-down" class="faq-chevron w-4 h-4 text-cyan-400 transition-transform duration-300"></i>
        </button>
        <div class="faq-answer-panel hidden px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
          ${item.answer}
        </div>
      </div>
    `).join('');

    lucide.createIcons();

    container.querySelectorAll('.faq-question-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const panel = btn.nextElementSibling;
        const chevron = btn.querySelector('.faq-chevron');
        const isOpen = !panel.classList.contains('hidden');

        // Close all others
        container.querySelectorAll('.faq-answer-panel').forEach(p => p.classList.add('hidden'));
        container.querySelectorAll('.faq-chevron').forEach(c => c.style.transform = 'rotate(0deg)');

        if (!isOpen) {
          panel.classList.remove('hidden');
          if (chevron) chevron.style.transform = 'rotate(180deg)';
        }
      });
    });
  }

  // =========================================================================
  // 14. QUICK SEARCH PALETTE (CTRL+K)
  // =========================================================================
  function initQuickSearchPalette() {
    const modal = document.getElementById('modal-quick-search');
    const input = document.getElementById('palette-search-input');
    const results = document.getElementById('palette-results-list');
    const btnOpen = document.getElementById('btn-open-search');
    const btnClose = document.getElementById('btn-close-palette');

    if (!modal || !input || !results) return;

    function openPalette() {
      modal.classList.remove('hidden');
      input.value = '';
      input.focus();
      renderPaletteResults('');
    }

    function closePalette() {
      modal.classList.add('hidden');
    }

    btnOpen?.addEventListener('click', openPalette);
    btnClose?.addEventListener('click', closePalette);

    document.getElementById('backdrop-quick-search')?.addEventListener('click', closePalette);

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openPalette();
      }
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closePalette();
      }
    });

    input.addEventListener('input', (e) => {
      renderPaletteResults(e.target.value);
    });

    function renderPaletteResults(query) {
      const q = query.toLowerCase().trim();
      const matches = STATE.fleet.filter(c => {
        return c.brand.toLowerCase().includes(q) ||
               c.model.toLowerCase().includes(q) ||
               c.category.toLowerCase().includes(q) ||
               c.location.toLowerCase().includes(q);
      });

      if (matches.length === 0) {
        results.innerHTML = '<p class="p-3 text-slate-400 text-center">No matching vehicles or hubs found.</p>';
        return;
      }

      results.innerHTML = matches.map(c => `
        <div class="p-3 rounded-xl hover:bg-white/10 flex items-center justify-between cursor-pointer transition palette-item" data-id="${c.id}">
          <div class="flex items-center gap-3">
            <img src="${c.image}" class="w-10 h-8 rounded-lg object-cover">
            <div>
              <p class="font-bold text-white text-xs">${c.brand} ${c.model}</p>
              <p class="text-[10px] text-slate-400">${c.category} &bull; ${c.location}</p>
            </div>
          </div>
          <span class="font-mono text-cyan-400 font-bold">$${c.dailyPrice}/d</span>
        </div>
      `).join('');

      results.querySelectorAll('.palette-item').forEach(item => {
        item.addEventListener('click', () => {
          closePalette();
          openVehicleDetailsModal(item.dataset.id);
        });
      });
    }
  }

  // =========================================================================
  // 15. EVENT LISTENERS & INITIALIZATION
  // =========================================================================
  function initEventListeners() {
    // Theme toggle buttons
    document.getElementById('btn-theme-toggle')?.addEventListener('click', toggleTheme);
    document.getElementById('btn-theme-toggle-mobile')?.addEventListener('click', toggleTheme);

    // Mobile navigation drawer
    const mobileBtn = document.getElementById('btn-mobile-menu');
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    mobileBtn?.addEventListener('click', () => {
      mobileDrawer?.classList.toggle('hidden');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer?.classList.add('hidden');
      });
    });

    // Hero quick booking search
    document.getElementById('hero-search-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const pLoc = document.getElementById('pickup-location-select').value;
      const dLoc = document.getElementById('dropoff-location-select').value;
      const pDate = document.getElementById('pickup-date').value;
      const dDate = document.getElementById('dropoff-date').value;
      const pTime = document.getElementById('pickup-time').value;
      const dTime = document.getElementById('dropoff-time').value;

      if (pLoc !== 'All Locations') {
        STATE.bookingWizard.pickupLocation = pLoc;
        STATE.filters.search = pLoc;
        const searchInput = document.getElementById('filter-search-input');
        if (searchInput) searchInput.value = pLoc;
      }
      if (dLoc !== 'Same as Pick-up') {
        STATE.bookingWizard.dropoffLocation = dLoc;
      }
      if (pDate) STATE.bookingWizard.pickupDate = pDate;
      if (dDate) STATE.bookingWizard.dropoffDate = dDate;
      if (pTime) STATE.bookingWizard.pickupTime = pTime;
      if (dTime) STATE.bookingWizard.dropoffTime = dTime;

      renderFleetGrid();
      document.getElementById('fleet')?.scrollIntoView({ behavior: 'smooth' });
      showToast('Search Parameters Updated', 'Filtered fleet based on your itinerary requirements.', 'success');
    });

    // Swap locations
    document.getElementById('btn-swap-locations')?.addEventListener('click', () => {
      const p = document.getElementById('pickup-location-select');
      const d = document.getElementById('dropoff-location-select');
      if (p && d && d.value !== 'Same as Pick-up') {
        const temp = p.value;
        p.value = d.value;
        d.value = temp;
        showToast('Locations Swapped', 'Pick-up and drop-off hubs exchanged.');
      }
    });

    // Category Tabs
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(b => {
          b.className = 'category-btn bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 whitespace-nowrap transition';
        });
        btn.className = 'category-btn tab-active px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition';
        STATE.activeCategory = btn.dataset.category;
        renderFleetGrid();
      });
    });

    // Filter Inputs
    document.getElementById('filter-search-input')?.addEventListener('input', (e) => {
      STATE.filters.search = e.target.value;
      renderFleetGrid();
    });

    document.getElementById('filter-transmission')?.addEventListener('change', (e) => {
      STATE.filters.transmission = e.target.value;
      renderFleetGrid();
    });

    document.getElementById('filter-seats')?.addEventListener('change', (e) => {
      STATE.filters.seats = e.target.value;
      renderFleetGrid();
    });

    document.getElementById('filter-sort')?.addEventListener('change', (e) => {
      STATE.filters.sort = e.target.value;
      renderFleetGrid();
    });

    // Price Slider
    const priceSlider = document.getElementById('filter-price-range');
    const priceValue = document.getElementById('price-slider-value');
    priceSlider?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      STATE.filters.maxPrice = val;
      if (priceValue) priceValue.textContent = `$${val.toLocaleString()} / day`;
      renderFleetGrid();
    });

    // Reset Filters
    const resetFn = () => {
      STATE.activeCategory = 'All';
      STATE.filters.search = '';
      STATE.filters.maxPrice = 1500;
      STATE.filters.transmission = 'All';
      STATE.filters.seats = 'All';
      STATE.filters.sort = 'featured';

      const sIn = document.getElementById('filter-search-input');
      const trIn = document.getElementById('filter-transmission');
      const stIn = document.getElementById('filter-seats');
      const soIn = document.getElementById('filter-sort');
      if (sIn) sIn.value = '';
      if (trIn) trIn.value = 'All';
      if (stIn) stIn.value = 'All';
      if (soIn) soIn.value = 'featured';
      if (priceSlider) priceSlider.value = 1500;
      if (priceValue) priceValue.textContent = '$1,500 / day';

      document.querySelectorAll('.category-btn').forEach(b => {
        b.className = b.dataset.category === 'All' 
          ? 'category-btn tab-active px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition'
          : 'category-btn bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 whitespace-nowrap transition';
      });

      renderFleetGrid();
      showToast('Filters Reset', 'Fleet catalog returned to standard view.');
    };

    document.getElementById('btn-reset-filters')?.addEventListener('click', resetFn);
    document.getElementById('btn-empty-reset')?.addEventListener('click', resetFn);

    // Notifications Dropdown Toggle
    document.getElementById('btn-toggle-notifications')?.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('dropdown-notifications')?.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      document.getElementById('dropdown-notifications')?.classList.add('hidden');
    });

    // Compare Drawer Actions
    document.getElementById('btn-clear-compare')?.addEventListener('click', () => {
      STATE.compareList = [];
      updateCompareDrawer();
      renderFleetGrid();
      showToast('Comparison Cleared', 'All vehicles removed from comparison list.');
    });

    document.getElementById('btn-trigger-compare-modal')?.addEventListener('click', openComparisonModal);
    document.getElementById('btn-open-compare-nav')?.addEventListener('click', openComparisonModal);

    // Review Carousel buttons
    document.getElementById('btn-review-prev')?.addEventListener('click', () => {
      STATE.reviewIndex = (STATE.reviewIndex - 1 + STATE.reviews.length) % STATE.reviews.length;
      updateReviewsCarousel();
    });

    document.getElementById('btn-review-next')?.addEventListener('click', () => {
      STATE.reviewIndex = (STATE.reviewIndex + 1) % STATE.reviews.length;
      updateReviewsCarousel();
    });

    // User Dashboard Modals
    document.getElementById('btn-open-user-dashboard')?.addEventListener('click', () => openUserDashboard('bookings'));
    document.getElementById('mobile-btn-user')?.addEventListener('click', () => {
      document.getElementById('mobile-menu-drawer')?.classList.add('hidden');
      openUserDashboard('bookings');
    });
    document.getElementById('btn-close-user-dashboard')?.addEventListener('click', () => {
      document.getElementById('modal-user-dashboard')?.classList.add('hidden');
    });
    document.getElementById('backdrop-user-dashboard')?.addEventListener('click', () => {
      document.getElementById('modal-user-dashboard')?.classList.add('hidden');
    });

    // User Dashboard Subtabs
    document.getElementById('tab-btn-user-bookings')?.addEventListener('click', () => renderUserDashboardTab('bookings'));
    document.getElementById('tab-btn-user-favorites')?.addEventListener('click', () => renderUserDashboardTab('favorites'));
    document.getElementById('tab-btn-user-profile')?.addEventListener('click', () => renderUserDashboardTab('profile'));

    // Admin Portal Modals
    document.getElementById('btn-open-admin-portal')?.addEventListener('click', () => openAdminPortal('fleet'));
    document.getElementById('mobile-btn-admin')?.addEventListener('click', () => {
      document.getElementById('mobile-menu-drawer')?.classList.add('hidden');
      openAdminPortal('fleet');
    });
    document.getElementById('btn-close-admin-portal')?.addEventListener('click', () => {
      document.getElementById('modal-admin-portal')?.classList.add('hidden');
    });
    document.getElementById('backdrop-admin-portal')?.addEventListener('click', () => {
      document.getElementById('modal-admin-portal')?.classList.add('hidden');
    });

    // Admin Subtabs
    document.getElementById('tab-btn-admin-fleet')?.addEventListener('click', () => renderAdminTab('fleet'));
    document.getElementById('tab-btn-admin-bookings')?.addEventListener('click', () => renderAdminTab('bookings'));
    document.getElementById('tab-btn-admin-analytics')?.addEventListener('click', () => renderAdminTab('analytics'));

    // Admin Add Vehicle Modal
    document.getElementById('btn-admin-add-vehicle')?.addEventListener('click', () => {
      document.getElementById('modal-add-vehicle')?.classList.remove('hidden');
    });
    document.getElementById('btn-close-add-vehicle')?.addEventListener('click', () => {
      document.getElementById('modal-add-vehicle')?.classList.add('hidden');
    });
    document.getElementById('backdrop-add-vehicle')?.addEventListener('click', () => {
      document.getElementById('modal-add-vehicle')?.classList.add('hidden');
    });

    document.getElementById('form-add-vehicle')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const brand = document.getElementById('new-car-brand').value;
      const model = document.getElementById('new-car-model').value;
      const year = parseInt(document.getElementById('new-car-year').value, 10);
      const category = document.getElementById('new-car-category').value;
      const price = parseInt(document.getElementById('new-car-price').value, 10);
      const image = document.getElementById('new-car-image').value;
      const hp = document.getElementById('new-car-hp').value || '650 HP';
      const a060 = document.getElementById('new-car-060').value || '3.2s';
      const loc = document.getElementById('new-car-location').value;

      const newCar = {
        id: 'dv-' + (STATE.fleet.length + 1),
        brand,
        model,
        year,
        category,
        tagline: `${brand} High Performance Engineering`,
        dailyPrice: price,
        weeklyDiscount: 0.15,
        monthlyDiscount: 0.30,
        rating: 5.0,
        reviewsCount: 1,
        available: true,
        featured: true,
        location: loc,
        image: image,
        gallery: [image],
        specs: {
          engine: "Twin-Turbo High-Output V8",
          horsepower: hp,
          acceleration: `${a060} (0-60 mph)`,
          topSpeed: "195 mph",
          transmission: "Automatic",
          driveType: "All-Wheel Drive",
          seats: 4,
          doors: 2,
          fuelType: "Petrol (Premium)",
          fuelEconomy: "16 mpg",
          luggageCapacity: "380 Liters"
        },
        features: ["Sport Exhaust", "Leather Interior", "Satellite Navigation", "Bespoke Sound"],
        insuranceTiers: [
          { id: "basic", name: "Standard Protection", pricePerDay: 0, deposit: 2500, deductible: 5000, desc: "Standard statutory liability" },
          { id: "premium", name: "Premium Shield", pricePerDay: 45, deposit: 800, deductible: 800, desc: "Collision & theft coverage" }
        ]
      };

      STATE.fleet.unshift(newCar);
      localStorage.setItem('dv_fleet', JSON.stringify(STATE.fleet));
      document.getElementById('modal-add-vehicle')?.classList.add('hidden');
      renderFleetGrid();
      renderAdminTab('fleet');
      showToast('Vehicle Added', `${brand} ${model} has been published to the active fleet!`, 'success');
    });

    // Close Modals on backdrop click or close button
    document.getElementById('btn-close-vehicle-details')?.addEventListener('click', () => {
      document.getElementById('modal-vehicle-details')?.classList.add('hidden');
    });
    document.getElementById('backdrop-vehicle-details')?.addEventListener('click', () => {
      document.getElementById('modal-vehicle-details')?.classList.add('hidden');
    });

    document.getElementById('btn-close-booking-wizard')?.addEventListener('click', () => {
      document.getElementById('modal-booking-wizard')?.classList.add('hidden');
    });
    document.getElementById('backdrop-booking-wizard')?.addEventListener('click', () => {
      document.getElementById('modal-booking-wizard')?.classList.add('hidden');
    });

    document.getElementById('btn-close-compare')?.addEventListener('click', () => {
      document.getElementById('modal-compare')?.classList.add('hidden');
    });
    document.getElementById('backdrop-compare')?.addEventListener('click', () => {
      document.getElementById('modal-compare')?.classList.add('hidden');
    });

    // Contact form submit
    document.getElementById('contact-inquiry-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      showToast('Inquiry Dispatched', `Thank you, ${name}. A DriveVault personal concierge will contact you within 15 minutes.`, 'success');
      e.target.reset();
    });

    // Newsletter submit
    document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email').value;
      showToast('Welcome to Privilege Club', `${email} has been granted early collector notices.`, 'success');
      e.target.reset();
    });
  }

  // =========================================================================
  // 16. APPLICATION BOOTSTRAP
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initStorage();
    renderFleetGrid();
    renderSpecialOffers();
    renderLocations();
    renderReviewsCarousel();
    renderFAQ();
    initQuickSearchPalette();
    initEventListeners();
    updateCompareDrawer();
    updateDashboardCounts();

    // Welcome notice
    setTimeout(() => {
      showToast('Welcome to DRIVEVAULT', 'Explore our hand-selected exotic fleet and transparent booking wizard.', 'info');
    }, 800);
  });

})();
