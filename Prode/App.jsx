import React from 'react';
import partidos from './partidos.json';

class Goles extends React.Component {
	constructor(props) {
		super(props);
		this.goles = 0;
		this.setGoles = props.setGoles;
	}
	
	onChange(goles) {
	  this.setGoles(goles); 	
	}
	
	render() {   
	  return (
	  <input type='number' className='form-control' onChange={this.onChange.bind(this)} value={this.goles}/>
	  )
	}
}

class Equipo extends React.Component {
	constructor(props) {
		super(props);
		this.name = props.name;
		this.goles[this.name] = 0;
		this.setGolesEquipo = props.setGolesEquipo;
	}
	
	setGoles(goles) {
		this.goles[this.name] = goles; 
		this.setGolesEquipo(this.goles)
	}

	render() {
		return (
		<div className='row'>
		  <div className='col-md-6'>
			{this.name}
		  </div>		
		  <div className='col-md-6'>
			<Goles setGoles={this.setGoles}/> 
		  </div>
		</div>);
	}
}

class Partido extends React.Component {
	constructor(props) {
		super(props);
		this.saveResult = props.saveResult;
		this.partido = props.partido;
		this.complete = false;
		this.key = getKey(partido);
		this.result[this.key] = { } 
	}
	
	getKey(partido) {
		return  "" + partido.home_team_country + "-" + partido.away_team_country
	}
	
	setGolesEquipo(equipo){
		result = this.result[this.key]
		this.result[this.key] = Object.assign(equipo, result) 
	}
	
	render() {
		return (
		 <div>			
			 <div className='row alert alert-dark form-group'>
				<div className='col-md-6'> 				 
					<Equipo setGolesEquipo={this.setGolesEquipo} name={this.partido.home_team_country}/>
				</div>
				<div className='col-md-6'> 				 
				   <Equipo setGolesEquipo={this.setGolesEquipo} name={this.partido.away_team_country}/>
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
	// Lista de partidos
	render() {
		return( 
		<div className='container'>
		  { partidos.map(function(partido){ return(<Partido saveResult={this.saveResult} partido={partido}/> );}) }
		</div>)
	}
}

class Prode extends React.Component {
  constructor(props) {
    super(props);
	this.results = [];
  }
  
  onChange(partido) {
	this.results.push(partido);
  }
  
  render() {   
    return (
      <div className="game">        
		  <Fixture saveResult={this.onChange}/ >
      </div>
    )
  }
}

export default Prode;