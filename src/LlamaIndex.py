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

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    save_path = 'C:\git\ChatGPT\Documentation'  # Replace with your desired save directory
    
    if file:
        filename = file.filename
        file.save(os.path.join(save_path, filename))
        return 'File uploaded successfully'
    
    return 'No file uploaded'

if __name__ == '__main__':
    os.environ['OPENAI_API_KEY'] = "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"

# create a SimpleDirectoryReader object
    reader = SimpleDirectoryReader('C:\git\ChatGPT\Documentation')
    print(reader)

# load data from files
    documents = reader.load_data()
    print(*documents)
    index = GPTVectorStoreIndex.from_documents(documents)
    # index.save_to_disk('index.json')
    # index = GPTVectorStoreIndex.load_from_disk('index.json')
    index.storage_context.persist()

    query_engine = index.as_query_engine()

    app.run(port=5000)


