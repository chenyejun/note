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

	
	function startMove(obj,json,fn)
	{
		clearInterval(obj.timer);
		obj.timer=setInterval(function()
			{
				var bStop=true;
				for(var attr in json)
				{
					
					var iCur=0;
					if(attr=='opacity')
					{
						iCur=parseInt(parseFloat(getStyle(obj,attr))*100);/*因为opacity是小数，如果直接用parseInt，结果就直接变成零，导致没有效果的现象，为什么用了parseFloat之后还要用parseInt呢？因为就算乘了100，还是有可能会有小数出现，避免小数影响最终效果，所以最后还要把它变成整数。*/
					}
				    else
				    {
				    	iCur=parseInt(getStyle(obj,attr));
				    }
					var iSpeed=(json[attr]-iCur)/8;
					iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);

                    if(iCur!=json[attr])
                    {
                    	bStop=false;
                    }
                    
					if(attr=='opacity')
					{
						obj.style.filter='alpha(opacity'+(iCur+iSpeed)+')';
						obj.style.opacity=(iCur+iSpeed)/100;
					}
					else
					{
						obj.style[attr]=iCur+iSpeed+'px';
					}
				}

				if(bStop)
				{
						if(json[attr]==iCur)
						{
							clearInterval(obj.timer);

							if(fn)
							{
								fn();
							}
						}
				}
			},30);
	}