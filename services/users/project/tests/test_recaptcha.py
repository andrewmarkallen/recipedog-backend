from project.tests.base import BaseTestCase
from project.api.utils import validate_recaptcha

class TestUserService(BaseTestCase):
    """Tests recaptcha service."""

    # We don't test for success, just make sure we get back correct response from server for correct input, including a valid input secret
    def test_response(self):
        response = 'fake-response'
        result = validate_recaptcha(response)
        response = result['captcha_response']
        print(response)
        self.assertEqual(response['success'], False)
        self.assertEqual(response['error-codes'], [
            "invalid-input-response"
            ])
