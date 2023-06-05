from flask import Flask, request, jsonify
from llama_index import GPTVectorStoreIndex, Document, SimpleDirectoryReader
import os
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/query/<string:query>', methods=['GET'])
def query(query):
    response = query_engine.query(query)
    return jsonify({'response': response})

if __name__ == '__main__':
    os.environ['OPENAI_API_KEY'] = "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"

    text1 = 'stuff in python'
    text2 = ''':root {
        font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.5;
        font-weight: 400;

        color-scheme: light dark;
        color: rgba(255, 255, 255, 0.87);
        background-color: #242424;

        font-synthesis: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-text-size-adjust: 100%;
        }

        a {
        font-weight: 500;
        color: #646cff;
        text-decoration: inherit;
        }
        a:hover {
        color: #535bf2;
        }

        body {
        margin: 0;
        display: flex;
        place-items: center;
        min-width: 320px;
        min-height: 100vh;
        }

        h1 {
        font-size: 3.2em;
        line-height: 1.1;
        }

        button {
        border-radius: 8px;
        border: 1px solid transparent;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: #1a1a1a;
        cursor: pointer;
        transition: border-color 0.25s;
        }
        button:hover {
        border-color: #646cff;
        }
        button:focus,
        button:focus-visible {
        outline: 4px auto -webkit-focus-ring-color;
        }

        @media (prefers-color-scheme: light) {
        :root {
            color: #213547;
            background-color: #ffffff;
        }
        a:hover {
            color: #747bff;
        }
        button {
            background-color: #f9f9f9;
        }
        }'''

    text_list = [text1, text2]
    documents = [Document(t) for t in text_list]
    index = GPTVectorStoreIndex.from_documents(documents)
    # index.save_to_disk('index.json')
    # index = GPTVectorStoreIndex.load_from_disk('index.json')
    index.storage_context.persist()

    query_engine = index.as_query_engine()

    app.run(port=5000)


