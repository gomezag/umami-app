import React, { useState, useEffect } from 'react';
import '../css/umami.css'
import axios from 'axios'
import BatchEdit from './BatchEdit'
import {api} from '../../actions'
import {connect} from "react-redux";

const BatchList =({getBatches})=>{

  const [ productions, setBatch ] = useState([])
  const [ isSubscribed, setSubscribe ] = useState(true)
  const [ showEditDialog, setShowEditDialog ] = useState(false)

  async function fetchBatch() {
    const info = await getBatches();
    if(isSubscribed){
      setBatch(info.productions);
    }
  }
  // hook to run on load, only once
  useEffect(() => {
    fetchBatch();
 // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      setSubscribe(false)
    }
  }, [setSubscribe])

  async function handleDelete(e) {
    let url='/api/del-production/'
    const batch = e.val
    const out = {
      'id': batch.id,
    }
    const msg = await axios.put(url, out)
    console.log(msg)
    setSubscribe(true)
    fetchBatch();
  }

  const [ showDialog, setShowDialog ] = useState(false)
  const [ selectedProduction, setSelectedProduction ] = useState({})

    function toggleDialog() {
      const show = !showDialog
      setShowDialog(show)
      setSubscribe(true)
      fetchBatch();
    }

    const toggleEditDialog =(e)=>{
      setShowEditDialog(!showEditDialog)
      if(e){
        setSelectedProduction(productions[e.currentTarget.dataset.idx])
      }
    }

  return (
    <div className="container">
      {showDialog ?
        <BatchEdit toggleDialog={toggleDialog} />
        : null
      }
      {showEditDialog ?
        <BatchEdit toggleDialog={toggleEditDialog} production={selectedProduction}/>
        : null

      }
      <div className="tile is-ancestor">
        <div className="tile is-parent">
          { productions.map((val, id) => (
            <div key={id} className="tile is-parent ">
              <article className="tile is-child box notification is-primary">
                <a href="/#" className="delete" onClick={() => handleDelete({val})}> </a>
                <a href="/#" className="edit" data-idx={id} onClick={toggleEditDialog}> Edit </a>
                <p className="title"> {val.name} </p>
                <p className="subtitle"> {val.date} </p>
                <div className="content">
                  {val.batches.map((val2, id2) => (
                    <ul key={id2}> {val2.recipe.name} - {val2.rations} </ul>
                  ))}
                </div>
                <p className="title"> {val.cost.toLocaleString('es')} Gs. </p>
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

const mapDispatchToProps = dispatch => {
  return {
    getBatches: () => {
      return dispatch(api.getBatches());
    }
  };
}

export default connect(null, mapDispatchToProps)(BatchList);
