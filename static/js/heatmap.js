var map;
var heatmap;

//new overlay
function CoordMapType() {
}
CoordMapType.prototype.tileSize = new google.maps.Size(1024,1024);
CoordMapType.prototype.maxZoom = 19;
CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
  var div = ownerDocument.createElement('div');
  div.innerHTML = coord;
  div.style.width = this.tileSize.width + 'px';
  div.style.height = this.tileSize.height + 'px';
  div.style.fontSize = '0';
  //div.style.borderStyle = 'solid';
  //div.style.borderWidth = '1px';
  //div.style.borderColor = '#E5E3DF';
  div.style.backgroundColor = '#FFFFFF';
  return div;
};
var coordinateMapType = new CoordMapType();

/*
// ############
//    Search Monument
// ############
*/ 
// If the element with id 'searchMonument' is clicked
$('#searchMonument').on('click',function(e){
	var location = $('#location').val();
    var monument = $('#monument').val();
	$.get('/query_flickr',data={'location': location, 'monument': monument}, function(data){
		// If successful, add the data to the DOM tree under the 'searchResults' element.
        var photos = jQuery.parseJSON(data);

        //set map central to search area
        var mapOptions = {
            zoom: 14,
            center: new google.maps.LatLng(photos[0].latitude, photos[1].longitude),
            streetViewControl: false,
            mapTypeId: 'coordinate'
        };

        map.setOptions(mapOptions)
        var photoArray = []
        //remove previous markers
        $('#numerOfPictures').html('Pictures found: '+photos.length);

        for(photo in photos){
            photoArray.push(new google.maps.LatLng(photos[photo].latitude, photos[photo].longitude))
        }

        
        var pointMVCArray = new google.maps.MVCArray(photoArray);
        if(heatmap){
          heatmap.setMap(null);
        }
        heatmap = new google.maps.visualization.HeatmapLayer({
            data: pointMVCArray
        });

        /*var gradient = [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
            ]
        heatmap.set('gradient', gradient);*/

        heatmap.set('radius', 13);
        
        heatmap.setMap(map);
	});
});

function initialize() {
    var mapOptions = {
        zoom: 14,
        center: new google.maps.LatLng(52.370197, 4.890444),
        mapTypeId: 'coordinate'
    };

    map = new google.maps.Map(document.getElementById('searchResults'),mapOptions);
    // Now attach the coordinate map type to the map's registry
    map.mapTypes.set('coordinate', coordinateMapType);
}

google.maps.event.addDomListener(window, "load", initialize);
