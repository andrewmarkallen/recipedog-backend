import json

from project.api.models import User
from project import db
from flask import current_app


def add_user(username, email, password):
    user = User(username=username, email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return user


def add_admin(username, email, password):
    user = User(
        username=username, email=email,
        password=password, admin=True)
    db.session.add(user)
    db.session.commit()
    return user


def login_user(email, password):
    with current_app.test_client() as client:
        response = client.post(
            '/auth/login',
            data=json.dumps({
                'email': 'test@test.com',
                'password': 'test',
            }),
            content_type='application/json'
        )
        return response
