const BASE_URL = 'https://samuelkoroh.github.io/PropertyProLite/ui';
const API_URL = 'https://sam-propertyprolite.herokuapp.com';

const token = localStorage.getItem('token');
const questLink = document.querySelectorAll('li.guest');

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

(() => {
  try {
    if (token) {
      questLink[0].classList.add('hide-link');
      questLink[1].classList.add('hide-link');
      signOut.classList.remove('hide-link');
    } else {
      questLink[0].classList.remove('hide-link');
      questLink[1].classList.remove('hide-link');
      signOut.classList.add('hide-link');
    }
  } catch (error) {}
})();
