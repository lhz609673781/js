Cookies={
	//名称、值、过期天数
	set:function(key,value,minsToExpire){
		var expires="";
		if(minsToExpire){
			var date=new Date();
			date.setTime(date.getTime()+(minsToExpire*60*1000));//过期时间
			expires=";expires="+date.toGMTString();//过期日期   expires=Sat,14 Mar 2009 17:45:33 GMT;
		}
		//cookie存的时候，键和值都要编码  key=value;expires=data.toGMTString();path=/;
		document.cookie=encodeURIComponent(key)+"="+encodeURIComponent(value)+expires+";path=/";
		return value;
	},

	get:function(key){
		var nameCompare=key+"="; //name=  
		var cookieArr=document.cookie.split(';');
		//通过；分组
		for(var i=0;i<cookieArr.length;i++){
			var a=cookieArr[i].split("=");
			//通过=分组
			var currentKey=decodeURIComponent(a[0]);
			if(key==currentKey || " "+key==currentKey){
				return decodeURIComponent(a[1]);//解码取值
			}
		}
		return null;
	},
	//判断浏览器是否禁用了cookie
	isAvailable:function(){
		return (this.set('cookieTest','1')==this.get('cookieTest'));
		//看是否返回1，不返回1则表示被禁用了
	},

	//如果要删除cookie,只需要将expire设置为一个当前时间之前的过去时间即可
	del:function(key){
		this.set(key,"",-1)//-1
	}

}   
