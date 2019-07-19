const BASE_URL = 'http://127.0.0.1:5500/ui';
const API_URL = 'http://localhost:3500';

const myMap = address => {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address }, (results, status) => {
    if (status == google.maps.GeocoderStatus.OK) {
      const { lat, lng } = results[0].geometry.location;
      const center = new google.maps.LatLng(lat(), lng());
      const mapProp = {
        center,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.HYBRID
      };

      const map = new google.maps.Map(document.getElementById('googleMap'), mapProp);

      const marker = new google.maps.Marker({ position: center });

      marker.setMap(map);
    }
  });
};
const useModal = (modal, trigerButton, closeButton) => {
  trigerButton.onclick = e => {
    e.preventDefault();
    modal.style.display = 'block';
  };

  closeButton.onclick = e => {
    modal.style.display = 'none';
  };

  window.onclick = ({ target }) => {
    if (target == modal) modal.style.display = 'none';
  };
};
