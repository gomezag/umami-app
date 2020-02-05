import React, {Component} from 'react'
import '../css/umami.css'
import FormItem from './FormItem'

class FormItemList extends Component {
  // props format:
  // itemOptions = List of objects with same attributes.
  // formInputs = [{
  //    name: <A name for the input. It should match the name of attribute in itemOptions>
  //    type: <type of input for html tag. 'date', 'text', 'number' are acceptable
  // }]
  state = {
    itemList: [],
    blankItem: {},
  }

  componentDidMount(){
    let blankItem = {}
    // Object.keys(this.props.itemOptions[0]).map((key, index) =>(
    //   blankItem[key]=this.props.itemOptions[0][key]
    // ))
    this.props.formInputs.map((val, id) =>
        (val.type === 'select') ?
          blankItem[val.name]=this.props.itemOptions[0]['name']
        :
          blankItem[val.name] = ''
    )
    console.log(blankItem)
    this.setState({blankItem: blankItem});
  }

  addItem(){
    this.setState({itemList: [...this.state.itemList, {...this.state.blankItem}]})
  }

  handleItemChange(e) {
    const updatedItems = [...this.state.itemList]
    if(e.currentTarget.selectedOptions){
        // find the corresponding form input for the select option
        let formInput = this.props.formInputs.filter(function(el) {
          return el.type === "select"
        })[0]
        // find the selected object from itemOptinos
        const itemObject = this.props.itemOptions.filter(function(el) {
          return el.name === e.currentTarget.selectedOptions[0].value
        })[0]
        // set the value of the selected item to the selected name
        updatedItems[e.currentTarget.dataset.idx][formInput.name] = itemObject.name
        // find the quantity input
        formInput = this.props.formInputs.filter(function(el) {
          return el.name === "quantity"
        })[0]
        // set the unit and step to the correct value
        formInput.unit = itemObject.unit
        formInput.step = itemObject.step
      }
    else{
      updatedItems[e.currentTarget.dataset.idx][e.currentTarget.className] = e.currentTarget.value;
    }
    console.log(updatedItems)
    this.setState({itemList: updatedItems})
    console.log('item changed')
  }

  handleItemRemove(e) {
    console.log(e)
    console.log('item removed')
  }

  render(){
    if(this.state.blankItem){
      return(
        <div>
          <div className="level-item">
            <div className="control">
              <input type='button'
                     value='Agregar Item'
                     onClick={this.addItem.bind(this)}
                     className="button is-primary is-light"
              />
            </div>
          </div>
          {this.state.itemList.map(
            (val, idx) => (
              <FormItem key={idx}
                        idx={idx}
                        itemState={this.state.itemList}
                        handleItemChange={this.handleItemChange.bind(this)}
                        handleItemRemove={this.handleItemRemove.bind(this)}
                        itemOptions={this.props.itemOptions}
                        formInputs={this.props.formInputs}
              />
          ))}
        </div>
      )
    }
    else{
      return(
        <div> Building... </div>
      )
    }
  }
}

export default FormItemList
