const myMap = address => {
  let geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address }, (results, status) => {
    if (status == google.maps.GeocoderStatus.OK) {
      const { lat, lng } = results[0].geometry.location;
      let center = new google.maps.LatLng(lat(), lng());
      let mapProp = {
        center,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.TERRAIN
      };

      let map = new google.maps.Map(
        document.getElementById("googleMap"),
        mapProp
      );

      let marker = new google.maps.Marker({ position: center });

      marker.setMap(map);
    }
  });
};
