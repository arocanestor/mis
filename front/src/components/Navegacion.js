import React,{Component} from 'react';
import {Link} from 'react-router-dom';

export default class Navegacion extends Component {
    constructor (props) {
        super(props);
        this.state = {
            login: sessionStorage.getItem("Autorized")
        }
    }
    onSubmit = async (e) => {
        sessionStorage.removeItem("Autorized")
    }


    render(){
        if (!this.state.login) {
            return (
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div className="container">
                        <Link className="navbar-brand" to="/">
                            Misas
                        </Link>                                              
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item">
                                    <Link id="navbarNav"className="nav-link" to="/login" >Login</Link>
                                </li>
                            </ul>
                      
                    </div>
                </nav>
            )
        }
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        Misas
                    </Link>                   
                        <ul className="navbar-nav ml-auto">                            
                            <li className="nav-item">
                                <a className="nav-link" href="/" onClick={this.onSubmit}>logaut</a>
                            </li>
                        </ul>                  
                </div>
          
            </nav>
        )
    }
    
}