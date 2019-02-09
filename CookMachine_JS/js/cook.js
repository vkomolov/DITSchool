window.onload = function(){
    if (document.querySelector("#cooker")) {
        var Machine = {
            cooker: document.getElementById("cooker"),
            heading: this.cooker.querySelector(".heading"),
            screen: this.cooker.querySelector(".cooker-screen"),
            messageMain: this.cooker.querySelector(".message_main"),
            messageCalorie: this.cooker.querySelector(".message_detail.calorie"),
            messagePrice: this.cooker.querySelector(".message_detail.price"),
            buttonBlock: this.cooker.querySelector(".buttonBlock"),
            buttons: this.cooker.querySelectorAll(".button"),
            switchStatus: null,
            types: {  //CLASSIFICATOR of new Hamburger properties
                "big": "size",
                "small": "size",
                "cheese": "layer",
                "salad": "layer",
                "potato": "layer",
                "spice": "spice",
                "mayo": "mayo",
                "cook": "cook",
                "switch": "switch"
            },
            "hamburger": null
        };

        Machine.buttonBlock.addEventListener("click", function (event) {
            var target = event.target;
            var targetType = target.dataset.type; //type value in the attribute of button

            if (targetType) { //if target has datatype attribute
                init(Machine.types[targetType], targetType);
            }
            /**@description initializing the pushed buttons by their data-type attributes.
             * Events processing. New Hamburger initiating.
             * @param {type} Group of the properties (size, layer, spice, mayo, cook, switch). Each Group can be only one selected.
             * @param {targetType} Property of the event button data-type. Properties are comprised by Group
             * */
            function init(type, targetType) {
                if (targetType === "switch") {
                    if (!Machine.switchStatus) {
                        log("Machine is off. Switching on");
                        Machine.switchStatus = true;
                        Machine.screen.classList.toggle("light-on");
                        Machine.heading.classList.toggle("light-on");
                        Machine.buttons.forEach(function (el) {
                            el.classList.toggle("light-on");
                        });
                        setTimeout(function () {
                            Machine.messageMain.textContent = "Выбираем Начинку!";
                        }, 2000);
                        log("switched On");

                        Machine.hamburger = new Hamburger();
                    }
                    else {
                        Machine.switchStatus = null;
                        Machine.hamburger = null;
                        log("switched Off");
                        Machine.messageMain.textContent = "Добро Пожаловать!";
                        Machine.screen.classList.toggle("light-on");
                        Machine.heading.classList.toggle("light-on");
                        Machine.buttons.forEach(function (el) {
                            el.classList.toggle("light-on");
                        });
                    }
                }
                else if (targetType === "cook") {
                    if (Machine.hamburger.size !== null && Machine.hamburger.layer) {
                        log("cooking");
                        setTimeout(function () {
                            Machine.messageMain.textContent = "Приятного Аппетита!!!";
                        }, 500);
                        setTimeout(function () {
                            Machine.messageMain.textContent = "Добро Пожаловать!";
                            result("clear");    //clearing screen results
                            Machine.hamburger = null;
                            toggleClass(); //clearing all selected (without args)
                        }, 3000);
                        setTimeout(function () {
                            Machine.messageMain.textContent = "Выбираем Начинку!";
                            Machine.hamburger = new Hamburger();
                        }, 4000);
                    }
                    else {
                        Machine.messageMain.textContent = "А из чего готовить?!";
                        log("No ingredients selected");
                        setTimeout(function () {
                            Machine.messageMain.textContent = "Выбираем Начинку!";
                        }, 1000);
                    }
                }
                else {
                    if (Machine.switchStatus) { //if Machine is switched on

                        if (Machine.hamburger[type] === targetType) { //If already selected button
                            Machine.hamburger.backValues(type); //resetting to previous value
                            target.classList.toggle("selected");

                            result(); //getting values for the screen

                            log("resetting to previous values");
                            log("Total Colories: " + Machine.hamburger.getColorie());
                            log("Total Price: " + Machine.hamburger.getPrice());

                            Machine.hamburger[type] = null;
                            log("Hamburger State: ");
                            log(Machine.hamburger);
                        }
                        else {
                            toggleClass(type);  //re-switching light of selected button of the same type
                            Machine.hamburger.initValue(type, targetType); //writing or rewriting value
                            target.classList.toggle("selected");

                            result();   //getting values for the screen

                        }
                    }
                    else return log("Machine is off");
                }
            }

            /**@description Function toggles lighting of selected button with the same type group
             * @param {type} the group of buttons (size, layer, spice..)
             * */
            function toggleClass(type) {
                var selButtons = Machine.buttonBlock.querySelectorAll(".selected");
                if (arguments.length) {
                    selButtons.forEach(function (elem) {
                        if (Machine.types[elem.dataset.type] === type) {
                            elem.classList.toggle("selected");
                        }
                    });
                }
                else {
                    selButtons.forEach(function (elem) {
                        elem.classList.toggle("selected");
                    });
                }


            }

            /**@description Function //with args "clear": to clear values of Calorie and Price in the screen.
             * //with no args: to get the values of Calorie and Price for the screen
             * */
            function result(arg) {
                if (arguments[0] === "clear") {
                    Machine.messageCalorie.textContent = "Всего Калорий: ";
                    Machine.messagePrice.textContent = "Общая Цена: ";
                }
                else {
                    if (Machine.hamburger) {
                        Machine.messageCalorie.textContent = "Всего Калорий: ";
                        Machine.messagePrice.textContent = "Общая Цена: ";
                    }
                    if (Machine.hamburger.getColorie()) {
                        Machine.messageCalorie.textContent = "Всего Калорий: " + Machine.hamburger.getColorie();
                    }
                    if (Machine.hamburger.getPrice()) {
                        Machine.messagePrice.textContent = "Общая Цена: " + Machine.hamburger.getPrice();
                    }
                }
            }
        });

        /**@description Function Hamburger Constructor. It comprises static object 'Data', properties for Kids and
         * .prototype methods for use         *
         * */
        function Hamburger() {
            Hamburger.data = {
                "big": {
                    "calorie": 60,
                    "price": 100
                },
                "small": {
                    "calorie": 40,
                    "price": 50
                },
                "cheese": {
                    "calorie": 20,
                    "price": 10
                },
                "salad": {
                    "calorie": 5,
                    "price": 20
                },
                "potato": {
                    "calorie": 10,
                    "price": 15
                },
                "spice": {
                    "calorie": 0,
                    "price": 15
                },
                "mayo": {
                    "calorie": 5,
                    "price": 20
                }
            };
            this.size = null;
            this.layer = null;
            this.spice = null;
            this.mayo = null;
            this.calorie = 0;
            this.price = 0;

            ///////////////////PROTOTYPE METHODS/////////////////////

            /**@description Getter/Setter Function //if 2 arguments - if the object property is not null, to clear
             * the value and rewrite new property.
             * @param {type} the group of buttons (size, layer, spice..)
             * @param {targetType} the value of the event button type (potato, big ...)
             * @return if 1 argument - to return the value of the property 'type'
             * */
            Hamburger.prototype.initValue = function (type, targetType) {   //getter/setter 2-args and 1-args
                if (arguments.length > 1) {
                    if (this[type]) {    //if size already exists
                        log("type already selected");
                        log("Total Colories: " + Machine.hamburger.getColorie());
                        log("Total Price: " + Machine.hamburger.getPrice());
                        log("Hamburger State: ");
                        log(Machine.hamburger);

                        this.backValues(type);   //returning calorie and price values

                        log("returning previous Total Colorie and Total Price");
                        log("Total Colories: " + Machine.hamburger.getColorie());
                        log("Total Price: " + Machine.hamburger.getPrice());
                        log("Hamburger State: ");
                        log(Machine.hamburger);

                    }

                    this[type] = targetType;    //writing or rewriting values

                    if (Hamburger.data[this[type]]["calorie"] !== undefined &&
                        Hamburger.data[this[type]]["price"] !== undefined) { //null eats "0" of the property

                        this.addValues(type);   //adding values of selected type
                        log("adding values of selected type");
                        log("Total Colories: " + Machine.hamburger.getColorie());
                        log("Total Price: " + Machine.hamburger.getPrice());
                        log("Hamburger State: ");
                        log(Machine.hamburger);
                    }
                    else {
                        return alert("no such attributes in Hamburger.data");
                    }
                }
                else if (arguments.length) {
                    return this[type];  //getter returning type
                }
                else {
                    return alert("no arguments in .initValue()");
                }
            };

            /**@description Function to minus the values of Calorie and Price of unchecked button
             * @param {type} type of values (size, layer, spice, mayo...)
             * */
            Hamburger.prototype.backValues = function (type) {
                if (this.calorie !== 0) {
                    this.calorie -= Hamburger.data[this[type]]["calorie"]; //returning back calorie
                }
                else {
                    return alert("Calorie is empty or null");
                }

                if (this.price !== 0) {
                    this.price -= Hamburger.data[this[type]]["price"];     //returning back price
                }
                else {
                    return alert("Price is empty or null");
                }
            };

            /**@description Function to add the values of Calorie and Price of checked button
             * @param {type} type of values (size, layer, spice, mayo...)
             * */
            Hamburger.prototype.addValues = function (type) {
                this.calorie += Hamburger.data[this[type]]["calorie"]; //returning back calorie
                this.price += Hamburger.data[this[type]]["price"];     //returning back price
            };

            Hamburger.prototype.getColorie = function () {
                return this.calorie;
            };

            Hamburger.prototype.getPrice = function () {
                return this.price;
            };

            Hamburger.prototype.getSize = function () {
                return this.size;
            };

            Hamburger.prototype.getLayer = function () {
                return this.layer;
            };

            Hamburger.prototype.getSpice = function () {
                return this.spice;
            };

            Hamburger.prototype.getMayo = function () {
                return this.mayo;
            };
        }
    }
};

//////////////////SOME SUGAR/////////////////////
function log(item) {
    console.log(item);
}