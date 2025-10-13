// hooks/useGoogleMapsAutocomplete.js
import { useEffect, useRef, useState } from "react";

const useGoogleMapsAutocomplete = (apiKey) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsLoaded(true);
      return;
    }

    // Load the Google Maps JavaScript API
    const loadGoogleMaps = async () => {
      try {
        // Clean up any existing script
        const existingScript = document.querySelector(
          'script[src*="maps.googleapis.com"]'
        );
        if (existingScript) {
          existingScript.remove();
        }

        // Create new script element
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
        script.async = true;
        script.defer = true;

        // Define the callback function
        window.initGoogleMaps = () => {
          setIsLoaded(true);
          setLoadError(null);
        };

        script.onerror = () => {
          setLoadError("Failed to load Google Maps API");
          setIsLoaded(false);
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error("Error loading Google Maps:", error);
        setLoadError(error.message);
        setIsLoaded(false);
      }
    };

    loadGoogleMaps();

    // Cleanup function
    return () => {
      if (window.initGoogleMaps) {
        delete window.initGoogleMaps;
      }
    };
  }, [apiKey]);

  const initAutocomplete = (inputElement) => {
    if (!window.google || !window.google.maps || !inputElement) {
      console.error("Google Maps API not loaded or input element not found");
      return null;
    }

    try {
      const autocompleteInstance = new window.google.maps.places.Autocomplete(
        inputElement,
        {
          types: ["address"],
          componentRestrictions: { country: "in" }, // Restrict to India
        }
      );

      setAutocomplete(autocompleteInstance);
      return autocompleteInstance;
    } catch (error) {
      console.error("Error initializing autocomplete:", error);
      return null;
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      setIsGettingLocation(true);
      setLocationError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsGettingLocation(false);
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setIsGettingLocation(false);
          let errorMessage = "Unable to retrieve your location";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access denied. Please allow location access to use this feature.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
            default:
              errorMessage = "An unknown error occurred.";
              break;
          }

          setLocationError(errorMessage);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  };

  const reverseGeocode = async (lat, lng) => {
    if (!window.google || !window.google.maps) {
      throw new Error("Google Maps API not loaded");
    }

    try {
      const geocoder = new window.google.maps.Geocoder();

      return new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results[0]) {
            resolve(results[0]);
          } else {
            reject(new Error("Geocoding failed: " + status));
          }
        });
      });
    } catch (error) {
      throw new Error("Reverse geocoding failed: " + error.message);
    }
  };

const fillAddressFields = (place) => {
  if (!place || !place.address_components) {
    return {};
  }

  const addressComponents = place.address_components;
  const addressData = {
    HNo: "",
    Area: "",
    locality: "",
    City: "",
    State: "",
    Pincode: "",
    LandMark: "",
  };

  let streetNumber = "";
  let route = "";
  let sublocality2 = "";
  let sublocality1 = "";

  addressComponents.forEach((component) => {
    const types = component.types;

    if (types.includes("street_number")) {
      streetNumber = component.long_name;
      addressData.HNo = component.long_name;
    }

    if (types.includes("route")) {
      route = component.long_name;
      addressData.Area = component.long_name;
    }

    if (types.includes("sublocality_level_2")) {
      sublocality2 = component.long_name;
    }

    if (types.includes("sublocality_level_1") || types.includes("sublocality")) {
      sublocality1 = component.long_name;
    }

    if (types.includes("locality")) {
      addressData.City = component.long_name;
    }

    if (types.includes("administrative_area_level_1")) {
      addressData.State = component.long_name;
    }

    if (types.includes("postal_code")) {
      addressData.Pincode = component.long_name;
    }

    if (
      types.includes("premise") ||
      types.includes("point_of_interest") ||
      types.includes("neighborhood")
    ) {
      addressData.LandMark = component.long_name;
    }
  });

  // ✅ Build the formatted locality string (street → route → sublocality2 → sublocality1)
  const parts = [streetNumber, route, sublocality2, sublocality1]
    .filter(Boolean)
    .join(", ");

  addressData.locality = parts;

  // Fallbacks using formatted_address
  if (place.formatted_address) {
    const addressParts = place.formatted_address.split(",");
    if (!addressData.Area && addressParts.length > 0) {
      addressData.Area = addressParts[0].trim();
    }
    if (!addressData.City && addressParts.length > 2) {
      addressData.City = addressParts[addressParts.length - 3].trim();
    }
  }

  return addressData;
};


  return {
    isLoaded,
    loadError,
    isGettingLocation,
    locationError,
    initAutocomplete,
    getCurrentLocation,
    reverseGeocode,
    fillAddressFields,
    inputRef,
    setLocationError,
  };
};

export default useGoogleMapsAutocomplete;
