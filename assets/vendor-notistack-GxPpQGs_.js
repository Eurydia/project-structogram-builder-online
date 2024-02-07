import{a9 as n,r as t,aa as e,ab as r}from"./vendor-_esTP_-Y.js";function i(n){var t,e,r="";if("string"==typeof n||"number"==typeof n)r+=n;else if("object"==typeof n)if(Array.isArray(n))for(t=0;t<n.length;t++)n[t]&&(e=i(n[t]))&&(r&&(r+=" "),r+=e);else for(t in n)n[t]&&(r&&(r+=" "),r+=t);return r}function o(){for(var n,t,e=0,r="";e<arguments.length;)(n=arguments[e++])&&(t=i(n))&&(r&&(r+=" "),r+=t);return r}function a(n,t){for(var e=0;e<t.length;e++){var r=t[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(n,r.key,r)}}function s(n,t,e){return t&&a(n.prototype,t),e&&a(n,e),n}function u(){return u=Object.assign||function(n){for(var t=1;t<arguments.length;t++){var e=arguments[t];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r])}return n},u.apply(this,arguments)}function c(n,t){n.prototype=Object.create(t.prototype),n.prototype.constructor=n,n.__proto__=t}function l(n,t){if(null==n)return{};var e,r,i={},o=Object.keys(n);for(r=0;r<o.length;r++)e=o[r],t.indexOf(e)>=0||(i[e]=n[e]);return i}function d(n){if(void 0===n)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}var f=function(){return""},p=n.createContext({enqueueSnackbar:f,closeSnackbar:f}),m="@media (max-width:599.95px)",h="@media (min-width:600px)",x=function(n){return n.charAt(0).toUpperCase()+n.slice(1)},v=function(n){return""+x(n.vertical)+x(n.horizontal)},g=function(n){return!!n||0===n},E="unmounted",b="exited",k="entering",y="entered",C="exiting",w=function(n){function t(t){var e;e=n.call(this,t)||this;var r,i=t.appear;return e.appearStatus=null,t.in?i?(r=b,e.appearStatus=k):r=y:r=t.unmountOnExit||t.mountOnEnter?E:b,e.state={status:r},e.nextCallback=null,e}c(t,n),t.getDerivedStateFromProps=function(n,t){return n.in&&t.status===E?{status:b}:null};var e=t.prototype;return e.componentDidMount=function(){this.updateStatus(!0,this.appearStatus)},e.componentDidUpdate=function(n){var t=null;if(n!==this.props){var e=this.state.status;this.props.in?e!==k&&e!==y&&(t=k):e!==k&&e!==y||(t=C)}this.updateStatus(!1,t)},e.componentWillUnmount=function(){this.cancelNextCallback()},e.getTimeouts=function(){var n=this.props.timeout,t=n,e=n;return null!=n&&"number"!=typeof n&&"string"!=typeof n&&(e=n.exit,t=n.enter),{exit:e,enter:t}},e.updateStatus=function(n,t){void 0===n&&(n=!1),null!==t?(this.cancelNextCallback(),t===k?this.performEnter(n):this.performExit()):this.props.unmountOnExit&&this.state.status===b&&this.setState({status:E})},e.performEnter=function(n){var t=this,e=this.props.enter,r=n,i=this.getTimeouts();n||e?(this.props.onEnter&&this.props.onEnter(this.node,r),this.safeSetState({status:k},(function(){t.props.onEntering&&t.props.onEntering(t.node,r),t.onTransitionEnd(i.enter,(function(){t.safeSetState({status:y},(function(){t.props.onEntered&&t.props.onEntered(t.node,r)}))}))}))):this.safeSetState({status:y},(function(){t.props.onEntered&&t.props.onEntered(t.node,r)}))},e.performExit=function(){var n=this,t=this.props.exit,e=this.getTimeouts();t?(this.props.onExit&&this.props.onExit(this.node),this.safeSetState({status:C},(function(){n.props.onExiting&&n.props.onExiting(n.node),n.onTransitionEnd(e.exit,(function(){n.safeSetState({status:b},(function(){n.props.onExited&&n.props.onExited(n.node)}))}))}))):this.safeSetState({status:b},(function(){n.props.onExited&&n.props.onExited(n.node)}))},e.cancelNextCallback=function(){null!==this.nextCallback&&this.nextCallback.cancel&&(this.nextCallback.cancel(),this.nextCallback=null)},e.safeSetState=function(n,t){t=this.setNextCallback(t),this.setState(n,t)},e.setNextCallback=function(n){var t=this,e=!0;return this.nextCallback=function(){e&&(e=!1,t.nextCallback=null,n())},this.nextCallback.cancel=function(){e=!1},this.nextCallback},e.onTransitionEnd=function(n,t){this.setNextCallback(t);var e=null==n&&!this.props.addEndListener;this.node&&!e?(this.props.addEndListener&&this.props.addEndListener(this.node,this.nextCallback),null!=n&&setTimeout(this.nextCallback,n)):setTimeout(this.nextCallback,0)},e.render=function(){var n=this.state.status;if(n===E)return null;var t=this.props;return(0,t.children)(n,l(t,["children","in","mountOnEnter","unmountOnExit","appear","enter","exit","timeout","addEndListener","onEnter","onEntering","onEntered","onExit","onExiting","onExited","nodeRef"]))},s(t,[{key:"node",get:function(){var n,t=null===(n=this.props.nodeRef)||void 0===n?void 0:n.current;if(!t)throw new Error("notistack - Custom snackbar is not refForwarding");return t}}]),t}(n.Component);function S(){}function L(n,t){"function"==typeof n?n(t):n&&(n.current=t)}function O(n,e){return t.useMemo((function(){return null==n&&null==e?null:function(t){L(n,t),L(e,t)}}),[n,e])}function T(n){var t=n.timeout,e=n.style,r=void 0===e?{}:e,i=n.mode;return{duration:"object"==typeof t?t[i]||0:t,easing:r.transitionTimingFunction,delay:r.transitionDelay}}w.defaultProps={in:!1,mountOnEnter:!1,unmountOnExit:!1,appear:!1,enter:!0,exit:!0,onEnter:S,onEntering:S,onEntered:S,onExit:S,onExiting:S,onExited:S};var D="cubic-bezier(0.4, 0, 0.2, 1)",N="cubic-bezier(0.0, 0, 0.2, 1)",R="cubic-bezier(0.4, 0, 0.6, 1)",H=function(n){n.scrollTop=n.scrollTop},M=function(n){return Math.round(n)+"ms"};function j(n,t){void 0===n&&(n=["all"]);var e=t||{},r=e.duration,i=void 0===r?300:r,o=e.easing,a=void 0===o?D:o,s=e.delay,u=void 0===s?0:s;return(Array.isArray(n)?n:[n]).map((function(n){var t="string"==typeof i?i:M(i),e="string"==typeof u?u:M(u);return n+" "+t+" "+a+" "+e})).join(",")}function q(n){var t=function(n){return n&&n.ownerDocument||document}(n);return t.defaultView||window}function P(n,t){if(t){var e=function(n,t){var e,r=t.getBoundingClientRect(),i=q(t);if(t.fakeTransform)e=t.fakeTransform;else{var o=i.getComputedStyle(t);e=o.getPropertyValue("-webkit-transform")||o.getPropertyValue("transform")}var a=0,s=0;if(e&&"none"!==e&&"string"==typeof e){var u=e.split("(")[1].split(")")[0].split(",");a=parseInt(u[4],10),s=parseInt(u[5],10)}switch(n){case"left":return"translateX("+(i.innerWidth+a-r.left)+"px)";case"right":return"translateX(-"+(r.left+r.width-a)+"px)";case"up":return"translateY("+(i.innerHeight+s-r.top)+"px)";default:return"translateY(-"+(r.top+r.height-s)+"px)"}}(n,t);e&&(t.style.webkitTransform=e,t.style.transform=e)}}var A=t.forwardRef((function(n,e){var r=n.children,i=n.direction,o=void 0===i?"down":i,a=n.in,s=n.style,c=n.timeout,d=void 0===c?0:c,f=n.onEnter,p=n.onEntered,m=n.onExit,h=n.onExited,x=l(n,["children","direction","in","style","timeout","onEnter","onEntered","onExit","onExited"]),v=t.useRef(null),g=O(r.ref,v),E=O(g,e),b=t.useCallback((function(){v.current&&P(o,v.current)}),[o]);return t.useEffect((function(){if(!a&&"down"!==o&&"right"!==o){var n=function(n,t){var e;function r(){for(var r=this,i=arguments.length,o=new Array(i),a=0;a<i;a++)o[a]=arguments[a];clearTimeout(e),e=setTimeout((function(){n.apply(r,o)}),t)}return void 0===t&&(t=166),r.clear=function(){clearTimeout(e)},r}((function(){v.current&&P(o,v.current)})),t=q(v.current);return t.addEventListener("resize",n),function(){n.clear(),t.removeEventListener("resize",n)}}}),[o,a]),t.useEffect((function(){a||b()}),[a,b]),t.createElement(w,Object.assign({appear:!0,nodeRef:v,onEnter:function(n,t){P(o,n),H(n),f&&f(n,t)},onEntered:p,onEntering:function(n){var t=(null==s?void 0:s.transitionTimingFunction)||N,e=T({timeout:d,mode:"enter",style:u({},s,{transitionTimingFunction:t})});n.style.webkitTransition=j("-webkit-transform",e),n.style.transition=j("transform",e),n.style.webkitTransform="none",n.style.transform="none"},onExit:function(n){var t=(null==s?void 0:s.transitionTimingFunction)||R,e=T({timeout:d,mode:"exit",style:u({},s,{transitionTimingFunction:t})});n.style.webkitTransition=j("-webkit-transform",e),n.style.transition=j("transform",e),P(o,n),m&&m(n)},onExited:function(n){n.style.webkitTransition="",n.style.transition="",h&&h(n)},in:a,timeout:d},x),(function(n,e){return t.cloneElement(r,u({ref:E,style:u({visibility:"exited"!==n||a?void 0:"hidden"},s,{},r.props.style)},e))}))}));A.displayName="Slide";var V=function(t){return n.createElement("svg",Object.assign({viewBox:"0 0 24 24",focusable:"false",style:{fontSize:20,marginInlineEnd:8,userSelect:"none",width:"1em",height:"1em",display:"inline-block",fill:"currentColor",flexShrink:0}},t))},I=function(){return n.createElement(V,null,n.createElement("path",{d:"M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41\n        10.59L10 14.17L17.59 6.58L19 8L10 17Z"}))},W=function(){return n.createElement(V,null,n.createElement("path",{d:"M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"}))},z=function(){return n.createElement(V,null,n.createElement("path",{d:"M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,\n        6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,\n        13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"}))},B=function(){return n.createElement(V,null,n.createElement("path",{d:"M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,\n        0 22,12A10,10 0 0,0 12,2Z"}))},F={maxSnack:3,persist:!1,hideIconVariant:!1,disableWindowBlurListener:!1,variant:"default",autoHideDuration:5e3,iconVariant:{default:void 0,success:n.createElement(I,null),warning:n.createElement(W,null),error:n.createElement(z,null),info:n.createElement(B,null)},anchorOrigin:{vertical:"bottom",horizontal:"left"},TransitionComponent:A,transitionDuration:{enter:225,exit:195}},X=function(n,t){return function(e,r){return void 0===r&&(r=!1),r?u({},F[e],{},t[e],{},n[e]):"autoHideDuration"===e?(i=n.autoHideDuration,o=t.autoHideDuration,(a=function(n){return"number"==typeof n||null===n})(i)?i:a(o)?o:F.autoHideDuration):"transitionDuration"===e?function(n,t){var e=function(n,t){return t.some((function(t){return typeof n===t}))};return e(n,["string","number"])?n:e(n,["object"])?u({},F.transitionDuration,{},e(t,["object"])&&t,{},n):e(t,["string","number"])?t:e(t,["object"])?u({},F.transitionDuration,{},t):F.transitionDuration}(n.transitionDuration,t.transitionDuration):n[e]||t[e]||F[e];var i,o,a}};function Z(n){return Object.entries(n).reduce((function(n,t){var r,i=t[0],o=t[1];return u({},n,((r={})[i]=e(o),r))}),{})}var _="notistack-SnackbarContainer",Q="notistack-Snackbar",U="notistack-CollapseWrapper",G="notistack-MuiContent",Y=function(n){return"notistack-MuiContent-"+n},J=Z({root:{height:0},entered:{height:"auto"}}),K="0px",$=t.forwardRef((function(n,e){var r=n.children,i=n.in,a=n.onExited,s=t.useRef(null),c=t.useRef(null),l=O(e,c),d=function(){return s.current?s.current.clientHeight:0};return t.createElement(w,{in:i,unmountOnExit:!0,onEnter:function(n){n.style.height=K},onEntered:function(n){n.style.height="auto"},onEntering:function(n){var t=d(),e=T({timeout:175,mode:"enter"}),r=e.duration,i=e.easing;n.style.transitionDuration="string"==typeof r?r:r+"ms",n.style.height=t+"px",n.style.transitionTimingFunction=i||""},onExit:function(n){n.style.height=d()+"px"},onExited:a,onExiting:function(n){H(n);var t=T({timeout:175,mode:"exit"}),e=t.duration,r=t.easing;n.style.transitionDuration="string"==typeof e?e:e+"ms",n.style.height=K,n.style.transitionTimingFunction=r||""},nodeRef:c,timeout:175},(function(n,e){return t.createElement("div",Object.assign({ref:l,className:o(J.root,"entered"===n&&J.entered),style:u({pointerEvents:"all",overflow:"hidden",minHeight:K,transition:j("height")},"entered"===n&&{overflow:"visible"},{},"exited"===n&&!i&&{visibility:"hidden"})},e),t.createElement("div",{ref:s,className:U,style:{display:"flex",width:"100%"}},r))}))}));$.displayName="Collapse";var nn={right:"left",left:"right",bottom:"up",top:"down"},tn=function(n){return"anchorOrigin"+v(n)},en=function(){};function rn(n,t){return n.reduce((function(n,e){return null==e?n:function(){for(var r=arguments.length,i=new Array(r),o=0;o<r;o++)i[o]=arguments[o];var a=[].concat(i);t&&-1===a.indexOf(t)&&a.push(t),n.apply(this,a),e.apply(this,a)}}),en)}var on="undefined"!=typeof window?t.useLayoutEffect:t.useEffect;function an(n){var e=t.useRef(n);return on((function(){e.current=n})),t.useCallback((function(){return e.current.apply(void 0,arguments)}),[])}var sn,un=t.forwardRef((function(n,e){var r=n.children,i=n.className,a=n.autoHideDuration,s=n.disableWindowBlurListener,u=void 0!==s&&s,c=n.onClose,l=n.id,d=n.open,f=n.SnackbarProps,p=void 0===f?{}:f,m=t.useRef(),h=an((function(){c&&c.apply(void 0,arguments)})),x=an((function(n){c&&null!=n&&(m.current&&clearTimeout(m.current),m.current=setTimeout((function(){h(null,"timeout",l)}),n))}));t.useEffect((function(){return d&&x(a),function(){m.current&&clearTimeout(m.current)}}),[d,a,x]);var v=function(){m.current&&clearTimeout(m.current)},g=t.useCallback((function(){null!=a&&x(.5*a)}),[a,x]);return t.useEffect((function(){if(!u&&d)return window.addEventListener("focus",g),window.addEventListener("blur",v),function(){window.removeEventListener("focus",g),window.removeEventListener("blur",v)}}),[u,g,d]),t.createElement("div",Object.assign({ref:e},p,{className:o(Q,i),onMouseEnter:function(n){p.onMouseEnter&&p.onMouseEnter(n),v()},onMouseLeave:function(n){p.onMouseLeave&&p.onMouseLeave(n),g()}}),r)}));un.displayName="Snackbar";var cn=Z({root:(sn={display:"flex",flexWrap:"wrap",flexGrow:1},sn[h]={flexGrow:"initial",minWidth:"288px"},sn)}),ln=t.forwardRef((function(t,e){var r=t.className,i=l(t,["className"]);return n.createElement("div",Object.assign({ref:e,className:o(cn.root,r)},i))}));ln.displayName="SnackbarContent";var dn=Z({root:{backgroundColor:"#313131",fontSize:"0.875rem",lineHeight:1.43,letterSpacing:"0.01071em",color:"#fff",alignItems:"center",padding:"6px 16px",borderRadius:"4px",boxShadow:"0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)"},lessPadding:{paddingLeft:"20px"},default:{backgroundColor:"#313131"},success:{backgroundColor:"#43a047"},error:{backgroundColor:"#d32f2f"},warning:{backgroundColor:"#ff9800"},info:{backgroundColor:"#2196f3"},message:{display:"flex",alignItems:"center",padding:"8px 0"},action:{display:"flex",alignItems:"center",marginLeft:"auto",paddingLeft:"16px",marginRight:"-8px"}}),fn="notistack-snackbar",pn=t.forwardRef((function(t,e){var r=t.id,i=t.message,a=t.action,s=t.iconVariant,u=t.variant,c=t.hideIconVariant,l=t.style,d=t.className,f=s[u],p=a;return"function"==typeof p&&(p=p(r)),n.createElement(ln,{ref:e,role:"alert","aria-describedby":fn,style:l,className:o(G,Y(u),dn.root,dn[u],d,!c&&f&&dn.lessPadding)},n.createElement("div",{id:fn,className:dn.message},c?null:f,i),p&&n.createElement("div",{className:dn.action},p))}));pn.displayName="MaterialDesignContent";var mn,hn,xn,vn,gn,En=t.memo(pn),bn=Z({wrappedRoot:{width:"100%",position:"relative",transform:"translateX(0)",top:0,right:0,bottom:0,left:0,minWidth:"288px"}}),kn=function(e){var r=t.useRef(),i=t.useState(!0),a=i[0],s=i[1],c=rn([e.snack.onClose,e.onClose]),d=t.useCallback((function(){r.current=setTimeout((function(){s((function(n){return!n}))}),125)}),[]);t.useEffect((function(){return function(){r.current&&clearTimeout(r.current)}}),[]);var f,p=e.snack,m=e.classes,h=e.Component,x=void 0===h?En:h,v=t.useMemo((function(){return function(n){void 0===n&&(n={});var t={containerRoot:!0,containerAnchorOriginTopCenter:!0,containerAnchorOriginBottomCenter:!0,containerAnchorOriginTopRight:!0,containerAnchorOriginBottomRight:!0,containerAnchorOriginTopLeft:!0,containerAnchorOriginBottomLeft:!0};return Object.keys(n).filter((function(n){return!t[n]})).reduce((function(t,e){var r;return u({},t,((r={})[e]=n[e],r))}),{})}(m)}),[m]),g=p.open,E=p.SnackbarProps,b=p.TransitionComponent,k=p.TransitionProps,y=p.transitionDuration,C=p.disableWindowBlurListener,w=p.content,S=l(p,["open","SnackbarProps","TransitionComponent","TransitionProps","transitionDuration","disableWindowBlurListener","content","entered","requestClose","onEnter","onEntered","onExit","onExited"]),L=u({direction:(f=S.anchorOrigin,"center"!==f.horizontal?nn[f.horizontal]:nn[f.vertical]),timeout:y},k),O=w;"function"==typeof O&&(O=O(S.id,S.message));var T=["onEnter","onEntered","onExit","onExited"].reduce((function(n,t){var r;return u({},n,((r={})[t]=rn([e.snack[t],e[t]],S.id),r))}),{});return n.createElement($,{in:a,onExited:T.onExited},n.createElement(un,{open:g,id:S.id,disableWindowBlurListener:C,autoHideDuration:S.autoHideDuration,className:o(bn.wrappedRoot,v.root,v[tn(S.anchorOrigin)]),SnackbarProps:E,onClose:c},n.createElement(b,Object.assign({},L,{appear:!0,in:g,onExit:T.onExit,onExited:d,onEnter:T.onEnter,onEntered:rn([T.onEntered,function(){e.snack.requestClose&&c(null,"instructed",e.snack.id)}],S.id)}),O||n.createElement(x,Object.assign({},S)))))},yn={default:20,dense:4},Cn={default:6,dense:2},wn="."+U,Sn=Z({root:(mn={boxSizing:"border-box",display:"flex",maxHeight:"100%",position:"fixed",zIndex:1400,height:"auto",width:"auto",transition:j(["top","right","bottom","left","max-width"],{duration:300,easing:"ease"}),pointerEvents:"none"},mn[wn]={padding:Cn.default+"px 0px",transition:"padding 300ms ease 0ms"},mn.maxWidth="calc(100% - "+2*yn.default+"px)",mn[m]={width:"100%",maxWidth:"calc(100% - 32px)"},mn),rootDense:(hn={},hn[wn]={padding:Cn.dense+"px 0px"},hn),top:{top:yn.default-Cn.default+"px",flexDirection:"column"},bottom:{bottom:yn.default-Cn.default+"px",flexDirection:"column-reverse"},left:(xn={left:yn.default+"px"},xn[h]={alignItems:"flex-start"},xn[m]={left:"16px"},xn),right:(vn={right:yn.default+"px"},vn[h]={alignItems:"flex-end"},vn[m]={right:"16px"},vn),center:(gn={left:"50%",transform:"translateX(-50%)"},gn[h]={alignItems:"center"},gn)}),Ln=function(t){var e=t.classes,r=void 0===e?{}:e,i=t.anchorOrigin,a=t.dense,s=t.children,u=o(_,Sn[i.vertical],Sn[i.horizontal],Sn.root,r.containerRoot,r["containerAnchorOrigin"+v(i)],a&&Sn.rootDense);return n.createElement("div",{className:u},s)},On=t.memo(Ln),Tn=function(n){return!("string"==typeof n||t.isValidElement(n))},Dn=function(t){function e(n){var e;return(e=t.call(this,n)||this).enqueueSnackbar=function(n,t){if(void 0===t&&(t={}),null==n)throw new Error("enqueueSnackbar called with invalid argument");var r=Tn(n)?n:t,i=Tn(n)?n.message:n,a=r.key,s=r.preventDuplicate,c=l(r,["key","preventDuplicate"]),d=g(a),f=d?a:(new Date).getTime()+Math.random(),p=X(c,e.props),m=u({id:f},c,{message:i,open:!0,entered:!1,requestClose:!1,persist:p("persist"),action:p("action"),content:p("content"),variant:p("variant"),anchorOrigin:p("anchorOrigin"),disableWindowBlurListener:p("disableWindowBlurListener"),autoHideDuration:p("autoHideDuration"),hideIconVariant:p("hideIconVariant"),TransitionComponent:p("TransitionComponent"),transitionDuration:p("transitionDuration"),TransitionProps:p("TransitionProps",!0),iconVariant:p("iconVariant",!0),style:p("style",!0),SnackbarProps:p("SnackbarProps",!0),className:o(e.props.className,c.className)});return m.persist&&(m.autoHideDuration=void 0),e.setState((function(n){if(void 0===s&&e.props.preventDuplicate||s){var t=function(n){return d?n.id===f:n.message===i},r=n.queue.findIndex(t)>-1,o=n.snacks.findIndex(t)>-1;if(r||o)return n}return e.handleDisplaySnack(u({},n,{queue:[].concat(n.queue,[m])}))})),f},e.handleDisplaySnack=function(n){return n.snacks.length>=e.maxSnack?e.handleDismissOldest(n):e.processQueue(n)},e.processQueue=function(n){var t=n.queue,e=n.snacks;return t.length>0?u({},n,{snacks:[].concat(e,[t[0]]),queue:t.slice(1,t.length)}):n},e.handleDismissOldest=function(n){if(n.snacks.some((function(n){return!n.open||n.requestClose})))return n;var t=!1,r=!1;n.snacks.reduce((function(n,t){return n+(t.open&&t.persist?1:0)}),0)===e.maxSnack&&(r=!0);var i=n.snacks.map((function(n){return t||n.persist&&!r?u({},n):(t=!0,n.entered?(n.onClose&&n.onClose(null,"maxsnack",n.id),e.props.onClose&&e.props.onClose(null,"maxsnack",n.id),u({},n,{open:!1})):u({},n,{requestClose:!0}))}));return u({},n,{snacks:i})},e.handleEnteredSnack=function(n,t,r){if(!g(r))throw new Error("handleEnteredSnack Cannot be called with undefined key");e.setState((function(n){return{snacks:n.snacks.map((function(n){return n.id===r?u({},n,{entered:!0}):u({},n)}))}}))},e.handleCloseSnack=function(n,t,r){e.props.onClose&&e.props.onClose(n,t,r);var i=void 0===r;e.setState((function(n){var t=n.snacks,e=n.queue;return{snacks:t.map((function(n){return i||n.id===r?n.entered?u({},n,{open:!1}):u({},n,{requestClose:!0}):u({},n)})),queue:e.filter((function(n){return n.id!==r}))}}))},e.closeSnackbar=function(n){var t=e.state.snacks.find((function(t){return t.id===n}));g(n)&&t&&t.onClose&&t.onClose(null,"instructed",n),e.handleCloseSnack(null,"instructed",n)},e.handleExitedSnack=function(n,t){if(!g(t))throw new Error("handleExitedSnack Cannot be called with undefined key");e.setState((function(n){var r=e.processQueue(u({},n,{snacks:n.snacks.filter((function(n){return n.id!==t}))}));return 0===r.queue.length?r:e.handleDismissOldest(r)}))},e.enqueueSnackbar,e.closeSnackbar,e.state={snacks:[],queue:[],contextValue:{enqueueSnackbar:e.enqueueSnackbar.bind(d(e)),closeSnackbar:e.closeSnackbar.bind(d(e))}},e}return c(e,t),e.prototype.render=function(){var t=this,e=this.state.contextValue,i=this.props,o=i.domRoot,a=i.children,s=i.dense,c=void 0!==s&&s,l=i.Components,d=void 0===l?{}:l,f=i.classes,m=this.state.snacks.reduce((function(n,t){var e,r=v(t.anchorOrigin),i=n[r]||[];return u({},n,((e={})[r]=[].concat(i,[t]),e))}),{}),h=Object.keys(m).map((function(e){var r=m[e],i=r[0];return n.createElement(On,{key:e,dense:c,anchorOrigin:i.anchorOrigin,classes:f},r.map((function(e){return n.createElement(kn,{key:e.id,snack:e,classes:f,Component:d[e.variant],onClose:t.handleCloseSnack,onEnter:t.props.onEnter,onExit:t.props.onExit,onExited:rn([t.handleExitedSnack,t.props.onExited],e.id),onEntered:rn([t.handleEnteredSnack,t.props.onEntered],e.id)})})))}));return n.createElement(p.Provider,{value:e},a,o?r.createPortal(h,o):h)},s(e,[{key:"maxSnack",get:function(){return this.props.maxSnack||F.maxSnack}}]),e}(t.Component),Nn=function(){return t.useContext(p)};export{Dn as S,Nn as u};
//# sourceMappingURL=vendor-notistack-GxPpQGs_.js.map
