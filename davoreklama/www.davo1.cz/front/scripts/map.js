var initMap = function() {
	var position = {
		lat: 49.8360866,
		lng: 18.2850748
	};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: position,
		scrollwheel: false,
		heading: 0,
        tilt: 0,
        gestureHandling: 'cooperative',
       	mapTypeControl: true
       	// ,
		// mapTypeControlOptions: {
		    // style: google.maps.MapTypeControlStyle.DEFAULT,
        	// position: google.maps.ControlPosition.LEFT_BOTTOM
		// }
    });

	// var icon = {
	// 	url: "/public/front/img/map_marker.png",
	// 	scaledSize: new google.maps.Size(100, 122),
	// 	origin: new google.maps.Point(0, 0),
	// 	anchor: new google.maps.Point(50, 122)
	// };
	var marker = new google.maps.Marker({
		position: position,
		map: map
	});
};