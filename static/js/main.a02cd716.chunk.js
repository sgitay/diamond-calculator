(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{159:function(e,t,a){e.exports=a(350)},348:function(e,t,a){},350:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(67),o=a.n(r),i=a(43),c=a(44),s=a(49),u=a(45),h=a(48),d=a(356),g=a(355),m=a(3),v=a(20),p=a(68),E=a(50),f=a.n(E),C=a(8),b=a.n(C),S=a(28),P=a.n(S),T=a(15),w=a.n(T),k=a(51),N=a.n(k),y=a(354),L=a(353),I=function(e){return l.a.createElement("header",null,l.a.createElement(y.a,null,l.a.createElement(y.a.Header,null,l.a.createElement(y.a.Brand,null,l.a.createElement(L.a,{to:"/"},"Diamond Calculator")))))},O=Object(p.default)({url:"https://scalr.api.appbase.io",app:"kwfl-rapnet-prices",credentials:"kg4GbKwx6:063eeb44-18e9-48c9-b5a0-4541d889597f"}),R=["FL","IF","VVS1","VVS2","VS1","VS2","SI1","SI2","SI3","I1","I2","I3"],F=function(e){function t(e){var a;return Object(i.a)(this,t),(a=Object(s.a)(this,Object(u.a)(t).call(this,e))).state={color:"",shape:"",clarity:"",hits:[],originalHits:[],userEnteredRelToList:0,userEnteredSellPc:"",userEnteredTotalPc:0,isLoading:!1,activeInputField:"",initialRendering:!0,userEnteredWeight:"",userVal:0,checkBoxStatus:!1,weightInclude:!1},a.handleColorDropdownChange=a.handleColorDropdownChange.bind(Object(m.a)(Object(m.a)(a))),a.handleClarityDropdownChange=a.handleClarityDropdownChange.bind(Object(m.a)(Object(m.a)(a))),a.handleShapeDropdownChange=a.handleShapeDropdownChange.bind(Object(m.a)(Object(m.a)(a))),a.changeRelToList=a.changeRelToList.bind(Object(m.a)(Object(m.a)(a))),a.clearAll=a.clearAll.bind(Object(m.a)(Object(m.a)(a))),a.totalPriceChange=a.totalPriceChange.bind(Object(m.a)(Object(m.a)(a))),a.sellPcChange=a.sellPcChange.bind(Object(m.a)(Object(m.a)(a))),a.handleWeightInputChange=a.handleWeightInputChange.bind(Object(m.a)(Object(m.a)(a))),a.handleCheckBoxStatusChange=a.handleCheckBoxStatusChange.bind(Object(m.a)(Object(m.a)(a))),a.handleWeightChange=a.handleWeightChange.bind(Object(m.a)(Object(m.a)(a))),a}return Object(h.a)(t,e),Object(c.a)(t,[{key:"handleColorDropdownChange",value:function(e){var t=this;this.setState({color:e},function(){t.getPrice()})}},{key:"handleClarityDropdownChange",value:function(e){var t=this;this.setState({clarity:e},function(){t.getPrice()})}},{key:"handleShapeDropdownChange",value:function(e){var t=this;this.setState({shape:e},function(){t.getPrice()})}},{key:"handleWeightInputChange",value:function(e){console.log("handleWeightInputChange",e.target.value),this.setState({userEnteredWeight:e.target.value,activeInputField:"WEIGHT"})}},{key:"clearAll",value:function(){console.log("clearAll"),this.setState({userEnteredWeight:"",userEnteredRelToList:0,userEnteredSellPc:0,userEnteredTotalPc:0,userVal:0,isLoading:!1,activeInputField:"",checkBoxStatus:!1,weightInclude:!1})}},{key:"mapOrder",value:function(e,t,a){return e.sort(function(e,n){var l=e[a],r=n[a];return t.indexOf(l)>t.indexOf(r)?1:-1}),e}},{key:"getPrice",value:function(){var e=this,t=this.state,a=t.color,n=t.shape,l=t.clarity;""!==a&&""!==n&&""!==l&&(this.setState({isLoading:!0}),O.search({type:"rapnetpricingtuestest2",body:{query:{bool:{must:[{bool:{must:[{term:{"shape.keyword":n}},{term:{"color.keyword":a}},{term:{"clarity.keyword":l}}]}}]}},size:1e3,_source:{includes:["*"],excludes:[]},from:0}}).then(function(t){console.log(t),e.setState({hits:t.hits.hits,originalHits:t.hits.hits,isLoading:!1,initialRendering:!1})}).catch(function(t){e.setState({isLoading:!1,initialRendering:!1})}))}},{key:"handleCheckBoxStatusChange",value:function(e){this.setState({checkBoxStatus:e.target.checked})}},{key:"handleWeightChange",value:function(e){this.setState({activeInputField:"WEIGHT",weightInclude:e.target.checked})}},{key:"changeRelToList",value:function(e){var t=e.target.value;P()(t)&&(t=0),this.setState({activeInputField:"REL_TO_LIST",userEnteredRelToList:t,userVal:e.target.value})}},{key:"totalPriceChange",value:function(e){console.log("e.target.value",e.target.value);var t=e.target.value;console.log("val1",t);var a=Number(t.replace(/[$,]+/g,""));console.log("value",a);var n=parseFloat(a);console.log("result",n),this.setState({activeInputField:"TOTAL_PRICE",userEnteredTotalPc:n})}},{key:"sellPcChange",value:function(e){console.log("e.target.value",e.target.value);var t=e.target.value;console.log("val1",t),"$"==t&&console.log("$ found");var a=Number(t.replace(/[$,]+/g,""));console.log("value",a);var n=parseFloat(a);console.log("result",n),this.setState({activeInputField:"SELL_PRICE",userEnteredSellPc:n})}},{key:"getListPrice",value:function(){var e=this.state,t=e.hits,a=e.userEnteredWeight;return t.length&&a?b()(t[0]._source.ppc,2):0}},{key:"getSPWhenRelToListActive",value:function(){var e=this.state,t=e.userEnteredRelToList,a=e.hits,n=0;if(!a.length)return n;if(""===t)return 0;var l=a[0]._source.ppc;return n=w()(l)+w()(l*(t/100)),b()(n,2)}},{key:"getTPWhenRelToListActive",value:function(){var e=this.state,t=e.hits,a=e.userEnteredWeight,n=e.userEnteredRelToList,l=0;if(!t.length)return l;if(""===n)return 0;var r=t[0]._source.ppc,o=w()(r)+w()(r*(n/100));return a>0&&(l=o*a),b()(l,2)}},{key:"getRelToListWhenSPActive",value:function(){var e=this.state,t=e.userEnteredSellPc,a=void 0===t?0:t,n=e.hits;console.log("userEnteredSellPc RelACtive",a);var l="";if(!n.length)return l;if(""===a)return 0;var r=n[0]._source.ppc;return l=(a-r)/r*100,console.log("getRelToListWhenSPActive",l),b()(l,2)}},{key:"getTPWhenSPActive",value:function(){var e=this.state,t=e.userEnteredSellPc,a=void 0===t?0:t,n=e.userEnteredWeight,l="";return e.hits.length?""===a?0:(console.log("userEnteredSellPc",a,"userEnteredWeight",n),l=a*n,console.log("totalPrice Tp Active",b()(l,2)),b()(l,2)):l}},{key:"getRelToListWhenTPActive",value:function(){var e=this.state,t=e.hits,a=e.userEnteredTotalPc,n=e.userEnteredWeight,l="";if(!t.length)return l;if(""===a)return 0;if(""===n)return 0;var r=t[0]._source.ppc;return l=(a/n-r)/r*100,b()(l,2)}},{key:"getSPWhenTPActive",value:function(){var e=this.state,t=e.userEnteredTotalPc,a=e.userEnteredWeight,n=e.hits,l=(n[0]&&n[0]._source.ppc,"");return n.length?(l=t/a,b()(l,2)):l}},{key:"convertPriceToCode",value:function(e){if(isNaN(e)||null===e||""===e||0===e)return"";for(var t=(e=Number(e)).toFixed(2).toString(),a="",n="",l=0;l<t.length;l++){var r=t.charAt(l);if("."===r)break;"1"===r?""!==n&&n.slice(-1)===r?(a+="X",n+=r):(a+="B",n+=r):"2"===r?""!==n&&n.slice(-1)===r?(a+="X",n+=r):(a+="I",n+=r):"3"===r?""!==n&&n.slice(-1)===r?(a+="X",n+=r):(a+="G",n+=r):"4"===r?""!==n&&n.slice(-1)===r?(a+="X",n+=r):(a+="E",n+=r):"5"===r?""!==n&&n.slice(-1)===r?(a+="X",n+=r):(a+="S",n+=r):"6"===r?""!==n&&n.slice(-1)===r?(a+="X",n+=r):(a+="T",n+=r):"7"===r?""!==n&&n.slice(-1)===r?(a+="X",n+=r):(a+="H",n+=r):"8"===r?""!==n&&n.slice(-1)===r?(a+="X",n+=r):(a+="A",n+=r):"9"===r?""!==n&&n.slice(-1)===r?(a+="X",n+=r):(a+="L",n+=r):"0"===r&&(""!==n&&n.slice(-1)===r?(a+="X",n+=r):(a+="F",n+=r))}return a}},{key:"render",value:function(){var e=this,t=this.state,a=t.isLoading,n=t.activeInputField,r=t.userEnteredRelToList,o=t.userEnteredTotalPc,i=t.userEnteredSellPc,c=t.userEnteredWeight,s=t.hits,u=t.initialRendering,h=t.checkBoxStatus,d=t.weightInclude,g=t.shape,m=t.color,p=t.clarity,E=t.userVal,f=this.getListPrice();console.log("render lp",f);var C="",S=0,T=f;console.log("weightInclude",d);var w=b()(f*c,2),k=c;switch(console.log("activeInputField",n),n){case"REL_TO_LIST":console.log("REL_TO_LIST"),console.log("REL_TO_LIST"),C=r,S=P()(C)?E:r,T=this.getSPWhenRelToListActive(),w=this.getTPWhenRelToListActive();break;case"SELL_PRICE":console.log("SELL_PRICE"),C=this.getRelToListWhenSPActive(),S=P()(C)?this.getRelToListWhenSPActive():E,w=this.getTPWhenSPActive(),T=i,console.log("userEnteredSellPc in case",i);break;case"TOTAL_PRICE":console.log("TOTAL_PRICE userEnteredTotalPc"),C=this.getRelToListWhenTPActive(),S=P()(C)?this.getRelToListWhenTPActive():E,w=o,T=this.getSPWhenTPActive()}var y="";return y=u||s.length||""===c?l.a.createElement("fieldset",{className:"form-fieldset"},l.a.createElement("legend",{className:"form-legend"},"Result:"),a&&l.a.createElement("div",{className:"App-Loader"},"Fetching results..."),l.a.createElement("div",{className:"outputSectionRow"},l.a.createElement("div",{className:"outputColumns xs-device-set-margin"},l.a.createElement("div",{className:"show-code-field"},l.a.createElement("label",{htmlFor:"ValueToCodeConvert",className:"conversion-label"},l.a.createElement("input",{type:"checkbox",className:"show-code-input",id:"ValueToCodeConvert",checked:h,onChange:this.handleCheckBoxStatusChange}),l.a.createElement("span",null,"Show Code")))),l.a.createElement("div",{className:"outputColumns xs-device-set-margin"},l.a.createElement("h2",{className:"form-control-label"},"List Price"),h?"":l.a.createElement(N.a,{disabled:!0,className:"form-control",value:f,options:{numeral:!0,prefix:"$"}}),h&&f?l.a.createElement("div",{className:"showCode"},this.convertPriceToCode(f)):null),l.a.createElement("div",{className:"outputColumns xs-device-set-margin"},l.a.createElement("h2",{className:"form-control-label"},"Sell Price"),h?"":l.a.createElement(N.a,{className:"form-control",value:T,options:{numeral:!0,prefix:"$"},onChange:this.sellPcChange}),h&&T?l.a.createElement("div",{className:"showCode"},this.convertPriceToCode(T)):null),l.a.createElement("div",{className:"outputColumns xs-device-set-margin"},l.a.createElement("h2",{className:"form-control-label"},"Total Price"),h?"":l.a.createElement(N.a,{className:"form-control",value:w,options:{numeral:!0,prefix:"$"},onChange:this.totalPriceChange}),h&&w?l.a.createElement("div",{className:"showCode"},this.convertPriceToCode(w)):null))):l.a.createElement("div",{className:"No-records"},"No record(s) available."),l.a.createElement("div",{className:"container"},l.a.createElement(I,null),l.a.createElement("form",{id:"result-all"},l.a.createElement(v.a,{app:"kwfl-rapnet-prices",credentials:"kg4GbKwx6:063eeb44-18e9-48c9-b5a0-4541d889597f",type:"rapnetpricingtuestest2"},l.a.createElement("div",{id:"input-area"},l.a.createElement("fieldset",{className:"form-fieldset"},l.a.createElement("legend",{className:"form-legend"},"FillUp Details:"),l.a.createElement("div",{className:"inputSectionRow"},l.a.createElement("div",{className:"inputColumns xs-device-set-margin"},l.a.createElement(v.c,{componentId:"shape",className:"reactive-form-control",dataField:"shape.keyword",title:"Shape",showCount:!1,onValueChange:this.handleShapeDropdownChange})),l.a.createElement("div",{className:"inputColumns xs-device-set-margin"},l.a.createElement(v.c,{componentId:"color",className:"reactive-form-control",dataField:"color.keyword",title:"Color",showCount:!1,onValueChange:this.handleColorDropdownChange})),l.a.createElement("div",{className:"inputColumns xs-device-set-margin"},l.a.createElement(v.c,{componentId:"clarity",className:"reactive-form-control",dataField:"clarity.keyword",title:"Clarity",showCount:!1,transformData:function(t){return e.mapOrder(t,R,"key")},onValueChange:this.handleClarityDropdownChange})),l.a.createElement("div",{className:"inputColumns"},l.a.createElement("h2",{className:"form-control-label"},"Weight"),l.a.createElement("input",{type:"number",className:"form-control",onChange:this.handleWeightInputChange,value:k}),l.a.createElement("label",{className:"include-weight checkbox-inline"},l.a.createElement("input",{type:"checkbox",checked:d,onChange:this.handleWeightChange}),"Use 10ct price list")),l.a.createElement("div",{className:"inputColumns xs-device-set-margin"},l.a.createElement("h2",{className:"form-control-label"},"Rel to List"),c&&m&&g&&p?l.a.createElement("input",{type:"number",className:"form-control",onChange:this.changeRelToList,value:S}):l.a.createElement("input",{type:"number",className:"form-control",onChange:this.changeRelToList,value:0,disabled:!0}))))),l.a.createElement("div",{id:"result-area"},y,l.a.createElement(v.b,{render:function(t){var a=t.clearAllLabel,n=t.clearValues;return l.a.createElement("button",{onClick:function(t){return function(t){t.preventDefault(),console.log("reset"),n(),e.clearAll()}(t)}},a)}})))))}}],[{key:"getDerivedStateFromProps",value:function(e,t){var a=t.userEnteredWeight,n=t.originalHits,l=t.color,r=t.clarity,o=t.shape,i=t.weightInclude;if(l&&o&&r&&a){var c=f()(n,function(e){return Number.parseFloat(e._source.fromweight)<=Number.parseFloat(a).toFixed(2)&&Number.parseFloat(a).toFixed(2)<=Number.parseFloat(e._source.toweight)});return a>=5&&(c.length=0),c.length||(i&&Number.parseFloat(a).toFixed(2)>=10?c=f()(n,function(e){return Number.parseFloat(e._source.fromweight).toFixed(2)>=10&&Number.parseFloat(e._source.toweight).toFixed(2)<=10.99}):Number.parseFloat(a).toFixed(2)>=5&&(c=f()(n,function(e){return Number.parseFloat(e._source.fromweight).toFixed(2)>=5&&Number.parseFloat(e._source.toweight).toFixed(2)<=5.99}))),{hits:c}}return null}}]),t}(n.Component),W=function(e){function t(){return Object(i.a)(this,t),Object(s.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return l.a.createElement(d.a,null,l.a.createElement(g.a,{exact:!0,path:"*",component:F}))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(346),a(348);o.a.render(l.a.createElement(W,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[159,2,1]]]);
//# sourceMappingURL=main.a02cd716.chunk.js.map