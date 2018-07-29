const uuid = require('uuid/v4');

const CLUSTER_SIZE = parseFloat(process.env.CLUSTER_SIZE);
const CLUSTER_DEVIATION = parseFloat(process.env.CLUSTER_DEVIATION);
const LATLON_PRECISION = parseInt(process.env.LATLON_PRECISION);

exports.handler = async (event, context, callback) => {
    const locations = [
        ...generateCluster(37.775893, -122.418186), // Uber HQ
        ...generateCluster(37.778557, -122.419067), // SF City Hall
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
    for (let i = 0; i < CLUSTER_SIZE; i++) {
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
