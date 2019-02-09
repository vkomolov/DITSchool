"use strict";

window.addEventListener("DOMContentLoaded", function () {
    initStorage(); //creating initial localStorage, from where the selected SKU list will be taken for processing

    if (document.forms["order-form"]) {
        initForm(document.forms["order-form"]);
    }
    else {
        throw new Error("no name 'order-form' found in DOM");
    }
});

///////////FUNCTIONS
/**@description: suspected that the selected items were pushed to localStorage before filling the Cart Form. Function
 * simulates the array of objects, pushed to the localStorage. All the cart operations will be taken from here.
 * **/
function initStorage() {
    let storage = localStorage;
    let headerCart = document.getElementById("cart__qnty"); //span with qnty of items selected in the cart-icon (header)

    simulateStorage();

    if (storage.selected) {
        headerCart.textContent = JSON.parse(storage.selected).length; //cart icon takes the items` qnty from localStorage
    }

    function simulateStorage() {
        let chosenArr = [
            {
                itemName: "The Chelsea Boot",
                itemId: "18035",
                price: "235",
                itemDetail: "Black",
                itemQnty: 1,
                photoUrl: "./img/boots.png"
            },
            {
                itemName: "The Twill Snap Backpack",
                itemId: "22016",
                price: "65",
                itemDetail: "Reverse Denim + Brown leather",
                itemQnty: 1,
                photoUrl: "./img/backpack.png"
            },
            {
                itemName: "The Twill Zip Tote",
                itemId: "38049",
                price: "48",
                itemDetail: "Reverse Denim + Black leather",
                itemQnty: 1,
                photoUrl: "./img/bag.png"
            }];
        let chosenArrJson = JSON.stringify(chosenArr);
        storage.setItem("selected", chosenArrJson);
    }
}

/**@description: comprises the main operations with inputs and DOM navigation
 * @param: {formName} the form in DOM has 3 stage-blocks which are opened separately during filling inputs
 * **/
