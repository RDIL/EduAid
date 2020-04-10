import string
import json

from flask import Flask, Response, abort, request
from flask_migrate import Migrate, upgrade
from flask_rest_error_handling import setup_error_handling
from flask_sqlalchemy import SQLAlchemy
from lcpy import true, false
from secrets import choice

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///eduaidapi.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True

db = SQLAlchemy(app)
migrate = Migrate(app, db)

setup_error_handling(app)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    name = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    password = db.Column(db.String(512), nullable=False)
    is_teacher = db.Column(db.Boolean, default=False)
    is_admin = db.Column(db.Boolean, default=False)
    apitoken = db.Column(db.String(256), unique=True)

    def __repr__(self):
        return "<User %r %r %r %r %r>" % (
            self.id,
            self.name,
            self.email,
            self.is_teacher,
            self.is_admin,
        )


class StudentClass(db.Model):
    id = db.Column(db.Integer, primary_key=true, unique=true, nullable=false)
    students = db.Column(db.String(4096), nullable=false, default="")

    def __repr__(self):
        return "<StudentClass %s>" % self.id

    def get_students(self):
        """Get a list of the student IDs in this class."""
        return [int(student) for student in self.students.split("|")]

    def add_student(self, id):
        """Add a student to the list."""
        if self.students == "":
            self.students = id
        else:
            self.students = self.students + "|" + id


@app.route("/payload", methods=["POST"])
def handlePayload():
    dat = json.loads(request.data)
    payload = dat["type"]

    if payload == "PayloadHandshake":
        email = dat.get("em", None)
        pw = dat.get("pw", None)
        if email is None or pw is None:
            abort(401)
        theuser = User.query.filter_by(email=email).first()
        if theuser is None:
            abort(401)
        if theuser.password != pw:
            abort(401)
        theuser.apitoken = generate()
        db.session.commit()
        return Response(
            theuser.apitoken, headers={"Access-Control-Allow-Origin": "*"}
        )
    elif payload == "PayloadGetUserByID":
        if dat.get("apiKey", None) is None:
            abort(401)
        if dat.get("targetId", None) is None:
            abort(401)
        return Response(
            User.query.filter_by(id=dat["targetId"])
            .first()
            .__repr__(),
            headers={"Access-Control-Allow-Origin": "*"},
        )
    elif payload == "PayloadGetSelfUserIsTeacher":
        if dat.get("apiKey", None) is None:
            abort(401)
        return Response(
            str(
                User.query.filter_by(apitoken=dat["apiKey"])
                .first()
                .is_teacher
            ).lower(),
            headers={"Access-Control-Allow-Origin": "*"},
        )
    elif payload == "PayloadGetSelfUser":
        if dat.get("apiKey", None) is None:
            abort(401)
        return Response(
            User.query.filter_by(apitoken=dat["apiKey"])
            .first()
            .__repr__(),
            headers={"Access-Control-Allow-Origin": "*"},
        )


def generate():
    return "".join(
        choice(string.ascii_uppercase + string.digits)
        for i in range(256)
    )


def make_me():
    """A small thing for development."""
    me = User()
    me.id = 1
    me.name = "Reece"
    me.email = "me@rdil.rocks"
    me.password = "TestPassword"
    me.is_admin = True
    me.is_teacher = True
    return me


@app.shell_context_processor
def make_shell_context():
    return dict(
        db=db,
        User=User,
        StudentClass=StudentClass,
        make_me=make_me
    )


@app.cli.command()
def initdb():
    """Creates the database."""

    # migrate database to latest revision
    upgrade()


if __name__ == "__main__":
    # development
    app.run("0.0.0.0", port=5000, debug=True)
