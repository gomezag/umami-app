export const getIngredients = () => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    let headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Token ${token}`;
      return fetch("/api/ingredients/", {headers, })
      .then(res => {
        return res.json()
      })
      .then(res => {
        return res
      })
    }
  }
}


export const getRecipes = () => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    let headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Token ${token}`;
      return fetch("/api/recipes/", {headers, })
      .then(res => {
        return res.json()
      })
      .then(res => {
        return res
      })
    }
  }
}


export const getBatches = () => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    let headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Token ${token}`;
      return fetch("/api/production/", {headers, })
      .then(res => {
        return res.json()
      })
      .then(res => {
        return res
      })
    }
  }
}

export const getProducts = () => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    let headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Token ${token}`;
      return fetch("/api/products/", {headers, })
      .then(res => {
        return res.json()
      })
      .then(res => {
        return res
      })
    }
  }
}

export const getReceipts = () => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    let headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Token ${token}`;
      return fetch("/api/receipts/", {headers, })
      .then(res => {
        return res.json()
      })
      .then(res => {
        return res
      })
    }
  }
}

export const getSales = () => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    let headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Token ${token}`;
      return fetch("/api/sales/", {headers, })
      .then(res => {
        return res.json()
      })
      .then(res => {
        return res
      })
    }
  }
}
