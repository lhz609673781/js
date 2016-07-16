
/*myReady(function(){
	xxxxxxxx
})*/
//此方式使浏览器加载比onload更快
function myReady(fn){
//根据功能判断浏览器类别

		//对于现代浏览器，直接用addEventListener
	if(document.addEventListener){
		document.addEventListener("DOMContentLoaded",fn,false);
	}else{
		//针对ie浏览器自己模拟一个函数
		IEContentLoaded(fn);
	}

	function IEContentLoaded(fn){
		//使fn()只执行一次
		var isdone=false;//boolen型
		function ainit(){
			if(!isdone){
				isdone=true;
				fn();
			}
		}

	(function(){
		try{
			//在ie浏览器中，若DOM没有加载完毕，调用doScroll会报错
			document.documentElement.doScroll("left");
		}catch(e){
			//当报错的时候再延迟
			setTime(arguments.callee,10);
			return;
		}
		ainit();
	})();

	//当DOM树在延迟10s的过程中就已经加载完了则可以调用此函数来监听DOM的加载状态
	document.onreadystatechange=function(){
		if(document.readyState=="complete"){
			//说明DOM加载完毕
			ainit();
		}
	}
	}
}
