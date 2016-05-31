

var config = {
    NGWLayerURL: 'http://176.9.38.120/practice2/api/resource/31', 
    NGWPhotoThumbnailSize : '400x300',
    NGWLayerAttribution:'<a href="http://nextgis.ru/">NextGIS</a>',

//   DefaultBBOXMode:'manual',        //Optional
//    lat:43.8,                       //Optional
//    lon:134.6,                      //Optional
//    zoom:8,                         //Optional

}


	var tmsUrl='http://opendata25.primorsky.ru/ngw/api/component/render/tile?resource=535&z={z}&x={x}&y={y}';
	var tmsAttrib='Слой границ';
	var tmsBoundaries = new L.TileLayer(tmsUrl, {minZoom: 0, maxZoom: 18, attribution: tmsAttrib});	
    config_overlays={'Границы':tmsBoundaries};


    config.overlays=config_overlays;
