<?php

namespace App\Controller;

class Home extends \App\Page {

	public function action_index() {
		$this->view->subview = 'home';
		$this->view->message = 'Have fun coding';
	}

}
