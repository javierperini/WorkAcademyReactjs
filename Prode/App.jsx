import React from 'react';
import partidos from './partidos.json';

 function countProperties(obj) {
    var count = 0;

    for (var property in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, property)) {
            count++;
        }
    }

    return count;
}


class Goles extends React.Component {
	constructor(props) {
		super(props);
		this.goles = 0;
		this.setGoles = props.setGoles;
	}
	
	onChange(goles) {
	  this.setGoles(goles.target.value); 	
	}
	
	render() {   
	  return (
	  <input type='number' className='form-control' onChange={this.onChange.bind(this)} />
	  )
	}
}

class Equipo extends React.Component {
	constructor(props) {
		super(props);
		this.name = props.name;
		this.setGolesEquipo = props.setGolesEquipo;
		this.golesDelEquipo = {};
		this.golesDelEquipo[this.name] = 0;
	}
	
	setGoles(goles) {

		this.golesDelEquipo[this.name] = goles; 
		this.setGolesEquipo(this.golesDelEquipo)
	}

	render() {
		return (
		<div className='row'>
		  <div className='col-md-6'>
			{this.name}
		  </div>		
		  <div className='col-md-6'>
			<Goles setGoles={(goles)=> this.setGoles(goles) }/> 
		  </div>
		</div>);
	}
}

class Partido extends React.Component {
	constructor(props) {
		super(props);
		this.partido = props.partido;
		this.key = this.getKey(this.partido);
		this.result = {};
		this.result[this.key] = {};
		this.saveResult = props.saveResult;
	}
	
	getKey(partido) {
		return  "" + partido.home_team_country + "-" + partido.away_team_country
	}
	
	setGolesEquipo(equipo){
		const result = this.result[this.key];
		this.result[this.key] = Object.assign(equipo, result);
		if (countProperties(this.result[this.key]) == 2) {
			console.log(this.saveResult);
			console.log(this.result);
			this.saveResult(this.result);
		}	
	}
	
	render() {
		return (
		 <div>			
			 <div className='row alert alert-dark form-group'>
				<div className='col-md-6'> 				 
					<Equipo setGolesEquipo={(equipo) => this.setGolesEquipo(equipo)} name={this.partido.home_team_country}/>
				</div>
				<div className='col-md-6'> 				 
				   <Equipo setGolesEquipo={(equipo) => this.setGolesEquipo(equipo)} name={this.partido.away_team_country}/>
				</div>
			</div>
		 </div>
		 )
	}
}

class Fixture extends React.Component {
	constructor(props) {
		super(props);
		this.saveResult = props.saveResult;
	}
	
	createPartido(partido) {
		return(<Partido saveResult={(partido) => this.saveResult(partido)} partido={partido}/> )
	}

	render() {
		return( 
		<div className='container'>
		  {
		  partidos.map((partido) => this.createPartido(partido)) 
		  }
		  <button className='btn btn-danger'> Guardar </button>
		</div>)
	}
}

class Prode extends React.Component {
  constructor(props) {
    super(props);
	this.results = [];
  }
  
  saveResult(partido) {
	console.log('llegue');
	this.results.push(partido);
	console.log(this.results);
  }
  
  render() {   
    return (
      <div className="game">        
		  <Fixture saveResult={(partido) => this.saveResult(partido)}/ >
      </div>
    )
  }
}

export default Prode;