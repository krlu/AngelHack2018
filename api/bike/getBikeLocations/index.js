const uuid = require('uuid/v4');

const CLUSTER_MIN = parseInt(process.env.CLUSTER_MIN);
const CLUSTER_MAX = parseInt(process.env.CLUSTER_MAX);
const CLUSTER_DEVIATION = parseFloat(process.env.CLUSTER_DEVIATION);
const LATLON_PRECISION = parseInt(process.env.LATLON_PRECISION);

exports.handler = async (event, context, callback) => {
    const locations = [
        ...generateCluster(37.775893, -122.418186), // Uber HQ
        ...generateCluster(37.778557, -122.419067), // SF City Hall
        ...generateCluster(37.784350, -122.407468), // Westfield Mall
        ...generateCluster(37.776778, -122.395256), // Caltrain Station
        ...generateCluster(37.761333, -122.426299), // Dolores Park
        ...generateCluster(37.784511, -122.430053), // Japantown
    ];

    const res = {
        statusCode: 200,
        isBase64Encoded: false,
        body: JSON.stringify(locations, null, 2),
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    };

    callback(null, res);
};

const generateCluster = (lat, lon) => {
    const locations = [];
    const size = Math.floor(Math.random() * (CLUSTER_MAX - CLUSTER_MIN) + CLUSTER_MIN);
    for (let i = 0; i < size; i++) {
        locations.push({
            uuid: uuid(),
            latitude: trim(lat + getRandomDeviation()),
            longitude: trim(lon + getRandomDeviation()),
        });
    }
    return locations;
};

const getRandomDeviation = () => {
    return trim((Math.random() * 2 - 1) * CLUSTER_DEVIATION);
}

const trim = (n) => {
    return parseFloat(n.toFixed(LATLON_PRECISION));
}
