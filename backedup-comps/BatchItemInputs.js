import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../css/umami.css'
import RecipeItemInputs from '../Recipes/RecipeItemInputs'
import {api} from '../../actions'
import {connect} from "react-redux";

const BatchItemInputs =({ idx, recipeState, handleRecipeChange, handleRecipeRemove, recipeOptions, handleRecipeIngredientsChange, getIngredients}) => {

  const [ ingredients, setIngredients ] = useState([])
  const [ blankIngredientItem, setBlankIngredientItem ] = useState({})
  const [ ingredientsState, setIngredientsState ] = useState([])
  const [ isSubscribed, setSubscribe ] = useState(true)

  async function fetchIngredients() {
      const info = await getIngredients();
      if(isSubscribed) {
        setIngredients(info.ingredients);
        setBlankIngredientItem({
                              id: info.ingredients[0].id,
                              item: info.ingredients[0].name,
                              quantity: '0',
                              step: info.ingredients[0].step,
                              unit: info.ingredients[0].unit,
                            })
      }
  }
  // hook to run on load, only once
  useEffect(() => {
    fetchIngredients();
    if(isSubscribed) {
      setIngredientsState(recipeState[idx].ingredients)
    }
    return setSubscribe(false)
  }, [fetchIngredients, recipeState, idx, isSubscribed]);

  const updateOnRecipeChange =(e)=> {
    handleRecipeChange(e);
    setIngredientsState(recipeState[idx].ingredients)
  }

  const updateOnIngredientsChange =(e)=> {
    const updatedItems = [...ingredientsState];
    if(e.target.className === "item") {
      updatedItems[e.target.dataset.idx]['item'] = e.target.selectedOptions[0].value;
      updatedItems[e.target.dataset.idx]['step']=e.target.selectedOptions[0].dataset.step
      updatedItems[e.target.dataset.idx]['unit']=e.target.selectedOptions[0].dataset.unit
      updatedItems[e.target.dataset.idx]['id']=e.target.selectedOptions[0].dataset.id
    }
    else {
      updatedItems[e.target.dataset.idx][e.target.className] = e.target.value;
    }
    setIngredientsState(updatedItems)
    handleRecipeIngredientsChange({idx: idx, ingredients: updatedItems})
  }

  const updateOnIngredientsRemove =(e)=>{
    const updatedItems = [...ingredientsState];
    updatedItems.splice(e.target.dataset.idx, 1)
    setIngredientsState(updatedItems)
  }

  const addIngredient =()=> {
    setIngredientsState([...ingredientsState, {...blankIngredientItem}])
  }

  const itemName = `item-${idx}`;
  const itemQty = `quantity-${idx}`;
  return (
    <div className="content is-smaller">
      <div key={`item-${idx}`} className="field is-grouped item-entry">
        <label htmlFor={itemName} className="level-item label">{`Receta #${idx+1}`}</label>
        <div className="select">
          <select name={itemName}
                  data-idx={idx}
                  id={itemName}
                  value={recipeState[idx].item}
                  onChange={updateOnRecipeChange}
                  className="item"
          >
            {recipeOptions.map(
              (val, id) =>
                (<option
                  value={val.name}
                  key={id}
                  data-id={val.id}
                  >
                    {val.name}
                </option>)
            )}
          </select>
        </div>
        <label htmlFor={itemQty} className="level-item label"> Cant. </label>
        <input type="number"
               step='0.01'
               name={itemQty}
               data-idx={idx}
               id={itemQty}
               value={recipeState[idx].rations}
               className="rations"
               onChange={ handleRecipeChange }
               style={{width: '5em'}}
        />

        <input type="button"
               value="Eliminar"
               data-idx={idx}
               className="button is-danger is-light"
               onClick={ handleRecipeRemove }
        />
      </div>
      <div className="field box">
        {ingredientsState.map((val, idy)=>(
          <RecipeItemInputs
            key={`ingredient-${idy}`}
            idx={idy}
            itemState={ingredientsState}
            itemOptions={ingredients}
            handleItemChange={updateOnIngredientsChange}
            handleItemRemove={updateOnIngredientsRemove}
          />

        ))}
        <div className="level-item">
          <div className="control">
            <input type='button'
                   value='Agregar Item'
                   onClick={addIngredient}
                   className="button is-primary is-light"
            />
          </div>
        </div>
      </div>
    </div>
  );
};


BatchItemInputs.propTypes = {
  idx: PropTypes.number,
  recipeState: PropTypes.array,
  handleRecipeChange: PropTypes.func,
  handleRecipeRemove: PropTypes.func,
  recipeOptions: PropTypes.array,
};

const mapDispatchToProps = dispatch => {
  return {
    getIngredients: () => {
      return dispatch(api.getIngredients());
    }
  };
}

export default connect(null, mapDispatchToProps)(BatchItemInputs);
