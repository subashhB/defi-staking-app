import React,{Component} from 'react';
import Navbar from './Navbar';
import Web3 from 'web3';

class App extends Component{
    async UNSAFE_componentWillMount(){
        await this.loadWeb3();
        await this.loadBlockChainData()
    }

    async loadWeb3(){
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } 
        else if(window.web3){
            window.web3 = new Web3(window.web3.currentProvider)
        } 
        else{
            window.alert('No Etherium Browser detected.')
        }
    }

    async loadBlockChainData(){
        const web3 = window.web3
        const account = await web3.eth.getAccounts()
        console.log(account)
    }

    constructor(props){
        super(props)
        this.state = {
            account: '0xAjbajnd'
        }
    }
    //React Code
    render(){
        return(
            <div>
                <Navbar account={this.state.account}/>
            </div>
        )
    }
}

export default App;