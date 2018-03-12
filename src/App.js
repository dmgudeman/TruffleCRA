import React, { Component } from 'react';
import {BigNumber} from 'bignumber.js';
import FreeExchangeContract from '../build/contracts/FreeExchange.json';
import getWeb3 from './utils/getWeb3';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      fieldTransferAmount: '',
      fieldTransferToAddress: '',
      freeExchangeInstance: '',
      defaultAccount: '',
      transferToAddress: '',
      transferToBalance: '',
      ownerAddress: '',
      ownerBalance: '',
      formMessage: '',
      formMessageGV: '',
      globalVariable: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeAddr = this.handleChangeAddr.bind(this);
    this.handleChangeGV = this.handleChangeGV.bind(this);
    this.onSubmitGV = this.onSubmitGV.bind(this);
    this.onSubmit= this.onSubmit.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    const contract = require('truffle-contract')
    const freeExchange = contract(FreeExchangeContract)
    freeExchange.setProvider(this.state.web3.currentProvider)
    freeExchange.defaults({from: this.state.web3.eth.coinbase})

    // Declaring this for later so we can chain functions on FreeExchange.
    // Get accounts.const {freeExchangeInstance} = this.state;
    this.state.web3.eth.getAccounts((error, accounts) => {
        this.setState(web3 => ({
          ...web3,
          defaultAccount:this.state.web3.eth.accounts[0]
        }))
      freeExchange.deployed().then((instance) => {
        this.setState({freeExchangeInstance: instance});
        this.state.freeExchangeInstance.getGlobalVariable().then(result => {
          console.log("result.c[0]", result.c[0]);
          console.log("this.state.globalVariable", this.state.globalVariable);
          this.setState({globalVariable: result.c[0]});
          console.log("this.state.globalVariable", this.state.globalVariable);
        })

        this.state.freeExchangeInstance.balanceOf(accounts[0]).then((result) => {
          return new BigNumber(result).valueOf();
        }).then((result)=>{
          this.setState({ownerBalance: result});
        });

        this.state.freeExchangeInstance.owner().then((result)=>{
          this.setState({ownerAddress: result});
        });
          
        return instance;
      })
    })
  }

  handleChange(event) {
    event.preventDefault()
    console.log("event", event.target.value)
    this.setState({fieldTransferAmount: event.target.value})
  }

  handleChangeAddr(event) {
    event.preventDefault();
    console.log("event", event.target.value)
    this.setState({fieldTransferToAddress: event.target.value})
  }
 
  handleChangeGV(event) {
    event.preventDefault()
    event.persist();
    if (this.state.ownerBalance > 2) {
      this.setState({globalVariable: event.target.value});
    } else {
      console.log("you need at least 2 tokens to set the global variable");
      this.setState({formMessageGV: "You need at least 2 tokens to set the global variable"})
    }
  }

  onSubmitGV(event){
    event.preventDefault();
    event.persist();
    console.log("this.glovbalVariable", this.state.globalVariable);
    console.log("this.state.ownerBalance", this.state.ownerBalance);
    if (this.state.ownerBalance > 2) {

      this.state.freeExchangeInstance.setGlobalVariable(this.state.globalVariable)
      .then(()=>{
      this.state.freeExchangeInstance.reduceBalance(2);

      })
      .then(()=> {
        this.state.freeExchangeInstance.balanceOf(this.state.ownerAddress)
        .then((result)=>{
          let z = new BigNumber(result).valueOf();
          this.setState({ownerBalance:z});
          console.log("ownderBalance", this.statelownerBalance);
      })

      })

      // this.state.freeExchangeInstance.setGlobalVariable(event.target.value).then(result=>{
      //  console.log("result", result);
      // });
    } else {
      console.log("you need at least 2 tokens to set the global variable")
    }
  }

  onSubmit(event){
    event.preventDefault();
    event.persist();
    const target = event.target;

    this.state.web3.eth.getAccounts((error, accounts) => {
       this.setState({formMessage: "Transaction Pending"})
       this.state.freeExchangeInstance.transfer(this.state.fieldTransferToAddress, this.state.fieldTransferAmount)
      .then((result) => {
         this.state.freeExchangeInstance.owner().then((result) =>{
         this.setState({ownerAddress: result});
        });
        this.setState({transferToAddress: target.toAddress.value});
        this.state.freeExchangeInstance.balanceOf(this.state.transferToAddress).then((result)=>{
          let y = new BigNumber(result).valueOf();
          this.setState({transferToBalance:y});
          this.setState({fieldTransferAmount: ''});
          this.setState({fieldTransferToAddress: ''});
        });
        this.state.freeExchangeInstance.balanceOf(this.state.ownerAddress).then((result)=>{
          let z = new BigNumber(result).valueOf();
          this.setState({ownerBalance:z});
          
        }).then(()=>{
          this.setState({formMessage: ''});
        })
      })
  })}

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>
        <main className="container">
          <h2>YOUR DATA</h2>
          {/* <h4>Your address is: {this.state.ownerAddress}</h4> */}
          <h4>Tokens you own: {this.state.ownerBalance}</h4>
          <hr/>
          <hr/>
          <form onSubmit={this.onSubmit}>
            <h2>TRANSFER TOKEN</h2>
            <label>Address to transfer to (as a hexadecimal)</label><br/>
            <input  
              name="toAddress" 
              type="text" 
              value={this.state.fieldTransferToAddress} 
              onChange={this.handleChangeAddr}
              style={{width: 400}}
            />
            <br/>
            <label>
              How many tokens to transfer
            </label><br />
            <input 
              name="amount" 
              type="text" 
              value={this.state.fieldTransferAmount} 
              onChange={this.handleChange}
              style={{width: 50}}
            />
            <br/>
            <button>Transfer Tokens</button><br/>
        </form>
          <div>
            <hr/>
            <h4>Address to Receive Tokens: {this.state.transferToAddress}</h4>
            <h4>New Balance: {this.state.transferToBalance}</h4>
          </div>
        <h1 style={{color: '#00b894'}}>{this.state.formMessage}</h1>
        </main>
       <hr/>
       <hr/>
        <form onSubmit={this.onSubmitGV}>
        <h2>SET GLOBAL VARIABLE</h2>
            <input
              value={this.state.globalVariable}
              onChange={this.handleChangeGV}
            />
            <button>Amount to set</button>
          </form>
        <h1 style={{color: '#00b894'}}>{this.state.formMessageGV}</h1>
        
        <h4>GLOBAL VARIABLE {this.state.globalVariable}</h4>
      </div>
    );
  }
}

export default App