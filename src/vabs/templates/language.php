<div id="vabs">
	<div class="vabs">
		<div class="vabs__card">
			<div class="vabs__card--header">
				<img src="<?php echo plugins_url('/wpvabs/assets/img/logo.png'); ?>" alt="logo">
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
							<form action="<?php echo plugins_url('/wpvabs/src/vabs/controller/languagecontroller.php'); ?>" class="form" method="POST">
								<input type="text" name="lang_name" value="<?= $key ?>" style="display: none;">
								<div class="form">
									<div class="form__flex">
										<div class="form__flex--box">
											<p>Section Titles</p>
											<div class="form__field">
												<label>Section Title Course Selection</label>
												<input type="text" class="form__field--input" name="title_course" value="<?= $value['title_course'] ?>">
											</div>
											<div class="form__field">
												<label>Section Title Personal Data Selection</label>
												<input type="text" class="form__field--input" name="title_persdata" value="<?= $value['title_persdata'] ?>">
											</div>
											<div class="form__field">
												<label>Section Title Confirmation</label>
												<input type="text" class="form__field--input" name="title_confirmation"" value="<?= $value['title_confirmation'] ?>">
											</div>
											<p>Disclaimer Text</p>
											<div class="form__field">
												<label>You can you use [agb name=""] and [dsgvo name=""] for some placeholder tags, which represent links to your set disclaimer and imprint pages.</label>
												<textarea name="cart_disclaimer_text" class="form__field--textarea"><?= $value['cart_disclaimer_text'] ?></textarea>
											</div>
										</div>
										<div class="form__flex--box">
											<p>Button Labels</p>
											<div class="form__field">
												<label>Labels next</label>
												<input type="text" class="form__field--input" name="button_next" value="<?= $value['button_next'] ?>">
											</div>
											<div class="form__field">
												<label>Labels booking</label>
												<input type="text" class="form__field--input" name="button_book" value="<?= $value['button_book'] ?>">
											</div>
											<div class="form__field">
												<label>Labels contact</label>
												<input type="text" class="form__field--input" name="button_contact" value="<?= $value['button_contact'] ?>">
											</div>
											<div class="form__field">
												<label>Labels message sent</label>
												<input type="text" class="form__field--input" name="button_message_sent" value="<?= $value['button_message_sent'] ?>">
											</div>
											<div class="form__field">
												<label>Labels success</label>
												<input type="text" class="form__field--input" name="button_success" value="<?= $value['button_success'] ?>">
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
												<label>Interest</label>
												<input type="text" class="form__field--input" name="form_label_interest" value="<?= $value['form_label_interest'] ?>">
											</div>
											<div class="form__field">
												<label>Selection</label>
												<input type="text" class="form__field--input" name="form_label_interest_inner" value="<?= $value['form_label_interest_inner'] ?>">
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
												<label>Message</label>
												<input type="text" class="form__field--input" name="form_label_note" value="<?= $value['form_label_note'] ?>">
											</div>
										</div>
									</div>
									<div class="form__field">
										<a href="<?php echo plugins_url('/wpvabs/src/vabs/controller/languagecontroller.php?method=delete&key=' . $key . '"'); ?>" class="button">delete</a>
										<input type="submit" class="button button-primary" value="save changes">
									</div>
								</div>
							</form>
						</div>
					<?php }; ?>
					<div class="vabs__formlist--form" id="lang_new">
						<form action="<?php echo plugins_url('/wpvabs/src/vabs/controller/languagecontroller.php'); ?>" class="form" method="POST">
							<div class="form">
								<div class="form__flex">
									<div class="form__flex--box">
										<p>Section Titles</p>
										<div class="form__field">
											<label>Section Title Course Selection</label>
											<input type="text" class="form__field--input" name="title_course">
										</div>
										<div class="form__field">
											<label>Section Title Personal Data Selection</label>
											<input type="text" class="form__field--input" name="title_persdata">
										</div>
										<div class="form__field">
											<label>Section Title Confirmation</label>
											<input type="text" class="form__field--input" name="title_confirmation">
										</div>
										<p>Disclaimer Text</p>
										<div class="form__field">
											<label>You can you use [agb name=""] and [dsgvo name=""] for some placeholder tags, which represent links to your set disclaimer and imprint pages.</label>
											<textarea name="cart_disclaimer_text" class="form__field--textarea"></textarea>
										</div>
									</div>
									<div class="form__flex--box">
										<p>Button Labels</p>
										<div class="form__field">
											<label>Labels next</label>
											<input type="text" class="form__field--input" name="button_next">
										</div>
										<div class="form__field">
											<label>Labels booking</label>
											<input type="text" class="form__field--input" name="button_book">
										</div>
										<div class="form__field">
											<label>Labels contact</label>
											<input type="text" class="form__field--input" name="button_contact">
										</div>
										<div class="form__field">
											<label>Labels message sent</label>
											<input type="text" class="form__field--input" name="button_message_sent">
										</div>
										<div class="form__field">
											<label>Labels success</label>
											<input type="text" class="form__field--input" name="button_success">
										</div>
									</div>
									<div class="form__flex--box">
										<p>Personal Data Form Labels</p>
										<div class="form__field">
											<label>First Name</label>
											<input type="text" class="form__field--input" name="form_label_firstname">
										</div>
										<div class="form__field">
											<label>Last Name</label>
											<input type="text" class="form__field--input" name="form_label_lastname">
										</div>
										<div class="form__field">
											<label>Mobile</label>
											<input type="text" class="form__field--input" name="form_label_mobile">
										</div>
										<div class="form__field">
											<label>Email</label>
											<input type="text" class="form__field--input" name="form_label_email">
										</div>
										<div class="form__field">
											<label>Interest</label>
											<input type="text" class="form__field--input" name="form_label_interest">
										</div>
										<div class="form__field">
											<label>Selection</label>
											<input type="text" class="form__field--input" name="form_label_interest_inner">
										</div>
										<div class="form__field">
											<label>Arrival Date</label>
											<input type="text" class="form__field--input" name="form_label_datefrom">
										</div>
										<div class="form__field">
											<label>Departure Date</label>
											<input type="text" class="form__field--input" name="form_label_dateto">
										</div>
										<div class="form__field">
											<label>Message</label>
											<input type="text" class="form__field--input" name="form_label_note">
										</div>
									</div>
								</div>
								<div class="form__field">
									<a href="<?php echo plugins_url('/wpvabs/src/vabs/controller/languagecontroller.php?method=delete&key=' . $key . '"'); ?>" class="button">delete</a>
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