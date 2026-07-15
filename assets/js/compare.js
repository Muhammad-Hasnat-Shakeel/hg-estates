$(function () {

  const COMPARE_KEY = 'hg_estates_compare';
  const MAX_COMPARE = 3;

  function getCompareList() {
    const data = localStorage.getItem(COMPARE_KEY);
    return data ? JSON.parse(data) : [];
  }

  function saveCompareList(list) {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
  }

  function updateCompareBar() {
    const list = getCompareList();
    const bar = $('#compare-bar');

    if (!bar.length) return; // bar only exists on properties.html

    if (list.length === 0) {
      bar.addClass('translate-y-full opacity-0');
      return;
    }

    bar.removeClass('translate-y-full opacity-0');
    $('#compare-count-text').text(list.length + ' / ' + MAX_COMPARE + ' selected');

    const thumbs = $('#compare-thumbs');
    thumbs.empty();

    list.forEach(id => {
      const property = (typeof PROPERTIES_DATA !== 'undefined')
        ? PROPERTIES_DATA.find(p => p.id === parseInt(id))
        : null;
      if (!property) return;

      thumbs.append(`
        <div class="relative">
          <img src="${property.image}" class="w-14 h-14 rounded-lg object-cover border border-emerald/40" alt="${property.title}">
          <button class="compare-remove-btn absolute -top-2 -right-2 w-5 h-5 bg-dark-900 rounded-full flex items-center justify-center border border-white/20" data-id="${id}">
            <i class="bx bx-x text-xs"></i>
          </button>
        </div>
      `);
    });

    $('#compare-now-btn').prop('disabled', list.length < 2);
  }

  function markActiveCompareButtons() {
    const list = getCompareList();
    $('.compare-btn').each(function () {
      const id = $(this).data('id').toString();
      if (list.includes(id)) {
        $(this).addClass('active bg-emerald/90');
      } else {
        $(this).removeClass('active bg-emerald/90');
      }
    });
  }

  // ----- Toggle compare on click -----
  $(document).on('click', '.compare-btn', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const id = $(this).data('id').toString();
    let list = getCompareList();

    if (list.includes(id)) {
      list = list.filter(itemId => itemId !== id);
    } else {
      if (list.length >= MAX_COMPARE) {
        alert('You can compare a maximum of ' + MAX_COMPARE + ' properties at a time.');
        return;
      }
      list.push(id);
    }

    saveCompareList(list);
    markActiveCompareButtons();
    updateCompareBar();
  });

  // ----- Remove from the floating compare bar -----
  $(document).on('click', '.compare-remove-btn', function () {
    const id = $(this).data('id').toString();
    let list = getCompareList();
    list = list.filter(itemId => itemId !== id);
    saveCompareList(list);
    markActiveCompareButtons();
    updateCompareBar();
  });

  // ----- Clear all -----
  $(document).on('click', '#compare-clear-btn', function () {
    saveCompareList([]);
    markActiveCompareButtons();
    updateCompareBar();
  });

  // ----- Re-mark buttons whenever the grid re-renders (from search-filter.js) -----
  $(document).on('properties:rendered', function () {
    markActiveCompareButtons();
  });

  // ----- Init -----
  markActiveCompareButtons();
  updateCompareBar();

});