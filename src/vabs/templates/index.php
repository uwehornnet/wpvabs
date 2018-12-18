<div id="vabs">
	<div class="vabs">
		<div class="vabs__card">
			<div class="vabs__card--header">
				<img src="<?php echo plugins_url('/vabs-api-form/assets/img/logo.png'); ?>" alt="logo">
			</div>
			<div class="vabs__card--body">
				<form action="<?php echo plugins_url('/vabs-api-form/src/vabs/controller/formcontroller.php'); ?>" class="form" method="POST">
					<div class="form">
						<div class="form__field">
							<label>API TOKEN</label>
							<input type="text" class="form__field--input" name="api_token" value="<?= $this->config['api_token'] ?>">
						</div>
						<div class="form__field">
							<label>CLIENT ID</label>
							<input type="text" class="form__field--input" name="client_id" value="<?= $this->config['client_id'] ?>">
						</div>
						<div class="form__field">
							<input type="submit" class="button button-primary" value="Änderungen speichern">
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>