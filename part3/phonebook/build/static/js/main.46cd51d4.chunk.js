(this.webpackJsonpphonebook=this.webpackJsonpphonebook||[]).push([[0],{14:function(e,n,t){e.exports=t(37)},36:function(e,n,t){},37:function(e,n,t){"use strict";t.r(n);var a=t(0),r=t.n(a),o=t(13),c=t.n(o),u=t(2),i=function(e){return r.a.createElement("div",null,"filter shown with: ",r.a.createElement("input",{onChange:e.onChange}))},l=function(e){return r.a.createElement("form",{onSubmit:e.onSubmit},r.a.createElement("div",null,"name: ",r.a.createElement("input",{value:e.name,onChange:e.onChangeName})),r.a.createElement("div",null,"number: ",r.a.createElement("input",{value:e.number,onChange:e.onChangeNumber})),r.a.createElement("div",null,r.a.createElement("button",{type:"submit"},"add")))},m=function(e){var n=e.person,t=e.deletePerson;return r.a.createElement("div",null,n.name," ",n.number,r.a.createElement("button",{onClick:t},"delete"))},s=function(e){var n=e.persons,t=e.removePerson;return n.map((function(e){return r.a.createElement(m,{key:e.id,person:e,deletePerson:function(){return t(e.id)}})}))},f=t(3),d=t.n(f),b="/api/persons",h=function(){return d.a.get(b).then((function(e){return e.data}))},p=function(e){return d.a.post(b,e).then((function(e){return e.data}))},v=function(e){return d.a.delete("".concat(b,"/").concat(e)).then((function(e){return e.data}))},E=function(e,n){return d.a.put("".concat(b,"/").concat(e),n).then((function(e){return e.data}))},g=function(e){var n=e.success,t=e.error;return t?r.a.createElement("div",{className:"notification-error"},t):n?r.a.createElement("div",{className:"notification-success"},n):null};var j=function(){var e=Object(a.useState)([]),n=Object(u.a)(e,2),t=n[0],o=n[1],c=Object(a.useState)(""),m=Object(u.a)(c,2),f=m[0],d=m[1],b=Object(a.useState)(""),j=Object(u.a)(b,2),w=j[0],O=j[1],C=Object(a.useState)(""),S=Object(u.a)(C,2),k=S[0],y=S[1],N=Object(a.useState)(""),P=Object(u.a)(N,2),T=P[0],A=P[1],D=Object(a.useState)(""),I=Object(u.a)(D,2),J=I[0],L=I[1];Object(a.useEffect)((function(){h().then((function(e){o(e)}))}),[]);var x=t.filter((function(e){return e.name.toLowerCase().includes(k.toLowerCase())}));return r.a.createElement("div",null,r.a.createElement("h2",null,"Phonebook"),r.a.createElement(g,{success:T,error:J}),r.a.createElement(i,{onChange:function(e){y(e.target.value)}}),r.a.createElement("h3",null,"Add a new"),r.a.createElement(l,{onSubmit:function(e){e.preventDefault();var n=t.find((function(e){return e.name===f}));if(n){if(window.confirm("".concat(f," is already added to the phonebook, replace the old number with a new one?"))){var a={number:w},r=n.id;E(r,a).then((function(e){o(t.map((function(n){return n.id!==r?n:e}))),A("".concat(e.name,"'s number changed")),setTimeout((function(){A(null)}),5e3)})).catch((function(e){e.response.data.error?(console.error(e.response.data),L(e.response.data.error),setTimeout((function(){L(null)}),5e3)):(console.log(e),L("Information of ".concat(n.name," has already been removed from the server")),o(t.filter((function(e){return e.id!==r}))),setTimeout((function(){L(null)}),5e3))})).finally((function(){d(""),O("")}))}}else p({name:f,number:w}).then((function(e){o(t.concat(e)),A("Added ".concat(e.name)),setTimeout((function(){A(null)}),5e3)})).catch((function(e){console.error(e.response.data),L(e.response.data.error),setTimeout((function(){L(null)}),5e3)})).finally((function(){d(""),O("")}))},name:f,number:w,onChangeName:function(e){d(e.target.value)},onChangeNumber:function(e){O(e.target.value)}}),r.a.createElement("h3",null,"Numbers"),r.a.createElement(s,{persons:x,removePerson:function(e){var n=t.find((function(n){return n.id===e}));window.confirm("Delete ".concat(n.name,"?"))&&v(e).then((function(){o(t.filter((function(n){return n.id!==e})))}))}}))};t(36);c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(j,null)),document.getElementById("root"))}},[[14,1,2]]]);
//# sourceMappingURL=main.46cd51d4.chunk.js.map