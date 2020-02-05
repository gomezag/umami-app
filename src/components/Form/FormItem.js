import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import '../css/umami.css'

const FormItem =({ idx, itemState, handleItemChange, handleItemRemove, itemOptions, formInputs }) => {

  const [inputs, setInputs] = useState([])

  //Initialize the input list with options taken from the formInputs object
  useEffect(() => {
    const list = []
    formInputs.map((val, id) => {
      const input = {
        name: val.name,
        idname: val.name+'-'+idx,
        type: val.type,
        title: val.name + '#'+(idx+1),
        style: val.style,
      };
      list.push(input);
    });
    setInputs(list)
  }, [setInputs])

  return (
    <div className="level-item section is-smaller">
      <div key={`item-${idx}`} className="field is-grouped item-entry">
        {
          inputs.map((val, id) => (
            <div key={id}>
              <label htmlFor={val.idname} className="level-item label">{val.title}</label>
                {(val.type === "select") ?
                  <div key={`input-${id}`} className="select">
                    <select name={val.idname}
                            data-idx={idx}
                            id={val.idname}
                            value={itemState[idx][val.name]}
                            onChange={handleItemChange}
                            className={val.name}
                    >
                      {itemOptions.map(
                        (val2, id2) =>
                          <option value={val2.name}
                                  key={id2}
                          >
                            {val2.name}
                          </option>
                      )}
                    </select>
                  </div>
                :
                  (val.unit) ?
                      <div key={`input-${id}`}>
                        <input type={val.type}
                               step={itemState[idx].step}
                               name={val.idname}
                               data-idx={idx}
                               id={val.idname}
                               value={itemState[idx][val.name]}
                               onChange={handleItemChange}
                               className={val.name}
                               style={val.style}
                        />
                        <p className="level-item is-size-5">
                          {val.unit}
                        </p>
                      </div>
                    :
                      <div key={`input-${id}`}>
                        <input type={val.type}
                               step={itemState[idx].step}
                               name={val.idname}
                               data-idx={idx}
                               id={val.idname}
                               value={itemState[idx][val.name]}
                               onChange={handleItemChange}
                               className={val.name}
                               style={val.style}
                        />
                      </div>
                }
              </div>
          ))
        }
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


FormItem.propTypes = {
  idx: PropTypes.number,
  itemState: PropTypes.array,
  handleItemChange: PropTypes.func,
  handleItemRemove: PropTypes.func,
  itemOptions: PropTypes.array,
  formInputs: PropTypes.array,
};

export default FormItem;
