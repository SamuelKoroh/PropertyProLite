const BASE_URL ='http://127.0.0.1:5500/public';

const myMap = address => {
  let geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address }, (results, status) => {
    if (status == google.maps.GeocoderStatus.OK) {
      const { lat, lng } = results[0].geometry.location;
      let center = new google.maps.LatLng(lat(), lng());
      let mapProp = {
        center,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.HYBRID
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
const useModal = (modal, trigerButton, closeButton) => {
  trigerButton.onclick = e => {
    e.preventDefault();
    modal.style.display = "block";
  };

  closeButton.onclick = e => {
    modal.style.display = "none";
  };

  window.onclick = ({ target }) => {
    if (target == modal) modal.style.display = "none";
  };
};
