import {
	visitAdminPage,
	createUser,
} from '@wordpress/e2e-test-utils';

describe( 'User Profile', () => {
	it( 'Should not allow new user username as the email address of another profile', async () => {

		// Creates a user `user1@example.com`.
		await createUser('user1');

		await visitAdminPage('user-new.php');
		await page.waitForSelector('#user_login', {
			visible: true
		});
		await page.$eval('#user_login', (el, value) => el.value = value, 'user1@example.com');
		await page.$eval('#email', (el, value) => el.value = value, 'user2@example.com');

		await page.click('#send_user_notification');

		await Promise.all([page.click('#createusersub'), page.waitForNavigation({
			waitUntil: 'networkidle0'
		})]);

		let adminNoticeErrors = await page.waitForSelector('.error');

		expect(
			await adminNoticeErrors.evaluate((element) => element.textContent)
		).toContain('This username is not available. Please choose another one.');
	} );
} );
