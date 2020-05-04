var budgetController = (function(){
    const Expense = function(id, description, value){
        this.id = id;
        this.descripiton = description;
        this.value = value;
    }

    const Income = function(id, descripiton, value){
        this.id = id;
        this.descripiton = descripiton;
        this.value = value;
    }

    const data = {
        allItems : {
            inc:[],
            exp:[]
        },
        total:{
            inc:0,
            exp:0
        },
        budget:0,
        percentage:-1
    }
    const addItem = function(type, descripiton, value){
        let newItem, ID;
        //create new ID
        ID = data.allItems[type].length;
        console.log();
        //create new Item based on inc or exp
        if(type===UIController.getDOMstring().type.income){
            newItem = new Income(ID, descripiton, value);
        }else if(type === UIController.getDOMstring().type.expense){
            newItem = new Expense(ID, descripiton, value);
        }
        //push it into our data structure
        data.allItems[type].push(newItem);
        //returning the new Item
        return newItem;
    }
    var deleteItem = function(type, id){
        var ids, index;
        ids = data.allItems[type].map(function(current){
            return current.id;
        });
        index = ids.indexOf(id);
        if(index>-1){
            data.allItems[type].splice(index,1);
        }
    }
    var calculateBudget = function(){
        calculateTotal('exp');
        calculateTotal('inc');

        data.budget = data.total.inc - data.total.exp;
        data.percentage = Math.round((data.total.exp/data.total.inc)*100);
    }
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach((element)=>{
            sum+=element.value;
        });
        data.total[type]=sum;
    }
    var getBudget = function(){
        return{
            budget:data.budget,
            totalIncome:data.total.inc,
            totalExpanse:data.total.exp,
            percentage:data.percentage
        }
    }
    return{
        addItem:addItem,
        data:data,
        calculateBudget:calculateBudget,
        getBudget:getBudget,
        deleteItem:deleteItem
    }

})();

var UIController = (function(){
    const DOMstrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        type:{
            income:'inc',
            expense:'exp'
        },
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list',
        budgetLabel:'.budget__value ',
        incomeLabel:'.budget__income--value',
        expanceLabel:'.budget__expenses--value',
        percentageLable:'.budget__expenses--percentage',
        container:'.container'


    }
    function getInput(){
        return{
            type: document.querySelector(DOMstrings.inputType).value,
            descripiton: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat( document.querySelector(DOMstrings.inputValue).value)
        }
    }

    var addListItem = function(obj, type){
        //create html string with the place holder
        var html, element;
        if(type===DOMstrings.type.income){
            element = DOMstrings.incomeContainer
            html = `<div class="item clearfix" id="inc-${obj.id}">
            <div class="item__description">${obj.descripiton}</div>
            <div class="right clearfix">
                <div class="item__value">${obj.value}</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`
        }else if (type ===DOMstrings.type.expense){
            element=DOMstrings.expenseContainer;
            html = ` <div class="item clearfix" id="exp-${obj.id}">
            <div class="item__description">${obj.descripiton}</div>
            <div class="right clearfix">
                <div class="item__value">${obj.value}</div>
                <div class="item__percentage">21%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`
        }
        var htmlObject = document.createElement('div');
        htmlObject.innerHTML=html;
        document.querySelector(element).insertAdjacentElement('beforeend', htmlObject);
    }
    var deleteListItem = function(selectorID){
        var element = document.getElementById(selectorID);
        element.parentNode.removeChild(element);
    }
    var clearField = function(){
        var fieldList, fieldArray;
        fieldList = document.querySelectorAll(DOMstrings.inputDescription+", "+DOMstrings.inputValue);
        fieldArray = Array.prototype.slice.call(fieldList);
        fieldArray.forEach(element => {
            element.value="";
        });
        fieldArray[0].focus();

    }
    function getDOMstring(){
        return DOMstrings;
    }

    var displayBudget = function(obj){
        document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
        document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncome;
        document.querySelector(DOMstrings.expanceLabel).textContent = obj.totalExpanse;
        document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage;
        if(obj.percentage >0 ){
            document.querySelector(DOMstrings.percentageLable).textContent = `${obj.percentage} %`;
        }else{
            document.querySelector(DOMstrings.percentageLable).textContent = `---`;
        }

    }
    return{
        getInput:getInput,
        getDOMstring:getDOMstring,
        addListItem:addListItem,
        clearField:clearField,
        displayBudget:displayBudget,
        deleteListItem:deleteListItem
    }
})();

//Global App Controller
var controller = (function(budgetCtrl, UICtrl){
    function setUpEventListner(){
        const DOM = UIController.getDOMstring();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener(`keypress`, function(event){
            if(event.keyCode === 13 || event.which === 13){
               ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    }
    var updateBudget = function(){
        budgetController.calculateBudget();
        var budget = budgetController.getBudget();
        UIController.displayBudget(budget);
    }
    function ctrlAddItem(){
        //Get the field input data
        var input = UIController.getInput();
        if (input.descripiton !== "" && !isNaN(input.value) && input.value>0){
             // Add the item to the budget controller
            var newItem = budgetController.addItem(input.type, input.descripiton, input.value);
            UIController.addListItem(newItem, input.type);
            UIController.clearField();
            updateBudget();
        }
      
    }
    var ctrlDeleteItem = function(event){
       // var itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        var parent = event.target.parentNode;
        var splitId, type, ID;
        while(parent.id===""){
            parent = parent.parentNode
        }
        if(parent.id){
            splitId = parent.id.split('-');
            type = splitId[0];
            ID=parseInt(splitId[1]);
        }

        budgetController.deleteItem(type, ID);
        UIController.deleteListItem(parent.id);        
    }
    return{
        init:function(){
            console.log("Aplication Started");
            UIController.displayBudget({
                budget:0,
                totalIncome:0,
                totalExpanse:0,
                percentage:0});
            setUpEventListner();
            
        }
    }
})(budgetController, UIController);

controller.init();