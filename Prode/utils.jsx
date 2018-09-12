// Cantidad de propiedades esto va en un utils
 export function countProperties(obj) {
    var count = 0;

    for (var property in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, property)) {
            count++;
        }
    }
    return count;
}

export function getKey(partido) {
	return  "" + partido.home_team_country + "-" + partido.away_team_country
}