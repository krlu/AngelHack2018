const RADIUS = parseInt(process.env.RADIUS);

exports.handler = async (event, context, callback) => {
    const location = {
        latitude: 37.774461,
        longitude: -122.417160,
        radius: RADIUS,
    };

    const response = {
        statusCode: 200,
        isBase64Encoded: false,
        body: JSON.stringify(location, null, 2),
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    };

    return callback(null, response);
};
