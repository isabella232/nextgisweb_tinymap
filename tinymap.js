


function getXmlHttpObject() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
    return null;
}


var map;
var ajaxRequest;
var plotlist;
var ngwLayerGroup
var plotlayers=[];
var nRequest = new Array;


//var ngwLayerURL='http://78.46.100.76/opendata_ngw/api/resource/586'    //production
var ngwLayerURL='http://176.9.38.120/practice2/api/resource/29'     //debug







		var standartIcon = L.icon({
			iconUrl: 'icons/moi_dokumenty.png',
			iconSize: [30, 30],
			iconAnchor: [15, 15],
			popupAnchor: [0, -28]
		});


var standartIcon = L.icon({
    iconUrl: 'icons/moi_dokumenty.png',
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [32, 42], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [16, 21], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [1, 1] // point from which the popup should open relative to the iconAnchor



});






function initmap() {

    // set up AJAX request
    ajaxRequest = getXmlHttpObject();
    if (ajaxRequest == null) {
        alert("This browser does not support HTTP Request");
        return;
    }

    nRequest['geodata'] = getXmlHttpObject();
    if (nRequest['geodata'] == null) {
        alert("This browser does not support HTTP Request");
        return;
    }

    nRequest['aliaces'] = getXmlHttpObject();
    if (nRequest['aliaces'] == null) {
        alert("This browser does not support HTTP Request");
        return;
    }

	// set up the map
	map = new L.Map('map');

	// create the tile layer with correct attribution
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://primorsky.ru/">Официальный сайт Администрации Приморского края</a>';
	var osm = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 18, attribution: osmAttrib});		


	// start the map in South-East England
	map.setView(new L.LatLng(120, 37.7),6);
	map.addLayer(osm);
    map.fitWorld();

    ngwLayerGroup = L.featureGroup().addTo(map);

    console.log('start askforplots');
	askForPlots();
	map.on('moveend', onMapMove);

    //set map extent to bbox of ngwLayers
    setTimeout(function(){ console.log("timeout done");map.fitBounds(ngwLayerGroup.getBounds().pad(0.5));}, 500);    //taken from https://groups.google.com/forum/#!topic/leaflet-vector-layers/5Fbhv26mmUI


    //get layer aliases from ngw

    aliases=getNGWAliases(ngwLayerURL);
}

function addDataToMap(data, map) {
    var dataLayer = L.geoJson(data);

    dataLayer.addTo(map);
}

function askForPlots() {
	// request the marker info with AJAX for the current bounds
	var bounds=map.getBounds();
	var minll=bounds.getSouthWest();
	var maxll=bounds.getNorthEast();

    var msg=ngwLayerURL+'/geojson';

	nRequest['geodata'].onreadystatechange = stateChanged;
	nRequest['geodata'].open('GET', msg, true);
	nRequest['geodata'].send(null);
}




function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?

    if (feature.type && feature.id) {

        
        //layer.bindPopup(' ');

    layer.on({
        click: whenClicked
    });

    }
}


function stateChanged() {
    
	// if AJAX returned a list of markers, add them to the map
	if (nRequest['geodata'].readyState==4) {
		//use the info here that was returned
		if (nRequest['geodata'].status==200) {


            geojson = eval("(" + nRequest['geodata'].responseText + ")");
			//map.clearLayers();
            ngwLayerGroup.clearLayers();
            //alert('removed');
            //addDataToMap(geojson, map);


        proj4.defs("EPSG:3857","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");

        console.log('start add geojson');
        geojsonLayer = L.Proj.geoJson(geojson,{
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        //return L.circleMarker(latlng, geojsonMarkerOptions);
return L.marker(latlng, {icon: standartIcon});

    }
});//.addTo(map);
        ngwLayerGroup.addLayer(geojsonLayer);

		}
	}
}


function getPopupHTML(feature,aliases) {

    data=feature.properties;

    var header = '<h3>Название объекта для идентификации</h3>  <div  style="height:300px;  overflow-y: auto;">'
    var footer='</div>'
    var content='';

    content=content+'<table>';
    for (var key in data) {
        let value = data[key];
        content=content+'<tr><td>'+key+'</td><td>'+value+'</td><tr>';
    }
    content=content+'</table>';
    return header+content+footer;

}

//<div style="overflow-y: scroll;">

function whenClicked(e) {

    //var url=ngwLayerURL+'/feature/'+String(e.target.feature.id);

    //featureData=queryGetFeatureInfo(e);

    //console.log(e.target.feature);


    var feature;
    var aliases; 

    popupHTML = getPopupHTML(e.target.feature,aliases);


    var popup = new L.Popup();
    popup.setLatLng(e.latlng);
    popup.setContent(popupHTML);
    map.openPopup(popup);



}



function getNGWAliases(url)
{

    url1=url+'';//sample: http://176.9.38.120/practice2/api/resource/29
    console.log('get aliases   '+url1);


	nRequest['aliaces'].onreadystatechange = function() {
if (nRequest['aliaces'].readyState==4) {
		if (nRequest['aliaces'].status==200) {
            data = eval("(" + nRequest['aliaces'].responseText + ")");
            console.log('we get data')
            console.log(data);
		}
	}

}; //end onreadystatechange 
	nRequest['aliaces'].open('GET', url1, true);
	nRequest['aliaces'].send(null);
}







function onMapMove(e) { askForPlots(); }

initmap();
