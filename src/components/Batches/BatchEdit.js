import React, { Component } from 'react';
import BatchItemInputs from './BatchItemInputs';
import '../css/umami.css'
import axios from 'axios'
import { getCurrentDate } from '../utils'
import {api} from '../../actions'
import {connect} from "react-redux";

class BatchEdit extends Component {

  state = {
    recipes: [],
    blankRecipeItem: {},
    itemRecipeState: [],
    isSubscribed: true,
    inputMode: 'add',
  }

  constructor(props) {
    super(props);
    this.dateInput = React.createRef();
    this.nameInput = React.createRef();
    this.submitButton = React.createRef();
  }

  async fetchRecipe() {
      const info = await this.props.getRecipes();
      if(this.state.isSubscribed){
        this.setState({recipes: info.recipes});
        const istate = [];
        const ingredients = info.recipes[0].items
        ingredients.map((val, id) =>
          istate.push( {
                        id: val.item.id,
                        item: val.item.name,
                        quantity: val.quantity,
                        step: val.item.step,
                        unit: val.item.unit
                      })
        )
        this.setState({blankRecipeItem: { id: info.recipes[0].id,
                             item: info.recipes[0].name,
                             rations: '1',
                             ingredients: istate
                          }})
      }
  }

// hook to run on load, only once
  componentDidMount(){
    if(this.props.production) {
      this.dateInput.current.value=this.props.production.date
      this.nameInput.current.value=this.props.production.name
      let rstate = [];
      let istate = [];
      this.props.production.batches.map((val, id) => {
        istate = [];
        val.ingredients.map((ing, idi) => {
          istate.push({
            id: ing.item.id,
            item: ing.item.name,
            quantity: ing.quantity,
            step: ing.item.step,
            unit: ing.item.unit,
          })
          return null;
        })
        rstate.push({
            id: val.recipe.id,
            rations: val.rations,
            item: val.recipe.name,
            ingredients: istate,
        })
        return null;
      })
      this.setState({
        itemRecipeState: rstate,
        inputMode: 'edit',
        batchId: this.props.production.id,
      })
    }
    this.fetchRecipe();
  }

  componentWillUnmount(){
    this.setState({isSubscribed: false})
  }

  addRecipeItem() {
    this.setState({itemRecipeState: [...this.state.itemRecipeState, {...this.state.blankRecipeItem}]});
  };

  handleRecipeItemChange(e){
      const updatedItems = [...this.state.itemRecipeState];
      if(e.currentTarget.className === "item") {
        updatedItems[e.currentTarget.dataset.idx]['item'] = e.currentTarget.selectedOptions[0].value;
        updatedItems[e.currentTarget.dataset.idx]['id'] = e.currentTarget.selectedOptions[0].dataset.id;
        const ingredients = this.state.recipes.find(obj=>{return obj.id === parseInt(e.currentTarget.selectedOptions[0].dataset.id)}).items
        const istate = [];
        ingredients.map((val, id) =>
          istate.push( {
                        id: val.item.id,
                        item: val.item.name,
                        quantity: val.quantity,
                        step: val.item.step,
                        unit: val.item.unit
                      })
          )
        updatedItems[e.currentTarget.dataset.idx]['ingredients'] = istate
      }
      else {
        updatedItems[e.currentTarget.dataset.idx][e.currentTarget.className] = e.target.value;
      }
      this.setState({itemRecipeState: updatedItems})
  };

  handleRecipeIngredientsChange(e) {
    const updatedItems = [...this.state.itemRecipeState]
    updatedItems[e.idx]['ingredients']= e.ingredients
  }

  handleRecipeItemRemove(e) {
    const updatedItems = [...this.state.itemRecipeState];
    updatedItems.splice(e.target.dataset.idx, 1)
    this.setState({itemRecipeState: updatedItems})
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget
    const out = {
            date: form.date.value,
            name: form.name.value,
            batches: this.state.itemRecipeState
          }
    if(this.state.inputMode==='add'){
      const url = '/api/add-production/'
      const msg = await axios.put(url, out).then(res => {
        this.props.toggleDialog();
        return res
      })
      console.log(msg.data)
    }
    if(this.state.inputMode==='edit'){
      out['production_id'] = this.state.batchId
      const url = '/api/edit-production/'
      const msg = await axios.put(url, out).then(res => {
        this.props.toggleDialog();
        return res
      })
      console.log(msg.data)
    }
  }

  render(){
    return(
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-content box" style={{width:'70%'}}>
          <div className="container">
            <div className="level">
              <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="section">
                  <div className="level-item">
                    <div className="field is-grouped">
                      <label htmlFor='date' className="label is-medium"> Fecha: </label>
                      <div className="control">
                        <input ref={this.dateInput} type='date' name='date' id='date' className="input" defaultValue={getCurrentDate()}/>
                      </div>
                      <label htmlFor='name' className="label is-medium"> Nombre: </label>
                      <div className="control">
                        <input ref={this.nameInput} type='text' name='name' id='name' className="input"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="field is-grouped">
                  <div className="level-item">
                    <div className="control">
                      <input type='button'
                             value='Agregar Receta'
                             onClick={this.addRecipeItem.bind(this)}
                             className="button is-primary is-light"
                      />
                    </div>
                  </div>
                </div>
                {
                  (this.state.recipes.length !== 0) ?
                    this.state.itemRecipeState.map((val, idx) => (
                      <BatchItemInputs
                        key = {`bitem-${idx}`}
                        idx = {idx}
                        recipeState = {this.state.itemRecipeState}
                        handleRecipeChange = {this.handleRecipeItemChange.bind(this)}
                        handleRecipeRemove = {this.handleRecipeItemRemove.bind(this)}
                        recipeOptions = {this.state.recipes}
                        handleRecipeIngredientsChange = {this.handleRecipeIngredientsChange.bind(this)}
                      />
                    ))
                    : <div className="level-item">
                        No recipes defined!
                      </div>
                }
                <div className="level-item">
                  <div className="control">
                    <input type="submit"
                           className="button is-primary"
                           value = {this.state.inputMode==="edit" ? "Editar Producción" : "Agregar Producción"}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={this.props.toggleDialog}></button>
    </div>
    );
  }

};

const mapDispatchToProps = dispatch => {
  return {
    getRecipes: () => {
      return dispatch(api.getRecipes());
    }
  };
}

export default connect(null, mapDispatchToProps)(BatchEdit);
