import datetime
import jwt

from project import db, bcrypt
from flask import current_app
from sqlalchemy.orm import validates


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), unique=True, nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean, default=True, nullable=False)
    admin = db.Column(db.Boolean, default=False, nullable=False)
    recipes = db.relationship('Recipe', backref='users', lazy=True)

    def __init__(self, username, email, password, admin=False):
        self.username = username
        self.email = email
        self.password = bcrypt.generate_password_hash(
            password,
            current_app.config.get('BCRYPT_LOG_ROUNDS')
            ).decode()
        self.admin = admin

    def to_json(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'active': self.active,
            'admin': self.admin,
        }

    def encode_auth_token(self, user_id):
        """Generates the auth token"""

        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(
                    days=current_app.config.get('TOKEN_EXPIRATION_DAYS'),
                    seconds=current_app.config.get('TOKEN_EXPIRATION_SECONDS')
                    ),
                'iat': datetime.datetime.utcnow(),
                'sub': user_id
            }
            return jwt.encode(
                payload,
                current_app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """Decodes the auth token"""
        try:
            payload = jwt.decode(
                auth_token, current_app.config.get('SECRET_KEY'))
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again'


class Recipe(db.Model):
    __tablename__ = "recipe"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(2048), nullable=False)
    description = db.Column(db.String(65536), nullable=True)
    ingredients = db.Column(db.String(65536), nullable=False)
    method = db.Column(db.String(65536), nullable=False)
    date = db.Column(
        db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    owner = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    url = db.Column(db.String(2048), nullable=True)
    image = db.Column(db.String(255), nullable=True)
    preptime = db.Column(db.Integer, nullable=True)
    cooktime = db.Column(db.Integer, nullable=True)
    serves = db.Column(db.Integer, nullable=True)
    notes = db.Column(db.String(65536), nullable=True)
    favourite = db.Column(db.Boolean, default=True, nullable=True)
    tags = db.relationship("TagMap", back_populates='recipe')

    def __repr__(self):
        return '<Recipe %r>' % self.title

    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'ingredients': self.ingredients,
            'method': self.method,
            'url': self.url,
            'image': self.image,
            'preptime': self.preptime,
            'cooktime': self.cooktime,
            'serves': self.serves,
            'notes': self.notes,
            'favourite': self.favourite,
            'date': self.date
        }

    @validates('preptime')
    def validates_preptime(self, key, field):
        if field == '':
            return None
        else:
            return field

    @validates('cooktime')
    def validates_cooktime(self, key, field):
        if field == '':
            return None
        else:
            return field

    @validates('serves')
    def validates_serves(self, key, field):
        if field == '':
            return None
        else:
            return field

    def addTag(self, name):
        if name != '':
            if name not in [t.tag.name for t in self.tags]:
                with db.session.no_autoflush:
                    tm = TagMap()
                    tag = self.__fetchTag(name)
                    tm.tag = tag
                    self.tags.append(tm)
                    db.session.commit()
                    return tag
        return None

    def __fetchTag(self, name):
        tag = db.session.query(Tag).filter_by(name=name).scalar()
        if tag is not None:
            return tag
        else:
            return Tag(name=name)

    def getTags(self):
        return [t.tag for t in self.tags]

    def deleteTag(self, name):
        if name not in [t.tag.name for t in self.tags]:
            return None
        else:
            [db.session.delete(t) for t in self.tags if t.tag.name == name]
            db.session.commit()
            return name

    def __init__(self, **kwargs):
        tags = map(str.strip, kwargs.pop('tags', '').split(','))

        super().__init__(**kwargs)
        for tag in tags:
            self.addTag(tag)


class Tag(db.Model):
    __tablename__ = "tag"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(2048), nullable=False, unique=True)
    recipes = db.relationship("TagMap", back_populates="tag")

    def getAllRecipes(self):
        return [r.recipe for r in self.recipes]

    def getAllRecipesByUserID(self, id):
        return [r.recipe for r in self.recipes if r.recipe.owner == id]


class TagMap(db.Model):
    __tablename__ = "tagmap"
    recipe_id = db.Column(
        db.Integer, db.ForeignKey('recipe.id'), primary_key=True)
    tag_id = db.Column(
        db.Integer, db.ForeignKey('tag.id'), primary_key=True)
    tag = db.relationship("Tag", back_populates="recipes")
    recipe = db.relationship("Recipe", back_populates="tags")
