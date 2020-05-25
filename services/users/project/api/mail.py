
# using SendGrid's Python Library
# https://github.com/sendgrid/sendgrid-python
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


def send_mail(to=None, subject='', html_content=''):
    message = Mail(
        from_email='hey@recipe.dog',
        to_emails=to,
        subject=subject,
        html_content=html_content
        )
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
        return response
    except Exception as e:
        print(e.message)
        return e.message
