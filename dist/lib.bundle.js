(()=>{"use strict";var e={908:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.BitmaskArchetypeResolver=void 0;const r=n(423);t.BitmaskArchetypeResolver=function(){const e=new Map,t={get:t=>(e.has(t)||e.set(t,e.size),r.Bitmask.fromBitIndex(e.get(t))),getAll:e=>r.Bitmask.merge(e.map((e=>t.get(e)))),add:(e,t)=>r.Bitmask.add(e,t),remove:(e,t)=>r.Bitmask.remove(e,t),contains:(e,t)=>r.Bitmask.contains(e,t),merge:e=>r.Bitmask.merge(e)};return t}},423:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Bitmask=void 0,t.Bitmask={fromBitIndex:e=>1<<e,add:(e,t)=>e|t,remove:(e,t)=>e&~t,contains:(e,t)=>(e&t)===t,merge:e=>{let t=0;for(let n of e)t|=n;return t}}},974:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Component=void 0,t.Component=(e,t)=>({name:e,data:t})},630:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Entity=void 0,t.Entity=function(e,t,n){const r=new Map;let o=0;const a={id:e,getArchetype:()=>o,getComponent:e=>r.get(e),hasComponent:e=>r.has(e),addComponent:e=>{r.set(e.name,e),o=t.add(o,t.get(e.name)),n.update(a)},deleteComponent:e=>{r.delete(e.name),o=t.remove(o,t.get(e.name)),n.update(a)}};return a}},22:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.EntitiesByQueryIndex=void 0,t.EntitiesByQueryIndex=function(){const e=new Map;return{get:t=>e.get(t),set:(t,n)=>{e.set(t,n)},update:t=>{e.clear()}}}},464:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.IndexedQuery=t.ArchetypeQuery=void 0,t.ArchetypeQuery=function(e,t){const n={match:n=>t.contains(n.getArchetype(),e),filter:e=>e.filter(n.match)};return n},t.IndexedQuery=function(e,t,n){return{match:e.match,filter:r=>{const o=n.get(t);if(!o){const o=e.filter(r);return n.set(t,o),o}return o}}}},289:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.System=void 0,t.System=(e,t,n)=>({name:e,query:t,update:e=>{n(t.filter(e))}})}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var a=t[r]={exports:{}};return e[r](a,a.exports,n),a.exports}n(908),n(22),n(464),n(974),n(289),n(630)})();