from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from urllib.parse import urlparse  # Можно убрать, если не используется для валидации

app = Flask(__name__)

# Настройка базы данных
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Убрал функцию is_valid_url, так как убрали поля url/avatar

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(120), unique=True, nullable=False)  # Телефонный номер вместо email
    status = db.Column(db.String(100), nullable=True, default='')    # Статус чата (например, "активен")
    message = db.Column(db.Text, nullable=True, default='')          # Сообщение в чате
    status_user = db.Column(db.String(100), nullable=True, default='')  # Статус пользователя (например, "онлайн")

    def __repr__(self):
        return f'<User {self.number}>'

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/search')
def search():
    query = request.args.get('q', '').strip()
    if query:
        # Ищем по номеру или сообщению
        results = User.query.filter(
            (User.number.ilike(f'%{query}%')) | (User.message.ilike(f'%{query}%'))
        ).all()
        data = []
        for user in results:
            data.append({
                'id': user.id,
                'number': user.number,
                'status': user.status,
                'message': user.message,
                'status_user': user.status_user,
            })
    else:
        data = []
    return jsonify(data)

@app.route('/create_user', methods=['POST'])
def create_user():
    data = request.json or {}
    number = data.get('number')
    status = data.get('status') or ''
    message = data.get('message') or ''
    status_user = data.get('status_user') or ''

    if not number:
        return jsonify({'error': 'Number обязателен'}), 400

    user = User(number=number, status=status, message=message, status_user=status_user)

    if User.query.filter_by(number=number).first():
        return jsonify({'error': 'Пользователь с таким number уже существует'}), 400

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Пользователь создан', 'id': user.id})

# Новый маршрут: отправить/обновить сообщение (обновляет поле message в User)
@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json or {}
    user_id = data.get('user_id')  # ID пользователя
    new_message = data.get('message')
    
    if not user_id or not new_message:
        return jsonify({'error': 'user_id и message обязательны'}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Пользователь не найден'}), 404
    
    user.message = new_message  # Обновляем сообщение
    db.session.commit()
    
    return jsonify({'message': 'Сообщение обновлено', 'id': user.id})

# Новый маршрут: получить чат (все пользователи с их сообщениями)
@app.route('/get_chat')
def get_chat():
    users = User.query.all()  # Или фильтровать по статусу, если нужно
    data = []
    for user in users:
        data.append({
            'id': user.id,
            'number': user.number,
            'status': user.status,
            'message': user.message,
            'status_user': user.status_user,
        })
    return jsonify(data)

@app.route("/LogIn")
def register():
    return render_template("registers.html")

if __name__ == "__main__":
    app.run(host="192.168.1.54", port=5000, debug=True)
