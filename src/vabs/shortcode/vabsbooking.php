<?php

class VabsBooking
{
	protected $options;

	public function __construct()
	{
		include(PLUGINPATH . 'src/vabs/language/options.php');
		$this->options = $languages;
	}


	public function create()
	{
		add_shortcode('vabs_booking', array( $this, 'init' ));
	}


	/**
	 * @param $atts
	 * @return string
	 */
	public function init($atts)
	{
		$content = '<div class="vabs">';
		$content .= '<div class="vabs__loader">
						<svg version="1.1" id="L5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
							<circle fill="#fff" stroke="none" cx="6" cy="50" r="6">
								<animateTransform attributeName="transform" dur="1s" type="translate" values="0 15 ; 0 -15; 0 15" repeatCount="indefinite" begin="0.1"/>
							</circle>
							<circle fill="#fff" stroke="none" cx="30" cy="50" r="6">
								<animateTransform attributeName="transform" dur="1s" type="translate" values="0 10 ; 0 -10; 0 10" repeatCount="indefinite" begin="0.2"/>
							</circle>
							<circle fill="#fff" stroke="none" cx="54" cy="50" r="6">
								<animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.3"/>
							</circle>
						</svg>
					</div>';
		$content .= '<div class="vabs__cart">';
		$content .= '<div class="vabs__cart--header"><span class="title">' . $this->options[$atts['lang']]['cart_title'] . '</span><span class="meta"><span class="meta__price"></span><span class="meta__unit"></span></span></div>';
		$content .= '<div class="vabs__cart--body">';
		$content .= '<div class="vabs__cart--thankyou" style="max-height: 0px;">' . $this->getThankYou($atts) . '</div>';
		$content .= '<div class="vabs__cart--confirmation" style="max-height: 0px;">' . $this->getConfirmation($atts) . '</div>';
		$content .= '<div class="vabs__stepper">';
		if($atts['type'] === 'coursegroup'){
			$content .= '<div class="vabs__stepper--step" id="vabs__course--selector">' . $this->getCoursesOfGroup($atts) . '</div>';
		}else{
			$content .= '<div class="vabs__stepper--step" id="vabs__course--selector">' . $this->getCourse($atts) . '</div>';
		}
		$content .= '<div class="vabs__stepper--step" id="vabs__quantity--selector" style="max-height: 0px;"><div class="quantity"><label>' . $this->options[$atts['lang']]['title_quantity'] . '</label><input type="number" min="1" value="1" id="vabs__quantity--input"/></div></div>';
		$content .= '<div class="vabs__stepper--step" id="vabs__persdata--selector" style="max-height: 0px;">' . $this->getPersDataForm($atts) . '</div>';
		$content .= '</div>';
		$content .= '</div>';
		$content .= '<div class="vabs__cart--footer">';
		$content .= '<button data-target="vabs__quantity--selector" class="vabs__button">next</button>';
		$content .= '</div>';
		$content .= '</div>';
		$content .= '</div>';

		return $content;
	}


