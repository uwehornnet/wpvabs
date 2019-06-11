export default class BookingWrapper{
	constructor(url, lang) {
		this.url = url;
		this.lang = lang;
		this.user = {
			firstname: '',
			lastname: '',
			street: '',
			number: '',
			zip_code: '',
			city: '',
			email: '',
			mobile: '',
			note: '',
			anreise: '',
			abreise: '',
			interest: '',
			validation: false
		};
		this.selectedCourses = {};
		this.queriedCourses = {};
		this.current = 'course';
		this.prices = {};
		this.courseObjs = {};
		this.participants = {};
	}

	/**
	 *
	 * @param course
	 */
	addCourse(course) {
		this.queriedCourses[course.id] = course;
	}

	/**
	 *
	 * @param course
	 * @param data
	 */
	addPrice(course, data) {
		this.queriedCourses[course.id].price = data;
		this.prices[course.id] = data;
	}

	/**
	 *
	 * @param e
	 */
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

	/**
	 *
	 * @param e
	 */
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

	/**
	 *
	 * @param output
	 * @param id
	 */
	updateCoursePrice(output, id) {

		const course = this.selectedCourses[id];
		if(course.amount && course.amount > 1){
			output.innerHTML = (parseFloat(course.price.price) * parseFloat(course.amount)).toFixed(2) + ' €';
		}else{
			output.innerHTML = (parseFloat(course.price.price)).toFixed(2) + ' €';
		}

	}

	/**
	 *
	 * @param e
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

	/**
	 *
	 * @param e
	 */
	updateUser(e) {

		if(e.target.name === 'anreise'){
			this.user.anreise = e.target.value.split(' to ')[0];
			this.user.abreise = e.target.value.split(' to ')[1];
			return;
		}
		this.user[e.target.name] = e.target.value;

	}

	/**
	 *
	 * @returns {boolean}
	 */
	validation(form) {
		if(!this.user.firstname){
			form.querySelector('input[name="firstname"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.user.lastname){
			form.querySelector('input[name="lastname"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.user.mobile){
			form.querySelector('input[name="mobile"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.user.email){
			form.querySelector('input[name="email"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.user.street){
			form.querySelector('input[name="street"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.user.number){
			form.querySelector('input[name="number"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.user.zip_code){
			form.querySelector('input[name="zip_code"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.user.city){
			form.querySelector('input[name="city"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.user.anreise){
			form.querySelector('input[name="anreise"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.user.abreise){
			form.querySelector('input[name="abreise"]').style.borderColor = 'orangered';
			return false;
		}

		if(!this.user.note){
			form.querySelector('textarea[name="note"]').style.borderColor = 'orangered';
			return false;
		}

		form.querySelectorAll('input').forEach((elem) => {
			elem.style.borderColor = 'limegreen';
		});


		form.querySelector('textarea').style.borderColor = 'limegreen';
		return true;
	}

	/**
	 *
	 * @param e
	 * @param form
	 */
	submit(e, form) {

		if(Object.keys(this.selectedCourses).length === 0){
			return;
		}

		if(this.current === 'course'){
			this.current = 'participants';

			if(!form.querySelector('.vabsform__body--element.participants .element__body div')){
				form.querySelector('.vabsform__body--element.participants .element__body').append(this.createParticipantsForm());
			}


			form.querySelector('.vabsform__body--element.course .element__body').style.height = '0px';
			form.querySelector('.vabsform__body--element.course .element__header--index').classList.add('success');
			setTimeout(() => {
				form.querySelector('.vabsform__body--element.participants .element__body').style.height = form.querySelector('.vabsform__body--element.participants .element__body').scrollHeight + 'px';
				form.scrollIntoView();
			}, 300);
			return;
		}

		if(this.current === 'participants'){
			this.current = 'trainings';
			form.querySelector('.vabsform__body--element.participants .element__body').style.height = '0px';
			form.querySelector('.vabsform__body--element.participants .element__header--index').classList.add('success');
			setTimeout(() => {
				form.querySelector('.vabsform__body--element.trainings .element__body').style.height = form.querySelector('.vabsform__body--element.trainings .element__body').scrollHeight + 'px';
				form.scrollIntoView();
			}, 300);
			return;
		}

		if(this.current === 'trainings'){
			this.current = 'user';
			form.querySelector('.vabsform__body--element.trainings .element__body').style.height = '0px';
			form.querySelector('.vabsform__body--element.trainings .element__header--index').classList.add('success');
			setTimeout(() => {
				form.querySelector('.vabsform__body--element.user .element__body').style.height = form.querySelector('.vabsform__body--element.user .element__body').scrollHeight + 'px';
				form.scrollIntoView();
			}, 300);
			return;
		}

		if(this.current === 'user' && this.validation(form)){
			this.current = 'confirm';
			this.showConfirmation(form);
			form.querySelector('.vabsform__body--element.user .element__body').style.height = '0px';
			form.querySelector('.vabsform__body--element.user .element__header--index').classList.add('success');
			setTimeout(() => {
				form.querySelector('.vabsform__body--element.confirmation .element__body').style.height = form.querySelector('.vabsform__body--element.confirmation .element__body').scrollHeight + 'px';
				form.scrollIntoView();
			}, 300);

			return;
		}

		if(this.current === 'confirm'){
			this.submitForm(form);
		}

	}

	/**
	 *
	 * @param e
	 * @param form
	 */
	stepBack(e, form) {
		if(this.current === 'participants'){
			this.current = 'course';

			form.querySelector('.vabsform__body--element.course .element__body').style.height = form.querySelector('.vabsform__body--element.course .element__body').scrollHeight + 'px';
			setTimeout(() => {
				form.querySelector('.vabsform__body--element.participants .element__body').style.height = '0px';
				form.scrollIntoView();
			}, 300);
			return;
		}

		if(this.current === 'user'){
			this.current = 'participants';

			form.querySelector('.vabsform__body--element.participants .element__body').style.height = form.querySelector('.vabsform__body--element.participants .element__body').scrollHeight + 'px';
			setTimeout(() => {
				form.querySelector('.vabsform__body--element.user .element__body').style.height = '0px';
				form.scrollIntoView();
			}, 300);
			return;
		}
	}

	/**
	 *
	 * @param date
	 * @returns {string}
	 */
	humanReadableDate(date) {
		let monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

		let day = date.getDate();
		let monthIndex = date.getMonth();
		let year = date.getFullYear();

		return day + '. ' + monthNames[monthIndex] + ' ' + year;
	}

	/**
	 *
	 * @returns {string}
	 */
	createParticipantsForm() {
		const wrapper = document.createElement('div');

		for(const key in this.selectedCourses) {
			const course = this.selectedCourses[key];
			if(course.amount && course.amount > 1) {
				for(var i = 0; i < course.amount; i++) {
					wrapper.append(this.participantsForm(course));
				}
			}else{
				wrapper.append(this.participantsForm(course));
			}
		}

		return wrapper;
	}

	/**
	 *
	 * @param course
	 */
	participantsForm(course) {
		const wrapper = document.createElement('form');
		wrapper.classList.add('form');

		let html = '<div class="form__header"><strong>' + course.name + '</strong></div>';
		html += '<div class="form__switcher"><label><input type="checkbox" checked> Dieser Kurs ist für mich</label></div>';
		html += '<div class="form__wrapper" style="display: none;">';
		html += '<div class="form__field horizontal">';
		html += '<div class="form__field"><input type="text" name="vorname" placeholder="Max"></div>';
		html += '<div class="form__field"><input type="text" name="name" placeholder="Mustermann"></div>';
		html += '</div>';
		html += '<div class="form__field horizontal">';
		html += '<div class="form__field"><input type="text" name="tel" placeholder="0123-45678910"></div>';
		html += '<div class="form__field"><input type="text" name="email" placeholder="mail@domain.com"></div>';
		html += '</div>';
		html += '<div class="form__field"><button class="form__button">Teilnehmer hinzufügen</button></div>';
		html += '</div>';
		html += '<div class="form__participant"></div>';

		wrapper.innerHTML = html;

		wrapper.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
			this.showParticipantsForm(wrapper, e);
			this.updateParticipantObject(wrapper, course, e);
		});

		wrapper.querySelector('.form__field button').addEventListener('click', (e) => {
			e.preventDefault();
			this.addParticipant(wrapper);
			this.updateParticipantObject(wrapper, course, e);
		});

		return wrapper;
	}

	/**
	 *
	 * @param form
	 * @param course
	 * @param event
	 */
	updateParticipantObject(form, course, event) {
		// change state of checkbox
		// remove participant if checked
		if (event.type === 'change' && event.target.checked === true) {
			// remove participant html
			if(form.querySelector('.form__participant')){
				const key = form.querySelector('.participant__name').dataset.uid;
				delete this.participants[key];

				form.querySelector('.form__participant .participant').remove();
			}

		}

		// new Participant added
		if(event.type === 'click'){
			const key = form.querySelector('.participant__name').dataset.uid;
			const participant = {
				name: form.querySelector('.participant__name').innerHTML.split(', ')[0],
				vorname: form.querySelector('.participant__name').innerHTML.split(', ')[1],
				email: form.querySelector('.participant__email').innerHTML.split(', ')[0],
				tel: form.querySelector('.participant__tel').innerHTML,
				course: course.id
			};
			this.participants[key] = participant;

		}

		console.log(this.participants);
	}



	/**
	 *
	 * @param form
	 * @param e
	 */
	showParticipantsForm(form, e) {
		if(!e.target.checked) {
			form.querySelector('.form__wrapper').style.display = 'block';
			form.parentElement.parentElement.style.height = form.parentElement.scrollHeight + 'px';
		}else{
			form.querySelector('.form__wrapper').style.display = 'none';
			form.parentElement.parentElement.style.height = form.parentElement.scrollHeight + 'px';
		}
	}

	/**
	 *
	 */
	addParticipant(form, course) {

		const vorname = form.querySelector('input[name="vorname"]').value;
		const name = form.querySelector('input[name="name"]').value;
		const tel = form.querySelector('input[name="tel"]').value;
		const email = form.querySelector('input[name="email"]').value;
		const uid = Math.random().toString(36).substring(7);
		const wrapper = document.createElement('div');
		wrapper.classList.add('participant');

		let html = '<div class="participant__name" data-uid="' + uid + '">' + name + ', ' + vorname + '</div>';
		html += '<div class="participant__tel">' + tel + '</div>';
		html += '<div class="participant__email">' + email + '</div>';

		wrapper.innerHTML = html;
		console.log(form)
		form.querySelector('.form__participant').append(wrapper);
		form.querySelector('.form__wrapper').style.display = 'none';
	}

	/**
	 *
	 * @param form
	 */
	showConfirmation(form) {
		form.querySelector('.confirmation__user .name').innerHTML = this.user.firstname + ' ' + this.user.lastname;
		form.querySelector('.confirmation__user .mobile').innerHTML = this.user.mobile;
		form.querySelector('.confirmation__user .email').innerHTML = this.user.email;
		form.querySelector('.confirmation__user .anschrift').innerHTML = `${this.user.street} ${this.user.number}</br>${this.user.zip_code} ${this.user.city}`;
		form.querySelector('.confirmation__user .note').innerHTML = this.user.note;
		form.querySelector('.confirmation__travel .arrival').innerHTML = this.humanReadableDate(new Date(this.user.anreise));
		form.querySelector('.confirmation__travel .departure').innerHTML = this.humanReadableDate(new Date(this.user.abreise));
		form.querySelectorAll('.confirmation__course div').forEach((div) => {
			div.remove();
		});

		let total = 0;
		for(let key in this.selectedCourses){
			let course = this.selectedCourses[key];
			let price;
			if(course.amount && parseInt(course.amount) > 1){
				price = parseFloat(course.amount) * parseFloat(course.price.price)
			}else{
				price = parseFloat(course.price.price)
			}
			total += price;
			let div = document.createElement('div');

			let html = '';
			const amount = course.amount && parseInt(course.amount) > 1 ? course.amount : '1';
			if(course.tiered_pricing && course.tiered_pricing == '1') {
				if(course.unit_shortcode === 'h'){
					html += '<span class="coursename">' + amount + 'x ' + course.name + '</span><span class="courseqty">' + course.anzTage + ' Tag(e) á ' + course.qty + ' Stunde(n)</span><span class="courseprice">' + price.toFixed(2) + ' €</span>';
				}else if(course.unit_shortcode === 'd'){
					html += '<span class="coursename">' + amount + 'x ' + course.name + '</span><span class="courseqty">' + course.qty + ' Tag(e) á ' + course.anzStunden + ' Stunde(n)</span><span class="courseprice">' + price.toFixed(2) + ' €</span>';
				}else if(course.unit_shortcode === 'w'){
					html += '<span class="coursename">' + amount + 'x ' + course.name + '</span><span class="courseqty">' + course.qty + ' Woche(n)</span><span class="courseprice">' + price.toFixed(2) + ' €</span>';
				}
			}else{
				if(course.unit_shortcode === 'h'){
					html += '<span class="coursename">' + amount + 'x ' + course.name + '</span><span class="courseqty">' + course.anzTage + ' Tag(e) á ' + course.anzStunden + ' Stunde(n)</span><span class="courseprice">' + price.toFixed(2) + ' €</span>';
				}else if(course.unit_shortcode === 'd'){
					html += '<span class="coursename">' + amount + 'x ' + course.name + '</span><span class="courseqty">' + course.anzTage + ' Tag(e) á ' + course.anzStunden + ' Stunde(n)</span><span class="courseprice">' + price.toFixed(2) + ' €</span>';
				}else if(course.unit_shortcode === 'w'){
					html += '<span class="coursename">' + amount + 'x ' + course.name + '</span><span class="courseqty">1 Woche(n)</span><span class="courseprice">' + price.toFixed(2) + ' €</span>';
				}
			}

			div.innerHTML = html;
			form.querySelector('.confirmation__course').append(div);
		}
		form.querySelector('.confirmation__payment .totalprice').innerHTML = total.toFixed(2) + ' €';
		form.querySelector('button .text').innerHTML = this.lang['button_book'] ? this.lang['button_book'] : 'kostenpflichtig buchen';
	}

	/**
	 *
	 * @param e
	 */
	updateDSGVO(e) {
		if(e.target.checked) {
			this.user.validation = true
		}else{
			this.user.validation = false
		}
	}

	/**
	 *
	 */
	submitForm(form) {
		if(!this.validation(form)) {
			return;
		}
		form.querySelector('.vabsform__body--element.confirmation .element__header--index').classList.add('success');
		form.querySelector('button .text').innerHTML = this.lang['button_success'] ? this.lang['button_success'] : 'Formular wurde abgesendet';
		form.querySelector('button .loading').style.display = 'inline-block';

		if(this.user.validation) {
			/**
			 * create new contact
			 */
			fetch(this.url + '?method=create_new_contact', {
				method: 'POST',
				body: JSON.stringify({
					firstname: this.user.firstname,
					lastname: this.user.lastname,
					mobile: this.user.mobile,
					email: this.user.email,
					street: this.user.street,
					number: this.user.number,
					zip_code: this.user.zip_code,
					city: this.user.city,
					note: this.user.note,
					anreise: this.user.anreise,
					abreise: this.user.abreise,
					shorttext: this.user.interest ? 'Interesse: ' + this.user.interest : 'Frontendbuchung',
					longtext: this.user.note,
				})
			}).then((response) => {
				return response.json();
			}).then((response) => {
				return {
					lead_id: response.lead_id,
					contact_id: response.contact_id,
					anwesenheits_id: response.anwesenheits_id
				};
			}).then((obj) => {
				/**
				 * generate new sales order
				 */
				if(obj.lead_id){
					return fetch(this.url + '?method=add_sales_order', {
						method: 'POST',
						body: JSON.stringify({
							contact_id: obj.contact_id,
							shorttext: this.user.interest ? 'Interesse: ' + this.user.interest : 'Frontendbuchung',
						})
					}).then((response) => {
						return response.json();
					})
				}
			}).then((response) => {
				/**
				 * generate new sales line for each selected course
				 */
				const sales_header_id = response.sales_header_id;
				let salesOrder = [];

				for(let key in this.selectedCourses){
					const course = this.selectedCourses[key];
					salesOrder.push(
						fetch(this.url + '?method=add_sales_line', {
							method: 'POST',
							body: JSON.stringify({
								sales_header_id: sales_header_id,
								object_id: course.id,
								quantity: course.qty,
								date_from: this.user.anreise,
								date_to: this.user.abreise
							})
						}).then((response) => {
							return response.json();
						})
					);
				}

				if(salesOrder.length === Object.keys(this.selectedCourses).length){
					return salesOrder;
				}

			}).then((salesOrders) => {
				if(salesOrders.length) {
					this.reset(form)
				}
			});
		}
	}

	/**
	 *
	 * @param form
	 */
	reset(form) {
		form.querySelector('button .text').innerHTML = this.lang['button_success'] ? this.lang['button_success'] : 'Wir haben deine Email erhalten.';

		setTimeout(() => {
			form.reset();
			form.querySelectorAll('.confirmation .link').forEach((link) => {
				link.remove();
			});

			this.user = {
				firstname: '',
				lastname: '',
				email: '',
				mobile: '',
				note: '',
				street: '',
				number: '',
				zip_code: '',
				city: '',
				anreise: '',
				abreise: '',
				interest: '',
				validation: false
			};
			this.selectedCourses = {};
			this.current = 'course';

			form.querySelector('button').disabled = true;
			form.querySelector('button .loading').style.display = 'none';
			form.querySelector('button').style.backgroundColor = 'limegreen';

		}, 2000);

	}

}