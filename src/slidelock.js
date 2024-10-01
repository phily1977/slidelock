/*滑块锁,PHIL,2024-10-01*/

class slidelock{

	static downX;
	static isSuccess;
	static successMoveDistance;
	
	//构造函数
	constructor()
	{
		this.slidelockobj = document.createElement("div");
		this.slidelockobj.id = "slidelockobj";
		
		var bgDiv = document.createElement("div"); 
		bgDiv.className = "bgcolor";
		this.slidelockobj.appendChild(bgDiv);
		
		var txtDiv = document.createElement("div"); 
		txtDiv.className = "txt";
		txtDiv.innerHTML = "滑动解锁";
		
		this.slidelockobj.appendChild(txtDiv);
		
		this.slider = document.createElement("div"); 
		this.slider.className = "slider";
		
		var slideIcon = document.createElement("i"); 
		slideIcon.className = "iconfont icon-double-right";
		this.slider.appendChild(slideIcon);
		
		this.slidelockobj.appendChild(this.slider);
		
		
		

	}
	
	//绑定网页对象
	bind(cssSelector)
	{
		let bindObj = document.querySelector(cssSelector);
		bindObj.appendChild(this.slidelockobj);
		
		slidelock.successMoveDistance = this.slidelockobj.offsetWidth- this.slider.offsetWidth, //解锁需要滑动的距离
		slidelock.downX = 0;			//滑动移动距离
		slidelock.isSuccess = false;
		
		//添加事件
		this.slider.addEventListener("mousedown", slidelock.sliderhoverHandler,{ passive: false });
		this.slider.addEventListener("touchstart", slidelock.sliderhoverHandler,{ passive: false });
	}
	
	//滑块点击选中事件
	static sliderhoverHandler(e){
			e.preventDefault();
			
			console.log(e.target.parentElement);
			var bgColor = e.target.parentElement.querySelector(".bgColor");
            bgColor.style.transition = "";
            e.target.style.transition = "";
			
            var e = e || window.event || e.which;
            slidelock.downX = e.clientX;
			
			if (slidelock.downX == undefined)
			{
				slidelock.downX = e.touches[0].clientX;
			}
			
			console.log(slidelock.downX);
			
            //在鼠标或手指按下时，分别给添加移动和松开事件
			//document.onmousemove = slidelock.slidermoveHandler;
			//document.onmouseup = slidelock.sliderreleaseHandler;
            document.addEventListener("mousemove",slidelock.slidermoveHandler,{ passive: false });
            document.addEventListener("mouseup",slidelock.sliderreleaseHandler,{ passive: false });	

            document.addEventListener("touchmove",slidelock.slidermoveHandler,{ passive: false });
            document.addEventListener("touchend",slidelock.sliderreleaseHandler,{ passive: false });	
	}
	
	//获取鼠标当前需要移动多少距离的方法
	static getOffsetX(offset,min,max){
		if(offset < min){
			offset = min;
		}else if(offset > max){
			offset = max;
		}
		return offset;
	}
	
	//滑块移动事件
	static slidermoveHandler(e){
		//console.log(e.target);
		
		e.preventDefault();
		var e = e || window.event || e.which;
		var moveX = e.clientX;
		if (moveX == undefined)
		{
			moveX = e.touches[0].clientX;
		}
		var offsetX = slidelock.getOffsetX(moveX - slidelock.downX,0,slidelock.successMoveDistance);
		var bgColor = e.target.parentElement.querySelector(".bgColor");
		bgColor.style.width = offsetX + "px";
		e.target.style.left = offsetX + "px";

		if(offsetX == slidelock.successMoveDistance){
			//移除事件
			
			//e.target.onmousedown = null;
			e.target.removeEventListener("mousedown",slidelock.sliderhoverHandler);
            document.removeEventListener("mousemove",slidelock.slidermoveHandler);
			//document.onmousemove = null;
			
			e.target.removeEventListener("touchstart",slidelock.silderhoverHandler);
            document.removeEventListener("touchmove",slidelock.sildermoveHandler);
			
			bgColor.style.backgroundColor ="lightgreen";
            e.target.className = "slider active";
			slidelock.isSuccess = true;
			
			console.log("unlock!")
			//success();
			
			document.dispatchEvent(
				new CustomEvent("sliderunlock", {
				  bubbles: true,
				  detail: { message: () => "unlock success." },
				}),
			  );

		}
	}

	//滑块释放事件
	static sliderreleaseHandler(e){
		//console.log(e.target);
		e.preventDefault();
		if(!slidelock.isSuccess){
			var bgColor = e.target.parentElement.querySelector(".bgColor");
			bgColor.style.width = 0 + "px";
			e.target.style.left = 0 + "px";
			bgColor.style.transition = "width 0.8s linear";
			e.target.style.transition = "left 0.8s linear";
		}
		
		//e.target.removeEventListener("mousedown",slidelock.sliderhoverHandler);
		//e.target.removeEventListener("touchstart",slidelock.sliderhoverHandler);
		
		document.removeEventListener("mousemove",slidelock.slidermoveHandler);
		document.removeEventListener("mouseup",slidelock.sliderreleaseHandler);
		document.removeEventListener("touchmove",slidelock.slidermoveHandler);
		document.removeEventListener("touchend",slidelock.sliderreleaseHandler);	
		
	}
}
