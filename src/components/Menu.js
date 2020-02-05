import React, { Component } from 'react';
import './css/umami.css'
import {auth} from '../actions';
import {connect} from "react-redux";

class Menu extends Component {
  state = {
    menu: '',
    operaciones: ''
  };

  toggleMenu =(e)=> {
    if(this.state.menu === 'is-active'){
      this.setState({
        menu: ''
      })
    }
    else{
      this.setState({
        menu: 'is-active'
      })
    }
  }

  render(){
    return(
      <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <p className="navbar-item is-size-1">
              Umami
          </p>
          <a role="button"
             href="/#"
             className={"navbar-burger "+this.state.menu}
             aria-label="menu"
             aria-expanded="false"
             onClick={this.toggleMenu}
             data-action='menu'
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div className={"navbar-menu "+this.state.menu} aria-label="menu">
          <div className="navbar-start">
            <a className="navbar-item"
               href="/#"
               data-window = 'index'
               onClick = {this.props.changeWindow}
            >
              Inicio
            </a>
            <a className="navbar-item"
               href="/#"
               data-window = 'receipt-list'
               onClick = {this.props.changeWindow}
            >
              Compras
            </a>
            <a className="navbar-item"
               href="/#"
               data-window = 'batch-list'
               onClick = {this.props.changeWindow}
            >
              Produccion
            </a>
            <a className="navbar-item"
               href="/#"
               data-window = 'stock'
               onClick = {this.props.changeWindow}
            >
              Stock
            </a>
            <a className="navbar-item"
               href="/#"
               data-window = 'ingredient-list'
               onClick = {this.props.changeWindow}
            >
              Ingredientes
            </a>
            <a className="navbar-item"
               href="/#"
               data-window = 'recipe-list'
               onClick = {this.props.changeWindow}
            >
              Recetas
            </a>
            <a className="navbar-item"
               href="/#"
               data-window = 'test-form'
               onClick = {this.props.changeWindow}
            >
              Test Form
            </a>
          </div>
          <div className="navbar-end">
            <a className="navbar-item"
               href="/#"
               onClick = {this.props.logout}
            >
              Logout
            </a>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
          return dispatch(auth.logout())
        }
      }
    }

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
