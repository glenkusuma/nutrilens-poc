// filepath: ./src/components/navigation.js

/**
 * Setup the bottom navigation bar with active state handling
 * @param {HTMLElement} navEl - The navigation element to setup
 */
function setupBottomNav(navEl) {
  // Set initial state
  updateActiveNav(navEl);

  // Add event listener to update active nav item on hash change
  window.addEventListener('hashchange', () => updateActiveNav(navEl));
}

/**
 * Updates the active state of navigation items based on current URL hash
 * @param {HTMLElement} navEl - The navigation element to update
 */
function updateActiveNav(navEl) {
  const hash = window.location.hash || '';

  // Find all nav links
  const navLinks = navEl.querySelectorAll('a');

  // Remove active class from all links
  navLinks.forEach((link) => {
    link.classList.remove('text-green-500');
    link.classList.add('text-gray-500');
  });

  // Add active class to current link
  let activeSet = false;

  // First check for exact matches
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (hash === href) {
      link.classList.remove('text-gray-500');
      link.classList.add('text-green-500');
      activeSet = true;
    }
  });

  // Then check for partial matches if no exact match was found
  if (!activeSet) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href !== '#/' && hash.startsWith(href)) {
        link.classList.remove('text-gray-500');
        link.classList.add('text-green-500');
        activeSet = true;
      }
    });
  }

  // If no active link was set and we're on home (empty or '#/' hash)
  if (!activeSet && (hash === '' || hash === '#/')) {
    const homeLink = navEl.querySelector('a[href="#/"]');
    if (homeLink) {
      homeLink.classList.remove('text-gray-500');
      homeLink.classList.add('text-green-500');
    }
  }
}

/**
 * Initializes the bottom navigation bar
 * @param {HTMLElement} navEl - The element to render the navigation into
 */
function initNavigation(navEl) {
  navEl.innerHTML = /*HTML*/ `
    <div class="fixed bottom-0 left-0 right-0 bg-white border-gray-200 py-2 sm:pb-0">
      <div class="grid h-full max-w-lg grid-cols-2 mx-auto">
        <a href="#/" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 text-gray-500">
          <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
          </svg>
          <span class="text-sm">Home</span>
        </a>
        <a href="#/scan" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 text-gray-500">
          <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17h6M9 13h6m-6-4h6m-8-3H3v14h18V6h-4M8 6V4h8v2H8Z"/>
          </svg>
          <span class="text-sm">Scan</span>
        </a>
      </div>
    </div>
  `;

  // Setup the bottom nav
  setupBottomNav(navEl);
}

export { initNavigation, updateActiveNav };
