import React, { useState, useEffect } from 'react';
import RecipeItemInputs from './RecipeItemInputs';
import '../css/umami.css'
import axios from 'axios'
import PropTypes from 'prop-types'
import {api} from '../../actions'
import {connect} from "react-redux";


const RecipeEdit = ({toggleDialog, getIngredients, selectedDialog}) => {

  const [ isSubscribed, setSubscribe ] = useState(true)
  const [ ingredients, setIngredients ] = useState([])
  const [ blankItem, setBlankItem ] = useState({})
  const [ itemState, setItemState ] = useState([]);

  async function fetchIngredients() {
    const info = await getIngredients();
    if(isSubscribed){
      setIngredients(info.ingredients);
      setBlankItem({ item: info.ingredients[0].name,
                     quantity: '',
                     step: info.ingredients[0].step,
                     unit: info.ingredients[0].unit,
                     note: ''
                   })
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

  const addItem = () => {
    setItemState([...itemState, {...blankItem}]);
  };

  const handleItemChange =(e)=> {
      const updatedItems = [...itemState];
      if(e.target.className === "item") {
        updatedItems[e.target.dataset.idx]['item'] = e.target.selectedOptions[0].value;
        updatedItems[e.target.dataset.idx]['step']=e.target.selectedOptions[0].dataset.step
        updatedItems[e.target.dataset.idx]['quantity']='0'
        updatedItems[e.target.dataset.idx]['unit']=e.target.selectedOptions[0].dataset.unit
      }
      else {
        updatedItems[e.target.dataset.idx][e.target.className] = e.target.value;
      }

      setItemState(updatedItems);
  };

  const handleItemRemove =(e)=> {
    const updatedItems = [...itemState];
    updatedItems.splice(e.target.dataset.idx, 1)
    setItemState(updatedItems)
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget
    const out = {
            name: form.name.value,
            rations: form.rations.value,
            items: itemState
          }
    console.log(out)
    const url = '/api/add-recipe/'
    const msg = await axios.put(url, out)
    console.log(msg.data)
    //e.persist();
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
                      <label htmlFor='rations' className="label is-medium"> Raciones: </label>
                      <div className="control">
                        <input type='number' name='rations' id='date' step='0.1' className="input"/>
                      </div>
                      <label htmlFor='name' className="label is-medium"> Nombre: </label>
                      <div className="control">
                        <input type='text' name='name' id='store' className="input"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="level-item">
                  <div className="control">
                    <input type='button'
                           value='Agregar Item'
                           onClick={addItem}
                           className="button is-primary is-light"
                    />
                  </div>
                </div>
                {
                  (ingredients.length !== 0 && blankItem.step) ?
                    itemState.map((val, idx) => (
                      <RecipeItemInputs
                        key = {`item-${idx}`}
                        idx = {idx}
                        itemState = {itemState}
                        handleItemChange = {handleItemChange}
                        handleItemRemove = {handleItemRemove}
                        itemOptions = {ingredients}
                      />
                    ))
                    : <div className="level-item">
                        No ingredients defined!
                      </div>
                }

                <div className="level-item">
                  <div className="control">
                    <input type="submit"
                           value="Agregar Receta"
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

RecipeEdit.propTypes = {
  toggleDialog:PropTypes.func,
}

const mapDispatchToProps = dispatch => {
  return {
    getIngredients: () => {
      dispatch(api.getIngredients());
    }
  };
}

export default connect(null, mapDispatchToProps)(RecipeEdit);
