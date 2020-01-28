import React, { useState, useEffect } from 'react';
import '../css/umami.css'
import axios from 'axios'
import BatchEdit, { toggleBatchAdd } from './BatchEdit'

const BatchList =()=>{

  const [ productions, setBatch ] = useState([])

  // hook to run on load, only once
  useEffect(() => {
    async function fetchBatch() {
      let url = '/api/production/'
      const res = await fetch(url);
      const info = await res.json();
      setBatch(info.productions);
    }
    fetchBatch();
  }, []);
  async function fetchBatch() {
    let url = '/api/production/'
    const res = await fetch(url);
    const info = await res.json();
    setBatch(info.productions);
  }

  async function handleDelete(e) {
    let url='/api/del-production/'
    const batch = e.val
    const out = {
      'id': batch.id,
    }
    const msg = await axios.put(url, out)
    console.log(msg)
    fetchBatch();
  }

  const [ showDialog, setShowDialog ] = useState(false)

    function toggleDialog() {
      const show = !showDialog
      setShowDialog(show)
      fetchBatch();
    }

  return (
    <div className="container">
      {showDialog ?
        <BatchEdit toggleDialog={toggleDialog} />
        : null
      }
      <div className="tile is-ancestor">
        <div className="tile is-parent">
          { productions.map((val, id) => (
            <div key={id} className="tile is-parent ">
              <article className="tile is-child box notification is-primary">
                <a href="/#" className="delete" onClick={() => handleDelete({val})}> </a>
                <p className="title"> {val.name} </p>
                <p className="subtitle"> {val.date} </p>
                <div className="content">
                  {val.batches.map((val2, id2) => (
                    <ul key={id2}> {val2.recipe.name} - {val2.rations} </ul>
                  ))}
                </div>
                <p className="title"> {val.cost} Gs. </p>
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

export default BatchList;
