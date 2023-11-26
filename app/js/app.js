//https://127.0.0.1:5000/app/widget.html
//variables
const inputSearch = document.getElementById("mySearch")
let user_id;
let quote_owner_name;
let quote_owner_id;
let quote_owner_email;
let subject;
let vat_amt;
let crm_license_prod;
let crm_license_desc;
let crm_jurisdiction;
let description_info;
let billing_street;
let billing_city;
let billing_state;
let billing_code;
let billing_country;
let prospect_quote_assigned;
let account_id;
let account_name;
let recordObject ;

//Prospects
let prospect_id;
 
document.getElementById("clone_button_id").style.display = "none";
// Get Entity Data from CRM (Note: this only works within Zoho CRM)
ZOHO.embeddedApp.on("PageLoad", entity => {
    // This is the information about the current record, if applicable.
    let entity_id = entity.EntityId[0];
    //Get Record
    ZOHO.CRM.API.getRecord({
    Entity: "Quotes", approved: "both", RecordID:entity_id
    })
    .then(function(data){
      const quote_data = data.data
      console.log(quote_data)
      quote_data.map( (data)=> {
         quote_owner_name = data.Owner.name
         quote_owner_id = data.Owner.id
         quote_owner_email = data.email
         subject = data.Subject
         vat_amt = data.VAT_Amount
         crm_license_prod = data.CRM_License_Product
         crm_license_desc = data.CRM_License_Description
         crm_jurisdiction = data.CRM_Jurisdiction
         description_info = data.Description
         billing_street = data.Billing_Street
         billing_city = data.Billing_City
         billing_state = data.Billing_State
         billing_code = data.Billing_Code
         billing_country = data.Billing_Country
      });
  });
  ZOHO.CRM.CONFIG.getCurrentUser()
  .then(function(data){
   console.log("Current User: ")
	console.log(data);
   const user_data = data.data
   user_data.map( (data)=> {
      console.log(data)
      prospect_id = data.id;
     
   });
});
});

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
            console.log("Prosepect Search")
            console.log(data)
            prospect_id = data.id;
            prospect_name = data.Deal_Name
            prospect_quote_assigned = data.Quote_Assigned
            account_id = data.Account_Name.id
            account_name = data.Account_Name.name
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
         document.getElementById("clone_button_id").style.display = "block";
        
     }).catch(err=>{
        let data3 = "";
        console.log("error");
        console.log("error 2");
        data3 +=`<div class="container left">
        <div class="content">
        <h3>Error, no prospect found!</h3>
        </div>
        </div>`
        document.getElementById("timeline").innerHTML = data3
        document.getElementById("clone_button_id").style.display = "none";
     })
}

function clone_quote()
{
   var today = new Date();
   var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);
   console.log("Quote Informations")
   console.log(quote_owner_name)
   console.log(quote_owner_id)
   console.log(quote_owner_email)
   console.log(subject)
   console.log("Prospect Informations")
   console.log(prospect_id)
   console.log(prospect_name)
   console.log(prospect_quote_assigned)
   let recordArray = [];
   recordObject = {"product": "3769920000155534022","quantity":1}
   recordArray.push(recordObject)

   if(prospect_quote_assigned)
   {
      alert("The prospect was assigned to different quote!");
      
   }
   else
   {
      var recordData = {
         "Subject": subject,
         "Account_Name": account_id,
         "Deal_Name": prospect_id,
         "Product_Details" : recordArray
   }
   ZOHO.CRM.API.insertRecord({Entity:"Quotes",APIData:recordData,Trigger:["workflow"]}).then(function(data){
   console.log("Quote Created!")
   alert("Successfully Created")
    console.log(data);
    });
   }
}

