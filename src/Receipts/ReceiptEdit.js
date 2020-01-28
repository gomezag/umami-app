import React, { useState, useEffect } from 'react';
import './ReceiptEdit.css'
import ItemInputs from './ItemInputs';
import '../css/umami.css'
import axios from 'axios'
import { getCurrentDate } from '../utils'
import PropTypes from 'prop-types'

const ReceiptEdit = ({toggleDialog}) => {

  const [ ingredients, setIngredients ] = useState([])
  const [ blankItem, setBlankItem ] = useState({})
  const [ itemState, setItemState ] = useState([]);
  const [ receiptTotal, setReceiptTotal ] = useState(0);

// hook to run on load, only once
  useEffect(() => {
    async function fetchIngredients() {
        let url = '/api/ingredients'
        const res = await fetch(url);
        const info = await res.json();
        setIngredients(info.ingredients);
        setBlankItem({ item: info.ingredients[0].name,
                       quantity: '',
                       price: '',
                       step: info.ingredients[0].step,
                       unit: info.ingredients[0].unit,
                       note: ''
                     })
      }
      fetchIngredients();
  }, []);

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
      let total = itemState.reduce(function(r,a) {
        return r+Number(a['price'])
      }, 0)
      setItemState(updatedItems);
      setReceiptTotal(total);
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
            date: form.date.value,
            store: form.store.value,
            items: itemState
          }
    const url = '/api/add-receipt/'
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
                    <label htmlFor='store' className="label is-medium"> Tienda: </label>
                    <div className="control">
                      <input type='text' name='store' id='store' className="input"/>
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
                    <ItemInputs
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
                  <p className="is-size-2"> Total: {(receiptTotal).toLocaleString('es')} Gs.</p>
              </div>
              <div className="level-item">
                <div className="control">
                  <input type="submit"
                         value="Agregar Ticket"
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

ReceiptEdit.propTypes = {
  toggleDialog: PropTypes.func,
}


export default ReceiptEdit;
