import React, { useState, useEffect } from 'react';
import '../css/umami.css'

const Stock =()=> {

  const [ ingredients, setIngredients ] = useState([])
  // hook to run on load, only once
  useEffect(() => {
    async function fetchIngredients() {
      let url = '/api/ingredients'
      const res = await fetch(url);
      const info = await res.json();
      setIngredients(info.ingredients);
    }
    fetchIngredients();
  }, []);

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
            <td> {item.stock} </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Stock;
