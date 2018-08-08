import React from 'react';


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
		<div> 
		{this.name} <Goles/> 
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
			<Equipo name='Local'/>
			<Equipo name='Visitante'/>
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
		return( <div> <Partido/> </div>)
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