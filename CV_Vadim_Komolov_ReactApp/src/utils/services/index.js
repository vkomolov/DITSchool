export function getFetch(jsonName) {
    const jsonUrl = `../cvData/${jsonName}.json`;

    return fetch(jsonUrl)
        .then(status)
        .then(parseJSON)
        .catch(error => error);

    function status(response) {
        if (response.status >= 200 && response.status < 300) {  //if response.ok
            return Promise.resolve(response);
        }
        else {
            return Promise.reject(new Error(response.statusText));
        }
    }
    function parseJSON(response) {
        return response.json();
    }
}

export function equalCols(colsArr) {   //for making DOM blocks` height to be equal. Put them in array colsArr
    let highestCal = 0;
    for (let i = 0; i < colsArr.length; i++) {
        if (colsArr[i].offsetHeight >= highestCal) {
            highestCal = colsArr[i].offsetHeight;
        }
    }
    for (let i = 0; i < colsArr.length; i++) {
        colsArr[i].style.height = highestCal + "px";
    }
}