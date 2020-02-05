import React, {Component} from 'react'
import '../css/umami.css'
import FormItemList from './FormItemList'

class TestForm extends Component {

  state = {
    formInputs: [
      {
        name: 'Ingredient',
        type: 'select',
      },
      {
        name: 'quantity',
        type: 'number',
        unit: '',
        step: '',
      },
      {
        name: 'note',
        type: 'text'
      }
    ],
  }

  async fetchIngredients() {
      let url = '/api/ingredients'
      const res = await fetch(url);
      const info = await res.json();
      this.setState({ingredients: info.ingredients});
    }

  componentDidMount(){
    this.fetchIngredients();
  }

  render(){
    if(this.state.ingredients){
    return(
      <form>
        <FormItemList itemOptions={this.state.ingredients}
                      formInputs={this.state.formInputs}
        />
      </form>
    )
    }
    else{
      return(
        <div> Loading.. </div>
      )
    }
  }
}

export default TestForm
