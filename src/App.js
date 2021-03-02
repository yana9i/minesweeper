import React from 'react';
import logo from './logo.svg';
import './App.css';

import Login from './Login';
import Game from './Game';


class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      hasLogin: false,
    }

    this.onLogin = this.onLogin.bind(this);
  }

  onLogin() {
    this.setState({ hasLogin: true });
  }



  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="Header-holder">
            <div className="Header-item">
              <img src={logo} className="App-logo" alt="logo" />
              <span>F2k-MineCraft</span>
              {this.state.hasLogin ? <span className="Header-item-right" onClick={()=>{this.setState({ hasLogin: false })}}>退出登录</span> : null}
            </div>
          </div>
        </header>

        <div className="App-main">
          {!this.state.hasLogin ?
            <Login onLogin={this.onLogin} /> :
            <Game />}
        </div>
      </div>
    )
  }
}

export default App;
