//
(function($,window,undefined){$.fn.jScrollPane=function(settings)
{function JScrollPane(elem,s)
{var settings,jsp=this,pane,paneWidth,paneHeight,container,contentWidth,contentHeight,percentInViewH,percentInViewV,isScrollableV,isScrollableH,verticalDrag,dragMaxY,verticalDragPosition,horizontalDrag,dragMaxX,horizontalDragPosition,verticalBar,verticalTrack,scrollbarWidth,verticalTrackHeight,verticalDragHeight,arrowUp,arrowDown,horizontalBar,horizontalTrack,horizontalTrackWidth,horizontalDragWidth,arrowLeft,arrowRight,reinitialiseInterval,originalPadding,originalPaddingTotalWidth,previousContentWidth,wasAtTop=true,wasAtLeft=true,wasAtBottom=false,wasAtRight=false,originalElement=elem.clone(false,false).empty(),mwEvent=$.fn.mwheelIntent?'mwheelIntent.jsp':'mousewheel.jsp';originalPadding=elem.css('paddingTop')+' '+
elem.css('paddingRight')+' '+
elem.css('paddingBottom')+' '+
elem.css('paddingLeft');originalPaddingTotalWidth=(parseInt(elem.css('paddingLeft'),10)||0)+(parseInt(elem.css('paddingRight'),10)||0);function initialise(s)
{var isMaintainingPositon,lastContentX,lastContentY,hasContainingSpaceChanged,originalScrollTop,originalScrollLeft,maintainAtBottom=false,maintainAtRight=false;settings=s;if(pane===undefined){originalScrollTop=elem.scrollTop();originalScrollLeft=elem.scrollLeft();elem.css({overflow:'hidden',padding:0});paneWidth=elem.innerWidth()+originalPaddingTotalWidth;paneHeight=elem.innerHeight();elem.width(paneWidth);pane=$('<div class="jspPane" />').css('padding',originalPadding).append(elem.children());container=$('<div class="jspContainer" />')
.css({'width':paneWidth+'px','height':paneHeight+'px'}).append(pane).appendTo(elem);}else{elem.css('width','');maintainAtBottom=settings.stickToBottom&&isCloseToBottom();maintainAtRight=settings.stickToRight&&isCloseToRight();hasContainingSpaceChanged=elem.innerWidth()+originalPaddingTotalWidth!=paneWidth||elem.outerHeight()!=paneHeight;if(hasContainingSpaceChanged){paneWidth=elem.innerWidth()+originalPaddingTotalWidth;paneHeight=elem.innerHeight();container.css({width:paneWidth+'px',height:paneHeight+'px'});}
if(!hasContainingSpaceChanged&&previousContentWidth==contentWidth&&pane.outerHeight()==contentHeight){elem.width(paneWidth);return;}
previousContentWidth=contentWidth;pane.css('width','');elem.width(paneWidth);container.find('>.jspVerticalBar,>.jspHorizontalBar').remove().end();}
pane.css('overflow','auto');if(s.contentWidth){contentWidth=s.contentWidth;}else{contentWidth=pane[0].scrollWidth;}
contentHeight=pane[0].scrollHeight;pane.css('overflow','');percentInViewH=contentWidth/paneWidth;percentInViewV=contentHeight/paneHeight;isScrollableV=percentInViewV>1;isScrollableH=percentInViewH>1;if(!(isScrollableH||isScrollableV)){elem.removeClass('jspScrollable');pane.css({top:0,width:container.width()-originalPaddingTotalWidth});removeMousewheel();removeFocusHandler();removeKeyboardNav();removeClickOnTrack();unhijackInternalLinks();}else{elem.addClass('jspScrollable');isMaintainingPositon=settings.maintainPosition&&(verticalDragPosition||horizontalDragPosition);if(isMaintainingPositon){lastContentX=contentPositionX();lastContentY=contentPositionY();}
initialiseVerticalScroll();initialiseHorizontalScroll();resizeScrollbars();if(isMaintainingPositon){scrollToX(maintainAtRight?(contentWidth-paneWidth):lastContentX,false);scrollToY(maintainAtBottom?(contentHeight-paneHeight):lastContentY,false);}
initFocusHandler();initMousewheel();initTouch();if(settings.enableKeyboardNavigation){initKeyboardNav();}
if(settings.clickOnTrack){initClickOnTrack();}
observeHash();if(settings.hijackInternalLinks){hijackInternalLinks();}}
if(settings.autoReinitialise&&!reinitialiseInterval){reinitialiseInterval=setInterval(function()
{initialise(settings);},settings.autoReinitialiseDelay);}else if(!settings.autoReinitialise&&reinitialiseInterval){clearInterval(reinitialiseInterval);}
originalScrollTop&&elem.scrollTop(0)&&scrollToY(originalScrollTop,false);originalScrollLeft&&elem.scrollLeft(0)&&scrollToX(originalScrollLeft,false);elem.trigger('jsp-initialised',[isScrollableH||isScrollableV]);}
function initialiseVerticalScroll()
{if(isScrollableV){container.append($('<div class="jspVerticalBar" />').append($('<div class="jspCap jspCapTop" />'),$('<div class="jspTrack" />').append($('<div class="jspDrag" />').append($('<div class="jspDragTop" />'),$('<div class="jspDragBottom" />'))),$('<div class="jspCap jspCapBottom" />')));verticalBar=container.find('>.jspVerticalBar');verticalTrack=verticalBar.find('>.jspTrack');verticalDrag=verticalTrack.find('>.jspDrag');if(settings.showArrows){arrowUp=$('<a class="jspArrow jspArrowUp" />').bind('mousedown.jsp',getArrowScroll(0,-1)).bind('click.jsp',nil);arrowDown=$('<a class="jspArrow jspArrowDown" />').bind('mousedown.jsp',getArrowScroll(0,1)).bind('click.jsp',nil);if(settings.arrowScrollOnHover){arrowUp.bind('mouseover.jsp',getArrowScroll(0,-1,arrowUp));arrowDown.bind('mouseover.jsp',getArrowScroll(0,1,arrowDown));}
appendArrows(verticalTrack,settings.verticalArrowPositions,arrowUp,arrowDown);}
verticalTrackHeight=paneHeight;container.find('>.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow').each(function()
{verticalTrackHeight-=$(this).outerHeight();});verticalDrag.hover(function()
{verticalDrag.addClass('jspHover');},function()
{verticalDrag.removeClass('jspHover');}).bind('mousedown.jsp',function(e)
{$('html').bind('dragstart.jsp selectstart.jsp',nil);verticalDrag.addClass('jspActive');var startY=e.pageY-verticalDrag.position().top;$('html').bind('mousemove.jsp',function(e)
{positionDragY(e.pageY-startY,false);}).bind('mouseup.jsp mouseleave.jsp',cancelDrag);return false;});sizeVerticalScrollbar();}}
function sizeVerticalScrollbar()
{verticalTrack.height(verticalTrackHeight+'px');verticalDragPosition=0;scrollbarWidth=settings.verticalGutter+verticalTrack.outerWidth();pane.width(paneWidth-scrollbarWidth-originalPaddingTotalWidth);try{if(verticalBar.position().left===0){pane.css('margin-left',scrollbarWidth+'px');}}catch(err){}}
function initialiseHorizontalScroll()
{if(isScrollableH){container.append($('<div class="jspHorizontalBar" />').append($('<div class="jspCap jspCapLeft" />'),$('<div class="jspTrack" />').append($('<div class="jspDrag" />').append($('<div class="jspDragLeft" />'),$('<div class="jspDragRight" />'))),$('<div class="jspCap jspCapRight" />')));horizontalBar=container.find('>.jspHorizontalBar');horizontalTrack=horizontalBar.find('>.jspTrack');horizontalDrag=horizontalTrack.find('>.jspDrag');if(settings.showArrows){arrowLeft=$('<a class="jspArrow jspArrowLeft" />').bind('mousedown.jsp',getArrowScroll(-1,0)).bind('click.jsp',nil);arrowRight=$('<a class="jspArrow jspArrowRight" />').bind('mousedown.jsp',getArrowScroll(1,0)).bind('click.jsp',nil);if(settings.arrowScrollOnHover){arrowLeft.bind('mouseover.jsp',getArrowScroll(-1,0,arrowLeft));arrowRight.bind('mouseover.jsp',getArrowScroll(1,0,arrowRight));}
appendArrows(horizontalTrack,settings.horizontalArrowPositions,arrowLeft,arrowRight);}
horizontalDrag.hover(function()
{horizontalDrag.addClass('jspHover');},function()
{horizontalDrag.removeClass('jspHover');}).bind('mousedown.jsp',function(e)
{$('html').bind('dragstart.jsp selectstart.jsp',nil);horizontalDrag.addClass('jspActive');var startX=e.pageX-horizontalDrag.position().left;$('html').bind('mousemove.jsp',function(e)
{positionDragX(e.pageX-startX,false);}).bind('mouseup.jsp mouseleave.jsp',cancelDrag);return false;});horizontalTrackWidth=container.innerWidth();sizeHorizontalScrollbar();}}
function sizeHorizontalScrollbar()
{container.find('>.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow').each(function()
{horizontalTrackWidth-=$(this).outerWidth();});horizontalTrack.width(horizontalTrackWidth+'px');horizontalDragPosition=0;}
function resizeScrollbars()
{if(isScrollableH&&isScrollableV){var horizontalTrackHeight=horizontalTrack.outerHeight(),verticalTrackWidth=verticalTrack.outerWidth();verticalTrackHeight-=horizontalTrackHeight;$(horizontalBar).find('>.jspCap:visible,>.jspArrow').each(function()
{horizontalTrackWidth+=$(this).outerWidth();});horizontalTrackWidth-=verticalTrackWidth;paneHeight-=verticalTrackWidth;paneWidth-=horizontalTrackHeight;horizontalTrack.parent().append($('<div class="jspCorner" />').css('width',horizontalTrackHeight+'px'));sizeVerticalScrollbar();sizeHorizontalScrollbar();}
if(isScrollableH){pane.width((container.outerWidth()-originalPaddingTotalWidth)+'px');}
contentHeight=pane.outerHeight();percentInViewV=contentHeight/paneHeight;if(isScrollableH){horizontalDragWidth=Math.ceil(1/percentInViewH*horizontalTrackWidth);if(horizontalDragWidth>settings.horizontalDragMaxWidth){horizontalDragWidth=settings.horizontalDragMaxWidth;}else if(horizontalDragWidth<settings.horizontalDragMinWidth){horizontalDragWidth=settings.horizontalDragMinWidth;}
horizontalDrag.width(horizontalDragWidth+'px');dragMaxX=horizontalTrackWidth-horizontalDragWidth;_positionDragX(horizontalDragPosition);}
if(isScrollableV){verticalDragHeight=Math.ceil(1/percentInViewV*verticalTrackHeight);if(verticalDragHeight>settings.verticalDragMaxHeight){verticalDragHeight=settings.verticalDragMaxHeight;}else if(verticalDragHeight<settings.verticalDragMinHeight){verticalDragHeight=settings.verticalDragMinHeight;}
verticalDrag.height(verticalDragHeight+'px');dragMaxY=verticalTrackHeight-verticalDragHeight;_positionDragY(verticalDragPosition);}}
function appendArrows(ele,p,a1,a2)
{var p1="before",p2="after",aTemp;if(p=="os"){p=/Mac/.test(navigator.platform)?"after":"split";}
if(p==p1){p2=p;}else if(p ==p2){p1=p;aTemp=a1;a1=a2;a2=aTemp;}
ele[p1](a1)[p2](a2);}
function getArrowScroll(dirX,dirY,ele)
{return function()
{arrowScroll(dirX,dirY,this,ele);this.blur();return false;};}
function arrowScroll(dirX,dirY,arrow,ele)
{arrow=$(arrow).addClass('jspActive');var eve,scrollTimeout,isFirst=true,doScroll=function()
{if(dirX!==0){jsp.scrollByX(dirX*settings.arrowButtonSpeed);}
if(dirY!==0){jsp.scrollByY(dirY*settings.arrowButtonSpeed);}
scrollTimeout=setTimeout(doScroll,isFirst?settings.initialDelay:settings.arrowRepeatFreq);isFirst=false;};doScroll();eve=ele?'mouseout.jsp':'mouseup.jsp';ele=ele||$('html');ele.bind(eve,function()
{arrow.removeClass('jspActive');scrollTimeout&&clearTimeout(scrollTimeout);scrollTimeout=null;ele.unbind(eve);});}
function initClickOnTrack()
{removeClickOnTrack();if(isScrollableV){verticalTrack.bind('mousedown.jsp',function(e)
{if(e.originalTarget===undefined||e.originalTarget==e.currentTarget){var clickedTrack=$(this),offset=clickedTrack.offset(),direction=e.pageY-offset.top-verticalDragPosition,scrollTimeout,isFirst=true,doScroll=function()
{var offset=clickedTrack.offset(),pos=e.pageY-offset.top-verticalDragHeight/2,contentDragY=paneHeight*settings.scrollPagePercent,dragY=dragMaxY*contentDragY/(contentHeight-paneHeight);if(direction<0){if(verticalDragPosition-dragY>pos){jsp.scrollByY(-contentDragY);}else{positionDragY(pos);}}else if(direction>0){if(verticalDragPosition+dragY<pos){jsp.scrollByY(contentDragY);}else{positionDragY(pos);}}else{cancelClick();return;}
scrollTimeout=setTimeout(doScroll,isFirst?settings.initialDelay:settings.trackClickRepeatFreq);isFirst=false;},cancelClick=function()
{scrollTimeout&&clearTimeout(scrollTimeout);scrollTimeout=null;$(document).unbind('mouseup.jsp',cancelClick);};doScroll();$(document).bind('mouseup.jsp',cancelClick);return false;}});}
if(isScrollableH){horizontalTrack.bind('mousedown.jsp',function(e)
{if(e.originalTarget===undefined||e.originalTarget==e.currentTarget){var clickedTrack=$(this),offset=clickedTrack.offset(),direction=e.pageX-offset.left-horizontalDragPosition,scrollTimeout,isFirst=true,doScroll=function()
{var offset=clickedTrack.offset(),pos=e.pageX-offset.left-horizontalDragWidth/2,contentDragX=paneWidth*settings.scrollPagePercent,dragX=dragMaxX*contentDragX/(contentWidth-paneWidth);if(direction<0){if(horizontalDragPosition-dragX>pos){jsp.scrollByX(-contentDragX);}else{positionDragX(pos);}}else if(direction>0){if(horizontalDragPosition+dragX<pos){jsp.scrollByX(contentDragX);}else{positionDragX(pos);}}else{cancelClick();return;}
scrollTimeout=setTimeout(doScroll,isFirst?settings.initialDelay:settings.trackClickRepeatFreq);isFirst=false;},cancelClick=function()
{ scrollTimeout&&clearTimeout(scrollTimeout);scrollTimeout=null;$(document).unbind('mouseup.jsp',cancelClick);};doScroll();$(document).bind('mouseup.jsp',cancelClick);return false;}});}}
function removeClickOnTrack()
{if(horizontalTrack){horizontalTrack.unbind('mousedown.jsp');}
if(verticalTrack){verticalTrack.unbind('mousedown.jsp');}}
function cancelDrag()
{$('html').unbind('dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp');if(verticalDrag){verticalDrag.removeClass('jspActive');}
if(horizontalDrag){horizontalDrag.removeClass('jspActive');}}
function positionDragY(destY,animate)
{if(!isScrollableV){return;}
if(destY<0){destY=0;}else if(destY>dragMaxY){destY=dragMaxY;}
if(animate===undefined){animate=settings.animateScroll;}
if(animate){jsp.animate(verticalDrag,'top',destY,_positionDragY);}else{verticalDrag.css('top',destY);_positionDragY(destY);}}
function _positionDragY(destY)
{if(destY===undefined){destY=verticalDrag.position().top;}
container.scrollTop(0);verticalDragPosition=destY;var isAtTop=verticalDragPosition===0,isAtBottom=verticalDragPosition==dragMaxY,percentScrolled=destY/dragMaxY,destTop=-percentScrolled*(contentHeight-paneHeight);if(wasAtTop!=isAtTop||wasAtBottom!=isAtBottom){wasAtTop=isAtTop;wasAtBottom=isAtBottom;elem.trigger('jsp-arrow-change',[wasAtTop,wasAtBottom,wasAtLeft,wasAtRight]);}
updateVerticalArrows(isAtTop,isAtBottom);pane.css('top',destTop);elem.trigger('jsp-scroll-y',[-destTop,isAtTop,isAtBottom]).trigger('scroll');}
function positionDragX(destX,animate)
{if(!isScrollableH){return;}
if(destX<0){destX=0;}else if(destX>dragMaxX){destX=dragMaxX;}
if(animate===undefined){animate=settings.animateScroll;}
if(animate){jsp.animate(horizontalDrag,'left',destX,_positionDragX);}else{horizontalDrag.css('left',destX);_positionDragX(destX);}}
function _positionDragX(destX)
{if(destX===undefined){destX=horizontalDrag.position().left;}
container.scrollTop(0);horizontalDragPosition=destX;var isAtLeft=horizontalDragPosition===0,isAtRight=horizontalDragPosition==dragMaxX,percentScrolled=destX/dragMaxX,destLeft=-percentScrolled*(contentWidth-paneWidth);if(wasAtLeft!=isAtLeft||wasAtRight!=isAtRight){wasAtLeft=isAtLeft;wasAtRight=isAtRight;elem.trigger('jsp-arrow-change',[wasAtTop,wasAtBottom,wasAtLeft,wasAtRight]);}
updateHorizontalArrows(isAtLeft,isAtRight);pane.css('left',destLeft);elem.trigger('jsp-scroll-x',[-destLeft,isAtLeft,isAtRight]).trigger('scroll');}
function updateVerticalArrows(isAtTop,isAtBottom)
{if(settings.showArrows){arrowUp[isAtTop?'addClass':'removeClass']('jspDisabled');arrowDown[isAtBottom?'addClass':'removeClass']('jspDisabled');}}
function updateHorizontalArrows(isAtLeft,isAtRight)
{if(settings.showArrows){arrowLeft[isAtLeft?'addClass':'removeClass']('jspDisabled');arrowRight[isAtRight?'addClass':'removeClass']('jspDisabled');}}
function scrollToY(destY,animate)
{var percentScrolled=destY/(contentHeight-paneHeight);positionDragY(percentScrolled*dragMaxY,animate);}
function scrollToX(destX,animate)
{var percentScrolled=destX/(contentWidth-paneWidth);positionDragX(percentScrolled*dragMaxX,animate);}
function scrollToElement(ele,stickToTop,animate)
{var e,eleHeight,eleWidth,eleTop=0,eleLeft=0,viewportTop,viewportLeft,maxVisibleEleTop,maxVisibleEleLeft,destY,destX;try{e=$(ele);}catch(err){return;}
eleHeight=e.outerHeight();eleWidth=e.outerWidth();container.scrollTop(0);container.scrollLeft(0);while(!e.is('.jspPane')){eleTop+=e.position().top;eleLeft+=e.position().left;e=e.offsetParent();if(/^body|html$/i.test(e[0].nodeName)){ return;}}
viewportTop=contentPositionY();maxVisibleEleTop=viewportTop+paneHeight;if(eleTop<viewportTop||stickToTop){destY=eleTop-settings.verticalGutter;}else if(eleTop+eleHeight>maxVisibleEleTop){destY=eleTop-paneHeight+eleHeight+settings.verticalGutter;}
if(destY){scrollToY(destY,animate);}
viewportLeft=contentPositionX();maxVisibleEleLeft=viewportLeft+paneWidth;if(eleLeft<viewportLeft||stickToTop){destX=eleLeft-settings.horizontalGutter;}else if(eleLeft+eleWidth>maxVisibleEleLeft){destX=eleLeft-paneWidth+eleWidth+settings.horizontalGutter;}
if(destX){scrollToX(destX,animate);}}
function contentPositionX()
{return-pane.position().left;}
function contentPositionY()
{return-pane.position().top;}
function isCloseToBottom()
{var scrollableHeight=contentHeight-paneHeight;return(scrollableHeight>20)&&(scrollableHeight-contentPositionY()<10);}
function isCloseToRight()
{var scrollableWidth=contentWidth-paneWidth;return(scrollableWidth>20)&&(scrollableWidth-contentPositionX()<10);}
function initMousewheel()
{container.unbind(mwEvent).bind(mwEvent,function(event,delta,deltaX,deltaY){var dX=horizontalDragPosition,dY=verticalDragPosition;jsp.scrollBy(deltaX*settings.mouseWheelSpeed,-deltaY*settings.mouseWheelSpeed,false);return dX==horizontalDragPosition&&dY==verticalDragPosition;});}
function removeMousewheel()
{container.unbind(mwEvent);}
 function nil()
{return false;}
function initFocusHandler()
{pane.find(':input,a').unbind('focus.jsp').bind('focus.jsp',function(e)
{scrollToElement(e.target,false);});}
function removeFocusHandler()
{pane.find(':input,a').unbind('focus.jsp');}
function initKeyboardNav()
{var keyDown,elementHasScrolled,validParents=[];isScrollableH&&validParents.push(horizontalBar[0]);isScrollableV&&validParents.push(verticalBar[0]);pane.focus(function()
{elem.focus();});elem.attr('tabindex',0)
.unbind('keydown.jsp keypress.jsp')
.bind('keydown.jsp',function(e)
{if(e.target!==this&&!(validParents.length&&$(e.target).closest(validParents).length)){return;}
var dX=horizontalDragPosition,dY=verticalDragPosition;switch(e.keyCode){case 40:case 38:case 34:case 32:case 33:case 39:case 37:keyDown=e.keyCode;keyDownHandler();break;case 35:scrollToY(contentHeight-paneHeight);keyDown=null;break;case 36:scrollToY(0);keyDown=null;break;}
elementHasScrolled=e.keyCode==keyDown&&dX!=horizontalDragPosition||dY!=verticalDragPosition;return!elementHasScrolled;}).bind('keypress.jsp',function(e)
{if(e.keyCode==keyDown){keyDownHandler();}
return!elementHasScrolled;});if(settings.hideFocus){elem.css('outline','none');if('hideFocus' in container[0]){elem.attr('hideFocus',true);}}else{elem.css('outline','');if('hideFocus' in container[0]){elem.attr('hideFocus',false);}}
function keyDownHandler()
{var dX=horizontalDragPosition,dY=verticalDragPosition;switch(keyDown){case 40:jsp.scrollByY(settings.keyboardSpeed,false);break;case 38:jsp.scrollByY(-settings.keyboardSpeed,false);break;case 34:case 32:jsp.scrollByY(paneHeight*settings.scrollPagePercent,false);break;case 33:jsp.scrollByY(-paneHeight*settings.scrollPagePercent,false);break;case 39:jsp.scrollByX(settings.keyboardSpeed,false);break;case 37:jsp.scrollByX(-settings.keyboardSpeed,false);break;}
elementHasScrolled=dX!=horizontalDragPosition||dY!=verticalDragPosition;return elementHasScrolled;}}
function removeKeyboardNav()
{elem.attr('tabindex','-1')
.removeAttr('tabindex')
.unbind('keydown.jsp keypress.jsp');}
function observeHash()
{if(location.hash&&location.hash.length>1){var e,retryInt,hash=escape(location.hash);try{e=$(hash);}catch(err){return;}
if(e.length&&pane.find(hash)){if(container.scrollTop()===0){retryInt=setInterval(function()
{if(container.scrollTop()>0){scrollToElement(hash,true);$(document).scrollTop(container.position().top);clearInterval(retryInt);}},50);}else{scrollToElement(hash,true); $(document).scrollTop(container.position().top);}}}}
function unhijackInternalLinks()
{$('a.jspHijack').unbind('click.jsp-hijack').removeClass('jspHijack');}
function hijackInternalLinks()
{unhijackInternalLinks();$('a[href^=#]').addClass('jspHijack').bind('click.jsp-hijack',function()
{var uriParts=this.href.split('#'),hash;if(uriParts.length>1){hash=uriParts[1];if(hash.length>0&&pane.find('#'+hash).length>0){scrollToElement('#'+hash,true);return false;}}});}
function initTouch()
{var startX,startY,touchStartX,touchStartY,moved,moving=false;container.unbind('touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick').bind('touchstart.jsp',function(e)
{var touch=e.originalEvent.touches[0];startX=contentPositionX();startY=contentPositionY();touchStartX=touch.pageX;touchStartY=touch.pageY;moved=false;moving=true;}).bind('touchmove.jsp',function(ev)
{if(!moving){return;}
var touchPos=ev.originalEvent.touches[0],dX=horizontalDragPosition,dY=verticalDragPosition;jsp.scrollTo(startX+touchStartX-touchPos.pageX,startY+touchStartY-touchPos.pageY);moved=moved||Math.abs(touchStartX-touchPos.pageX)>5||Math.abs(touchStartY-touchPos.pageY)>5;return dX==horizontalDragPosition&&dY==verticalDragPosition;}).bind('touchend.jsp',function(e)
{moving=false;/**/}).bind('click.jsp-touchclick',function(e)
{if(moved){moved=false;return false;}});}
function destroy(){var currentY=contentPositionY(),currentX=contentPositionX();elem.removeClass('jspScrollable').unbind('.jsp');elem.replaceWith(originalElement.append(pane.children()));originalElement.scrollTop(currentY);originalElement.scrollLeft(currentX);}
$.extend(jsp,{reinitialise:function(s)
{s=$.extend({},settings,s);initialise(s);},scrollToElement:function(ele,stickToTop,animate)
{scrollToElement(ele,stickToTop,animate);},scrollTo:function(destX,destY,animate)
{scrollToX(destX,animate);scrollToY(destY,animate);},//
scrollToX:function(destX,animate)
{scrollToX(destX,animate);},scrollToY:function(destY,animate)
{scrollToY(destY,animate);},scrollToPercentX:function(destPercentX,animate)
{scrollToX(destPercentX*(contentWidth-paneWidth),animate);},scrollToPercentY:function(destPercentY,animate)
{scrollToY(destPercentY*(contentHeight-paneHeight),animate);},scrollBy:function(deltaX,deltaY,animate)
{jsp.scrollByX(deltaX,animate);jsp.scrollByY(deltaY,animate);},scrollByX:function(deltaX,animate)
{var destX=contentPositionX()+Math[deltaX<0?'floor':'ceil'](deltaX),percentScrolled=destX/(contentWidth-paneWidth);positionDragX(percentScrolled*dragMaxX,animate);},scrollByY:function(deltaY,animate)
{var destY=contentPositionY()+Math[deltaY<0?'floor':'ceil'](deltaY),percentScrolled=destY/(contentHeight-paneHeight);positionDragY(percentScrolled*dragMaxY,animate);},positionDragX:function(x,animate)
{positionDragX(x,animate);},positionDragY:function(y,animate)
{positionDragY(y,animate);},animate:function(ele,prop,value,stepCallback)
{var params={};params[prop]=value;ele.animate(params,{'duration':settings.animateDuration,'easing':settings.animateEase,'queue':false,'step':stepCallback});},getContentPositionX:function()
{return contentPositionX();},getContentPositionY:function()
{return contentPositionY();},getContentWidth:function()
{return contentWidth;},getContentHeight:function()
{return contentHeight;},getPercentScrolledX:function()
{return contentPositionX()/(contentWidth-paneWidth);},getPercentScrolledY:function()
{return contentPositionY()/(contentHeight-paneHeight);},getIsScrollableH:function()
{return isScrollableH;},getIsScrollableV:function()
{return isScrollableV;},getContentPane:function()
{return pane;},//
scrollToBottom:function(animate)
{positionDragY(dragMaxY,animate);},hijackInternalLinks:function()
{hijackInternalLinks();},destroy:function()
{destroy();}});initialise(s);}
settings=$.extend({},$.fn.jScrollPane.defaults,settings);$.each(['mouseWheelSpeed','arrowButtonSpeed','trackClickSpeed','keyboardSpeed'],function(){settings[this]=settings[this]||settings.speed;});return this.each(function()
{var elem=$(this),jspApi=elem.data('jsp');if(jspApi){jspApi.reinitialise(settings);}else{jspApi=new JScrollPane(elem,settings);elem.data('jsp',jspApi);}});};$.fn.jScrollPane.defaults={showArrows:false,maintainPosition:true,stickToBottom:false,stickToRight:false,clickOnTrack:true,autoReinitialise:false,autoReinitialiseDelay:500,verticalDragMinHeight:0,verticalDragMaxHeight:99999,horizontalDragMinWidth:0,horizontalDragMaxWidth:99999,contentWidth:undefined,animateScroll:false,animateDuration:300,animateEase:'linear',hijackInternalLinks:false,verticalGutter:4,horizontalGutter:4,mouseWheelSpeed:0,arrowButtonSpeed:0,arrowRepeatFreq:50,arrowScrollOnHover:false,trackClickSpeed:0, trackClickRepeatFreq:70,verticalArrowPositions:'split',horizontalArrowPositions:'split',enableKeyboardNavigation:true,hideFocus:false,keyboardSpeed:0,initialDelay:300,speed:30,scrollPagePercent:.8};})(jQuery,this);