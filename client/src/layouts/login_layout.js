import React from 'react';

export default class LoginLayout extends React.Component {
  
  render() {
    return(
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-lg-offset-4 col-sm-8 col-sm-offset-2">
          { this.props.children && React.cloneElement(this.props.children, { app: this.props }) }
          </div>
        </div>
      </div>
    );
  }

}