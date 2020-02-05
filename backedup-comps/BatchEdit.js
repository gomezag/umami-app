import React, { useState, useEffect } from 'react';
import BatchItemInputs from './BatchItemInputs';
import '../css/umami.css'
import axios from 'axios'
import { getCurrentDate } from '../utils'
import PropTypes from 'prop-types'
import {api} from '../../actions'
import {connect} from "react-redux";

const BatchEdit = ({toggleDialog, getRecipes}) => {


  const [ recipes, setRecipes ] = useState([])
  const [ blankRecipeItem, setBlankRecipeItem ] = useState({})
  const [ itemRecipeState, setItemRecipeState ] = useState([]);
  const [ isSubscribed, setSubscribe ] = useState(true)

  async function fetchRecipe() {;
      const info = await getRecipes();
      if(isSubscribed){
        setRecipes(info.recipes);
        const istate = [];
        const ingredients = info.recipes[0].items
        ingredients.map((val, id) =>
          istate.push( {
                        id: val.item.id,
                        item: val.item.name,
                        quantity: val.quantity,
                        step: val.item.step,
                        unit: val.item.unit
                      })
        )
        setBlankRecipeItem({ recipe_id: info.recipes[0].id,
                             item: info.recipes[0].name,
                             rations: '1',
                             ingredients: istate
                          })
      }
  }

// hook to run on load, only once
  useEffect(() => {
    fetchRecipe();
    return setSubscribe(false)
  }, []);

  const addRecipeItem = () => {
    setItemRecipeState([...itemRecipeState, {...blankRecipeItem}]);
  };

  const handleRecipeItemChange =(e)=> {
      const updatedItems = [...itemRecipeState];
      if(e.currentTarget.className === "item") {
        updatedItems[e.currentTarget.dataset.idx]['item'] = e.currentTarget.selectedOptions[0].value;
        updatedItems[e.currentTarget.dataset.idx]['recipe_id'] = e.currentTarget.selectedOptions[0].dataset.id;
        const ingredients = recipes.find(obj=>{return obj.id === parseInt(e.currentTarget.selectedOptions[0].dataset.id)}).items
        const istate = [];
        ingredients.map((val, id) =>
          istate.push( {
                        id: val.item.id,
                        item: val.item.name,
                        quantity: val.quantity,
                        step: val.item.step,
                        unit: val.item.unit
                      })
          )
        updatedItems[e.currentTarget.dataset.idx]['ingredients'] = istate
      }
      else {
        updatedItems[e.currentTarget.dataset.idx][e.currentTarget.className] = e.target.value;
      }
      setItemRecipeState(updatedItems);
  };

  const handleRecipeIngredientsChange =(e)=> {
    const updatedItems = [...itemRecipeState]
    updatedItems[e.idx]['ingredients']= e.ingredients
  }

  const handleRecipeItemRemove =(e)=> {
    const updatedItems = [...itemRecipeState];
    updatedItems.splice(e.target.dataset.idx, 1)
    setItemRecipeState(updatedItems)
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget
    const out = {
            date: form.date.value,
            name: form.name.value,
            batches: itemRecipeState
          }
    const url = '/api/add-production/'
    const msg = await axios.put(url, out)
    console.log(msg.data)
    toggleDialog();
  }

  return(
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content box" style={{width:'70%'}}>
        <div className="container">
          <div className="level">
            <form onSubmit={handleSubmit}>
              <div className="section">
                <div className="level-item">
                  <div className="field is-grouped">
                    <label htmlFor='date' className="label is-medium"> Fecha: </label>
                    <div className="control">
                      <input type='date' name='date' id='date' className="input" defaultValue={getCurrentDate()}/>
                    </div>
                    <label htmlFor='name' className="label is-medium"> Nombre: </label>
                    <div className="control">
                      <input type='text' name='name' id='name' className="input"/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="field is-grouped">
                <div className="level-item">
                  <div className="control">
                    <input type='button'
                           value='Agregar Receta'
                           onClick={addRecipeItem}
                           className="button is-primary is-light"
                    />
                  </div>
                </div>
              </div>
              {
                (recipes.length !== 0) ?
                  itemRecipeState.map((val, idx) => (
                    <BatchItemInputs
                      key = {`bitem-${idx}`}
                      idx = {idx}
                      recipeState = {itemRecipeState}
                      handleRecipeChange = {handleRecipeItemChange}
                      handleRecipeRemove = {handleRecipeItemRemove}
                      recipeOptions = {recipes}
                      handleRecipeIngredientsChange = {handleRecipeIngredientsChange}
                    />
                  ))
                  : <div className="level-item">
                      No recipes defined!
                    </div>
              }
              <div className="level-item">
                <div className="control">
                  <input type="submit"
                         value="Agregar Producción"
                         className="button is-primary"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
    </div>
    <button className="modal-close is-large" aria-label="close" onClick={toggleDialog}></button>
  </div>
  );
};

BatchEdit.propTypes = {
  toggleDialog: PropTypes.func,
}

const mapDispatchToProps = dispatch => {
  return {
    getRecipes: () => {
      return dispatch(api.getRecipes());
    }
  };
}

export default connect(null, mapDispatchToProps)(BatchEdit);
