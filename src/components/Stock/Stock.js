import React, { useState, useEffect } from 'react';
import '../css/umami.css'
import {api} from '../../actions'
import {connect} from "react-redux";

const Stock =({getIngredients})=> {

  const [ ingredients, setIngredients ] = useState([])
  const [ isSubscribed, setSubscribe ] = useState(true)
  // hook to run on load, only once
  async function fetchIngredients() {
    const info = await getIngredients();
    if(isSubscribed){
      setIngredients(info.ingredients)
    }
  }

  useEffect(() => {
    fetchIngredients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
        setSubscribe(false)
    }
  }, [setSubscribe])

  return(
    <table className='table'>
      <thead>
        <tr>
          <th> Id </th>
          <th> Item </th>
          <th><abbr title='Cantidad'> Cant. </abbr></th>
        </tr>
      </thead>
      <tbody>
        {ingredients.map((item, idx) => (
          <tr key={idx}>
            <td> {item.id} </td>
            <td> {item.name} </td>
            <td> {item.stock} {item.unit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    getIngredients: () => {
      return dispatch(api.getIngredients());
    }
  };
}

export default connect(null, mapDispatchToProps)(Stock);
