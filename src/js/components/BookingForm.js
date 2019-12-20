import rangePlugin from '../../../node_modules/flatpickr/dist/plugins/rangePlugin.js';

export default class BookingForm{
	constructor(url, elem, lang) {
		this.current = 'course';
		this.url = url;
		this.lang = lang;
		this.elem = elem;
		this.billing = {
			firstname: '',
			lastname: '',
			street: '',
			number: '',
			zip_code: '',
			city: '',
			email: '',
			mobile: '',
			note: ''
		};
		this.dates = {
			anreise: '',
			abreise: '',
		};
		this.dsgvo = false;
		this.selectedCourses = {};
		this.queriedCourses = {};
		this.relation = {};
		this.current = 'course';
		this.prices = {};
		this.participants = {};
		this.trainings = {};
		this.interests = {};
		this.loader = '<span class="text">weiter</span><span class="loading"></span>';
	}

	init(elem) {
		elem.append(this.createOuterWrapper(elem, true));

		elem.querySelector('.vabsform__body').append(this.createCourseselectionWrapper('Kursauswahl', 'courselist', true));
		elem.querySelector('.vabsform__body').append(this.createTraveldatesWrapper('Reisezeitraum', 'dates', false));
		elem.querySelector('.vabsform__body').append(this.createParticipantsWrapper('Teilnehmer', 'participants', false));
		elem.querySelector('.vabsform__body').append(this.createTrainingsWrapper('Schulungen', 'trainings', false));
		elem.querySelector('.vabsform__body').append(this.createBillingWrapper('Rechnungsdetails', 'details', false));
		elem.querySelector('.vabsform__body').append(this.createConfirmationWrapper('Prüfung der Daten', 'confirmation', false));
		elem.querySelector('.vabsform__body').append(this.createSuccessWrapper(null, null, false));
		elem.querySelector('.vabsform__body').append(this.createErrorWrapper(null, null, false));

		this.flatPickr(elem);
	}
	/**
	 *
	 * Begin Structure
	 */
	createOuterWrapper(elem, loading) {
		const form = document.createElement('form');
		form.className = 'vabsform';
		form.autocomplete = 'off';
		let html = '<div class="vabsform__body"></div>';
		html += `<div class="vabsform__footer"><button class="vabsformback">zurück</button><button class="vabsformsubmit"><span class="text">weiter</span></button></div>`;
		form.innerHTML = html;

		form.addEventListener('reset', () => {
			this.reset(form);
		});

		form.querySelector('button.vabsformback').addEventListener('click', (e) => {
			e.preventDefault();
			this.previous(e, form);
		});

		form.querySelector('button.vabsformsubmit').addEventListener('click', (e) => {
			e.preventDefault();
			this.next(e, form);
		});
		return form;
	}

	createCourseselectionWrapper(name, cl, show) {
		let courses;
		if(this.elem.dataset.type === 'group'){
			courses = this.fetchData('get_courses_of_group', {id: this.elem.dataset.query});
		}else{
			courses = this.fetchData('get_courses', {ids: this.elem.dataset.query});
		}

		const wrapper = this.basicAccordionWrapper(name, cl, show);
		const elem = wrapper.querySelector('.element__body');

		courses.then((response) => {
			return response.slice(0).sort(function(a, b) {
				const x = a.name.toLowerCase();
				const y = b.name.toLowerCase();
				return x < y ? -1 : x > y ? 1 : 0;
			});
		}).then((response) => {

			this.appendCourses(elem, response);
		});

		// courses.then((response) => {
		// 	for(var i = 0; i < response.length; i++) {
		// 		const course = response[i];
		// 		this.queriedCourses[course.id] = course;
		// 		this.courseWrapper(elem, course);
		// 	}
		// 	items.forEach((item) => {
		// 		this.queriedCourses[item.id] = item;
		// 		this.courseWrapper(elem, item);
		// 	})
		// });

		return wrapper;
	}


	async appendCourses(elem, response) {
		for(const key in response) {
			const course = response[key];
			this.queriedCourses[course.id] = course;
			await this.courseWrapper(elem, course);
		}
	}


