$(function () {

  const FAV_KEY = 'hg_estates_favorites';

  // ----- Get favorites from localStorage -----
  function getFavorites() {
    const data = localStorage.getItem(FAV_KEY);
    return data ? JSON.parse(data) : [];
  }

  // ----- Save favorites to localStorage -----
  function saveFavorites(favorites) {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }

  // ----- Update navbar heart count badge -----
  function updateFavCount() {
    const favorites = getFavorites();
    $('#fav-count').text(favorites.length);

    if (favorites.length > 0) {
      $('#fav-count').removeClass('scale-0').addClass('scale-100');
    }
  }

  // ----- Mark already-favorited buttons as active on page load -----
  function markActiveButtons() {
    const favorites = getFavorites();
    $('.fav-btn').each(function () {
      const id = $(this).data('id').toString();
      if (favorites.includes(id)) {
        $(this).addClass('active');
        $(this).find('i').removeClass('bx-heart').addClass('bxs-heart');
      }
    });
  }

  // ----- Toggle favorite on click -----
  $(document).on('click', '.fav-btn', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const id = $(this).data('id').toString();
    let favorites = getFavorites();

    if (favorites.includes(id)) {
      // Remove from favorites
      favorites = favorites.filter(favId => favId !== id);
      $(this).removeClass('active');
      $(this).find('i').removeClass('bxs-heart').addClass('bx-heart');
    } else {
      // Add to favorites
      favorites.push(id);
      $(this).addClass('active');
      $(this).find('i').removeClass('bx-heart').addClass('bxs-heart');

      // Small pop animation on click
      $(this).css('transform', 'scale(1.3)');
      setTimeout(() => { $(this).css('transform', 'scale(1)'); }, 200);
    }

    saveFavorites(favorites);
    updateFavCount();
  });

// ----- Render Favorites Page Grid -----
  function renderFavoritesPage() {
    const grid = $('#favorites-grid');
    if (!grid.length) return; // only run on favorites.html
    if (typeof PROPERTIES_DATA === 'undefined') return;

    const favIds = getFavorites().map(id => parseInt(id));
    const favProperties = PROPERTIES_DATA.filter(p => favIds.includes(p.id));

    grid.empty();
    $('#fav-results-count').text(favProperties.length);

    if (favProperties.length === 0) {
      $('#favorites-empty-state').removeClass('hidden');
      return;
    }
    $('#favorites-empty-state').addClass('hidden');

    favProperties.forEach((p, index) => {
      const badgeColor = p.purpose === 'sale' ? 'bg-emerald' : 'bg-gold';
      const badgeText = p.purpose === 'sale' ? 'For Sale' : 'For Rent';
      const bedsText = p.beds > 0 ? p.beds + ' Beds' : 'Open Plan';

      grid.append(`
        <div class="property-card" data-aos="fade-up" data-aos-delay="${(index % 3) * 100}">
          <div class="card-img-wrap relative h-64">
            <img src="${p.image}" class="w-full h-full object-cover" alt="${p.title}">
            <span class="absolute top-4 left-4 ${badgeColor} text-dark-900 text-xs font-bold px-3 py-1 rounded-full">${badgeText}</span>
            <button class="fav-btn absolute top-4 right-4 active" data-id="${p.id}"><i class="bx bxs-heart text-lg text-white"></i></button>
          </div>
          <div class="p-5">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-sora font-semibold text-lg">${p.title}</h3>
              <span class="text-emerald font-bold">${p.priceLabel}</span>
            </div>
            <p class="text-gray-400 text-sm flex items-center gap-1 mb-4"><i class="bx bx-map"></i> ${p.location}</p>
            <div class="flex items-center justify-between text-gray-400 text-sm border-t border-white/5 pt-4">
              <span class="flex items-center gap-1"><i class="bx bx-bed"></i> ${bedsText}</span>
              <span class="flex items-center gap-1"><i class="bx bx-bath"></i> ${p.baths} Baths</span>
              <span class="flex items-center gap-1"><i class="bx bx-area"></i> ${p.area} sqft</span>
            </div>
            <a href="property-details.html?id=${p.id}" class="btn-primary w-full text-center block mt-5">View Details</a>
          </div>
        </div>
      `);
    });

    if (typeof AOS !== 'undefined') AOS.refreshHard();
  }

  // ----- Clear all favorites (favorites.html only) -----
  $('#clear-all-favorites').on('click', function () {
    if (getFavorites().length === 0) return;
    if (confirm('Remove all saved properties?')) {
      saveFavorites([]);
      updateFavCount();
      renderFavoritesPage();
    }
  });

  // Re-render the favorites page whenever a heart is toggled anywhere
  $(document).on('click', '.fav-btn', function () {
    setTimeout(renderFavoritesPage, 50);
  });

  // ----- Init on page load -----
  markActiveButtons();
  updateFavCount();
  renderFavoritesPage();

  $(document).on('properties:rendered', function () {
    markActiveButtons();
  });

});