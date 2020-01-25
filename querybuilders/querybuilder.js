var util = require('util');

module.exports = {
    getZones: () => {
        return util.format(`SELECT * FROM zone`);
    },
    getZoneById: (data) => {
        return util.format(`SELECT * FROM zone WHERE zone_id = ${data.zone_id}`);
    },
    getAllCities : () => {
        return util.format(`SELECT * FROM city`);
    },
    getAllCityByZone : (data) => {
        return util.format(`SELECT * FROM city WHERE zone_id = ${data.zone_id}`)
    },
    getCityById: (data) => {
        return util.format(`SELECT * FROM city WHERE city_id = ${data.city_id}`);
    },
}