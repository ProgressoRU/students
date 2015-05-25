<?php

namespace App;

/**
 * Pixie dependency container
 *
 * @property-read \PHPixie\DB $db Database module
 * @property-read \PHPixie\ORM $orm ORM module
 */
class Pixie extends \PHPixie\Pixie {

	protected $modules = array(
		'db' => '\PHPixie\DB',
		'orm' => '\PHPixie\ORM'
	);

	protected function after_bootstrap() {
		// Whatever code you want to run after bootstrap is done.

        $this->debug->display_errors = $this->config->get('site.debug') ? true : false;
	}

    public function handle_exception($exception) {
        if ($exception instanceof \Exception) {
            error_log($exception->getMessage());
        }
        parent::handle_exception($exception);
    }

}
