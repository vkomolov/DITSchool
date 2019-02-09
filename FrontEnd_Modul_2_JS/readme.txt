DITS 5 Modul Work on Javascript
/////////////////////////////
Realisation:

- all realisation is incapsulated in one function .initMain()

- in order to obtain a universal approach to the event processing, EventListeners transmit only the event type and the target element: 

addEventListener("click", (ev) => {
        initEvents(ev.type, ev.target);
    });

The data is transferred to the object, which contains the dataset.type properties. By this attribute of the target element, the corresponding function is performed:

if (target.dataset.type in targetsObj) {
            targetsObj [target.dataset.type] (evType, target);
        }

This allows to manage the configuration of events and handlers in only one place in the code.

- In case of the need to rerun fetch, a universal function is created:

function fetchRates (callBackType, baseCurrency = "EUR", dateReady = curDateReady)

In this function, it is possible to register and access a specific callback after receiving the data from the server. Also, if necessary, it is possible to set additional arguments to the function.

- Upon receipt of data from the server information is stored in the local storage.
If a need to additional turn to the server, it is checking the availability of the data in the storage. 
If the data does not match the date of today's date, the server is fetched.
During operations related to the change of dates or currency, the server data is updated or the data of preliminary fetch is used.
