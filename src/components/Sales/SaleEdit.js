import React, { Component } from 'react';
import SaleItemInputs from './SaleItemInputs';
import '../css/umami.css'
import axios from 'axios'
import {api} from '../../actions'
import {connect} from "react-redux";

/*
Generic Input Form.
props: {
    inputTypes={{
      input: {
        type: <valid HTML input tag>,
        label: <Some fancy name>,
        default: <A default value for the form input>,
      },
      ...
    }
    modelToPropsMap = {
            id: 'id',
            propName: <Django model attribute. Subattributes are separated by underscore>,
          }
    itemInputTypes = {{
      parent: {
        type: 'select',
        label: <A pretty name>,
        options: [],
        modelName: <propName tag matching the modelToPropsMap>,
      },
      child: {
        type: <Type of parent model attribute>,
        label: <A solid name>,
        step: '0.1',
        modelName: 'quantity',
      },
      price: {
        type: 'number',
        label: 'Precio',
        step: '1',
        modelName: '',
      }
}}

}
*/

class SaleEdit extends Component {

  state = {
    models: [],
    blankItem: {},
    itemState: [],
    isSubscribed: true,
    inputMode: 'add',
  }

  constructor(props) {
    super(props);


    this.submitButton = React.createRef();
  }

  async fetchModel() {

      if(this.state.isSubscribed){
        const models = await this.props.getOptions().then(res => {return res.products})
        const istate = [];
        //const option = info.recipes[0].items
        console.log(models)
        models.map((val, idx) =>{
          let obj = {}
          Object.keys(this.props.modelToPropsMap).map((key, idy) => {
            console.log(val)
            let array = this.props.modelToPropsMap[key].split('_')
            var tmpObj=val
            let index=0
            while (index < array.length) {
                tmpObj = tmpObj[array[index]]
                index++;
            }
            obj[key]=tmpObj
          })
          istate.push(obj)
        })
        this.setState({models: istate})
        this.props.itemInputTypes['option']['options']=istate
        let tmpObj = {}
        Object.keys(istate[0]).map((key2, index)=>{
          if(istate[0][key2]){
            tmpObj[key2]=istate[0][key2]
          }
          else{
            tmpObj[key2]=''
          }
        })
        tmpObj['quantity_min']=0
        tmpObj['price']=0
        tmpObj['quantity']=1
        this.setState({blankItem: tmpObj})
      }
  }


// hook to run on load, only once
  componentDidMount(){
     if(this.props.selectedDialog) {
       console.log(this.props.selectedDialog)

     }
    //   this.dateInput.current.value=this.props.production.date
    //   this.nameInput.current.value=this.props.production.name
    //   let rstate = [];
    //   let istate = [];
    //   this.props.production.batches.map((val, id) => {
    //     istate = [];
    //     val.ingredients.map((ing, idi) => {
    //       let obj = {}
    //       Object.keys(modelToPropsMap).map((prop, id){
    //         attrs = modelToPropsMap[prop].split('_')
    //         obj[prop]=ing[modelToPropsMap[prop]]
    //       })
    //       console.log(obj)
    //       istate.push(obj)
    //       //   id: ing.item.id,
    //       //   item: ing.item.name,
    //       //   quantity: ing.quantity,
    //       //   step: ing.item.step,
    //       //   unit: ing.item.unit,
    //       // })
    //       return null;
    //     })
    //     rstate.push({
    //         id: val.recipe.id,
    //         rations: val.rations,
    //         item: val.recipe.name,
    //         ingredients: istate,
    //     })
    //     return null;
    //   })
    //   this.setState({
    //     itemRecipeState: rstate,
    //     inputMode: 'edit',
    //     batchId: this.props.production.id,
    //   })
    // }
    this.fetchModel();
  }

  componentWillUnmount(){
    this.setState({isSubscribed: false})
  }

  addItem() {
    this.setState({itemState: [...this.state.itemState, {...this.state.blankItem}]});
  };

  handleItemChange(e){
      const updatedItems = [...this.state.itemState];
      if(e.currentTarget.dataset.ftype === "select") {
        Object.keys(this.props.modelToPropsMap).map((key, index)=>{
          updatedItems[e.currentTarget.dataset.idx][key]=e.currentTarget.selectedOptions[0].dataset[key]
        })
      }
      else {
        updatedItems[e.currentTarget.dataset.idx][e.currentTarget.dataset.fname] = e.target.value;
      }
      this.setState({itemState: updatedItems})
  };

  handleRecipeIngredientsChange(e) {
    const updatedItems = [...this.state.itemState]
  }

  handleItemRemove(e) {
    const updatedItems = [...this.state.itemState];
    updatedItems.splice(e.target.dataset.idx, 1)
    this.setState({itemState: updatedItems})
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget
    const out = {inputMode: 'add'}
    Object.keys(this.props.inputTypes).map((key, id) => {
      out[key] = form[key].value
    })
    out['items'] = this.state.itemState
    const url = '/api/mod-sale'
    const msg = await axios.put(url, out).then(res=> {
      return res
    })
    console.log(msg.data)
    this.props.toggleDialog();
    //e.persist();

    // const out = {
    //         date: form.date.value,
    //         name: form.name.value,
    //         batches: this.state.itemBatchState
    //       }
    // if(this.state.inputMode==='add'){
    //   const url = '/api/add-production/'
    //   const msg = await axios.put(url, out).then(res => {
    //     this.props.toggleDialog();
    //     return res
    //   })
    //   console.log(msg.data)
    // }
    // if(this.state.inputMode==='edit'){
    //   out['production_id'] = this.state.batchId
    //   const url = '/api/edit-production/'
    //   const msg = await axios.put(url, out).then(res => {
    //     this.props.toggleDialog();
    //     return res
    //   })
    //   console.log(msg.data)
    // }
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
                    {
                      Object.keys(this.props.inputTypes).map((key, id) =>{
                        return(
                          <div className="field" key={id}>
                            <label htmlFor={key} className="label is-medium"> {this.props.inputTypes[key]['label']}: </label>
                            <div className="control">
                              <input type={this.props.inputTypes[key]['type']}
                                     name={key}
                                     id={key}
                                     className="Input"
                                     defaultValue={this.props.inputTypes[key]['default']}
                              />
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
                <div className="field is-grouped">
                  <div className="level-item">
                    <div className="control">
                      <input type='button'
                             value='Agregar Producto'
                             onClick={this.addItem.bind(this)}
                             className="button is-primary is-light"
                      />
                    </div>
                  </div>
                </div>
                {
                  (this.state.models.length !== 0) ?
                    this.state.itemState.map((val, idx) => (
                      <SaleItemInputs
                        key = {`bitem-${idx}`}
                        idx = {idx}
                        itemState = {this.state.itemState}
                        handleItemChange = {this.handleItemChange.bind(this)}
                        handleItemRemove = {this.handleItemRemove.bind(this)}
                        inputTypes = {this.props.itemInputTypes}
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
                           value = {this.state.inputMode==="edit" ? "Editar Venta" : "Agregar Venta"}
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
}

const mapDispatchToProps = dispatch => {
  return {
    getOptions: () => {
      return dispatch(api.getProducts())
    }
  };
}

export default connect(null, mapDispatchToProps)(SaleEdit);
