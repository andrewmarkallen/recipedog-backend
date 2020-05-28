import json

from project import db
from project.api.models import User
from project.tests.base import BaseTestCase
from project.tests.utils import add_user, login_user
from flask import current_app
from unittest.mock import patch, Mock


class TestAuthBlueprint(BaseTestCase):

    def mock_validate_recaptcha_factory():
        mock = Mock()
        mock.return_value = {
            'captcha_response': {'success': True}}
        return mock

    @patch('project.api.auth.validate_recaptcha',
           new_callable=mock_validate_recaptcha_factory)
    def test_user_registration(self, mock_validate_recaptcha):
        with self.client:
            response = self.client.post(
                '/auth/register',
                data=json.dumps({
                    'username': 'justatest',
                    'email': 'test@test.com',
                    'password': '123456',
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(mock_validate_recaptcha.called, True)
            self.assertTrue(data['status'] == 'success')
            self.assertTrue(data['message'] == 'Successfully registered')
            self.assertTrue(data['auth_token'])
            self.assertTrue(response.content_type == 'application/json')
            self.assertEqual(response.status_code, 201)

    @patch('project.api.auth.validate_recaptcha',
           new_callable=mock_validate_recaptcha_factory)
    def test_user_registration_duplicate_email(self, mock_validate_recaptcha):
        add_user('test', 'test@test.com', 'test')
        with self.client:
            response = self.client.post(
                '/auth/register',
                data=json.dumps({
                    'username': 'marka',
                    'email': 'test@test.com',
                    'password': '123456',
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn(
                'Sorry, that user already exists.', data['message']
            )
            self.assertIn('fail', data['status'])

    @patch('project.api.auth.validate_recaptcha',
           new_callable=mock_validate_recaptcha_factory)
    def test_user_registration_duplicate_username(
            self, mock_validate_recaptcha):
        add_user('test', 'test@test.com', 'test')
        with self.client:
            response = self.client.post(
                '/auth/register',
                data=json.dumps({
                    'username': 'test',
                    'email': 'test2@test.com',
                    'password': '123456',
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn(
                'Sorry, that user already exists.', data['message']
            )
            self.assertIn('fail', data['status'])

    @patch('project.api.auth.validate_recaptcha',
           new_callable=mock_validate_recaptcha_factory)
    def test_user_registration_invalid_json(self, mock_validate_recaptcha):
        with self.client:
            response = self.client.post(
                'auth/register',
                data=json.dumps({}),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload.', data['message'])
            self.assertIn('fail', data['status'])

    @patch('project.api.auth.validate_recaptcha',
           new_callable=mock_validate_recaptcha_factory)
    def test_user_registration_invalid_json_keys_no_username(
            self, mock_validate_recaptcha):
        with self.client:
            response = self.client.post(
                'auth/register',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test',
                }),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertEqual('Invalid payload.', data['message'])
            self.assertIn('fail', data['status'])

    @patch('project.api.auth.validate_recaptcha',
           new_callable=mock_validate_recaptcha_factory)
    def test_user_registration_invalid_json_keys_no_email(
            self, mock_validate_recaptcha):
        with self.client:
            response = self.client.post(
                'auth/register',
                data=json.dumps({
                    'username': 'justatest',
                    'password': 'test',
                }),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertEqual('Invalid payload.', data['message'])
            self.assertIn('fail', data['status'])

    @patch('project.api.auth.validate_recaptcha',
           new_callable=mock_validate_recaptcha_factory)
    def test_user_registration_invalid_json_keys_no_password(
            self, mock_validate_recaptcha):
        with self.client:
            response = self.client.post(
                'auth/register',
                data=json.dumps({
                    'username': 'justatest',
                    'email': 'test@test.com',
                }),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertEqual('Invalid payload.', data['message'])
            self.assertIn('fail', data['status'])

    @patch('project.api.auth.validate_recaptcha',
           new_callable=mock_validate_recaptcha_factory)
    def test_registered_user_login(self, mock_validate_recaptcha):
        # with self.client:
        add_user('test', 'test@test.com', 'test')
        response = login_user('test@test.com', 'test')
        data = json.loads(response.data.decode())
        self.assertTrue(data['status'] == 'success')
        self.assertTrue(data['message'] == 'Successfully logged in.')
        self.assertTrue(data['auth_token'])
        self.assertTrue(response.content_type == 'application/json')
        self.assertEqual(response.status_code, 200)

    @patch('project.api.auth.validate_recaptcha',
           new_callable=mock_validate_recaptcha_factory)
    def test_not_registered_user_login(self, mock_validate_recaptcha):
        with self.client:
            response = self.client.post(
                '/auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(data['message'] == 'User does not exist.')
            self.assertTrue(response.content_type == 'application/json')
            self.assertEqual(response.status_code, 404)

    @patch('project.api.auth.validate_recaptcha',
           new_callable=mock_validate_recaptcha_factory)
    def test_valid_logout(self, mock_validate_recaptcha):
        with self.client:
            add_user('test', 'test@test.com', 'test')
            resp_login = self.client.post(
                '/auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test',
                }),
                content_type='application/json'
            )
            # valid token logout
            token = json.loads(resp_login.data.decode())['auth_token']
            response = self.client.get(
                '/auth/logout',
                headers={'Authorization': f'Bearer {token}'}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'success')
            self.assertTrue(data['message'] == 'Successfully logged out.')
            self.assertEqual(response.status_code, 200)

    @patch('project.api.auth.validate_recaptcha',
           new_callable=mock_validate_recaptcha_factory)
    def test_invalid_logout_expired_token(self, mock_validate_recaptcha):
        add_user('test', 'test@test.com', 'test')
        current_app.config['TOKEN_EXPIRATION_SECONDS'] = -1
        with self.client:
            resp_login = self.client.post(
                '/auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test',
                }),
                content_type='application/json'
            )
            # invalid token logout
            # time.sleep(4)
            token = json.loads(resp_login.data.decode())['auth_token']
            response = self.client.get(
                '/auth/logout',
                headers={'Authorization': f'Bearer {token}'}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(
                data['message'] == 'Signature expired. Please log in again.'
            )
            self.assertEqual(response.status_code, 401)

    @patch('project.api.auth.validate_recaptcha',
           new_callable=mock_validate_recaptcha_factory)
    def test_invalid_logout(self, mock_validate_recaptcha):
        with self.client:
            response = self.client.get(
                '/auth/logout',
                headers={'Authorization': 'Bearer invalid'}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(
                data['message'] == 'Invalid token. Please log in again'
            )
            self.assertEqual(response.status_code, 401)

    @patch('project.api.auth.validate_recaptcha',
           new_callable=mock_validate_recaptcha_factory)
    def test_user_status(self, mock_validate_recaptcha):
        add_user('test', 'test@test.com', 'test')
        with self.client:
            resp_login = self.client.post(
                'auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json'
            )
            token = json.loads(resp_login.data.decode())['auth_token']
            response = self.client.get(
                '/auth/status',
                headers={'Authorization': f'Bearer {token}'}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'success')
            self.assertTrue(data['data'] is not None)
            self.assertTrue(data['data']['username'] == 'test')
            self.assertTrue(data['data']['email'] == 'test@test.com')
            self.assertTrue(data['data']['active'])
            self.assertFalse(data['data']['admin'])
            self.assertEqual(response.status_code, 200)

    @patch('project.api.auth.validate_recaptcha',
           new_callable=mock_validate_recaptcha_factory)
    def test_invalid_status(self, mock_validate_recaptcha):
        with self.client:
            response = self.client.get(
                '/auth/status',
                headers={'Authorization': 'Bearer invalid'}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(
                data['message'] == 'Invalid token. Please log in again'
            )
            self.assertEqual(response.status_code, 401)

    @patch('project.api.auth.validate_recaptcha',
           new_callable=mock_validate_recaptcha_factory)
    def test_invalid_logout_inactive(self, mock_validate_recaptcha):
        add_user('test', 'test@test.com', 'test')
        # update user
        user = User.query.filter_by(email='test@test.com').first()
        user.active = False
        db.session.commit()
        with self.client:
            resp_login = self.client.post(
                '/auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json'
            )
            token = json.loads(resp_login.data.decode())['auth_token']
            response = self.client.get(
                '/auth/logout',
                headers={'Authorization': f'Bearer {token}'}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(data['message'] == 'Provide a valid auth token.')
            self.assertEqual(response.status_code, 401)

    @patch('project.api.auth.validate_recaptcha',
           new_callable=mock_validate_recaptcha_factory)
    def test_invalid_status_inactive(self, mock_validate_recaptcha):
        add_user('test', 'test@test.com', 'test')
        # update user
        user = User.query.filter_by(email='test@test.com').first()
        user.active = False
        db.session.commit()
        with self.client:
            resp_login = self.client.post(
                '/auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json'
            )
            token = json.loads(resp_login.data.decode())['auth_token']
            response = self.client.get(
                '/auth/status',
                headers={'Authorization': f'Bearer {token}'}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(data['message'] == 'Provide a valid auth token.')
            self.assertEqual(response.status_code,  401)
