import React, { useState, useEffect } from 'react';
import '../css/umami.css';
import axios from 'axios';
import IngredientEdit from './IngredientEdit';

const IngredientList =()=>{

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

  async function fetchIngredients() {
    let url = '/api/ingredients'
    const res = await fetch(url);
    const info = await res.json();
    setIngredients(info.ingredients);
  }

  async function handleDelete(e) {
    let url='/api/del-ingredient/'
    const ingredient = e.val
    const out = {
      'id': ingredient.id,
    }
    const msg = await axios.put(url, out)
    console.log(msg)
    fetchIngredients();
  }

  const [ showDialog, setShowDialog ] = useState(false)

  function toggleDialog() {
    const show = !showDialog
    setShowDialog(show)
    fetchIngredients();
  }

  return (
      <div className="container">
      {showDialog ?
        <IngredientEdit toggleDialog={toggleDialog}/>
        : null
      }
      <div className="tile is-ancestor">
        <div className="tile is-8">
          { ingredients.map((val, id) => (
            <div className="tile is-parent" key={id}>
              <article className="tile is-child notification is-primary">
                <a href="/#" className="delete" onClick={()=>handleDelete({val})}> </a>
                <p className="title"> {val.name} </p>
                <div className="content">
                  <p> Stock: {val.stock} </p>
                </div>
              </article>
            </div>
          ))}
          <div className="tile is-parent">
            <article className="tile is-child notification is-primary center"
                     onClick={toggleDialog}>
                <p className="is-large"> + </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  )

}

export default IngredientList;
