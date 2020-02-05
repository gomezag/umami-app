import React from 'react';
import PropTypes from 'prop-types';
import '../css/umami.css'



const ItemInputs =({ idx, itemState, handleItemChange, handleItemRemove, itemOptions }) => {
  const itemName = `item-${idx}`;
  const itemQty = `quantity-${idx}`;
  const itemPrice = `price-${idx}`;
  const itemNote = `note-${idx}`;
  return (
    <div className="section is-smaller" style={{width:'100%'}}>
      <div key={`item-${idx}`} className="field has-addons-centered is-grouped">
        <label htmlFor={itemName} className="level-item label">{`Item`}</label>
        <div className="select">
          <select name={itemName}
                  data-idx={idx}
                  id={itemName}
                  value={itemState[idx].item}
                  onChange={handleItemChange}
                  data-fname="item"
          >
            {itemOptions.map(
              (val, id) =>
                <option value={val.name}
                        key={id}
                        data-step={val.step}
                        data-unit={val.unit}
                        data-itemid={val.id}
                        > {val.name} </option>
            )}
          </select>
        </div>
        <label htmlFor={itemQty} className="level-item label"> # </label>
        <input type="number"
               step={itemState[idx].step}
               name={itemQty}
               data-idx={idx}
               id={itemQty}
               value={itemState[idx].quantity}
               data-fname="quantity"
               onChange={ handleItemChange }
               style={{width:'4rem'}}
        />
        <p className="level-item is-size-5">
          {itemState[idx].unit}
        </p>
        <label htmlFor={itemPrice} className="level-item label"> Precio </label>
        <input type="number"
               name={itemPrice}
               data-idx={idx}
               id={itemPrice}
               value={itemState[idx].price}
               data-fname="price"
               onChange={ handleItemChange }
               style={{width:'7rem'}}
        />
        <p className="level-item is-size-5"> Gs.  </p>

        <input type="button"
               value="Eliminar"
               data-idx={idx}
               className="button is-danger is-light"
               onClick={ handleItemRemove }
        />
      </div>
      <div className="field">
        <label htmlFor={itemNote} className="level-item label"> Nota </label>
        <input type="text"
               name={itemNote}
               data-idx={idx}
               id={itemNote}
               value={itemState[idx].note}
               data-fname="note"
               onChange={ handleItemChange }
               className="textarea"
               rows='2'
        />
      </div>
    </div>
  );
};


ItemInputs.propTypes = {
  idx: PropTypes.number,
  itemState: PropTypes.array,
  handleItemChange: PropTypes.func,
  handleItemRemove: PropTypes.func,
  itemOptions: PropTypes.array,
};

export default ItemInputs;
