import{j as e,S as o,r as n,B as t,G as r,g as s,a as i,T as c,R as l,E as d,b as a,c as u,u as h,P as x,d as g,L as k,t as p,F as f,e as b,f as P,h as j,D as m,i as L,k as R,M as E,l as T,m as C,n as I,o as y,C as N,p as v,q as O,s as S,v as _}from"./vendor-EBZhMCyQ.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver((e=>{for(const n of e)if("childList"===n.type)for(const e of n.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&o(e)})).observe(document,{childList:!0,subtree:!0})}function o(e){if(e.ep)return;e.ep=!0;const o=function(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?o.credentials="include":"anonymous"===e.crossOrigin?o.credentials="omit":o.credentials="same-origin",o}(e);fetch(e.href,o)}}();var w=(e=>(e[e.EOF=0]="EOF",e[e.SYMBOL=1]="SYMBOL",e[e.KEYWORD=2]="KEYWORD",e[e.WHITE_SPACE=3]="WHITE_SPACE",e[e.LEFT_PAREN=4]="LEFT_PAREN",e[e.RIGHT_PAREN=5]="RIGHT_PAREN",e[e.LEFT_CURLY=6]="LEFT_CURLY",e[e.RIGHT_CURLY=7]="RIGHT_CURLY",e[e.SEMICOLON=8]="SEMICOLON",e))(w||{});const F=["for","if","else","while","do"],Y={"{":6,"}":7,"(":4,")":5,";":8},A=e=>{const o={kind:0,text:"",lineNumber:e.lineNumber,charNumber:e.charNumber};if(e.cursorPos>=e.contentLength)return o;if(o.text=e.content[e.cursorPos],e.cursorPos++,e.charNumber++,/\s/.test(o.text))return o.kind=3,"\n"===o.text&&(e.lineNumber++,e.charNumber=1),o;if(o.text in Y)return o.kind=Y[o.text],o;for(;e.cursorPos<e.contentLength&&!(e.content[e.cursorPos]in Y)&&!/\s/.test(e.content[e.cursorPos]);)o.text+=e.content[e.cursorPos],e.cursorPos++,e.charNumber++;return F.includes(o.text)?(o.kind=2,o):(o.kind=1,o)};var U=(e=>(e[e.END=0]="END",e[e.ERROR=1]="ERROR",e[e.PROCESS=2]="PROCESS",e[e.LOOP_FIRST=3]="LOOP_FIRST",e[e.LOOP_LAST=4]="LOOP_LAST",e[e.IF_ELSE=5]="IF_ELSE",e[e.FUNCTION=6]="FUNCTION",e))(U||{});const G=e=>({tokens:e,tokenLength:e.length,cursorPos:0}),H=(e,o,n)=>{if(e.cursorPos>=e.tokenLength)return[];if(e.tokens[e.cursorPos].kind!==o)return[];e.cursorPos++;const t=[];let r,s=-1;for(;e.cursorPos<e.tokenLength&&(r=e.tokens[e.cursorPos],e.cursorPos++,t.push(r),r.kind===o&&s--,r.kind===n&&s++,0!==s););return t},B=e=>{if(!(e.cursorPos>=e.tokenLength)&&e.tokens[e.cursorPos].kind===w.WHITE_SPACE)for(;e.tokens[e.cursorPos].kind===w.WHITE_SPACE;)if(e.cursorPos++,e.cursorPos>=e.tokenLength)return},W=(e,o,n)=>{const{text:t,lineNumber:r,charNumber:s}=e;return{kind:1,reason:`Incomplete ${o} declaration. Missing a "${n}" token.`,context:t,caretOffset:t.length,lineNumber:r,charNumber:s}},$=(e,o,n,t)=>{const{text:r}=e,{text:s,lineNumber:i,charNumber:c}=o;return{kind:1,reason:`Unexpected token found in ${n} declaration. Expected a "${t}" token but found "${s}" instead.`,context:`${r} ${s}`,caretOffset:r.length+1,lineNumber:i,charNumber:c}},M=e=>{if(B(e),e.cursorPos>=e.tokenLength)return{kind:0};const o=e.tokens[e.cursorPos];if(e.cursorPos++,o.kind===w.KEYWORD)switch(o.text){case"for":case"while":return(e=>{const o={kind:3,body:[],condition:[]};let n=e.tokens[e.cursorPos-1];if(B(e),e.cursorPos>=e.tokenLength)return W(n,"test-first loop","(");if(e.tokens[e.cursorPos].kind!==w.LEFT_PAREN)return $(n,e.tokens[e.cursorPos],"test-first loop","(");if(n=e.tokens[e.cursorPos],o.condition=H(e,w.LEFT_PAREN,w.RIGHT_PAREN),o.condition.length>0&&(n=o.condition[o.condition.length-1]),0===o.condition.length||n.kind!==w.RIGHT_PAREN)return W(n,"test-first loop",")");if(o.condition.pop(),B(e),e.cursorPos>=e.tokenLength)return W(n,"test-first loop","{");if(e.tokens[e.cursorPos].kind!==w.LEFT_CURLY)return $(n,e.tokens[e.cursorPos],"test-first loop","{");n=e.tokens[e.cursorPos];const t=H(e,w.LEFT_CURLY,w.RIGHT_CURLY);return t.length>0&&(n=t[t.length-1]),0===t.length||n.kind!==w.RIGHT_CURLY?W(n,"test-first loop","}"):(t.pop(),o.body=D(G(t)),o)})(e);case"do":return(e=>{const o={kind:4,body:[],condition:[]};let n=e.tokens[e.cursorPos-1];if(B(e),e.cursorPos>=e.tokenLength)return W(n,"test-last loop","{");if(e.tokens[e.cursorPos].kind!==w.LEFT_CURLY)return $(n,e.tokens[e.cursorPos],"test-last loop","{");n=e.tokens[e.cursorPos];const t=H(e,w.LEFT_CURLY,w.RIGHT_CURLY);return t.length>0&&(n=t[t.length-1]),0===t.length||n.kind!==w.RIGHT_CURLY?W(n,"test-last loop","}"):(t.pop(),B(e),e.cursorPos>=e.tokenLength?W(n,"test-last loop","while"):e.tokens[e.cursorPos].kind!==w.KEYWORD||"while"!==e.tokens[e.cursorPos].text?$(n,e.tokens[e.cursorPos],"test-last loop","while"):(n=e.tokens[e.cursorPos],e.cursorPos++,B(e),e.cursorPos>=e.tokenLength?W(n,"test-last loop","("):e.tokens[e.cursorPos].kind!==w.LEFT_PAREN?$(n,e.tokens[e.cursorPos],"test-last loop","("):(n=e.tokens[e.cursorPos],o.condition=H(e,w.LEFT_PAREN,w.RIGHT_PAREN),o.condition.length>0&&(n=o.condition[o.condition.length-1]),0===o.condition.length||n.kind!==w.RIGHT_PAREN?W(n,"test-last loop",")"):(o.condition.pop(),B(e),e.cursorPos>=e.tokenLength?W(n,"test-last loop",";"):e.tokens[e.cursorPos].kind!==w.SEMICOLON?$(n,e.tokens[e.cursorPos],"test-last loop",";"):(e.cursorPos++,o.body=D(G(t)),o)))))})(e);case"if":return(e=>{const o={kind:5,condition:[],bodyIf:[],bodyElse:[]};let n=e.tokens[e.cursorPos-1];if(B(e),e.cursorPos>=e.tokenLength)return W(n,"branching block (if)","(");if(e.tokens[e.cursorPos].kind!==w.LEFT_PAREN)return $(n,e.tokens[e.cursorPos],"branching block (if)","(");if(n=e.tokens[e.cursorPos],o.condition=H(e,w.LEFT_PAREN,w.RIGHT_PAREN),o.condition.length>0&&(n=o.condition[o.condition.length-1]),0===o.condition.length||n.kind!==w.RIGHT_PAREN)return W(n,"branching block (if)",")");if(o.condition.pop(),B(e),e.cursorPos>=e.tokenLength)return W(n,"branching block (if)","{");if(e.tokens[e.cursorPos].kind!==w.LEFT_CURLY)return $(n,e.tokens[e.cursorPos],"branching block (if)","{");n=e.tokens[e.cursorPos];const t=H(e,w.LEFT_CURLY,w.RIGHT_CURLY);if(t.length>0&&(n=t[t.length-1]),0===t.length||n.kind!==w.RIGHT_CURLY)return W(n,"branching block (if)","}");if(t.pop(),o.bodyIf=D(G(t)),B(e),e.cursorPos>=e.tokenLength||e.tokens[e.cursorPos].kind!==w.KEYWORD||"else"!==e.tokens[e.cursorPos].text)return o;if(n=e.tokens[e.cursorPos],e.cursorPos++,B(e),e.cursorPos>=e.tokenLength)return W(n,"branching block (if-else)","{");if(e.tokens[e.cursorPos].kind!==w.LEFT_CURLY)return $(n,e.tokens[e.cursorPos],"branching block (if-else)","{");n=e.tokens[e.cursorPos];const r=H(e,w.LEFT_CURLY,w.RIGHT_CURLY);return r.length>0&&(n=r[r.length-1]),0===r.length||n.kind!==w.RIGHT_CURLY?W(n,"branching block (if-else)","}"):(r.pop(),o.bodyElse=D(G(r)),o)})(e)}const n=[o];let t=o;if(t.kind===w.SEMICOLON)return{kind:2,body:[]};for(;e.cursorPos<e.tokenLength&&e.tokens[e.cursorPos].kind!==w.SEMICOLON&&e.tokens[e.cursorPos].kind!==w.LEFT_CURLY;)t=e.tokens[e.cursorPos],n.push(e.tokens[e.cursorPos]),e.cursorPos++;if(e.cursorPos>=e.tokenLength||e.tokens[e.cursorPos].kind!==w.LEFT_CURLY&&e.tokens[e.cursorPos].kind!==w.SEMICOLON)return W(t,"process",";");if(e.tokens[e.cursorPos].kind===w.SEMICOLON)return e.cursorPos++,{kind:2,body:n};t=e.tokens[e.cursorPos];const r=H(e,w.LEFT_CURLY,w.RIGHT_CURLY);return r.length>0&&(t=r[r.length-1]),0===r.length||t.kind!==w.RIGHT_CURLY?W(t,"function","}"):(r.pop(),{kind:6,declaration:n,body:D(G(r))})},D=e=>{const o=[];let n;for(;0!==(n=M(e)).kind&&(o.push(n),1!==n.kind););return o},z=n=>{const{sx:t}=n;return e.jsx(o,{sx:{position:"absolute",width:"100%",height:"100%",...t},children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",preserveAspectRatio:"none",fill:"none",viewBox:"0 0 5 5",strokeWidth:"0.1",children:e.jsx("line",{x1:"0",y1:"0",x2:"5",y2:"5",stroke:"currentColor",strokeLinecap:"round"})})})},K=n=>{const{sx:t}=n;return e.jsx(o,{sx:{position:"absolute",width:"100%",height:"100%",...t},children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",preserveAspectRatio:"none",fill:"none",viewBox:"0 0 5 5",strokeWidth:"0.1",children:e.jsx("line",{x1:"0",y1:"5",x2:"5",y2:"0",stroke:"currentColor",strokeLinecap:"round"})})})},V=o=>{const{children:n,borderTop:r,borderBottom:s,borderLeft:i,borderRight:c}=o;return e.jsx(t,{sx:{borderStyle:"solid",borderLeftWidth:i?2:0,borderTopWidth:r?2:0,borderBottomWidth:s?2:0,borderRightWidth:c?2:0},children:n})},q=o=>{const{children:n,...t}=o;return e.jsx(c,{padding:1.5,...t,sx:{fontFamily:"Fira Code",wordBreak:"break-word",fontVariantLigatures:"contextual",...t.sx},children:n??"-"})},J=o=>{const{bodyTokens:n,...t}=o;let r;return void 0!==n&&(r=n.map((e=>e.text)).join("").trim(),0===r.length&&(r=void 0)),e.jsx(V,{...t,children:e.jsx(q,{children:r})})},X=o=>{const{conditionTokens:n,body:r,...s}=o;let i;void 0!==n&&n.length>0&&(i=n.map((e=>e.text)).join("").trim());let c=e.jsx(J,{borderTop:!0,borderLeft:!0});return r.length>0&&(c=r.map(((o,n)=>e.jsx(ne,{borderTop:!0,borderLeft:!0,node:o},`subnode-${n}`)))),e.jsxs(V,{...s,children:[e.jsx(q,{children:i}),e.jsx(t,{paddingLeft:2,children:c})]})},Q=o=>{const{conditionTokens:n,body:r,...s}=o;let i;void 0!==n&&n.length>0&&(i=n.map((e=>e.text)).join("").trim());let c=e.jsx(J,{borderBottom:!0,borderLeft:!0});return r.length>0&&(c=r.map(((o,n)=>e.jsx(ne,{node:o,borderBottom:!0,borderLeft:!0},`subnode-${n}`)))),e.jsxs(V,{...s,children:[e.jsx(t,{paddingLeft:2,children:c}),e.jsx(q,{children:i})]})},Z=o=>{const{conditionTokens:n,bodyIf:c,bodyElse:l,...d}=o;let a;void 0!==n&&n.length>0&&(a=n.map((e=>e.text)).join("").trim());let u=e.jsx(J,{borderTop:!0});c.length>0&&(u=c.map(((o,n)=>e.jsx(ne,{borderTop:!0,node:o},`index-${n}`))));let h=e.jsx(J,{borderTop:!0});return l.length>0&&(h=l.map(((o,n)=>e.jsx(ne,{borderTop:!0,node:o},`index-${n}`)))),e.jsx(V,{...d,children:e.jsxs(r,{container:!0,height:"100%",children:[e.jsx(r,{item:!0,xs:12,children:e.jsx(q,{align:"center",children:a})}),e.jsx(r,{item:!0,xs:6,children:e.jsxs(t,{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",children:[e.jsx(q,{sx:{zIndex:2,backgroundColor:s[300]},children:"True"}),e.jsx(z,{htmlColor:"black"})]})}),e.jsx(r,{item:!0,xs:6,children:e.jsxs(t,{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",children:[e.jsx(K,{}),e.jsx(q,{sx:{zIndex:2,backgroundColor:s[300]},children:"False"})]})}),e.jsx(r,{item:!0,xs:6,children:e.jsx(i,{height:"100%",sx:{borderColor:"inherit",borderRightStyle:"solid",borderRightWidth:2},children:u})}),e.jsx(r,{item:!0,xs:6,children:e.jsx(i,{height:"100%",children:h})})]})})},ee=o=>{const{declarationTokens:n,body:r,...s}=o;let i;void 0!==n&&n.length>0&&(i=n.map((e=>e.text)).join("").trim());let c=e.jsx(J,{borderTop:!0,borderLeft:!0,borderRight:!0});return r.length>0&&(c=r.map(((o,n)=>e.jsx(ne,{node:o,borderTop:!0,borderLeft:!0,borderRight:!0},`subnode-${n}`)))),e.jsxs(V,{...s,children:[e.jsx(q,{align:"center",children:i}),e.jsx(t,{paddingX:2,children:c})]})},oe=o=>{const{context:n,reason:t,lineNumber:r,charNumber:s,caretOffset:i,...c}=o,l=`At line ${r}, character ${s}: ${t}`,d="~".repeat(i)+"^";return e.jsxs(V,{...c,children:[e.jsx(q,{children:l}),e.jsx(q,{paddingY:0,children:n}),e.jsx(q,{paddingY:0,children:d})]})},ne=o=>{const{node:t,...r}=o;switch(t.kind){case U.ERROR:return e.jsx(oe,{...r,caretOffset:t.caretOffset,context:t.context,reason:t.reason,lineNumber:t.lineNumber,charNumber:t.charNumber});case U.FUNCTION:return e.jsx(ee,{declarationTokens:t.declaration,body:t.body,...r});case U.LOOP_FIRST:return e.jsx(X,{...r,conditionTokens:t.condition,body:t.body});case U.LOOP_LAST:return e.jsx(Q,{...r,conditionTokens:t.condition,body:t.body});case U.IF_ELSE:return e.jsx(Z,{...r,conditionTokens:t.condition,bodyIf:t.bodyIf,bodyElse:t.bodyElse});case U.PROCESS:return e.jsx(J,{...r,bodyTokens:t.body})}return e.jsx(n.Fragment,{})},te=o=>{const{nodes:n,id:r,boxProps:i}=o;let l=e.jsx(c,{fontFamily:"Fira Code",fontStyle:"italic",children:"Nothing to display."});return n.length>0&&(l=n.map(((o,t)=>e.jsx(ne,{node:o,borderLeft:!0,borderTop:!0,borderRight:!0,borderBottom:t===n.length-1},`top-level-node-${t}`)))),e.jsx(t,{sx:{...i,backgroundColor:s[300],borderColor:s[700],height:"100%"},children:e.jsx(t,{id:r,sx:{maxWidth:"640px",backgroundColor:s[300],borderColor:s[700]},children:l})})},re=o=>{const{value:n,onValueChange:t}=o;return e.jsx(l,{value:n,onChange:t,theme:"dark",extensions:[d.lineWrapping]})},se=o=>{const{collapsed:n,...t}=o;return n?e.jsx(a,{title:t.children,children:e.jsxs(u,{...t,startIcon:void 0,endIcon:void 0,children:[t.startIcon,t.endIcon]})}):e.jsx(u,{...t,startIcon:t.startIcon,endIcon:t.endIcon,children:t.children})},ie=o=>{const{slotAppBar:s,slotPanelLeft:c,slotPanelRight:l}=o,d=n.useRef(null),[a,p]=n.useState(0),[f,b]=n.useState((e=>{const o=new URL(e).searchParams.get("preview");return null!==o&&"true"===o})(window.location.href)),P=h((e=>e.breakpoints.down("md")));return n.useEffect((()=>{null!==d.current&&p(d.current.getBoundingClientRect().height)}),[d]),e.jsxs(t,{children:[e.jsx(x,{ref:d,square:!0,elevation:0,sx:{padding:1},children:e.jsxs(i,{display:"flex",direction:"row",justifyContent:"space-between",children:[e.jsxs(g,{variant:"outlined",children:[e.jsx(u,{onClick:()=>{b((e=>!e))},children:f?"Show code":"Hide code"})," ",e.jsx(u,{href:"https://eurydia.github.io/project-nassi-shneiderman-diagram-builder-online-docs/",component:"a",target:"_blank",endIcon:e.jsx(k,{}),children:"docs"})]}),s]})}),e.jsx(t,{children:e.jsxs(r,{container:!0,children:[e.jsx(r,{item:!0,xs:12,lg:6,display:f?"none":void 0,children:e.jsx(t,{overflow:"auto",height:`calc(100vh - ${a}px)`,children:c})}),e.jsx(r,{item:!0,xs:!0,lg:!0,display:P&&!f?"none":void 0,children:e.jsx(t,{overflow:"auto",height:`calc(100vh - ${a}px)`,children:l})})]})})]})},ce=()=>{const{enqueueSnackbar:o}=j(),{exportJPEG:t,exportPNG:r,exportSVG:s}=(i="structogram-preview-region",{exportSVG:async()=>{const e=document.getElementById(i);return null!==e&&p(e).then((e=>null!==e&&(f.saveAs(e,"structogram"),!0)))},exportJPEG:async()=>{const e=document.getElementById(i);return null!==e&&P(e).then((e=>null!==e&&(f.saveAs(e,"structogram"),!0)))},exportPNG:async()=>{const e=document.getElementById(i);return null!==e&&b(e).then((e=>null!==e&&(f.saveAs(e,"structogram"),!0)))}});var i;const{editorContent:c,setEditorContent:l}=((e,o)=>{const[t,r]=n.useState((()=>{const n=new URL(e).searchParams.get("content");if(null!==n)return window.localStorage.setItem(o,n),n;const t=window.localStorage.getItem(o);return null!==t?t:""}));return{editorContent:t,setEditorContent:e=>{r(e),window.localStorage.setItem(o,e)}}})(window.location.href,"autosaveContent"),d=h((e=>e.breakpoints.down("md"))),[a,u]=n.useState([]),[k,y]=n.useState(null);n.useEffect((()=>{const e=(e=>{const o=[];let n;for(;0!==(n=A(e)).kind;)o.push(n);return o})((e=>{const o=(e=>{let o="",n=0;for(;n<e.length;){if(n+1<e.length&&"/"===e[n]&&"/"===e[n+1])for(;n<e.length&&"\n"!==e[n];)n++;o+=e[n],n++}return o})(e.normalize());return{content:o,contentLength:o.length,cursorPos:0,lineNumber:1,charNumber:1}})(c)),o=D(G(e));u(o)}),[c]);const N=async e=>{e().then((e=>{e?o("Diagram exported",{variant:"info"}):o("Failed to export diagram",{variant:"error"})}))};return e.jsxs(n.Fragment,{children:[e.jsx(ie,{slotAppBar:e.jsxs(g,{variant:"outlined",children:[e.jsx(se,{collapsed:d,startIcon:e.jsx(m,{}),onClick:e=>{y(e.currentTarget)},children:"EXPORT"}),e.jsx(se,{collapsed:d,endIcon:e.jsx(L,{}),onClick:()=>{navigator.clipboard.writeText(((e,o)=>{const n=new URL(o);return n.searchParams.set("preview","true"),n.searchParams.set("content",e),n.href})(c,window.location.href)),o("Link copied to clipboard",{variant:"info"})},children:"SHARE"})]}),slotPanelLeft:e.jsx(re,{value:c,onValueChange:l}),slotPanelRight:e.jsx(te,{nodes:a,id:"structogram-preview-region",boxProps:{padding:4,userSelect:"none"}})}),e.jsx(R,{anchorOrigin:{vertical:"bottom",horizontal:"left"},transformOrigin:{vertical:"top",horizontal:"left"},anchorEl:k,open:null!==k,onClose:()=>{y(null)},children:e.jsx(x,{sx:{padding:1},children:e.jsxs(E,{children:[e.jsxs(T,{onClick:()=>N(t),children:[e.jsx(C,{children:e.jsx(m,{fontSize:"small"})}),e.jsx(I,{children:"Save as JPEG"})]}),e.jsxs(T,{onClick:()=>N(r),children:[e.jsx(C,{children:e.jsx(m,{fontSize:"small"})}),e.jsx(I,{children:"Save as PNG"})]}),e.jsxs(T,{onClick:()=>N(s),children:[e.jsx(C,{children:e.jsx(m,{fontSize:"small"})}),e.jsx(I,{children:"Save as SVG"})]})]})})})]})},le=y({palette:{mode:"dark"}}),de=()=>e.jsxs(n.Fragment,{children:[e.jsx(N,{}),e.jsx(v,{theme:le,children:e.jsx(O,{preventDuplicate:!0,autoHideDuration:2e3,anchorOrigin:{vertical:"top",horizontal:"center"},children:e.jsx(ce,{})})})]});S.createRoot(document.getElementById("root")).render(e.jsx(_.StrictMode,{children:e.jsx(de,{})}));
//# sourceMappingURL=index-VJLWsR7s.js.map
