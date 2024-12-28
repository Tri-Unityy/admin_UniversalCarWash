import{v as G,a1 as C,z as L,r as p,j as e,G as t,a2 as j,w as n,E as m,T as i,a3 as g,Q as R,a4 as v,a5 as M,a6 as w,a7 as $}from"./index-Tyujiqt7.js";import{G as H,F as q,c as T,a as b,I as O,d as Q,b as U,C as V,A as _,e as J,f as K}from"./AuthFooter-Bca7_KVc.js";import{B as d}from"./Button-Bchu_zVt.js";import{I as y,F as c}from"./InputLabel-prPKwxiZ.js";import{O as f}from"./OutlinedInput-BpFtoJ44.js";const N=({...a})=>{const s=G(),I=C(s.breakpoints.down("md")),k=L(r=>r.customization),[S,A]=p.useState(!0),F=async()=>{console.error("Login")},[l,B]=p.useState(!1),E=()=>{B(!l)},P=r=>{r.preventDefault()};return e.jsxs(e.Fragment,{children:[e.jsxs(t,{container:!0,direction:"column",justifyContent:"center",spacing:2,children:[e.jsx(t,{item:!0,xs:12,children:e.jsx(j,{children:e.jsxs(d,{disableElevation:!0,fullWidth:!0,onClick:F,size:"large",variant:"outlined",sx:{color:"grey.700",backgroundColor:s.palette.grey[50],borderColor:s.palette.grey[100]},children:[e.jsx(n,{sx:{mr:{xs:1,sm:2,width:20}},children:e.jsx("img",{src:H,alt:"google",width:16,height:16,style:{marginRight:I?8:16}})}),"Sign in with Google"]})})}),e.jsx(t,{item:!0,xs:12,children:e.jsxs(n,{sx:{alignItems:"center",display:"flex"},children:[e.jsx(m,{sx:{flexGrow:1},orientation:"horizontal"}),e.jsx(d,{variant:"outlined",sx:{cursor:"unset",m:2,py:.5,px:7,borderColor:`${s.palette.grey[100]} !important`,color:`${s.palette.grey[900]}!important`,fontWeight:500,borderRadius:`${k.borderRadius}px`},disableRipple:!0,disabled:!0,children:"OR"}),e.jsx(m,{sx:{flexGrow:1},orientation:"horizontal"})]})}),e.jsx(t,{item:!0,xs:12,container:!0,alignItems:"center",justifyContent:"center",children:e.jsx(n,{sx:{mb:2},children:e.jsx(i,{variant:"subtitle1",children:"Sign in with Email address"})})})]}),e.jsx(q,{initialValues:{email:"",password:"",submit:null},validationSchema:T().shape({email:b().email("Must be a valid email").max(255).required("Email is required"),password:b().max(255).required("Password is required")}),children:({errors:r,handleBlur:x,handleChange:u,handleSubmit:z,isSubmitting:D,touched:o,values:h})=>e.jsxs("form",{noValidate:!0,onSubmit:z,...a,children:[e.jsxs(g,{fullWidth:!0,error:!!(o.email&&r.email),sx:{...s.typography.customInput},children:[e.jsx(y,{htmlFor:"outlined-adornment-email-login",children:"Email Address / Username"}),e.jsx(f,{id:"outlined-adornment-email-login",type:"email",value:h.email,name:"email",onBlur:x,onChange:u,label:"Email Address / Username",inputProps:{}}),o.email&&r.email&&e.jsx(c,{error:!0,id:"standard-weight-helper-text-email-login",children:r.email})]}),e.jsxs(g,{fullWidth:!0,error:!!(o.password&&r.password),sx:{...s.typography.customInput},children:[e.jsx(y,{htmlFor:"outlined-adornment-password-login",children:"Password"}),e.jsx(f,{id:"outlined-adornment-password-login",type:l?"text":"password",value:h.password,name:"password",onBlur:x,onChange:u,endAdornment:e.jsx(O,{position:"end",children:e.jsx(R,{"aria-label":"toggle password visibility",onClick:E,onMouseDown:P,edge:"end",size:"large",children:l?e.jsx(Q,{}):e.jsx(U,{})})}),label:"Password",inputProps:{}}),o.password&&r.password&&e.jsx(c,{error:!0,id:"standard-weight-helper-text-password-login",children:r.password})]}),e.jsxs(v,{direction:"row",alignItems:"center",justifyContent:"space-between",spacing:1,children:[e.jsx(M,{control:e.jsx(V,{checked:S,onChange:W=>A(W.target.checked),name:"checked",color:"primary"}),label:"Remember me"}),e.jsx(i,{variant:"subtitle1",color:"secondary",sx:{textDecoration:"none",cursor:"pointer"},children:"Forgot Password?"})]}),r.submit&&e.jsx(n,{sx:{mt:3},children:e.jsx(c,{error:!0,children:r.submit})}),e.jsx(n,{sx:{mt:2},children:e.jsx(j,{children:e.jsx(d,{disableElevation:!0,disabled:D,fullWidth:!0,size:"large",type:"submit",variant:"contained",color:"secondary",children:"Sign in"})})})]})})]})},re=()=>{const a=C(s=>s.breakpoints.down("md"));return e.jsx(_,{children:e.jsxs(t,{container:!0,direction:"column",justifyContent:"flex-end",sx:{minHeight:"100vh"},children:[e.jsx(t,{item:!0,xs:12,children:e.jsx(t,{container:!0,justifyContent:"center",alignItems:"center",sx:{minHeight:"calc(100vh - 68px)"},children:e.jsx(t,{item:!0,sx:{m:{xs:1,sm:3},mb:0},children:e.jsx(J,{children:e.jsxs(t,{container:!0,spacing:2,alignItems:"center",justifyContent:"center",children:[e.jsx(t,{item:!0,sx:{mb:3},children:e.jsx(w,{to:"#","aria-label":"logo",children:e.jsx($,{})})}),e.jsx(t,{item:!0,xs:12,children:e.jsx(t,{container:!0,direction:{xs:"column-reverse",md:"row"},alignItems:"center",justifyContent:"center",children:e.jsx(t,{item:!0,children:e.jsxs(v,{alignItems:"center",justifyContent:"center",spacing:1,children:[e.jsx(i,{color:"secondary.main",gutterBottom:!0,variant:a?"h3":"h2",children:"Hi, Welcome Back"}),e.jsx(i,{variant:"caption",fontSize:"16px",textAlign:{xs:"center",md:"inherit"},children:"Enter your credentials to continue"})]})})})}),e.jsx(t,{item:!0,xs:12,children:e.jsx(N,{})}),e.jsx(t,{item:!0,xs:12,children:e.jsx(m,{})}),e.jsx(t,{item:!0,xs:12,children:e.jsx(t,{item:!0,container:!0,direction:"column",alignItems:"center",xs:12,children:e.jsx(i,{component:w,to:"/pages/register/register3",variant:"subtitle1",sx:{textDecoration:"none"},children:"Don't have an account?"})})})]})})})})}),e.jsx(t,{item:!0,xs:12,sx:{m:3,mt:1},children:e.jsx(K,{})})]})})};export{re as default};