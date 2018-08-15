import React from 'react';
import partidos from './partidos.json';

class Goles extends React.Component {
	constructor(props) {
		super(props);
		this.goles = 0;
	}
	// Lista de partidos
	render() {   
	  return (
	  <div> {this.goles} </div>
	  )
	}
}

class Equipo extends React.Component {
	constructor(props) {
		super(props);
		this.name = props.name;
	}

	render() {
		return (
		<div className='row'>
		  <div className='col-md-6'>
			{this.name}
		  </div>		
		  <div className='col-md-6'>
			<Goles/> 
		  </div>
		</div>);
	}
}

class Partido extends React.Component {
	constructor(props) {
		super(props);
	}
	// Lista de partidos
	render() {
		return (
		 <div>
			{
			partidos.map(function(partido){
				return(
                 <div className='row alert alert-dark form-group'>
                    <div className='col-md-6'> 				 
						<Equipo name={partido.home_team_country}/>
					</div>
					<div className='col-md-6'> 				 
				       <Equipo name={partido.away_team_country}/>
					</div>
			    </div>
			    );
					   
			}) 
			}
		 </div>
		 )
	}
}

class Fixture extends React.Component {
	constructor(props) {
		super(props);
	}
	// Lista de partidos
	render() {
		return( <div className='container'> <Partido/> </div>)
	}
}

class Prode extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {   
    return (
      <div className="game">        
		  <Fixture/>
      </div>
    )
  }
}

export default Prode;