function initForm(formName) {
//////////PROPERTIES
    const form = formName;
    const stageArr = form.querySelectorAll("span[data-type=\"stage\"]"); //there are three stages (0, 1, 2)
    const formBlockArr = form.querySelectorAll(".form__block"); //three stage blocks of the forms
    const inputNamesObj = { //input names of all the forms with params
        "recipient-full-name": {error: "Jonathan Smith", type: "spacedString", stage: 0},
        "recipient-phone-number": {error: "+7(987)123-77-88", type: "phone", stage: 0},
        "recipient-street-address": {error: "Pushkina", type: "string", stage: 0},
        "optional": {error: "format: All except: '+', '=', '*'", type: "combi", stage: -1},
        "recipient-city": {error: "Kazan", type:"string", stage: 0},
        "recipient-country": {error: "Russia", type: "stringMaySpace", stage: 0},
        "recipient-zip": {error: "420015", type: "zip", stage: 0},
        "billing-full-name": {error: "Jonathan Smith", type: "spacedString", stage: 2},
        "billing-email": {error: "j.smith@gmail.com", type: "email", stage: 1},
        "billing-street-address": {error: "Pushkina", type: "string", stage: 1},
        "billing-optional": {error: "format: All except: '+', '=', '*'", type: "combi", stage: -1},
        "billing-city": {error: "Kazan", type: "string", stage: 1},
        "billing-country": {error: "Russia", type: "stringMaySpace", stage: 1},
        "billing-zip": {error: "420015", type: "zip", stage: 1},
        "card-name": {error: "Jonathan Smith", type: "spacedString", stage: 2},
        "card-number": {error: "3333 7777 8888 3333", type: "cardNumber", stage: 2},
        "card-date": {error: "MMYY: 0518", type: "cardDate", stage: 2},
        "card-code": {error: "0458", type: "cardCode", stage: 2}
    };
    const fetchedAreaArr = ["Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
        "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore"];
    const regExpObj = {
        //'input' event restricts from validating regExp on separate chars input. (no validation of the whole value)
        "phone": /^[\+]?[0-9]{0,1}[(]?[0-9]{0,3}[)]?[0-9]{0,3}[-]?[0-9]{0,2}[-]?[0-9]{0,2}$/,
        "string": /^[a-z]{1,30}$/i,
        "stringMaySpace": /^([a-z]{1,15}\s?)([a-z]{0,15}\s?)[a-z]{0,15}$/i,
        "spacedString": /^([a-z]{1,15}\s?)[a-z]{0,15}$/i,
        "combi": /^[^\+\*=]+$/i,
        "zip": /^[0-9]{1,6}$/i,
        "email": /^[a-z0-9]{1,15}[\@]?[a-z0-9]{0,15}[\.]?[a-z]{0,5}$/i,
        "cardNumber": /^[0-9]{1,4}\s?[0-9]{0,4}\s?[0-9]{0,4}\s?[0-9]{0,4}$/i, //will be then processed
        "cardDate": /^[0-9]{1,4}$/i, //will be then processed
        "cardCode": /^[0-9]{1,4}$/i
    };
    let stage = 0; //stage of the form blocks
    let personInfo = {}; // will be set when all required inputs filled
    let skuArr = []; //the future array of new Sku elements
    let payer = {}; //the future sample of Payer Constructor
    let recipient = {}; //the future sample of Recipient Constructor
    let order = {}; //the future sample of Order Class. It will comprise all the purchase data and will be sent in fetch
    let orderJson = ""; //Ready order Obj for JSON and fetching. On response - to get number of order, shipment date.

/////////////OPERATIONS
    equalHeights(); //making heights of the columns in form equal by height
    initCart();
    checkStage(); //checks the stage of the form block
    listen();   //events are hung here

////////////FUNCTIONS SECTION
    function initCart () {
        if (localStorage.selected) { //checking localStorage for chosen goods SKU
            const chosenArr = JSON.parse(localStorage.selected);
            if (!chosenArr.length) {
                throw new Error("localStorage object is empty");
            }
            chosenArr.forEach(function (item) {
                skuArr.push(new Sku(item));
            });
        }

        if (skuArr.length) {
            order = new Order(skuArr, 5, 0); //making Order sample beforehead for the calculation of values for DOM
            createCartDom(skuArr);
        }
        else {
            throw new Error("no SKU array set");
        }
    }

    function createCartDom(skuArr) {
        let cartContainer = document.getElementById("cart-list");
        let cartInfoTotal = document.querySelector(".cart-info__total");

        for (let i = 0; i < skuArr.length; i++) {
            //.prototype methods of Sku Constructor
            let imgSrc = skuArr[i].initProperty("photoUrl");
            let itemName = skuArr[i].initProperty("itemName");
            let itemSum = skuArr[i].getSum();
            let itemDetail = skuArr[i].initProperty("itemDetail");
            let itemQnty = skuArr[i].initProperty("itemQnty");

            let item = document.createElement("div");
            item.classList.add("cart-item");

            let imgWrapper = document.createElement("div");
            imgWrapper.setAttribute("class", "image-container goods");
            item.appendChild(imgWrapper);

            let img = document.createElement("img");
            img.setAttribute("src", imgSrc);
            img.setAttribute("alt", "item image");
            imgWrapper.appendChild(img);

            let itemInfo = document.createElement("div");
            itemInfo.classList.add("cart-item__info");
            item.appendChild(itemInfo);

            let itemInfoMain = document.createElement("div");
            itemInfoMain.setAttribute("class", "flex-box between");
            itemInfo.appendChild(itemInfoMain);

            let spanName = document.createElement("span");
            spanName.setAttribute("data-cart", "itemName");
            spanName.textContent = itemName;
            itemInfoMain.appendChild(spanName);

            let spanSum = document.createElement("span");
            spanSum.setAttribute("data-cart", "itemSum");
            spanSum.textContent = "$" + itemSum;
            itemInfoMain.appendChild(spanSum);

            let itemInfoSpec = document.createElement("div");
            itemInfoSpec.classList.add("cart-item__spec");
            itemInfo.appendChild(itemInfoSpec);

            let spanDetail = document.createElement("span");
            spanDetail.setAttribute("data-cart", "itemDetail");
            spanDetail.textContent = itemDetail;
            itemInfoSpec.appendChild(spanDetail);

            let span = document.createElement("span");
            span.textContent = "Quantity:";
            itemInfoSpec.appendChild(span);

            let spanQnty = document.createElement("span");
            spanQnty.setAttribute("data-cart", "itemQnty");
            spanQnty.textContent = itemQnty;
            span.appendChild(spanQnty);

            cartContainer.appendChild(item);
            cartContainer.appendChild(document.createElement("hr"));
        }

        if (cartInfoTotal) {
            let spanArr = cartInfoTotal.querySelectorAll("span");
            spanArr.forEach(function (item) {
                let data = item.dataset.cart;
                if (data) {
                    let cartArr = {
                        "subTotal": function () {
                            item.textContent = "$" + order.getSubtotalSum().toFixed(2);
                        },
                        "shippingCost": function () {
                            let result = order.getShipping(); //getting cost for shipping. If 0 than "free"
                            if (!result) {
                                item.textContent = "free";
                            }
                            else {
                                item.textContent = "$" + (Math.round(result * 100) / 100).toFixed(2);
                            }
                        },
                        "taxCost": function () {
                            item.textContent = "$" + order.getTax().toFixed(2); //getting tax value from the subtotal sum
                        },
                        "totalPrice": function () {
                            item.textContent = "$" + (Math.round(order.getTotalSum() * 100) / 100).toFixed(2);
                        }
                    };
                    if (data in cartArr) {
                        cartArr[data]();
                    }
                }
            });
        }
        else {
            throw new Error(".cart-info__total found in DOM");
        }

    }

    function listen() {
        const editLink = document.querySelector("span[data-type=\"orderEdit\"]");
        editLink.onclick = function () {alert("the realisation can be done by the Sku.prototype methods");};
//////////KEYDOWN EVENT
        form.addEventListener("keydown", function f(ev) {
            let target = ev.target;
            if (ev.keyCode === 13) {
                target.blur();  //if during input the 'enter' key pressed the input is blur
            }
        }, true);

//////////FOCUS/BLUR EVENT
        form.addEventListener("focus", function (ev) {
            let target = ev.target;
            if (target.name !== "recipient-country" && target.name !== "billing-country") {
                toggleBorder(target);
            }
        } ,true); //onfocus can be caught on bubbling up

        form.addEventListener("blur", function (ev) {
            let target = ev.target;
            if (target.name !== "recipient-country" && target.name !== "billing-country") {
                toggleBorder(target);
            }
        } ,true); //onblur can be caught on bubbling up

//////////CLICK EVENT
        form.addEventListener("click", function (ev) {
            let target = ev.target;

            if (target.closest("div").dataset.type === "continue") {
                checkForNext();  //if 'continue' pushed then checking all inputs (of current and prev stage) to be not empty
            }

            if (target.closest(".selection__block")) { //if pseudo-input 'country' pushed then opens list in absolute for selection
                let selectBlock = target.closest(".selection__block"); //pseudo-input wrapper
                let hiddenInput = selectBlock.parentElement.querySelector("input"); //getting right input
                let optionBlock = hiddenInput.parentElement; //intermediate wrapper of the input

                hiddenInput.value = ""; //resetting value of the search-input

                setSelectList(optionBlock, fetchedAreaArr); //creating list of option items (span)

                optionBlock.classList.add("active"); //to switch to display: block from none
                selectBlock.classList.add("active"); //to display the search-icon in absolute
                hiddenInput.focus();
            }

            if (target.dataset.type === "option") {
                let optionBlock = target.parentElement.parentElement;
                let hiddenInput = optionBlock.querySelector("input"); // "recipient-country" or "billing-country"
                let selection = optionBlock.parentElement;
                let pseudoInput = selection.querySelector(`span[data-type=${hiddenInput.name}`);

                hiddenInput.value = ""; //resetting for getting round blur event checking
                hiddenInput.value = target.textContent;

                if (hiddenInput.value !== "") {
                    pseudoInput.textContent = hiddenInput.value;
                    pseudoInput.classList.add("bold");

                    setTimeout(function () {
                        optionBlock.classList.remove("active");  //to switch block to display: none
                        selection.querySelector(".selection__block").classList.remove("active"); //to switch the search-icon off
                    }, 300);
                }
            }
        });

//////////INPUT EVENT
        form.addEventListener("input", function (ev) {
            let target = ev.target;
            let targetName = target.name;
            let rExpType = inputNamesObj[targetName].type;

            testRegExp(target, rExpType); //testing input value by its regExp, which found in 'inputNamesObj'

            if (rExpType === "stringMaySpace") {
                let optionBlock = target.parentElement;
                if (searchInArray(optionBlock, target.value, fetchedAreaArr)) { //searching chars in the country array
                    target.style.color = "";
                }
                else {
                    target.classList.add("red");
                }
            }
        }, true);

/////////CHANGE EVENT
        form.addEventListener("change", function (ev) {
            let target = ev.target;
            let targetName = target.name;
            let rExpType = inputNamesObj[targetName].type;

            target.value = target.value.trim();

            if (target.value !== "") {
                if (!regExpObj[rExpType].test(target.value)) { //rechecking the value for safe
                    target.value = "";
                    target.classList.add("marked");
                    showAlertAndOff(target.parentElement, "error");
                }
                else {  //if value preliminary validated through regExp
                    removeAlerts();
                    target.classList.remove("marked");

                    let cases = {
                        "spacedString": function () {
                            let val = target.value;
                            if (val.split(" ").length === 1) { //if no second word (0 is null!)
                                target.value = "";
                                target.classList.add("marked");
                                showAlertAndOff(target.parentElement, "error");
                            }
                        },
                        "zip": function () {
                            if (target.value.length < 6) {
                                target.value = "";
                                target.classList.add("marked");
                                showAlertAndOff(target.parentElement, "error");
                            }
                        },
                        "phone": function () {
                            if (target.value.length < 16) { //if validated value is less then needed
                                target.value = "";
                                target.classList.add("marked");
                                showAlertAndOff(target.parentElement, "error");
                            }
                            else {
                                target.value = target.value.slice(0, 2) + " " + target.value.slice(2);
                                target.value = target.value.slice(0, 8) + " " + target.value.slice(8);
                            }
                        },
                        "stringMaySpace": function () {
                            let pseudoInput = form.querySelector(`span[data-type=${targetName}`); ///span which hides the input and option list in absolute hidden
                            let optionBlock = target.parentElement;
                            let selectionBlock = optionBlock.parentElement.querySelector(".selection__block");
                            let res = false;

                            for (let i = 0; i < fetchedAreaArr.length; i++) {
                                if (target.value === fetchedAreaArr[i]) {
                                    res = true;
                                }
                            }
                            if (!res) {
                                target.classList.add("red");
                                pseudoInput.classList.remove("bold");
                            }
                            else {
                                pseudoInput.textContent = target.value;
                                pseudoInput.classList.remove("red");
                                pseudoInput.classList.add("bold");
                                setTimeout(function () {
                                    optionBlock.classList.remove("active");  //to switch block to display: none
                                    selectionBlock.classList.remove("active"); //to switch the search-icon off
                                }, 300);
                            }
                        },
                        "cardNumber": function () {
                            if (target.value.length < 16) { //if validated value is less then needed
                                target.value = "";
                                target.classList.add("marked");
                                showAlertAndOff(target.parentElement, "error");
                            }
                            else {
                                let temp = target.value;
                                temp = temp.replace(/ /gi, "");
                                for (let i = 4; i < temp.length; ) {
                                    temp = temp.slice(0, i) + " " + temp.slice(i);
                                    i += 5;
                                }
                                target.value = temp;
                                target.parentElement.classList.add("card-type"); //adding card-icon to DOM element
                            }
                        },
                        "cardDate": function () {
                            if (target.value.length < 4) { //if validated value is less then needed
                                target.value = "";
                                target.classList.add("marked");
                                showAlertAndOff(target.parentElement, "error");
                            }
                            else {
                                let m = target.value.slice(0, 2);
                                let y = target.value.slice(-2);
                                let curDate = new Date();
                                let curYear = curDate.getFullYear();
                                let curYearLastDits = curYear.toString().slice(-2); //getting last two digits of year
                                let innDate = null; //incoming date

                                if (y >= curYearLastDits) {
                                    if (m >= 0 && m < 13) {  //writing as Jan - 1 (not as 0)
                                        innDate = stringToDate(y, m);
                                        if (innDate > curDate) {
                                            target.value = target.value.slice(0,2) + " / " + target.value.slice(2);
                                        }
                                        else {
                                            target.value = "";
                                            target.classList.add("marked");
                                            showAlertAndOff(target.parentElement, "card date is expired");
                                        }
                                    }
                                    else {
                                        target.value = "";
                                        target.classList.add("marked");
                                        showAlertAndOff(target.parentElement, `month: ${m} is not correct`);
                                    }
                                }
                                else {
                                    target.value = "";
                                    target.classList.add("marked");
                                    showAlertAndOff(target.parentElement, "card date is expired");
                                }
                            }
                        },
                        "email": function () { //very simple for email: to be validated on the Back
                            if (target.value.indexOf("@") < 0 || target.value.indexOf(".") < 0) {
                                target.value = "";
                                target.classList.add("marked");
                                showAlertAndOff(target.parentElement, "error");
                            }
                        }
                    };
                    if (cases[rExpType]) {
                        cases[rExpType]();
                    }
                }
            }
        });

        function testRegExp(input, regType) {
            let regExp = regExpObj[regType];
            if (!regExp.test(input.value)) {
                showAlertAndOff(input.parentElement, "error");
                setTimeout(function () {
                    input.value = input.value.slice(0,-1); //showing then deleting last char
                }, 300);
            }
            else {  //if regExp passes
                defaultInput(input); //resetting input style
                if (regType === "string" || regType === "spacedString" || regType === "stringMaySpace") {
                    input.value = input.value[0].toUpperCase() + input.value.slice(1).toLowerCase();
                }
                if (regType === "spacedString" || regType === "stringMaySpace") {
                    if (input.value.indexOf(" ") !== -1) {  //if 'space' in string (for full name input)
                        let spaceInd = input.value.indexOf(" ");
                        if (((input.value.length - 1) - spaceInd) >= 1 ) {   //if input has symbol/s after space
                            let capTale = input.value[spaceInd+1].toUpperCase() + input.value.slice(spaceInd + 2).toLowerCase();
                            input.value = input.value.slice(0, spaceInd+1) + capTale; //string before space and after
                        }
                    }
                }
                if (regType === "phone") {
                    //////if the place for '+'
                    if (input.value.indexOf("+") === -1) {
                        input.value = "+" + input.value;
                    }
                    //////if the place for '('
                    if (input.value.indexOf("(") === -1 && input.value.length === 3) {
                        let lastChar = input.value.slice(-1);
                        input.value = input.value.slice(0, -1) + "(" + lastChar;
                    }
                    /////if '(' is not in place
                    if (input.value.indexOf("(") !== -1 && input.value.indexOf("(") !== 2) {
                        insertAlarm(input.parentElement, "error");
                        setTimeout(function () {
                            input.value = input.value.slice(0,-1); //showing then deleting last char
                        }, 300);
                    }
                    //////if the place for ')'
                    if (input.value.indexOf(")") === -1 && input.value.length === 7) {
                        let lastChar = input.value.slice(-1);
                        input.value = input.value.slice(0, -1) + ")" + lastChar;
                    }
                    //if ')' is not in place
                    if (input.value.indexOf(")") !== -1 && input.value.indexOf(")") !== 6) {
                        insertAlarm(input.parentElement, "error");
                        setTimeout(function () {
                            input.value = input.value.slice(0,-1); //showing then deleting last char
                        }, 300);
                    }

                    //////if the place for '-'
                    if (input.value.indexOf("-") === -1 && input.value.length === 11 ||
                        input.value.indexOf("-", 11) === -1 && input.value.length === 14) {
                        let lastChar = input.value.slice(-1);
                        input.value = input.value.slice(0, -1) + "-" + lastChar;
                    }
                    if (input.value.indexOf("-") !== -1 && input.value.indexOf("-") !== 10 ||
                        input.value.indexOf("-", 11) !== -1 && input.value.indexOf("-", 11) !== 13) {
                        insertAlarm(input.parentElement, "error");
                        setTimeout(function () {
                            input.value = input.value.slice(0,-1); //showing then deleting last char
                        }, 300);
                    }
                }
                if (regType === "cardNumber") {
                    input.parentElement.classList.remove("card-type"); //eliminating possible card-icon of previous value

                    if (input.value.indexOf(" ") === -1 && input.value.length === 5 ||
                        input.value.indexOf(" ", 9) === -1 && input.value.length === 10 ||
                        input.value.indexOf(" ", 14) === -1 && input.value.length === 15 ||
                        input.value.indexOf(" ", 19) === -1 && input.value.length === 20) {

                        let lastChar = input.value.slice(-1);
                        input.value = input.value.slice(0, -1) + " " + lastChar;
                    }
                }
            }
        }

        function searchInArray(obj, string, arr) {
            let countryArr = arr; // making copy for further processing
            let foundArr = [];
            let searchStr = string;

            countryArr.forEach(function (item) {
                if (item.indexOf(searchStr) !== -1) {
                    foundArr.push(item);
                }
            });

            if (foundArr.length) {
                setSelectList(obj, foundArr);
                return true;
            }
            else {
                return false;
            }
        }

        function showAlertAndOff(parentTarget, type="empty") {
            insertAlarm(parentTarget, type);
            setTimeout(function () {
                removeAlerts();
            }, 1000);
        }

        function toggleBorder(targetInDom) {
            targetInDom.parentElement.classList.toggle("active");
        }

        function defaultInput(targetInput) {
            removeAlerts();
            targetInput.style.caretColor = "";
            targetInput.style.color = "";
        }

        /**@description: Checking the empty inputs for the each stage of the form ('Shipping', 'Billing', 'Payment').
         * At the next stages it checks the previous stages as well (for safe).
         * The first empty input will have the alarm message above it. All empty but required inputs will be marked.
         * **/
        function checkForNext() {
            let activeBlock = findClassIn(formBlockArr, "active"); //looking for the form block marked as ".active"
            let emptyInputArr = []; //refreshing previous results of empty inputs` array
            stage = checkStage();

            removeAlerts(); //removing previous possible alert message
            unmarkInputs(); //unmarking all previous marking of empty inputs

            if (stage === activeBlock) { //if blocks shown in DOM are correct
                for (let elem in inputNamesObj) {
                    if (inputNamesObj[elem].stage <= activeBlock && //validating inputs only of the current and previous stages for safety
                        inputNamesObj[elem].stage !== -1) {         //except inputs 'optional'...not required
                        if (form.elements[elem]) { //if input exists in DOM
                            if (!form.elements[elem].value) { //if input is empty
                                if (form.elements[elem].name === "recipient-country" || //if pseudo input in DOM
                                    form.elements[elem].name === "billing-country") {

                                    let name = form.elements[elem].name;
                                    //if the empty input is of the current stage (to prevent empty inputs of further stages)
                                    let pseudoInput = form.querySelector(`span[data-type=${name}]`);
                                    pseudoInput.parentElement.classList.add("marked");// marking pseudo input Parent

                                    emptyInputArr.push(pseudoInput.parentElement); //pushing the empty input Parent
                                }
                                else {
                                    form.elements[elem].classList.add("marked");
                                    emptyInputArr.push(form.elements[elem].parentElement);
                                }
                            }
                        }
                        else throw new Error("no DOM input by name " + elem + "found");
                    }
                }

                if (emptyInputArr.length) { //if some empty inputs
                    insertAlarm(emptyInputArr[0]); //giving alarm message to the first empty input with default 'empty'
                    emptyInputArr[0].querySelector("input").focus(); //if checking inputs then focusing on the first
                }
                else {
                    if (stage === 2) {
                        personInfo = getAllInputs(inputNamesObj); //making final obj from inputs
                        initOrder(personInfo);
                        orderJson = JSON.stringify(order); //ready to be fetched
                        //on getting response with the order No and shipment date:
                        buildThanks();
                    }
                    if (stageArr.length - 1 > stage) {
                        stageArr[stage].classList.remove("active"); //unmarking the stage block in DOM
                        formBlockArr[stage].classList.remove("active"); //unmarking the form block in DOM
                        stageArr[stage + 1].classList.add("active"); //marking the next stage block
                        formBlockArr[stage + 1].classList.add("active"); //marking the next form block

                        stage = checkStage(); //refreshing stage index
                    }
                }
            }
            else {
                throw new Error("active stages do not correspond to their index");
            }
        }
    }

    /**@description: collects all the values from the form inputs.
     * @param: {inputArr} Object with the properties for each input
     * @return: Object with the input properties
     * *****/
    function getAllInputs(inputObj) {
        let info = {};
        for (let elem in inputObj) {
            if (elem === "card-date") {
                let inputValue = form.elements[elem].value;
                let inputYear = inputValue.slice(-2);
                let inputMonth = inputValue.slice(0, 2);
                info[elem] = stringToDate(inputYear, inputMonth); //creating Date from strings: mm, yy
            }
            else {
                info[elem] = form.elements[elem].value;
            }
        }
        return info;
    }

    /**@description: checks for the Object in the Arr, which has ".active" (will be shown in DOM)
     * **/
    function checkStage() {
        stage = findClassIn(stageArr, "active"); //looking for the stage block index marked as ".active"
        if (+stage === 2) {
            let buttonNextSpan = form.querySelector(".button_continue span");
            buttonNextSpan.textContent = "Pay Securely";
        }
        return stage;
    }

    /**@description: initiates the Date from the input chars (yy, mm)
     * **/
    function stringToDate(yy, mm) {
        let month = +mm - 1; //month minus 1 (jan: 0)
        let year = +yy + 2000;
        let innDate = new Date(year, month);
        return innDate;
    }

    /**@description: creating messages for empty inputs and error inputs.
     * @param: type - the type of message: "empty", "error"
     * **/
    function insertAlarm(targetObj, type="empty") {
        let typeAlarm = type;
        let inputName = null;
        let message = "please enter ";

        removeAlerts(); //removing all alerts set before

        if (targetObj.classList.contains("selection__block")) {  //if it is a pseudo input wrapper
            inputName = targetObj.parentElement.querySelector("input").name;
        }
        else if (targetObj.querySelector("input")){
            inputName = targetObj.querySelector("input").name; //getting the name for creating message to be alarmed
            form.elements[inputName].style.caretColor = "red";
        }
        else throw new Error("no Input found");

        if (typeAlarm === "empty") {
            message += inputName.replace(/-/g, " "); //putting the input`s name to the message content
            insertSpan(targetObj, message);
        }
        else if (typeAlarm === "error") {
            message = "format: ";
            message += inputNamesObj[inputName]["error"]; //creating 'error' message from the name of the input
            insertSpan(targetObj, message);
        }
        else insertSpan(targetObj, type); //creating custom message
    }

    /**@description: insert a span inside the targetObj
     * **/
    function insertSpan(targetObj, message) {
        let parent = targetObj;
        let span = document.createElement("span");
        span.textContent = message;
        parent.insertBefore(span, parent.firstChild);
        span.setAttribute("class", "alert-message");
    }

    /**@description: just collects the cols from DOM and gives them to equalCols()
     * **/
    function equalHeights() {
        if (document.querySelector(".person-info") && document.querySelector(".cart-info")) {
            let domColsArr = [];
            domColsArr.push(document.querySelector(".person-info"));   //only one if some exist
            domColsArr.push(document.querySelector(".cart-info"));  //only one if some exist
            equalCols(domColsArr);  //function in glogal taking array
        }
        else throw new Error("no .person-info or .cart-info found");
    }

    /**@description: dinamically creates the option list of countries, fetched from the server. It listens to the
     * input and sorts countries` list with the matching chars.
     * @param: {objTarget} the DOM Container for the option list
     * @param: {areaArr} the fetched list of the countries
     * */
    function setSelectList(objTarget, areaArr) {
        let obj = objTarget;
        let optionWrapper = obj.querySelector(".option-wrapper");
        if (optionWrapper) {
            optionWrapper.parentElement.removeChild(optionWrapper); //remaking optionWrapper
        }
        optionWrapper = document.createElement("div");
        optionWrapper.classList.add("option-wrapper");

        for (let i = 0; i < areaArr.length; i++) {
            let option = document.createElement("span");
            option.setAttribute("data-type", "option");
            option.textContent = areaArr[i];
            optionWrapper.appendChild(option);
        }
        obj.insertBefore(optionWrapper, obj.firstChild);
    }

    /**@description: removes alert spans opened in DOM
     * **/
    function removeAlerts() {
        if (form.querySelector(".alert-message")) {     //if alert message exists in Dom then remove
            form.querySelector(".alert-message").remove();
        }
    }
    /**@description: unmarks the inputs in DOM
     * */
    function unmarkInputs() {
        let marked = form.querySelectorAll(".marked");
        if (marked.length) {
            marked.forEach(function (item) {
                item.classList.remove("marked");
            });
        }
    }

    /**@description: when the new Order sample is fetched to the server and received the response with the id of the
     * order and the date of delivery. It hides unnecessary DOM els, and opens the final "thanks" content with the
     * details on shipment
     * **/
    function buildThanks() {
        const fetchedOrderNo = "188787788"; //recieved response after the fetch of new Order sample
        const fetchedShipmentDate = new Date(2018, 10, 1); //recieved response after the fetch of new Order sample

        const stageWrapper = form.querySelector("div[data-type=\"stage-wrapper\"");
        const button = form.querySelector(".button_continue");
        const cartPanel = document.querySelector(".cart-info");
        const thankU = document.querySelector(".thankU-wrapper");
        const orderNumber = document.getElementById("order-number");
        const payerEmail = document.getElementById("payer-email");
        const shippingDate = document.getElementById("shipment-date");

        stageWrapper.parentElement.remove();
        button.parentElement.remove();
        cartPanel.classList.add("ready");
        formBlockArr.forEach(function (item) {
            item.classList.remove("active");
        });
        thankU.classList.add("active");

        orderNumber.textContent = fetchedOrderNo;
        shippingDate.textContent = fetchedShipmentDate.toDateString();

        if (!isEmptyObj(payer)) {
            payerEmail.textContent = payer.initProperty("billing-email");
        }
        else {
            throw new Error("payer data is not found");
        }
    }

    /**@description: separates the properties of the inputs to Recipient and Payer Classes.
     * Makes new samples 'payer' and 'recipient' and gives them to the new Order sample, initiated before.
     * @param: {personObj} Object, collected input values in the object
     * ***/
    function initOrder(personObj) {
        let regExp = /billing/;

        if (isEmptyProp(personObj)) {  //for safety (if all properties are filled)
            throw new Error("the property/ies in Object is/are empty");
        }

        let billData = filterObj(personObj, regExp);
        let recipData = filterObj(personObj, regExp, "not"); //properties without regExp

        if (billData && recipData) {
            payer = new Payer(billData); //creating new separate sample Payer for the possible database operations
            recipient = new Recipient(recipData); //!!var is used to be reachable in creating new Order below...

            order.initProperty("payer", payer);
            order.initProperty("recipient", recipient);
        }
        else {
            throw new Error("no properties for the Constructors Payer, Recipient");
        }
    }

////////////////CONSTRUCTORS
    /**@description:  creates a new sample with necessary properties filled from the form inputs.
     * Declaration of the .prototype functions will be initiated inside (in scope) of the Constructor: in order
     * to possibly operate them above the function, higher in code, just after the declaration of a new Class sample.
     * The .prototype methods of Payer and Recipient are equal and can be inherited from the common Class. But because
     * the common Class will not have its own sample, the .property methods have to be declared out of the function Class.
     * And in order to use them, we have to turn to them only after the declaration (lower in code). Not convenient and mass.
     * The solution is to restrict from common Class with declaration of common .prototype methods
     * ***/
    function Payer(payerObj) {
        for (let prop in payerObj) {
            this[prop] = payerObj[prop];
        }
        Payer.prototype.getAllProps = function () {
            return Object.keys(this);
        };
        Payer.prototype.initProperty = function (property, value) {
            let prop = property;
            if (prop in this) {
                if (arguments.length === 1) {
                    return this[prop];
                }
                this[prop] = value;
            }
            else throw new Error("no such property found");
        };
    }

    /**@description: creates the sample with the properties, taken from the inputs (with /billing/)
     * @param: {recipientObj} Object, which was made after the inputs filled.
     * */
    function Recipient(recipientObj) {
        for (let prop in recipientObj) {
            this[prop] = recipientObj[prop];
        }
        Recipient.prototype.getAllProps = function () {
            return Object.keys(this);
        };

        Recipient.prototype.initProperty = function (property, value) {
            let prop = property;
            if (prop in this) {
                if (arguments.length === 1) {
                    return this[prop];
                }
                this[prop] = value;
            }
            else throw new Error("no such property found");
        };
    }

    /**@description: creates a new product item, sample of Sku Constructor.
     * @param: {itemObj} Object, recieved from the localStorage
     * **/
    function Sku(itemObj) {
        for (let prop in itemObj) {
            this[prop] = itemObj[prop];
        }

        Sku.prototype.getAllProps = function () {
            return Object.keys(this);
        };

        Sku.prototype.initProperty = function (property, value) {
            let prop = property;
            if (prop in this) {
                if (arguments.length === 1) {
                    return this[prop];
                }
                this[prop] = value;
            }
            else throw new Error("no such property found");
        };

        Sku.prototype.getSum = function () {
            let sum = Math.round((this.price * this.itemQnty) * 100) / 100;
            return sum.toFixed(2);
        }
    }

    /**@description: the Class will be used before the payer and recipient samples are initiated. The Order`s methods of
     * subtotal and total sum calculations will be needed in DOM at once.
     * @param: {skuArr} - Array of Sku samples, {taxToPay} - Number (taxes), {shippingCost} - Number (shipping cost)
     * @param:  {payer} - Object (option), the sample of Payer, {recipient} - Object (option), the sample of Recipient
     * ***/
    function Order(skuArr, taxToPay, shippingCost, payer = null, recipient = null) {
        const tax = taxToPay; //percent for taxes, for instance
        this.payer = payer; //will be added when the form is filled
        this.recipient = recipient; //will be added when the form is filled
        this.scuArr = skuArr;
        this.shipping = shippingCost; //cost for delivery

        Order.prototype.getSubtotalSum = function () {
            let subtotal = 0;
            this.scuArr.forEach(function (item) {
                subtotal += +item.getSum();
            });
            if (subtotal) {
                return Math.round(subtotal * 100) / 100;
            }
            else {
                throw new Error("Something is wrong with price or qnty of sku");
            }
        };

        Order.prototype.getTax = function () {
            let subtotal = this.getSubtotalSum();
            return Math.round(((subtotal / 100) * tax) * 100) / 100; //tax here is in the scope of the Constructor
        };

        Order.prototype.getShipping = function () {
            return this.shipping;
        };

        Order.prototype.getTotalSum = function () {
            let result = this.getSubtotalSum() + this.shipping + this.getTax();
            return Math.round(result * 100) / 100;
        };

        /**@description: getter/setter of properties.
         * @param: {property} String (property of the object)
         * @return: property value, if arguments are without 'value'. If 'value', than it sets the property with 'value'
         * **/
        Order.prototype.initProperty = function (property, value) {
            let prop = property;
            if (prop in this) {
                if (arguments.length === 1) {
                    return this[prop];
                }
                this[prop] = value;
            }
            else throw new Error("no such property found");
        };
    }
}

