import React, { useState, useEffect } from 'react';
import '../css/umami.css'
import axios from 'axios'
import ReceiptEdit from './ReceiptEdit'
import {api} from '../../actions'
import {connect} from "react-redux";

const ReceiptList =({getReceipts})=>{

  const [ receipts, setReceipt ] = useState([])
  const [ isSubscribed, setSubscribe ] = useState(true)

  async function fetchReceipt() {
    const info = await getReceipts();
    if(isSubscribed) {
      setReceipt(info.receipts);
    }
  }
  // hook to run on load, only once
  useEffect(() => {
    fetchReceipt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
        return setSubscribe(false)
    }
  }, [setSubscribe])

  async function handleDelete(e) {
    let url='/api/del-receipt/'
    const receipt = e.val
    const out = {
      'id': receipt.id,
    }
    const msg = await axios.put(url, out)
    console.log(msg)
    fetchReceipt();
  }

  const [ showDialog, setShowDialog ] = useState(false)
  const [ selectedDialog, setSelectedDialog ] = useState(false)

  function toggleDialog(id) {
    const show = !showDialog
    setShowDialog(show)
    fetchReceipt();
  }

  const selectReceipt =(e)=> {
    if(e.currentTarget.dataset.idx){
      setSelectedDialog(receipts[e.currentTarget.dataset.idx])
    }
    else{
      setSelectedDialog(null)
    }
    toggleDialog();
  }

  return (
    <div className="content">
      {showDialog ?
        <ReceiptEdit toggleDialog={toggleDialog} selectedDialog={selectedDialog}/>
        : null
      }
      <div className="tile is-ancestor">
        <div className="tile is-parent">
          {receipts.map((val, id) => (
            <div key={id} className="tile is-parent ">
              <article className="tile is-child box notification is-primary">
                <a href="/#" className="delete" onClick={() => handleDelete({val})}> </a>
                <a href="/#" className="add" onClick={selectReceipt} data-idx={id}> Edit </a>
                <p className="title"> {val.store} </p>
                <p className="subtitle"> {val.date} </p>
                <div className="content">
                  {val.items.map((val2, id2) => (
                    <ul key={id2}> {val2.item.name} - {val2.quantity} {val2.item.unit}</ul>
                  ))}
                  <p className="subtitle"> Total: {(val.total).toLocaleString('es')} Gs.</p>
                </div>
              </article>
            </div>
          ))}
          <div className="tile is-parent">
            <article className="tile is-child notification is-primary center"
                     onClick={selectReceipt}>
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
    getReceipts: () => {
      return dispatch(api.getReceipts());
    }
  };
}

export default connect(null, mapDispatchToProps)(ReceiptList);
