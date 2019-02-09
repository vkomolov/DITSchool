'use strict';

window.onload = function() {
    if (document.forms["form-select"]) {
        var form = document.forms["form-select"];
        initForm(form, 14);	//form in DOM and max time period in days
    }
};

/////////////////////FUNCTIONS/////////////////////////
/**@description: Initiates the contact with DOM, hanging eventListener on input and select elements.
 * Includes the functions of the form realisations. All further processes will be in the scope of this.
 * @param: {form} DOM form element
 * @param: {maxPeriod} The maximum time period for analyses in days
 * @inner-functions: makeOptions(url) {createOptions(data)},
 *                   formListen(), initDates(), getUrlArr(), dateFormat(date, delimeter),
 *                   initAllPromises(), function status(response), parseJSON(response),
 *                   initGraph() {GraphBlock(), GraphBlock(), .prototype.createGraph()}
 * */
function initForm(form, maxPeriod) {

    ///////////////////INPUT BLOCK////////////////////////////
    var formBlock = form;
    var selectBase = form.elements["base-select"]; //for attaching option elements to the "select"
    var selectCur = form.elements["cur-select"];    //for attaching option elements to the "select"

    var mssgTime = form.querySelector("h3[data-type=\"mssgTime\"]");    //heading message in DOM
    var inputFrom = form.elements["from-date"]; //input of starting date
    var inputTo = form.elements["to-date"];     //input of final date
    var baseSelect = form.elements["base-select"];  //select of the base currency
    var curSelect = form.elements["cur-select"];    //select of the currency for evaluation
    var inputArr = formBlock.getElementsByTagName("INPUT");		//input array for css styles

    ////////////////////GRAPH BLOCK////////////////////////////
    var graphWrapper = document.querySelector(".graph-wrapper");
    var spanFrom = graphWrapper.querySelector("span[data-type=\"from\"]");  //DOM message of starting date
    var spanTo = graphWrapper.querySelector("span[data-type=\"to\"]");      //DOM message of final date
    var spanBase = graphWrapper.querySelector("span[data-type=\"base\"]");  //DOM message of the base currency
    var spanEval = graphWrapper.querySelector("span[data-type=\"eval\"]");  //DOM message of the currency to evaluate

    ///////////////////PROCESS BLOCK//////////////////////////
    var url = "https://api.exchangeratesapi.io/";   //Target API
    var urlArr = [];    //array for the future urls by date
    var fromDate = null;    //starting date will be String from the input type="date"
    var toDate = null;      //final date
    var baseCur = null;     //base currency from the select "base-select"
    var curEval = null;   //currency to compare with from the select "cur-select"
    var maxTime = maxPeriod;    //period of time for rates
    var timePeriod = false; //calculated period of time. If true, the period of time is correct (for filtering)
    var ratesArr = [];	//array of rates, pushed from the fetch promises

    makeOptions("https://api.exchangeratesapi.io/latest"); //prefetching the currency names for the 'select' in DOM
    formListen();


    ///////////////////FUNCTIONS////////////////////////////
    /**@description: to set the eventListener on each inputs. On events it runs the corresponding functions
     * */
    function formListen() {
        inputFrom.addEventListener("change", function () {
            fromDate = this.value;
            spanFrom.textContent = fromDate;     //writing starting date to DOM
            initDates(); //any changes in dates initiates the analysis of the time period and further async preloading
        }, true);

        inputTo.addEventListener("change", function () {
            toDate = this.value;
            spanTo.textContent = toDate;    //writing final date to DOM
            initDates();
        }, true);

        baseSelect.addEventListener("change", function () {
            //baseCur = this.value; //short variant of select element value
            baseCur = this.options[this.selectedIndex].value; //we don`t see easy ways
            spanBase.textContent = baseCur; //writing base currency to DOM

            if (timePeriod) {   //if dates are not proven in the correct time period they will be "null"

                urlArr = getUrlArr(url, fromDate, toDate); //if we change the base currency, we rewrite the urls params and init fetches

                if (urlArr.length) {
                    ratesArr = [];  //refreshing previous ratesArr if we had
                    initAllPromises();  //starting asynch fetching of data from API
                }
            }
        }, true);

        curSelect.addEventListener("change", function () {
            curEval = this.options[this.selectedIndex].value; //getting through .options[selectedIndex].value
            spanEval.textContent = curEval; //writing the currency to be evaluated to DOM

            if (ratesArr.length) {    //if we already have the response from API
                initGraph();    //initiating graph preperation
            }
        }, true);
    }

    /**@description: Makes preliminary fetch to the API and gets the currency names for the select options in DOM
     * @param: {url} Initial url for the standart fetching
     * */
    function makeOptions(url) {
        if (selectBase && selectCur) {
            fetch(url)
                .then(status)
                .then(parseJSON)
                .then(function (data) {
                    createOptions(data);
                })
                .catch(function (error) {
                    alert(error);
                });
        }
        /**@description: Creates the options in DOM
         * @param: {data} Fetched and parsed response Object
         * */
        function createOptions(data) {
            var resObj = data;
            var curNames = [];

            if ("rates" in resObj) {
                for (let curName in resObj["rates"]) {
                    curNames.push(curName);
                }
                if (curNames.length) {
                    curNames.forEach(function (name) {
                        let option = document.createElement("option"); //not possible to append option to both selects
                        let optionTwo = document.createElement("option");

                        appendOption(option);
                        appendOption(optionTwo);

                        selectBase.appendChild(option);
                        selectCur.appendChild(optionTwo);

                        function appendOption(option) {
                            option.setAttribute("value", name);
                            option.textContent = name;
                        }
                    });
                }
                else {
                    alert("Currency Names not found")
                }
            }
        }
    }

    /**@description Checkouts the dates for the correct period. If the period is not permitted, the inputs become red
     * and the message in h2 size comes in DOM. If the inputs are changed correctly, then the inputs become default and
     * 'timeperiod' property gets 'true'. The inputs are converted to the Date format for measuring.
     * If 'timeperiod' gets true, and the base currency is selected, it initiates creating the array of urls.
     * Then it turns to function .initAllPromises() for fetching the data.
     * Added the correct endings for the figures .ending(timeDiff, ["день", "дня", "дней"])
     * */
    function initDates() {
        if (fromDate && toDate) {   //if values of DOM inputs (String type)
            let dateFrom = new Date(fromDate); //converting to Date type for the further measuring
            let dateTo = new Date(toDate);
            let timeDiff = (dateTo - dateFrom)/1000/60/60/24;
            if (timeDiff <= maxTime && timeDiff >= 0) {
                timePeriod = true; //allowing further fetching
                mssgTime.textContent = "Задан диапазон " + timeDiff + " " + ending(timeDiff, ["день", "дня", "дней"]);
                for (let i = 0; i < inputArr.length; i++) {
                    inputArr[i].style.backgroundColor = ""; //resetting CSS styles for input DOM elements
                    inputArr[i].style.color = "";
                }
                mssgTime.style.backgroundColor = "";    //resetting CSS style for h3 data-type="mssgTime"
                mssgTime.style.color = "";

                if (baseCur && timePeriod) {  //for fetches to API we need "date" and "base currency"
                    urlArr = getUrlArr(url, fromDate, toDate); //making urls + params to array

                    if (urlArr.length) {
                        ratesArr = [];
                        initAllPromises();  //initializing fetching
                    }
                }
            }
            else {
                timePeriod = false;
                mssgTime.style.backgroundColor = "rgba(175,17,17,1)";
                mssgTime.style.color = "white";
                for (let i = 0; i < inputArr.length; i++) {
                    inputArr[i].style.backgroundColor = "rgba(175,17,17,1)";
                    inputArr[i].style.color = "white";
                }
                mssgTime.textContent = "Даты вне диапазона " + maxTime + " " + ending(maxTime, ["день", "дня", "дней"]) +
                    " :: " + timeDiff + " " + ending(timeDiff, ["день", "дня", "дней"]);
            }
        }
    }
    /**@description: Creates the array of urls with additional params '?base='. Convert incoming dates to Date format.
     * Cycles Dates from starting Date to the final one.
     * @param: {url} The initial ULR address of the API
     * @param: {start} Starting date in String from the input
     * @param: {end} Final date in String from the input
     * @return: the array of prepared urls
     * */
    function getUrlArr(url,start, end) {
        let arrayUrl = [];
        if (!baseCur) {
            return alert("no base Currency");
        }
        let startDate = new Date(start);
        let endDate = new Date(end);
        for (startDate; startDate <= endDate;) {
            let makeUrl = url + dateFormat(startDate, "-") + "?base=" + baseCur;
            arrayUrl.push(makeUrl);
            startDate.setDate(startDate.getDate() + 1);
        }
        return arrayUrl;
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

    /**@description: Makes promises of fetching by urls from the prepared array 'urlArr'.
     * Each fetch-promise is processed in asynchronous way and not from first no final by cycle.
     * If all Promises are solved, and if we have already selected currency to evaluate, it starts creating the Graph
     * preperations by .initGraph()
     * */
    function initAllPromises() {
        ratesArr = []; //resetting previous values
        Promise.all(urlArr.map(url => //using urlArr to make async fetch promises
            fetch(url)
                .then(status)
                .then(parseJSON)
                .catch(function (error) {
                    alert(error);
                })
        )).then(data => {   //processing the outcome array of response objects
            ratesArr = data;

            if (ratesArr.length && curEval) {   //if we already have selected currency to evaluate - we process ratesArr
                initGraph();
            }
        });
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

    /**@description: Creates the Graph from the fetched data. When the changes of the currencies are very little,
     * the curve (columns) of the Graph becomes looking like stable.
     * In this case, we describe the relative co-ratio of the min value of the rates to other values for the better
     * demonstration of changes.
     * When next initiating of the Graph, we remove the previous Graph from DOM.
     * * */
    function initGraph() {
        var curArr = []; //Array of rates values with base currency and currency for evaluation
        var maxValue = null; //max value in curArr
        var minValue = null; //min value in curArr

        var isBlockinDOM = graphWrapper.querySelector(".graph-wrapper__block");
        if (isBlockinDOM) {   //if the graph already exists then remove from DOM
            isBlockinDOM.parentElement.removeChild(isBlockinDOM);
        }

        var graphColArr = []; //future array of DOM cols showing rates value for each day
        var graphBlock = new GraphBlock(); //changable graph block
        graphBlock.createGraph(15); //creating graph with column height (Integer)

        /**@description: Using the Constructor 'GraphBlock' and .prototype method .createGraph() for attaching Graph
         * columns to DOM. Putting the value of rates to each column.textContent and dates of currency rate.         *
         * @return: returns new Object with common prototype
         * */
        function GraphBlock() {
            this.wrapperBlock = document.createElement("div");
            this.wrapperBlock.setAttribute("class", "graph-wrapper__block flex-box center");

            /**@description: the .prototype function, which cycles the ratesArr and builds the columns with
             * the textContent = value of ratesArr[i] and currency name.
             * Then the height of columns in DOM are calculated with account to min and max values, max height of columns
             * @param: {colHeight} INTEGER!!! The number of max height for the columns in DOM.
             * */
            GraphBlock.prototype.createGraph = function (colHeight) {
                if (ratesArr.length) {
                    for (let i = 0; i < ratesArr.length; i++) {
                        if ("rates" in ratesArr[i]) {
                            if ("date" in ratesArr[i]) {
                                let graphResultBlock = document.createElement("div");
                                graphResultBlock.setAttribute("class", "graph-result_block");
                                graphResultBlock.style.height = colHeight + "em";

                                let graphResultCol = graphResultBlock.appendChild(document.createElement("div"));
                                graphResultCol.setAttribute("class", "graph-result_col");

                                let graphResultColValue = graphResultCol.appendChild(document.createElement("span"));
                                graphResultColValue.setAttribute("class", "graph-result_col__value");

                                graphResultColValue.textContent = Math.round((ratesArr[i]["rates"][curEval]) * 10000) / 10000; //writing value to graph
                                curArr.push(ratesArr[i]["rates"][curEval]);

                                let graphResultColDate = graphResultCol.appendChild(document.createElement("span"));
                                graphResultColDate.setAttribute("class", "graph-result_col__date");

                                graphResultColDate.textContent = ratesArr[i]["date"];

                                this.wrapperBlock.appendChild(graphResultBlock);
                            }
                        }
                    }
                }
                else {
                    alert("the array taken is empty");
                }

                graphWrapper.appendChild(this.wrapperBlock);    //giving resulting graphWrapper to DOM
                graphColArr = graphWrapper.getElementsByClassName("graph-result_col"); //array of resulting cols in DOM

                if (graphColArr.length) {   //if resulting cols are in DOM
                    setHeights(colHeight, "0.8", "0.1"); //column height, (max,min) heights of resulting columns (percent in 0.n way)
                }

                /**@description: Calculates the co-ratio of all rates with account to minimum value. It helps to
                 * demonstrate very little differences.
                 * @param: {colHeight} INTEGER!!! The number of max height for the columns in DOM.
                 * @param: {max} The maximum height of the graph column (graphResultCol) to its parent
                 * container (graphResultBlock). It prevents gives better view for the Chart.
                 * (in percent "0.8" form!!!)
                 * @param: {min} The minimum height of the graph to prevent columns from '0' height.
                 * */
                function setHeights(colHeight, max, min) {
                    if (curArr.length && graphColArr.length) {  //if array of rates and if cols in DOM
                        var maxHeight = colHeight * max ;   //max height of the resulting columns
                        var minHeight = colHeight * min;

                        maxValue = Math.max.apply(null, curArr);    //getting max/min values from array of rates
                        minValue = Math.min.apply(null, curArr);

                        for (let i = 0; i < graphColArr.length; i++) {
                            let rateValue = curArr[i];
                            graphColArr[i].style.height = calcHeight(maxHeight, minHeight, maxValue, minValue, rateValue) + "em";
                        }
                    }
                    else return alert("Rates result is empty");

                    /**@description: Calculates the heights for the Chart columns.
                     * @param: {maxHeight} Integer max given height of the Chart column
                     * @param: {minHeight} Integer min given height of the Chart column
                     * @param: {maxValue} the maximum value of the rates array 'curArr'
                     * @param: {minValue} the minimum value of the rates array 'curArr'
                     * @param: {rateValue} the current value of each separate rate 'curArr[i]'
                     * @return: returns Integer. !!!Important to add "em"/"pix" when style setting
                     * */
                    function calcHeight(maxHeight, minHeight, maxValue, minValue, rateValue) {
                        let calc = minHeight + (rateValue - minValue)/((maxValue - minValue)/(maxHeight - minHeight));
                        return calc;
                    }
                }
            };
        } //END OF GraphBlock
    }   //END OF FUNC initGraph()
}

function ending(n, option) {    //ending for numerics (элемент, элемента, элементов)
    return option[(n%10 === 1 && n%100 !== 11) ? 0 : n%10 >= 2 && n%10 <= 4 && (n%100 < 10 || n%100 >= 20) ? 1 : 2];
}