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

export function formattedEquipo(equipo) {
	var team = {};
	team[equipo.country] = equipo.goals;
	return team;
}
	
export function formattedPartido(partido) {
  var key = getKey(partido);
  var formatedPartido = {location: partido.location, officials: partido.officials, stage_name: partido.stage_name, datetime: Date(partido.datetime) };
  var awayTeam = formattedEquipo(partido.away_team);
  var homeTeam = formattedEquipo(partido.home_team);
  formatedPartido[key] = _.extend(awayTeam, homeTeam);
  return formatedPartido;
}