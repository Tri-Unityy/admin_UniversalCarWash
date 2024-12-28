import{a0 as p,V as x,r as b,j as a,T as j,M as N,W as f,w as n}from"./index-Tyujiqt7.js";import{T as i}from"./TextField-Bxy1mvxY.js";import{B as m}from"./Button-Bchu_zVt.js";import"./InputLabel-prPKwxiZ.js";import"./Select-DRYG4zW_.js";import"./OutlinedInput-BpFtoJ44.js";const C=[{id:1,name:"John Doe",phoneNumber:"123-456-7890",date:"2024-09-01",timeSlot:"10:00 AM - 11:00 AM",status:"Confirmed",amount:150,services:["Wash","Polish"],vehicleType:"SUV",vehicleNumber:"ABC123"},{id:2,name:"Jane Smith",phoneNumber:"987-654-3210",date:"2024-09-02",timeSlot:"12:00 PM - 1:00 PM",status:"Pending",amount:200,services:["Oil Change","Tire Rotation"],vehicleType:"Sedan",vehicleNumber:"XYZ789"},{id:3,name:"Alice Johnson",phoneNumber:"555-555-5555",date:"2024-09-03",timeSlot:"2:00 PM - 3:00 PM",status:"Cancelled",amount:0,services:[],vehicleType:"Hatchback",vehicleNumber:"LMN456"},{id:4,name:"Bob Brown",phoneNumber:"444-444-4444",date:"2024-09-04",timeSlot:"4:00 PM - 5:00 PM",status:"Confirmed",amount:300,services:["Full Service","Wash"],vehicleType:"SUV",vehicleNumber:"QWE987"},{id:5,name:"Charlie Davis",phoneNumber:"333-333-3333",date:"2024-09-05",timeSlot:"9:00 AM - 10:00 AM",status:"Pending",amount:120,services:["Polish"],vehicleType:"Truck",vehicleNumber:"GHI321"},{id:6,name:"Emily Evans",phoneNumber:"222-222-2222",date:"2024-09-06",timeSlot:"3:00 PM - 4:00 PM",status:"Cancelled",amount:0,services:[],vehicleType:"Sedan",vehicleNumber:"JKL654"}],g=()=>{const{id:s}=p(),o=x(),e=C.find(r=>r.id===parseInt(s)),[t,u]=b.useState({name:(e==null?void 0:e.name)||"",phoneNumber:(e==null?void 0:e.phoneNumber)||"",date:(e==null?void 0:e.date)||"",timeSlot:(e==null?void 0:e.timeSlot)||"",vehicleType:(e==null?void 0:e.vehicleType)||"",vehicleNumber:(e==null?void 0:e.vehicleNumber)||"",amount:(e==null?void 0:e.amount)||0,discount:0,services:(e==null?void 0:e.services.join(", "))||""});if(!e)return a.jsx(j,{variant:"h5",children:"Booking not found"});const l=r=>{const{name:c,value:d}=r.target;u(v=>({...v,[c]:d}))},h=()=>{const r=t.amount-t.discount;alert(`Bill generated for booking ID: ${e.id}, Final Amount: $${r}`)};return a.jsx(N,{title:`Generate Bill for Booking ID: ${e.id}`,children:a.jsxs(f,{sx:{padding:3},children:[a.jsx(n,{mb:2,children:a.jsx(i,{fullWidth:!0,label:"Customer Name",name:"name",value:t.name,onChange:l})}),a.jsx(n,{mb:2,children:a.jsx(i,{fullWidth:!0,label:"Phone Number",name:"phoneNumber",value:t.phoneNumber,onChange:l})}),a.jsx(n,{mb:2,children:a.jsx(i,{fullWidth:!0,label:"Booking Date",name:"date",value:t.date,onChange:l})}),a.jsx(n,{mb:2,children:a.jsx(i,{fullWidth:!0,label:"Booking Time Slot",name:"timeSlot",value:t.timeSlot,onChange:l})}),a.jsx(n,{mb:2,children:a.jsx(i,{fullWidth:!0,label:"Vehicle Type",name:"vehicleType",value:t.vehicleType,onChange:l})}),a.jsx(n,{mb:2,children:a.jsx(i,{fullWidth:!0,label:"Vehicle Number",name:"vehicleNumber",value:t.vehicleNumber,onChange:l})}),a.jsx(n,{mb:2,children:a.jsx(i,{fullWidth:!0,label:"Amount",name:"amount",type:"number",value:t.amount,onChange:l})}),a.jsx(n,{mb:2,children:a.jsx(i,{fullWidth:!0,label:"Discount",name:"discount",type:"number",value:t.discount,onChange:l})}),a.jsx(n,{mb:2,children:a.jsx(i,{fullWidth:!0,label:"Services",name:"services",value:t.services,onChange:l,helperText:"Separate services with commas"})}),a.jsxs(n,{mt:3,children:[a.jsx(m,{variant:"contained",color:"primary",onClick:h,sx:{marginRight:2},children:"Generate Bill"}),a.jsx(m,{variant:"outlined",color:"secondary",onClick:()=>o(`/bookingDetails/${s}`),children:"Back to Booking Details"})]})]})})};export{g as default};