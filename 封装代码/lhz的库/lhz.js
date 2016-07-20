//库： 放置一些内置函数的扩展(string,array,onject)
//     放置一些自定义函数，这些函数为了不与别的函数冲突定义到一个命名空间（对象）中

(function(){
   //给window添加了命名空间
   if(!window.lhz){
	  // window.lhz={};
	   window['lhz']={};   
   }
   /*window.lhz.prototype={
	   $:function(){
	   }
   }*/ 
    //  <div id="a">  <div id="b">
	//$("dddd");  var array=$({"a","b"})  
////////////////////////////////////////////获取页面元素/////////////////////////////////////////////
	 window['lhz']['$']=$;
	 //window.lhz.$=$;
	function $(){
		var elements=new Array();
		//查找作为参数提供的所有元素
		for(var i=0;i<arguments.length;i++){
		   var element=arguments[i];
		   //如果这个元素是一个string则表明这是一个id
		   if( typeof element=='string'){
			  element=document.getElementById( element);   
		   }
		   if( arguments.length==1){
			   return element;
		   }
		   elements.push(element);
		}
		return elements;
	   //return document.getElementById(id);
	
	}


	//判断当期那浏览器是否兼容这个库：  浏览器能力检测
	//判断当前浏览器是否兼容这个库
			function iscompatible(other){
				//表示是否支持false这个关键字,内容和类型全部相同 /*array是否支持push*/       /*object是否支持*/
				if(other===false || !Array.prototype.push || !Object.hasOwnProperty ||!document.createElement || !document.getElementsByTagName){
					return false;
				}
				return true;
			};
			window['lhz']['iscompatible']=iscompatible;





//取DOM节点    getElementById()
//getElementsByTagName();
//getElementByClassName();   ff可以取，但ie不可以实现
//扩展
function getElementsByClassName(className,tag,parent){
	//第三个参数未传时默认为document，tag有很多个不同的时候直接传入*
	parent=parent || document;
	//使其可接受ID或者node
	if(!(parent=$(parent))){
		return false;
	}
	//查看所有匹配的标签
	//若标签名不同则传入所有标签
	var allTags=(tag=="*"&&parent.all)?parent.all:parent.getElementsByTagName(tag);
	var matchingElements=new Array();
	//创建一个正则表达式，来判断clssname是否正确
	var regex=new RegExp("(^|\\s)"+className+"(\\s|$)");
	//					以classname或空格开头  以classname或空格结尾
	var element;
	//检查每一个元素
	for(var i=0;i<allTags.length;i++){
		element=allTags[i];
		//匹配字符串中是否存在于正则表达式相匹配的结果
		if(regex.test(element.className)){
			matchingElements.push(element);
		}
	}
	return matchingElements;
}
window['lhz']['getElementsByClassName']=getElementsByClassName;


///////////////////////////////////////////////事件操作//////////////////////////////////////////////

//模板替换
   	/*function supplant(str,o){
		//   /g 整个字符串全部匹配
		//  //正则表达式的标志
		//   { ()} : ()分组，将匹配的值存起来
		//用后面的替换前面的
		return str.replace(/{ ([a-z]*) } /g,
		                   function(a,b){
							   //a:{border}  b:{border}
								var r=o[b];   //o["border"]=>2
								              //o["{border}"]
								return r;
								 }
					)
 	}*/
 	window['lhz']['supplant']=supplant;

 	function supplant(str,o){
 		for(var i in o){
 			//i: first last border
 			str=str.replace("{"+i+"}",o[i]);
 			//str.replace("{border}",o["border"]);
 		}
 		return str;
 	}
	/*function supplant(){
		  template=template.replace("{last}",data.last);
		  
		  template.replace("{border}",data.border);
		 
		  template=template.replace("{first}",data.first); 
		   //替换返回一个新的字符串，所以要赋值给原来的字符串才能显示
		  return template;
		}	*/




//将json对象通过eval解析，再用一个匿名函数把相对应的键值替换掉
	window['lhz']['parseJson']=parseJson;
	
	function parseJson(str,filter){
		var result=eval("("+str+")");//解析json对象{"name":"a","age":20}
		if( filter!=null&& typeof(filter)=='function'){
			//判断filter不是空并且filter是一个函数
			for(var i in result){
				//将filter函数里相应的键和键值都重新赋值给result对应的键值i
				result[i]=filter(i ,result[i] );
				//filter函数内容如何变换随情况而定
			}	
		}
		return result;
		
	}



//增加事件：node:节点  type:事件类型("click")   listener:监听器函数
			function addEvent(node,type,listener){
				//如果不兼容则返回FALSE
				if (!iscompatible) {return false;}
				//使其可接受ID或者node
				if(!(node=$(node))){return false;}
				//w3c（现代浏览器）加事件的方法
				if(node.addEventListener){
					//type:事件类型("click")    listener:监听器函数
					node.addEventListener(type,listener,false);
					return true;
				}else if(node.attachEvent){
					//MSIE的事件
					/*创建一个属性来保存事件响应函数,并使其可以得到this的引用。
					  方法名['e'+type+listener]只是一个自定义的约定，好在必要的时候按约定删除这个响应函数。
					将listener函数赋值给node['e'+type+listener](node的一个属性)；加e为了避免函数重名*/
					node['e'+type+listener]=listener;
					//node[type+listener]也是一个函数名
					//它这样做的目的是为了方便在removeEvent能正确移除对应的listener。
					/*type+listener以及 'e'+type+listener其实是为了得到listener函数一个guid（唯一标识）。
					type+listener是相当于 type+listener.toString()，即函数代码的字符串。
					  重新包装这个函数，把IE的事件对象传进去,
					  而且函数名不一定要用node[type+listener],也可以用一个局部变量如var tmp=fn来标识这个包装后的函数。*/
					node[type+listener]=function(){
						node['e'+type+listener](window.event);//可能会在函数里加事件
						//listener(window.event);
					}
					//在ie中事件名要加on
						node.attachEvent('on'+type,node[type+listener]);
						return true;
				}

				return false;//若两种方法都不具备则返回false

			}
window['lhz']['addEvent']=addEvent;

// 	 //注意：添加事件时使用的函数必须与删除时用的函数要是同一个函数
/*    var show=function(){
	  alert("hello")
      }
lhz.addEvent("show","click",show);
lhz.removeEvent("show","click",show);
//以上做法是正确的
lhz.addEvent("show","click",function(){alert("hello");});//添加事件时用了一个函数
lhz.removeEvent("show","click",function(){alert("hello");});//删除时用了另一个函数
//以上错误，无法移除，因为匿名函数是两个函数   */



/*
	页面加载事件
*/
function addLoadEvent(func){
	//将现有的window.onload事件处理函数的值存入变量oldOnload
	var oldOnLoad=window.onload;
	//如果在这个处理函数上还没有绑定任何函数，就像平时那样把新函数添加给他
	if(typeof window.onload!='function'){
		window.onload=func;
	}else{
		//如果在这个处理函数上已经绑定了一些函数，则将新函数追加到现有指令的尾部
		window.onload=function(){
			oldOnLoad();//如果以前这个页面有函数，则调用以前的函数
			func();//再调用当前函数
		}
	}
}
window['lhz']['addLoadEvent']=addLoadEvent;






//移除事件
	
function removeEvent(node,type,listener){
				//使其可接受ID或者node
				if(!(node=$(node))){return false;}
				//w3c（现代浏览器）加事件的方法
				if(node.removeEventListener){
					node.removeEventListener(type,listener,false);
					return true;
				}else if(node.detachEvent){
					//MSIE的事件				//node函数的一个属性名
					node.detachEvent('on'+type,node[type+listener]);
					node[type+listener]=null;//监听
					return true;
					}
					return false;
				

 }
 window['lhz']['removeEvent']=removeEvent;




//扩展开关属性
function toggleDisplay(node,value){//不能传none,否则没有显示效果
	//使其可接受ID或者node
	if(!(node=$(node))){return false;}
	if(node.style.display!='none'){
		node.style.display='none';
	}else{
		node.style.display=value||'';//''是浏览器的默认值
	}
	return true;
}
window['lhz']['toggleDisplay']=toggleDisplay;




/////////////////////////////////////////DOM节点操作补充////////////////////////////////////////////
//在节点后面加兄弟节点
//                  节点   参考节点
function insertAfter(node,referenceNode){
	//使其可接受ID或者node
	if(!(node=$(node))){return false;}
	if(!(referenceNode=$(referenceNode))){return false;}
	var parent=referenceNode.parentNode;//参考节点的父节点
	//如果父节点的最后一个子节点是参考节点
	if(parent.lastChild==referenceNode){
		parent.appendChild(node);//直接添加节点
	}else{
		//若不是，在参加节点的下一个兄弟节点前面插入节点
		parent.insertBefore(node,referenceNode.nextSibling);
	}
};
window['lhz']['insertAfter']=insertAfter;




//标准一次只能删除一个子节点，新增一个函数一次删除所有的子节点
//删除节点下的所有子节点
function removeChildren(parent){
	//使其可接受ID或者node
	if(!(parent=$(parent))){return false;}
	while(parent.firstChild){//循环父节点下的所有子节点
		parent.removeChild(parent.firstChild);//删除所循环的子节点
	}
	 return parent;//返回空的父节点
};
window['lhz']['removeChildren']=removeChildren;




//在父节点的第一个子节点前面添加一个新节点
function prependChild(parent,newChild){
	//使其可接受ID或者node
	if(!(parent=$(parent))){return false;}
	if(!(newChild=$(newChild))){return false;}
	if(parent.firstChild){//查看parent节点下是否有子节点
		//如果有子节点，就在这个子节点前添加
		parent.insertBefore(newChild,parent.firstChild);
	}else{
		//如果没有子节点则直接添加
		parent.appendChild(newChild);
	}
	return parent;
 };
 window['lhz']['prependChild']=prependChild;




 //////////////////////////////////////////////////////////////////////////////////////////////////
 /////////////////////////////样式表操作第一弹:设置样式规则 ->增强了////////////////////////////////////////
 //////////////////////////////////////////////////////////////////////////////////////////////////
 //大小写转换
 function camelize(s){//word-word 转换为wordWord
 	return s.replace(/-(\w)/g,function(strMatch,p1){
 		//正则表达式中的函数会传入一个数组，在用匿名函数的方式逐一输出
 		//alert(strMatch);///-(\w)/g
 		return p1.toUpperCase();//把字母转化为大写的函数
 	});
 }
 window['lhz']['camelize']=camelize;


//wordWord转换为word-word 
 function uncamelize(s,sep){
 	sep=sep || '-';
 	return s.replace(/([a-z])([A-Z])/g,function(match,p1,p2){
 		//alert(match);///([a-z])([A-Z])/g
 		return p1+sep+p2.toLowerCase();
 	});
 }
 window['lhz']['uncamelize']=uncamelize;




//通过Id修改单个元素的样式   ("backgroundColor":"red")
 function setStyleById(element,styles){
 						//id名或节点   样式
 	if(!(element=$(element))){
 		return false;
 	}
 	for(property in styles){
 		//循环id中的属性
 		if(!styles.hasOwnProperty(property)){
 			continue;//再循环下一个属性
 		}
 		if(element.style.setProperty){
 			//DOM2样式规范   setProperty(propertyName,value,priority);
 			//setProperty("background-color")     
 			//             设置属性    属性名           对应属性名的风格样式     索引号
 			element.style.setProperty(uncamelize(property,'-'),styles[property],null);
 		}else{
 			//IE浏览器
 			//备用方法：element.style["backgroundColor"]="red";
 			element.style[camelize(property)]=styles[property];
 		}
 	}
 }
 window['lhz']['setStyle']=setStyleById;
 window['lhz']['setStyleById']=setStyleById;


//通过标签名修改多个样式：调用举例：lhz.setStylesByTagName('a',('color':'red'))
//                         标签名    样式对象  父标签ID号
 function setStylesByTagName(tagname,styles,parent){
 	parent=$(parent) || document;//当parent未传入时默认为document;
 	var elements=parent.getElementsByTagName(tagname);
 	for(var e=0;e<elements.length;e++){
 		setStyleById(elements[e],styles);
 		
 	}
 }
window['lhz']['setStylesByTagName']=setStylesByTagName;




//
function setStyleByClassName(parent,tag,className,style){
	//parent默认为document   要传入所有的tag则是*号
	if(!(parent=$(parent))){
		return false;
	}
	var elements=getElementsByClassName(className,tag,parent);
	for(var e=0;e<elements.length;e++){
		setStyleById(elements[e],style);
	}
	return true;
}
window['lhz']['setStyleByClassName']=setStyleByClassName;




/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////样式表操作第二弹：基于className切换样式/////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
//取得元素中类名的数组  element:要查找类名的元素,id名
function getClassNames(element){
	if(!(element=$(element))){
		return false;
	}
	//用一个空格替换多个空格，再基于空格分隔类名
	return element.className.replace(/\s+/,' ').split(' ')
	//调用时将会返回一个数组，类名用，隔开
}
window['lhz']['getClassNames']=getClassNames;



//检查元素中是否存在某个类
/*
element:要查找类名的元素
className:要查找的类名
*/
function hasClassName(element,className){
	if(!(element=$(element))){
		return false;
	}
	var classes=getClassNames(element);//得到所有类名
	for(var i=0;i<classes.length;i++){
		//循环所得到的类名
		if(classes[i]===className){
			//当类名===className时结束循环
			return true;
		}
	}
	return false;
}
window['lhz']['hasClassName']=hasClassName;


/*
为元素添加类
element:要添加类名的元素
此方法可能重复添加相同的类名，需改进
className:要添加的类名
*/
function addClassName(element,className){
	if(!(element=$(element))){
		return false;
	}
	if(hasClassName(element,className)){
		return;
	}
	//将类名添加到当前className的末尾，如果没有类名，则不包含空格
	//即id名为element的是否有className
	var space=element.className?' ':'';
	//   a b     b
	element.className+=space+className;
	return true;
}
window['lhz']['addClassName']=addClassName;


//从元素中删除类
function removeClassName(element,className){
	if(!(element=$(element))){
		return false;
	}
	//先取得所有的类
	var classes=getClassNames(element);
	//循环遍历数组删除匹配的项
	//因为从数组中删除项会使数组变短，所以要反向删除
	var length=classes.length;
	var a=0;
	for(var i=length-1;i>=0;i--){
		if(classes[i]===className){
			delete(classes[i]);//delete只将数组中下标为i的元素改为undefined,并没有完全删除
			a++;
		}
	}
	element.className=classes.join(" ");
	//判断是否删除成功
	return (a>0?true:false);
}

window['lhz']['removeClassName']=removeClassName;









/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////样式表操作第三弹:更大范围的改变，切换样式///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/*
	通过url取得包含所有样式表的数组
	url:css表的地址
*/
function getStyleSheets(url,media){
	var sheets=[];
	for(var i=0;i<document.styleSheets.length;i++){//遍历所有的样式表
				//当某个样式表的url不存在，即索引号为-1时
		if(document.styleSheet[i].href){return false;}
		if(url&&document.styleSheets[i].href.indexOf(url)==-1){
			continue;
		}
		if(media){
			//规范化media字符串
			media=media.replace(/,\s*/,',');
			var sheetMedia;
			if(document.styleSheets[i].media.mediaText.replace(/,\s*/,',')){;
				//Safari会添加额外的逗号和空格
				sheetMedia=sheetMedia.replace(/,\s*$/,'');
			}else{
				//ie方法
				sheetMedia=document.styleSheets[i].media.replace(/,\s*/,',');
			}
			//如果media不匹配，则跳过
			if(media!=sheetMedia){
				continue;
			}
		}
		sheets.push(document.styleSheets[i]);
	}
	return sheets;
}
window['lhz']['getStyleSheets']=getStyleSheets;



//添加新的样式表
//media:在某个媒体上实现
function addStyleSheet(url,media){
	media=media || 'screen';
	var link=document.createElement("link")
	link.setAttribute('rel','stylesheet');
	link.setAttribute('type','text/css');
	link.setAttribute('href','url');
	link.setAttribute('media','media');
	document.getElementsByTagName('head')[0].appendChild(link);
}
window['lhz']['addStyleSheet']=addStyleSheet;

    
//移除样式表
function removeStyleSheet(url,media){
	var styles=getStyleSheets(url,media);
	for(var i=0;i<styles.length;i++){
		//style[i]表示样式表    .ownerNode表示这个样式表所属的节点
		var node=styles[i].ownerNode || styles[i].owningElement;
		//禁用样式表
		styles[i].disabled=true;
		//移除节点
		node.parentNode.removeChild(node);
	}
}
window['lhz']['removeStyleSheet']=removeStyleSheet;


/////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////样式表操作第四弹:样式规则操作////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/*添加一条css规则（'.test',{'font-size':'40%','color':'red'}）
	如果存在多个样式表，可使用url和media
	selector:选择器   .test
	styles  :样式
	index:    索引号
*/
function addCSSRule(selector,styles,index,url,media){
	var declaration='';
	for(property in styles){
		if(!styles.hasownProperty(property)){
			continue;
		}
		declaration+=property+":"+styles[property]+";";
	}
	var stylesheets=getStyleSheets(url,media);
	var newIndex;
	for(var i=0;i<styleSheet.length;i++){
		if(styleSheet[i].insertRule){
			newIndex=(index>=0?index:styleSheets[i].addCSSRules.length);
			styleSheets[i].insertRule(selector+'{'+declaration+'}',newIndex);
		}else if(styleSheet[i].addRule){
			newIndex=(index>=0?index:-1);
			styleSheets[i].addRule(selector,declaration,newIndex);
		}
	}
}
window['lhz']['addCSSRule']=addCSSRule;


/*
编辑样式规则：lhz.editcssrule('.test',{'font-size':'red'})
*/
function editCSSRule(selector,styles,url,media){
	var styleSheets=getStyleSheets(url,media);
	for(i=0;i<styleSheets.length;i++){
		var rules=styleSheet[i].cssRules || styleSheets[i].rules;
		if(!rule){
			continue;
		}
		selector=selector.toUpperCase();
		for(var j=0;j<rules.length;j++){
			if(rules[j].selectorText.toUpperCase()==selector){
				for(property in styles){
					if(!styles.hasownProperty(property)){
						continue;
					}
					rules[j].style[Camelize(property)]=styles[property];
				}
			}
		}
	}
}
window['lhz']['editCSSRule']=editCSSRule;




//取得一个元素的计算样式
function getStyle(element,property){
	if(!(element=$(element))){
		return false;
	}
	var value=element.style[camelize(property)];
	if(!value){
		if(document.defaultView&&document.defaultView.getComputedStyle){
			var css=document.defaultView.getComputedStyle(element,null);
			value=css?css.getPropertyValue(property):null;
		}else if(element.currentStyle){
			value=element.currentStyle[camelize(property)];
		}
	}
	return value=='auto'?'':value;
}
window['lhz']['getStyle']=getStyle;
window['lhz']['getStyleById']=getStyle;
})();

   
   











//扩展全局的 
    //object,array-->js中的原生对象
    						//将属性的值以json的格式输出
			Object.prototype.toJSONString=function(){
				var jsonstr=[];

				for(var i in this){
					if(this.hasOwnProperty(i)){//有i这个属性
						//           \"是双引号的json格式
						jsonstr.push("\""+i+"\""+":\""+this[i]+"\"");
						/*jsonstr+=i.toJSONString+":"+this[i].toJSONString*/
						//用JSONString调用键和值是可以的，但会存在内存溢出，太多的递归的问题
					}
				}
				var r=jsonstr.join(",");//添加逗号和换行
				r="{"+r+"}";
				return r;//返回json字符串
			}


	//将数组的值以json的格式输出
		Array.prototype.toJSONString=function(){
			var json=[];//定义一个json的容器
			for(var i=0;i<this.length;i++){//循环数组里的值
				json[i]=(this[i]!=null) ? this[i].toJSONString():"null";
				//判断这个值是否为空，若为空则为null
				
			}
			return "["+json.join(",")+"]";
		}

	
	
	

	











