webpackJsonp([1],{NHnr:function(t,o,i){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var e=i("7+uW"),r=i("//Fk"),n=i.n(r);function s(){}s.prototype.requestWebcamFeed=function(){return navigator.mediaDevices.getUserMedia({audio:!1,video:!0}).then(function(t){return t})};var a=s,d={Image:function(t,o,i){this.width=t||0,this.height=o||0,this.data=i||[]},grayscale:function(t,o){for(var i=t.data,e=o.data,r=i.length,n=0,s=0;n<r;n+=4)e[s++]=.299*i[n]+.587*i[n+1]+.114*i[n+2]+.5&255;return o.width=t.width,o.height=t.height,o},threshold:function(t,o,i){var e=t.data,r=o.data,n=e.length,s=[],a=void 0;for(a=0;a<256;++a)s[a]=a<=i?0:255;for(a=0;a<n;++a)r[a]=s[e[a]];return o.width=t.width,o.height=t.height,o},adaptiveThreshold:function(t,o,i,e){var r=t.data,n=o.data,s=r.length,a=[],h=void 0;for(d.stackBoxBlur(t,o,i),h=0;h<768;++h)a[h]=h-255<=-e?255:0;for(h=0;h<s;++h)n[h]=a[r[h]-n[h]+255];return o.width=t.width,o.height=t.height,o},otsu:function(t){var o=t.data,i=o.length,e=[],r=0,n=0,s=0,a=0,d=0,h=0,f=void 0,c=void 0,v=void 0;for(v=0;v<256;++v)e[v]=0;for(v=0;v<i;++v)e[o[v]]++;for(v=0;v<256;++v)n+=e[v]*v;for(v=0;v<256;++v)if(0!==(a+=e[v])){if(0===(d=i-a))break;(c=a*d*(f=(s+=e[v]*v)/a-(n-s)/d)*f)>h&&(h=c,r=v)}return r},stackBoxBlurMult:[1,171,205,293,57,373,79,137,241,27,391,357,41,19,283,265],stackBoxBlurShift:[0,9,10,11,9,12,10,11,12,9,13,13,10,9,13,13],BlurStack:function(){this.color=0,this.next=null},stackBoxBlur:function(t,o,i){var e,r=t.data,n=o.data,s=t.height,a=t.width,h=s-1,f=a-1,c=i+i+1,v=i+1,u=d.stackBoxBlurMult[i],l=d.stackBoxBlurShift[i],x=void 0,g=void 0,p=void 0,b=void 0,y=void 0,m=void 0,w=void 0,M=void 0,j=void 0;for(x=e=new d.BlurStack,j=1;j<c;++j)x=x.next=new d.BlurStack;for(x.next=e,b=0,M=0;M<s;++M){for(y=b,p=v*(g=r[b]),x=e,j=0;j<v;++j)x.color=g,x=x.next;for(j=1;j<v;++j)x.color=r[b+j],p+=x.color,x=x.next;for(x=e,w=0;w<a;++w)n[b++]=p*u>>>l,m=y+((m=w+v)<f?m:f),p-=x.color-r[m],x.color=r[m],x=x.next}for(w=0;w<a;++w){for(y=(b=w)+a,p=v*(g=n[b]),x=e,j=0;j<v;++j)x.color=g,x=x.next;for(j=1;j<v;++j)x.color=n[y],p+=x.color,x=x.next,y+=a;for(x=e,M=0;M<s;++M)n[b]=p*u>>>l,m=w+((m=M+v)<h?m:h)*a,p-=x.color-n[m],x.color=n[m],x=x.next,b+=a}return o},gaussianBlur:function(t,o,i,e){var r=d.gaussianKernel(e);return o.width=t.width,o.height=t.height,i.width=t.width,i.height=t.height,d.gaussianBlurFilter(t,i,r,!0),d.gaussianBlurFilter(i,o,r,!1),o},gaussianBlurFilter:function(t,o,i,e){var r=t.data,n=o.data,s=t.height,a=t.width,d=0,h=i.length>>1,f=void 0,c=void 0,v=void 0,u=void 0,l=void 0;for(v=0;v<s;++v)for(u=0;u<a;++u){for(c=0,l=-h;l<=h;++l)e?(f=d+l,u+l<0?f=d:u+l>=a&&(f=d)):(f=d+l*a,v+l<0?f=d:v+l>=s&&(f=d)),c+=i[h+l]*r[f];n[d++]=e?c:c+.5&255}return o},gaussianKernel:function(t){var o=[],i=void 0,e=void 0,r=void 0,n=void 0,s=void 0,a=void 0;if(t<=7&&t%2==1)o=[[1],[.25,.5,.25],[.0625,.25,.375,.25,.0625],[.03125,.109375,.21875,.28125,.21875,.109375,.03125]][t>>1];else{for(r=-.5/((e=.8+.3*((i=.5*(t-1))-1))*e),n=0,a=0;a<t;++a)s=a-i,n+=o[a]=Math.exp(r*s*s);for(n=1/n,a=0;a<t;++a)o[a]*=n}return o},findContours:function(t,o){var i,e,r=t.width,n=t.height,s=[],a=void 0,h=void 0,f=void 0,c=void 0,v=void 0,u=void 0,l=void 0;for(i=d.binaryBorder(t,o),e=d.neighborhoodDeltas(r+2),a=r+3,f=1,u=0;u<n;++u,a+=2)for(l=0;l<r;++l,++a)0!==(h=i[a])&&(c=v=!1,1===h&&0===i[a-1]?c=!0:h>=1&&0===i[a+1]&&(v=!0),(c||v)&&(++f,s.push(d.borderFollowing(i,a,f,{x:l,y:u},v,e))));return s},borderFollowing:function(t,o,i,e,r,n){var s=[],a=void 0,h=void 0,f=void 0,c=void 0,v=void 0;s.hole=r,c=v=r?0:4;do{if(0!==t[a=o+n[c=c-1&7]])break}while(c!==v);if(c===v)t[o]=-i,s.push({x:e.x,y:e.y});else for(h=o;;){v=c;do{f=h+n[++c]}while(0===t[f]);if((c&=7)-1>>>0<v>>>0?t[h]=-i:1===t[h]&&(t[h]=i),s.push({x:e.x,y:e.y}),e.x+=d.neighborhood[c][0],e.y+=d.neighborhood[c][1],f===o&&h===a)break;h=f,c=c+4&7}return s},neighborhood:[[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1],[1,1]],neighborhoodDeltas:function(t){for(var o=[],i=d.neighborhood.length,e=0;e<i;++e)o[e]=d.neighborhood[e][0]+d.neighborhood[e][1]*t;return o.concat(o)},approxPolyDP:function(t,o){var i={start_index:0,end_index:0},e={start_index:0,end_index:0},r=[],n=[],s=t.length,a=void 0,d=void 0,h=void 0,f=void 0,c=void 0,v=void 0,u=void 0,l=void 0,x=void 0,g=void 0,p=void 0;for(o*=o,p=0,x=0;x<3;++x)for(c=0,d=t[p=(p+e.start_index)%s],++p===s&&(p=0),g=1;g<s;++g)a=t[p],++p===s&&(p=0),(f=(u=a.x-d.x)*u+(l=a.y-d.y)*l)>c&&(c=f,e.start_index=g);for(c<=o?r.push({x:d.x,y:d.y}):(i.start_index=p,i.end_index=e.start_index+=i.start_index,e.start_index-=e.start_index>=s?s:0,e.end_index=i.start_index,e.end_index<e.start_index&&(e.end_index+=s),n.push({start_index:e.start_index,end_index:e.end_index}),n.push({start_index:i.start_index,end_index:i.end_index}));0!==n.length;){if(h=t[(i=n.pop()).end_index%s],d=t[p=i.start_index%s],++p===s&&(p=0),i.end_index<=i.start_index+1)v=!0;else{for(c=0,u=h.x-d.x,l=h.y-d.y,x=i.start_index+1;x<i.end_index;++x)a=t[p],++p===s&&(p=0),(f=Math.abs((a.y-d.y)*u-(a.x-d.x)*l))>c&&(c=f,e.start_index=x);v=c*c<=o*(u*u+l*l)}v?r.push({x:d.x,y:d.y}):(e.end_index=i.end_index,i.end_index=e.start_index,n.push({start_index:e.start_index,end_index:e.end_index}),n.push({start_index:i.start_index,end_index:i.end_index}))}return r},warp:function(t,o,i,e){var r,n=t.data,s=o.data,a=t.width,h=t.height,f=0,c=void 0,v=void 0,u=void 0,l=void 0,x=void 0,g=void 0,p=void 0,b=void 0,y=void 0,m=void 0,w=void 0,M=void 0,j=void 0,_=void 0,P=void 0,k=void 0,$=void 0,V=void 0,B=void 0,q=void 0,D=void 0;for(M=(r=d.getPerspectiveTransform(i,e-1))[8],j=r[2],_=r[5],q=0;q<e;++q)for(P=M+=r[7],k=j+=r[1],$=_+=r[4],D=0;D<e;++D)P+=r[6],k+=r[0],B=($+=r[3])/P,v=(c=(V=k/P)>>>0)===a-1?c:c+1,l=1-(u=V-c),p=1-(g=B-(x=B>>>0)),b=y=x*a,m=w=(x===h-1?x:x+1)*a,s[f++]=p*(l*n[b+c]+u*n[y+v])+g*(l*n[m+c]+u*n[w+v])&255;return o.width=e,o.height=e,o},getPerspectiveTransform:function(t,o){var i=d.square2quad(t);return i[0]/=o,i[1]/=o,i[3]/=o,i[4]/=o,i[6]/=o,i[7]/=o,i},square2quad:function(t){var o,i,e=[],r=void 0,n=void 0,s=void 0,a=void 0,d=void 0;return o=t[0].x-t[1].x+t[2].x-t[3].x,i=t[0].y-t[1].y+t[2].y-t[3].y,0===o&&0===i?(e[0]=t[1].x-t[0].x,e[1]=t[2].x-t[1].x,e[2]=t[0].x,e[3]=t[1].y-t[0].y,e[4]=t[2].y-t[1].y,e[5]=t[0].y,e[6]=0,e[7]=0,e[8]=1):(r=t[1].x-t[2].x,n=t[3].x-t[2].x,s=t[1].y-t[2].y,d=r*(a=t[3].y-t[2].y)-n*s,e[6]=(o*a-n*i)/d,e[7]=(r*i-o*s)/d,e[8]=1,e[0]=t[1].x-t[0].x+e[6]*t[1].x,e[1]=t[3].x-t[0].x+e[7]*t[3].x,e[2]=t[0].x,e[3]=t[1].y-t[0].y+e[6]*t[1].y,e[4]=t[3].y-t[0].y+e[7]*t[3].y,e[5]=t[0].y),e},isContourConvex:function(t){var o=0,i=!0,e=t.length,r=0,n=0,s=void 0,a=void 0,d=void 0,h=void 0,f=void 0,c=void 0,v=void 0,u=void 0;for(a=t[e-1],f=(s=t[0]).x-a.x,c=s.y-a.y;r<e;++r){if(++n===e&&(n=0),a=s,v=(s=t[n]).x-a.x,3===(o|=(h=(u=s.y-a.y)*f)>(d=v*c)?1:h<d?2:3)){i=!1;break}f=v,c=u}return i},perimeter:function(t){for(var o=t.length,i=0,e=o-1,r=0,n=void 0,s=void 0;i<o;e=i++)n=t[i].x-t[e].x,s=t[i].y-t[e].y,r+=Math.sqrt(n*n+s*s);return r},minEdgeLength:function(t){for(var o=t.length,i=0,e=o-1,r=1/0,n=void 0,s=void 0,a=void 0;i<o;e=i++)(n=(s=t[i].x-t[e].x)*s+(a=t[i].y-t[e].y)*a)<r&&(r=n);return Math.sqrt(r)},countNonZero:function(t,o){var i=t.data,e=o.height,r=o.width,n=o.x+o.y*t.width,s=t.width-r,a=0,d=void 0,h=void 0;for(d=0;d<e;++d){for(h=0;h<r;++h)0!==i[n++]&&++a;n+=s}return a},binaryBorder:function(t,o){var i=t.data,e=t.height,r=t.width,n=0,s=0,a=void 0,d=void 0;for(d=-2;d<r;++d)o[s++]=0;for(a=0;a<e;++a){for(o[s++]=0,d=0;d<r;++d)o[s++]=0===i[n++]?0:1;o[s++]=0}for(d=-2;d<r;++d)o[s++]=0;return o}},h=d,f={Marker:function(t,o){this.id=t,this.corners=o},Detector:function(){this.grey=new h.Image,this.thres=new h.Image,this.homography=new h.Image,this.binary=[],this.contours=[],this.polys=[],this.candidates=[]}};f.Detector.prototype.detect=function(t){return h.grayscale(t,this.grey),h.adaptiveThreshold(this.grey,this.thres,2,7),this.contours=h.findContours(this.thres,this.binary),this.candidates=this.findCandidates(this.contours,.2*t.width,.05,10),this.candidates=this.clockwiseCorners(this.candidates),this.candidates=this.notTooNear(this.candidates,10),this.findMarkers(this.grey,this.candidates,49)},f.Detector.prototype.findCandidates=function(t,o,i,e){var r=[],n=t.length,s=void 0,a=void 0,d=void 0;for(this.polys=[],d=0;d<n;++d)(s=t[d]).length>=o&&(a=h.approxPolyDP(s,s.length*i),this.polys.push(a),4===a.length&&h.isContourConvex(a)&&h.minEdgeLength(a)>=e&&r.push(a));return r},f.Detector.prototype.clockwiseCorners=function(t){var o=t.length,i=void 0,e=void 0,r=void 0,n=void 0,s=void 0;for(s=0;s<o;++s)i=t[s][1].x-t[s][0].x,r=t[s][1].y-t[s][0].y,e=t[s][2].x-t[s][0].x,i*(t[s][2].y-t[s][0].y)-r*e<0&&(n=t[s][1],t[s][1]=t[s][3],t[s][3]=n);return t},f.Detector.prototype.notTooNear=function(t,o){var i=[],e=t.length,r=void 0,n=void 0,s=void 0,a=void 0,d=void 0,f=void 0;for(a=0;a<e;++a)for(d=a+1;d<e;++d){for(r=0,f=0;f<4;++f)r+=(n=t[a][f].x-t[d][f].x)*n+(s=t[a][f].y-t[d][f].y)*s;r/4<o*o&&(h.perimeter(t[a])<h.perimeter(t[d])?t[a].tooNear=!0:t[d].tooNear=!0)}for(a=0;a<e;++a)t[a].tooNear||i.push(t[a]);return i},f.Detector.prototype.findMarkers=function(t,o,i){var e=[],r=o.length,n=void 0,s=void 0,a=void 0;for(a=0;a<r;++a)n=o[a],h.warp(t,this.homography,n,i),h.threshold(this.homography,this.homography,h.otsu(this.homography)),(s=this.getMarker(this.homography,n))&&e.push(s);return e},f.Detector.prototype.getMarker=function(t,o){var i=t.width/7>>>0,e=i*i>>1,r=[],n=[],s=[],a=void 0,d=void 0,c=void 0,v=void 0,u=void 0;for(v=0;v<7;++v)for(c=0===v||6===v?1:6,u=0;u<7;u+=c)if(a={x:u*i,y:v*i,width:i,height:i},h.countNonZero(t,a)>e)return null;for(v=0;v<5;++v)for(r[v]=[],u=0;u<5;++u)a={x:(u+1)*i,y:(v+1)*i,width:i,height:i},r[v][u]=h.countNonZero(t,a)>e?1:0;for(n[0]=r,s[0]=this.hammingDistance(n[0]),d={first:s[0],second:0},v=1;v<4;++v)n[v]=this.rotate(n[v-1]),s[v]=this.hammingDistance(n[v]),s[v]<d.first&&(d.first=s[v],d.second=v);return 0!==d.first?null:new f.Marker(this.mat2id(n[d.second]),this.rotate2(o,4-d.second))},f.Detector.prototype.hammingDistance=function(t){var o=[[1,0,0,0,0],[1,0,1,1,1],[0,1,0,0,1],[0,1,1,1,0]],i=0,e=void 0,r=void 0,n=void 0,s=void 0,a=void 0;for(n=0;n<5;++n){for(r=1/0,s=0;s<4;++s){for(e=0,a=0;a<5;++a)e+=t[n][a]===o[s][a]?0:1;e<r&&(r=e)}i+=r}return i},f.Detector.prototype.mat2id=function(t){var o=0,i=void 0;for(i=0;i<5;++i)o<<=1,o|=t[i][1],o<<=1,o|=t[i][3];return o},f.Detector.prototype.rotate=function(t){var o=[],i=t.length,e=void 0,r=void 0;for(e=0;e<i;++e)for(o[e]=[],r=0;r<t[e].length;++r)o[e][r]=t[t[e].length-r-1][e];return o},f.Detector.prototype.rotate2=function(t,o){var i=[],e=t.length,r=void 0;for(r=0;r<e;++r)i[r]=t[(o+r)%e];return i};var c=f,v={svdcmp:function(t,o,i,e,r){var n=void 0,s=void 0,a=void 0,d=void 0,h=void 0,f=void 0,c=void 0,u=void 0,l=0,x=void 0,g=void 0,p=0,b=void 0,y=void 0,m=0,w=void 0,M=void 0,j=void 0,_=[];for(s=0;s<i;++s){if(c=s+1,_[s]=m*p,p=y=m=0,s<o){for(f=s;f<o;++f)m+=Math.abs(t[f][s]);if(0!==m){for(f=s;f<o;++f)t[f][s]/=m,y+=t[f][s]*t[f][s];for(b=(g=t[s][s])*(p=-v.sign(Math.sqrt(y),g))-y,t[s][s]=g-p,d=c;d<i;++d){for(y=0,f=s;f<o;++f)y+=t[f][s]*t[f][d];for(g=y/b,f=s;f<o;++f)t[f][d]+=g*t[f][s]}for(f=s;f<o;++f)t[f][s]*=m}}if(e[s]=m*p,p=y=m=0,s<o&&s!==i-1){for(f=c;f<i;++f)m+=Math.abs(t[s][f]);if(0!==m){for(f=c;f<i;++f)t[s][f]/=m,y+=t[s][f]*t[s][f];for(b=(g=t[s][c])*(p=-v.sign(Math.sqrt(y),g))-y,t[s][c]=g-p,f=c;f<i;++f)_[f]=t[s][f]/b;for(d=c;d<o;++d){for(y=0,f=c;f<i;++f)y+=t[d][f]*t[s][f];for(f=c;f<i;++f)t[d][f]+=y*_[f]}for(f=c;f<i;++f)t[s][f]*=m}}l=Math.max(l,Math.abs(e[s])+Math.abs(_[s]))}for(s=i-1;s>=0;--s){if(s<i-1){if(0!==p){for(d=c;d<i;++d)r[d][s]=t[s][d]/t[s][c]/p;for(d=c;d<i;++d){for(y=0,f=c;f<i;++f)y+=t[s][f]*r[f][d];for(f=c;f<i;++f)r[f][d]+=y*r[f][s]}}for(d=c;d<i;++d)r[s][d]=r[d][s]=0}r[s][s]=1,p=_[s],c=s}for(s=Math.min(i,o)-1;s>=0;--s){for(c=s+1,p=e[s],d=c;d<i;++d)t[s][d]=0;if(0!==p){for(p=1/p,d=c;d<i;++d){for(y=0,f=c;f<o;++f)y+=t[f][s]*t[f][d];for(g=y/t[s][s]*p,f=s;f<o;++f)t[f][d]+=g*t[f][s]}for(d=s;d<o;++d)t[d][s]*=p}else for(d=s;d<o;++d)t[d][s]=0;++t[s][s]}for(f=i-1;f>=0;--f)for(a=1;a<=30;++a){for(n=!0,c=f;c>=0;--c){if(u=c-1,Math.abs(_[c])+l===l){n=!1;break}if(Math.abs(e[u])+l===l)break}if(n)for(x=0,y=1,s=c;s<=f&&(g=y*_[s],Math.abs(g)+l!==l);++s)for(p=e[s],b=v.pythag(g,p),e[s]=b,x=p*(b=1/b),y=-g*b,d=1;d<=o;++d)M=t[d][u],j=t[d][s],t[d][u]=M*x+j*y,t[d][s]=j*x-M*y;if(j=e[f],c===f){if(j<0)for(e[f]=-j,d=0;d<i;++d)r[d][f]=-r[d][f];break}if(30===a)return!1;for(w=e[c],g=(((M=e[u=f-1])-j)*(M+j)+((p=_[u])-(b=_[f]))*(p+b))/(2*b*M),p=v.pythag(g,1),g=((w-j)*(w+j)+b*(M/(g+v.sign(p,g))-b))/w,x=y=1,d=c;d<=u;++d){for(p=_[s=d+1],M=e[s],b=y*p,p*=x,j=v.pythag(g,b),_[d]=j,g=w*(x=g/j)+p*(y=b/j),p=p*x-w*y,b=M*y,M*=x,h=0;h<i;++h)w=r[h][d],j=r[h][s],r[h][d]=w*x+j*y,r[h][s]=j*x-w*y;for(j=v.pythag(g,b),e[d]=j,0!==j&&(x=g*(j=1/j),y=b*j),g=x*p+y*M,w=x*M-y*p,h=0;h<o;++h)M=t[h][d],j=t[h][s],t[h][d]=M*x+j*y,t[h][s]=j*x-M*y}_[c]=0,_[f]=g,e[f]=w}return!0},pythag:function(t,o){var i=Math.abs(t),e=Math.abs(o),r=void 0;return i>e?(r=e/i,i*Math.sqrt(1+r*r)):0===e?0:(r=i/e,e*Math.sqrt(1+r*r))},sign:function(t,o){return o>=0?Math.abs(t):-Math.abs(t)}},u=v,l={Posit:function(t,o){this.objectPoints=this.buildModel(t),this.focalLength=o,this.objectVectors=[],this.objectNormal=[],this.objectMatrix=[[],[],[]],this.init()}};l.Posit.prototype.buildModel=function(t){var o=t/2;return[[-o,o,0],[o,o,0],[o,-o,0],[-o,-o,0]]},l.Posit.prototype.init=function(){var t=this.objectPoints.length,o=[],i=[],e=0,r=2,n=void 0;for(n=0;n<t;++n)this.objectVectors[n]=[this.objectPoints[n][0]-this.objectPoints[0][0],this.objectPoints[n][1]-this.objectPoints[0][1],this.objectPoints[n][2]-this.objectPoints[0][2]],o[n]=[this.objectVectors[n][0],this.objectVectors[n][1],this.objectVectors[n][2]];for(;0===e;)i[0]=this.objectVectors[1][1]*this.objectVectors[r][2]-this.objectVectors[1][2]*this.objectVectors[r][1],i[1]=this.objectVectors[1][2]*this.objectVectors[r][0]-this.objectVectors[1][0]*this.objectVectors[r][2],i[2]=this.objectVectors[1][0]*this.objectVectors[r][1]-this.objectVectors[1][1]*this.objectVectors[r][0],e=Math.sqrt(i[0]*i[0]+i[1]*i[1]+i[2]*i[2]),++r;for(n=0;n<3;++n)this.objectNormal[n]=i[n]/e;l.pseudoInverse(o,t,this.objectMatrix)},l.Posit.prototype.pose=function(t){var o,i,e=[[],[],[]],r=[[],[],[]],n=[],s=[[],[],[]],a=[[],[],[]],d=[],h=[],f=void 0,c=void 0,v=void 0,u=void 0;for(this.pos(t,e,r,n),f=(o=this.isValid(e,n))?this.iterate(t,e,n,s,d):{euclidean:-1,pixels:-1,maximum:-1},c=(i=this.isValid(r,n))?this.iterate(t,r,n,a,h):{euclidean:-1,pixels:-1,maximum:-1},v=0;v<3;++v)for(u=0;u<3;++u)o&&(d[v]-=s[v][u]*this.objectPoints[0][u]),i&&(h[v]-=a[v][u]*this.objectPoints[0][u]);return f.euclidean<c.euclidean?new l.Pose(f.pixels,s,d,c.pixels,a,h):new l.Pose(c.pixels,a,h,f.pixels,s,d)},l.Posit.prototype.pos=function(t,o,i,e){var r,n,s,a,d,h=this.objectPoints.length,f=[],c=[],v=[],u=[],l=[],x=[],g=[],p=[],b=void 0,y=void 0,m=void 0,w=void 0,M=void 0;for(w=0;w<h;++w)f[w]=[t[w].x-t[0].x,t[w].y-t[0].y];for(w=0;w<3;++w)for(c[w]=0,v[w]=0,M=0;M<h;++M)c[w]+=this.objectMatrix[w][M]*f[M][0],v[w]+=this.objectMatrix[w][M]*f[M][1];for(r=c[0]*c[0]+c[1]*c[1]+c[2]*c[2],a=((n=v[0]*v[0]+v[1]*v[1]+v[2]*v[2])-r)*(n-r)+(s=c[0]*v[0]+c[1]*v[1]+c[2]*v[2])*s*4,m=(b=n-r>=0?(n-r+Math.sqrt(a))/2:(n-r-Math.sqrt(a))/2)>=0?0===(y=Math.sqrt(b))?0:-s/y:0===(y=Math.sqrt(-s*s/b))?Math.sqrt(r-n):-s/y,w=0;w<3;++w)u[w]=c[w]+y*this.objectNormal[w],l[w]=v[w]+m*this.objectNormal[w];for(d=Math.sqrt(u[0]*u[0]+u[1]*u[1]+u[2]*u[2]),w=0;w<3;++w)x[w]=u[w]/d,g[w]=l[w]/d;for(p[0]=x[1]*g[2]-x[2]*g[1],p[1]=x[2]*g[0]-x[0]*g[2],p[2]=x[0]*g[1]-x[1]*g[0],w=0;w<3;++w)o[0][w]=x[w],o[1][w]=g[w],o[2][w]=p[w];for(w=0;w<3;++w)u[w]=c[w]-y*this.objectNormal[w],l[w]=v[w]-m*this.objectNormal[w];for(w=0;w<3;++w)x[w]=u[w]/d,g[w]=l[w]/d;for(p[0]=x[1]*g[2]-x[2]*g[1],p[1]=x[2]*g[0]-x[0]*g[2],p[2]=x[0]*g[1]-x[1]*g[0],w=0;w<3;++w)i[0][w]=x[w],i[1][w]=g[w],i[2][w]=p[w];e[0]=t[0].x/d,e[1]=t[0].y/d,e[2]=this.focalLength/d},l.Posit.prototype.isValid=function(t,o){for(var i=this.objectPoints.length,e=1/0,r=0,n=void 0;r<i;++r)(n=o[2]+(t[2][0]*this.objectVectors[r][0]+t[2][1]*this.objectVectors[r][1]+t[2][2]*this.objectVectors[r][2]))<e&&(e=n);return e>=0},l.Posit.prototype.iterate=function(t,o,i,e,r){var n=this.objectPoints.length,s=[],a=[],d=[[],[],[]],h=[[],[],[]],f=[],c=[],v=!1,u=0,l=void 0,x=void 0,g=void 0,p=void 0,b=void 0,y=void 0,m=void 0,w=void 0,M=void 0;for(w=0;w<n;++w)s[w]={x:t[w].x,y:t[w].y};for(w=0;w<3;++w){for(M=0;M<3;++M)e[w][M]=o[w][M];r[w]=i[w]}for(w=0;w<n;++w){for(g=0,M=0;M<3;++M)g+=this.objectVectors[w][M]*e[2][M]/r[2];a[w]={x:(1+g)*t[w].x,y:(1+g)*t[w].y}}for(x=0,w=0;w<n;++w)x+=Math.abs(a[w].x-s[w].x),x+=Math.abs(a[w].y-s[w].y);for(w=0;w<3;++w)f[w]=r[w]-(e[w][0]*this.objectPoints[0][0]+e[w][1]*this.objectPoints[0][1]+e[w][2]*this.objectPoints[0][2]);for(v=0===(b=this.error(t,e,f)).pixels||x<.01;u++<100&&!v;){for(w=0;w<n;++w)s[w].x=a[w].x,s[w].y=a[w].y;for(this.pos(a,d,h,r),w=0;w<3;++w)f[w]=r[w]-(d[w][0]*this.objectPoints[0][0]+d[w][1]*this.objectPoints[0][1]+d[w][2]*this.objectPoints[0][2]),c[w]=r[w]-(h[w][0]*this.objectPoints[0][0]+h[w][1]*this.objectPoints[0][1]+h[w][2]*this.objectPoints[0][2]);if(b=this.error(t,d,f),y=this.error(t,h,c),b.euclidean>=0&&y.euclidean>=0)if(y.euclidean<b.euclidean)for(p=y,w=0;w<3;++w)for(M=0;M<3;++M)e[w][M]=h[w][M];else for(p=b,w=0;w<3;++w)for(M=0;M<3;++M)e[w][M]=d[w][M];if(b.euclidean<0&&y.euclidean>=0)for(p=y,w=0;w<3;++w)for(M=0;M<3;++M)e[w][M]=h[w][M];if(y.euclidean<0&&b.euclidean>=0)for(p=b,w=0;w<3;++w)for(M=0;M<3;++M)e[w][M]=d[w][M];for(w=0;w<n;++w){for(g=0,M=0;M<3;++M)g+=this.objectVectors[w][M]*e[2][M]/r[2];a[w].x=(1+g)*t[w].x,a[w].y=(1+g)*t[w].y}for(l=x,x=0,w=0;w<n;++w)x+=Math.abs(a[w].x-s[w].x),x+=Math.abs(a[w].y-s[w].y);m=Math.abs(x-l),v=0===p.pixels||m<.01}return p},l.Posit.prototype.error=function(t,o,i){var e=this.objectPoints.length,r=[],n=[],s=[],a=0,d=0,h=0,f=void 0,c=void 0,v=void 0;if(!this.isValid(o,i))return{euclidean:-1,pixels:-1,maximum:-1};for(f=0;f<e;++f)for(r[f]=[],c=0;c<3;++c)r[f][c]=i[c];for(f=0;f<e;++f)for(c=0;c<3;++c)for(v=0;v<3;++v)r[f][c]+=o[c][v]*this.objectPoints[f][v];for(f=0;f<e;++f)for(n[f]=[],c=0;c<2;++c)n[f][c]=this.focalLength*r[f][c]/r[f][2];for(f=0;f<e;++f)s[f]=[n[f][0]-t[f].x,n[f][1]-t[f].y];for(f=0;f<e;++f)a+=Math.sqrt(s[f][0]*s[f][0]+s[f][1]*s[f][1]),d+=Math.abs(Math.round(n[f][0])-Math.round(t[f].x))+Math.abs(Math.round(n[f][1])-Math.round(t[f].y)),Math.abs(s[f][0])>h&&(h=Math.abs(s[f][0])),Math.abs(s[f][1])>h&&(h=Math.abs(s[f][1]));return{euclidean:a/e,pixels:d,maximum:h}},l.pseudoInverse=function(t,o,i){var e=[],r=[[],[],[]],n=[[],[],[]],s=0,a=0,d=void 0,h=void 0,f=void 0;for(u.svdcmp(t,o,3,e,r),d=0;d<3;++d)e[d]>s&&(s=e[d]);for(s*=.01,d=0;d<3;++d)e[d]<s&&(e[d]=0);for(h=0;h<3;++h)if(0===e[h])for(++a,f=h;f<2;++f){for(d=0;d<o;++d)t[d][f]=t[d][f+1];for(d=0;d<3;++d)r[d][f]=r[d][f+1]}for(h=0;h<2;++h)0===e[h]&&(e[h]=e[h+1]);for(d=0;d<3;++d)for(h=0;h<3-a;++h)n[d][h]=r[d][h]/e[h];for(d=0;d<3;++d)for(h=0;h<o;++h)for(i[d][h]=0,f=0;f<3-a;++f)i[d][h]+=n[d][f]*t[h][f]},l.Pose=function(t,o,i,e,r,n){this.bestError=t,this.bestRotation=o,this.bestTranslation=i,this.alternativeError=e,this.alternativeRotation=r,this.alternativeTranslation=n};var x=l,g={name:"ArucoMarker",props:{id:{default:1,type:Number}},computed:{matrix:function(){var t=[16,23,9,14],o=void 0,i=void 0,e=void 0,r=[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]];for(e=0;e<5;e++)for(o=t[this.id>>2*(4-e)&3],i=0;i<5;i++)r[i][e]=o>>4-i&1?1:0;return r.reduce(function(t,o){return t.concat(o)},[])}},methods:{btoa:function(t){return window.btoa(t)}}},p={render:function(){var t=this,o=t.$createElement,i=t._self._c||o;return i("div",[i("svg",{ref:"svg",attrs:{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 7 7",preserveAspectRatio:"meet xMidYMid"},on:{click:function(o){t.id++}}},[i("rect",{attrs:{x:"0",y:"0",width:"7",height:"7"}}),t._v(" "),i("g",{attrs:{transform:"translate(1,1)"}},t._l(t.matrix,function(o,e){return 1===o?i("rect",{key:e,attrs:{x:e%5,y:~~(e/5),width:"1",height:"1"}}):t._e()}))]),t._v(" "),this.$refs.svg?i("img",{attrs:{alt:"bla",title:"bla",width:"100",height:"100",src:"data:image/svg+xml;base64,"+t.btoa(this.$refs.svg.outerHTML)}}):t._e()])},staticRenderFns:[]};var b=i("VU/8")(g,p,!1,function(t){i("g/aK")},"data-v-1212cb78",null).exports,y=new c.Detector,m=void 0,w={name:"App",components:{ArucoMarker:b},mounted:function(){var t=this;(new a).requestWebcamFeed().then(function(o){console.log(o),t.$refs.video.srcObject=o}).then(function(){return new n.a(function(o){t.$refs.video.onloadedmetadata=o})}).then(function(){t.ratio=t.$refs.video.videoWidth/t.$refs.video.videoHeight,console.log(t.$refs.video.videoWidth,t.$refs.video.videoHeight,t.ratio),t.resizeCanvas()}).then(function(){t.$refs.video.play(),t.draw()}),window.addEventListener("resize",function(){return t.resizeCanvas()})},data:function(){return{scale:void 0,offsetX:void 0,offsetY:void 0}},methods:{resizeCanvas:function(){this.$refs.canvas.width=window.innerWidth,this.$refs.canvas.height=window.innerHeight,this.scale=Math.min(this.$refs.canvas.width/this.$refs.video.videoWidth,this.$refs.canvas.height/this.$refs.video.videoHeight),this.offsetX=(this.$refs.canvas.width-this.$refs.video.videoWidth*this.scale)/2,this.offsetY=(this.$refs.canvas.height-this.$refs.video.videoHeight*this.scale)/2,m=new x.Posit(350,this.$refs.canvas.width)},draw:function(){var t=this;requestAnimationFrame(function(){return t.draw()});var o=this.$refs.canvas.getContext("2d");o.clearRect(0,0,this.$refs.canvas.width,this.$refs.canvas.height),this.$refs.canvas.getContext("2d").drawImage(this.$refs.video,this.offsetX,this.offsetY,this.$refs.video.videoWidth*this.scale,this.$refs.video.videoHeight*this.scale);var i=o.getImageData(this.offsetX,this.offsetY,this.$refs.canvas.width,this.$refs.canvas.height),e=y.detect(i);e&&e.length>0?e.forEach(function(i){o.beginPath(),o.lineWidth=10,o.moveTo(t.offsetX+i.corners[0].x,t.offsetY+i.corners[0].y);for(var e=1;e<4;e++)o.lineTo(t.offsetX+i.corners[e].x,t.offsetY+i.corners[e].y);o.closePath(),o.strokeStyle="red",o.stroke();var r=m.pose(i.corners);o.font="30px Consolas",o.fillStyle="blue";var n=[-Math.asin(-r.bestRotation[1][2]),-Math.atan2(r.bestRotation[0][2],r.bestRotation[2][2]),Math.atan2(r.bestRotation[1][0],r.bestRotation[1][1])];o.fillText("Position: "+r.bestTranslation.map(function(t){return t.toFixed(2)}),10,50),o.fillText("Rotation: "+n.map(function(t){return t.toFixed(2)}),10,70)}):(o.font="30px Consolas",o.fillStyle="blue",o.fillText("No markers detected",10,50))}}},M={render:function(){var t=this.$createElement,o=this._self._c||t;return o("div",{attrs:{id:"app"}},[o("video",{ref:"video",staticStyle:{display:"none"}}),this._v(" "),o("canvas",{ref:"canvas"})])},staticRenderFns:[]};var j=i("VU/8")(w,M,!1,function(t){i("rCNF")},null,null).exports;e.a.config.productionTip=!1,new e.a({el:"#app",components:{App:j},template:"<App/>"})},"g/aK":function(t,o){},rCNF:function(t,o){}},["NHnr"]);
//# sourceMappingURL=app.d3ed48d4cc128a94fb04.js.map