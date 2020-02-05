import React, { useState, useEffect } from 'react';
import '../css/umami.css';
import axios from 'axios';
import IngredientEdit from './IngredientEdit';
import {api} from '../../actions'
import {connect} from "react-redux";

const IngredientList =({getIngredients})=>{

  const [ ingredients, setIngredients ] = useState([])
  const [ isSubscribed, setSubscribe ] = useState(true)

  async function fetchIngredients() {
    const info = await getIngredients();
    if(isSubscribed) {
      setIngredients(info.ingredients);
    }
  }

  // hook to run on load, only once
  useEffect(() => {
    fetchIngredients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
        return setSubscribe(false)
    }
  }, [setSubscribe])

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

const mapDispatchToProps = dispatch => {
  return {
    getIngredients: () => {
      return dispatch(api.getIngredients());
    }
  };
}

export default connect(null, mapDispatchToProps)(IngredientList);
