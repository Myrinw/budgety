/*
TO DO LIST

Add event listener
Get input values
Add the new item to data structure
Add the new item to the UI
Calculate budget
Updat UI 
*/



//Budget Controller
const budgetController = (function(){

    class Expense{
        constructor(id, description, value){
            this.id = id;
            this.description = description,
            this.value = value
        };
        
    }
    class Income{
        constructor(id, description, value){
            this.id = id;
            this.description = description,
            this.value = value
        };
    }

    const calculateTotal = function(type){
        let sum = 0;
        data.allItems[type].forEach(function(item){
            sum += item.value;
        })
        data.totals[type] = sum;
    }

 
    //Data structure
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        //Add new object to data structure
        addItem: function(type, desc, value ){
            let newItem, ID;

            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1
            }else{
                ID = 0;
            }

            //Create new object based on inc or exp type
            if(type === 'exp'){
                newItem = new Expense(ID, desc, value)
            }else if(type === 'inc'){
                newItem = new Income(ID, desc, value)

            }

            //Push it into data structure
            data.allItems[type].push(newItem)
            return newItem;
        },
        testing: function(){
            console.log(data);
        },
        calculateBudget: function(){
            // calculate the total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
             
            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp

            // calculate the percentage of income that we spent
            data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
        },
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
    }
})()

//UI controller
const UIController = (function(){
    var domStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeCont: '.income__list',
        expenseCont: '.expenses__list'
    }

    return{
         getInput: function() {
             return {
                 type: document.querySelector(domStrings.inputType).value, // value is inc or exp
                 description: document.querySelector(domStrings.inputDescription).value,
                 value: parseFloat(document.querySelector(domStrings.inputValue).value)
             }
         },
         getDOMstrings: function(){
             return domStrings
         },
         addListItem: function(obj, type){
             let html, element;
            console.log(type);
              if(type === 'inc'){
                element = domStrings.incomeCont;
                html = `
                <div class="item clearfix" id="income-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                            <div class="item__value">${obj.value}</div>
                                <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>
                `;

              } else if(type === 'exp'){
                    element = domStrings.expenseCont;
                    html = `
                    <div class="item clearfix" id="expense-${obj.id}">
                        <div class="item__description">${obj.description}</div>
                        <div class="right clearfix">
                            <div class="item__value">${obj.value}</div>
                            <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>
                    `;
                 console.log(html);
                }
                document.querySelector(element).insertAdjacentHTML('beforeend', html)
         },
         clearFields: function(){
             const fields = document.querySelectorAll(domStrings.inputDescription + ', ' + domStrings.inputValue);
             const fieldsArr = Array.prototype.slice.call(fields);
             fieldsArr.forEach(function(current, index){
                current.value = ""
             });
             fieldsArr[0].focus();
         }
    }
})();


//Global app controller
 controller = (function(budgetCtrl, UICtrl){

        const setupEvents = function(){
        const  dom =  UICtrl.getDOMstrings();

        document.querySelector(dom.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(e){
        if(e.keycode === 13 || event.which === 13){
            ctrlAddItem();
        }
        });
    }


    const updatebudget = function(){
        // 1. calculate the budget
        budgetCtrl.calculateBudget();
        // 2. return the budget
        const budget = budgetCtrl.getBudget();
        // 3. display buget on the UI
        console.log(budget);
    }


    const ctrlAddItem = function(){
        let input, newItem;

        // 1. get the field input data
         input = UICtrl.getInput();
         if(input.description !== "" &&  !isNaN(input.value) && input.value > 0){
            // 2. add the item to the budget controller
            newItem = budgetController.addItem(input.type, input.description, input.value);
                    
            // 3. add the item to the ui
                addList = UIController.addListItem(newItem, input.type)

            // 4. Clear the fields
                UICtrl.clearFields();

            // 5. calculate and update budget
                updatebudget();
         }else{
             alert('fields are empty')
         }
        
       
    }
 
    return{
        init: function() {
            console.log("initttts")
            setupEvents();
        }
    }

})(budgetController, UIController);

controller.init();