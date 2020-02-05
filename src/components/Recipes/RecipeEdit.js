import React, { useState, useEffect } from 'react';
import RecipeItemInputs from './RecipeItemInputs';
import '../css/umami.css'
import axios from 'axios'
import PropTypes from 'prop-types'
import {api} from '../../actions'
import {connect} from "react-redux";


const RecipeEdit = ({toggleDialog, getIngredients, selectedDialog}) => {

  const rationsInput = React.createRef();
  const nameInput = React.createRef();
  const [ isSubscribed, setSubscribe ] = useState(true)
  const [ ingredients, setIngredients ] = useState([])
  const [ blankItem, setBlankItem ] = useState({})
  const [ itemState, setItemState ] = useState([]);

  async function fetchIngredients() {
    const info = await getIngredients()
    if(isSubscribed){
      setIngredients(info.ingredients);
      setBlankItem({ item: info.ingredients[0].name,
                     itemId: info.ingredients[0].id,
                     quantity: '',
                     step: info.ingredients[0].step,
                     unit: info.ingredients[0].unit,
                     note: ''
                   })
    }
  }

// hook to run on load, only once
  useEffect(() => {
      if(selectedDialog){
        rationsInput.current.value=selectedDialog.rations
        nameInput.current.value = selectedDialog.name
        let istate = [];
        selectedDialog.items.map((item, id) => {
          istate.push({
            item: item.item.name,
            itemId: item.item.id,
            quantity: item.quantity,
            step: item.item.step,
            unit: item.item.unit,
            note: item.note,
          })
          return null
        })
        setItemState(istate);
      }
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
      if(e.target.dataset.fname === "item") {
        updatedItems[e.target.dataset.idx]['item'] = e.target.selectedOptions[0].value;
        updatedItems[e.target.dataset.idx]['itemId'] = e.target.selectedOptions[0].dataset.itemid;
        updatedItems[e.target.dataset.idx]['step']=e.target.selectedOptions[0].dataset.step
        updatedItems[e.target.dataset.idx]['quantity']='0'
        updatedItems[e.target.dataset.idx]['unit']=e.target.selectedOptions[0].dataset.unit
      }
      else {
        updatedItems[e.target.dataset.idx][e.target.dataset.fname] = e.target.value;
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
            items: itemState,
            inputMode: 'add',
          }
    if(selectedDialog){
      out.recipeId = selectedDialog.id
      out['inputMode'] = 'edit'
    }
    const url = '/api/mod-recipe/'
    const msg = await axios.put(url, out).then(res => {
      toggleDialog();
      return res
    })
    console.log(msg.data)
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
                        <input ref={rationsInput} type='number' name='rations' id='date' step='0.1' className="input"/>
                      </div>
                      <label htmlFor='name' className="label is-medium"> Nombre: </label>
                      <div className="control">
                        <input ref={nameInput} type='text' name='name' id='store' className="input"/>
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
      return dispatch(api.getIngredients());
    }
  };
}

export default connect(null, mapDispatchToProps)(RecipeEdit);
