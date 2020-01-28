import React, { useState, useEffect } from 'react';
import '../css/umami.css'
import axios from 'axios'
import RecipeEdit from './RecipeEdit'

const RecipeList =()=>{

  const [ recipes, setRecipe ] = useState([])

  // hook to run on load, only once
  useEffect(() => {
    async function fetchRecipe() {
      let url = '/api/recipes'
      const res = await fetch(url);
      const info = await res.json();
      setRecipe(info.recipes);
    }
    fetchRecipe();
  }, []);

  async function fetchRecipe() {
    let url = '/api/recipes'
    const res = await fetch(url);
    const info = await res.json();
    setRecipe(info.recipes);
  }

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

  function toggleDialog() {
    const show = !showDialog
    setShowDialog(show)
    fetchRecipe();
  }

  return (
    <div className="content">
      {showDialog ?
        <RecipeEdit toggleDialog={toggleDialog}/>
        : null
      }
      <div className="tile is-ancestor">
        <div className="tile is-parent">
          { recipes.map((val, id) => (
            <div key={id} className="tile is-parent ">
              <article className="tile is-child box notification is-primary">
                <a href="/#" className="delete" onClick={() => handleDelete({val})}> </a>
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
                     onClick={toggleDialog}>
                <p className="is-large"> + </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  )

}

export default RecipeList;
