
import pickle
from sklearn.feature_extraction.text import CountVectorizer
from flask import Flask, request, Response
from flask_cors import CORS, cross_origin
from flask import jsonify

model = pickle.load(open('model', 'rb'))
app = Flask(__name__)
CORS(app)

def parse_name(team):
    cv = CountVectorizer()
    cv_fit = cv.fit_transform(team)
    tmp = [cv.vocabulary_.get(name) for name in team]
    sup = 0
    for i in tmp:
        if i is not None:
            sup = i
    tmp = [i if i is not None else sup + 1200 for i in tmp]
    return sorted(tmp)

@app.route('/', methods=['POST'])
def predict():
    data = request.json
    home_team = data['leftTeam']
    away_team = data['rightTeam']
    home_team = parse_name(home_team)
    away_team = parse_name(away_team)
    home_goals = data['leftCountryScore']
    away_goals = data['rightCountryScore']
    feature = home_team + away_team + [home_goals, away_goals]
    result = model.predict([feature])
    return jsonify({'result': str(int(*result))})