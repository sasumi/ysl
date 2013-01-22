/**
 * str = str.replace(qzReg["ubbAlbum"],
			function() {
				var data = [arguments[1], arguments[3], arguments[2]];
	   			var cacheID = QZFL.editor.blogEditorCacheMgr.addEditorCache(data);
				return '<img'+(bAddFlag?' fromubb="1"':'')+' style="height:390px;width:520px;" onresizestart="return false;" src="' + arguments[3] + '" class="blog_album" _cacheID="'+cacheID+'" />';
			}
		);

		return str;
 */