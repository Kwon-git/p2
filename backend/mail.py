from flask_mail import Mail, Message
from dotenv import load_dotenv
import os 
mail = Mail()  # mail chưa gắn app, sẽ init sau
load_dotenv()
def init_mail(app):
    mail.init_app(app)

def send_email(to, subject, body):
    msg = Message(subject=subject,
                  recipients=[to],
                  body=body,
                  sender=os.getenv("MAIL_USERNAME"))  # dùng sender từ config
    mail.send(msg)
