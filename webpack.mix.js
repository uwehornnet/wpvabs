let mix = require('laravel-mix');

mix.webpackConfig({
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: Config.babel()
					}
				]
			}
		]
	}
});

mix.js('src/js/vabs_form.js', 'assets/js')
	.js('src/js/vabs_admin.js', 'assets/js')
	.sass('src/sass/vabs_admin.sass', 'assets/css')
	.sass('src/sass/vabs_form.sass', 'assets/css');