	async courseWrapper(elem, course) {
		const priceObject = this.fetchData('get_course_details', {id: course.id, qty: course.minBookableAmount});
		priceObject.then((price) => {
			this.prices[course.id] = price;
			this.queriedCourses[course.id]['price'] = price;
			const item =  this.queriedCourses[course.id];

			const div = document.createElement('div');
			div.className = 'course';
			let html = '';

			if(item.tiered_pricing && item.tiered_pricing == '1'){
				if (item.unit_shortcode === 'h') {
					html += '<span class="course__desc"><label style="display: block;"><input type="checkbox" name="course" value="' + item.id + '"> ' + item.name + '</label>' + item.kurz_beschreibung.replace('<br />', '') + '</span><span class="course__qty">' + item.anzTage + ' Tag(e) á <input type="number" name="courseqty" data-course="' + item.id + '" min="' + parseInt(item.minBookableAmount) + '" value="' + item.minBookableAmount + '"> Stunde(n)</span><span class="course__amount"><label>Anzahl der Teilnehmer</label><input type="number" name="course__amount" value="1" min="1" data-course="' + item.id + '"></span><span class="course__price">' + parseFloat(course.price.price).toFixed(2) + ' €</span>';
				} else if (item.unit_shortcode === 'd') {
					html += '<span class="course__desc"><label style="display: block;"><input type="checkbox" name="course" value="' + item.id + '"> ' + item.name + '</label>' + item.kurz_beschreibung.replace('<br />', '') + '</span><span class="course__qty"><input type="number" name="courseqty" data-course="' + item.id + '" min="' + parseInt(item.minBookableAmount) + '" value="' + item.minBookableAmount + '">Tag(e) á ' + item.anzStunden + ' Stunde(n)</span><span class="course__amount"><label>Anzahl der Teilnehmer</label><input type="number" name="course__amount" value="1" min="1" data-course="' + item.id + '"></span><span class="course__price">' + parseFloat(course.price.price).toFixed(2) + ' €</span>';
				} else if (item.unit_shortcode === 'w') {
					html += '<span class="course__desc"><label style="display: block;"><input type="checkbox" name="course" value="' + item.id + '"> ' + item.name + '</label>' + item.kurz_beschreibung.replace('<br />', '') + '</span><span class="course__qty"><input type="number" name="courseqty" data-course="' + item.id + '" min="' + parseInt(item.minBookableAmount) + '" value="' + item.minBookableAmount + '">Woche(n)</span><span class="course__amount"><label>Anzahl der Teilnehmer</label><input type="number" name="course__amount" value="1" min="1" data-course="' + item.id + '"></span><span class="course__price">' + parseFloat(course.price.price).toFixed(2) + ' €</span>';
				}
			}else{
				if (item.unit_shortcode === 'h') {
					html += '<span class="course__desc"><label style="display: block;"><input type="checkbox" name="course" value="' + item.id + '"> ' + item.name + '</label>' + item.kurz_beschreibung.replace('<br />', '') + '</span><span class="course__qty">' + item.anzTage + ' Tag(e) á ' + item.anzStunden + ' Stunde(n)</span><span class="course__amount"><label>Anzahl der Teilnehmer</label><input type="number" name="course__amount" value="1" min="1" data-course="' + item.id + '"></span><span class="course__price">' + parseFloat(course.price.price).toFixed(2) + ' €</span>';
				} else if (item.unit_shortcode === 'd') {
					html += '<span class="course__desc"><label style="display: block;"><input type="checkbox" name="course" value="' + item.id + '"> ' + item.name + '</label>' + item.kurz_beschreibung.replace('<br />', '') + '</span><span class="course__qty">' + item.anzTage + ' Tag(e) á ' + item.anzStunden + ' Stunde(n)</span><span class="course__amount"><label>Anzahl der Teilnehmer</label><input type="number" name="course__amount" value="1" min="1" data-course="' + item.id + '"></span><span class="course__price">' + parseFloat(course.price.price).toFixed(2) + ' €</span>';
				} else if (item.unit_shortcode === 'w') {
					html += '<span class="course__desc"><label style="display: block;"><input type="checkbox" name="course" value="' + item.id + '"> ' + item.name + '</label>' + item.kurz_beschreibung.replace('<br />', '') + '</span><span class="course__qty">' + item.anzTage + ' Tag(e) á ' + item.minBookableAmount + ' Woche(n)</span><span class="course__amount"><label>Anzahl der Teilnehmer</label><input type="number" name="course__amount" value="1" min="1" data-course="' + item.id + '"></span><span class="course__price">' + parseFloat(course.price.price).toFixed(2) + ' €</span>';
				}
			}

			div.innerHTML = html;

			div.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
				this.updateCourseList(e)
			});

			div.querySelector('input[name="course__amount"]').addEventListener('change', (e) => {
				this.updateCourseAmount(e)
			});

			if(item.tiered_pricing && item.tiered_pricing == '1') {
				div.querySelector('input[name="courseqty"]').addEventListener('change', (e) => {
					this.updateCourseQty(e)
				});
			}

			elem.append(div);
		});



	}

	createTraveldatesWrapper(name, cl, show) {
		const wrapper = this.basicAccordionWrapper(name, cl, show);
		let html = '<div class="element" style="padding: 16px;">';
		html += `<div class="form__field horizontal"><div class="form__field"><label style="display: block;">Anreise</label><input type="text" name="anreise" class="vabsTravleDetails vabsTravleDetailsArrival"></div><div class="form__field"><label style="display: block;">Abreise</label><input type="text" name="abreise" class="vabsTravleDetails vabsTravleDetailsDeparture"></div></div>`;
		html += '</div>';

		wrapper.querySelector('.element__body').innerHTML = html;
		wrapper.querySelectorAll('input[type="text"]').forEach((input) => {
			input.addEventListener('change', (e) => {
				this.updateTravelDates(e);
			})
		});
		return wrapper;
	}

	createParticipantsWrapper(name, cl, show) {
		const wrapper = this.basicAccordionWrapper(name, cl, show);
		let html = '<div class="participant" style="padding: 16px;">';
		html += '<div class="participant__list"></div>';
		html += '<div class="participant__controls" style="display: none;"><span>einen weiteren Teilnehmer hinzufügen</span></div>';
		html += '<div class="participant__form">';
		html += `<div class="form__field horizontal"><div class="form__field"><label style="display: block;">Vorname</label><input type="text" name="participant__vorname"></div><div class="form__field"><label style="display: block; text-align: left;">Nachname</label><input type="text" name="participant__nachname"></div></div>`;
		html += `<div class="form__field horizontal"><div class="form__field"><label style="display: block;">Email Adresse</label><input type="text" name="participant__email"></div><div class="form__field"><label style="display: block; text-align: left;">Telefonnummer</label><input type="text" name="participant__tel"></div></div>`;
		html += `<div class="form__field"><button class="button">Teilnehemer hinzufügen</button></div>`;
		html += '</div>';
		html += '</div>';

		wrapper.querySelector('.element__body').innerHTML = html;
		wrapper.querySelector('button.button').addEventListener('click', (e) => {
			e.preventDefault();
			this.addParticipant(wrapper)
		});

		wrapper.querySelector('.participant__controls span').addEventListener('click', (e) => {
			e.preventDefault();
			this.showParticipantForm(wrapper)
		});

		return wrapper;
	}

	createTrainingsWrapper(name, cl, show) {
		const wrapper = this.basicAccordionWrapper(name, cl, show);
		return wrapper;
	}

	createBillingWrapper(name, cl, show) {
		let wrapper = this.basicAccordionWrapper(name, cl, show);

		let html = '<div class="form">';
		html += `<div class="form__field"><label>Wollen Sie Daten übernehmen?</label><select name="participant"><option selected disabled>Teilnehmer wählen</option></select></div>`;
		html += `<div class="form__field horizontal"><div class="form__field"><label style="display: block;">Vorname*</label><input type="text" name="firstname" autocomplete="off" placeholder="Max" required></div><div class="form__field"><label style="display: block;">Nachname*</label><input type="text" name="lastname" autocomplete="off" placeholder="Müller" required></div></div>`;
		html += `<div class="form__field horizontal"><div class="form__field"><label style="display: block;">Telefonnummer*</label><input type="text" name="mobile" autocomplete="off" placeholder="+4912345678910"></div><div class="form__field"><label style="display: block;">Emailadresse*</label><input type="text" name="email" autocomplete="off" placeholder="mail@domain.com" required></div></div>`;
		html += `<div class="form__field horizontal"><div class="form__field"><label style="display: block;">Strasse*</label><input type="text" name="street" autocomplete="off" placeholder="Strassenname" required></div><div class="form__field"><label style="display: block;">Hausnummer*</label><input type="text" name="number" autocomplete="off" placeholder="10a" required></div></div>`;
		html += `<div class="form__field horizontal"><div class="form__field"><label style="display: block;">Postleitzahl*</label><input type="text" name="zip_code" autocomplete="off" placeholder="01234" required></div><div class="form__field"><label style="display: block;">Ort*</label><input type="text" name="city" autocomplete="off" placeholder="Name der Stadt" required></div></div>`;
		html += `<div class="form__field"><label style="display: block;">Interesse*</label>`;
		html += `<select name="interest"><option disbaled selected>Interesse wählen</option>`;

		html += `</select></div>`;
		html += `<div class="form__field"><label style="display: block;">Bemerkung</label><textarea name="note" rows="10"></textarea></div>`;
		html += `<div class="form__field"><label><input type="checkbox">Mit Absenden dieser Buchung stimmen Sie unserer Datenschutzbestimmung zu.</label></div>`;
		html += '</div>';
		html += '</div>';

		wrapper.querySelector('.element__body').innerHTML = html;

		const interests = this.fetchData('get_client_interest');
		interests.then((response) => {
			for(const key in response){
				const interest = response[key];
				this.interests[interest.id] = interest;
				const option = document.createElement('option');
				option.value = interest.id;
				option.innerHTML = interest.checkbox_title;

				wrapper.querySelector('select[name="interest"]').append(option);
			}
		});

		wrapper.querySelector('select[name="participant"]').addEventListener('change', (e) => {
			e.preventDefault();
			this.updateBillingDetailsFromParticipant(e, wrapper);
		});

		wrapper.querySelector('select[name="interest"]').addEventListener('change', (e) => {
			e.preventDefault();
			this.updateBillingDetails(e);
		});

		wrapper.querySelector('textarea').addEventListener('change', (e) => {
			e.preventDefault();
			this.updateBillingDetails(e);
		});

		wrapper.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
			this.updateDSGVO(e);
		});

		wrapper.querySelectorAll('input[type="text"]').forEach((input) => {
			input.addEventListener('change', (e) => {
				e.preventDefault();
				this.updateBillingDetails(e);
			})
		});

		return wrapper;
	}

	createConfirmationWrapper(name, cl, show) {
		const wrapper = this.basicAccordionWrapper(name, cl, show);
		let html = '<div class="confirmation">';
		html += '<div class="confirmation__billing">';
		html += '<div class="confirmation__billing__headline"><strong>Rechnungsanschrift</strong></div>';
		html += '<div class="confirmation__billing__meta">';
		html += '<div class="confirmation__billing__name"></div>';
		html += '<div class="confirmation__billing__street"></div>';
		html += '<div class="confirmation__billing__city"></div>';
		html += '<div class="confirmation__billing__email"></div>';
		html += '<div class="confirmation__billing__tel"></div>';
		html += '</div>';
		html += '</div>';
		html += '<div class="confirmation__dates"><strong>Reisezeitraum</strong><span></span></div>';
		html += '<div class="confirmation__courses">';
		html += '</div>';
		html += '<div class="confirmation__payment">';
		html += '<div class="confirmation__payment--headline"><strong>Gesamtbetrag</strong></div>';
		html += '<div class="confirmation__payment--total"><strong></strong></div>';
		html += '</div>';
		html += '</div>';

		wrapper.querySelector('.element__body').innerHTML = html;

		return wrapper;
	}

	createSuccessWrapper(name, cl, show) {

		const wrapper = document.createElement('div');
		wrapper.classList.add('vabsform__body--success');

		const html = `
			<div class="vabsform__body--success--wrapper">
				<p>Vielen Dank. Wir haben Ihre Buchung erhalten.</p>
				<svg viewBox="0 0 818 818">
				    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				        <g id="Desktop-HD" transform="translate(-230.000000, -48.000000)">
				            <g id="done" transform="translate(230.000000, 48.000000)">
				                <circle id="Oval" fill="#F9FAFB" cx="409" cy="409" r="409"></circle>
				                <path d="M74.7872084,341.281246 C66.4122573,344.942426 61,353.215263 61,362.355506 L61,725 C61,737.702549 71.2974508,748 84,748 L766,748 C778.702549,748 789,737.702549 789,725 L789,362.355506 C789,353.215263 783.587743,344.942426 775.212792,341.281246 L434.212792,192.210207 C428.339287,189.642555 421.660713,189.642555 415.787208,192.210207 L74.7872084,341.281246 Z" id="Rectangle" stroke="#3C99CD" stroke-width="4" fill="#EBF1F6"></path>
				                <path d="M133,392.980798 L424.76797,572.982463 L721,391.186547 L721,97 C721,88.7157288 714.284271,82 706,82 L148,82 C139.715729,82 133,88.7157288 133,97 L133,392.980798 Z" id="letter" stroke="#3C99CD" stroke-width="4" fill="#F7F7F7"></path>
				                <path d="M80.1840922,361.186657 L402.972593,559.643749 C416.480188,567.9485 433.513444,567.938157 447.010944,559.617009 L768.879216,361.186657" id="Path" stroke="#3C99CD" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path>
				                <path d="M80.1840922,476.924668 L400.574299,705.498783 C415.185371,715.922675 434.805612,715.910052 449.40326,705.467371 L768.879216,476.924668" id="Path-Copy" stroke="#3C99CD" stroke-width="4" fill="#EBF1F6" stroke-linecap="round" stroke-linejoin="round" transform="translate(424.531654, 599.924668) scale(1, -1) translate(-424.531654, -599.924668) "></path>
				                <g id="text" transform="translate(202.000000, 154.000000)" stroke="#3C99CD" stroke-linecap="round" stroke-linejoin="round" stroke-width="8">
				                    <path d="M0.5,0.5 L278.040973,0.5" id="Line"></path>
				                    <path d="M0.770486414,23 L359,23" id="Line-Copy"></path>
				                    <path d="M1.11475679,46 L359.34427,46" id="Line-Copy-2"></path>
				                </g>
				                <circle id="Oval" stroke="#40D2AC" stroke-width="8" cx="425" cy="385" r="83"></circle>
				                <polyline id="Path-2" stroke="#40D2AC" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" points="373 407.276297 404.645804 429 476 341"></polyline>
				            </g>
				        </g>
				    </g>
				</svg>
			</div>
		`;

		wrapper.innerHTML = html;

		return wrapper;
	}

	createErrorWrapper(name, cl, show) {

		const wrapper = document.createElement('div');
		wrapper.classList.add('vabsform__body--error');

		const html = `
			<div class="vabsform__body--error--wrapper">
				<p>Upppps, irgendwas ist schief gelaufen. Bitte versuchen Sie es erneut, oder wenden Sie sich an den Seitenbetreiber für mehr Informationen</p>
				<svg viewBox="0 0 284.776 270.357">
				    <path id="shape_x5F__x5F_shadow" opacity="0.1" fill="#231F20" d="M271.688,245.343c0,5.586-55.78,4.873-124.591,4.873 c-68.81,0-124.591,0.713-124.591-4.873c0-5.587,55.781-10.116,124.591-10.116C215.907,235.227,271.688,239.756,271.688,245.343z"/>
				    <g id="shape_x5F__x5F_figure">
				        <g>
				            <g>
				                <circle fill="#27AAE1" cx="145.514" cy="107.828" r="45.345"/>
				                <g>
				                    <circle fill="#27AAE1" cx="132.68" cy="70.546" r="42.984"/>
				                    <circle fill="#27AAE1" cx="176.334" cy="67.767" r="23.762"/>
				                    <circle fill="#27AAE1" cx="116.701" cy="101.711" r="43.863"/>
				                    <circle fill="#27AAE1" cx="182.475" cy="104.925" r="40.485"/>
				                </g>
				            </g>
				            <g>
				                <g opacity="0.2">
				                    <polygon fill="#231F20" points="168.459,56.442 168.483,56.431 114.075,56.431 114.075,141.401 193.232,141.785 183.271,71.348"/>
				                </g>
				                <g>
				                    <polygon fill="#F1F2F2" points="165.438,55.425 165.461,55.414 111.055,55.414 111.055,140.384 181.652,140.384 181.652,71.639"/>
				                </g>
				                <g>
				                    <rect x="115.121" y="61.964" fill="#E6E7E8" width="53.931" height="0.928"/>
				                    <rect x="115.121" y="70.32" fill="#E6E7E8" width="62.675" height="0.929"/>
				                    <rect x="115.121" y="78.677" fill="#E6E7E8" width="62.675" height="0.928"/>
				                    <rect x="115.121" y="87.033" fill="#E6E7E8" width="62.675" height="0.928"/>
				                    <rect x="115.121" y="95.39" fill="#E6E7E8" width="62.675" height="0.929"/>
				                    <rect x="115.121" y="103.746" fill="#E6E7E8" width="62.675" height="0.929"/>
				                    <rect x="115.121" y="112.103" fill="#E6E7E8" width="62.675" height="0.929"/>
				                    <rect x="115.121" y="120.46" fill="#E6E7E8" width="62.675" height="0.928"/>
				                    <rect x="115.121" y="128.816" fill="#E6E7E8" width="62.675" height="0.929"/>
				                    <rect x="115.121" y="137.173" fill="#E6E7E8" width="62.675" height="0.928"/>
				                </g>
				                <polygon fill="#FFFFFF" points="181.659,71.646 165.438,71.646 165.438,55.425"/>
				                <g>
				                    <g>
				                        <g>
				                            <circle fill="#FFFFFF" cx="130.752" cy="85.601" r="9.931"/>
				                            <circle fill="#414042" cx="130.752" cy="85.601" r="7.363"/>
				                            <circle fill="#FFFFFF" cx="128.526" cy="80.521" r="2.511"/>
				                            <circle fill="#FFFFFF" cx="126.007" cy="85.764" r="1.248"/>
				                            <circle fill="#FFFFFF" cx="128.765" cy="89.146" r="1.904"/>
				                            <path fill="#FFFFFF" d="M137.109,86.799c-2.199,0.342-2.476,0.619-2.817,2.817c-0.341-2.199-0.618-2.475-2.817-2.817
				                                c2.199-0.341,2.476-0.618,2.817-2.816C134.633,86.181,134.91,86.458,137.109,86.799z"/>
				                        </g>
				                        <g>
				                            <circle fill="#FFFFFF" cx="162.628" cy="85.601" r="9.932"/>
				                            <circle fill="#414042" cx="162.628" cy="85.601" r="7.363"/>
				                            <circle fill="#FFFFFF" cx="160.401" cy="80.521" r="2.511"/>
				                            <circle fill="#FFFFFF" cx="157.882" cy="85.764" r="1.248"/>
				                            <circle fill="#FFFFFF" cx="160.641" cy="89.146" r="1.905"/>
				                            <path fill="#FFFFFF" d="M168.985,86.799c-2.2,0.342-2.477,0.619-2.817,2.817c-0.342-2.199-0.619-2.475-2.817-2.817
				                                c2.199-0.341,2.476-0.618,2.817-2.816C166.508,86.181,166.785,86.458,168.985,86.799z"/>
				                        </g>
				                    </g>
				                    <g>
				                        <g>
				                            <path fill="#414042" d="M159.69,113.944c-0.818,0-1.479-0.663-1.479-1.48c0-6.352-5.169-11.519-11.52-11.519
				                                c-6.352,0-11.52,5.167-11.52,11.519c0,0.817-0.664,1.48-1.48,1.48c-0.817,0-1.48-0.663-1.48-1.48
				                                c0-7.984,6.496-14.48,14.48-14.48s14.479,6.496,14.479,14.48C161.17,113.281,160.508,113.944,159.69,113.944z"/>
				                        </g>
				                    </g>
				                </g>
				            </g>
				        </g>
				        <g>
				            <g>
				                <g>
				                    <polygon fill="#B2875D" points="229.498,244.664 63.083,244.664 63.092,116.414 229.491,116.414"/>
				                </g>
				                <g>
				                    <g opacity="0.1">
				                        <rect x="63.176" y="170.075" fill="#FFFFFF" width="16.906" height="9.271"/>
				                    </g>
				                    <g opacity="0.1">
				                        <rect x="63.176" y="191.671" fill="#FFFFFF" width="16.906" height="9.273"/>
				                    </g>
				                    <g opacity="0.1">
				                        <rect x="63.176" y="213.269" fill="#FFFFFF" width="16.906" height="9.272"/>
				                    </g>
				                    <g opacity="0.1">
				                        <rect x="212.562" y="170.075" fill="#FFFFFF" width="16.905" height="9.271"/>
				                    </g>
				                    <g opacity="0.1">
				                        <rect x="212.562" y="191.671" fill="#FFFFFF" width="16.905" height="9.273"/>
				                    </g>
				                    <g opacity="0.1">
				                        <rect x="212.562" y="213.269" fill="#FFFFFF" width="16.905" height="9.272"/>
				                    </g>
				                </g>
				            </g>
				            <g>
				                <g>
				                    <polygon fill="#C49A6C" points="261.684,150.72 227.452,118.569 229.491,116.414 263.711,148.562"/>
				                </g>
				                <g>
				                    <polygon fill="#C49A6C" points="30.906,150.72 65.137,118.569 63.092,116.414 28.879,148.562"/>
				                </g>
				                <g>
				                    <polygon fill="#C49A6C" points="240.6,159.055 51.981,159.055 63.092,116.414 229.491,116.414"/>
				                </g>
				            </g>
				        </g>
				    </g>
				</svg>
			</div>
		`;

		wrapper.innerHTML = html;

		return wrapper;
	}

	basicAccordionWrapper(name, cl, show){
		const wrapper = document.createElement('div');
		wrapper.classList.add('vabsform__body--element');
		wrapper.classList.add(cl);

		let html = '<div class="element">';
		html += '<div class="element__header"><span class="element__header--index"></span>' + name + '</div>';
		if(show){
			html += '<div class="element__body" ></div>';
		}else{
			html += '<div class="element__body" style="height: 0px;"></div>';
		}

		html += '</div>';

		wrapper.innerHTML = html;

		return wrapper;
	}

	flatPickr(elem) {
		const anreiseElem = elem.querySelector('input[name="anreise"]');
		const abreiseElem = elem.querySelector('input[name="abreise"]');
		if(window.innerWidth > 1024) {
			flatpickr(anreiseElem, {
				locale: {
					firstDayOfWeek: 1,
					weekdays: {
						shorthand: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
						longhand: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
					},
					months: {
						shorthand: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
						longhand: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
					}
				},
				minDate: new Date(),
				altInput: true,
				dateFormat: "Y-m-d",
				altFormat: "d.m.Y",
				plugins: [new rangePlugin({input: abreiseElem})],
			});


			flatpickr(abreiseElem, {
				locale: {
					firstDayOfWeek: 1,
					weekdays: {
						shorthand: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
						longhand: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
					},
					months: {
						shorthand: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
						longhand: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
					}
				},
				minDate: new Date(),
				altInput: true,
				dateFormat: "Y-m-d",
				altFormat: "d.m.Y",
				plugins: [new rangePlugin({input: abreiseElem})],
			});

		}else{
			flatpickr(anreiseElem, {
				locale: {
					firstDayOfWeek: 1,
					weekdays: {
						shorthand: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
						longhand: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
					},
					months: {
						shorthand: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
						longhand: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
					}
				},
				minDate: new Date(),
				altInput: true,
				dateFormat: "Y-m-d",
				altFormat: "d.m.Y",
			});


			flatpickr(abreiseElem, {
				locale: {
					firstDayOfWeek: 1,
					weekdays: {
						shorthand: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
						longhand: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
					},
					months: {
						shorthand: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
						longhand: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
					}
				},
				minDate: new Date(),
				altInput: true,
				dateFormat: "Y-m-d",
				altFormat: "d.m.Y",
			});
		}

	}

	/**
	 *
	 * Begin Funktionallity
	 */
	updateCourseList(e) {
		if(e.target.checked){
			this.selectedCourses[e.target.value] = this.queriedCourses[e.target.value];
			this.selectedCourses[e.target.value].qty = this.selectedCourses[e.target.value].minBookableAmount;
		}else{
			delete this.selectedCourses[e.target.value];
			const qty = e.target.parentElement.parentElement.parentElement.querySelector('input[name="courseqty"]');
			const amount = e.target.parentElement.parentElement.parentElement.querySelector('input[name="course__amount"]');
			const price = e.target.parentElement.parentElement.parentElement.querySelector('.course__price');
			if(qty){
				qty.value = parseInt(this.queriedCourses[e.target.value].minBookableAmount);
			}
			amount.value = 1;
			price.innerHTML = parseFloat(this.prices[e.target.value].price).toFixed(2) + ' €';
		}
	}

	updateCourseAmount(e) {
		if(!this.selectedCourses[e.target.dataset.course]){
			this.selectedCourses[e.target.dataset.course] = this.queriedCourses[e.target.dataset.course];
			e.target.parentElement.parentElement.querySelector('input[type="checkbox"]').checked = true;
		}

		const output = e.target.parentElement.parentElement.querySelector('.course__price');
		const course = e.target.dataset.course;

		this.selectedCourses[e.target.dataset.course]['amount'] = e.target.value;

		this.updateCoursePrice(output, course);
	}

	updateCoursePrice(output, id) {

		const course = this.selectedCourses[id];
		if(course.amount && course.amount > 1){
			output.innerHTML = (parseFloat(course.price.price) * parseFloat(course.amount)).toFixed(2) + ' €';
		}else{
			output.innerHTML = (parseFloat(course.price.price)).toFixed(2) + ' €';
		}
	}

	updateCourseQty(e) {
		if(!this.selectedCourses[e.target.dataset.course]){
			this.selectedCourses[e.target.dataset.course] = this.queriedCourses[e.target.dataset.course];
			e.target.parentElement.parentElement.querySelector('input[type="checkbox"]').checked = true;
		}
		const output = e.target.parentElement.parentElement.querySelector('.course__price');
		fetch(this.url + '?method=get_course_details', {
			method: 'POST',
			body: JSON.stringify({
				id: e.target.dataset.course,
				qty: e.target.value
			})
		}).then((response) => {
			return response.json();
		}).then((priceObject) => {

			const course = e.target.dataset.course;

			this.prices[course] = priceObject;
			this.selectedCourses[e.target.dataset.course]['price'] = priceObject;
			this.selectedCourses[e.target.dataset.course]['qty'] = e.target.value;

			this.updateCoursePrice(output, course);


		})
	}

	updateTravelDates(e) {
		if(e.target.value.includes(' to ')){
			this.dates['anreise'] = e.target.value.split(' to ')[0];
			this.dates['abreise'] = e.target.value.split(' to ')[1];
		}else{
			this.dates[e.target.name] = e.target.value;
		}

	}

	addParticipant(container) {
		container.querySelector('.participant__form').style.display = 'none';
		container.querySelector('.participant__controls').style.display = 'block';

		const wrapper = document.createElement('div');
		const uid = Math.random().toString(36).substring(7);

		let nachname = container.querySelector('input[name="participant__nachname"]');
		let vorname = container.querySelector('input[name="participant__vorname"]');
		let email = container.querySelector('input[name="participant__email"]');
		let tel = container.querySelector('input[name="participant__tel"]');

		wrapper.id = uid;


		let html = `<p><span>${nachname.value}, ${vorname.value}</span><span>${email.value}</span><span>${tel.value}</span><span class="remove"><svg viewBox="0 0 14 18"><path id="shape" d="M1,16c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V4H1V16z M14,1h-3.5l-1-1h-5l-1,1H0v2h14V1z"/></svg></span></p>`;

		wrapper.innerHTML = html
		wrapper.querySelector('span.remove').addEventListener('click', (e) => {
			e.preventDefault();
			this.removeParticipant(container, wrapper, uid);
		});

		container.querySelector('.participant__list').append(wrapper);

		const participant = {
			nachname: nachname.value,
			vorname: vorname.value,
			email: email.value,
			tel: tel.value,
		};

		nachname.value = '';
		vorname.value = '';
		email.value = '';
		tel.value = '';

		container.querySelector('.element__body').style.height = container.querySelector('.element__body .participant').scrollHeight + 'px';

		this.participants[uid] = participant;
	}

	showParticipantForm(wrapper) {
		wrapper.querySelector('.participant__controls').style.display = 'none';
		wrapper.querySelector('.participant__form').style.display = 'block';
		wrapper.querySelector('.element__body').style.height = wrapper.querySelector('.element__body .participant').scrollHeight + 'px';
	}

	removeParticipant(container, wrapper, uid) {
		wrapper.remove();
		delete this.participants[uid];
		container.querySelector('.element__body').style.height = container.querySelector('.element__body .participant').scrollHeight + 'px';

	}

	getTrainings(wrapper) {


		for(const key in this.selectedCourses) {


			let trainings = this.fetchData('get_trainings', {
				from: this.dates.anreise,
				to: this.dates.abreise,
				id: this.selectedCourses[key].kurs_schulungs_gruppen_id,
			});

			trainings.then((response) => {

 				if(this.selectedCourses[key].amount){

					for(let i = 0; i < this.selectedCourses[key].amount; i++){
						this.CourseTrainingParticipantWrapper(wrapper, response, this.selectedCourses[key], i + 1);
					}
				}else{

					this.CourseTrainingParticipantWrapper(wrapper, response, this.selectedCourses[key]);
				}
			})
		}
	}

	CourseTrainingParticipantWrapper(container, trainings, course, i = 0) {

		const wrapper = document.createElement('div');
		wrapper.classList.add('course');

		let html = '<div class="course__header">';
		html += `<div class="course__name" data-id="${course.id}">${course.name}</div>`;
		html += '<div class="course__participant"><label>Teilnehmer: </label><select name="participants">';
		for(const key in this.participants) {
			const participant = this.participants[key];
			html += `<option value="${key}">${participant.nachname}, ${participant.vorname}</option>`;
		}
		html += '</select></div><p>verfügbare Schulungen im gewählten Zeitraum: </p>';
		html += '</div>';
		html += '<div class="course__trainings">';
		for(const key in trainings){

			const training = trainings[key];
			const max = parseInt(training.amount_max_participants);
			const alreadyBooked = parseInt(training.amount_current_participants);



			if(alreadyBooked < max){
				this.trainings[training.schulungs_id] = training;
				html += `<div class="course__trainings--training"><label><input type="radio" name="${course.name}${i}" value="${training.schulungs_id}"><span>von ${this.humanReadableDate(training.datum_von)} ${training.zeit_von_kurz} Uhr<br>bis ${this.humanReadableDate(training.datum_bis)} ${training.zeit_bis_kurz} Uhr</span></label></div>`;
			}
		}
		html += '</div>';

		wrapper.innerHTML = html;
		container.querySelector('.element__body').append(wrapper);
		container.querySelector('.element__body').style.height = container.querySelector('.element__body').scrollHeight + 'px';
	}

	connectParticipantToCourse(wrapper) {

		const courses = wrapper.querySelectorAll('.course');
		courses.forEach((course, index) => {
			const id = course.querySelector('.course__name').dataset.id;
			const participant = course.querySelector('select');
			const trainings = course.querySelectorAll('input[type="radio"]');

			let obj = {
				participant: this.participants[participant.value],
				course: this.selectedCourses[id],
				training: null
			};

			if(trainings){
				for(const key in trainings) {
					const training = trainings[key];
					if(training.checked){
						obj.training = training.value;
					}
				}
			}
			this.relation[index] = obj;

		});
	}

	addParticipantSelectionToDetails(wrapper) {

		for(const key in this.participants) {
			const option = document.createElement('option');
			option.value = key;
			option.innerHTML = this.participants[key].nachname + ', ' + this.participants[key].vorname;

			wrapper.append(option);
		}
	}

	updateBillingDetailsFromParticipant(e, wrapper) {
		const user = this.participants[e.target.value];
		wrapper.querySelector('input[name="firstname"]').value = user.vorname;
		wrapper.querySelector('input[name="lastname"]').value = user.nachname;
		wrapper.querySelector('input[name="mobile"]').value = user.tel;
		wrapper.querySelector('input[name="email"]').value = user.email;

		this.billing.firstname = user.vorname;
		this.billing.lastname = user.nachname;
		this.billing.mobile = user.tel;
		this.billing.email = user.email;
	}

	updateBillingDetails(e) {

		if(e.target.name != 'anreise'){
			this.billing[e.target.name] = e.target.value;
			return;
		}

	}

	updateDSGVO(e) {
		if(e.target.checked) {
			this.dsgvo = true
		}else{
			this.dsgvo = false
		}
	}

	prepareConfirmationDetails(wrapper) {
		// init total billing variable
		let total = 0;

		// fill out billing information
		wrapper.querySelector('.confirmation__billing__name').innerHTML = this.billing.lastname + ', ' + this.billing.firstname;
		wrapper.querySelector('.confirmation__billing__street').innerHTML = this.billing.street + ' ' + this.billing.number;
		wrapper.querySelector('.confirmation__billing__city').innerHTML = this.billing.zip_code + ' ' + this.billing.city;
		wrapper.querySelector('.confirmation__billing__email').innerHTML = this.billing.email;
		wrapper.querySelector('.confirmation__billing__tel').innerHTML = this.billing.mobile;

		// fill out travel dates
		wrapper.querySelector('.confirmation__dates span').innerHTML = `von ${this.humanReadableDate(this.dates.anreise)} bis ${this.humanReadableDate(this.dates.abreise)}`;
		for(const key in this.relation){
			const training = this.relation[key];

			console.log(training);
			console.log(this)
			total += parseFloat(training.course.price.price);
			const container = document.createElement('div');
			container.classList.add('confirmation__courses__course');
			let html = `
				<div class="confirmation__courses__course--title"><strong>${training.course.name}</strong><span>${training.participant.nachname}, ${training.participant.vorname}</span></div>
				<div class="confirmation__courses__course--meta">
					<div class="confirmation__courses__course--date">${this.trainings[training.training] ? this.humanReadableDate(this.trainings[training.training].datum_von) : ''} ${this.trainings[training.training] ? this.trainings[training.training].zeit_von : ''} - ${this.trainings[training.training] ? this.humanReadableDate(this.trainings[training.training].datum_bis) : ''} ${this.trainings[training.training] ? this.trainings[training.training].zeit_bis : ''}</div>
					<div class="confirmation__courses__course--price"><strong>${parseFloat(training.course.price.price).toFixed(2)} Euro</strong></div>
				</div>
			`;
			container.innerHTML = html;

			wrapper.querySelector('.confirmation__courses').append(container);

		}

		// fill out total costs
		wrapper.querySelector('.confirmation__payment--total strong').innerHTML = `${total.toFixed(2)} Euro`;

	}

	humanReadableDate(date) {

		date = date.split('-');
		let monthNames = {
			'01': 'Januar',
			'02': 'Februar',
			'03': 'März',
			'04': 'April',
			'05': 'Mai',
			'06': 'Juni',
			'07': 'Juli',
			'08': 'August',
			'09': 'September',
			'10': 'Oktober',
			'11': 'November',
			'12': 'Dezember'
		};

		let day = date[2];
		let monthIndex = date[1];
		let year = date[0];

		return day + '. ' + monthNames[monthIndex] + ' ' + year;
	}


	next(e,wrapper) {
		wrapper.querySelector('.vabsformsubmit').innerHTML = this.loader;

		if(this.current === 'course') {
			if(Object.keys(this.selectedCourses).length != 0 && this.selectedCourses.constructor === Object){
				this.current = 'dates';

				wrapper.querySelector('.vabsform__body--element.courselist .element__body').style.height = '0px';
				wrapper.querySelector('.vabsform__body--element.courselist .element__header--index').classList.add('success');

				setTimeout(() => {
					wrapper.querySelector('.vabsform__body--element.dates .element__body').style.height = wrapper.querySelector('.vabsform__body--element.dates .element__body').scrollHeight + 'px';
					wrapper.scrollIntoView();
					wrapper.querySelector('.loading').remove();
				}, 300);

				return;
			}else{
				alert('Bitte wählen Sie ein Kurs aus.');
				wrapper.querySelector('.loading').remove();
			}

		}

		if(this.current === 'dates') {
			if(this.dates.anreise != '' && this.dates.abreise != ''){
				this.current = 'participants';
				wrapper.querySelector('.vabsform__body--element.dates .element__body').style.height = '0px';
				wrapper.querySelector('.vabsform__body--element.dates .element__header--index').classList.add('success');

				setTimeout(() => {
					wrapper.querySelector('.vabsform__body--element.participants .element__body').style.height = wrapper.querySelector('.vabsform__body--element.participants .element__body').scrollHeight + 'px';
					wrapper.scrollIntoView();
					if(wrapper.querySelector('.loading')){
						wrapper.querySelector('.loading').remove();
					}
				}, 300);
				return;
			}else{
				alert('Bitte wählen Sie Ihre An- und Abreisedaten aus.');
				wrapper.querySelector('.loading').remove();
			}

		}

		if(this.current === 'participants') {

			if(Object.keys(this.participants).length != 0 && this.participants.constructor === Object){
				this.current = 'trainings';
				wrapper.querySelector('.vabsform__body--element.trainings .element__body').innerHTML = '';
				this.getTrainings(wrapper.querySelector('.vabsform__body--element.trainings'));
				wrapper.querySelector('.vabsform__body--element.participants .element__body').style.height = '0px';
				wrapper.querySelector('.vabsform__body--element.participants .element__header--index').classList.add('success');

				setTimeout(() => {
					wrapper.querySelector('.vabsform__body--element.trainings .element__body').style.height = wrapper.querySelector('.vabsform__body--element.trainings .element__body').scrollHeight + 'px';
					wrapper.scrollIntoView();
					wrapper.querySelector('.loading').remove();
				}, 300);
				return;
			}else{
				alert('Es muss mindestens ein Teilnehmer angegeben werden.');
				wrapper.querySelector('.loading').remove();
			}
		}

		if(this.current === 'trainings') {
			this.current = 'details';

			this.connectParticipantToCourse(wrapper.querySelector('.vabsform__body--element.trainings'));
			this.addParticipantSelectionToDetails(wrapper.querySelector('.vabsform__body--element.details select[name="participant"]'));

			wrapper.querySelector('.vabsform__body--element.trainings .element__body').style.height = '0px';
			wrapper.querySelector('.vabsform__body--element.trainings .element__header--index').classList.add('success');

			setTimeout(() => {
				wrapper.querySelector('.vabsform__body--element.details .element__body').style.height = wrapper.querySelector('.vabsform__body--element.details .element__body').scrollHeight + 'px';
				wrapper.scrollIntoView();
				if(wrapper.querySelector('.loading')){
					wrapper.querySelector('.loading').remove();
				}
			}, 300);
			return;

		}

		if(this.current === 'details') {
			if(this.validation(wrapper)) {
				this.current = 'confirmation';

				this.prepareConfirmationDetails(wrapper.querySelector('.vabsform__body--element.confirmation .element__body'));
				wrapper.querySelector('.vabsformsubmit').innerHTML = '<span class="text">kostenpflichtig buchen</span>';
				wrapper.querySelector('.vabsform__body--element.details .element__body').style.height = '0px';
				wrapper.querySelector('.vabsform__body--element.details .element__header--index').classList.add('success');

				setTimeout(() => {
					wrapper.querySelector('.vabsform__body--element.confirmation .element__body').style.height = wrapper.querySelector('.vabsform__body--element.confirmation .element__body').scrollHeight + 'px';
					wrapper.scrollIntoView();
					if(wrapper.querySelector('.loading')){
						wrapper.querySelector('.loading').remove();
					}
				}, 300);
				return;
			}else{
				alert('Bitte überprüfen Sie Ihre Eingabe. Die mit * gekennzeichneten Felder, sind Pflichtangaben.');
				wrapper.querySelector('.loading').remove();
			}

		}

		if(this.current === 'confirmation') {
			if(this.validation(wrapper)) {
				this.submit();
			}
		}
	}

	validation(form) {
		if(!this.billing.firstname){
			form.querySelector('input[name="firstname"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.billing.lastname){
			form.querySelector('input[name="lastname"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.billing.mobile){
			form.querySelector('input[name="mobile"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.billing.email){
			form.querySelector('input[name="email"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.billing.street){
			form.querySelector('input[name="street"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.billing.number){
			form.querySelector('input[name="number"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.billing.zip_code){
			form.querySelector('input[name="zip_code"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.billing.city){
			form.querySelector('input[name="city"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.dsgvo){
			form.querySelector('input[type="checkbox"]').style.borderColor = 'orangered';
			return false;
		}

		form.querySelectorAll('input').forEach((elem) => {
			elem.style.borderColor = 'limegreen';
		});


		form.querySelector('textarea').style.borderColor = 'limegreen';
		return true;
	}

	submit() {
		// 1. create new contact with billing data
		const main_contact_id = this.fetchData('create_new_contact', {
			firstname: this.billing.firstname,
			lastname: this.billing.lastname,
			email: this.billing.email,
			mobile: this.billing.mobile,
			street: this.billing.street,
			number: this.billing.number,
			zip_code: this.billing.zip_code,
			city: this.billing.city,
			dateFrom: this.dates.anreise,
			dateTo: this.dates.abreise,
			shorttext: `Interesse: ${this.interests[this.billing.interest].name}`,
			note: this.billing.note,
			lead: 'true'
		});

		// 2. create new sales order with given contact_id
		main_contact_id.then((data) => {
			this.fetchData('add_sales_order',{
				contact_id: data.contact_id,
				shorttext: this.billing.note
			}).then((response) => {
				const sales_header_ID = response.sales_header_id;

				// 3. for each participant create new contact_id
				for(const key in this.relation) {
					const line_number = parseInt(key) + 1;
					const user = this.relation[key].participant;
					const course = this.relation[key].course;
					const training = this.relation[key].training;

					this.fetchData('create_new_contact', {
						firstname: user.vorname,
						lastname: user.nachname,
						email: user.email,
						mobile: user.tel,
						lead: null
					}).then((response) => {

						// 4. create new sales order line with sales_header_id from 2. and with course_id as object_id and 3 as object_code ship_to_contact_id is given from 3.
						this.fetchData('add_sales_line', {
							sales_header_id: sales_header_ID,
							object_id: course.id,
							quantity: course.qty ? course.qty : 1,
							date_from: this.dates.anreise,
							date_to: this.dates.abreise,
							ship_to_contact_id: response.contact_id,
							line_number: line_number
						}).then((response) => {

							// 5. each sales_line gets a sales_line_id and course_booking_id as response back (if object_id === 3)
							// 6. Assign a course booking to a training with course_booking_id and the id given from training
							if(training){
								this.fetchData('assign_course_to_training', {
									course_booking_id: response.course_booking_id,
									training_id: training
								}).then((response) => {
									const success = this.elem.querySelector('.vabsform__body--success');
									const error = this.elem.querySelector('.vabsform__body--error');
									const outer = this.elem.querySelector('.vabsform__body');
									const footer = this.elem.querySelector('.vabsform__footer');

									if(response.id){
										success.style.height = outer.scrollHeight + 'px';
										error.style.height = '0px';
										footer.style.display = 'none';
									}else{
										success.style.height = '0px';
										error.style.height = outer.scrollHeight + 'px';
										footer.style.display = 'none';
									}

								})
							}else{
								const success = this.elem.querySelector('.vabsform__body--success');
								const error = this.elem.querySelector('.vabsform__body--error');
								const outer = this.elem.querySelector('.vabsform__body');
								const footer = this.elem.querySelector('.vabsform__footer');

								if(response.sales_line_id){
									success.style.height = outer.scrollHeight + 'px';
									error.style.height = '0px';
									footer.style.display = 'none';
								}else{
									success.style.height = '0px';
									error.style.height = outer.scrollHeight + 'px';
									footer.style.display = 'none';
								}
							}


						})

					})

				}
			})


		});

	}

	previous(e, wrapper) {
		if(this.current === 'confirmation'){
			this.current = 'details';
			wrapper.querySelector('.vabsform__body--element.confirmation .element__body').style.height = '0px';
			wrapper.querySelector('.vabsform__body--element.details .element__body').style.height = wrapper.querySelector('.vabsform__body--element.details .element__body').scrollHeight + 'px';
			return;
		}

		if(this.current === 'details'){
			this.current = 'trainings';
			wrapper.querySelector('.vabsform__body--element.details .element__body').style.height = '0px';
			wrapper.querySelector('.vabsform__body--element.trainings .element__body').style.height = wrapper.querySelector('.vabsform__body--element.trainings .element__body').scrollHeight + 'px';
			return;
		}

		if(this.current === 'trainings'){
			this.current = 'participants';
			wrapper.querySelector('.vabsform__body--element.trainings .element__body').style.height = '0px';
			wrapper.querySelector('.vabsform__body--element.participants .element__body').style.height = wrapper.querySelector('.vabsform__body--element.participants .element__body').scrollHeight + 'px';
			return;
		}

		if(this.current === 'participants'){
			this.current = 'dates';
			wrapper.querySelector('.vabsform__body--element.participants .element__body').style.height = '0px';
			wrapper.querySelector('.vabsform__body--element.dates .element__body').style.height = wrapper.querySelector('.vabsform__body--element.dates .element__body').scrollHeight + 'px';
			return;
		}

		if(this.current === 'dates'){
			this.current = 'course';
			wrapper.querySelector('.vabsform__body--element.dates .element__body').style.height = '0px';
			wrapper.querySelector('.vabsform__body--element.courselist .element__body').style.height = wrapper.querySelector('.vabsform__body--element.courselist .element__body').scrollHeight + 'px';
			return;
		}
	}

	reset(event, wrapper) {

	}


	async fetchData(method, data = {}) {
		let response = await fetch(this.url + '?method=' + method, {
			method: 'POST',
			body: JSON.stringify(data)
		});

		let d = await response.json();

		return d;
	}

	// fetchData(method, data = {}) {
	// 	const xhr = new XMLHttpRequest();
	// 	xhr.open('POST', `${this.url}?method=${method}`);
	// 	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	//
	// 	xhr.onload = function() {
	// 		if(xhr.status === 200){
	// 			alert('something went wrong');
	// 		}else if(xhr.status !== 200){
	// 			alert('Request failed.  Returned status of ' + xhr.status);
	// 		}
	// 	};
	//
	// 	xhr.send(JSON.stringify(data))
	// }
}