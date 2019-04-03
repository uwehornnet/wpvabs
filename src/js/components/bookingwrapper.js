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
			output.innerHTML = parseFloat(priceObject.price).toFixed(2) + ' €';
			this.selectedCourses[e.target.dataset.course].price = priceObject;
			this.selectedCourses[e.target.dataset.course].qty = e.target.value;
		})
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
			e.target.parentElement.parentElement.parentElement.querySelector('input[name="courseqty"]').value = parseInt(this.queriedCourses[e.target.value].minBookableAmount);
			e.target.parentElement.parentElement.parentElement.querySelector('.course__info--price').innerHTML = parseFloat(this.prices[e.target.value].price).toFixed(2) + ' €';
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
	validation() {
		if(!this.user.firstname){
			return false;
		}

		if(!this.user.lastname){
			return false;
		}

		if(!this.user.mobile){
			return false;
		}

		if(!this.user.email){
			return false;
		}

		if(!this.user.note){
			return false;
		}

		if(!this.user.anreise){
			return false;
		}

		if(!this.user.abreise){
			return false;
		}

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
			this.current = 'user';
			form.querySelector('.vabsform__body--element.course .element__body').style.height = '0px';
			form.querySelector('.vabsform__body--element.course .element__header--index').classList.add('success');
			setTimeout(() => {
				form.querySelector('.vabsform__body--element.user .element__body').style.height = form.querySelector('.vabsform__body--element.user .element__body').scrollHeight + 'px';
				form.scrollIntoView();
			}, 300);
			return;
		}

		if(this.current === 'user' && this.validation()){
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
	 * @param form
	 */
	showConfirmation(form) {
		form.querySelector('.confirmation__user .name').innerHTML = this.user.firstname + ' ' + this.user.lastname;
		form.querySelector('.confirmation__user .mobile').innerHTML = this.user.mobile;
		form.querySelector('.confirmation__user .email').innerHTML = this.user.email;
		form.querySelector('.confirmation__user .note').innerHTML = this.user.note;
		form.querySelector('.confirmation__travel .arrival').innerHTML = this.humanReadableDate(new Date(this.user.anreise));
		form.querySelector('.confirmation__travel .departure').innerHTML = this.humanReadableDate(new Date(this.user.abreise));
		form.querySelectorAll('.confirmation__course div').forEach((div) => {
			div.remove();
		});
		let total = 0;
		for(let key in this.selectedCourses){
			let course = this.selectedCourses[key];
			const p = parseFloat(course.price.price);
			total += p;
			let div = document.createElement('div');

			let html = '';
			if(course.unit_shortcode === 'h'){
				html += '<span class="coursename">' + course.name + '</span><span class="courseqty">' + course.anzTage + ' Tag(e) á ' + course.qty + ' Stunde(n)</span><span class="courseprice">' + p.toFixed(2) + ' €</span>';
			}else if(course.unit_shortcode === 'd'){
				html += '<span class="coursename">' + course.name + '</span><span class="courseqty">' + course.qty + ' Tag(e) á ' + course.anzStunden + ' Stunde(n)</span><span class="courseprice">' + p.toFixed(2) + ' €</span>';
			}else if(course.unit_shortcode === 'w'){
				html += '<span class="coursename">' + course.name + '</span><span class="courseqty">' + course.qty + ' Woche(n)</span><span class="courseprice">' + p.toFixed(2) + ' €</span>';
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
		if(!this.validation()) {
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