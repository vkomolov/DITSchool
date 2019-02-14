(function () {
    var calcIcon = document.querySelector(".calc");
    /*logDir(calcIcon);*/

    var calculator = {};
    calculator.node = ""; //DOM calculator wrapper(abs position)/will be {} with attr. By clear - again empty {}
    calculator.attr = {"id":"calc"};
////////////
    calculator.screenBlock = {};
    calculator.screenBlock.node = "";
    calculator.screenBlock.attr = {"class":"calc__row calc_screen"};
///////////
    calculator.tdDivClass = "calc__cell";
    calculator.screenClass = "backgr-light"; //lighting calcScreen
//////////
    calculator.calcScreen = {};
    calculator.calcScreen.node = "";
    calculator.calcScreen.attr = {
        "type":"text",
        "id":"calcScreen",
        "value":"",
        "disabled":"disabled"
    };
//////////
    calculator.screenSpan = {}; // operand will be shown at the right of calcScreen
    calculator.screenSpan.node = "";
    calculator.screenSpan.attr = {"class":"screen__operand"};
    //calculator.screenSpan.node.innerHTML = ""; //initial value on creating DOM
/////////
    calculator.screenNum = {};
    calculator.screenNum.node = ""; // num1 in screen span
    calculator.screenNum.attr = {"class":"screen__num"};
    //calculator.screenNum.node.innerHTML = ""; //initial value on creating DOM screenNum.node
////////
    calculator.screenRec = {};
    calculator.screenRec.node = "";
    calculator.screenRec.attr = {"class":"screen__rec"};
    calculator.screenRec.number = "";
    //calculator.screenRec.node.innerHTML = ""; //initial value on creating DOM
////////
    calculator.tableKeys = {};
    calculator.tableKeys.node = "";
    calculator.tableKeys.map = [
        [1, 2, 3, "+"],
        [4, 5, 6, "-"],
        [7, 8, 9, "x"],
        [".", 0, "=", "/"],
        ["C", "M+", "Back"]
    ];
    calculator.tableKeys.rowClass = "calc__row";
    calculator.tableKeys.tdDivClass = "calc__cell";
    calculator.tableKeys.dataCalc = ["plus", "minus", "multiply", "divide", "equal", "clear", "back", "rec"];
////////
    calculator.operand = ""; //active operand
    calculator.num1 = "";
    calculator.num2 = "";
    calculator.calcPushed = ""; //intermediate num1+=calcKey.innerHtml

    calculator.closeBttn = {};  //closing calculator
    calculator.closeBttn.node = "";
    calculator.closeBttn.attr = {"class": "close-bttn"};
    calculator.closeBttn.innerHTML = "X";

// METHODS ////////////////////////////////////

    calculator.createDom = function (object, tag) {
        var obj = object;

        if ("node" in obj) {
            //log("node" in obj);
            obj.node = document.createElement(tag);
            //log("created div: " + obj.node.localName);
            if ("attr" in obj) {
                for (elem in obj.attr) {
                    obj.node.setAttribute(elem, obj.attr[elem]);
                }
            }
            if ("innerHTML" in obj) {
                obj.node.innerHTML = obj.innerHTML;
            }
            if ("map" in obj) {
                for (var i = 0; i < obj.map.length; i++) {
                    var calcRow = obj.node.appendChild(document.createElement("tr"));
                    /*log(calcRow);*/
                    calcRow.className = obj.rowClass;
                    for (var s = 0; s < obj.map[i].length; s++) {
                        var calcTd = calcRow.appendChild(document.createElement("td"));
                        var calcTdDiv = calcTd.appendChild(document.createElement("div"));
                        calcTdDiv.className = obj.tdDivClass;
                        calcTdDiv.innerHTML = obj.map[i][s];
                        switch (calcTdDiv.innerHTML) {
                            case obj.map[0][3]: calcTdDiv.setAttribute("data-calc", obj.dataCalc[0]);
                                break;
                            case obj.map[1][3]: calcTdDiv.setAttribute("data-calc", obj.dataCalc[1]);
                                break;
                            case obj.map[2][3]: calcTdDiv.setAttribute("data-calc", obj.dataCalc[2]);
                                break;
                            case obj.map[3][3]: calcTdDiv.setAttribute("data-calc", obj.dataCalc[3]);
                                break;
                            case obj.map[3][2]: calcTd.setAttribute("rowspan", "2");
                                calcTdDiv.setAttribute("data-calc", obj.dataCalc[4]);
                                calcTdDiv.setAttribute("class", "calc__cell calc__key_eval");
                                break;
                            case obj.map[4][0]: calcTdDiv.setAttribute("data-calc", obj.dataCalc[5]);
                                calcTdDiv.setAttribute("class", "calc__cell calc__key_spec");
                                break;
                            case obj.map[4][2]: calcTdDiv.setAttribute("data-calc", obj.dataCalc[6]);
                                calcTdDiv.setAttribute("class", "calc__cell calc__key_spec");
                                break;
                            case obj.map[4][1]: calcTdDiv.setAttribute("data-calc", obj.dataCalc[7]);
                                calcTdDiv.setAttribute("class", "calc__cell calc__key_spec");
                                break;
                        }
                    }
                }
            }
        }
        else {
            alert("No 'node' in object");
        }
    };
//////////
    calculator.changeClass = function (node, class1, class2) {       //if "off" then "on"
        if (node.classList.contains(class1)) {
            node.classList.replace(class1, class2);
        }
        else if (node.classList.contains(class2)) {     //if "on" then "off"
            node.classList.replace(class2, class1);
        }
        else {
            node.classList.add(class2);  //if first opening (no "off" and "on") then "on"
        }
    };
//////////effect of blinking short circuit////////////////////
    ///!important in CSS elemClass to have little transition of an element
    ///as example: transition: background-color 3ms
    calculator.lightOn = function (node, cycle, elemClass) {
        function light() {
            node.classList.toggle(elemClass);  //cycles for blinking
            if (cycle > 0) {
                setTimeout(light, 2);
                cycle--;
            }
            if (cycle == null) {  //infinite auto blinking
                setTimeout(light, 2);
            }
        }
        light();
    };
///////////
    calculator.open = function () {
        calculator.createDom(calculator, "div");
        calculator.createDom(calculator.screenBlock, "div");
        calculator.node.appendChild(calculator.screenBlock.node);
        calculator.createDom(calculator.calcScreen, "input");
        calculator.screenBlock.node.appendChild(calculator.calcScreen.node);
        calculator.createDom(calculator.closeBttn, "div");
        calculator.node.appendChild(calculator.closeBttn.node);

        calculator.closeBttn.node.addEventListener("click", calculator.close);

        calculator.createDom(calculator.screenSpan, "span");
        calculator.screenBlock.node.appendChild(calculator.screenSpan.node);
        calculator.createDom(calculator.screenNum, "span");
        calculator.screenBlock.node.appendChild(calculator.screenNum.node);
        calculator.createDom(calculator.screenRec, "span");
        calculator.screenBlock.node.appendChild(calculator.screenRec.node);
        calculator.createDom(calculator.tableKeys, "table");
        calculator.node.appendChild(calculator.tableKeys.node);

        calculator.changeClass(calculator.node, "scaleDownZero", "scaleUpZero");
        document.body.appendChild(calculator.node);

        calculator.node.style.top = document.documentElement.clientHeight / 2 - calculator.node.offsetHeight / 2 + "px";
        calculator.node.style.left = document.documentElement.clientWidth / 2 - calculator.node.offsetWidth / 2 + "px";

//effect of electric short circuits on switching on the calculator
//just combination of CSS transition time and JS Timeouts :))
        calculator.lightOn(calculator.calcScreen.node, 200, calculator.screenClass);

//CALCULATOR KEY EVENT
        calculator.node.addEventListener("click", function (event) {
            var calcKey = event.target;
// OPERAND KEYS
            if (calcKey.hasAttribute("data-calc")) {
                if (calcKey.getAttribute("data-calc") === "equal") {
                    if (calculator.calcPushed !== "") {
                        calculator.num2 = +calculator.calcScreen.node.value;
                        calculator.operate();
                        calculator.clear("arg"); //arg for limited clearing
                    }
                }
                else if (calcKey.getAttribute("data-calc") === "clear") {
                    calculator.clear();
                }
                else if (calcKey.getAttribute("data-calc") === "back") {
                    if (calculator.screenNum.node.innerHTML !== "") {
                        if (calculator.calcPushed.length <= 1) {
                            calculator.calcScreen.node.setAttribute("value", calculator.screenNum.node.innerHTML);
                            calculator.screenNum.node.innerHTML = "";
                            calculator.calcPushed = "";
                            calculator.num1 = calculator.calcScreen.node.innerHTML;
                        }
                        else {
                            calculator.calcPushed = calculator.calcPushed.slice(0,-1);
                            calculator.calcScreen.node.setAttribute("value", calculator.calcPushed);
                        }
                    }
                    else {
                        if (calculator.operand !== "") {
                            calculator.operand = "";
                            calculator.screenSpan.node.innerHTML = "";
                        }
                        else {
                            calculator.calcScreen.node.setAttribute("value", calculator.calcScreen.node.value.slice(0,-1));
                        }
                    }
                }
                else if (calcKey.getAttribute("data-calc") === "rec") {
                    if (calculator.screenRec.number === "") {
                        calculator.screenRec.number = calculator.calcScreen.node.value;
                        calculator.screenRec.node.innerHTML = "M+";
                        log("rec value = " + calculator.screenRec.number);
                    }
                    else {
                        if (calculator.screenSpan.node.innerHTML !== "") {
                            calculator.calcPushed = calculator.screenRec.number;
                            calculator.screenNum.node.innerHTML = calculator.num1;
                            calculator.screenRec.number = "";
                            calculator.screenRec.node.innerHTML = "";
                            calculator.calcScreen.node.setAttribute("value", calculator.calcPushed);
                        }
                        else {
                            var temp = calculator.calcScreen.node.value;
                            temp += calculator.screenRec.number;
                            calculator.calcScreen.node.setAttribute("value", temp);
                            calculator.screenRec.number = "";
                            calculator.screenRec.node.innerHTML = "";
                        }
                    }
                }
                else if (calculator.operand !== "") {
                    if (calculator.operand === calcKey.getAttribute("data-calc")
                        && calculator.calcPushed === "") {
                        calculator.operate();
                        calculator.operand = "";
                        calculator.screenSpan.node.innerHTML = "";
                    }
                    if (calculator.calcPushed !== "") {
                        calculator.num2 = +calculator.calcPushed;
                        calculator.operate();
                        calculator.operand = calcKey.getAttribute("data-calc");
                        calculator.screenSpan.node.innerHTML = calcKey.innerHTML;
                        calculator.calcPushed = "";
                        calculator.num2 = "";
                        calculator.screenNum.node.innerHTML = "";
                    }
                }
                else { //if calculator.operand === ""
                    calculator.num1 = +calculator.calcScreen.node.value;
                    log("num1 = " + calculator.num1);
                    calculator.operand = calcKey.getAttribute("data-calc");
                    calculator.screenSpan.node.innerHTML = calcKey.innerHTML;
                }
            }
//NUMBER KEYS
            else if (calcKey.classList.contains(calculator.tdDivClass)) {
                if (calculator.operand !== "") {
                    calculator.calcPushed += calcKey.innerHTML;
                    //log("calcPushed = " + calculator.calcPushed);
                    calculator.screenNum.node.innerHTML = calculator.num1;
                    calculator.calcScreen.node.setAttribute("value", calculator.calcPushed);
                }
                else {
                    var tempNum = calculator.calcScreen.node.value;
                    if(tempNum.length < 18) {   //limiting number of digits
                        tempNum += calcKey.innerHTML;
                        calculator.calcScreen.node.setAttribute("value", tempNum);
                    }
                }
            }
        },true);

        calculator.node.onmousedown = function (point) {
            if (point.which !== 1) {
                return;
            }
            calculator.drag(point);
        };
    };

    calculator.drag = function (point) {
        calculator.node.style.transform = "none"; //switching off the popup effect

        if (point.target === calculator.closeBttn.node || point.target.classList.contains(calculator.tdDivClass)) {
            return false;   //restricting buttons from moving
        }

        var coords = getCoords(calculator.node);
        var shiftX = point.pageX - coords.left;
        var shiftY = point.pageY - coords.top;

        moveAt(point);

        document.onmousemove = function(point) {
            document.ondragstart = function () {
                return false;
            };
            moveAt(point);
        };

        calculator.node.onmouseup = function() {
            document.onmousemove = null;
            calculator.node.onmouseup = null;
        };

        function getCoords(elem) {      //getting object of coords
            var block = elem.getBoundingClientRect();
            return {
                top: block.top + pageYOffset,
                left: block.left + pageXOffset
            };
        }

        function moveAt(point) {
            var newLeft = point.pageX - shiftX;
            var newTop = point.pageY - shiftY;
            var newBottom = newTop + calculator.node.offsetHeight;
            var newRight = newLeft + calculator.node.offsetWidth;

            if (newLeft < 20) {
                newLeft = 20;
            }
            if (newRight > document.documentElement.clientWidth - 20) {
                newLeft = document.documentElement.clientWidth - 20 - calculator.node.offsetWidth;
            }
            if (newTop < 20) {
                newTop = 20;
            }

            /*var height = Math.max(document.body.scrollHeight, document.body.offsetHeight,
                document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);*/
            var height = document.documentElement.clientHeight; //limiting dragging in visible area

            if (newBottom > height - 20) {
                newTop = height - calculator.node.offsetHeight - 20;
            }

            calculator.node.style.left = newLeft + "px";
            calculator.node.style.top = newTop + "px";
        }
    };

//html calculator remove function/////////////////////////////////////////
    calculator.close = function () {
        calculator.changeClass(calculator.node, "scaleDownZero", "scaleUpZero");

        var remove = function () {
            if (!!calculator.node.parentNode) {
                calculator.node.parentNode.removeChild(calculator.node); //removing from DOM
                //calculator.node.remove();
            }
            calculator.node = ""; //resetting calculator.node to empty {}
        };

        setTimeout(remove, 400);
    };

//event on header icon to open calculator/////////////////////////////////
    calcIcon.addEventListener("click", function () {
        if (!calculator.node.parentNode && calculator.node === "") {
            calculator.open();
        }
        else {
            calculator.close();
        }
    }, true);

//calculator operand function/////////////////////
    calculator.operate = function () {
        let operators = {
            "plus": function() {
                if (calculator.num2 === "") {
                    calculator.num1 += calculator.num1;
                }
                else {
                    calculator.num1 += calculator.num2;
                }
            },
            "minus": function() {
                if (calculator.num2 === "") {
                    calculator.num1 -= calculator.num1;
                }
                else {
                    calculator.num1 -= calculator.num2;
                }
            },
            "divide": function () {
                if (calculator.num2 === "") {
                    calculator.num1 /= calculator.num1;
                }
                else {
                    calculator.num1 /= calculator.num2;
                }
            },
            "multiply": function () {
                if (calculator.num2 === "") {
                    calculator.num1 *= calculator.num1;
                }
                else {
                    calculator.num1 *= calculator.num2;
                }
            }
        };

        operators[calculator.operand]();

        /*switch (calculator.operand) {
            case "plus": {
                if (calculator.num2 === "") {
                    calculator.num1 += calculator.num1;
                }
                else {
                    calculator.num1 += calculator.num2;
                }
                break;
            }
            case "minus": {
                if (calculator.num2 === "") {
                    calculator.num1 -= calculator.num1;
                }
                else {
                    calculator.num1 -= calculator.num2;
                }
                break;
            }
            case "divide": {
                if (calculator.num2 === "") {
                    calculator.num1 /= calculator.num1;
                }
                else {
                    calculator.num1 /= calculator.num2;
                }
                break;
            }
            case "multiply": {
                if (calculator.num2 === "") {
                    calculator.num1 *= calculator.num1;
                }
                else {
                    calculator.num1 *= calculator.num2;
                }
                break;
            }
        }*/
        calculator.calcScreen.node.setAttribute("value", Math.round(calculator.num1 * 10000000)/10000000);
        calculator.num1 = calculator.calcScreen.node.value;
    };

//resetting all parameters

    calculator.clear = function (arg) {
        if (arg === undefined) {
            calculator.num1 = "";
            calculator.screenRec.node.innerHTML = "";
            calculator.screenRec.number = "";
            calculator.calcScreen.node.setAttribute("value", "");
        }
        calculator.operand = "";
        calculator.num2 = "";
        calculator.calcPushed = "";
        calculator.screenSpan.node.innerHTML = "";
        calculator.screenNum.node.innerHTML = "";
    }
})();