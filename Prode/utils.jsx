import flags from './flags.json';

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

export function getFlag(equipo) {
 var country = _.find(flags, function(country) { return country.name.toLowerCase() == equipo.toLowerCase(); });
 var value =  _.values(country)[1];
 return value.toLowerCase();
}

export function formattedEquipo(equipo) {
	return {name: equipo.country, goles: equipo.goals};
}
	
export function formattedPartido(partido) {
  var key = getKey(partido);
  var  matchInfo = {location: partido.location, officials: partido.officials, stage_name: partido.stage_name, datetime: Date(partido.datetime), winner: partido.winner };
  var formatedPartido = {};
  var awayTeam = formattedEquipo(partido.away_team);
  var homeTeam = formattedEquipo(partido.home_team);
  formatedPartido[key] = _.extend(matchInfo, { resultado:[awayTeam, homeTeam] });
  return formatedPartido;
}