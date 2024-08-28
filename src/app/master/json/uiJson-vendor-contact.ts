export const vendorContactUiJson = 
[    
    {
      "label": "Id",
      "name": "Id",
      "value": "",
      "validationType": "alphanumericWithSpecialChar",
      "dropdownList": null,
      "isVisible": false,
      "readOnly": false
    },
    {
      "label": "Contact Type",
      "name": "ContactTypeId",
      "value": "",
      "validationType": "dropdown",
      "dropdownList": [
          {
              "id": "2",
              "name": "contact "
          },
          {
              "id": "1",
              "name": "escalation"
          }
      ],
      "isVisible": true,
      "readOnly": true,
      "isRequired": true
  },
    {
      "label": "Contact Name",
      "name": "ContactName",
      "value": "",
      "validationType": "alphanumericWithSpecialChar",
      "dropdownList": null,
      "isVisible": true,
      "readOnly": false
    },
    {
      "label": "Email",
      "name": "Email",
      "value": "",
      "validationType": "email",
      "dropdownList": null,
      "isVisible": true,
      "readOnly": false
    },
    {
      "label": "Country Code",
      "name": "CountryCode",
      "value": "",
      "validationType": "alphanumericWithSpecialChar",
      "dropdownList": null,
      "isVisible": true,
      "readOnly": false
    },
    {
      "label": "Mobile",
      "name": "Mobile",
      "value": "",
      "validationType": "number",
      "dropdownList": null,
      "isVisible": true,
      "readOnly": false
    },
    {
      "label": "Designation",
      "name": "Designation",
      "value": "",
      "validationType": "alphanumericWithSpecialChar",
      "dropdownList": null,
      "isVisible": true,
      "readOnly": false
    },
    {
      "label": "Domain Responsibility",
      "name": "DomainResponsibility",
      "value": "",
      "validationType": "alphanumericWithSpecialChar",
      "dropdownList": null,
      "isVisible": true,
      "readOnly": false
    },
    {
        "label": "Primary Contact",
        "name": "PrimaryContact",
        "value": "",
        "validationType": "radioButton",
        "radioOptions": [{id: true, name: 'Yes'}, {id: false, name: 'No'}],
        "dropdownList": null,
        "isVisible": true,
        "readOnly": false
    },
    {
      "label": "Status",
      "name": "Status",
      "value": "",
      "validationType": "radioButton",
      "radioOptions": [{id: true, name: 'Active'}, {id: false, name: 'Inactive'}],
      "dropdownList": null,
      "isVisible": true,
      "readOnly": false
    },
    {
      "label": "Note",
      "name": "Note",
      "value": "",
      "validationType": "alphanumericWithSpecialChar",
      "dropdownList": null,
      "isVisible": true,
      "readOnly": false
    },
    {
      "label": "Escalate Level",
      "name": "EscalateLevel",
      "value": "",
      "validationType": "dropdown",
      "dropdownList": [
        {
          "id": "770f3da2-4aa9-409b-b0c9-44b8ab2e99eb",
          "name": "Level 1"
        },
        {
          "id": "481d98b8-f59b-4aad-bbab-dc19a47a4a7c",
          "name": "Level 2"
        },
        {
          "id": "deade643-00da-4c85-87ed-63c7ae002c7d",
          "name": "Level 3"
        }
      ],
      "isVisible": true,
      "readOnly": false
    },

  ]





