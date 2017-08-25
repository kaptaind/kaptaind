'use strict';

$(document).ready(function () {

    // Realtime visitors widget map
    if($('.map-visitors')[0]) {
        $('.map-visitors').vectorMap({
            map: 'world_en',
            backgroundColor: '#fff',
            color: '#ebebeb',
            borderColor: '#ebebeb',
            hoverOpacity: 1,
            selectedColor: '#00BCD4',
            enableZoom: false,
            showTooltip: true,
            normalizeFunction: 'polynomial',
            selectedRegions: ['US', 'EN', 'NZ', 'CN', 'JP', 'SL', 'BR', 'AU'],
            onRegionClick: function (event) {
                event.preventDefault();
            }
        });
    }
});