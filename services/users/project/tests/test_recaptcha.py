from project.tests.base import BaseTestCase
from project.api.utils import validate_recaptcha

class TestUserService(BaseTestCase):
    """Tests recaptcha service."""

    def test_response(self):
        response = 'fake-response'
        result = validate_recaptcha(response)
        response = result['captcha_response']
        self.assertEqual(response['success'], True)
