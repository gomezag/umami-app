import React from 'react';
import PropTypes from 'prop-types';
import '../css/umami.css'



const RecipeItemInputs =({ idx, itemState, handleItemChange, handleItemRemove, itemOptions }) => {
  const itemName = `item-${idx}`;
  const itemQty = `quantity-${idx}`;
  const itemNote = `note-${idx}`;
  return (
    <div className="level-item section is-smaller">
      <div key={`item-${idx}`} className="field is-grouped item-entry">
        <label htmlFor={itemName} className="level-item label">{`Ingrediente #${idx+1}`}</label>
        <div className="select">
          <select name={itemName}
                  data-idx={idx}
                  id={itemName}
                  value={itemState[idx].item}
                  onChange={handleItemChange}
                  data-fname="item"
                  className="item"
          >
            {itemOptions.map(
              (val, id) =>
                <option value={val.name}
                        key={id}
                        data-step={val.step}
                        data-unit={val.unit}
                        data-itemid={val.id}
                >
                  {val.name}
                </option>
            )}
          </select>
        </div>
        <label htmlFor={itemQty} className="level-item label"> Cant. </label>
        <input type="number"
               step={itemState[idx].step}
               name={itemQty}
               data-idx={idx}
               id={itemQty}
               value={itemState[idx].quantity}
               className="quantity"
               data-fname="quantity"
               onChange={ handleItemChange }
               style={{width: '5em'}}
        />
        <p className="level-item is-size-5">
          {itemState[idx].unit}
        </p>
        <label htmlFor={itemNote} className="level-item label"> Nota </label>
        <input type="text"
               name={itemNote}
               data-idx={idx}
               id={itemNote}
               value={itemState[idx].note}
               data-fname="note"
               className="note"
               onChange={ handleItemChange }
        />
        <input type="button"
               value="Eliminar"
               data-idx={idx}
               className="button is-danger is-light"
               onClick={ handleItemRemove }
        />
      </div>
    </div>
  );
};


RecipeItemInputs.propTypes = {
  idx: PropTypes.number,
  itemState: PropTypes.array,
  handleItemChange: PropTypes.func,
  handleItemRemove: PropTypes.func,
  itemOptions: PropTypes.array,
};

export default RecipeItemInputs;
