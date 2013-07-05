/**
 编辑器build程序
 @author sasumi
 所有程序根据组件在qzEditor/build/目录产生无压缩（仅仅合并文件）版本，
 然后根据这个版本在当前目录产生调用脚本
 当前配置文件默认压缩级别为0
**/
{
	projects: [
		//日志编辑器
		{
			name : "qzone editor for profile.",
			target : "../plugins/qzone_blog/plugin.js",
			level : 2,
			include : [
				//Editor engines
				"../plugins/core/plugin.js",				//核心插件
				"../plugins/qzonemedia/plugin.js",			//media base
				"../plugins/emotion/plugin.js",				//soso表情
				"../plugins/imagetools/plugin.js",			//图文混排工具条
				"../plugins/qzonealbum/plugin.js",			//像集
				"../plugins/qzoneflash/plugin.js",			//flash
				"../plugins/qzoneimage/plugin.js",			//图片
				"../plugins/qzonemusic/plugin.js",			//音乐
				"../plugins/qzoneqqshowbubble/plugin.js",	//泡泡
				"../plugins/qzonevideo/plugin.js",			//视频
				"../plugins/screenshot/plugin.js"			//截图
			]
		}
	],
		
	// compress level
	// 0: no min, merge file only
	// 1: minimal, keep linefeeds if single
	// 2: normal, the standard algorithm
	// 3: agressive, remove any linefeed and doesn't take care of potential
	level: 0,
	
	//read & write file encoding.
	encode : "utf-8",
	
	// merge file comments.
	comment: " Qzone Project By Qzone Web Group. \n Copyright 1998 - 2008"
}