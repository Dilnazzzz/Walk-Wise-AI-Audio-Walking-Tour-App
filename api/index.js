import axios from "axios";

export const getPlacesData = async(bl_lat, bl_lng, tr_lat, tr_lng) => {
    try {
        const {data : {data} } = await axios.get(`https://travel-advisor.p.rapidapi.com/attractions/list-in-boundary`,
            {
                params: {
                    bl_latitude: bl_lat ? bl_lat: '24.96050843192375',
                    tr_latitude: tr_lat ? tr_lat: '25.21030384327183',
                    bl_longitude: bl_lng ? bl_lng: '121.4570602672167',
                    tr_longitude: tr_lng ? tr_lng: '121.6659421062276',
                    limit: "30",
                    currency: 'USD',
                    lunit: 'km',
                    lang: 'en_US'
                },
                headers: {
                    'X-RapidAPI-Key': 'API KEY',
                    'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
                }
            }
        );
        return data;

    } catch(error) {
        return null
    }
};