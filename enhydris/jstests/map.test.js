enhydris = {
  mapViewport: [24, 38, 25, 39],
};
require('../static/js/enhydris');

enhydris.map.leafletMap = {
  fitBounds: jest.fn(),
};
window = {}; // eslint-disable-line no-global-assign

describe('setupViewport', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  function checkForCalledWith(expectedLat1, expectedLon1, expectedLat2, expectedLon2) {
    expect(enhydris.map.leafletMap.fitBounds).toHaveBeenCalledTimes(1);
    const [arg] = enhydris.map.leafletMap.fitBounds.mock.calls[0];
    const [latlon1, latlon2] = arg;
    const [lat1, lon1] = latlon1;
    const [lat2, lon2] = latlon2;
    expect(lat1).toBeCloseTo(expectedLat1);
    expect(lon1).toBeCloseTo(expectedLon1);
    expect(lat2).toBeCloseTo(expectedLat2);
    expect(lon2).toBeCloseTo(expectedLon2);
  }

  test('use whole map in small widths', () => {
    window.innerWidth = 992;
    enhydris.map.setupViewport();
    checkForCalledWith(38, 24, 39, 25);
  });

  test('use whole map in small widths with search result', () => {
    window.innerWidth = 992;
    document.body.innerHTML = '<div class="map map-fullpage with-search-result"></div>';
    enhydris.map.setupViewport();
    checkForCalledWith(38, 24, 39, 25);
  });

  test('use part of map in large widths with search result', () => {
    window.innerWidth = 993;
    document.querySelector = (selector) => {
      if (selector === '.with-search-result') {
        return 'mapDiv';
      }
      if (selector === '.search-content-wrapper') {
        return 'searchContentWrapper';
      }
      if (selector === '.search-result') {
        return { clientWidth: 440 };
      }
      return null;
    };
    window.getComputedStyle = (element) => (
      element === 'searchContentWrapper' ? { marginLeft: 50, paddingLeft: 100 } : null
    );
    enhydris.map.setupViewport();
    /* The screen is 993 px wide, but only the rightmost 993 - 440 - 50 - 100 = 403 px
     * are clear, so the viewport should be set so that the rightmost 403 px show the
     * requested 24-25 degrees. The entire 993px-wide map should therefore
     * be 993/403*(25-24) = 2.464 degrees wide; it should therefore span
     * 22.536-25 degrees.
     */
    checkForCalledWith(38, 22.536, 39, 25);
  });
});
