


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

var LayerDescription = new Array;


var ngwLayerURL = config.ngwLayerURL;

if (config.NGWPhotoThumbnailSize) {

    var NGWPhotoThumbnailSize=config.NGWPhotoThumbnailSize;
}
else
{
    var NGWPhotoThumbnailSize='400x300';
}




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


	askForPlots();
	map.on('moveend', onMapMove);

    //set map extent to bbox of ngwLayers
    setTimeout(function(){ map.fitBounds(ngwLayerGroup.getBounds().pad(0.8));}, 900);    //taken from https://groups.google.com/forum/#!topic/leaflet-vector-layers/5Fbhv26mmUI


    //get layer aliases from ngw

    //LayerDescription=getNGWDescribeFeatureType(ngwLayerURL);
    getNGWDescribeFeatureType(ngwLayerURL);





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

    var msg=ngwLayerURL+'/feature/';

	nRequest['geodata'].onreadystatechange = stateChanged;
	nRequest['geodata'].open('GET', msg, true);
	nRequest['geodata'].send(null);
}




function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?

    if (feature.type && feature.id) {

    layer.on({
        click: whenClicked
    });

    }
}



function GeoJSONGeom2NGWFeatureGeom(geom)
{


parcedWKT=omnivore.wkt.parse(geom);
t=parcedWKT._layers[Object.keys(parcedWKT._layers)[0]].feature.geometry;



return t;
}

function feature2geojson(features){

geojson={};

geojson=JSON.parse('{"crs": {"type": "name", "properties": {"name": "EPSG:3857"}}, "type": "FeatureCollection"}');
geojson['features']=[];



  for (var key in features) {
        feature=features[key];
        fields=feature.fields;
        geojsonFeature={};

        
        geojsonFeature.type="Feature";
        geojsonFeature['geometry']=GeoJSONGeom2NGWFeatureGeom(feature.geom);
        geojsonFeature['properties']=feature.fields;
        geojsonFeature['id']=feature.id;
        geojsonFeature['extensions']={};
        geojsonFeature['extensions']=feature['extensions'];
    
        geojson['features'].push(geojsonFeature);

        //if (value.label_field) {
        //var featureNameField=key;
        //}
    }

return geojson;
}

function stateChanged() {
    
	// if AJAX returned a list of markers, add them to the map
	if (nRequest['geodata'].readyState==4) {
		//use the info here that was returned
		if (nRequest['geodata'].status==200) {


            feature = eval("(" + nRequest['geodata'].responseText + ")");
            geojson = feature2geojson(feature);


			//map.clearLayers();
            ngwLayerGroup.clearLayers();
            //alert('removed');
            //addDataToMap(geojson, map);

    
            sampleString='{"crs": {"type": "name", "properties": {"name": "EPSG:3857"}}, "type": "FeatureCollection", "features": [{"geometry": {"type": "MultiPoint", "coordinates": [[14690369.33878462, 5325725.368936633]]}, "type": "Feature", "properties": {"website": "http://mfc-25.ru", "name_short": "МФЦ Приморского края", "name_official": "Краевое государственное автономное учреждение Приморского края «Многофункциональный центр предоставления государственных и муниципальных услуг в Приморском крае» (КГАУ «МФЦ Приморского края»)", "square": "702", "addr": "690080, Приморский край. г. Владивосток, ул. Борисенко д. 102", "windows": "16", "opening_hours": "пн:  09:00-18:00 (по предварительной записи)вт: 09:00-20:00ср: 11:00-20:00чт: 09:00-20:00пт: 09:00-20:00 сб: 09:00-13:00 вс: выходной", "phone_consult": "(423) 201-01-56", "services_info": "Ознакомиться с авлении.", "director": "Александров Сергей Валерьевич", "issue_info": "ответственность должностных лиц органов государственной власти и учреждений, предоставляющих государственные и муниципальные услуги; информация о порядке возмещения вреда, причиненного заявителю в результате ненадлежащего исполнения либо неисполнения Центром или его работниками обязанностей; информация об обжаловании действий (бездействия), а также решений органов, предоставляющих государственные услуги, и органов, предоставляющих муниципальные услуги, государственных и муниципальных служащих, работников центров государственных и муниципальных услуг;", "start_date": "2013/12/30", "desc": "Центр создан в целльством Российской Федерации."}, "id": 1}]}';
            //geojson=JSON.parse(sampleString);


            proj4.defs("EPSG:3857","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");

            geojsonLayer = L.Proj.geoJson(geojson,{
            onEachFeature: onEachFeature,
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {icon: standartIcon});
                }
            });
            ngwLayerGroup.addLayer(geojsonLayer);

		}
	}
}


