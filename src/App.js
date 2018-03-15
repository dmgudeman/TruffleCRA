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
      console.log("CWM results.web3", results.web3);
      console.log("CWM results.web3.version", results.web3.version);

      // results.web3.eth.getAccounts(function(err, res){ console.log("CWM getAccounts", res); });
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch((err) => {
      console.log('Error finding web3.');

      console.log(err)

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
        console.log("this.state.web3.currentProvider.address", this.state.web3.currentProvider.address);
    this.setState({defaultAccount: this.state.web3.currentProvider.address});
    console.log("his.state.defaultAccount", this.state.defaultAccount)
    freeExchange.setProvider(this.state.web3.currentProvider);

    this.state.web3.eth.getCoinbase(function(error, results){ console.log(results); freeExchange.defaults({from: results})});

    // // Declaring this for later so we can chain functions on FreeExchange.
    // // Get accounts.const {freeExchangeInstance} = this.state;
        console.log("defaultAccount", this.state.defaultAccount)

        freeExchange.deployed().then((instance) => {
            this.setState({freeExchangeInstance: instance});
            console.log("instance", instance);

            instance.getGlobalVariable()
                .then(result => {
                    console.log("reult", result.c[0])
    //     //     //     // console.log("result.c[0]", result.c[0]);
    //     //     //     // console.log("this.state.globalVariable", this.state.globalVariable);
                    let q = result ? result.c[0] : 0;
                    this.setState({globalVariable: q});
    //     //     //     console.log("this.state.globalVariable", this.state.globalVariable);
    //     //     //     console.log("q", q)
           })
    //     //
     this.state.freeExchangeInstance.balanceOf(this.state.defaultAccount)
             .then((result) => {

                let r = new BigNumber(result).valueOf();
                 console.log("rrrr", r);
                 return r;
            }).then((result) => {
                this.setState({ownerBalance: result});
                return this.state;
               }).then((r)=>{console.log("this.state.ownerBalance", this.state.ownerBalance)});
    //     //     //

            this.state.freeExchangeInstance.owner().then((result) => {
                this.setState({ownerAddress: result});
                return this.state;
            });

            return this.state;
        })

  }

  handleChange(event) {

    event.preventDefault()
    console.log("event", event.target.value)
  try { this.setState({fieldTransferAmount: event.target.value}) }
  catch (e) {console.log("error", e)}
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
    try {
        if (this.state.ownerBalance > 2) {

            this.state.freeExchangeInstance.setGlobalVariable(this.state.globalVariable)
                .then(() => {
                    this.state.freeExchangeInstance.reduceBalance(2);

                })
                .then(() => {
                    this.state.freeExchangeInstance.balanceOf(this.state.ownerAddress)
                        .then((result) => {
                            let z = new BigNumber(result).valueOf();
                            this.setState({ownerBalance: z});
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
    catch (e) {console.log("error in onSubmitGV", e)}
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
          <h4>Your address is: {this.state.ownerAddress}</h4>
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