//////////OPTION

/**@description: checks the array of DOM elements if they contain the css .class
 * @return: {number} array index of the DOM element, which contains the .class
 * @return: {boolean} false if no DOM elements with the .class in need
 **/
function findClassIn(array, className) {
    let res = null;
    array.forEach(function (item, index) {
        if (item.classList.contains(className)) {
            res = index;
        }
    });
    return res;
}

/**@description: checks for the empty proprerties of an object. If bool property is false then gives null.
 * @return: Boolean (true: one or more properties is/are false.
**/
function isEmptyProp (obj) {
    for (let prop in obj) {
        if (!obj[prop] && !prop.match(/optional/) ) { //if property is empty except 'optional' and 'billing-optional'
            return true;
        }
    }
    return false;
}

/**@description: checks if the obj is empty
 * @return: Boolean (true: one or more properties is/are false.
 **/
function isEmptyObj(obj) {
    if (!Object.keys(obj).length) {
        return true;
    }
    return false;
}

/**@description: looks for properties matching regExp filter. If it checks then it creates a new obj with
 * properties corresponding regExp. If optional argument type is false, it returns the object with properties which
 * are not matched with regExp.
 * @return: Object of properties, matched with regExp, or Boolean false
 * @param: {obj} - target Object, {regExp} - regExp, {type} - bool(true: returns obj which regExp matched;
 * false: returns obj with properties which are not matched with regExp.
 * **/
function filterObj(obj, regExp) {
    if (isEmptyProp(obj)) {
        throw new Error("one or more properties are empty in given object");
    }
    let resultObj = {}; //resulting object with own props

    if (arguments[2]) { // if arguments have optional parameter (any)
        for (let elem in obj) {
            if (!elem.match(regExp)) {
                resultObj[elem] = obj[elem];
            }
        }
        if (isEmptyObj(resultObj)) {
            return false;
        }
        return resultObj;
    }

    for (let elem in obj) { //if arguments[type] === true (default)
        if (elem.match(regExp)) {
            resultObj[elem] = obj[elem];
        }
    }
    if (isEmptyObj(resultObj)) {
        return false;
    }
    return resultObj;
}

/**@description: makes all given cols (in Arr) with equal heights
 * @param: {colsArr} Array of cols in DOM
 * */
function equalCols(colsArr) {   //for making DOM blocks` heights to be equal. Put them in array colsArr
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

function log(item) {
    console.log(item);
}

function ping() {
    log(true);
}