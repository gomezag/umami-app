import React, { useState, useEffect } from 'react';
import '../css/umami.css'
import axios from 'axios'
import ReceiptEdit from './ReceiptEdit'

const ReceiptList =()=>{

  const [ receipts, setReceipt ] = useState([])

  // hook to run on load, only once
  useEffect(() => {
    async function fetchReceipt() {
      let url = '/api/receipts'
      const res = await fetch(url);
      const info = await res.json();
      setReceipt(info.receipts);
    }
    fetchReceipt();
  }, []);
  async function fetchReceipt() {
    let url = '/api/receipts'
    const res = await fetch(url);
    const info = await res.json();
    setReceipt(info.receipts);
  }

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

  function toggleDialog() {
    const show = !showDialog
    setShowDialog(show)
    fetchReceipt();
  }


  return (
    <div className="content">
      {showDialog ?
        <ReceiptEdit toggleDialog={toggleDialog}/>
        : null
      }
      <div className="tile is-ancestor">
        <div className="tile is-parent">
          { receipts.map((val, id) => (
            <div key={id} className="tile is-parent ">
              <article className="tile is-child box notification is-primary">
                <a href="/#" className="delete" onClick={() => handleDelete({val})}> </a>
                <p className="title"> {val.store} </p>
                <p className="subtitle"> {val.date} </p>
                <div className="content">
                  {val.items.map((val2, id2) => (
                    <ul key={id2}> {val2.item.name} - {val2.quantity} {val2.item.unit}</ul>
                  ))}
                  <p className="title"> Total: {(val.total).toLocaleString('es')} Gs.</p>
                </div>
              </article>
            </div>
          ))}
          <div className="tile is-parent">
            <article className="tile is-child notification is-primary center"
                     onClick={toggleDialog}>
                <p className="is-large"> + </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  )

}

export default ReceiptList;
