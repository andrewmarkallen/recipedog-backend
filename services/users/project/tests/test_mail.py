from project.tests.base import BaseTestCase
from project.api.mail import send_mail


class TestMail(BaseTestCase):

    def test_can_send_email(self):
        response = send_mail(to='allenam@tcd.ie',
                             subject='test suite',
                             html_content='unit test')
        self.assertEqual(response.status_code, 202)
