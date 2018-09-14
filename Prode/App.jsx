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
		  <div className='col-md-6 d-flex align-items-center'>
			{this.name}
		  </div>		
		  <div className='col-md-6 d-flex align-items-center'>
			<Goles setGoles={(goles)=> this.setGoles(goles) }/> 
		  </div>
		</div>);
	}
}

class MatchInfo extends React.Component {
	constructor(props) {
		super(props);
		this.partido = props.partido;
	}
	
	render(){
		return(
		 <div>
          	<p> {this.partido.location}
			 {this.partido.stage_name}
			{this.partido.datetime}</p>
		 </div>
	 )
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
		this.result[this.key] = _.extend(result, equipo);
		if (utils.countProperties(this.result[this.key]) == 2) {
			this.saveResult(this.result);
		}	
	}
	
	render() {
		return (
		 <div>			
			 <div className='row alert alert-dark form-group'>
				<div className='col-md-4'> 				 
					<Equipo setGolesEquipo={(equipo) => this.setGolesEquipo(equipo)} name={this.partido.home_team_country}/>
				</div>
				<div className='col-md-4'> 				 
					<MatchInfo partido={this.partido}/>
				</div>
				<div className='col-md-4'> 				 
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
		this.resultadosAcertados = props.resultadosAcertados;
		this.misPuntos = props.misPuntos;
		console.log(this.resultadosAcertados);
	}
	
	mostrarResultado(resultado){
		var stringResult = _.reduce(resultado, function(memo, goles, equipo) {  return memo + equipo+ ": " + goles + ' - '}, '');
		return(
		  <div className='form-group'>
		    <div className='alert alert-secondary alert-success'>
			 { stringResult.substring(0, stringResult.length - 3) }
			</div>
		  </div>
		)
	}
	
	render () {
		const resultados = this.resultadosAcertados;
		return (
		   <div>
		      <h3> Mis puntos </h3>
			   <div className='form-group'>
					<div className="alert alert-secondary alert-warning" role="alert">
						Le pegue a {this.misPuntos}
				   </div>
			   </div>
			   <h3> Acertados </h3>
			   { resultados.map((resultado) => this.mostrarResultado(resultado)) }
		  </div>	
		)
	}
}

class Fixture extends React.Component {
	constructor(props) {
		super(props);
		this.saveResult = props.saveResult;
		this.countCompletedPartidos = 0;
		this.saveRealResult = props.saveRealResult;
		this.compararResultados = props.compararResultados;
		this.resultadosAcertados = props.resultadosAcertados;
		this.state = { mostrarResultados: false }
	}
	
	saveResultFixture(partido) {
		this.saveResult(partido)
	}
	
	createPartido(partido) {
		const formattedPartido = utils.formattedPartido(partido);
		this.saveRealResult(formattedPartido);
		return(<Partido saveResult={(partido) => this.saveResultFixture(partido)} partido={partido}/> )
	}
	
	toggleModal() {
		this.setState({ mostrarResultados: !this.state.mostrarResultados }); 
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
				<Results misPuntos={this.misPuntos} resultadosAcertados={this.resultadosAcertados}/>
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
	this.acertados = [];
  }
  
  saveResult(partido) {
	this.results = _.extend(this.results, partido);
  }
  
  countResult() {
	utils.countProperties(this.results);
  }
  
  saveRealResult(partido) {
	this.realResults = _.extend(this.realResults, partido);
  }
  
  acerteElResultadoDelPartido(currentResult, realResult) {
	return _.every(currentResult, function(currentGoles, equipoKey) {
		 var realGoles = realResult[equipoKey];
		 return realGoles == currentGoles;
	 });
  }
  
  compararResultados() {
	const realResults = this.realResults;
	const currentResults = this.results;
	const acerte = this.acerteElResultadoDelPartido;
	var acertados = this.acertados;
	var errados = this.errados;
	console.log('acetados');
	console.log(acertados);
	
	
	return _.reduce(currentResults, function(memo, currentResult, resultKey) {
		const realResult = realResults[resultKey];
		if(acerte(currentResult, realResult)){
		   memo++;
		   acertados.push(currentResult);
		} 
		return memo
	}, 0);
  }
 
  render() {	  
    return (
      <div className="game">        
		  <Fixture saveResult={(partido) => this.saveResult(partido)} 
		  countResults= {()=> this.countResult() } 
		  saveRealResult= {(partido) => this.saveRealResult(partido)}
		  compararResultados = { () => this.compararResultados() }
		  resultadosAcertados={this.acertados}
		  / >
      </div>
    )
  }
}

export default Prode;