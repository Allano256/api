//The numbers indicate the order in which the setup happens.

//1.Create three constants
const API_KEY = "QiN5IVFWoI8s4YKIwvbM-HI0aHU";//OUR API key
const API_URL = "https://ci-jshint.herokuapp.com/api"; //We need this because we shall make calls to this api
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal")); //This helps us to toggle the modal in bootstrap 5.

//We need to wire up the buttons,have two more functions...one to fetch the data and the other to display it.

//Wireup button

document.getElementById("status").addEventListener("click", e => getStatus(e));

//The get getStatus needs to make a GET request to the API URL with the API KEY.
//Pass the data to a display function
//We use an asynchronous function
//https://ci-jshint.herokuapp.com/api?api_key=thisismykey Use this format in the function and replace with the constants,use back ticks.


//This is the code to wiresup our RUN CHECKS BUTTON

//5.
document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

//6. Get the javascript function from the JSHint API and create an async function.
//Form data interface,It captures all the fields in a HTML form and return it as an object.
/*
async function postForm(e){
 const form = new FormData(document.getElementById("checksform"));

//Add in await since its a fetch
 const response = await fetch("API_URL", {
                              method: "POST",
                              headers: {
                                       "Authorization": API_KEY,
                              },//We send the form data to the API BY using the form data object.
                              //This will make a POST request to the API,authorize it with the API key,and attach the form as the body of the request.
                              body: form,
    });
    // 7.Then we need to convert the form to json and display it.
    const data = await response.json();

    if(response.ok){
        console.log(data);
    } else {
        throw new Error(data.error);
    }
*/

//10.
function processOptions(form){
    //This will,1.Iterate through the options
    //Push each value into a temporary array
    //Convert the array back to a string

    let optArray = [];

    for(let entry of form.entries()){
        if (entry[0] === 'options'){
            optArray.push(entry[1]);
        }
    }
    form.delete("options");

    form.append("optioins", optArray.join());//We use the join method to convert it back to a string

    return form;

    //Here we get a comma separated list that our API needs
    //The data is meant to be sent in a comma based

}



async function postForm(e) {

    const form = processOptions (new FormData(document.getElementById("checksform")));
    
    //9. 
    /*for(let entry of form.entries()){
        console.log(entry);
    }*/ //We delete this after stage 10

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    });

    const data = await response.json();

    if (response.ok) {
        dissplayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }

}

//8. You need to format the results, we need to iterate through the errors here.
function dissplayErrors(data){
   
   let heading =`JSHint Results for ${data.file}`;

   if(data.total_errors === 0){
    results = `<div class= "no_errors">No errors reported!</div>`;
   } else {
     results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
     for(let error of data.error_list){
        results += `<div>At line <span class="line">${error.line}</span>,`;
        results += `column <span class="column">${error.col}</span> </div>`;
        results += `<div class="error">${error.error}</div>`;
     }
   }
 //Here we display the heading,content and modal.
   document.getElementById("resultsModalTitle").innerText = heading;//Gets iea of our results modal and sets its text to heading.
   document.getElementById("results-content").innerHTML = results;//Sets the content
   resultsModal.show();//Then we show the modal.
}

 //The entries method...that is if you want to comfirm that the form has captured correctly.
 /*for (let el of form.entries()){
   console.log(el); 
 }*/
 //Here we shall be able to log the data to the console but we need to be able to send it to the API with the FOR LOOP which wee delete and paste the javascript code from theJSHINT aAPI


 //2: 
    async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    //After we await our response
    const response = await fetch(queryString);
    //When the response comes back we need to convert it to Json which returns a promise aswell and we need to await that too.
    const data = await response.json();
    //Here there is a possiblity to get an error as the key could be expired,typed in the URL wrongly, or fault at the API end so lets put an if statement. If the result is 200 code then request was successful

    //#.3
    if (response.ok){
        displayStatus(data.expiry);//Display data in modal
    } else {
        displayException(data);
        throw new Error(data.error);//This is a built in error handler "throw new Error"
    }
}

 //4.
    function displayStatus(data){
    let heading = "API Key Status"; //Here you state how the display message shall be on the  modal window.
    let results = `<div>Your key is valid untill</div>`; //Use template literals to insert va new div
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading; 
    document.getElementById("results-content").innerHTML = results; 
  

    resultsModal.show()//To display the modal
}

//11. We need to provide an exception before we throw an error so it appears in the modal and browser aswell.
//This needs to display the 1.Status code, 2.error number , 3.and emphasize the missing item.

function displayException(data){

   let heading = `An exception occured`;

   //Build the modal body
   results = `<div>The API returned status code ${data.status_code}</div>`;
   results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
   results += `<div>Error text: <strong>${data.error}</strong></div>`;

   //Here we set the content on the DOM.
   
  document.getElementById("resultsModalTitle").innerText = heading;
  document.getElementById("results-content").innerText = results;

  resultsModal.show();
}