function getPopupHTML(feature,FieldsDescriptions) {

    data=feature.properties;

    var hideEmptyFields=true;
    
 

    //get name for identify
    
    for (var key in FieldsDescriptions) {
        value=FieldsDescriptions[key];
        if (value.label_field) {
        var featureNameField=key;
        }
    }



    //photo

    var photos=[];

    for (var key in feature.extensions.attachment) {
        
        attachment=feature.extensions.attachment[key];
        
        if (attachment.is_image) {
        var featureNameField=key;
        photos.push(attachment);
        }
    }

    // html
    
    var header = '';
    
    if (featureNameField) { 
        if (data[featureNameField]) {
        var header = header + '<div id="identifyFeatureName">'+data[featureNameField]+'</div>'; 
        }
    }

    
    var header = header + '<div  style="height:300px;  overflow-y: auto;">';
    var footer='</div>';
    var content='';

    content=content+'<table>';
    for (var key in data) {
        value = data[key];
        if (FieldsDescriptions[key].grid_visibility) {
            content=content+'<tr><td>'+FieldsDescriptions[key].display_name+'</td><td>'+value+'</td><tr>';
        }
    }
    content=content+'</table>';


        for (var key in photos) {
        photo=photos[key];
        content=content+'<a target="_blank" href="'+ngwLayerURL+'/feature/'+feature.id+'/attachment/'+photo.id+'/download"><img src="'+ngwLayerURL+'/feature/'+feature.id+'/attachment/'+photo.id+'/image?size='+NGWPhotoThumbnailSize+'" >'+'</img></a>';
        
    }


    return header+content+footer;

}

//<div style="overflow-y: scroll;">

function whenClicked(e) {

    //var url=ngwLayerURL+'/feature/'+String(e.target.feature.id);

    //featureData=queryGetFeatureInfo(e);



    var feature;
    var aliases; 

    popupHTML = getPopupHTML(e.target.feature,LayerDescription);


    var divNode = document.createElement('DIV');
    divNode.innerHTML = popupHTML;

    var popup = new L.Popup({maxWidth:500});
    popup.setLatLng(e.latlng);
    popup.setContent(divNode);



function onPopupImageLoad() {
    marker._popup._update();
}

/*
var images = popup.contentNode.getElementsByTagName('img');

for (var i = 0, len = images.length; i < len; i++) {
    images[i].onload = onPopupImageLoad;
}

*/
    map.openPopup(popup);







}



function getNGWDescribeFeatureType(url)
{

    url1=url+'';//sample: http://176.9.38.120/practice2/api/resource/29



	nRequest['aliaces'].onreadystatechange = function() {
if (nRequest['aliaces'].readyState==4) {
		if (nRequest['aliaces'].status==200) {
            data = eval("(" + nRequest['aliaces'].responseText + ")");
            var attrInfo={};

            fieldsInfo=data.feature_layer.fields;

                for (var key in fieldsInfo) {
               attrInfo[fieldsInfo[key].keyname]=fieldsInfo[key];

                }
            LayerDescription = attrInfo;    //put to global variable
            return attrInfo;

		}
	}

}; //end onreadystatechange 
	nRequest['aliaces'].open('GET', url1, true);
	nRequest['aliaces'].send(null);
}







function onMapMove(e) { askForPlots(); }

initmap();
