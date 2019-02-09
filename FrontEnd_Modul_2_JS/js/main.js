"use strict";
window.addEventListener("DOMContentLoaded", ()=> {
    if (document.getElementById("latest-rates-block") && document.querySelector(".top-wrapper")) {
        initMain();
    }
    else throw new Error(`no id "latest-rates-block" or class "top-wrapper" found in DOM`);
});

function initMain() {
    const topWrapper = document.querySelector(".top-wrapper"); //will hold all event listeners
    const curRatesNode = document.getElementById("latest-rates-block");
    const calcWrapper = document.getElementById("calc-wrapper");
    const baseUrl = "https://api.exchangeratesapi.io";
    const curSelectArr = topWrapper.getElementsByTagName("select");
    const regExpNum = /^[0-9]{1,13}$/;
    const dateHistory = document.forms.curHistory.elements.dateHistory;
    const baseCurSelect = document.forms.curHistory.elements.baseCurSelect;
    const firstInput = document.forms.calculator.elements.value1;
    const secondInput = document.forms.calculator.elements.value2;
    let curDateReady = dateFormat(new Date(), "-");
    let currStorage = localStorage;
    let curNamesArr = []; //currency list, initially empty (no fetched obj)
    let changed = null; //will show the input name, which was changed
    let culcBaseCur = null; //will show the base Currency of the previously fetched operation
    let culcDateCur = null; //will show the date of the previously fetched operation
    let culcFetchedObj = null; //the previously fetched object for calculations
    let targetsObj = {    //collection of callbacks on events
        baseCurSelect: (evType, target) => { //creating new Table with the chosen currency
            if (evType === "change") {
                if (dateHistory.value) {
                    fetchRates("toTable", target.value, dateHistory.value);
                }
                else {
                    fetchRates("toTable", target.value);
                }
            }
        },
        curName: (evType) => {
            if (evType === "change") {  //when changing the currencies - refreshing the input values
                firstInput.value = "";
                secondInput.value = "";
            }
        },
        inputCalc: (evType, target) => {
            if (evType === "change") {
                if (!(regExpNum.test(target.value))) { //validating the input value, require Num
                    initValidation(target, "Not correct Chars");
                    return;
                }
                else {
                    initValidation(target);
                }

                changed = target.name; //marking input which was changed
                let radioState = document.forms.calculator.elements.rateTime.value;
                let baseCur = document.forms.calculator.elements.baseCur.value;
                let date; //getting the date for rates calculation
                if (radioState === "current") {
                    date = curDateReady;
                }
                else {
                    date = document.forms.calculator.elements.dateSelection.value;
                }
                if (date && baseCur) {
                    if (baseCur !== culcBaseCur || date !== culcDateCur) { //if date or currency is not the previous fetch
                        culcBaseCur = baseCur;
                        culcDateCur = date;

                        fetchRates("toCalc", baseCur, date);
                    }
                    else {
                        console.log("using the previously fetched 'culcFetchedObj'");
                        calculate(culcFetchedObj);
                    }
                }
            }
        },
        inputDate: (evType, target) => {    //checking validation for the date
            if (evType === "blur") {
                let date = new Date(target.value);
                if (date.getFullYear() < 2010 || date.getFullYear() > new Date().getFullYear()) {
                    target.classList.remove("valid");
                    target.classList.add("error");
                    alert("The Date must be not less than 2010 and not more than Today");
                    setTimeout(() => {
                        target.classList.remove("error");
                        target.value = "";
                    }, 700)
                }
                else {
                    target.classList.remove("error");
                    target.classList.add("valid");
                    firstInput.value = "";
                    secondInput.value = "";
                }
            }
            if (evType === "change" && target.name === "dateHistory") {
                fetchRates("toTable", baseCurSelect.value, target.value);
            }
        },
        latestData: (evType) => {   //button on showing the table of Rates
            if (evType === "click") {
                calcWrapper.style.display = "none";
                curRatesNode.style.display = "block";
            }
        },
        calc: (evType) => {         //button on showing the calculator
            if (evType === "click") {
                curRatesNode.style.display = "none";
                calcWrapper.style.display = "block";
            }
        }
    };

    curRatesNode.querySelector("h2").textContent += curDateReady;
    calcWrapper.querySelector("span").textContent += curDateReady;

    if (currStorage.getItem("current")) {
        let objLocal = JSON.parse(currStorage.getItem("current"));
        if (objLocal.date === curDateReady) {   //if the date of localStorage Data is today
            console.log("making the rates table from the localStorage");
            makeTable(objLocal.rates);
            makeOptions(objLocal.rates);
        }
        else {
            console.log("The localStorage exists, but the date is previous to Today or last in service. Fetching...");
            fetchRates("toTable");
        }
    }
    else {
        console.log("No records in the localStorage. Fetching...");
        fetchRates("toTable");
    }

    topWrapper.addEventListener("keydown", ev => {
        if (ev.keyCode === 13) {
            ev.target.blur();  //if during input the 'enter' key pressed the input is blur
        }
    }, true);

    topWrapper.addEventListener("blur", (ev) => {   //input type 'date' fires 'change' event on each input
        initEvents(ev.type, ev.target);
    }, true);

    topWrapper.addEventListener("change", (ev) => {
        initEvents(ev.type, ev.target);
    }, true);

    topWrapper.addEventListener("click", (ev) => {
        initEvents(ev.type, ev.target);
    });

    /**@description: Using the universal event processing, by initiating the necessary callbacks for certain events.
     * Using the dataset.type properties, it identifies the target element in the callback scope.
     * It gives comfort in managing all events on each target element, which placed in one total object of callbacks
     * Also, no need in placing event listeners on each target element all over the code. Events can be always added
     * @param: {evType} type of the event ('click', 'change', 'blur', etc..
     * @param: {target} target element/
     * */
    function initEvents(evType, target) {
        if (target.dataset.type in targetsObj) {
            targetsObj[target.dataset.type](evType, target);
        }
    }

    /**@description: Universal function, which takes the type of callback after fetching data
     * @param: {callBackType} type of callback function, included inside
     * @param: {dateReady} the target date, which prepared for fetching with url. Default data - present time
     * @param: {baseCurrency} the target basic currency for fetching, default - "EUR"
     * @return: callback functions which comprised inside
     * */
    function fetchRates(callBackType, baseCurrency = "EUR", dateReady = curDateReady) {
        const urlReady = `${baseUrl}/${dateReady}?base=${baseCurrency}`;

        fetch(urlReady)
            .then(status)
            .then(parseJSON)
            .then(function (data) {
                makeOptions(data.rates); //setting option list for all 'select' tags

                if (!currStorage.getItem("current")) {
                    let jsonData = JSON.stringify(data);
                    currStorage.setItem("current", jsonData); //storage of the fetch result
                    console.log("The data is fetched and placed in the localStorage");
                }
                const callBacks = {
                    toTable: () => makeTable(data.rates),
                    toGraph: () => {

                    },
                    toCalc: () => calculate(data.rates)
                };
                if (callBackType in callBacks) {
                    callBacks[callBackType]();
                }
            })
            .catch(function (error) {
                alert(error);
            });
    }

    /**@description: Calculate the rates of two currencies
     * @param: {ratesObj} the fetched data
     * */
    function calculate(ratesObj) {
        culcFetchedObj = ratesObj;
        let secondCur = document.forms.calculator.elements.secondCur.value; //name of the second Currency
        let rate = ratesObj[secondCur];

        if (changed === "value1") {
            let result = firstInput.value * rate;
            secondInput.value = numFormat(result, 1000);
        }
        else if (changed === "value2") {
            let result = secondInput.value / rate;
            firstInput.value = numFormat(result, 1000);
        }
        else throw new Error(`The name ${changed} is not correct`);
    }

    /**@description: Creates table, taking the rates from the localStorage or from fetch
     * @param: {ratesObj} Object with currencies and rates (fetched)
     * */
    function makeTable(ratesObj) {
        if (curRatesNode.querySelector(".rates-table")) {   //if table in DOM - remove
            curRatesNode.querySelector(".rates-table").remove();
        }
        let index = 0; //to keep Object.keys(ratesObj) indexes
        let table = document.createElement("table");
        table.classList.add("rates-table");
        let tHead = table.appendChild(document.createElement("thead"));
        let hRow = tHead.insertRow();
        for (let i = 0; i < 8; i++) {
           let tH = hRow.appendChild(document.createElement("th"));
           (i%2) ? tH.textContent = "Rate" : tH.textContent = "Currency";
        }
        let tBody = table.appendChild(document.createElement("tbody"));
        for (let i = 0; i < 8; i++) {
            let tBRow = tBody.insertRow();
            for (let i = 0; i < 4; i++) {
                let tdCur = tBRow.insertCell();
                tdCur.textContent = Object.keys(ratesObj)[index];
                let tdRate = tBRow.insertCell();
                tdRate.textContent = numFormat(Object.values(ratesObj)[index], 1000);
                //tdRate.textContent = Math.round(Object.values(ratesObj)[index] * 1000)/1000;
                index++;
            }
        }
        curRatesNode.appendChild(table);
    }

    /**@description: Creates the list of DOM 'option' elements inside 'select' tags of Currencies
     * The list of Currency names is fetched and followingly is written in the 'select'
     * @param: {ratesObj} Object with currencies and rates (fetched)
     * */
    function makeOptions(ratesObj) {
        if (!curNamesArr.length) {  //if no currency list
            curNamesArr = Object.keys(ratesObj);

            for (let i = 0; i < curSelectArr.length; i++) {
                curNamesArr.forEach(item => {
                    let option = curSelectArr[i].appendChild(document.createElement("option"));
                    if (curSelectArr[i][0].textContent === "USD" && item === "USD") { //for 'select' tag with initially selected "USD"
                        option.setAttribute("value", "EUR");
                        option.textContent = "EUR";
                    }
                    else {
                        option.setAttribute("value", item);
                        option.textContent = item;
                    }
                });
            }
        }
    }

    /**@description: Converts the Date format to yyyy-mm-dd String
     * @param: {date} Date in Date format
     * @param: {delimeter} Delimeter '-' for joining in String
     * @return: String with the delimeter
     * */
    function dateFormat(date, delimeter) {
        let month = ("0" + (date.getMonth() + 1)).slice(-2); //if 2 digits then without 0
        let day = ("0" + date.getDate()).slice(-2);
        let dateOut = [date.getFullYear(), month, day].join(delimeter);
        return dateOut;
    }

    /**@description: Rounds the Number to the necessary precision
     * @param: {num} Number
     * @param: {decimal} Number of decimals (100 - (2 decimals), 1000 (3 decimals) etc..
     * @return: Number rounded with necessary precision
     * */
    function numFormat(num, decimal) {
        return Math.round(num * decimal)/decimal;
    }
    /**@description: Listen to the response >= 200 and <300 and gives Promise.resolve or Promise.reject with new Error
     * @param: {response} the response from fetching the API
     * @return: Promise.resolve(response) or new Error by Promise.reject
     * */
    function status(response) {
        if (response.status >= 200 && response.status < 300) {  //if response.ok
            return Promise.resolve(response);
        } else {
            return Promise.reject(new Error(response.statusText));
        }
    }
    /**@description: takes the response as the response.json(), converting it to the Object
     * @param: {response} the response from Promise.resolve()
     * @return: returns the parsed json Object
     * */
    function parseJSON(response) {
        return response.json();
    }

    /**@description: creates the alarm span uppon the input on timeout then disappear
     * @param: {input} input with any DOM parent in relative position
     * */
    function initValidation(input, alarm=false) {
        if (!alarm) {
            input.classList.remove("error"); //to be safe if already has the class 'error'
            input.classList.add("valid");
            if (input.parentNode.querySelector("span")) { //to be safe if already it has the alarm span
                input.parentNode.querySelector("span").remove();
            }
        }
        else {
            input.classList.remove("valid"); //to be safe if already has the class 'valid'
            input.classList.add("error");
            if (input.parentNode.querySelector("span")) { //to be safe if already has the alarm span
                input.parentNode.querySelector("span").remove();
            }
            let span = input.parentNode.appendChild(document.createElement("span"));
            span.classList.add("alert-span");
            span.textContent = alarm;
            setTimeout(() => {
                input.value = "";
                input.parentNode.querySelector("span").remove();
                input.classList.remove("error");
            }, 1000);
        }
    }
}

//////////////////DEV/////////////////////
function log(item) {
    console.log(item);
}
function ping() {
	console.log(true);
}