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
		this.flag = utils.getFlag(props.name);
		this.setGolesEquipo = props.setGolesEquipo;
		this.golesDelEquipo = {name: this.name};
	}
	
	setGoles(goles) {
		_.extendOwn(this.golesDelEquipo, {goles: parseInt(goles)}); 
		this.setGolesEquipo(this.golesDelEquipo)
	}

	render() {
		var klass = "col-md-4 d-flex align-items-center flag " + this.flag;
		return (
		<div className='row d-flex align-items-center'>
		  <div className={klass}>
		  </div >
          <div className="col-md-4 d-flex align-items-center">
			<strong>{this.name}</strong>
          </div>  		  
		  <div className='col-md-4 d-flex align-items-center'>
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
		var style = { 'line-height': '0.5em', 'padding': '4px'},
		    pStyle = { 'margin-top': '10px' };

		   
		return(
		 <div style={style} className="border border-dark">
          	<p style={pStyle}><strong>Lugar: </strong> {this.partido.location}</p>
			<p><strong>Ronda: </strong> {this.partido.stage_name} </p>
			<p><strong>Fecha: </strong> {this.partido.datetime} </p>
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
		this.result[this.key] = { resultado: [] };
		this.saveResult = props.saveResult;
	}
	
	getWinner(results){
		var maximo = _.max(results, function(equipo) { return parseInt(equipo.goles)});
		return maximo.name;
	}
	
	saveEquipoResult(resultados, equipoAInsertar) {
		console.log('res');
		console.log(resultados);
		var currentEquipo = _.find(resultados, function(equipo) { return equipo.name == equipoAInsertar.name});
		currentEquipo ? _.extendOwn(currentEquipo, equipoAInsertar): resultados.push(equipoAInsertar);
	}
	
	setGolesEquipo(equipo) {
		var currentResult = this.result[this.key];
		this.saveEquipoResult(currentResult.resultado, equipo);
		this.result[this.key] = currentResult;
		if (currentResult.resultado.length == 2) {
			var winner = this.getWinner(currentResult.resultado);
			_.extendOwn(currentResult, {winner: winner});
			this.saveResult(this.result);
		}	
	}
	
	render() {
		return (
		 <div>			
			 <div className='row alert alert-dark d-flex align-items-center form-group border border-dark'>
				<div className='col-md-4'> 				 
				   <Equipo setGolesEquipo={(equipo) => this.setGolesEquipo(equipo)} name={this.partido.home_team_country} />
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
	}
	
	mostrarResultado(resultado){
		window.resultado = resultado;
		var stringResult = _.reduce(resultado.resultado, function(memo, equipo) { return memo + equipo.name + ": " + equipo.goles + ' - '}, '');
		return(
		  <div className='form-group'>
		    <div className='alert alert-secondary alert-success'>
			 { stringResult.substring(0, stringResult.length - 3) } 
             <span className='badge badge-secondary float-right'> Puntos {resultado.puntos}</span>	
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
						Mis puntos {this.misPuntos}
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
		this.cleanResultados  = props.cleanResultados;
		this.state = { mostrarResultados: false }
	}
	
	saveResultFixture(partido) {
		this.saveResult(partido);
	}
	
	createPartido(partido) {
		const formattedPartido = utils.formattedPartido(partido);
		this.saveRealResult(formattedPartido);
		return(<Partido saveResult={(partido) => this.saveResultFixture(partido)} partido={partido}/> )
	}
	
	toggleModal() {
		this.setState({ mostrarResultados: !this.state.mostrarResultados }); 
	}
	
	compararyMostrarResultados() {
		this.misPuntos = this.compararResultados();
		this.toggleModal();
	}
	
	closeModal (){
		this.toggleModal()
	}
	
	render() {
		var styleBtn = {'font-size': '30px'};
		return( 
			<div className='container'>
			  {
			  partidos.map((partido) => this.createPartido(partido)) 
			  }
			  <div className='form-group'>
				<button className='btn btn-danger btn-block' onClick={() => this.compararyMostrarResultados() } style={styleBtn}> Comparar resultados </button>
			  </div>
			  <Modal show={this.state.mostrarResultados} onClose={() => this.closeModal() }>
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
	console.log('Resultado actual');
	console.log(this.results);
  }
  
  countResult() {
	utils.countProperties(this.results);
  }
  
  saveRealResult(partido) {
	this.realResults = _.extend(this.realResults, partido);
  }
  
  acerteResultado(currentResult, realResult) {
	return _.every(currentResult, function(currentValues, equipoKey) {
		 var realGoles = _.find(realResult, function(equipo) { return equipo.name == currentValues.name} )
		 return realGoles.goles == currentValues.goles;
		});
   }
   
   acerteGanador(currentResult, realResult) {
	   return realResult.winner == currentResult.winner;
   }
  
  calcularPuntos (self, currentResult, realResult) {
	var puntajes = [{acerte: self.acerteGanador(currentResult, realResult), puntos: 1}, {acerte: self.acerteResultado(currentResult.resultado, realResult.resultado), puntos: 3}];
	return _.reduce(puntajes, function(memo, puntaje) { return  puntaje.acerte ? memo + puntaje.puntos : memo }, 0)
  }
  
  cleanResultados () {
	 this.results = {};
	 this.acertados = [];
  }
  
  compararResultados() {
	var self = this;
	return _.reduce(self.results, function(memo, currentResult, resultKey) {
		const realResult = self.realResults[resultKey];
		var puntos = self.calcularPuntos(self, currentResult, realResult);
		if(puntos > 0){
		   memo+= puntos;
		   self.acertados.push(_.extend(currentResult, { puntos: puntos }));
		} 
		return memo
	}, 0);
  }
 
  render() {	  
    return (
      <div className="game">
	      <div className='form-group'>
			<h1 className="text-center"> EH prode mundial !!!</h1>
		  </div>
		  <Fixture saveResult={(partido) => this.saveResult(partido)} 
		  countResults= {()=> this.countResult() } 
		  saveRealResult= {(partido) => this.saveRealResult(partido)}
		  compararResultados = { () => this.compararResultados() }
		  resultadosAcertados={this.acertados}
		  cleanResultados = {() => this.cleanResultados() }
		  / >
      </div>
    )
  }
}

export default Prode;