// export const vendorContactUiJson =  [
//   {
//       "label": "Contact Id",
//       "name": "Id",
//       "value": "",
//       "validationType": "alphanumericWithSpecialChar",
//       "dropdownList": null,
//       "isVisible": false,
//       "readOnly": false
//   },
//   {
//       "label": "Contact Name",
//       "name": "ContactName",
//       "value": "",
//       "validationType": "alphanumericWithSpecialChar",
//       "dropdownList": null,
//       "isVisible": true,
//       "readOnly": false
//   },
//   {
//       "label": "Email",
//       "name": "Email",
//       "value": "",
//       "validationType": "alphanumericWithSpecialChar",
//       "dropdownList": null,
//       "isVisible": true,
//       "readOnly": false
//   },
//   {
//       "label": "Mobile",
//       "name": "Mobile",
//       "value": "",
//       "validationType": "number",
//       "dropdownList": null,
//       "isVisible": true,
//       "readOnly": false
//   },
//   {
//       "label": "Designation",
//       "name": "Designation",
//       "value": "",
//       "validationType": "alphanumericWithSpecialChar",
//       "dropdownList": null,
//       "isVisible": true,
//       "readOnly": false
//   },
//   {
//       "label": "Domain Responsibility",
//       "name": "DomainResponsibility",
//       "value": "",
//       "validationType": "alphanumericWithSpecialChar",
//       "dropdownList": null,
//       "isVisible": true,
//       "readOnly": false,
//   },
//   {
//       "label": "Escalate Level",
//       "name": "EscalateLevel",
//       "value": "",
//       "validationType": "dropdown",
//       "dropdownList": [
//           {
//               "id": "1",
//               "name": "Level 1"
//           },
//           {
//               "id": "2",
//               "name": "Level 2"
//           },
//           {
//               "id": "3",
//               "name": "Level 3"
//           }
//       ],
//       "isVisible": true,
//       "readOnly": false
//   },
//   {
//       "label": "Primary Contact",
//       "name": "PrimaryContact",
//       "value": "",
//       "validationType": "radioButton",
//       "radioOptions": [{id: 1, name: 'Yes'}, {id: 0, name: 'No'}],
//       "dropdownList": null,
//       "isVisible": true,
//       "readOnly": false
//   },
//   // {
//   //     "label": "Status",
//   //     "name": "status",
//   //     "value": "",
//   //     "validationType": "radioButton",
//   //     "radioOptions": [{id: 1, name: 'Active'}, {id: 2, name: 'Inactive'}],
//   //     "dropdownList": null,
//   //     "isVisible": true,
//   //     "readOnly": false
//   // },
//   {
//       "label": "Notes",
//       "name": "Note",
//       "value": "",
//       "validationType": "textArea",
//       "dropdownList": null,
//       "isVisible": true,
//       "readOnly": false
//   },
//   {
//       "label": "Vendor ID",
//       "name": "VendorRegionVendorIDName",
//       "value": "",
//       "validationType": "alphanumericWithSpecialChar",
//       "dropdownList": null,
//       "isVisible": false,
//       "readOnly": false
//   }
// ];


// export const vendorContactUiJson = [
//     {
//       "label": "Contact Id",
//       "name": "Id",
//       "value": "",
//       "validationType": "alphanumericWithSpecialChar",
//       "dropdownList": null,
//       "isVisible": false
//     },
//     {
//       "label": "Contact Name",
//       "name": "ContactName",
//       "value": "",
//       "validationType": "alphanumericWithSpecialChar",
//       "dropdownList": null,
//       "isVisible": true
//     },
//     {
//       "label": "Email",
//       "name": "Email",
//       "value": "",
//       "validationType": "alphanumericWithSpecialChar",
//       "dropdownList": null,
//       "isVisible": true
//     },
//     {
//       "label": "Country Code",
//       "name": "CountryCode",
//       "value": "",
//       "validationType": "dropdown",
//       "dropdownList": [{
//         "id": 1,
//         "name": '+91'
//       },
//       {
//         "id": 2,
//         "name": "+01"
//       },
//       {
//         "id": 3,
//         "name": "+90"
//       }],

//       "isVisible": true
//     },
//     {
//         "label": "Mobile",
//         "name": "Mobile",
//         "value": "",
//         "validationType": "number",
//         "dropdownList": null,
//         "isVisible": true
//     },
//     {
//       "label": "Designation",
//       "name": "Designation",
//       "value": "",
//       "validationType": "alphanumericWithSpecialChar",
//       "dropdownList": null,
//       "isVisible": true
//     },
//     {
//         "label": "Status(*)",
//         "name": "Status",
//         "value": "",
//         "validationType": "radioButton",
//         "dropdownList": null,
//         "radioOptions": [{id: 1, name: 'Active'}, {id: 2, name: 'Inactive'}],
//         "isVisible": true
//     },
//     {
//         "label": "Notes",
//         "name": "Notes",
//         "value": "",
//         "validationType": "textArea",
//         "dropdownList": null,
//         "isVisible": true
//       },
//     {
//       "label": "Vendor ID",
//       "name": "VendorRegionVendorIDName",
//       "value": "",
//       "validationType": "alphanumericWithSpecialChar",
//       "dropdownList": null,
//       "isVisible": false
//     },
//     {
//         "label": "ID",
//         "name": "Id",
//         "value": "",
//         "validationType": "alphanumericWithSpecialChar",
//         "dropdownList": null,
//         "isVisible": false
//       },
  
//   ]
