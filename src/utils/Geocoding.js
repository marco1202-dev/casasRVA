import Geocoder from "react-native-geocoding";
import { GOOGLE_API_KEY } from "../constants";

const setInit = (lang) => {
    Geocoder.init(GOOGLE_API_KEY, lang);
}

const getLatLong = async (address) => {

    let location = {
        latitude: null,
        longitude: null
    };

    try {
        let jsonResult = await Geocoder.from(address);

        let templocation = jsonResult.results[0].geometry.location;
        location.latitude = templocation.lat;
        location.longitude = templocation.lng;
        // bounds = jsonResult.results[0].geometry?.bounds;
    } catch (err) {

    }

    return location;
}

export default {
    setInit,
    getLatLong
}