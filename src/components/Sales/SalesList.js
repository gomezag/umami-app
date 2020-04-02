import React, { useState, useEffect } from 'react';
import '../css/umami.css'
import axios from 'axios'
import SaleEdit from './SaleEdit'
import {api} from '../../actions'
import {connect} from "react-redux";
import {getCurrentDate} from '../utils'

const SalesList =({getSales})=>{

  const [ sales, setSales ] = useState([])
  const [ isSubscribed, setSubscribe ] = useState(true)

  async function fetchSales() {
    const info = await getSales()
    if(isSubscribed){
      console.log(info.sales)
      setSales(info.sales)
    }
  }
  // hook to run on load, only once
  useEffect(() => {
    fetchSales()
 // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      setSubscribe(false)
    }
  }, [setSubscribe])

  async function handleDelete(e) {
    let url='/api/del-sale/'
    const sale = e.val
    const out = {
      'id': sale.id,
    }
    const msg = await axios.put(url, out)
    console.log(msg.data)
    fetchSales()
  }

  const [ showDialog, setShowDialog ] = useState(false)
  const [ selectedDialog, setSelectedDialog ] = useState({})

  function toggleDialog() {
    const show = !showDialog
    if(!show){fetchSales()}
    setShowDialog(show)
  }

  const selectDialog =(e)=>{
    if(e.currentTarget.dataset.idx){
      setSelectedDialog(sales[e.currentTarget.dataset.idx])
    }
    else{
      setSelectedDialog(null)
    }
    toggleDialog()
  }

  return (
    <div className="container">
      {showDialog ?
        <SaleEdit toggleDialog={toggleDialog}
                  selectedDialog={selectedDialog}
                  inputTypes={{
                    date: {
                      type: 'date',
                      label: 'Fecha',
                      default: getCurrentDate(),
                    },
                    buyer: {
                      type: 'text',
                      label: 'Cliente',
                      default: '',
                    },
                  }}
                  modelToPropsMap = {{
                          id: 'id',
                          item: 'name',
                          quantity_max: 'batch_stock',
                          //price: 'cost',
                        }}
                  itemInputTypes = {{
                    option: {
                      type: 'select',
                      label: 'Producto',
                      options: [],
                      modelName: 'item',
                    },
                    quantity: {
                      type: 'number',
                      label: 'Cant.',
                      step: '0.1',
                      modelName: 'quantity',
                      style: {width: '5em'}
                    },
                    price: {
                      type: 'number',
                      label: 'Precio',
                      step: '1',
                      modelName: 'price',
                      style: {width: '8em'}
                    }
                  }}
                  />
        : null
      }
      <div className="tile is-ancestor">
        <div className="tile is-parent">
          { sales.map((val, id) => (
            <div key={id} className="tile is-parent is-vertical">
              <article className="tile is-child box notification is-primary">
                <a href="/#" className="delete" onClick={() => handleDelete({val})}> </a>
                <a href="/#" className="edit" data-idx={id} onClick={selectDialog}> Edit </a>
                <p className="title"> {val.name} </p>
                <p className="subtitle"> {val.date} </p>
                <div className="content">
                  {val.batches.map((val2, id2) => (
                    <ul key={id2}> {val2.batch.name} - {val2.quantity} </ul>
                  ))}
                </div>
                <p className="title"> {val.price.toLocaleString('es')} Gs. </p>
              </article>
            </div>
          ))}
          <div className="tile is-parent">
            <article className="tile is-child notification is-primary center"
                     onClick={selectDialog}>
                <p className="is-large"> + </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  )

}

const mapDispatchToProps = dispatch => {
  return {
    getSales: () => {
      return dispatch(api.getSales())
      }
    }
  }

export default connect(null, mapDispatchToProps)(SalesList);
