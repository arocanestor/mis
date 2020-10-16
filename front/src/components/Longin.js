import React, { Component } from 'react'
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:'',
            password: '',
            login: localStorage.getItem('Autorized')
        }
    }
    onInputChanges = (e) => {       
        this.setState({
            [e.target.name]: e.target.value
        })
        e.preventDefault();
        console.log(this.state.user)   
    }

    onSubmit = async () => {
        await axios.post('http://apicalendariomisas.argodevs.com/api/misas/login', {
            user: this.state.user,
            password: this.state.password
        }).then((a) => {
            console.log(a.data.token)
            localStorage.setItem('Autorized', a.data.token);          
            
        })
    }

    render() {    
        if(this.state.login){
            return(<Redirect to ='/'/> )
         }  else {
            return (
                <div className="d-flex justify-content-center">
                    <div>
                        <br /><br />
                        <h3>Login</h3>
                        <div>
                            <form onSubmit={this.onSubmit} >
                                <div className="emal form-group">
                                    <label htmlFor="user">Email</label>
                                    <div >
                                        <input
                                            type="text"
                                            name="user"
                                            placeholder="user"
                                            onChange={this.onInputChanges}
                                        />
                                    </div>
                                </div>

                                <div className="password form-group">
                                    <label htmlFor="password">Password</label>
                                    <div >
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            onChange={this.onInputChanges}
                                        />
                                    </div>
                                </div>
                                <div className="createAccount">
                                    <button type="submit" className="btn btn-primary">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
        )
         }
           
    }
    
}