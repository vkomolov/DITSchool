'use strict';
window.addEventListener("DOMContentLoaded", function () {

//////////////FUNCTIONS//////////////////
    function Generator(capacity) {
        this.capacity = capacity;
        this.totalProduced = 0;
    }
    Generator.prototype.runAsset = function () {
        this.totalProduced += this.capacity;
        return this.capacity;
    };

    function ElStation(capacity) {
        Generator.apply(this, arguments);
    }
    extendPrototype(ElStation, Generator);

    function SolarStation(capacity) {
        Generator.apply(this, arguments);
    }
    extendPrototype(SolarStation, Generator);
    SolarStation.prototype.runAsset = function (dayTime) {
        if (arguments.length) {
            if (dayTime === "day") {
                this.totalProduced += this.capacity;
                return this.capacity;
            }
            else {
                return 0;
            }
        }
        else {
            throw new Error("function 'produce' is asking the argument ('day', 'night'");
        }
    };

    function PowerLine(capacity) {
        this.capacity = capacity;
    }
    PowerLine.cost = 500; //cost for trading 1 megawatt., is made static out of the Constructor

    /**@param {obj} - 'energySystem', which processes the data
     * @description evaluates the cost of the energy supply in sales and purchases. It supplies by its capacity.
     * It calculates the rest of energy balance if the capacity of the line is lower than demand.
     * @return the total cost with 'minus', if buying energy and 'plus', if selling energy
     * **/
    PowerLine.prototype.supply = function (obj) {
        if ("energyBalance" in obj) {
            if (Math.abs(obj.energyBalance) >= this.capacity) {
                if (obj.energyBalance > 0) {
                    energySystem.sold += this.capacity;
                }
                if (obj.energyBalance < 0) {
                    energySystem.bought += this.capacity;
                }
                let totalCost = this.capacity * PowerLine.cost; //using all the capacity
                totalCost = (obj.energyBalance > 0) ? totalCost : totalCost * -1; //selling or buying
                let rest = Math.abs(obj.energyBalance) - this.capacity; //calculating the rest of energy in balance
                obj.energyBalance = (obj.energyBalance > 0) ? rest : rest * -1; //spare energy (+) or in need (-)
                return totalCost;
            }
            else {
                let totalCost = obj.energyBalance * PowerLine.cost; //all energyBalance with minus (need) or plus
                if (obj.energyBalance > 0) {
                    energySystem.sold += obj.energyBalance;
                }
                if (obj.energyBalance < 0) {
                    energySystem.bought += Math.abs(obj.energyBalance);
                }
                obj.energyBalance = 0; //no demand or spare energy
                return totalCost;
            }
        }
        else {
            throw new Error("no 'energyBalance' or 'budget' in given object");
        }
    };

    function House(capacity) {
        this.capacity = capacity;
        this.totalConsumed = 0;
    }
    House.consumpDay = 0.004; //megawatts for each flat in day
    House.consumpNight = 0.001; //megawatts for each flat in night

    House.prototype.runAsset = function (dayTime) {
        if (dayTime === "day") {
            let cons = this.capacity * House.consumpDay; //total consumption of the house
            this.totalConsumed += cons;
            return cons;
        }
        else {
            let cons = this.capacity * House.consumpNight;
            this.totalConsumed += cons;
            return cons;
        }
    };

/////////////////////WORKING AREA////////////////////////
    /**@param {elStation} Object with types of energy stations
     * @param {solarStation} Object with type of solar stations
     * @param {powerLine} Object with type of Power Line     *
     * @param {house} Object with type of houses
     * @param {dayTime} the time of day ('night', 'day')
     * @param {dayTimeTurn} the time of the maken result ('night', 'day')
     * @param {budget} the operative budget to pay for electricity, purchasing assets
     * @param {previousBudget} the operative budget on the previous period
     * @param {produced} the amount of produced energy in the current period
     * @param {consumed} the amount of consumed energy in the current period
     * @param {energyBalance} the bank of electricity in megawatts (will be supplied by Power Lines by capacity)
     * @param {saldo} Difference between produced and consumped energy in megawatts
     * @param {sold} Amount of sold energy in megawatts
     * @param {bought} Amount of bought energy in megawatts
     * @param {profit} amount of profit or losses from sales or purchase of the energy
     * @param {capacity} -  energy production capacity in megawatts
     * @param {price} - price for purchasing assets
     /*/
    const energySystem = {
        elStation: {
            big: {
                capacity: 1000,
                price: 5000000,
                array: []
            },
            middle: {
                capacity: 500,
                price: 3500000,
                array: []
            },
            small: {
                capacity: 100,
                price: 1000000,
                array: []
            },

        },
        solarStation: {
            big: {
                capacity: 50,
                price: 500000,
                array: []
            },
            middle: {
                capacity: 25,
                price: 250000,
                array: []
            },
            small: {
                capacity: 5,
                price: 170000,
                array: []
            }
        },
        powerLine: {
            big: {
                capacity: 100,
                price: 1600000,
                array: []
            },
            middle: {
                capacity: 50,
                price: 800000,
                array: []
            },
            small: {
                capacity: 5,
                price: 100000,
                array: []
            }
        },
    /**@param {capacity} - the quantity of flats in house*/
        house: {
            big: {
                capacity: 400,
                price: 700000,
                array: []
            },
            middle: {
                capacity: 200,
                price: 450000,
                array: []
            },
            small: {
                capacity: 50,
                price: 150000,
                array: []
            },
            smallest: {
                capacity: 1,
                price: 5000,
                array: []
            }
        },
        dayTime: "day",
        dayTimeTurn: "night",
        budget: 700000,
        previousBudget: 0,
        produced: 0,
        consumed: 0,
        energyBalance: 0,
        saldo: 0,
        sold: 0,
        bought: 0,
        profit: 0,

        initAsset: function(obj) {
            let res = 0;
            for (let asset in obj) {
                if (obj[asset].array.length) {
                    for (let i = 0; i < obj[asset].array.length; i++) {
                        res += obj[asset].array[i].runAsset(this.dayTime);
                    }
                }
            }
            return res;
        },
        initLines: function(obj, thisObj) {
            let totalCost = 0; //total cost for energy
            for (let line in obj) {
                if (obj[line].array.length) {
                    for (let i = 0; i < obj[line].array.length; i++) {
                        totalCost += obj[line].array[i].supply(thisObj);
                        //(cost > 0) ? this.profit += cost : this.losses += cost;
                    }
                }
            }
            return totalCost;
        },

        makeTurn: function () {
            if (this.budget < 0) {
                alert("Сушим весла с бюджетом: " + this.budget);
                return;
            }

            this.produced = 0; //resetting property
            this.produced += this.initAsset(this.elStation);
            this.produced += this.initAsset(this.solarStation);

            this.consumed = 0; //resetting property
            this.consumed += this.initAsset(this.house);

            this.saldo = 0;
            this.saldo = this.produced - this.consumed;

            this.previousBudget = this.budget;

            this.energyBalance += (this.produced - this.consumed);

            this.sold = 0; //will be changed in .initLines
            this.bought = 0; //will be changed in .initLines
            this.budget += this.initLines(this.powerLine, this);

            this.profit = 0;
            this.profit = this.budget - this.previousBudget;

            if (this.dayTime === "night") {
                this.dayTimeTurn = this.dayTime;
                this.dayTime = "day";
            }
            else {
                this.dayTimeTurn = this.dayTime;
                this.dayTime = "night";
            }
        },

        buy: function (strObj, strType) {
            if (this[strObj][strType]) {
                let chosen = this[strObj][strType];
                if (this.purchase(chosen)) {
                    let constr = this.selectConstr(strObj);
                    chosen.array.push(new constr(chosen.capacity));
                }
                else alert("no budget for this purchase: " + (this.budget - chosen.price));
            }
            else {
                throw new Error("Not correct in String");
            }
        },
        des: function (strObj, strType) {
            if (this[strObj][strType]) {
                let chosen = this[strObj][strType];
                if (chosen.array.length) {
                    chosen.array.pop();
                }
                else {
                    alert("Operation Cancelled: no Asset left: ");
                }
            }
            else {
                throw new Error("Not correct in String");
            }
        },

        selectConstr: function(strObj) {
            const constrArr = [ElStation, SolarStation, PowerLine, House];
            let strObject = strObj[0].toUpperCase() + strObj.slice(1);

            for (let i = 0; i < constrArr.length; i++) {
                if (constrArr[i].name === strObject) {
                    return constrArr[i];
                }
            }
        },

        purchase: function (obj) {
            if ("price" in obj) {
                if (obj.price <= this.budget) {
                    this.budget -= obj.price;
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                throw new Error("no 'price' in object");
            }
        }
    };

   function Plate() {
       this.plateNode = document.getElementById("plate");
       this.dayTime = this.plateNode.querySelector("h2[data-type=\"day-time\"]");
       this.dayTimeTurn = this.plateNode.querySelector("span[data-type=\"day-timeTurn\"]");
       this.domBalance = this.plateNode.querySelector("span[data-type=\"balance\"]");
       this.domBudget = this.plateNode.querySelector("span[data-type=\"budget\"]");
   }
       Plate.prototype.initPlate = function () {
           const self = this;
           refresh();
           this.plateNode.addEventListener("click", function (event) {
               let target = event.target || window.event.srcElement;
               if (target.dataset.button) {
                   let val = target.dataset.button.split("-");
                   if (val.length === 3) {
                       energySystem[val[0]](val[1], val[2]);
                       refresh();
                   }
                   else {
                       energySystem[val[0]]();
                       refresh();
                   }
               }
           });
           function refresh() {
               self.dayTime.textContent = energySystem.dayTime;
               self.dayTimeTurn.textContent = energySystem.dayTimeTurn;
               self.domBalance.textContent = energySystem.energyBalance.toFixed(2);
               self.domBudget.textContent = energySystem.budget.toFixed();
               let tdArr = self.plateNode.getElementsByTagName("td");

               for (let i = 0; i < tdArr.length; i++) {
                   if (tdArr[i].dataset.type) {
                       let dataArr = tdArr[i].dataset.type.split("-");
                       if (dataArr.length === 3) {
                           if (energySystem[dataArr[0]][dataArr[1]]) {
                               let chosen = energySystem[dataArr[0]][dataArr[1]];
                               if (dataArr[2] === "qnty") {
                                   tdArr[i].textContent = "" + chosen.array.length;
                               }
                               if (dataArr[2] === "capacity") {
                                   tdArr[i].textContent = "" + chosen.capacity * chosen.array.length;
                               }
                           }
                           else {
                               throw new Error("No object by dataset pars");
                           }
                       }
                       else if (dataArr.length === 2) {
                           if (energySystem.hasOwnProperty(dataArr[0])) {
                               let chosen = energySystem[dataArr[0]];
                               if (dataArr[1] === "qntyTotal") {
                                   let totalQnty = 0;
                                   for (let type in chosen) {
                                       if (chosen[type].array.length) {
                                           totalQnty += chosen[type].array.length;
                                       }
                                   }
                                   tdArr[i].textContent = "" + totalQnty;
                               }
                               if (dataArr[1] === "capacityTotal") {
                                   let totalCap = 0;
                                   for (let type in chosen) {
                                       if (chosen[type].array.length) {
                                           totalCap += chosen[type].capacity * chosen[type].array.length;
                                       }
                                   }
                                   tdArr[i].textContent = "" + totalCap;
                               }
                           }
                       }
                       else if (dataArr.length === 1) {
                           if (energySystem.hasOwnProperty(dataArr[0])) {
                               tdArr[i].textContent = energySystem[dataArr[0]].toFixed(2);
                           }
                           else throw new Error("no property by the dataset single par is found");
                       }
                       else throw new Error("not correct dataset");
                   }
               }
           }
       };

////////////INITIALIZATION//////////
    if (document.getElementById("plate")) {
        const plate = new Plate();
        plate.initPlate();
    }
    else {
        throw new Error ("No #plate in DOM");
    }
});


//////////////OPTION///////////////
function extendPrototype(kid, parent) {
    kid.prototype = Object.create(parent.prototype);
    kid.prototype.constructor = kid;
}

function log(item) {
    console.log(item);
}