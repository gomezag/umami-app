import React, { useState } from 'react';
import './App.css';
import Menu from './Menu'
import ReceiptList from './Receipts/ReceiptList'
import Stock from './Stock/Stock'
import IngredientList from './Ingredients/IngredientList'
import RecipeList from './Recipes/RecipeList'
import BatchList from './Batches/BatchList'
// import TestForm from './Form/TestForm'


const App = () => {

  const [ currentWindow, setCurrentWindow ] = useState();

  const changeWindow = (e) => {
    let component = <div> </div>
    switch(e.target.dataset['window']) {
        case 'index':
          component = <div></div>
          break;
        case 'receipt-list':
          component = <ReceiptList />
          break;
        case 'stock':
          component = <Stock />
          break;
        case 'ingredient-list':
          component = <IngredientList />
          break;
        case 'recipe-list':
          component = <RecipeList />
          break;
        case 'batch-list':
          component = <BatchList />
          break;
        // case 'test-form':
        //   component = <TestForm />
        //   break;
        default:
          component = <div></div>
          break;
      }
    setCurrentWindow(component)
  };


  return (
    <div className="App">
      <div className="box">
        <Menu changeWindow={ changeWindow } />
      </div>
      <div className="content">
        { currentWindow }
      </div>
    </div>
  );
}

export default App;
