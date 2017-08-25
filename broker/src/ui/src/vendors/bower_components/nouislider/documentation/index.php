<?php
	$title = "noUiSlider - JavaScript Range Slider";
	$description = "noUiSlider is a free and lightweight JavaScript range slider with full touch support (iOS, Android, Windows 8). Great for responsive designs, and no dependencies!";
?>

<section>

	<div class="view">

		<h3>noUiSlider: lightweight JavaScript range slider</h3>
		<br>

		<p>noUiSlider is a range slider <strong>without bloat</strong>. It offers a ton off <strong>features</strong>, and it is as small, <strong>lightweight</strong> and minimal as possible, which is great for mobile use on the many supported <strong>devices</strong>, including iPhone, iPad, Android devices &amp; Windows (Phone) 8 desktops, tablets and all-in-ones. It works on desktops too, of course!</p>

		<div class="example" id="showcase" style="margin: 0 20px;">

			<div id="range"></div>

			<div style="text-align: center; font-size: 12px;">
				<span id="range-value-4"></span> -
				<span id="range-diff-3" style="color: blue"></span> -
				<span id="range-value-3"></span> -
				<span id="range-diff-2" style="color: blue"></span> -
				<span id="range-value-2"></span> -
				<span id="range-diff-1" style="color: blue"></span> -
				<span id="range-value-1"></span>
			</div>

			<?php run('showcase'); ?>
			<?php run('showcase-connect'); ?>
		</div>
	</div>

	<div class="side">

		<?php code('showcase'); ?>

		<div class="viewer-header">Showing values</div>

		<div class="viewer-content">
			<?php code('showcase-connect'); ?>
		</div>
	</div>
</section>


<section>

	<div class="view">

		<h3 class="quotable">"Lightweight JavaScript range slider with full touch support."</h3>

		<ul class="pro-list">
			<li>Responsive design friendly</li>
			<li>Touch support for iOS, Android &amp; Windows (phone)</li>
			<li>Draggable range</li>
			<li><strong>No jQuery, jQueryUI or other dependencies</strong></li>
			<li>Tested in IE9 - IE11, Edge, Chrome, Opera, Firefox &amp; Safari</li>
		</ul>

		<p>noUiSlider works with pretty much any device, mouse, touchscreen or both, and it'll work beautifully in <strong>responsive designs</strong>. Have you tried this documentation on your phone?</p>
	</div>

	<div class="side">

		<?php sect('getting-started'); ?>
		<h2>Getting started</h2>

		<p>noUiSlider has no dependencies, so you don't need jQuery, jQuery UI, Zepto, etc. to use it.</p>

		<p>Putting all your scripts in the page <code>&lt;head&gt;</code> will slow down your site. If you'd like to know why, consider reading <a href="http://developer.yahoo.com/performance/rules.html#js_bottom">this article by Yahoo!</a>. Put the slider CSS in your <code>&lt;head&gt;</code>, and the script at the end of the <code>&lt;body&gt;</code>.</p>

		<p>To create a slider, call <code>noUiSlider.create()</code> with an element and your options.</p>

<pre class="language-markup"><code>&lt;!-- In &lt;head&gt; --&gt;
&lt;link href="nouislider.min.css" rel="stylesheet"&gt;

&lt;!-- In &lt;body&gt; --&gt;
&lt;script src="nouislider.min.js"&gt;&lt;/script&gt;</code></pre>


		<?php sect('browser-support'); ?>
		<h2>Browser support</h2>

		<p>noUiSlider supports <strong>IE9 and up</strong>, and the latest versions of <strong>Edge</strong>, <strong>Chrome</strong>, <strong>Safari</strong>, <strong>Firefox</strong> and <strong>Opera</strong>.</p>

	</div>
</section>
