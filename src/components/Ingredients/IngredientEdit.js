import React from 'react';
import '../css/umami.css'
import axios from 'axios'
import PropTypes from 'prop-types'

const IngredientEdit = ({toggleDialog}) => {

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget
    const out = {
            name: form.name.value,
            unit: form.unit.value,
          }
    const url = '/api/add-ingredient/'
    const msg = await axios.put(url, out)
    console.log(msg.data)
    toggleDialog();
    //e.persist();
  }

  return(
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-content box" style={{width:'70%'}}>
          <div className="container background-is-white">
            <div className="level">
              <form onSubmit={handleSubmit}>
                <div className="section">
                  <div className="level-item">
                    <div className="field is-grouped">
                      <label htmlFor='name' className="label is-medium"> Nombre: </label>
                      <div className="control">
                        <input type='text' name='name' id='name' className="input"/>
                      </div>
                      <label htmlFor='unit' className="label is-medium"> Unidad: </label>
                      <div className="control">
                        <input type='text' name='unit' id='unit' className="input"/>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="level-item">
                  <div className="control">
                    <input type="submit"
                           value="Agregar Ingrediente"
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

IngredientEdit.propTypes = {
  toggleDialog: PropTypes.func,
}

export default IngredientEdit;
