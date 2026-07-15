$(function () {

  if (!$('#detail-title').length) return;
  if (typeof PROPERTIES_DATA === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || 1;

  const property = PROPERTIES_DATA.find(p => p.id === id) || PROPERTIES_DATA[0];

  // ----- Fill basic info -----
  document.title = property.title + ' | HG Estates';
  $('#breadcrumb-title').text(property.title);
  $('#detail-title').text(property.title);
  $('#detail-location').html('<i class="bx bx-map"></i> ' + property.location);
  $('#detail-price').text(property.priceLabel);

  const badgeIcon = property.purpose === 'sale' ? 'bx-check-shield' : 'bx-key';
  const badgeText = property.purpose === 'sale' ? 'For Sale' : 'For Rent';
  $('#detail-badge').html('<i class="bx ' + badgeIcon + '"></i> ' + badgeText);

  $('#detail-fav-btn').attr('data-id', property.id);

  $('#stat-beds').text(property.beds > 0 ? property.beds : 'Open');
  $('#stat-baths').text(property.baths);
  $('#stat-area').text(property.area + ' sqft');
  $('#stat-furnished').text(property.furnished);

  $('#detail-description').text(property.description);

  $('#agent-name').text(property.agent);

  // ----- Features list -----
  const featuresWrap = $('#detail-features');
  featuresWrap.empty();
  property.features.forEach(feature => {
    featuresWrap.append(`
      <div class="glass-card rounded-xl p-4 flex items-center gap-2 text-sm">
        <i class="bx bx-check-circle text-emerald"></i> ${feature}
      </div>
    `);
  });

  // ----- Gallery carousel slides -----
  const galleryInner = $('#gallery-inner');
  const thumbsWrap = $('#gallery-thumbs');
  galleryInner.empty();
  thumbsWrap.empty();

  property.gallery.forEach((img, index) => {
    const activeClass = index === 0 ? 'active' : '';
    galleryInner.append(`
      <div class="carousel-item ${activeClass} h-full">
        <img src="${img}" class="w-full h-full object-cover" alt="${property.title} image ${index + 1}">
      </div>
    `);

    thumbsWrap.append(`
      <img src="${img}" data-index="${index}" class="gallery-thumb w-20 h-16 object-cover rounded-lg cursor-pointer border-2 ${index === 0 ? 'border-emerald' : 'border-transparent'} opacity-${index === 0 ? '100' : '60'} transition-all">
    `);
  });

  // ----- Thumbnail click navigates carousel -----
  const carouselEl = document.getElementById('galleryCarousel');
  const bsCarousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);

  $(document).on('click', '.gallery-thumb', function () {
    const index = $(this).data('index');
    bsCarousel.to(index);

    $('.gallery-thumb').removeClass('border-emerald opacity-100').addClass('border-transparent opacity-60');
    $(this).removeClass('border-transparent opacity-60').addClass('border-emerald opacity-100');
  });

  // Keep thumbnail highlight in sync when using carousel arrows
  carouselEl.addEventListener('slid.bs.carousel', function (e) {
    $('.gallery-thumb').removeClass('border-emerald opacity-100').addClass('border-transparent opacity-60');
    $('.gallery-thumb[data-index="' + e.to + '"]').removeClass('border-transparent opacity-60').addClass('border-emerald opacity-100');
  });

  // ----- Inquiry form fake submit -----
  $('#detail-contact-form').on('submit', function (e) {
    e.preventDefault();
    $('#detail-success-msg').removeClass('hidden');
    this.reset();
    setTimeout(() => $('#detail-success-msg').addClass('hidden'), 4000);
  });

  // ----- Recently Viewed (localStorage) -----
  const RECENT_KEY = 'hg_estates_recent';
  let recent = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  recent = recent.filter(rid => rid !== property.id);
  recent.unshift(property.id);
  recent = recent.slice(0, 6);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));

  // Trigger favorites.js to re-check active state for this page's heart button
  $(document).trigger('properties:rendered');

}); 