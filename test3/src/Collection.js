
import image from './headers/logo192.png'
import axios from 'axios'
import React from 'react'
//import {Grid, makeStyles} from '@material-ui/core'
//var info="";
const Collection =({text, text2, image2, text3, info})=> {
    const response = axios.get('https://api.coindesk.com/v1/bpi/currentprice.json');
    console.log('response', response)
    
    return (
     <div>
        <form></form>
        {text} <div>Coll</div>
        {text2} <div>Coll3</div>
        {image2} <img src={image} className='BB' alt=''/>
        {text3} <div>Coll5</div>
        {info} <div>{response.data}</div>
    </div>
    )
}

export default Collection;