	/**
	 * @param $atts
	 * @return frontend booking form structure
	 */
	protected function getPersDataForm($atts)
	{

		$form = '<form class="vabsform" id="vabs_persdata">';
		$form .= '<input type="text" name="vabs_shorcode_lang" id="vabs_shorcode_lang" value="' . $atts['lang'] . '" style="display: none;">';
		$form .= '<p>' . $this->options[$atts['lang']]['title_persdata'] . '</p>';
		$form .= '<div class="vabsform__field--horizontal">';
		$form .= '<div class="vabsform__field"><label for="lastname">' . $this->options[$atts['lang']]['form_label_lastname'] . '</label><input type="text" name="lastname" class="vabsform__field--input"></div>';
		$form .= '<div class="vabsform__field"><label for="firstname">' . $this->options[$atts['lang']]['form_label_firstname'] . '</label><input type="text" name="firstname" class="vabsform__field--input"></div>';
		$form .= '</div>';
		$form .= '<div class="vabsform__field--horizontal">';
		$form .= '<div class="vabsform__field"><label for="mobile">' . $this->options[$atts['lang']]['form_label_mobile'] . '</label><input type="text" name="mobile" class="vabsform__field--input" ></div>';
		$form .= '<div class="vabsform__field"><label for="email">' . $this->options[$atts['lang']]['form_label_email'] . '</label><input type="text" name="email" class="vabsform__field--input" ></div>';
		$form .= '</div>';
		$form .= '<div class="vabsform__field--horizontal">';
		$form .= '<div class="vabsform__field"><label for=anreise">' . $this->options[$atts['lang']]['form_label_datefrom'] . '</label><input type="text" name="anreise" class="vabsform__field--input"></div>';
		$form .= '<div class="vabsform__field"><label for="abreise">' . $this->options[$atts['lang']]['form_label_dateto'] . '</label><input type="text" name="abreise" class="vabsform__field--input"></div>';
		$form .= '</div>';
		$form .= '<div class="vabsform__field"><label for="note">' . $this->options[$atts['lang']]['form_label_note'] . '</label><textarea class="vabsform__field--textarea" name="note"></textarea></div>';
		$form .= '</form>';

		return $form;
	}


	protected function getConfirmation($atts) {

		$confirmation = '<div class="confirmation__persdata">';
		$confirmation .= '<div class="confirmation__persdata--name"><span class="firstname"></span> <span class="lastname"></span></div>';
		$confirmation .= '<div class="confirmation__persdata--email"><span class="email"></span></div>';
		$confirmation .= '<div class="confirmation__persdata--mobile"><span class="mobile"></span></div>';
		$confirmation .= '<div class="confirmation__persdata--note"><span class="note"></span></div>';
		$confirmation .= '</div>';
		$confirmation .= '<div class="confirmation__daterange"><span class="daterange--tile"></span><span class="daterange--arrival"></span> - <span class="daterange--departure"></span></div>';

		$confirmation .= '<div class="confirmation__coursedata">';
		$confirmation .= '<div class="course"><div class="course--title"></div><div class="course--qty"><span class="qty"></span><span class="qty-label">Tag(e)</span></div><div class="course--price"></div></div>';
		$confirmation .= '</div>';
		$confirmation .= '<div class="confirmation__confirm">' . $this->options[$atts['lang']]['cart_disclaimer_text'] . '</div>';

		return $confirmation;

	}


	protected function getCourse($atts)
	{
		$form = '<div class="courses">';
		$form .= '<p>' . $this->options[$atts['lang']]['title_course'] . '</p>';
		$form .= '<input type="text" name="get_single_course" value="' . $atts["id"] . '" style="display: none;" id="vabs-form-type"/>';
		$form .= '<div class="courses__list">';
		$form .= '</div>';
		$form .= '</div>';

		return $form;
	}


	protected function getCoursesOfGroup($atts)
	{
		$form = '<div class="courses">';
		$form .= '<p>' . $this->options[$atts['lang']]['title_course'] . '</p>';
		$form .= '<input type="text" name="get_courses_of_group" value="' . $atts["id"] . '" style="display: none;" id="vabs-form-type"/>';
		$form .= '<div class="courses__list"></div>';
		$form .= '</div>';

		return $form;
	}


	protected function getThankYou($atts)
	{
		$thx = '<div class="thankyou">';
		$thx .= '<div class="thankyou__svg">';
		$thx .= '<svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 388.83 388.298" enable-background="new 0 0 388.83 388.298" xml:space="preserve"><circle fill="none" stroke="#000000" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="194.548" cy="194.305" r="188.829"/><polyline fill="none" stroke="#000000" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="70.474,235.273 142.855,314.572 314.623,82.036 "/></svg>';
		$thx .= '</div>';
		$thx .= '<div class="thankyou__text">' . $this->options[$atts['lang']]['cart_thankyou_text'] . '</div>';
		$thx .= '</div>';

		return $thx;
	}
}