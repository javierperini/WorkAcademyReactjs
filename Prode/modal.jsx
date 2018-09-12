import React from 'react';
import PropTypes from 'prop-types';

class Modal extends React.Component {
  render() {
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }

    var style = { display: 'block '};
	
    return (
		<div style={style} className="modal fade show bd-example-modal-lg" >
			<div className="modal-dialog modal-lg" role="document">
				<div className="modal-content">
				  <div className="modal-header">
					<h5 className="modal-title" id="exampleModalLabel">Mis puntos</h5>
					<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.onClose}>
					  <span aria-hidden="true">&times;</span>
					</button>
				  </div>
				  <div className="modal-body">
					{this.props.children}
				  </div>
				  <div className="modal-footer">
					<button onClick={this.props.onClose}>
					  Close
					</button>
				  </div>
				</div>
			</div>
		</div>

    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default Modal;