<div id="vabs">
	<div class="vabs">
		<?php
		if( $this->config['api_token'] != null ) {?>
			<div class="vabs__card">
				<div class="vabs__card--header">
					<img src="<?php echo plugins_url('/wpvabs/assets/img/logo.png'); ?>" alt="logo">
				</div>
				<div class="vabs__card--stepper">
					<div class="stepper">
						<div class="stepper__step" id="step_one">
							<div class="form__field">
								<h2>Where do you want to place your shortcode?</h2>
								<p>If you have a page where you display a lot of different courses you can choose "Landingpage". Otherwise you can place it on a detailed landingapge.</p>
								<label><input type="radio" name="page" class="from__field--radio" value="detail"> Buchungsformular eines bestimmten Kurses</label>
								<label><input type="radio" name="page" class="from__field--radio" value="allgemein"> Buchungsformular einer Interessenkategorie</label>
								<label><input type="radio" name="page" class="from__field--radio" value="contact"> Kontaktanfragefromular</label>
							</div>
						</div>
						<div class="stepper__step" id="step_two" style="max-height: 0px;">
							<div class="form__field">
								<p>Ok, we are now one step closer to your shortcode, which Interest do you want to display?</p>
							</div>
						</div>
						<div class="stepper__step" id="last_step" style="max-height: 0px;">
							<div class="form__field">
								<p>So you want to display this shortcode on a detailed Landingpage, which course do you want to display?</p>
							</div>
						</div>
						<div class="stepper__step" id="final" style="max-height: 0px;">
							<div class="form__field">
								<?php foreach($this->languages as $key => $avlue) { ?>
									<?php if($key === 'de'):  ?>
										<label><input type="radio" name="lang_name" class="from__field--radio--lang" value="<?= $key ?>" checked><?= $key ?></label>
									<?php else: ?>
										<label><input type="radio" name="lang_name" class="from__field--radio--lang" value="<?= $key ?>"><?= $key ?></label>
									<?php endif; ?>
								<?php };?>
							</div>
							<div class="form__field has-button-input">
								<button id="generate_custom_vabs_shortcode" class="button button-primary">generate shortcode</button>
								<input type="text" id="vabs_shortcode_output_element" class="disabled" value="">
							</div>
						</div>
					</div>
				</div>
			</div>
		<?php } else {?>
			<div class="info">
				<div class="info__block">
					<div class="info__block--icon">
						<i class="material-icons">notification_important</i>
					</div>
					<div class="info__block--body">
						To use the full power of this VABS API Tool, you have to fill in at least the API Token. Otherwise you will not be able to connect.
					</div>
				</div>
			</div>
		<?php } ?>
	</div>
</div>