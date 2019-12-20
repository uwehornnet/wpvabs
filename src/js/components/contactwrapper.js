export default class ContactWrapper{
	constructor(url, lang) {
		this.url = url;
		this.lang = lang;
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

		if(!this.user.street){
			return false;
		}

		if(!this.user.number){
			return false;
		}

		if(!this.user.zip_code){
			return false;
		}

		if(!this.user.city){
			return false;
		}

		if(!this.user.note){
			return false;
		}

		return true;
	}

	/**
	 *
	 * @param e
	 * @param form
	 */
	submit(e, form, lang) {
		if(this.validation()){
			this.submitForm(form, lang);
		}
	}

	/**
	 *
	 */
	submitForm(form, lang) {
		form.querySelector('button .text').innerHTML = this.lang['button_success'] ? this.lang['button_success'] : 'Wir haben deine Email erhalten.';
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
					dateFrom: this.user.anreise,
					dateTo: this.user.abreise,
					shorttext: 'Interesse: ',
					longtext: this.user.note,
					lead: true,
				})
			}).then((response) => {
				return response.json();
			}).then((response) => {
                console.log(`create_contact: ${response}`);

				fetch(this.url + '?method=post_interest', {
					method: 'POST',
					body: JSON.stringify({
						contact_id: response.contact_id,
						interest_id: this.user.interest
					})
				}).then(response => {
					return response.json();
				}).then(response => {
                    console.log(`post_interest: ${response}`);
				});

                this.reset(form)
			})
		}
	}

	/**
	 *
	 * @param form
	 */
	reset(form) {
		form.querySelector('button .text').innerHTML = this.lang['button_success'] ? this.lang['button_success'] : 'Wir haben deine Email erhalten.';

		setTimeout(() => {

			this.user = {
				firstname: '',
				lastname: '',
				email: '',
				mobile: '',
				street: '',
				number: '',
				zip_code: '',
				city: '',
				note: '',
				anreise: '',
				abreise: '',
				interest: '',
				validation: false
			};
			this.selectedCourses = {};
			this.current = 'course';

			form.querySelectorAll('button').forEach(button => {
				button.disabled = true;
				button.style.backgroundColor = 'limegreen';
			}).disabled = true;
			form.querySelector('button .loading').style.display = 'none';

		}, 2000);

	}
}