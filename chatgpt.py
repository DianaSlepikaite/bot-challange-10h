import os
import sys
import constants
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.agents.agent_types import AgentType

from langchain.agents import create_csv_agent

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

os.environ["OPENAI_API_KEY"] = constants.APIKEY

@app.route('/respond', methods=['POST'])

def respond():
    agent = create_csv_agent(
        OpenAI(temperature=0),
        "ml_project1_data.csv",
        verbose=True,
        agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    )
    question = request.form['question']
    

    result = agent.run(question)
    
    return jsonify({'result': result})

if __name__ == '__main__':
  app.run(debug=True)
