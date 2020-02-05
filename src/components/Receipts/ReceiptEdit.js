import React, { useState, useEffect } from 'react';
import ItemInputs from './ItemInputs';
import '../css/umami.css'
import axios from 'axios'
import { getCurrentDate } from '../utils'
import PropTypes from 'prop-types'
import {api} from '../../actions'
import {connect} from "react-redux";

const ReceiptEdit = ({toggleDialog, getIngredients, selectedDialog}) => {

  const [ ingredients, setIngredients ] = useState([])
  const [ blankItem, setBlankItem ] = useState({})
  const [ itemState, setItemState ] = useState([]);
  const [ receiptTotal, setReceiptTotal ] = useState(0);
  const [ isSubscribed, setSubscribe ] = useState(true)

// hook to run on load, only once
  async function fetchIngredients() {
      const info = await getIngredients();
      if(isSubscribed) {
        setIngredients(info.ingredients);
        setBlankItem({ item: info.ingredients[0].name,
                       itemId: info.ingredients[0].id,
                       quantity: '',
                       price: '',
                       step: info.ingredients[0].step,
                       unit: info.ingredients[0].unit,
                       note: ''
                     })
      }
    }

  useEffect(() => {
      if(selectedDialog){
        console.log(selectedDialog)
        let istate = [];
        selectedDialog.items.map((item, id) => {
          istate.push({
            item: item.item.name,
            itemId: item.item.id,
            quantity: item.quantity,
            price: item.price,
            step: item.item.step,
            unit: item.item.unit,
            note: item.note,
          })
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
        updatedItems[e.target.dataset.idx]['step']=e.target.selectedOptions[0].dataset.step
        updatedItems[e.target.dataset.idx]['quantity']='0'
        updatedItems[e.target.dataset.idx]['unit']=e.target.selectedOptions[0].dataset.unit
        updatedItems[e.target.dataset.idx]['itemId']=e.target.selectedOptions[0].dataset.itemid
      }
      else {
        updatedItems[e.target.dataset.idx][e.target.dataset.fname] = e.target.value;
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
            items: itemState,
            inputMode: 'add'
          }
    if(selectedDialog){
      out.receiptId =  selectedDialog.id
      out['inputMode'] = 'edit'
    }
    console.log(out)
    const url = '/api/mod-receipt/'
    const msg = await axios.put(url, out)
    console.log(msg.data)
    toggleDialog();
  }

  return(
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content box is-centered" style={{width:'80%'}}>
        <div className="container">
          <div className="level">
            <form onSubmit={handleSubmit} className="form">
              <div className="section">
                <div className="">
                  <div className="field">
                    <label htmlFor='date' className="label is-medium"> Fecha: </label>
                    <div className="control">
                      <input type='date' name='date' id='date' className="input" defaultValue={getCurrentDate()}/>
                    </div>
                  </div>
                  <div className="field">
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
                         value={selectedDialog ? "Editar Ticket" : "Agregar Ticket"}
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

const mapDispatchToProps = dispatch => {
  return {
    getIngredients: () => {
      return dispatch(api.getIngredients());
    }
  };
}

export default connect(null, mapDispatchToProps)(ReceiptEdit);
