$(function () {

  if (!$('#properties-grid').length) return;
  if (typeof PROPERTIES_DATA === 'undefined') return;

  let currentResults = [...PROPERTIES_DATA];

  function getUrlFilters() {
    const params = new URLSearchParams(window.location.search);
    return {
      location: params.get('location') || '',
      type: params.get('type') || '',
      budget: params.get('budget') || '',
      beds: params.get('beds') || ''
    };
  }

  function renderProperties(list) {
    const grid = $('#properties-grid');
    grid.empty();

    if (list.length === 0) {
      grid.html(`
        <div class="col-span-full text-center py-24">
          <i class="bx bx-search-alt text-6xl text-gray-600"></i>
          <h3 class="font-sora text-xl font-semibold mt-4">No Properties Found</h3>
          <p class="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
        </div>
      `);
      $('#results-count').text('0');
      return;
    }

    list.forEach((p, index) => {
      const badgeColor = p.purpose === 'sale'
        ? 'bg-emerald text-dark-900'
        : 'bg-gold text-dark-900';
      const badgeText = p.purpose === 'sale' ? 'For Sale' : 'For Rent';
      const bedsText  = p.beds > 0 ? p.beds : '—';
      const bedsLabel = p.beds > 0 ? 'Beds' : 'Open';
      const delay = (index % 3) * 100;

      const card = `
        <div class="property-card" data-aos="fade-up" data-aos-delay="${delay}">

          <div class="card-img-wrap relative" style="height:240px;">
            <img
              src="${p.image}"
              class="w-full h-full object-cover"
              alt="${p.title}"
              loading="lazy"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

            <span class="absolute top-4 left-4 ${badgeColor} text-xs font-bold px-3 py-1 rounded-full z-10">
              ${badgeText}
            </span>

            <button class="fav-btn absolute top-4 right-4 z-10" data-id="${p.id}">
              <i class="bx bx-heart text-base"></i>
            </button>

            <button class="compare-btn absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-dark-900/70 backdrop-blur-sm border border-white/10 text-xs font-medium px-3 py-1.5 rounded-full hover:border-emerald/50 hover:text-emerald transition-all" data-id="${p.id}">
              <i class="bx bx-git-compare text-sm"></i> Compare
            </button>

            <div class="absolute bottom-4 left-4 z-10">
              <p class="font-sora text-xl font-bold text-white drop-shadow-lg">${p.priceLabel}</p>
            </div>
          </div>

          <div class="p-5">
            <h3 class="font-sora font-semibold text-base leading-snug mb-1">${p.title}</h3>
            <p class="text-gray-400 text-sm flex items-center gap-1.5 mb-3">
              <i class="bx bx-map text-emerald flex-shrink-0"></i>
              <span class="truncate">${p.location}</span>
            </p>

            <div class="property-info-row">
              <div class="property-info-item">
                <i class="bx bx-bed"></i>
                <span class="info-value">${bedsText}</span>
                <span class="info-label">${bedsLabel}</span>
              </div>
              <div class="property-info-item">
                <i class="bx bx-bath"></i>
                <span class="info-value">${p.baths}</span>
                <span class="info-label">Baths</span>
              </div>
              <div class="property-info-item">
                <i class="bx bx-area"></i>
                <span class="info-value">${p.area.toLocaleString()}</span>
                <span class="info-label">Sqft</span>
              </div>
              <div class="property-info-item">
                <i class="bx bx-sofa"></i>
                <span class="info-value" style="font-size:0.7rem">${p.furnished.split('-')[0]}</span>
                <span class="info-label">Status</span>
              </div>
            </div>

            <a href="property-details.html?id=${p.id}" class="btn-primary w-full text-center block mt-4">
              View Details
            </a>
          </div>
        </div>
      `;
      grid.append(card);
    });

    $('#results-count').text(list.length);
    if (typeof AOS !== 'undefined') AOS.refreshHard();
    $(document).trigger('properties:rendered');
  }

  function applyFilters() {
    let results = [...PROPERTIES_DATA];

    const purpose   = $('#filter-purpose').val();
    const type      = $('#filter-type').val();
    const city      = $('#filter-city').val();
    const beds      = $('#filter-beds').val();
    const baths     = $('#filter-baths').val();
    const furnished = $('#filter-furnished').val();
    const maxPrice  = $('#filter-price-range').val();
    const searchText = $('#filter-search-text').val();

    if (purpose) results = results.filter(p => p.purpose === purpose);
    if (type)    results = results.filter(p => p.type === type);
    if (city)    results = results.filter(p => p.city === city);
    if (beds) {
      if (beds === '4+') results = results.filter(p => p.beds >= 4);
      else results = results.filter(p => p.beds === parseInt(beds));
    }
    if (baths) {
      if (baths === '4+') results = results.filter(p => p.baths >= 4);
      else results = results.filter(p => p.baths === parseInt(baths));
    }
    if (furnished) results = results.filter(p => p.furnished === furnished);
    if (maxPrice)  results = results.filter(p => p.price <= parseFloat(maxPrice));
    if (searchText) {
      const term = searchText.toLowerCase();
      results = results.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term) ||
        p.city.toLowerCase().includes(term)
      );
    }

    const sortBy = $('#filter-sort').val();
    if (sortBy === 'price-asc')  results.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') results.sort((a, b) => b.price - a.price);
    if (sortBy === 'newest')     results.sort((a, b) => b.id - a.id);

    currentResults = results;
    renderProperties(results);
  }

  function applyInitialUrlFilters() {
    const urlFilters = getUrlFilters();
    if (urlFilters.location) $('#filter-city').val(urlFilters.location);
    if (urlFilters.type)     $('#filter-type').val(urlFilters.type);
    if (urlFilters.beds)     $('#filter-beds').val(urlFilters.beds);
    applyFilters();
  }

  $('#filter-purpose, #filter-type, #filter-city, #filter-beds, #filter-baths, #filter-furnished, #filter-sort, #filter-price-range')
    .on('change input', applyFilters);

  $('#filter-search-text').on('input', function () {
    clearTimeout(window.searchDebounce);
    window.searchDebounce = setTimeout(applyFilters, 300);
  });

  $('#reset-filters').on('click', function () {
    $('#filter-purpose, #filter-type, #filter-city, #filter-beds, #filter-baths, #filter-furnished, #filter-sort').val('');
    $('#filter-search-text').val('');
    $('#filter-price-range').val($('#filter-price-range').attr('max'));
    $('#filter-price-display').text('$1,300,000');
    applyFilters();
  });

  applyInitialUrlFilters();
}); 