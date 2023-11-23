//https://127.0.0.1:5000/app/widget.html
//variables
const inputSearch = document.getElementById("mySearch")
// Get Entity Data from CRM (Note: this only works within Zoho CRM)
// ZOHO.embeddedApp.on("PageLoad", entity => {
//     // This is the information about the current record, if applicable.
//     let entity_id = entity.EntityId[0];
//     //Get Record
//     ZOHO.CRM.API.getRecord({
//     Entity: "Deals", approved: "both", RecordID:entity_id
//     })
 
  
// });

// Initialize Widget Connection
ZOHO.embeddedApp.init();
function search_prospect()
{
       //Get Search Prospects Records
       ZOHO.CRM.API.searchRecord({Entity:"Deals",Type:"word",Query:inputSearch.value,page:1,per_page:1})
       .then(function(data){
         const datas = data.data
         let data2 = "";
         datas.map( (data)=> {
            console.log(data)
            data2 +=`<div class="container left">
            <div class="content">
            <h3>Prospect Information</h3>
            <p><span class="label_name">Prospect Name:</span><span class="data_value"> ${data.Deal_Name}</span></p>
            <p><span class="label_name">Account Name:</span><span class="data_value"> ${data.Account_Name.name}</span></p>
            <p><span class="label_name">Contact Name:</span><span class="data_value"> ${data.Contact_Name.name}</span></p>
            </div>
            </div>`
         });
         document.getElementById("timeline").innerHTML = data2
        //  document.getElementById('clone_id').style.visibility = 'visible';
        
     }).catch(err=>{
        let data3 = "";
        console.log("error");
        console.log("error 2");
        data3 +=`<div class="container left">
        <div class="content">
        <h3>Error, no found!</h3>
        </div>
        </div>`
        document.getElementById("timeline").innerHTML = data3
        // document.getElementById('clone_id').style.visibility = 'hidden';
     })
}
