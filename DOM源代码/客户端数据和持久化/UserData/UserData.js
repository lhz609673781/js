UserData={
	storageObject:null,//用来存储所有键值对的对象
	init:function(){//初始化的方法，因为存或取的时候一定要指定节点，要有行为

		if(!this.storageObject){//若没有则创建
			this.storageObject=document.createElement("div");
			this.storageObject.addBehavior("#default#UserData");//给节点指定行为
			this.storageObject.style.dispaly="none";
			document.body.appendChild(this.storageObject);
		}
	},

	set:function(key,value){
		if(!this.storageObject){
			this.init();
		}
		this.storageObject.setAttribute(key,value);//对象中有数据
		this.storageObject.save("a");//将对象中的数据序列化到磁盘上，save中的参数就是文件名
		return value;
	},

	get:function(key){
		if(!this.storageObject){
			this.init();
		}
		this.storageObject.load("a");//从磁盘中读取a这个文件，反序列化
		return this.storageObject.getAttribute(key);
	},

	del:function(key){
		if(!this.storageObject){
			this.init();
		}
		this.storageObject.removeAttribute(key);
		this.storageObject.save("a");//删除完div中的userData中的数据后，再覆盖a文件中的数据
	},

	isAvailible:function(){
		return ('\v'=="v"); //判定是否为ie浏览器  
		// ‘\v’会得到'v'  在其他浏览器中‘\v’会被当成转义字符看，表示垂直制单位
	}
}