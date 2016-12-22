window.onload=function()
{

	var oBody=document.getElementsByTagName('body')[0];
	var oHandle=document.getElementById('handle');
	var oContainer=document.getElementById('container');
	var oAdd=document.getElementById('add');
	var oNotesHead=document.getElementsByClassName('notes_head');
	

	var isSmall=true;//检测当前便签是否为放大状态
	var junNote=(/^junNote[\w\d\s]*/);//该正则匹配是否为本便签添加的localStorage

	//页面初始化立刻执行
	(function(){

		addMask();

		/*根据localStorage缓存还原上一次的便签记录*/
		for(var i=0;i<localStorage.length;i++)
		{
			if(junNote.test(localStorage.key(i)))
			{	
				var key=localStorage.key(i);
				var value=getData(key);
				var time=value.substring(0,20);
				value=value.substring(20);
				key=key.substring(7);
				addNote(key,value,time);
			}
			
		}

		inputChang();//触发inputChange函数

	})()
	

	/*点击动态弹出便签框*/
	oHandle.addEventListener('click',function(){

		//startMove(oContainer,{top:0});//便签窗口缓慢出现
		startMove(oContainer,{opacity:100,top:0});
		startMove(oHandle,{opacity:0});//let‘s go 按钮动态消失
		clearMask();//把初始化的遮罩删掉
		this.style.zIndex=-1;
	});

 
	
	/*点击添加便签*/
	oAdd.addEventListener('click',function()
	{
		addNote('','','');//添加便签
		
	},false);

	


	/*把缩小，放大，删除事件委托给最外层窗口*/
	oContainer.addEventListener('click',function(event)
		{
			var oEvent=window.event || event;
			var oTarget=oEvent.target;

			if(oTarget.className=='sign_1')/*缩小便签*/
			{
				if(!isSmall)
				{
					clearMask();
					reduceNote(oTarget);
					isSmall=true;
				}
			}
			else if(oTarget.className=='sign_2')/*放大便签*/
			{
				if(isSmall)
				{	
					addMask();
					expendNote(oTarget);
					isSmall=false;
				}
			}
			else if(oTarget.className=='sign_3')/*删除便签*/
			{	
				deleteNote(oTarget);
				if(document.getElementsByClassName('mask')[0])//如果是小便签状态，没有遮罩，就不会触发删除遮罩
				{
					clearMask();
				}
			}

		},false);
		

	
	


	/*关闭或者刷新页面时，保存数据到localStorage*/
	window.onunload=function()
	{
		inputChang();	
	}


	/*当input框改变或者关闭页面的时候，触发该函数*/
	function inputChang()
	{

		var oNotes=document.getElementsByClassName('notes');
		var oInput=null;
		var oNotesBody=null;
		var oldValue='';
		for(var i=0;i<oNotes.length;i++)
		{
			(function(i){
				oInput=oNotes[i].getElementsByTagName('input')[0];
				oNotesBody=oNotes[i].getElementsByClassName('notes_body')[0];
				oDateTime=oNotes[i].getElementsByClassName('data_time')[0];
				if(oInput.value!='')
				{		
				 	saveData('junNote'+oInput.value,oDateTime.innerHTML+oNotesBody.innerHTML);  //junNote标记本标签的key
				}

				oInput.addEventListener('focus',function(){
						oldValue=this.value;
					},false);

				oInput.addEventListener('blur',function(){
					if(this.value!=oldValue)
					{
						clearData(oldValue);
					}
				},false);

			})(i)
		}
	}


	/*新建便签方块函数*/
	function addNote(title,content,time)
	{
		var notesRect=document.createElement('div');
		var notesHead=document.createElement('div');
		var notesBody=document.createElement('div');
		var dataTime=document.createElement('div');
		var oDate=new Date();

		function changeTime(time)//如果时间为个位数，就添加一个0，返回
		{
			if(parseInt(time)<10)
			{
				return '0'+time;
			}
			else
			{
				return time;
			}
		}

		var year=oDate.getFullYear();
		var month=changeTime(oDate.getMonth()+1);
		var day=changeTime(oDate.getDate());
		var hours=changeTime(oDate.getHours());
		var minute=changeTime(oDate.getMinutes());
		var second=changeTime(oDate.getSeconds());
		var creatNoteTime=year+'-'+month+'-'+day+'--'+hours+':'+minute+':'+second;

		notesRect.className='notes notes_rect';
		notesHead.className='notes_head';
		notesHead.innerHTML='<div><span class=sign_1>-</span><span class=sign_2>□</span><span class=sign_3>×</span><input class=sign_4 type="text" placeholder="请输入标题" value='+title+'></div>';
		notesBody.className='notes_body';
		notesBody.setAttribute('contenteditable','true');
		notesBody.innerHTML=content;
		dataTime.className='data_time';

		dataTime.innerHTML=time; /*从缓存获取时间*/
		if(dataTime.innerHTML=='')/*如果是新建便签，就获取当前系统时间*/
		{
			dataTime.innerHTML=creatNoteTime;
		}
		
		notesRect.appendChild(notesHead);
		notesRect.appendChild(notesBody);
		notesRect.appendChild(dataTime);

		oContainer.insertBefore(notesRect,oAdd);

		//startMove(notesRect,{height:400});//小便签高度动态伸展
		
	}


	/*点击缩小框函数，这时oContainer的zIndex变成0*/
	function　reduceNote(note)
	{
		var noteH=note.parentNode.parentNode;
		startMove(noteH.parentNode,{height:440});
		noteH.parentNode.style.position='static';
		noteH.parentNode.style.zIndex='0';
		noteH.parentNode.style.opacity='0.8';
		
		noteH.parentNode.style.width='30%';

		noteH.nextElementSibling.style.fontSize='20px';
		noteH.nextElementSibling.style.lineHeight='30px';

		
	}

	/*点击放大框函数,放大时oContainer的zIndex变成3*/
	function expendNote(note)
	{
		var noteR=note.parentNode.parentNode.parentNode;
		var noteH=note.parentNode.parentNode;

		noteR.style.position='absolute';
		noteR.style.zIndex='3';
		noteR.style.opacity='1';
	
		var scrollTop = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
		noteR.style.top=scrollTop+100+'px';
		noteR.style.left='7.5%';
			
		startMove(noteR,{height:550});
		noteR.style.width='80%';
		
		var note=noteH.nextElementSibling
		note.style.fontSize='40px';
		note.style.lineHeight='55px';
	}

	/*删除便签函数*/
	function deleteNote(note)
	{
		
		clearData(note.nextElementSibling.value);//删除缓存记录
		oContainer.removeChild(note.parentNode.parentNode.parentNode);//删除当前便签节点
	}


	/*添加遮罩函数，遮罩的zindex为1*/
	function addMask()
	{
		var oMask=document.createElement('div');

		oMask.className='mask';
		oMask.style.position='absolute';
		oMask.style.zIndex='1';
		oMask.style.height=document.body.scrollHeight+'px';
		oMask.style.width='100%';
		oMask.style.background='rgba(204,204,204,0.8)';
		oMask.style.top=0;
		oMask.style.left=0;		

		oBody.insertBefore(oMask,oContainer);
	}

	/*清除遮罩函数*/
	function clearMask()
	{
		var oMask=document.getElementsByClassName('mask')[0];
		oBody.removeChild(oMask);
	}



	/*localStorage本地数据保存*/
	function saveData(key,value)
	{
		localStorage.setItem(key,value);
	}

	/*localStorage本地数据获取*/
	function getData(key)
	{
		return localStorage.getItem(key);
	}


	/*删除所有数据*/
	function clearData(key){
		localStorage.clear(key);
	}


	
	/*获取对象计算后的样式*/
	function getStyle(obj, attr)
	{
		  if(obj.currentStyle)
		{
		    return  obj.currentStyle[attr];
		}
		else
		{
		   return  getComputedStyle(obj,false)[attr];
		}
	}		
}