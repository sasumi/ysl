/*
	You would include this configuration file by running QZFLMin like so:
	java -jar jsrun.jar QZFLMin.rhino -c=conf/sample.conf

*/
{
	projects: [
		{
			name : "BASE",
			target : "../source/ysl.base.js",
			level: 0,
			include : [
				"../source/base/core.js",
				"../source/base/lang.js",
				"../source/base/selector.js",
				"../source/base/event.js",
				"../source/base/dom.js",
				"../source/base/net.js",
				"../source/base/ua.js",
				"../source/base/object.js",
				"../source/base/string.js"
			]
		},
		{
			name : "ALL",
			target : "../source/ysl.all.js",
			level: 2,
			include : [
				"../source/ysl.base.js",

				"../source/com/cookie.js",
				"../source/com/date.js",
				"../source/com/media.js",

				"../source/widget/animate.js",
				"../source/widget/datepicker.js",
				"../source/widget/drogdrop.js",
				"../source/widget/helper.js",
				"../source/widget/pageslide.js",
				"../source/widget/pagination.js",
				"../source/widget/popup.js",
				"../source/widget/slide.js",
				"../source/widget/tab.js",
				"../source/widget/tip.js",
				"../source/widget/tween.js",
				"../source/widget/validator.js"
			]
		}
	],

	level: 0,
	encode : "utf-8",
	comment: "YSL javascript library"
}