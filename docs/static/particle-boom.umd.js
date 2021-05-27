!function(t,i){t.getElementById("livereloadscript")||((i=t.createElement("script")).async=1,i.src="//"+(window.location.host||"localhost").split(":")[0]+":35729/livereload.js?snipver=1",i.id="livereloadscript",t.getElementsByTagName("head")[0].appendChild(i))}(window.document),function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):(t="undefined"!=typeof globalThis?globalThis:t||self).ParticleBoom=i()}(this,(function(){"use strict";var t=function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")},i=function(){function t(t,i){for(var e=0;e<i.length;e++){var a=i[e];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}return function(i,e,a){return e&&t(i.prototype,e),a&&t(i,a),i}}(),e=function(t){var i=t||null;if("string"==typeof t&&(i=document.querySelector(t)),i)return t;throw new Error("请传入canvas元素或选择器!")},a=function(){function a(i){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;if(t(this,a),!a.hasBoom[r]){a.hasBoom[r]=!1,this.canvas=e(i),this.w=this.canvas.width,this.h=this.canvas.height,this.ctx=this.canvas.getContext("2d");var o=Math.min(this.w,this.h),h=parseInt(o/100),s=4*h,l=6*h;this.options=Object.assign({speed:60,gap:s,radius:h,minVx:-l,maxVx:l,minVy:-l,maxVy:l,edgeOpacity:!1,onBoomEnd:function(){console.log("爆炸结束了")},filterFunc:function(t){var i=t.r,e=t.g,a=t.b;return 0!==t.a&&!(255===i&&255===e&&255===a)}},n),this.key=r,this.init()}}return i(a,[{key:"init",value:function(){var t=this.initRandomVx(this.options),i=this.initRandomVy(this.options);a.hasBoom[this.key]=!0;var e=this.initParticle(t,i,this.options);this.intervalFunc(this.canvas,this.ctx,e,this.options)}},{key:"initRandomVy",value:function(t){for(var i=[],e=t.minVy;e<=t.maxVy;e++)i.push(e);return i}},{key:"initRandomVx",value:function(t){for(var i=[],e=t.minVx;e<=t.maxVx;e++)i.push(e);return i}},{key:"initParticle",value:function(t,i,e){for(var a=[],n=e.radius,r=e.gap,o=this.ctx,h=this.w,s=this.h,l=o.getImageData(0,0,h,s).data,d=0;d<s;d+=r)for(var c=0;c<h;c+=r){var u=4*(h*d+c),f=l[u],v=l[u+1],g=l[u+2],y=l[u+3]/255;this.options.filterFunc({r:f,g:v,b:g,a:y})&&a.push({translateX:n/2,translateY:n/2,x:c,y:d,g:2.5+Math.random(),vx:t[Math.floor(Math.random()*t.length)],vy:i[Math.floor(Math.random()*i.length)],color:"rgba("+f+","+v+","+g+","+y+")"})}return a}},{key:"intervalFunc",value:function(t,i,e,a){var n=this;this.interval=setInterval((function(){n.drawParticle(t,i,e,a),n.updateBalls(t,e,a)}),a.speed)}},{key:"drawParticle",value:function(t,i,e,n){var r=0;i.clearRect(0,0,t.width,t.height);for(var o=0;o<e.length;o++)i.translate(e[o].translateX,e[o].color.translateY),i.fillStyle=e[o].color,i.beginPath(),i.arc(e[o].x,e[o].y,n.radius,0,2*Math.PI),i.closePath(),i.fill(),i.translate(-e[o].translateX,-e[o].color.translateY),(e[o].x<0-n.radius||e[o].x>t.width+n.radius||e[o].y>t.height+n.radius||e[o].y<0-n.radius)&&r++;r===e.length&&(clearInterval(this.interval),a.hasBoom[this.key]=!1,this.options.onBoomEnd())}},{key:"updateBalls",value:function(t,i,e){for(var a=0;a<i.length;a++)if(!(i[a].x<-e.radius||i[a].x>t.width+e.radius||i[a].y<-e.radius||i[a].y>t.height+e.radius)&&(i[a].x+=i[a].vx,i[a].y+=i[a].vy,i[a].vy+=i[a].g,e.edgeOpacity)){var n=/(rgba\(\d+,\d+,\d+,)(-?(\d+\.)?\d+)/g.exec(i[a].color),r=n[1],o=n[2];if(parseInt(n[2]<.1))continue;o=i[a].x+e.radius<=t.width/2&&i[a].y+e.radius<=t.height/2?i[a].x/t.width*2*(i[a].y/t.height*2):i[a].x+e.radius>=t.width/2&&i[a].y+e.radius<=t.height/2?(t.width-i[a].x)/t.width*2*(i[a].y/t.height*2):i[a].x+e.radius<=t.width/2&&i[a].y+e.radius>=t.height/2?i[a].x/t.width*2*((t.height-i[a].y)/t.height*2):(t.width-i[a].x)/t.width*2*((t.height-i[a].y)/t.height*2),o*=1.2+Math.random(),i[a].color=""+r+o+")"}}}]),a}();return a.hasBoom={},a.drawPic=function(t,i){var a=e(t),n=a.getContext("2d"),r=new Image;return r.src=i,new Promise((function(t,i){try{r.onload=function(){a.width=r.width,a.height=r.height,n.drawImage(r,0,0),t(a)}}catch(t){i(t)}}))},a}));