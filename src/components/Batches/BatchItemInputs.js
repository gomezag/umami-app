import React, { Component } from 'react';
import '../css/umami.css'
import RecipeItemInputs from '../Recipes/RecipeItemInputs'
import {api} from '../../actions'
import {connect} from "react-redux";

class BatchItemInputs extends Component {
  state = {
    ingredients: [],
    blankIngredientItem: {},
    ingredientsState: [],
    isSubscribed: true,
  }

  async fetchIngredients() {
      const info = await this.props.getIngredients();
      return info
  }

  componentDidMount() {
    this.fetchIngredients()
    .then(info => {
    if(this.state.isSubscribed) {
      this.setState({ingredients: info.ingredients,
                     blankIngredientItem: {
                            id: info.ingredients[0].id,
                            item: info.ingredients[0].name,
                            quantity: '0',
                            step: info.ingredients[0].step,
                            unit: info.ingredients[0].unit,
                      }
                    })
      this.setState({ingredientsState: this.props.recipeState[this.props.idx].ingredients})
    }
    return this.setState({isSubscribed: false})})


  }

  componentWillUnmount(){
    this.setState({isSubscribed:false})
  }

  updateOnRecipeChange(e) {
    this.props.handleRecipeChange(e);
    this.setState({ingredientsState: this.props.recipeState[this.props.idx].ingredients})
  }

  updateOnIngredientsChange(e){
    const updatedItems = [...this.state.ingredientsState];
    if(e.target.className === "item") {
      updatedItems[e.target.dataset.idx]['item'] = e.target.selectedOptions[0].value;
      updatedItems[e.target.dataset.idx]['step']=e.target.selectedOptions[0].dataset.step
      updatedItems[e.target.dataset.idx]['unit']=e.target.selectedOptions[0].dataset.unit
      updatedItems[e.target.dataset.idx]['id']=e.target.selectedOptions[0].dataset.id
    }
    else {
      updatedItems[e.target.dataset.idx][e.target.className] = e.target.value;
    }
    this.setState({ingredientsState: updatedItems})
    this.props.handleRecipeIngredientsChange({idx: this.props.idx, ingredients: updatedItems})
  }

  updateOnIngredientsRemove(e){
    const updatedItems = [...this.state.ingredientsState];
    updatedItems.splice(e.target.dataset.idx, 1)
    this.setState({ingredientsState: updatedItems})
  }

  addIngredient() {
    this.setState({ingredientsState: [...this.state.ingredientsState, {...this.state.blankIngredientItem}]})
  }

  render(){
    const itemName = `item-${this.props.idx}`;
    const itemQty = `quantity-${this.props.idx}`;
    return (
      <div className="content is-smaller">
        <div key={`item-${this.props.idx}`} className="field is-grouped item-entry">
          <label htmlFor={itemName} className="level-item label">{`Receta #${this.props.idx+1}`}</label>
          <div className="select">
            <select name={itemName}
                    data-idx={this.props.idx}
                    id={itemName}
                    value={this.props.recipeState[this.props.idx].item}
                    onChange={this.updateOnRecipeChange.bind(this)}
                    className="item"
            >
              {this.props.recipeOptions.map(
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
                 data-idx={this.props.idx}
                 id={itemQty}
                 value={this.props.recipeState[this.props.idx].rations}
                 className="rations"
                 onChange={ this.props.handleRecipeChange }
                 style={{width: '5em'}}
          />

          <input type="button"
                 value="Eliminar"
                 data-idx={this.props.idx}
                 className="button is-danger is-light"
                 onClick={ this.props.handleRecipeRemove }
          />
        </div>
        <div className="field box">
          {this.state.ingredientsState.map((val, idy)=>(
            <RecipeItemInputs
              key={`ingredient-${idy}`}
              idx={idy}
              itemState={this.state.ingredientsState}
              itemOptions={this.state.ingredients}
              handleItemChange={this.updateOnIngredientsChange.bind(this)}
              handleItemRemove={this.updateOnIngredientsRemove.bind(this)}
            />

          ))}
          <div className="level-item">
            <div className="control">
              <input type='button'
                     value='Agregar Item'
                     onClick={this.addIngredient.bind(this)}
                     className="button is-primary is-light"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const mapDispatchToProps = dispatch => {
  return {
    getIngredients: () => {
      return dispatch(api.getIngredients());
    }
  };
}

export default connect(null, mapDispatchToProps)(BatchItemInputs);
