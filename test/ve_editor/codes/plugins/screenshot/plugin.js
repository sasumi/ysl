/**
 * 截屏
 * @author sasumi
 * @build 20110428
 */
(function(v){
	v.Class('ve.plugin.ScreenShot', {
		editor: null,						//编辑器对象
		uploader: null,						//上传控件
		uploadURL: null,					//上传URL
		userLocation:null,					//用户地理位置
		bCheckUserLocationSending: false,	//是否正在检测用户地理位置
		DIYClipBoardImg: 0,
		loginUin: null,
		
		init: function (editor, url) {
			this.editor = editor;
			this.editor.addCommand('showScreenShotPanel', ve.bind(this,this.start));
			this.editor.addButton('showScreenShotPanel', {
				to: 'group4',
				at: 2,
				'class': 'veScreen',
				title: '截屏',
				cmd: 'showScreenShotPanel'
			});
			this.editor.onKeyDown.add(ve.bind(this,this.pasteEvent));
			this.loginUin = top.g_iLoginUin;
		},
		
		/**
		 * 开始截屏动作
		 */
		start: function(){
			if(!v.isIE && !v.isGecko){
				this.editor.showStatusbar('很抱歉，目前截屏功能只支持ie和firefox浏览器。');
				return;
			}
			this.doCapture();
		},
		
		/**
		 * 截屏
		 */
		doCapture: function(){
			var screencapture = this.getCaptureObject('ScreenCapture');
			if(!screencapture){
				this.installCaptureObject();
				return;
			}

			screencapture.OnCaptureFinished = ve.bind(this, function(){
				this.prePaste();
				screencapture.BringToFront(window);
				var fileID = screencapture.SaveClipBoardBmpToFile(1);
				this.uploadPic(fileID);
			});
			
			screencapture.DoCapture();	
			
		},
		
		/**
		 * 安装插件
		 */
		installCaptureObject: function(){
			var gsAgent = navigator.userAgent.toLowerCase();
			var gbIsKHTML = (gsAgent.indexOf("khtml") > -1);
			var gbIsWin = (gsAgent.indexOf("windows")>-1 || gsAgent.indexOf("win32")>-1);
			var gbIsFF = (gsAgent.indexOf("gecko")>-1 && !gbIsKHTML);
			var gsFFVer = /firefox\/((\d|\.)+)/i.test(gsAgent)&&RegExp["$1"];
			var mbAblePlugin = gbIsWin && (gbIsFF && gsFFVer.split(".")[0] >= 3 && (gsFFVer.split(".")[1] > 0 || gsFFVer.split(".")[2] >= 8 || parseInt(navigator.buildID.substr(0, 8)) >= 20090701));
			if(!mbAblePlugin && !v.isIE) {
				var dlg = new parent.QZONE.widget.Confirm("温馨提示", "您当前使用的操作系统和firefox浏览器不适合安装截屏控件", 3);
				dlg.show();
				return;
			}
			
			var dlg = QZONE.FP.popupDialog('QQ空间截屏控件安装提示',{src:'http://'+IMGCACHE_DOMAIN+'/qzone/client/capture/install_hint.htm'},342,130);
		},
		
		
		getCaptureObject: function(id){
			var obj = null;
			try{
				if(ve.isIE) {
					obj = new ActiveXObject('TXGYMailActiveX.' + id);
				} else {
					if(!$("ffScreenPlugin")) {
						var oDiv = QZONE.dom.createElementIn("div", document.body, false);
						oDiv.innerHTML = '<embed id="ffScreenPlugin" type="application/x-tencent-qmail" hidden="true"></embed>';
					}					
					var pluginObject = $('ffScreenPlugin');
					if(id == "ScreenCapture") {
						obj = pluginObject.CreateScreenCapture();
					}
					else if(id == "Uploader") {
						obj = pluginObject.CreateUploader();
					}
				}
			}catch(ex){
				obj = null;
			}
			return obj;
		},
		
		/**
		 * 绑定粘贴事件
		 * @param {Object} e
		 */
		pasteEvent: function(e){
			if (e.ctrlKey && (e.keyCode == 86)||(e.keyCode == 118)){
				var screencapture = this.getCaptureObject('ScreenCapture');
				if(!!screencapture && screencapture.IsClipBoardImage){//系统剪切板有图片
					this.editorPaste(e);
					return false;
				}else{
					return true;
				}
		    }
			if (e.ctrlKey && (e.keyCode == 67)||(e.keyCode == 99)){
				this.DIYClipBoardImg = 0;
		    }
		},
		
		prePaste: function(){
			if(!this.uploader){
				this.uploader = this.getCaptureObject('Uploader');
			}
		   
			if(!this.uploader){
				this.installCaptureObject();
			} else{
				this.uploader.OnEvent = ve.bind(this,this.uploaderOnEvent);
			}
		},
		
		/**
		 * 图片上传的监听函数
		 **/
		uploaderOnEvent: function(obj,eventID,p1,p2,p3){
			if(eventID == 1){
				QZFL.widget.msgbox.show('处理截图预览时遇到错误，请稍后再试。',1,3000);
				this.uploader.OnEvent = null;
			}else if(eventID == 2){
				QZFL.widget.msgbox.show('正在处理图片预览，请稍候 : ' + Math.round(p1/p2*100) + '%',1);
			}else if(eventID == 3){ //完成
				if(!this.uploadDone(this.uploader.Response)){
					return;
				};
				this.pasteImg();
			}
		},
		
		doPaste: function(){
			var screencapture = this.getCaptureObject('ScreenCapture');
			if(!screencapture){return true;}

			if(screencapture.IsClipBoardImage){
				this.prePaste();
				screencapture.BringToFront(window);
				var fileID = screencapture.SaveClipBoardBmpToFile(1);				
				this.uploadPic(fileID);
				return false;
			}
			if(this.DIYClipBoardImg==1){
				this.prePaste();
				screencapture.BringToFront(window);
				var fileID = this._tempFileID;
				this.uploadPic(fileID);
				return false;
			}
			if(ua.ie&&ua.ie<=6){
				return false;
			}
		},
		
		/**
		 * 上传图片
		 * @param {Object} fileID
		 */
		uploadPic: function(fileID){
			if(!this.uploadURL){
				this.checkUserLocation(ve.bind(this, function(){
					this.uploadPic(fileID);
				}));
				return;
			} else if(this.uploadURL == "invalid") {
				var msg = "暂时无法获取您当前的地理位置，请稍后再试。"
				QZFL.widget.msgbox.show(msg, 1, 3000);
				return;
			}
			
			if(fileID){
				this.uploader.URL = this.uploadURL;
				this.uploader.ClearFormItems();
				this.uploader.AddHeader('cookie',document.cookie);
				this.uploader.AddFormItem('picname2', 1, 0, fileID);
				this.uploader.AddFormItem('blogtype',0,0,this.blogType);
				this.uploader.AddFormItem('json',0,0,"1");
				this.uploader.AddFormItem('refer',0,0,'blog');
				this.uploader.StartUpload();
			}
		},

		/**
		 * 检测用户位置
		 * @param {Function} callback
		 */
		checkUserLocation: function(callback){
			//已经拥有URL、正在检测
			if(this.uploadURL || this.bCheckUserLocationSending){
				return;
			}

			this.bCheckUserLocationSending = true;
			top.loadXMLAsync('checkUserLocation','http://route.store.qq.com/GetRoute?UIN='+this.loginUin,
				ve.bind(this,function(){
					var x = top.g_XDoc['checkUserLocation'];
					this.userLocation = x.getElementsByTagName('u')[0].firstChild.nodeValue;	
					this.uploadURL = "http://"+this.userLocation+"/cgi-bin/upload/cgi_upload_illustrated";
					this.bCheckUserLocationSending = false;
					callback();
				}),
				ve.bind(this, function(){
					this.bCheckUserLocationSending = false;
					this.checkUserLocation2(callback);
				}),
			true);	
		},
		
		
		/**
		 * 获取图片上传地址（备用，当第一个取不到的时候用）
		 */
		checkUserLocation2: function(callback){
			if(this.bCheckUserLocationSending){
				return;
			}
			this.bCheckUserLocationSending = true;
			top.loadXMLAsync('checkUserLocationBackUp','http://rb.store.qq.com/GetRoute?UIN='+this.loginUin,
				ve.bind(this, function(){
					var x = top.g_XDoc['checkUserLocationBackUp'];
					this.userLocation = x.getElementsByTagName('u')[0].firstChild.nodeValue;
					this.uploadURL = "http://"+this.userLocation+"/cgi-bin/upload/cgi_upload_illustrated";
					this.bCheckUserLocationSending = false;
					callback();
				})
				, function(){
					this.bCheckUserLocationSending = false;
					QZFL.widget.msgbox.show('无法正确获取您当前的地理位置，请稍后再试。', 1, 3000);
					this.uploadURL = "invalid";
				},true);	
		},
		
		/**
		 * 粘贴图片
		 **/
		pasteImg: function(){
			var src = QZFL.dataCenter.get('capturePic');
			
			QZFL.widget.msgbox.hide();
			try{QZONE.FP.closePopup();}catch(e){};
			
			//把截图显示到编辑区域
			if (typeof(src)!='undefined') {
				var html = '<img src="'+src+'" alt="图片"/>';
				this.editor.setContent(html);
				QZFL.dataCenter.save("capturePic",null);
			}
		},
		
		/**
		 * 判断是否上传成功
		 **/
		uploadDone: function(str){
			var _r = /{.*}/ig;
			if(!str.match(_r)){
				QZFL.widget.msgbox.show('上传图片失败，请稍后再试。',1,3000);
				return false;
			}

			var strMsg = '';
			var o = eval("("+str+")");
			if(o.error!=null){
				strMsg = o.error;
				QZFL.widget.msgbox.show(strMsg,1,3000);
				return false;
			}

			QZFL.dataCenter.save('capturePic',o.url);
			return true;
		},
		
		/**
		 * 截图粘贴
		 */
		editorPaste: function(e){
			var screencapture = this.getCaptureObject('ScreenCapture');
			if(!screencapture){
				return;
			}

			if(screencapture.IsClipBoardImage || (this.DIYClipBoardImg==1 && window.clipboardData.getData("Text") == "TencentMailPlugin_QZONE")){
				//第一次截图，还没有判断用户地理位置
				if(!this.uploadURL){
					this.checkUserLocation(this.doPaste);
				} else{
					this.doPaste();
				} 
				dom.event.cancel(e);
			}
		}
	});
	v.plugin.register('screenshot', ve.plugin.ScreenShot);
})(ve);