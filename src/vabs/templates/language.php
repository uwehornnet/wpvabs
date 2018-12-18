<div id="vabs">
	<div class="vabs">
		<div class="vabs__card">
			<div class="vabs__card--header">
				<img src="<?php echo plugins_url('/vabs-api-form/assets/img/logo.png'); ?>" alt="logo">
				<div class="navigation">
					<div class="navigation__links">
						<?php foreach($this->languages as $key => $index){ ?>
							<div class="navigation__links--link" data-target="lang_<?= $key ?>"><?= $key ?></div>
						<?php }; ?>
						<div class="navigation__links--link" data-target="lang_new">register new language</div>
					</div>
				</div>
			</div>

			<div class="vabs__card--body">
				<div class="vabs__formlist">
					<?php foreach($this->languages as $key => $value){ ?>
						<div class="vabs__formlist--form" id="lang_<?= $key ?>">
							<form action="<?php echo plugins_url('/vabs-api-form/src/vabs/controller/languagecontroller.php'); ?>" class="form" method="POST">
								<input type="text" name="lang_name" value="<?= $key ?>" style="display: none;">
								<div class="form">
									<div class="form__flex">
										<div class="form__flex--box">
											<p>Cart Title</p>
											<div class="form__field">
												<input type="text" class="form__field--input" name="cart_title" value="<?= $value['cart_title'] ?>">
											</div>
											<p>Section Titles</p>
											<div class="form__field">
												<label>Section Title Course Selection</label>
												<input type="text" class="form__field--input" name="title_course" value="<?= $value['title_course'] ?>">
											</div>
											<div class="form__field">
												<label>Section Title Quantity Selection</label>
												<input type="text" class="form__field--input" name="title_quantity" value="<?= $value['title_quantity'] ?>">
											</div>
											<div class="form__field">
												<label>Section Title Personal Data Selection</label>
												<input type="text" class="form__field--input" name="title_persdata" value="<?= $value['title_persdata'] ?>">
											</div>
											<div class="form__field">
												<label>Section Title Thank You</label>
												<input type="text" class="form__field--input" name="cart_thankyou_title" value="<?= $value['cart_thankyou_title'] ?>">
											</div>
											<p>Disclaimer Text</p>
											<div class="form__field">
												<textarea name="cart_disclaimer_text" class="form__field--textarea"><?= $value['cart_disclaimer_text'] ?></textarea>
											</div>
										</div>
										<div class="form__flex--box">
											<p>Button Labels</p>
											<div class="form__field">
												<label>Labels first Step</label>
												<input type="text" class="form__field--input" name="button_step_1" value="<?= $value['button_step_1'] ?>">
											</div>
											<div class="form__field">
												<label>Labels second Step</label>
												<input type="text" class="form__field--input" name="button_step_2" value="<?= $value['button_step_2'] ?>">
											</div>
											<div class="form__field">
												<label>Labels third Step</label>
												<input type="text" class="form__field--input" name="button_step_3" value="<?= $value['button_step_3'] ?>">
											</div>
											<div class="form__field">
												<label>Labels fourth Step</label>
												<input type="text" class="form__field--input" name="button_step_4" value="<?= $value['button_step_4'] ?>">
											</div>
											<p>Thank You Text</p>
											<div class="form__field">
												<textarea name="cart_thankyou_text" class="form__field--textarea"><?= $value['cart_thankyou_text'] ?></textarea>
											</div>
										</div>
										<div class="form__flex--box">
											<p>Personal Data Form Labels</p>
											<div class="form__field">
												<label>First Name</label>
												<input type="text" class="form__field--input" name="form_label_firstname" value="<?= $value['form_label_firstname'] ?>">
											</div>
											<div class="form__field">
												<label>Last Name</label>
												<input type="text" class="form__field--input" name="form_label_lastname" value="<?= $value['form_label_lastname'] ?>">
											</div>
											<div class="form__field">
												<label>Mobile</label>
												<input type="text" class="form__field--input" name="form_label_mobile" value="<?= $value['form_label_mobile'] ?>">
											</div>
											<div class="form__field">
												<label>Email</label>
												<input type="text" class="form__field--input" name="form_label_email" value="<?= $value['form_label_email'] ?>">
											</div>
											<div class="form__field">
												<label>Arrival Date</label>
												<input type="text" class="form__field--input" name="form_label_datefrom" value="<?= $value['form_label_datefrom'] ?>">
											</div>
											<div class="form__field">
												<label>Departure Date</label>
												<input type="text" class="form__field--input" name="form_label_dateto" value="<?= $value['form_label_dateto'] ?>">
											</div>
											<div class="form__field">
												<label>Departure Date</label>
												<input type="text" class="form__field--input" name="form_label_note" value="<?= $value['form_label_note'] ?>">
											</div>
										</div>
									</div>
									<div class="form__field">
										<a href="<?php echo plugins_url('/vabs-api-form/src/vabs/controller/languagecontroller.php?method=delete&key=' . $key . '"'); ?>" class="button">delete</a>
										<input type="submit" class="button button-primary" value="save changes">
									</div>
								</div>
							</form>
						</div>
					<?php }; ?>
					<div class="vabs__formlist--form" id="lang_new">
						<form action="<?php echo plugins_url('/vabs-api-form/src/vabs/controller/languagecontroller.php'); ?>" class="form" method="POST">
							<div class="form">
								<div class="form__flex">
									<div class="form__flex--box">
										<p>Name of new language</p>
										<div class="form__field">
											<input type="text" class="form__field--input" name="lang_name" value="">
										</div>
										<p>Cart Title</p>
										<div class="form__field">
											<input type="text" class="form__field--input" name="cart_title" value="">
										</div>
										<p>Section Titles</p>
										<div class="form__field">
											<label>Section Title Course Selection</label>
											<input type="text" class="form__field--input" name="title_course" value="">
										</div>
										<div class="form__field">
											<label>Section Title Quantity Selection</label>
											<input type="text" class="form__field--input" name="title_quantity" value="">
										</div>
										<div class="form__field">
											<label>Section Title Personal Data Selection</label>
											<input type="text" class="form__field--input" name="title_persdata" value="">
										</div>
										<div class="form__field">
											<label>Section Title Thank You</label>
											<input type="text" class="form__field--input" name="cart_thankyou_title" value="">
										</div>

										<p>Disclaimer Text</p>
										<div class="form__field">
											<textarea name="cart_disclaimer_text" class="form__field--textarea"></textarea>
										</div>
									</div>
									<div class="form__flex--box">
										<p>Button Labels</p>
										<div class="form__field">
											<label>Labels first Step</label>
											<input type="text" class="form__field--input" name="button_step_1" value="">
										</div>
										<div class="form__field">
											<label>Labels second Step</label>
											<input type="text" class="form__field--input" name="button_step_2" value="">
										</div>
										<div class="form__field">
											<label>Labels third Step</label>
											<input type="text" class="form__field--input" name="button_step_3" value="">
										</div>
										<div class="form__field">
											<label>Labels fourth Step</label>
											<input type="text" class="form__field--input" name="button_step_4" value="">
										</div>
										<p>Thank You Text</p>
										<div class="form__field">
											<textarea name="cart_thankyou_text" class="form__field--textarea"></textarea>
										</div>
									</div>
									<div class="form__flex--box">
										<p>Personal Data Form Labels</p>
										<div class="form__field">
											<label>First Name</label>
											<input type="text" class="form__field--input" name="form_label_firstname" value="">
										</div>
										<div class="form__field">
											<label>Last Name</label>
											<input type="text" class="form__field--input" name="form_label_lastname" value="">
										</div>
										<div class="form__field">
											<label>Mobile</label>
											<input type="text" class="form__field--input" name="form_label_mobile" value="">
										</div>
										<div class="form__field">
											<label>Email</label>
											<input type="text" class="form__field--input" name="form_label_email" value="">
										</div>
										<div class="form__field">
											<label>Arrival Date</label>
											<input type="text" class="form__field--input" name="form_label_datefrom" value="">
										</div>
										<div class="form__field">
											<label>Departure Date</label>
											<input type="text" class="form__field--input" name="form_label_dateto" value="">
										</div>
										<div class="form__field">
											<label>Departure Date</label>
											<input type="text" class="form__field--input" name="form_label_note" value="">
										</div>
									</div>
								</div>
								<div class="form__field">
									<input type="submit" class="button button-primary" value="save changes">
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>