//https://127.0.0.1:5000/app/widget.html
//variables
const inputSearch = document.getElementById("mySearch")
let user_id;
let quote_owner_name;
let quote_owner_id;
let quote_owner_email;
let subject;
let vat_amt;
let amt_paid;
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
let prospect_id;
let contact_id;
let terms_and_conditions;
let valid_till;
let new_valid_till;
let product_lists;
let services_covered = [];
let prospect_stage;
let clearance_for_db_c;
let clearance_for_processing;
let quote_id;

document.getElementById("clone_button_id").style.display = "none";
document.getElementById("close_button_id").style.display = "none";
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
         amt_paid = data.Amount_Paid
         crm_license_prod = data.CRM_License_Product
         crm_license_desc = data.CRM_License_Description
         crm_jurisdiction = data.CRM_Jurisdiction
         description_info = data.Description
         billing_street = data.Billing_Street
         billing_city = data.Billing_City
         billing_state = data.Billing_State
         billing_code = data.Billing_Code
         billing_country = data.Billing_Country
         terms_and_conditions = data.Terms_and_Conditions
         services_covered = data.Services_Covered;
         //2023-04-18
         valid_till  = new Date("en-US", { year:"numeric", month:"2-digit", day:"2-digit"});
         console.log("Valid Till: ")
         get_month = new Date().getMonth() + 1;
         console.log("Month");
         console.log(get_month)
         get_year  = new Date().getFullYear();
         get_day = new Date(get_year, get_month, 0).getDate();
         new_valid_till = get_year + "-" + get_month + "-" + get_day
      });

       //Get Product Details
         product_lists = {
            prod: []
         };
         quote_data.map( (prod_detail)=> {    
            console.log("Product Details");
            console.log(prod_detail.Product_Details)
            prod_detail.Product_Details.map( (item)=> {  
               console.log(item.product.id)
               product_lists.prod.push({ 
                  "product" : item.product.id,
                  "quantity"  : item.quantity,
               });
               console.log("Product Lists:")
               console.log(product_lists)
            });
            });
      });

  //Get Current User
  ZOHO.CRM.CONFIG.getCurrentUser()
  .then(function(data){
   console.log("Current User: ")
	console.log(data);
   const user_data = data.data
   user_data.map( (data)=> {
      console.log(data)
      user_id = data.id;
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
            account_id = data.Account_Name.id
            account_name = data.Account_Name.name
            contact_id = data.Contact_Name.id
            clearance_for_db_c = data.Clearance_for_Dashboard_Commission
            clearance_for_processing = data.Clearance_for_Processing
            prospect_stage = data.Stage
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
        data3 +=`<div class="container left">
        <div class="content">
        <h3>Error, no prospect found!</h3>
        </div>
        </div>`
        document.getElementById("timeline").innerHTML = data3
        document.getElementById("clone_button_id").style.display = "none";
        document.getElementById("close_button_id").style.display = "none";
        
     })
}

function clone_quote()
{
   let recordArray = [];
   recordObject = {"product": "3769920000155534022","quantity":1}
   recordArray.push(product_lists)
   if(prospect_stage === "Closed Won" || clearance_for_db_c === true || clearance_for_processing === true)
   {
      let alert_message = "";
      alert_message +=`<div class="container left">
      <div class="content">
      <h3 style="color: red;">The Prospect is already Closed-Won! Process is unsuccessful!</h3>
      </div>
      </div>`  
      document.getElementById("timeline").innerHTML = alert_message 
      document.getElementById("clone_button_id").style.display = "none";
      document.getElementById("close_button_id").style.display = "none";
   }
   else
   {

   //Update the Quote Assigned
   if(prospect_quote_assigned)
   {
      let update_prospect={
         Entity:"Deals",
         APIData:{
               "id": prospect_id,
               "Quote_Assigned": ""
         },
         Trigger:["workflow"]
       }
       ZOHO.CRM.API.updateRecord(update_prospect)
       .then(function(data){
           console.log(data)
           console.log("Quote Assigned: ")
           console.log(quote_id)
           console.log("Prospect ID")
           console.log(prospect_id)
      })
   }

   var recordData = {
      "Subject": subject,
      "Account_Name": account_id,
      "Deal_Name": prospect_id,
      "Owner": user_id,
      "Contact_Name": contact_id,
      "Quote_Stage": "Draft",
      "VAT_Amount": vat_amt,
      "Amount_Paid": amt_paid,
      "CRM_License_Product": crm_license_prod,
      "CRM_License_Description": crm_license_desc,
      "CRM_Jurisdiction": crm_jurisdiction,
      "Description": description_info,
      "Billing_Street": billing_street,
      "Billing_City": billing_city,
      "Billing_State": billing_state,
      "Billing_Code": billing_code,
      "Billing_Country": billing_country,
      "Terms_and_Conditions": terms_and_conditions,
      "Valid_Till": new_valid_till,
      "Services_Covered": services_covered,
      "Quote_Linked_to_Prospect": true,
      "Product_Details" : product_lists.prod
   }
   ZOHO.CRM.API.insertRecord({Entity:"Quotes",APIData:recordData,Trigger:["workflow"]})
   .then(function(data){
   const datas = data.data
   let data4 = "";
   datas.map( (data)=> {
   quote_id = data.details.id;
   let quote_url = "https://crm.zoho.com/crm/org682300086/tab/Quotes/" + quote_id;
   window.open(quote_url, '_blank').focus();
    data4 +=`<div class="container left">
    <div class="content">
    <h3>You successfully clone the quote!</h3>
    </div>
    </div>`
    });
    document.getElementById("timeline").innerHTML = data4
    document.getElementById("close_button_id").style.display = "block";
    document.getElementById("clone_button_id").style.display = "none";
   });
   }
}

function close_quote()
{
   ZOHO.CRM.UI.Popup.close()
   .then(function(data){
      console.log(data)
   })
}
