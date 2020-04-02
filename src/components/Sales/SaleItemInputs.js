import React, { Component } from 'react';
import '../css/umami.css'
import RecipeItemInputs from '../Recipes/RecipeItemInputs'
import {api} from '../../actions'
import {connect} from "react-redux";

class SaleItemInputs extends Component {
  state = {
    //ingredients: [],
    //blankIngredientItem: {},
    //ingredientsState: [],
    isSubscribed: true,
  }

  async fetchIngredients() {
      const info = await this.props.getIngredients();
      return info
  }

  componentDidMount() {
    // this.fetchIngredients()
    // .then(info => {
    // if(this.state.isSubscribed) {
    //   this.setState({ingredients: info.ingredients,
    //                  blankIngredientItem: {
    //                         id: info.ingredients[0].id,
    //                         item: info.ingredients[0].name,
    //                         quantity: '0',
    //                         step: info.ingredients[0].step,
    //                         unit: info.ingredients[0].unit,
    //                   }
    //                 })
    //   this.setState({ingredientsState: this.props.recipeState[this.props.idx].ingredients})
    // }
    this.refs = {}
    Object.keys(this.props.inputTypes).map((key, id)=>{
      this.refs[key] = React.createRef();
    })
      console.log(this.props.itemState)
  }

  componentWillUnmount(){
    this.setState({isSubscribed:false})
  }

  updateOnItemChange(e) {
    this.props.handleItemChange(e);
  }

  // updateOnIngredientsChange(e){
  //   const updatedItems = [...this.state.ingredientsState];
  //   if(e.target.className === "item") {
  //     updatedItems[e.target.dataset.idx]['item'] = e.target.selectedOptions[0].value;
  //     updatedItems[e.target.dataset.idx]['step']=e.target.selectedOptions[0].dataset.step
  //     updatedItems[e.target.dataset.idx]['unit']=e.target.selectedOptions[0].dataset.unit
  //     updatedItems[e.target.dataset.idx]['id']=e.target.selectedOptions[0].dataset.id
  //   }
  //   else {
  //     updatedItems[e.target.dataset.idx][e.target.className] = e.target.value;
  //   }
  //   this.setState({ingredientsState: updatedItems})
  //   this.props.handleRecipeIngredientsChange({idx: this.props.idx, ingredients: updatedItems})
  // }
  //
  // updateOnIngredientsRemove(e){
  //   const updatedItems = [...this.state.ingredientsState];
  //   updatedItems.splice(e.target.dataset.idx, 1)
  //   this.setState({ingredientsState: updatedItems})
  // }
  //
  // addIngredient() {
  //   this.setState({ingredientsState: [...this.state.ingredientsState, {...this.state.blankIngredientItem}]})
  // }

  render(){
    return (
      <div className="content is-smaller">
        <div key={`item-${this.props.idx}`} className="field is-grouped item-entry">
            {
              Object.keys(this.props.inputTypes).map((key, id) => {
                if(this.props.inputTypes[key]['type'] === 'select') {
                    return(
                      <div className="select level-item" key={id}>
                        <label htmlFor={key} className="level-item label">{this.props.inputTypes[key]['label']}</label>
                        <select data-idx={this.props.idx}
                              name={key}
                              id={key}
                              value={this.props.itemState[this.props.idx][this.props.inputTypes[key]['modelName']]}
                              onChange={this.updateOnItemChange.bind(this)}
                              data-fname={this.props.inputTypes[key]['modelName']}
                              data-ftype="select"
                              className="level-item"
                              >
                        {this.props.inputTypes[key]['options'].map((val, idy) =>(
                            <option
                              value={val.item}
                              key={idy}
                              data-id={val.id}
                              data-quantity_max={val.quantity_max}
                              data-price={val.price}
                              data-item={val.item}
                              >
                                {val.item}
                              </option>
                          )
                        )}
                        </select>
                      </div>
                    )
                }
                else{
                  return(
                  <div key={id} className="level-item field">
                    <label htmlFor={key} className="level-item label"> {this.props.inputTypes[key]['label']} </label>
                    <input type={this.props.inputTypes[key]['type']}
                           name={key}
                           ref={this.refs[key]}
                           data-idx={this.props.idx}
                           id={key}
                           value={this.props.itemState[this.props.idx][this.props.inputTypes[key]['modelName']]}
                           max={this.props.itemState[this.props.idx][key+'_max']}
                           min={this.props.itemState[this.props.idx][key+'_min']}
                           className="level-item input"
                           data-fname={this.props.inputTypes[key]['modelName']}
                           data-ftype="input"
                           onChange={this.props.handleItemChange}
                           style={this.props.inputTypes[key]['style']}
                    />
                  </div>)
                }
              })
            }

          <input type="button"
                 value="Eliminar"
                 data-idx={this.props.idx}
                 className="button is-danger is-light"
                 onClick={ this.props.handleItemRemove }
          />
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

export default connect(null, mapDispatchToProps)(SaleItemInputs);
