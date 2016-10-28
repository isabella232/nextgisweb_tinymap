
//http://176.9.38.120/practice2/api/resource/31
var config = {
  NGWLayerURL: 'http://trolleway.nextgis.com/api/resource/721',

NGWPhotoThumbnailSize : '400x300',
NGWLayerAttribution:'<a href="http://primorsky.ru/">Отделения "Мои Документы": Официальный сайт Администрации Приморского края</a>',
   DefaultBBOXMode:'manual',        //Optional
    lat:43.8,                       //Optional
    lon:134.6,                      //Optional
    zoom:8,                         //Optional

}

    config.overlays={

        //Optional TMS overlays
        'Границы'  :new L.TileLayer('http://trolleway.nextgis.com/ngw/api/component/render/tile?resource=723&z={z}&x={x}&y={y}', {minZoom: 0, maxZoom: 18, attribution: 'Слой границ районов: cc-by-sa Openstreetmap'}),

    };
