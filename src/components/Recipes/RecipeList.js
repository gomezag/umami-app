import React, { useState, useEffect } from 'react';
import '../css/umami.css'
import axios from 'axios'
import RecipeEdit from './RecipeEdit'
import {api} from '../../actions'
import {connect} from "react-redux";

const RecipeList =({getRecipes})=>{

  const [ recipes, setRecipe ] = useState([])
  const [ isSubscribed, setSubscribe ] = useState(true)
  //
  // async function fetchRecipe() {
  //   return await getRecipes();
  // }
  async function fetchRecipe() {
        const info = await getRecipes();
        if(isSubscribed) {
            setRecipe(info.recipes);
          }
  }

  useEffect(() => {
    fetchRecipe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
        return setSubscribe(false)
    }
  }, [setSubscribe])


  async function handleDelete(e) {
    let url='/api/del-recipe/'
    const recipe = e.val
    const out = {
      'id': recipe.id,
    }
    const msg = await axios.put(url, out)
    console.log(msg)
    fetchRecipe();
  }

  const [ showDialog, setShowDialog ] = useState(false)
  const [ selectedDialog, setSelectedDialog ] = useState()

  function toggleDialog() {
    const show = !showDialog
    setShowDialog(show)
    fetchRecipe();
  }

  const selectRecipe =(e)=> {
    if(e.currentTarget.dataset.idx){
      setSelectedDialog(recipes[e.currentTarget.dataset.idx])
    }
    else{
      setSelectedDialog(null)
    }
    toggleDialog();
  }

  return (
    <div className="content">
      {showDialog ?
        <RecipeEdit toggleDialog={toggleDialog} selectedDialog={selectedDialog}/>
        : null
      }
      <div className="tile is-ancestor">
        <div className="tile is-parent">
          { recipes.map((val, id) => (
            <div key={id} className="tile is-parent ">
              <article className="tile is-child box notification is-primary">
                <a href="/#" className="delete" onClick={() => handleDelete({val})}> </a>
                <a href="/#" className="add" onClick={selectRecipe} data-idx={id}> Edit </a>
                <p className="title"> {val.name} </p>
                <div className="content">
                  {val.items.map((val2, id2) => (
                    <ul key={id2}> {val2.item.name} - {val2.quantity} {val2.item.unit}</ul>
                  ))}
                </div>
              </article>
            </div>
          ))}
          <div className="tile is-parent">
            <article className="tile is-child notification is-primary center"
                     onClick={selectRecipe}>
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
    getRecipes: () => {
      return dispatch(api.getRecipes());
    }
  };
}

export default connect(null, mapDispatchToProps)(RecipeList);
