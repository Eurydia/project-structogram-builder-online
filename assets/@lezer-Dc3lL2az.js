const t=1024;let e=0;class r{constructor(t,e){this.from=t,this.to=e}}class i{constructor(t={}){this.id=e++,this.perNode=!!t.perNode,this.deserialize=t.deserialize||(()=>{throw new Error("This node type doesn't define a deserialize function")})}add(t){if(this.perNode)throw new RangeError("Can't add per-node props to node types");return"function"!=typeof t&&(t=o.match(t)),e=>{let r=t(e);return void 0===r?null:[this,r]}}}i.closedBy=new i({deserialize:t=>t.split(" ")}),i.openedBy=new i({deserialize:t=>t.split(" ")}),i.group=new i({deserialize:t=>t.split(" ")}),i.contextHash=new i({perNode:!0}),i.lookAhead=new i({perNode:!0}),i.mounted=new i({perNode:!0});class n{constructor(t,e,r){this.tree=t,this.overlay=e,this.parser=r}static get(t){return t&&t.props&&t.props[i.mounted.id]}}const s=Object.create(null);class o{constructor(t,e,r,i=0){this.name=t,this.props=e,this.id=r,this.flags=i}static define(t){let e=t.props&&t.props.length?Object.create(null):s,r=(t.top?1:0)|(t.skipped?2:0)|(t.error?4:0)|(null==t.name?8:0),i=new o(t.name||"",e,t.id,r);if(t.props)for(let n of t.props)if(Array.isArray(n)||(n=n(i)),n){if(n[0].perNode)throw new RangeError("Can't store a per-node prop on a node type");e[n[0].id]=n[1]}return i}prop(t){return this.props[t.id]}get isTop(){return(1&this.flags)>0}get isSkipped(){return(2&this.flags)>0}get isError(){return(4&this.flags)>0}get isAnonymous(){return(8&this.flags)>0}is(t){if("string"==typeof t){if(this.name==t)return!0;let e=this.prop(i.group);return!!e&&e.indexOf(t)>-1}return this.id==t}static match(t){let e=Object.create(null);for(let r in t)for(let i of r.split(" "))e[i]=t[r];return t=>{for(let r=t.prop(i.group),n=-1;n<(r?r.length:0);n++){let i=e[n<0?t.name:r[n]];if(i)return i}}}}o.none=new o("",Object.create(null),0,8);const l=new WeakMap,h=new WeakMap;var a,f;(f=a||(a={}))[f.ExcludeBuffers=1]="ExcludeBuffers",f[f.IncludeAnonymous=2]="IncludeAnonymous",f[f.IgnoreMounts=4]="IgnoreMounts",f[f.IgnoreOverlays=8]="IgnoreOverlays";class u{constructor(t,e,r,i,n){if(this.type=t,this.children=e,this.positions=r,this.length=i,this.props=null,n&&n.length){this.props=Object.create(null);for(let[t,e]of n)this.props["number"==typeof t?t:t.id]=e}}toString(){let t=n.get(this);if(t&&!t.overlay)return t.tree.toString();let e="";for(let r of this.children){let t=r.toString();t&&(e&&(e+=","),e+=t)}return this.type.name?(/\W/.test(this.type.name)&&!this.type.isError?JSON.stringify(this.type.name):this.type.name)+(e.length?"("+e+")":""):e}cursor(t=0){return new N(this.topNode,t)}cursorAt(t,e=0,r=0){let i=l.get(this)||this.topNode,n=new N(i);return n.moveTo(t,e),l.set(this,n._tree),n}get topNode(){return new x(this,0,0,null)}resolve(t,e=0){let r=g(l.get(this)||this.topNode,t,e,!1);return l.set(this,r),r}resolveInner(t,e=0){let r=g(h.get(this)||this.topNode,t,e,!0);return h.set(this,r),r}resolveStack(t,e=0){return function(t,e,r){let i=t.resolveInner(e,r),s=null;for(let o=i instanceof x?i:i.context.parent;o;o=o.parent)if(o.index<0){let t=o.parent;(s||(s=[i])).push(t.resolve(e,r)),o=t}else{let t=n.get(o.tree);if(t&&t.overlay&&t.overlay[0].from<=e&&t.overlay[t.overlay.length-1].to>=e){let n=new x(t.tree,t.overlay[0].from+o.from,-1,o);(s||(s=[i])).push(g(n,e,r,!1))}}return s?v(s):i}(this,t,e)}iterate(t){let{enter:e,leave:r,from:i=0,to:n=this.length}=t,s=t.mode||0,o=(s&a.IncludeAnonymous)>0;for(let l=this.cursor(s|a.IncludeAnonymous);;){let t=!1;if(l.from<=n&&l.to>=i&&(!o&&l.type.isAnonymous||!1!==e(l))){if(l.firstChild())continue;t=!0}for(;t&&r&&(o||!l.type.isAnonymous)&&r(l),!l.nextSibling();){if(!l.parent())return;t=!0}}}prop(t){return t.perNode?this.props?this.props[t.id]:void 0:this.type.prop(t)}get propValues(){let t=[];if(this.props)for(let e in this.props)t.push([+e,this.props[e]]);return t}balance(t={}){return this.children.length<=8?this:I(o.none,this.children,this.positions,0,this.children.length,0,this.length,((t,e,r)=>new u(this.type,t,e,r,this.propValues)),t.makeTree||((t,e,r)=>new u(o.none,t,e,r)))}static build(e){return function(e){var r;let{buffer:n,nodeSet:s,maxBufferLength:o=t,reused:l=[],minRepeatType:h=s.types.length}=e,a=Array.isArray(n)?new d(n,n.length):n,f=s.types,p=0,g=0;function m(t,e,r,i,n,u){let{id:d,start:_,end:N,size:C}=a,S=g;for(;C<0;){if(a.next(),-1==C){let e=l[d];return r.push(e),void i.push(_-t)}if(-3==C)return void(p=d);if(-4==C)return void(g=d);throw new RangeError(`Unrecognized record size: ${C}`)}let A,M,O=f[d],B=_-t;if(N-_<=o&&(M=w(a.pos-e,n))){let e=new Uint16Array(M.size-M.skip),r=a.pos-M.size,i=e.length;for(;a.pos>r;)i=v(M.start,e,i);A=new c(e,N-M.start,s),B=M.start-t}else{let t=a.pos-C;a.next();let e=[],r=[],i=d>=h?d:-1,n=0,s=N;for(;a.pos>t;)i>=0&&a.id==i&&a.size>=0?(a.end<=s-o&&(y(e,r,_,n,a.end,s,i,S),n=e.length,s=a.end),a.next()):u>2500?x(_,t,e,r):m(_,t,e,r,i,u+1);if(i>=0&&n>0&&n<e.length&&y(e,r,_,n,_,s,i,S),e.reverse(),r.reverse(),i>-1&&n>0){let t=b(O);A=I(O,e,r,0,e.length,0,N-_,t,t)}else A=k(O,e,r,N-_,S-N)}r.push(A),i.push(B)}function x(t,e,r,i){let n=[],l=0,h=-1;for(;a.pos>e;){let{id:t,start:e,end:r,size:i}=a;if(i>4)a.next();else{if(h>-1&&e<h)break;h<0&&(h=r-o),n.push(t,e,r),l++,a.next()}}if(l){let e=new Uint16Array(4*l),o=n[n.length-2];for(let t=n.length-3,r=0;t>=0;t-=3)e[r++]=n[t],e[r++]=n[t+1]-o,e[r++]=n[t+2]-o,e[r++]=r;r.push(new c(e,n[2]-o,s)),i.push(o-t)}}function b(t){return(e,r,n)=>{let s,o,l=0,h=e.length-1;if(h>=0&&(s=e[h])instanceof u){if(!h&&s.type==t&&s.length==n)return s;(o=s.prop(i.lookAhead))&&(l=r[h]+s.length+o)}return k(t,e,r,n,l)}}function y(t,e,r,i,n,o,l,h){let a=[],f=[];for(;t.length>i;)a.push(t.pop()),f.push(e.pop()+r-n);t.push(k(s.types[l],a,f,o-n,h-o)),e.push(n-r)}function k(t,e,r,n,s=0,o){if(p){let t=[i.contextHash,p];o=o?[t].concat(o):[t]}if(s>25){let t=[i.lookAhead,s];o=o?[t].concat(o):[t]}return new u(t,e,r,n,o)}function w(t,e){let r=a.fork(),i=0,n=0,s=0,l=r.end-o,f={size:0,start:0,skip:0};t:for(let o=r.pos-t;r.pos>o;){let t=r.size;if(r.id==e&&t>=0){f.size=i,f.start=n,f.skip=s,s+=4,i+=4,r.next();continue}let a=r.pos-t;if(t<0||a<o||r.start<l)break;let u=r.id>=h?4:0,d=r.start;for(r.next();r.pos>a;){if(r.size<0){if(-3!=r.size)break t;u+=4}else r.id>=h&&(u+=4);r.next()}n=d,i+=t,s+=u}return(e<0||i==t)&&(f.size=i,f.start=n,f.skip=s),f.size>4?f:void 0}function v(t,e,r){let{id:i,start:n,end:s,size:o}=a;if(a.next(),o>=0&&i<h){let l=r;if(o>4){let i=a.pos-(o-4);for(;a.pos>i;)r=v(t,e,r)}e[--r]=l,e[--r]=s-t,e[--r]=n-t,e[--r]=i}else-3==o?p=i:-4==o&&(g=i);return r}let _=[],N=[];for(;a.pos>0;)m(e.start||0,e.bufferStart||0,_,N,-1,0);let C=null!==(r=e.length)&&void 0!==r?r:_.length?N[0]+_[0].length:0;return new u(f[e.topID],_.reverse(),N.reverse(),C)}(e)}}u.empty=new u(o.none,[],[],0);class d{constructor(t,e){this.buffer=t,this.index=e}get id(){return this.buffer[this.index-4]}get start(){return this.buffer[this.index-3]}get end(){return this.buffer[this.index-2]}get size(){return this.buffer[this.index-1]}get pos(){return this.index}next(){this.index-=4}fork(){return new d(this.buffer,this.index)}}class c{constructor(t,e,r){this.buffer=t,this.length=e,this.set=r}get type(){return o.none}toString(){let t=[];for(let e=0;e<this.buffer.length;)t.push(this.childString(e)),e=this.buffer[e+3];return t.join(",")}childString(t){let e=this.buffer[t],r=this.buffer[t+3],i=this.set.types[e],n=i.name;if(/\W/.test(n)&&!i.isError&&(n=JSON.stringify(n)),r==(t+=4))return n;let s=[];for(;t<r;)s.push(this.childString(t)),t=this.buffer[t+3];return n+"("+s.join(",")+")"}findChild(t,e,r,i,n){let{buffer:s}=this,o=-1;for(let l=t;l!=e&&!(p(n,i,s[l+1],s[l+2])&&(o=l,r>0));l=s[l+3]);return o}slice(t,e,r){let i=this.buffer,n=new Uint16Array(e-t),s=0;for(let o=t,l=0;o<e;){n[l++]=i[o++],n[l++]=i[o++]-r;let e=n[l++]=i[o++]-r;n[l++]=i[o++]-t,s=Math.max(s,e)}return new c(n,s,this.set)}}function p(t,e,r,i){switch(t){case-2:return r<e;case-1:return i>=e&&r<e;case 0:return r<e&&i>e;case 1:return r<=e&&i>e;case 2:return i>e;case 4:return!0}}function g(t,e,r,i){for(var n;t.from==t.to||(r<1?t.from>=e:t.from>e)||(r>-1?t.to<=e:t.to<e);){let e=!i&&t instanceof x&&t.index<0?null:t.parent;if(!e)return t;t=e}let s=i?0:a.IgnoreOverlays;if(i)for(let o=t,l=o.parent;l;o=l,l=o.parent)o instanceof x&&o.index<0&&(null===(n=l.enter(e,r,s))||void 0===n?void 0:n.from)!=o.from&&(t=l);for(;;){let i=t.enter(e,r,s);if(!i)return t;t=i}}class m{cursor(t=0){return new N(this,t)}getChild(t,e=null,r=null){let i=b(this,t,e,r);return i.length?i[0]:null}getChildren(t,e=null,r=null){return b(this,t,e,r)}resolve(t,e=0){return g(this,t,e,!1)}resolveInner(t,e=0){return g(this,t,e,!0)}matchContext(t){return y(this,t)}enterUnfinishedNodesBefore(t){let e=this.childBefore(t),r=this;for(;e;){let t=e.lastChild;if(!t||t.to!=e.to)break;t.type.isError&&t.from==t.to?(r=e,e=t.prevSibling):e=t}return r}get node(){return this}get next(){return this.parent}}class x extends m{constructor(t,e,r,i){super(),this._tree=t,this.from=e,this.index=r,this._parent=i}get type(){return this._tree.type}get name(){return this._tree.type.name}get to(){return this.from+this._tree.length}nextChild(t,e,r,i,s=0){for(let o=this;;){for(let{children:l,positions:h}=o._tree,f=e>0?l.length:-1;t!=f;t+=e){let f=l[t],u=h[t]+o.from;if(p(i,r,u,u+f.length))if(f instanceof c){if(s&a.ExcludeBuffers)continue;let n=f.findChild(0,f.buffer.length,e,r-u,i);if(n>-1)return new w(new k(o,f,t,u),null,n)}else if(s&a.IncludeAnonymous||!f.type.isAnonymous||C(f)){let l;if(!(s&a.IgnoreMounts)&&(l=n.get(f))&&!l.overlay)return new x(l.tree,u,t,o);let h=new x(f,u,t,o);return s&a.IncludeAnonymous||!h.type.isAnonymous?h:h.nextChild(e<0?f.children.length-1:0,e,r,i)}}if(s&a.IncludeAnonymous||!o.type.isAnonymous)return null;if(t=o.index>=0?o.index+e:e<0?-1:o._parent._tree.children.length,o=o._parent,!o)return null}}get firstChild(){return this.nextChild(0,1,0,4)}get lastChild(){return this.nextChild(this._tree.children.length-1,-1,0,4)}childAfter(t){return this.nextChild(0,1,t,2)}childBefore(t){return this.nextChild(this._tree.children.length-1,-1,t,-2)}enter(t,e,r=0){let i;if(!(r&a.IgnoreOverlays)&&(i=n.get(this._tree))&&i.overlay){let r=t-this.from;for(let{from:t,to:n}of i.overlay)if((e>0?t<=r:t<r)&&(e<0?n>=r:n>r))return new x(i.tree,i.overlay[0].from+this.from,-1,this)}return this.nextChild(0,1,t,e,r)}nextSignificantParent(){let t=this;for(;t.type.isAnonymous&&t._parent;)t=t._parent;return t}get parent(){return this._parent?this._parent.nextSignificantParent():null}get nextSibling(){return this._parent&&this.index>=0?this._parent.nextChild(this.index+1,1,0,4):null}get prevSibling(){return this._parent&&this.index>=0?this._parent.nextChild(this.index-1,-1,0,4):null}get tree(){return this._tree}toTree(){return this._tree}toString(){return this._tree.toString()}}function b(t,e,r,i){let n=t.cursor(),s=[];if(!n.firstChild())return s;if(null!=r)for(;!n.type.is(r);)if(!n.nextSibling())return s;for(;;){if(null!=i&&n.type.is(i))return s;if(n.type.is(e)&&s.push(n.node),!n.nextSibling())return null==i?s:[]}}function y(t,e,r=e.length-1){for(let i=t.parent;r>=0;i=i.parent){if(!i)return!1;if(!i.type.isAnonymous){if(e[r]&&e[r]!=i.name)return!1;r--}}return!0}class k{constructor(t,e,r,i){this.parent=t,this.buffer=e,this.index=r,this.start=i}}class w extends m{get name(){return this.type.name}get from(){return this.context.start+this.context.buffer.buffer[this.index+1]}get to(){return this.context.start+this.context.buffer.buffer[this.index+2]}constructor(t,e,r){super(),this.context=t,this._parent=e,this.index=r,this.type=t.buffer.set.types[t.buffer.buffer[r]]}child(t,e,r){let{buffer:i}=this.context,n=i.findChild(this.index+4,i.buffer[this.index+3],t,e-this.context.start,r);return n<0?null:new w(this.context,this,n)}get firstChild(){return this.child(1,0,4)}get lastChild(){return this.child(-1,0,4)}childAfter(t){return this.child(1,t,2)}childBefore(t){return this.child(-1,t,-2)}enter(t,e,r=0){if(r&a.ExcludeBuffers)return null;let{buffer:i}=this.context,n=i.findChild(this.index+4,i.buffer[this.index+3],e>0?1:-1,t-this.context.start,e);return n<0?null:new w(this.context,this,n)}get parent(){return this._parent||this.context.parent.nextSignificantParent()}externalSibling(t){return this._parent?null:this.context.parent.nextChild(this.context.index+t,t,0,4)}get nextSibling(){let{buffer:t}=this.context,e=t.buffer[this.index+3];return e<(this._parent?t.buffer[this._parent.index+3]:t.buffer.length)?new w(this.context,this._parent,e):this.externalSibling(1)}get prevSibling(){let{buffer:t}=this.context,e=this._parent?this._parent.index+4:0;return this.index==e?this.externalSibling(-1):new w(this.context,this._parent,t.findChild(e,this.index,-1,0,4))}get tree(){return null}toTree(){let t=[],e=[],{buffer:r}=this.context,i=this.index+4,n=r.buffer[this.index+3];if(n>i){let s=r.buffer[this.index+1];t.push(r.slice(i,n,s)),e.push(0)}return new u(this.type,t,e,this.to-this.from)}toString(){return this.context.buffer.childString(this.index)}}function v(t){if(!t.length)return null;let e=0,r=t[0];for(let s=1;s<t.length;s++){let i=t[s];(i.from>r.from||i.to<r.to)&&(r=i,e=s)}let i=r instanceof x&&r.index<0?null:r.parent,n=t.slice();return i?n[e]=i:n.splice(e,1),new _(n,r)}class _{constructor(t,e){this.heads=t,this.node=e}get next(){return v(this.heads)}}class N{get name(){return this.type.name}constructor(t,e=0){if(this.mode=e,this.buffer=null,this.stack=[],this.index=0,this.bufferNode=null,t instanceof x)this.yieldNode(t);else{this._tree=t.context.parent,this.buffer=t.context;for(let e=t._parent;e;e=e._parent)this.stack.unshift(e.index);this.bufferNode=t,this.yieldBuf(t.index)}}yieldNode(t){return!!t&&(this._tree=t,this.type=t.type,this.from=t.from,this.to=t.to,!0)}yieldBuf(t,e){this.index=t;let{start:r,buffer:i}=this.buffer;return this.type=e||i.set.types[i.buffer[t]],this.from=r+i.buffer[t+1],this.to=r+i.buffer[t+2],!0}yield(t){return!!t&&(t instanceof x?(this.buffer=null,this.yieldNode(t)):(this.buffer=t.context,this.yieldBuf(t.index,t.type)))}toString(){return this.buffer?this.buffer.buffer.childString(this.index):this._tree.toString()}enterChild(t,e,r){if(!this.buffer)return this.yield(this._tree.nextChild(t<0?this._tree._tree.children.length-1:0,t,e,r,this.mode));let{buffer:i}=this.buffer,n=i.findChild(this.index+4,i.buffer[this.index+3],t,e-this.buffer.start,r);return!(n<0)&&(this.stack.push(this.index),this.yieldBuf(n))}firstChild(){return this.enterChild(1,0,4)}lastChild(){return this.enterChild(-1,0,4)}childAfter(t){return this.enterChild(1,t,2)}childBefore(t){return this.enterChild(-1,t,-2)}enter(t,e,r=this.mode){return this.buffer?!(r&a.ExcludeBuffers)&&this.enterChild(1,t,e):this.yield(this._tree.enter(t,e,r))}parent(){if(!this.buffer)return this.yieldNode(this.mode&a.IncludeAnonymous?this._tree._parent:this._tree.parent);if(this.stack.length)return this.yieldBuf(this.stack.pop());let t=this.mode&a.IncludeAnonymous?this.buffer.parent:this.buffer.parent.nextSignificantParent();return this.buffer=null,this.yieldNode(t)}sibling(t){if(!this.buffer)return!!this._tree._parent&&this.yield(this._tree.index<0?null:this._tree._parent.nextChild(this._tree.index+t,t,0,4,this.mode));let{buffer:e}=this.buffer,r=this.stack.length-1;if(t<0){let t=r<0?0:this.stack[r]+4;if(this.index!=t)return this.yieldBuf(e.findChild(t,this.index,-1,0,4))}else{let t=e.buffer[this.index+3];if(t<(r<0?e.buffer.length:e.buffer[this.stack[r]+3]))return this.yieldBuf(t)}return r<0&&this.yield(this.buffer.parent.nextChild(this.buffer.index+t,t,0,4,this.mode))}nextSibling(){return this.sibling(1)}prevSibling(){return this.sibling(-1)}atLastNode(t){let e,r,{buffer:i}=this;if(i){if(t>0){if(this.index<i.buffer.buffer.length)return!1}else for(let t=0;t<this.index;t++)if(i.buffer.buffer[t+3]<this.index)return!1;({index:e,parent:r}=i)}else({index:e,_parent:r}=this._tree);for(;r;({index:e,_parent:r}=r))if(e>-1)for(let i=e+t,n=t<0?-1:r._tree.children.length;i!=n;i+=t){let t=r._tree.children[i];if(this.mode&a.IncludeAnonymous||t instanceof c||!t.type.isAnonymous||C(t))return!1}return!0}move(t,e){if(e&&this.enterChild(t,0,4))return!0;for(;;){if(this.sibling(t))return!0;if(this.atLastNode(t)||!this.parent())return!1}}next(t=!0){return this.move(1,t)}prev(t=!0){return this.move(-1,t)}moveTo(t,e=0){for(;(this.from==this.to||(e<1?this.from>=t:this.from>t)||(e>-1?this.to<=t:this.to<t))&&this.parent(););for(;this.enterChild(1,t,e););return this}get node(){if(!this.buffer)return this._tree;let t=this.bufferNode,e=null,r=0;if(t&&t.context==this.buffer)t:for(let i=this.index,n=this.stack.length;n>=0;){for(let s=t;s;s=s._parent)if(s.index==i){if(i==this.index)return s;e=s,r=n+1;break t}i=this.stack[--n]}for(let i=r;i<this.stack.length;i++)e=new w(this.buffer,e,this.stack[i]);return this.bufferNode=new w(this.buffer,e,this.index)}get tree(){return this.buffer?null:this._tree._tree}iterate(t,e){for(let r=0;;){let i=!1;if(this.type.isAnonymous||!1!==t(this)){if(this.firstChild()){r++;continue}this.type.isAnonymous||(i=!0)}for(;i&&e&&e(this),i=this.type.isAnonymous,!this.nextSibling();){if(!r)return;this.parent(),r--,i=!0}}}matchContext(t){if(!this.buffer)return y(this.node,t);let{buffer:e}=this.buffer,{types:r}=e.set;for(let i=t.length-1,n=this.stack.length-1;i>=0;n--){if(n<0)return y(this.node,t,i);let s=r[e.buffer[this.stack[n]]];if(!s.isAnonymous){if(t[i]&&t[i]!=s.name)return!1;i--}}return!0}}function C(t){return t.children.some((t=>t instanceof c||!t.type.isAnonymous||C(t)))}const S=new WeakMap;function A(t,e){if(!t.isAnonymous||e instanceof c||e.type!=t)return 1;let r=S.get(e);if(null==r){r=1;for(let i of e.children){if(i.type!=t||!(i instanceof u)){r=1;break}r+=A(t,i)}S.set(e,r)}return r}function I(t,e,r,i,n,s,o,l,h){let a=0;for(let c=i;c<n;c++)a+=A(t,e[c]);let f=Math.ceil(1.5*a/8),u=[],d=[];return function e(r,i,n,o,l){for(let a=n;a<o;){let n=a,c=i[a],p=A(t,r[a]);for(a++;a<o;a++){let e=A(t,r[a]);if(p+e>=f)break;p+=e}if(a==n+1){if(p>f){let t=r[n];e(t.children,t.positions,0,t.children.length,i[n]+l);continue}u.push(r[n])}else{let e=i[a-1]+r[a-1].length-c;u.push(I(t,r,i,n,a,c,e,null,h))}d.push(c+l-s)}}(e,r,i,n,0),(l||h)(u,d,o)}class M{constructor(t,e,r,i,n=!1,s=!1){this.from=t,this.to=e,this.tree=r,this.offset=i,this.open=(n?1:0)|(s?2:0)}get openStart(){return(1&this.open)>0}get openEnd(){return(2&this.open)>0}static addTree(t,e=[],r=!1){let i=[new M(0,t.length,t,0,!1,r)];for(let n of e)n.to>t.length&&i.push(n);return i}static applyChanges(t,e,r=128){if(!e.length)return t;let i=[],n=1,s=t.length?t[0]:null;for(let o=0,l=0,h=0;;o++){let a=o<e.length?e[o]:null,f=a?a.fromA:1e9;if(f-l>=r)for(;s&&s.from<f;){let e=s;if(l>=e.from||f<=e.to||h){let t=Math.max(e.from,l)-h,r=Math.min(e.to,f)-h;e=t>=r?null:new M(t,r,e.tree,e.offset+h,o>0,!!a)}if(e&&i.push(e),s.to>f)break;s=n<t.length?t[n++]:null}if(!a)break;l=a.toA,h=a.toA-a.toB}return i}}class O{startParse(t,e,i){return"string"==typeof t&&(t=new B(t)),i=i?i.length?i.map((t=>new r(t.from,t.to))):[new r(0,0)]:[new r(0,t.length)],this.createParse(t,e||[],i)}parse(t,e,r){let i=this.startParse(t,e,r);for(;;){let t=i.advance();if(t)return t}}}class B{constructor(t){this.string=t}get length(){return this.string.length}chunk(t){return this.string.slice(t)}get lineChunks(){return!1}read(t,e){return this.string.slice(t,e)}}new i({perNode:!0});let z=0;class E{constructor(t,e,r){this.set=t,this.base=e,this.modified=r,this.id=z++}static define(t){if(null==t?void 0:t.base)throw new Error("Can not derive from a modified tag");let e=new E([],null,[]);if(e.set.push(e),t)for(let r of t.set)e.set.push(r);return e}static defineModifier(){let t=new T;return e=>e.modified.indexOf(t)>-1?e:T.get(e.base||e,e.modified.concat(t).sort(((t,e)=>t.id-e.id)))}}let R=0;class T{constructor(){this.instances=[],this.id=R++}static get(t,e){if(!e.length)return t;let r=e[0].instances.find((r=>{return r.base==t&&(i=e,n=r.modified,i.length==n.length&&i.every(((t,e)=>t==n[e])));var i,n}));if(r)return r;let i=[],n=new E(i,t,e);for(let o of e)o.instances.push(n);let s=function(t){let e=[[]];for(let r=0;r<t.length;r++)for(let i=0,n=e.length;i<n;i++)e.push(e[i].concat(t[r]));return e.sort(((t,e)=>e.length-t.length))}(e);for(let o of t.set)if(!o.modified.length)for(let t of s)i.push(T.get(o,t));return n}}function j(t){let e=Object.create(null);for(let r in t){let i=t[r];Array.isArray(i)||(i=[i]);for(let t of r.split(" "))if(t){let r=[],n=2,s=t;for(let e=0;;){if("..."==s&&e>0&&e+3==t.length){n=1;break}let i=/^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(s);if(!i)throw new RangeError("Invalid path: "+t);if(r.push("*"==i[0]?"":'"'==i[0][0]?JSON.parse(i[0]):i[0]),e+=i[0].length,e==t.length)break;let o=t[e++];if(e==t.length&&"!"==o){n=0;break}if("/"!=o)throw new RangeError("Invalid path: "+t);s=t.slice(e)}let o=r.length-1,l=r[o];if(!l)throw new RangeError("Invalid path: "+t);let h=new U(i,n,o>0?r.slice(0,o):null);e[l]=h.sort(e[l])}}return P.add(e)}const P=new i;class U{constructor(t,e,r,i){this.tags=t,this.mode=e,this.context=r,this.next=i}get opaque(){return 0==this.mode}get inherit(){return 1==this.mode}sort(t){return!t||t.depth<this.depth?(this.next=t,this):(t.next=this.sort(t.next),t)}get depth(){return this.context?this.context.length:0}}function W(t,e){let r=Object.create(null);for(let s of t)if(Array.isArray(s.tag))for(let t of s.tag)r[t.id]=s.class;else r[s.tag.id]=s.class;let{scope:i,all:n=null}=e||{};return{style:t=>{let e=n;for(let i of t)for(let t of i.set){let i=r[t.id];if(i){e=e?e+" "+i:i;break}}return e},scope:i}}function q(t,e,r,i=0,n=t.length){let s=new K(i,Array.isArray(e)?e:[e],r);s.highlightRange(t.cursor(),i,n,"",s.highlighters),s.flush(n)}U.empty=new U([],2,null);class K{constructor(t,e,r){this.at=t,this.highlighters=e,this.span=r,this.class=""}startSpan(t,e){e!=this.class&&(this.flush(t),t>this.at&&(this.at=t),this.class=e)}flush(t){t>this.at&&this.class&&this.span(this.at,t,this.class)}highlightRange(t,e,r,n,s){let{type:o,from:l,to:h}=t;if(l>=r||h<=e)return;o.isTop&&(s=this.highlighters.filter((t=>!t.scope||t.scope(o))));let a=n,f=function(t){let e=t.type.prop(P);for(;e&&e.context&&!t.matchContext(e.context);)e=e.next;return e||null}(t)||U.empty,u=function(t,e){let r=null;for(let i of t){let t=i.style(e);t&&(r=r?r+" "+t:t)}return r}(s,f.tags);if(u&&(a&&(a+=" "),a+=u,1==f.mode&&(n+=(n?" ":"")+u)),this.startSpan(Math.max(e,l),a),f.opaque)return;let d=t.tree&&t.tree.prop(i.mounted);if(d&&d.overlay){let i=t.node.enter(d.overlay[0].from+l,1),o=this.highlighters.filter((t=>!t.scope||t.scope(d.tree.type))),f=t.firstChild();for(let u=0,c=l;;u++){let p=u<d.overlay.length?d.overlay[u]:null,g=p?p.from+l:h,m=Math.max(e,c),x=Math.min(r,g);if(m<x&&f)for(;t.from<x&&(this.highlightRange(t,m,x,n,s),this.startSpan(Math.min(x,t.to),a),!(t.to>=g)&&t.nextSibling()););if(!p||g>r)break;c=p.to+l,c>e&&(this.highlightRange(i.cursor(),Math.max(e,p.from+l),Math.min(r,c),"",o),this.startSpan(Math.min(r,c),a))}f&&t.parent()}else if(t.firstChild()){d&&(n="");do{if(!(t.to<=e)){if(t.from>=r)break;this.highlightRange(t,e,r,n,s),this.startSpan(Math.min(r,t.to),a)}}while(t.nextSibling());t.parent()}}}const J=E.define,L=J(),V=J(),H=J(V),D=J(V),$=J(),F=J($),G=J($),Q=J(),X=J(Q),Y=J(),Z=J(),tt=J(),et=J(tt),rt=J(),it={comment:L,lineComment:J(L),blockComment:J(L),docComment:J(L),name:V,variableName:J(V),typeName:H,tagName:J(H),propertyName:D,attributeName:J(D),className:J(V),labelName:J(V),namespace:J(V),macroName:J(V),literal:$,string:F,docString:J(F),character:J(F),attributeValue:J(F),number:G,integer:J(G),float:J(G),bool:J($),regexp:J($),escape:J($),color:J($),url:J($),keyword:Y,self:J(Y),null:J(Y),atom:J(Y),unit:J(Y),modifier:J(Y),operatorKeyword:J(Y),controlKeyword:J(Y),definitionKeyword:J(Y),moduleKeyword:J(Y),operator:Z,derefOperator:J(Z),arithmeticOperator:J(Z),logicOperator:J(Z),bitwiseOperator:J(Z),compareOperator:J(Z),updateOperator:J(Z),definitionOperator:J(Z),typeOperator:J(Z),controlOperator:J(Z),punctuation:tt,separator:J(tt),bracket:et,angleBracket:J(et),squareBracket:J(et),paren:J(et),brace:J(et),content:Q,heading:X,heading1:J(X),heading2:J(X),heading3:J(X),heading4:J(X),heading5:J(X),heading6:J(X),contentSeparator:J(Q),list:J(Q),quote:J(Q),emphasis:J(Q),strong:J(Q),link:J(Q),monospace:J(Q),strikethrough:J(Q),inserted:J(),deleted:J(),changed:J(),invalid:J(),meta:rt,documentMeta:J(rt),annotation:J(rt),processingInstruction:J(rt),definition:E.defineModifier(),constant:E.defineModifier(),function:E.defineModifier(),standard:E.defineModifier(),local:E.defineModifier(),special:E.defineModifier()};W([{tag:it.link,class:"tok-link"},{tag:it.heading,class:"tok-heading"},{tag:it.emphasis,class:"tok-emphasis"},{tag:it.strong,class:"tok-strong"},{tag:it.keyword,class:"tok-keyword"},{tag:it.atom,class:"tok-atom"},{tag:it.bool,class:"tok-bool"},{tag:it.url,class:"tok-url"},{tag:it.labelName,class:"tok-labelName"},{tag:it.inserted,class:"tok-inserted"},{tag:it.deleted,class:"tok-deleted"},{tag:it.literal,class:"tok-literal"},{tag:it.string,class:"tok-string"},{tag:it.number,class:"tok-number"},{tag:[it.regexp,it.escape,it.special(it.string)],class:"tok-string2"},{tag:it.variableName,class:"tok-variableName"},{tag:it.local(it.variableName),class:"tok-variableName tok-local"},{tag:it.definition(it.variableName),class:"tok-variableName tok-definition"},{tag:it.special(it.variableName),class:"tok-variableName2"},{tag:it.definition(it.propertyName),class:"tok-propertyName tok-definition"},{tag:it.typeName,class:"tok-typeName"},{tag:it.namespace,class:"tok-namespace"},{tag:it.className,class:"tok-className"},{tag:it.macroName,class:"tok-macroName"},{tag:it.propertyName,class:"tok-propertyName"},{tag:it.operator,class:"tok-operator"},{tag:it.comment,class:"tok-comment"},{tag:it.meta,class:"tok-meta"},{tag:it.invalid,class:"tok-invalid"},{tag:it.punctuation,class:"tok-punctuation"}]);export{a as I,o as N,O as P,u as T,i as a,W as b,M as c,q as h,j as s,it as t};
//# sourceMappingURL=@lezer-Dc3lL2az.js.map