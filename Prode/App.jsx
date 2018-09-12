import React from 'react';
import partidos from './partidos.json';
import Modal from './Modal.jsx';
import * as utils from './utils.jsx';


class Goles extends React.Component {
	constructor(props) {
		super(props);
		this.goles = 0;
		this.setGoles = props.setGoles;
	}
	
	onBlur(goles) {
		this.setGoles(goles.target.value); 	
	}
	render() {   
	  return (
	  <input type='number' className='form-control' onBlur= {this.onBlur.bind(this)}/>
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
		this.key = utils.getKey(this.partido);
		this.result = {};
		this.result[this.key] = {};
		this.saveResult = props.saveResult;
	}
	
	
	setGolesEquipo(equipo) {
		const result = this.result[this.key];
		this.result[this.key] = Object.assign(result, equipo);
		if (utils.countProperties(this.result[this.key]) == 2) {
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

class Results extends React.Component {
	constructor(props) {
		super(props);
		this.misPuntos = props.misPuntos;
	}
	
	render () {
		return (
			<div className="alert alert-secondary alert-warning" role="alert">
				Le pegue a {this.misPuntos}
			</div>
		)
	}
}

class Fixture extends React.Component {
	constructor(props) {
		super(props);
		this.saveResult = props.saveResult;
		this.countCompletedPartidos = 0;
		this.realResult = props.realResult;
		this.compararResultados = props.compararResultados;
		this.misPuntos = null;
		this.state = { mostrarResultados: false }
	}
	
	saveResultFixture(partido) {
		this.saveResult(partido)
	}
	
	formattedEquipo(equipo) {
	  const team = {};
	  team[equipo.country] = equipo.goals;
	  return team;
	}
	
	formattedPartido(partido) {
	  const key = utils.getKey(partido);
      const formatedPartido = {};
	  const awayTeam = this.formattedEquipo(partido.away_team);
	  const homeTeam = this.formattedEquipo(partido.home_team);
      formatedPartido[key] = Object.assign(awayTeam,  homeTeam);
	  return formatedPartido;
	}
	
	createPartido(partido) {
		const formattedPartido = this.formattedPartido(partido);
		this.realResult(formattedPartido);
		return(<Partido saveResult={(partido) => this.saveResultFixture(partido)} partido={partido}/> )
	}
	
	toggleModal() {
		this.setState({ mostrarResultados: !this.state.mostrarResultados }); 
		console.log('llego aca');
	}
	
	compararyMotrasResultados() {
		this.misPuntos = this.compararResultados();
		this.toggleModal();
	}
	
	render() {
		return( 
			<div className='container'>
			  {
			  partidos.map((partido) => this.createPartido(partido)) 
			  }
			  <div className='form-group'>
				<button className='btn btn-danger btn-block' onClick={() => this.compararyMotrasResultados() }> Guardar </button>
			  </div>
			  <Modal show={this.state.mostrarResultados} onClose={() => this.toggleModal() }>
				<Results misPuntos={this.misPuntos}/>
			  </Modal>
			</div>
			)
	}
}

class Prode extends React.Component {
  constructor(props) {
    super(props);
	this.results = {};
	this.realResults = {};
	this.puntos = null;
  }
  
  saveResult(partido) {
	this.results = Object.assign(this.results,  partido);
  }
  
  countResult() {
	utils.countProperties(this.results);
  }
  
  realResult(partido) {
	this.realResults = Object.assign(this.realResults,  partido);
  }
  
  compararResultados() {
	const realResults = this.realResults;
	const currentResults = this.results;
	var count = 0;
	Object.keys(currentResults).map(function(objectKey, index) {
		const currentResult = currentResults[objectKey];
		const realResult = realResults[objectKey];
		var lePegueALosDos = 0;
		Object.keys(currentResult).map(function(equipoKey, _) {
			var currentGoles = currentResult[equipoKey];
			var realGoles = realResult[equipoKey];

			if( realGoles == currentGoles) {
				lePegueALosDos++;
			};
		});
		if(lePegueALosDos == 2){
			count++ ;
		};
	});
	return count;
  }
 
  render() {	  
    return (
      <div className="game">        
		  <Fixture saveResult={(partido) => this.saveResult(partido)} 
		  countResults= {()=> this.countResult() } 
		  realResult= {(partido) => this.realResult(partido)}
		  compararResultados = { () => this.compararResultados() }
		  / >
      </div>
    )
  }
}

export default Prode;