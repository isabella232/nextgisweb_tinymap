/*leaflet style*/

var mfcIcon = L.icon({
    iconUrl: 'icons/Mfc-icon.png',
    iconSize:     [32, 32], // size of the icon
    iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
    popupAnchor:  [1, 1] // point from which the popup should open relative to the iconAnchor
});
var tospIcon = L.icon({
    iconUrl: 'icons/Tosp-icon.png',
    iconSize:     [32, 32], // size of the icon
    iconAnchor:   [16, 16], // point of the icon which will correspond to marker's location
    popupAnchor:  [1, 1] // point from which the popup should open relative to the iconAnchor
});


var pointToLayer =  function(feature, latlng){
        switch (feature.properties.office_type) {
            case 'МФЦ':    return L.marker(latlng, {icon: mfcIcon});
            case 'ТОСП':   return L.marker(latlng, {icon: tospIcon});
            default:        return L.marker(latlng, {icon: mfcIcon});
        }
}
